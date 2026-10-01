"""
Unit tests for Colorway Generation pipeline.
"""
import pytest
from ai_engine.generation.colorway import ColorwayGenerator, generate_colorway
from ai_engine.models import GenerationResult


def test_colorway_generation_flow(mock_provider, sample_pil_image, sample_product_analysis, sample_brand_dna):
    """Test generating a colorway variant."""
    generator = ColorwayGenerator(provider=mock_provider)
    result = generator.generate(
        image=sample_pil_image,
        target_color="Olive Green",
        product_context=sample_product_analysis,
        brand_dna=sample_brand_dna,
        target_format="4:5"
    )

    assert isinstance(result, GenerationResult)
    assert result.image_bytes is not None
    assert result.image_base64 is not None
    assert result.metadata["target_color"] == "Olive Green"
    assert result.metadata["variant_type"] == "colorway"
    assert "Olive Green" in result.prompt_used


def test_colorway_generation_functional_api(mock_provider, sample_image_bytes):
    """Test the standalone generate_colorway functional interface."""
    result = generate_colorway(
        image=sample_image_bytes,
        target_color="Electric Cobalt",
        provider=mock_provider
    )
    assert isinstance(result, GenerationResult)
    assert result.metadata["target_color"] == "Electric Cobalt"
