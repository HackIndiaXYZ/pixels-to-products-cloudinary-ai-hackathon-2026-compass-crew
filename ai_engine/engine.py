"""
OmniStage AI Engine Facade.
Provides a unified, state-of-the-art entry point for all AI capabilities.
"""
from __future__ import annotations

from typing import Optional, Union, Dict, Any

from ai_engine.models import (
    ProductAnalysisResult,
    BrandDNA,
    BrandInstructions,
    GenerationResult,
    ConsistencyValidationResult,
    FormatSpec
)
from ai_engine.vision.analyzer import ProductAnalyzer, analyze_product
from ai_engine.brand.brand_dna import BrandDNAManager, build_brand_instructions
from ai_engine.generation.colorway import ColorwayGenerator, generate_colorway
from ai_engine.generation.scene import SceneGenerator, generate_scene
from ai_engine.generation.formats import get_format_config, FORMAT_SPECS
from ai_engine.consistency.validator import ConsistencyValidator, check_product_consistency
from ai_engine.providers.base import AIProvider
from ai_engine.providers.factory import get_ai_provider
from ai_engine.utils.image_utils import ImageInputType


class AIEngine:
    """
    Unified OmniStage AI Engine Facade.
    Connects Product Analysis, Brand DNA, Colorway Synthesis,
    Scene Staging, and Consistency Validation into a coherent interface.
    """

    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()
        self.analyzer = ProductAnalyzer(provider=self.provider)
        self.colorway_generator = ColorwayGenerator(provider=self.provider)
        self.scene_generator = SceneGenerator(provider=self.provider)
        self.consistency_validator = ConsistencyValidator(provider=self.provider)

    def analyze_product(self, image: ImageInputType) -> ProductAnalysisResult:
        """Analyze product image and extract structured attributes."""
        return self.analyzer.analyze(image)

    def build_brand_instructions(self, brand_dna: Union[BrandDNA, Dict[str, Any]]) -> BrandInstructions:
        """Interpret and compile Brand DNA into prompt directives."""
        return BrandDNAManager.build_instructions(brand_dna)

    def generate_colorway(
        self,
        image: ImageInputType,
        target_color: str,
        product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
        brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]] = None,
        target_format: str = "1:1"
    ) -> GenerationResult:
        """Synthesize colorway variant preserving product geometry."""
        return self.colorway_generator.generate(
            image=image,
            target_color=target_color,
            product_context=product_context,
            brand_dna=brand_dna,
            target_format=target_format
        )

    def generate_scene(
        self,
        image: ImageInputType,
        scene_type: str,
        product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
        brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]] = None,
        target_format: str = "1:1"
    ) -> GenerationResult:
        """Stage unaltered product in commercial scene."""
        return self.scene_generator.generate(
            image=image,
            scene_type=scene_type,
            product_context=product_context,
            brand_dna=brand_dna,
            target_format=target_format
        )

    def check_product_consistency(
        self,
        original_image: ImageInputType,
        generated_image: ImageInputType,
        product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None
    ) -> ConsistencyValidationResult:
        """Verify fidelity between canonical reference and generated variant."""
        return self.consistency_validator.validate(
            original_image=original_image,
            generated_image=generated_image,
            product_context=product_context
        )

    @staticmethod
    def get_format_config(aspect_ratio: str) -> FormatSpec:
        """Retrieve format requirements for aspect ratio."""
        return get_format_config(aspect_ratio)
