"""
Product Analyzer Module for OmniStage AI.
Reverse-engineers product image into structured visual and structural attributes.
"""
from __future__ import annotations

from typing import Optional, Union, Dict, Any
from pathlib import Path
from PIL import Image

from ai_engine.exceptions import ModelResponseError, AIEngineError
from ai_engine.models import ProductAnalysisResult
from ai_engine.prompts.analysis_prompts import (
    PRODUCT_ANALYSIS_SYSTEM_PROMPT,
    PRODUCT_ANALYSIS_USER_PROMPT
)
from ai_engine.providers.base import AIProvider
from ai_engine.providers.factory import get_ai_provider
from ai_engine.utils.image_utils import load_image, ImageInputType
from ai_engine.utils.logger import get_logger

logger = get_logger("ai_engine.vision.analyzer")


class ProductAnalyzer:
    """
    Analyzes product images and extracts structured attributes.
    """

    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    def analyze(self, image: ImageInputType) -> ProductAnalysisResult:
        """
        Executes multimodal analysis on a product photo.

        Args:
            image: URL string, local file path, raw bytes, or PIL Image.

        Returns:
            ProductAnalysisResult: Strongly typed schema with category, materials,
                                  components, and critical preservation details.
        """
        logger.info(f"ProductAnalyzer: Commencing analysis using provider '{self.provider.provider_name}'")
        pil_img, raw_bytes, mime_type = load_image(image)

        try:
            raw_data = self.provider.analyze_image(
                image_bytes=raw_bytes,
                mime_type=mime_type,
                system_prompt=PRODUCT_ANALYSIS_SYSTEM_PROMPT,
                user_prompt=PRODUCT_ANALYSIS_USER_PROMPT
            )
            
            # Validate through Pydantic
            result = ProductAnalysisResult.model_validate(raw_data)
            logger.info(
                f"ProductAnalyzer: Successfully identified category '{result.category}' "
                f"with {len(result.components)} components and {len(result.important_details)} preservation details."
            )
            return result

        except Exception as exc:
            if isinstance(exc, AIEngineError):
                raise
            logger.error(f"ProductAnalyzer failed during schema validation or analysis: {str(exc)}")
            raise ModelResponseError(f"Failed to extract structured product analysis: {str(exc)}") from exc


def analyze_product(
    image: ImageInputType,
    provider: Optional[AIProvider] = None
) -> ProductAnalysisResult:
    """
    Functional entry point for backend engineers to analyze a product image.

    Example:
        result = analyze_product("https://res.cloudinary.com/.../shoe.jpg")
        print(result.category, result.primary_color, result.important_details)
    """
    analyzer = ProductAnalyzer(provider=provider)
    return analyzer.analyze(image)
