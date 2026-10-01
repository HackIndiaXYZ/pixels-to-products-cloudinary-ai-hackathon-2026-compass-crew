"""
Unit tests for robust error handling.
"""
import pytest
from ai_engine.exceptions import (
    ImageInputError,
    AIEngineError
)
from ai_engine.utils.image_utils import load_image
from ai_engine.vision.analyzer import analyze_product


def test_invalid_image_input():
    """Verify loading None or invalid strings raises ImageInputError."""
    with pytest.raises(ImageInputError):
        load_image(None)

    with pytest.raises(ImageInputError):
        load_image("invalid_not_a_path_or_url_or_base64_!@#$%^")


def test_corrupted_image_bytes():
    """Verify corrupted byte stream raises ImageInputError."""
    with pytest.raises(ImageInputError):
        load_image(b"not_an_image_header_random_junk_bytes")
