"""
Core Image Generator Orchestrator for OmniStage AI.
"""
from __future__ import annotations

from typing import Optional
from ai_engine.models import GenerationResult
from ai_engine.providers.base import AIProvider
from ai_engine.providers.factory import get_ai_provider
from ai_engine.utils.logger import get_logger

logger = get_logger("ai_engine.generation.generator")


class ImageGenerator:
    """
    Coordinates prompt dispatch to provider image generation models.
    """

    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    def generate(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        reference_image_bytes: Optional[bytes] = None,
        aspect_ratio: str = "1:1"
    ) -> GenerationResult:
        """Dispatches generation request to provider."""
        logger.info(f"ImageGenerator: Executing generation via provider '{self.provider.provider_name}'")
        return self.provider.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            reference_image_bytes=reference_image_bytes,
            aspect_ratio=aspect_ratio
        )
