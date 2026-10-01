"""
OpenAI Provider implementation for OmniStage AI.
Provides alternative vision analysis (GPT-4o) and image generation (DALL-E-3).
"""
from __future__ import annotations

import base64
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
from ai_engine.utils.logger import get_logger

logger = get_logger("ai_engine.providers.openai")


def _clean_json_text(raw_text: str) -> str:
    text = raw_text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1).strip()
    return text


class OpenAIProvider(AIProvider):
    """
    OpenAI Provider implementing AIProvider ABC.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        vision_model: Optional[str] = None,
        image_model: Optional[str] = None
    ):
        self.api_key = api_key or settings.OPENAI_API_KEY
        if not self.api_key:
            raise MissingAPIKeyError("OPENAI_API_KEY is not configured or provided.")

        self.vision_model = vision_model or settings.OPENAI_VISION_MODEL
        self.image_model = image_model or settings.OPENAI_IMAGE_MODEL

        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=self.api_key, timeout=settings.TIMEOUT_SECONDS)
        except Exception as exc:
            raise ProviderError(f"Failed to initialize OpenAI Client: {str(exc)}") from exc

    @property
    def provider_name(self) -> str:
        return "openai"

    def analyze_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """Multimodal image analysis using GPT-4o with structured JSON."""
        logger.info(f"OpenAIProvider: Analyzing image with {self.vision_model}")
        try:
            b64_img = base64.b64encode(image_bytes).decode("utf-8")
            data_url = f"data:{mime_type};base64,{b64_img}"

            response = self.client.chat.completions.create(
                model=self.vision_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": user_prompt},
                            {"type": "image_url", "image_url": {"url": data_url, "detail": "high"}}
                        ]
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.2
            )

            raw_content = response.choices[0].message.content or ""
            return json.loads(_clean_json_text(raw_content))

        except Exception as exc:
            err_msg = str(exc)
            logger.error(f"OpenAI analysis failure: {err_msg}")
            if "rate_limit" in err_msg.lower():
                raise RateLimitError(f"OpenAI Rate limit exceeded: {err_msg}") from exc
            raise ProviderError(f"OpenAI error during analysis: {err_msg}") from exc

    def generate_image(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        reference_image_bytes: Optional[bytes] = None,
        aspect_ratio: str = "1:1"
    ) -> GenerationResult:
        """Generates image using DALL-E 3."""
        logger.info(f"OpenAIProvider: Generating image with {self.image_model}")
        try:
            # DALL-E 3 sizes: 1024x1024 (1:1), 1024x1792 (9:16 portrait), 1792x1024 (16:9 landscape)
            if aspect_ratio in ("9:16", "4:5"):
                size = "1024x1792"
            elif aspect_ratio == "16:9":
                size = "1792x1024"
            else:
                size = "1024x1024"

            response = self.client.images.generate(
                model=self.image_model,
                prompt=prompt,
                size=size,
                quality="standard",
                n=1,
                response_format="b64_json"
            )

            b64_data = response.data[0].b64_json
            raw_bytes = base64.b64decode(b64_data)
            data_uri = f"data:image/png;base64,{b64_data}"

            return GenerationResult(
                image_bytes=raw_bytes,
                image_base64=data_uri,
                image_url=response.data[0].url,
                prompt_used=prompt,
                negative_prompt_used=negative_prompt,
                provider="openai",
                model=self.image_model,
                metadata={"size": size, "aspect_ratio": aspect_ratio}
            )

        except Exception as exc:
            err_msg = str(exc)
            logger.error(f"OpenAI generation error: {err_msg}")
            raise GenerationError(f"Failed to generate image via OpenAI: {err_msg}") from exc

    def compare_images(
        self,
        original_bytes: bytes,
        generated_bytes: bytes,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """Dual-image comparative consistency inspection with GPT-4o."""
        logger.info("OpenAIProvider: Comparative consistency check with GPT-4o.")
        try:
            b64_1 = base64.b64encode(original_bytes).decode("utf-8")
            b64_2 = base64.b64encode(generated_bytes).decode("utf-8")

            response = self.client.chat.completions.create(
                model=self.vision_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "IMAGE 1 (Original Product Reference):"},
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64_1}"}},
                            {"type": "text", "text": "IMAGE 2 (Generated Product Variant):"},
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64_2}"}},
                            {"type": "text", "text": user_prompt}
                        ]
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )

            raw_content = response.choices[0].message.content or ""
            return json.loads(_clean_json_text(raw_content))

        except Exception as exc:
            logger.error(f"OpenAI comparison error: {str(exc)}")
            raise ProviderError(f"OpenAI comparative check failed: {str(exc)}") from exc
