"""
Unit tests for format requirements and specifications.
"""
from ai_engine.generation.formats import get_format_config, FORMAT_SPECS
from ai_engine.models import FormatSpec


def test_all_standard_formats_defined():
    """Verify all four required formats are defined with correct aspect ratios."""
    expected_ratios = ["1:1", "4:5", "9:16", "16:9"]
    for ratio in expected_ratios:
        assert ratio in FORMAT_SPECS
        spec = FORMAT_SPECS[ratio]
        assert isinstance(spec, FormatSpec)
        assert spec.aspect_ratio == ratio
        assert spec.target_width > 0
        assert spec.target_height > 0
        assert 0.0 < spec.padding_percent < 0.5


def test_get_format_config_fallback():
    """Verify fallback to 1:1 for unknown aspect ratio request."""
    fallback_spec = get_format_config("21:9")
    assert fallback_spec.aspect_ratio == "1:1"

    valid_spec = get_format_config("9:16")
    assert valid_spec.aspect_ratio == "9:16"
    assert "reels/stories" in valid_spec.use_case
