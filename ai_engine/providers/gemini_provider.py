"""
Gemini AI Provider implementation using the official Google GenAI SDK.
Supports multimodal product analysis, comparative consistency validation,
and high-fidelity generative imagery.
"""
from __future__ import annotations

import json
import re
from typing import Optional, Dict, Any

from ai_engine.config import settings
from ai_engine.exceptions import (
    MissingAPIKeyError,
    ProviderError,
    ModelResponseError,
    GenerationError,
    RateLimitError,
    TimeoutError
)
from ai_engine.models import GenerationResult
from ai_engine.providers.base import AIProvider
from ai_engine.utils.image_utils import encode_image_to_base64
from ai_engine.utils.logger import get_logger

logger = get_logger("ai_engine.providers.gemini")


def _clean_json_text(raw_text: str) -> str:
    """Removes markdown code block formatting and cleans JSON string."""
    text = raw_text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1).strip()
    return text


class GeminiProvider(AIProvider):
    """
    Google Gemini Provider for OmniStage AI.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        vision_model: Optional[str] = None,
        image_model: Optional[str] = None
    ):
        self.api_key = api_key or settings.GEMINI_API_KEY
        if not self.api_key:
            raise MissingAPIKeyError("GEMINI_API_KEY is not configured or provided.")

        self.vision_model = vision_model or settings.GEMINI_VISION_MODEL
        self.image_model = image_model or settings.GEMINI_IMAGE_MODEL

        # Initialize official google-genai client
        try:
            from google import genai
            self.client = genai.Client(api_key=self.api_key)
        except Exception as exc:
            raise ProviderError(f"Failed to initialize Google GenAI Client: {str(exc)}") from exc

    @property
    def provider_name(self) -> str:
        return "gemini"

    def analyze_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """
        Multimodal visual reverse engineering of product features into structured JSON.
        """
        from google.genai import types

        logger.info(f"GeminiProvider: Analyzing image with model {self.vision_model}")
        try:
            image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            config = types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                temperature=0.2,
            )
            response = self.client.models.generate_content(
                model=self.vision_model,
                contents=[image_part, user_prompt],
                config=config
            )

            if not response or not response.text:
                raise ModelResponseError("Gemini returned an empty response during image analysis.")

            cleaned = _clean_json_text(response.text)
            data = json.loads(cleaned)
            logger.info("GeminiProvider: Analysis successfully parsed into JSON.")
            return data

        except json.JSONDecodeError as exc:
            logger.error(f"Failed to decode JSON from Gemini: {str(exc)}")
            raise ModelResponseError(f"Malformed JSON from Gemini: {str(exc)}") from exc
        except Exception as exc:
            err_msg = str(exc)
            logger.error(f"Gemini analysis error: {err_msg}")
            if "ResourceExhausted" in err_msg or "rate limit" in err_msg.lower():
                raise RateLimitError(f"Gemini API rate limit exceeded: {err_msg}") from exc
            if "DeadlineExceeded" in err_msg or "timeout" in err_msg.lower():
                raise TimeoutError(f"Gemini API call timed out: {err_msg}") from exc
            raise ProviderError(f"Gemini API error during analysis: {err_msg}") from exc

    def generate_image(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        reference_image_bytes: Optional[bytes] = None,
        aspect_ratio: str = "1:1"
    ) -> GenerationResult:
        """
        Generates product imagery using Google Imagen.
        """
        from google.genai import types

        logger.info(f"GeminiProvider: Generating image with model {self.image_model} (aspect ratio: {aspect_ratio})")
        try:
            # Map standard aspect ratios to Imagen supported values
            # Imagen supports: "1:1", "3:4", "4:3", "9:16", "16:9"
            ar_map = {
                "1:1": "1:1",
                "4:5": "3:4",  # Closest standard Imagen ratio
                "9:16": "9:16",
                "16:9": "16:9"
            }
            imagen_ar = ar_map.get(aspect_ratio, "1:1")

            config = types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio=imagen_ar,
                output_mime_type="image/png"
            )

            response = self.client.models.generate_images(
                model=self.image_model,
                prompt=prompt,
                config=config
            )

            if not response.generated_images:
                raise GenerationError("Google Imagen returned no generated images.")

            gen_img = response.generated_images[0]
            raw_bytes = gen_img.image.image_bytes

            return GenerationResult(
                image_bytes=raw_bytes,
                image_base64=encode_image_to_base64(raw_bytes, "image/png"),
                image_url=None,
                prompt_used=prompt,
                negative_prompt_used=negative_prompt,
                provider="gemini",
                model=self.image_model,
                metadata={
                    "aspect_ratio": aspect_ratio,
                    "imagen_aspect_ratio": imagen_ar
                }
            )
        except Exception as exc:
            err_msg = str(exc)
            logger.error(f"Gemini image generation failure: {err_msg}")
            raise GenerationError(f"Failed to generate image via Gemini/Imagen: {err_msg}") from exc

    def compare_images(
        self,
        original_bytes: bytes,
        generated_bytes: bytes,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """
        Side-by-side comparative inspection between original reference and generated image.
        """
        from google.genai import types

        logger.info("GeminiProvider: Performing dual-image comparative fidelity check.")
        try:
            part1 = types.Part.from_bytes(data=original_bytes, mime_type="image/png")
            part2 = types.Part.from_bytes(data=generated_bytes, mime_type="image/png")

            config = types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                temperature=0.1
            )

            response = self.client.models.generate_content(
                model=self.vision_model,
                contents=[
                    "IMAGE 1 (Original Product Reference):",
                    part1,
                    "IMAGE 2 (Generated Product Variant):",
                    part2,
                    user_prompt
                ],
                config=config
            )

            if not response or not response.text:
                raise ModelResponseError("Gemini returned empty response during consistency validation.")

            cleaned = _clean_json_text(response.text)
            data = json.loads(cleaned)
            logger.info(f"GeminiProvider: Consistency check result - Score: {data.get('score')}")
            return data

        except Exception as exc:
            logger.error(f"Gemini comparison error: {str(exc)}")
            raise ProviderError(f"Gemini comparative consistency validation error: {str(exc)}") from exc
