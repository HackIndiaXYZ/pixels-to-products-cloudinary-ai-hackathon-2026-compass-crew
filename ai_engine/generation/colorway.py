"""
Colorway Variant Generation Module for OmniStage AI.
Generates new product colorways while rigorously safeguarding product geometry, logos,
stitching, textures, and brand authenticity.
"""
from __future__ import annotations

from typing import Optional, Union, Dict, Any

from ai_engine.models import (
    ProductAnalysisResult,
    BrandDNA,
    GenerationResult
)
from ai_engine.vision.analyzer import ProductAnalyzer
from ai_engine.brand.prompt_builder import OmniStagePromptBuilder
from ai_engine.generation.formats import get_format_config
from ai_engine.generation.generator import ImageGenerator
from ai_engine.providers.base import AIProvider
from ai_engine.providers.factory import get_ai_provider
from ai_engine.utils.image_utils import load_image, ImageInputType
from ai_engine.utils.logger import get_logger

logger = get_logger("ai_engine.generation.colorway")


class ColorwayGenerator:
    """
    Orchestrates high-fidelity colorway variant synthesis.
    """

    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()
        self.image_generator = ImageGenerator(provider=self.provider)
        self.analyzer = ProductAnalyzer(provider=self.provider)

    def generate(
        self,
        image: ImageInputType,
        target_color: str,
        product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
        brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]] = None,
        target_format: str = "1:1",
        additional_instructions: Optional[str] = None
    ) -> GenerationResult:
        """
        Generates a new colorway variant for the product.

        Args:
            image: Original product image (URL, local path, bytes, or PIL Image).
            target_color: Target colorway name (e.g. 'Crimson Red', 'Triple Black').
            product_context: Pre-computed analysis; if None, runs analysis automatically.
            brand_dna: Optional Brand DNA profile.
            target_format: Target aspect ratio ('1:1', '4:5', '9:16', '16:9').
            additional_instructions: Optional specific coloring constraints.

        Returns:
            GenerationResult: Generated image bytes/url, prompts used, and metadata.
        """
        logger.info(f"ColorwayGenerator: Generating '{target_color}' colorway in '{target_format}' format.")
        pil_img, raw_bytes, mime_type = load_image(image)

        # 1. Ensure product context is available
        if product_context is None:
            logger.info("ColorwayGenerator: Product context not provided; analyzing product image on-the-fly.")
            product_context = self.analyzer.analyze(image)
        elif isinstance(product_context, dict):
            product_context = ProductAnalysisResult.model_validate(product_context)

        # 2. Resolve format configuration
        format_spec = get_format_config(target_format)

        # 3. Assemble prompt with strict preservation guardrails
        prompts = OmniStagePromptBuilder.build_colorway_prompt(
            target_color=target_color,
            product_context=product_context,
            brand_dna=brand_dna,
            format_spec=format_spec,
            additional_instructions=additional_instructions
        )

        # 4. Dispatch generation request
        result = self.image_generator.generate(
            prompt=prompts["prompt"],
            negative_prompt=prompts.get("negative_prompt"),
            reference_image_bytes=raw_bytes,
            aspect_ratio=format_spec.aspect_ratio
        )

        result.metadata.update({
            "variant_type": "colorway",
            "target_color": target_color,
            "original_color": product_context.primary_color,
            "category": product_context.category
        })
        logger.info(f"ColorwayGenerator: Successfully generated '{target_color}' variant.")
        return result


def generate_colorway(
    image: ImageInputType,
    target_color: str,
    product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
    brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]] = None,
    target_format: str = "1:1",
    provider: Optional[AIProvider] = None
) -> GenerationResult:
    """
    Standard interface for backend engineers to generate a colorway variant.

    Example:
        result = generate_colorway(
            image="https://res.cloudinary.com/.../shoe.jpg",
            target_color="Crimson Red",
            product_context=cached_analysis,
            brand_dna={"brand_name": "LUXORA", "aesthetic": "Minimalist Luxury"}
        )
    """
    generator = ColorwayGenerator(provider=provider)
    return generator.generate(
        image=image,
        target_color=target_color,
        product_context=product_context,
        brand_dna=brand_dna,
        target_format=target_format
    )
