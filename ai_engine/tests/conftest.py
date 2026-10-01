"""
Pytest configuration and fixtures for ai_engine test suite.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

# Add project root to sys.path
workspace_root = str(Path(__file__).resolve().parent.parent.parent)
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

import io
import pytest
from PIL import Image

from ai_engine.models import (
    ProductAnalysisResult,
    BrandDNA,
    FormatSpec
)
from ai_engine.providers.mock_provider import MockAIProvider
from ai_engine.engine import AIEngine


@pytest.fixture
def mock_provider() -> MockAIProvider:
    return MockAIProvider()


@pytest.fixture
def ai_engine_instance(mock_provider) -> AIEngine:
    return AIEngine(provider=mock_provider)


@pytest.fixture
def sample_pil_image() -> Image.Image:
    """Creates a sample test PIL image."""
    return Image.new("RGB", (256, 256), color=(40, 60, 120))


@pytest.fixture
def sample_image_bytes(sample_pil_image) -> bytes:
    """Creates sample PNG bytes."""
    buf = io.BytesIO()
    sample_pil_image.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_brand_dna() -> BrandDNA:
    return BrandDNA(
        brand_name="LUXORA",
        aesthetic="Minimalist Luxury",
        primary_color="#0B1F3A",
        accent_color="#C9A227",
        lighting="Soft Studio",
        background_style="Premium Neutral",
        mood="Elegant",
        custom_guidelines=["Never use harsh primary backdrops", "Keep metal trim visible"]
    )


@pytest.fixture
def sample_product_analysis() -> ProductAnalysisResult:
    return ProductAnalysisResult(
        category="Sneaker",
        subcategory="Lifestyle Sneaker",
        primary_color="Navy",
        secondary_colors=["White", "Gold"],
        material="Synthetic Nubuck",
        components=["laces", "sole", "logo", "stitching", "heel tab"],
        orientation="three-quarter",
        background="plain white",
        product_position="center",
        important_details=["gold emblem logo", "contoured gum sole", "contrast toe stitching"],
        visual_attributes={"finish": "matte", "texture": "fine grain"},
        confidence={"category": 0.98, "overall": 0.95}
    )
