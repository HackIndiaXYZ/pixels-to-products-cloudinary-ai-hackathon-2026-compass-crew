"""
Unit tests for Consistency Validator layer.
"""
from ai_engine.consistency.validator import ConsistencyValidator, check_product_consistency
from ai_engine.models import ConsistencyValidationResult


def test_consistency_validation_flow(mock_provider, sample_pil_image, sample_product_analysis):
    """Test validating consistency between original image and generated variant."""
    validator = ConsistencyValidator(provider=mock_provider)
    result = validator.validate(
        original_image=sample_pil_image,
        generated_image=sample_pil_image,
        product_context=sample_product_analysis
    )

    assert isinstance(result, ConsistencyValidationResult)
    assert result.is_consistent is True
    assert 0.0 <= result.score <= 1.0
    assert len(result.passed_checks) > 0


def test_consistency_validation_functional_api(mock_provider, sample_image_bytes):
    """Test functional check_product_consistency interface."""
    res = check_product_consistency(
        original_image=sample_image_bytes,
        generated_image=sample_image_bytes,
        provider=mock_provider
    )
    assert isinstance(res, ConsistencyValidationResult)
    assert res.is_consistent is True
