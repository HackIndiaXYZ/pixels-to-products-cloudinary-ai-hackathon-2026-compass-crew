"""
Contract verification test ensuring the FastAPI backend engineer can consume
ai_engine exactly as documented in the Master Prompt.
"""
from ai_engine import (
    analyze_product,
    build_brand_instructions,
    generate_colorway,
    generate_scene,
    check_product_consistency,
    get_format_config,
    FORMAT_SPECS,
    ProductAnalysisResult,
    BrandInstructions,
    GenerationResult,
    ConsistencyValidationResult
)


def test_backend_contract_analyze_product(sample_image_bytes, mock_provider):
    """Verifies analyze_product interface."""
    analysis = analyze_product(sample_image_bytes, provider=mock_provider)
    assert isinstance(analysis, ProductAnalysisResult)
    # Backend can serialize to dict for storing in product.ai_metadata (JSON column)
    meta_dict = analysis.model_dump()
    assert isinstance(meta_dict, dict)
    assert meta_dict["category"] == "Sneaker"
    assert "components" in meta_dict
    assert "important_details" in meta_dict


def test_backend_contract_build_brand_instructions():
    """Verifies build_brand_instructions with raw dict matching Brand DB model."""
    raw_brand = {
        "brand_name": "LUXORA",
        "aesthetic": "Minimalist Luxury",
        "primary_color": "#0B1F3A",
        "accent_color": "#C9A227",
        "lighting": "Soft Studio",
        "background_style": "Premium Neutral",
        "mood": "Elegant"
    }
    instructions = build_brand_instructions(raw_brand)
    assert isinstance(instructions, BrandInstructions)
    assert instructions.brand_name == "LUXORA"
    assert len(instructions.prompt_snippet) > 0


def test_backend_contract_generate_colorway(sample_image_bytes, mock_provider):
    """Verifies generate_colorway interface with raw dicts and strings."""
    raw_product_context = {
        "category": "Sneaker",
        "primary_color": "Navy",
        "material": "Synthetic",
        "components": ["laces", "sole", "logo"],
        "important_details": ["logo", "sole"]
    }
    raw_brand = {"brand_name": "LUXORA", "aesthetic": "Minimalist"}

    result = generate_colorway(
        image=sample_image_bytes,
        target_color="Crimson Red",
        product_context=raw_product_context,
        brand_dna=raw_brand,
        target_format="1:1",
        provider=mock_provider
    )
    assert isinstance(result, GenerationResult)
    assert result.image_bytes is not None
    assert result.metadata["target_color"] == "Crimson Red"


def test_backend_contract_generate_scene(sample_image_bytes, mock_provider):
    """Verifies generate_scene interface with scene archetype."""
    result = generate_scene(
        image=sample_image_bytes,
        scene_type="Premium Studio",
        target_format="16:9",
        provider=mock_provider
    )
    assert isinstance(result, GenerationResult)
    assert result.metadata["scene_type"] == "Premium Studio"
    assert result.metadata["aspect_ratio"] == "16:9"


def test_backend_contract_check_product_consistency(sample_image_bytes, mock_provider):
    """Verifies check_product_consistency interface."""
    verdict = check_product_consistency(
        original_image=sample_image_bytes,
        generated_image=sample_image_bytes,
        provider=mock_provider
    )
    assert isinstance(verdict, ConsistencyValidationResult)
    assert verdict.is_consistent is True
    assert verdict.score > 0.0
    assert isinstance(verdict.issues, list)
    assert isinstance(verdict.changed_attributes, list)
