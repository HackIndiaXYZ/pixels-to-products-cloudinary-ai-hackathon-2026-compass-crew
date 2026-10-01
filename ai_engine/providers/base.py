"""
Abstract Base Class for AI Engine Model Providers.
Allows swapping or adding providers (Gemini, OpenAI, Replicate, Mock) seamlessly.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

from ai_engine.models import GenerationResult


class AIProvider(ABC):
    """
    Abstract AI Provider interface.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the provider (e.g. 'gemini', 'openai', 'mock')."""
        pass

    @abstractmethod
    def analyze_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """
        Multimodal visual analysis of an input product image.
        Returns parsed JSON dictionary adhering to analysis schema.
        """
        pass

    @abstractmethod
    def generate_image(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        reference_image_bytes: Optional[bytes] = None,
        aspect_ratio: str = "1:1"
    ) -> GenerationResult:
        """
        Generates or re-renders an image based on the prompt, preserving reference product where supported.
        Returns a GenerationResult with image bytes/url and metadata.
        """
        pass

    @abstractmethod
    def compare_images(
        self,
        original_bytes: bytes,
        generated_bytes: bytes,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """
        Compares original reference image with generated variant image for fidelity and consistency.
        Returns parsed JSON evaluation dictionary.
        """
        pass
