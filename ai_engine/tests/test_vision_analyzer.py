"""
Unit tests for Product Analysis and Schema Extraction.
"""
import pytest
from PIL import Image

from ai_engine.vision.analyzer import ProductAnalyzer, analyze_product
from ai_engine.vision.attribute_extractor import (
    extract_materials,
    extract_components,
    extract_preservation_landmarks
)
from ai_engine.vision.fidelity_checker import verify_invariant_landmarks
from ai_engine.models import ProductAnalysisResult


def test_product_analysis_schema_valid():
    """Verify valid construction and typing of ProductAnalysisResult."""
    data = {
        "category": "Sneaker",
        "subcategory": "Lifestyle Sneaker",
        "primary_color": "Navy",
        "secondary_colors": ["White"],
        "material": "Synthetic",
        "components": ["laces", "sole", "logo", "stitching"],
        "orientation": "three-quarter",
        "background": "plain",
        "product_position": "center",
        "important_details": ["logo", "sole structure", "upper texture", "stitching"],
        "visual_attributes": {"finish": "matte"},
        "confidence": {"overall": 0.95}
    }
    result = ProductAnalysisResult.model_validate(data)
    assert result.category == "Sneaker"
    assert result.subcategory == "Lifestyle Sneaker"
    assert result.primary_color == "Navy"
    assert "logo" in result.components
    assert "sole structure" in result.important_details


def test_analyzer_with_pil_and_bytes(mock_provider, sample_pil_image, sample_image_bytes):
    """Test analyzing product image passed as PIL and bytes."""
    analyzer = ProductAnalyzer(provider=mock_provider)
    
    # 1. Using PIL image
    res1 = analyzer.analyze(sample_pil_image)
    assert isinstance(res1, ProductAnalysisResult)
    assert res1.category == "Sneaker"
    assert len(res1.components) > 0

    # 2. Using raw bytes
    res2 = analyze_product(sample_image_bytes, provider=mock_provider)
    assert isinstance(res2, ProductAnalysisResult)
    assert res2.primary_color == "Navy Blue"


def test_attribute_extractor_helpers(sample_product_analysis):
    """Test attribute extraction helper utilities."""
    materials = extract_materials(sample_product_analysis)
    assert "Synthetic Nubuck" in materials

    components = extract_components(sample_product_analysis)
    assert "laces" in components
    assert "logo" in components

    landmarks = extract_preservation_landmarks(sample_product_analysis)
    # Important details and logo/sole components should be gathered
    assert any("logo" in l for l in landmarks)
    assert any("sole" in l for l in landmarks)


def test_fidelity_checker_landmarks(sample_product_analysis):
    """Test invariant landmark verification."""
    # Same category and components should pass
    is_ok, violations = verify_invariant_landmarks(sample_product_analysis, sample_product_analysis)
    assert is_ok is True
    assert len(violations) == 0

    # Modified category should flag violation
    mutated = sample_product_analysis.model_copy(update={"category": "Backpack", "components": ["strap"]})
    is_ok, violations = verify_invariant_landmarks(sample_product_analysis, mutated)
    assert is_ok is False
    assert any("Category changed" in v for v in violations)
