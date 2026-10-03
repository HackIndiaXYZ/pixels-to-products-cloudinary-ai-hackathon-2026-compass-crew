"""
Unit tests for Provider Abstraction and Factory.
"""
import pytest
from ai_engine.providers.factory import get_ai_provider
from ai_engine.providers.mock_provider import MockAIProvider
from ai_engine.providers.gemini_provider import GeminiProvider
from ai_engine.exceptions import MissingAPIKeyError, ConfigurationError


def test_mock_provider_instantiation():
    """Verify explicit mock provider selection."""
    provider = get_ai_provider("mock")
    assert isinstance(provider, MockAIProvider)
    assert provider.provider_name == "mock"


def test_missing_api_key_raises_error(monkeypatch):
    """Verify GeminiProvider raises MissingAPIKeyError when no key is configured."""
    from ai_engine.config import settings
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "")
    with pytest.raises(MissingAPIKeyError):
        GeminiProvider(api_key=None)


def test_unsupported_provider_raises_error():
    """Verify unsupported provider name raises ConfigurationError."""
    with pytest.raises(ConfigurationError):
        get_ai_provider("non_existent_provider_xyz")
