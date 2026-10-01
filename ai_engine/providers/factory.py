"""
Provider Factory for OmniStage AI Engine.
Dynamically resolves and instantiates AIProvider instances based on environment or configuration.
"""
from __future__ import annotations

from typing import Optional

from ai_engine.config import settings
from ai_engine.exceptions import MissingAPIKeyError, ConfigurationError
from ai_engine.providers.base import AIProvider
from ai_engine.providers.gemini_provider import GeminiProvider
from ai_engine.providers.openai_provider import OpenAIProvider
from ai_engine.providers.mock_provider import MockAIProvider
from ai_engine.utils.logger import get_logger

logger = get_logger("ai_engine.providers.factory")


def get_ai_provider(provider_name: Optional[str] = None) -> AIProvider:
    """
    Factory resolving the active AIProvider.

    Resolution strategy:
    1. If provider_name is explicitly passed, respect it.
    2. Else, check settings.AI_PROVIDER.
    3. If 'gemini': return GeminiProvider (requires GEMINI_API_KEY).
    4. If 'openai': return OpenAIProvider (requires OPENAI_API_KEY).
    5. If 'mock': return MockAIProvider.
    6. If 'auto':
       - If GEMINI_API_KEY is present -> GeminiProvider
       - If OPENAI_API_KEY is present -> OpenAIProvider
       - If ENABLE_MOCK_FALLBACK is True -> MockAIProvider
       - Else raise MissingAPIKeyError
    """
    chosen = (provider_name or settings.AI_PROVIDER).lower().strip()

    if chosen == "gemini":
        return GeminiProvider()

    if chosen == "openai":
        return OpenAIProvider()

    if chosen == "mock":
        return MockAIProvider()

    if chosen == "auto":
        if settings.GEMINI_API_KEY:
            logger.info("Auto-selected GeminiProvider from GEMINI_API_KEY.")
            return GeminiProvider()
        if settings.OPENAI_API_KEY:
            logger.info("Auto-selected OpenAIProvider from OPENAI_API_KEY.")
            return OpenAIProvider()
        if settings.ENABLE_MOCK_FALLBACK:
            logger.warning(
                "No GEMINI_API_KEY or OPENAI_API_KEY found. Falling back to MockAIProvider "
                "for offline development & testing."
            )
            return MockAIProvider()
        raise MissingAPIKeyError(
            "Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured. "
            "Set an API key in your environment or enable ENABLE_MOCK_FALLBACK=True."
        )

    raise ConfigurationError(f"Unsupported AI_PROVIDER '{chosen}'. Supported: 'auto', 'gemini', 'openai', 'mock'.")
