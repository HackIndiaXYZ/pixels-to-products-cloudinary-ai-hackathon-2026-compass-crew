"""
Configuration settings for OmniStage AI Engine.
Reads from environment variables and provides structured settings.
"""
from __future__ import annotations

import os
from typing import Optional, Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AISettings(BaseSettings):
    """
    Settings for the AI Engine.
    Configured via environment variables or .env file.
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Provider Selection: "auto", "gemini", "openai", "mock"
    AI_PROVIDER: str = Field(
        default="auto",
        description="Active AI Provider ('auto', 'gemini', 'openai', 'mock')"
    )

    # API Keys
    GEMINI_API_KEY: Optional[str] = Field(default=None, description="Google Gemini API Key")
    OPENAI_API_KEY: Optional[str] = Field(default=None, description="OpenAI API Key")
    REPLICATE_API_TOKEN: Optional[str] = Field(default=None, description="Replicate API Token")

    # Model names
    GEMINI_VISION_MODEL: str = Field(
        default="gemini-2.5-flash",
        description="Gemini model for multimodal analysis and reasoning"
    )
    GEMINI_IMAGE_MODEL: str = Field(
        default="imagen-3.0-generate-002",
        description="Gemini/Google model for image generation"
    )
    OPENAI_VISION_MODEL: str = Field(
        default="gpt-4o",
        description="OpenAI model for vision analysis"
    )
    OPENAI_IMAGE_MODEL: str = Field(
        default="dall-e-3",
        description="OpenAI model for image generation"
    )

    # Execution controls
    TIMEOUT_SECONDS: int = Field(default=60, description="HTTP/API request timeout in seconds")
    MAX_RETRIES: int = Field(default=3, description="Maximum retry count for transient API failures")
    ENABLE_MOCK_FALLBACK: bool = Field(
        default=True,
        description="Automatically fallback to mock provider if no API keys are present (ideal for dev/testing)"
    )
    LOG_LEVEL: str = Field(default="INFO", description="Log level for ai_engine")


# Singleton instance
settings = AISettings()
