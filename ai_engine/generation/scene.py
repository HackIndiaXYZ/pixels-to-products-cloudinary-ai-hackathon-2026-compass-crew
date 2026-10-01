"""
Scene Generation Module for OmniStage AI.
Places the authentic, unaltered product into tailored commercial environments.
Supported initial archetypes: 'Premium Studio', 'Minimal', 'Lifestyle', 'Urban', 'Luxury'.
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

logger = get_logger("ai_engine.generation.scene")


class SceneGenerator:
    """
    Orchestrates contextual e-commerce scene generation while locking product fidelity.
    """

    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()
        self.image_generator = ImageGenerator(provider=self.provider)
        self.analyzer = ProductAnalyzer(provider=self.provider)

    def generate(
        self,
        image: ImageInputType,
        scene_type: str,
        product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
        brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]] = None,
        target_format: str = "1:1",
        environment_description: Optional[str] = None
    ) -> GenerationResult:
        """
        Stages the product in a commercial scene.

        Args:
            image: Original product image (URL, path, bytes, or PIL Image).
            scene_type: 'Premium Studio', 'Minimal', 'Lifestyle', 'Urban', 'Luxury'.
            product_context: Optional pre-analyzed product context.
            brand_dna: Optional Brand DNA profile.
            target_format: Aspect ratio ('1:1', '4:5', '9:16', '16:9').
            environment_description: Optional custom backdrop nuances.

        Returns:
            GenerationResult: Staged scene image result with metadata.
        """
        logger.info(f"SceneGenerator: Generating '{scene_type}' scene in '{target_format}' format.")
        pil_img, raw_bytes, mime_type = load_image(image)

        # 1. Product Context
        if product_context is None:
            logger.info("SceneGenerator: Running automatic product analysis.")
            product_context = self.analyzer.analyze(image)
        elif isinstance(product_context, dict):
            product_context = ProductAnalysisResult.model_validate(product_context)

        # 2. Format
        format_spec = get_format_config(target_format)

        # 3. Prompt Builder
        prompts = OmniStagePromptBuilder.build_scene_prompt(
            scene_type=scene_type,
            product_context=product_context,
            brand_dna=brand_dna,
            format_spec=format_spec,
            environment_description=environment_description
        )

        # 4. Dispatch Generation
        result = self.image_generator.generate(
            prompt=prompts["prompt"],
            negative_prompt=prompts.get("negative_prompt"),
            reference_image_bytes=raw_bytes,
            aspect_ratio=format_spec.aspect_ratio
        )

        result.metadata.update({
            "variant_type": "scene",
            "scene_type": scene_type,
            "category": product_context.category
        })
        logger.info(f"SceneGenerator: Successfully staged '{scene_type}' scene.")
        return result


def generate_scene(
    image: ImageInputType,
    scene_type: str,
    product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
    brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]] = None,
    target_format: str = "1:1",
    provider: Optional[AIProvider] = None
) -> GenerationResult:
    """
    Standard interface for backend engineers to generate a product scene.

    Example:
        result = generate_scene(
            image="https://res.cloudinary.com/.../watch.jpg",
            scene_type="Luxury",
            product_context=cached_analysis,
            brand_dna={"brand_name": "AURA", "aesthetic": "High Luxury"}
        )
    """
    generator = SceneGenerator(provider=provider)
    return generator.generate(
        image=image,
        scene_type=scene_type,
        product_context=product_context,
        brand_dna=brand_dna,
        target_format=target_format
    )
