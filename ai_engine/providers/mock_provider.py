"""
Deterministic Mock AI Provider for offline testing, local CI, and development fallback.
"""
from __future__ import annotations

import io
import json
from typing import Optional, Dict, Any
from PIL import Image, ImageDraw, ImageFont

from ai_engine.providers.base import AIProvider
from ai_engine.models import GenerationResult
from ai_engine.utils.image_utils import create_solid_color_image, encode_image_to_base64


class MockAIProvider(AIProvider):
    """
    Mock AI Provider returning realistic e-commerce product analysis, generated images,
    and consistency evaluation without requiring live external network access.
    """

    @property
    def provider_name(self) -> str:
        return "mock"

    def analyze_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """Returns realistic structured product analysis."""
        return {
            "category": "Sneaker",
            "subcategory": "Lifestyle Running Sneaker",
            "primary_color": "Navy Blue",
            "secondary_colors": ["White", "Silver"],
            "material": "Engineered Breathable Mesh with Synthetic Leather Overlays",
            "components": [
                "laces",
                "eyelets",
                "tongue",
                "midsole",
                "outsole",
                "heel counter",
                "side logo badge",
                "stitching"
            ],
            "orientation": "three-quarter",
            "background": "plain seamless studio white",
            "product_position": "center",
            "important_details": [
                "side emblem logo geometry",
                "segmented honeycomb midsole structure",
                "double-stitch line along the toe box",
                "perforated upper ventilation texture"
            ],
            "visual_attributes": {
                "finish": "matte with subtle gloss accents",
                "texture": "perforated woven mesh",
                "reflectivity": "low"
            },
            "confidence": {
                "category": 0.98,
                "primary_color": 0.96,
                "material": 0.94,
                "components": 0.95,
                "overall": 0.96
            }
        }

    def generate_image(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        reference_image_bytes: Optional[bytes] = None,
        aspect_ratio: str = "1:1"
    ) -> GenerationResult:
        """
        Creates a mock generated image depicting product preservation with new color or scene.
        """
        dim_map = {
            "1:1": (1024, 1024),
            "4:5": (800, 1000),
            "9:16": (576, 1024),
            "16:9": (1024, 576)
        }
        width, height = dim_map.get(aspect_ratio, (1024, 1024))
        
        # Create a visually pleasing mock product image
        img = Image.new("RGB", (width, height), color=(245, 246, 248))
        draw = ImageDraw.Draw(img)

        # Draw a simulated podium and sneaker silhouette
        podium_y = int(height * 0.7)
        draw.ellipse([int(width * 0.2), podium_y, int(width * 0.8), podium_y + int(height * 0.15)], fill=(220, 224, 230))
        
        # Product bounding box
        prod_box = [int(width * 0.25), int(height * 0.35), int(width * 0.75), int(height * 0.68)]
        draw.rounded_rectangle(prod_box, radius=20, fill=(30, 45, 80), outline=(200, 160, 40), width=4)
        
        # Text label
        label = "OmniStage AI [Mock Preview]"
        draw.text((int(width * 0.3), int(height * 0.5)), label, fill=(255, 255, 255))

        buf = io.BytesIO()
        img.save(buf, format="PNG")
        raw_bytes = buf.getvalue()

        return GenerationResult(
            image_bytes=raw_bytes,
            image_base64=encode_image_to_base64(raw_bytes, "image/png"),
            image_url=None,
            prompt_used=prompt,
            negative_prompt_used=negative_prompt,
            provider="mock",
            model="omnistage-mock-v1",
            metadata={
                "aspect_ratio": aspect_ratio,
                "width": width,
                "height": height,
                "simulated": True
            }
        )

    def compare_images(
        self,
        original_bytes: bytes,
        generated_bytes: bytes,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """Returns realistic mock consistency check output."""
        return {
            "is_consistent": True,
            "score": 0.94,
            "issues": [],
            "changed_attributes": ["primary_color"],
            "passed_checks": [
                "shape_and_silhouette",
                "branding_and_logo",
                "component_integrity",
                "stitching_quality",
                "material_authenticity"
            ],
            "details": {
                "silhouette_score": 0.97,
                "branding_score": 0.95,
                "component_score": 0.93,
                "material_score": 0.92
            }
        }
