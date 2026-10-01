"""
Custom Exceptions for OmniStage AI Engine.
"""
from __future__ import annotations


class AIEngineError(Exception):
    """Base exception for all AI Engine errors."""
    def __init__(self, message: str, details: dict | None = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}


class ConfigurationError(AIEngineError):
    """Raised when configuration is invalid or missing."""
    pass


class MissingAPIKeyError(ConfigurationError):
    """Raised when a required provider API key is not configured."""
    pass


class ImageInputError(AIEngineError):
    """Raised when input image cannot be loaded, read, or resolved."""
    pass


class UnsupportedImageFormatError(ImageInputError):
    """Raised when an image format is not supported."""
    pass


class ProviderError(AIEngineError):
    """Raised when an upstream AI provider returns an error."""
    pass


class ModelResponseError(AIEngineError):
    """Raised when model response is malformed, unparseable, or fails schema validation."""
    pass


class GenerationError(AIEngineError):
    """Raised when image generation fails."""
    pass


class ConsistencyValidationError(AIEngineError):
    """Raised when product consistency validation fails or cannot be executed."""
    pass


class RateLimitError(ProviderError):
    """Raised when provider rate limits are exceeded."""
    pass


class TimeoutError(ProviderError):
    """Raised when an AI API request times out."""
    pass
