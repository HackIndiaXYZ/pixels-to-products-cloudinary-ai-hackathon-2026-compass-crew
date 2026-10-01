"""
OmniStage AI Engine.
Modular, production-ready AI layer for e-commerce product understanding,
colorway variant synthesis, commercial scene staging, and consistency validation.
"""
from ai_engine.engine import AIEngine
from ai_engine.vision.analyzer import ProductAnalyzer, analyze_product
from ai_engine.brand.brand_dna import BrandDNAManager, build_brand_instructions
from ai_engine.brand.prompt_builder import OmniStagePromptBuilder
from ai_engine.generation.colorway import ColorwayGenerator, generate_colorway
from ai_engine.generation.scene import SceneGenerator, generate_scene
from ai_engine.generation.formats import get_format_config, FORMAT_SPECS
from ai_engine.consistency.validator import ConsistencyValidator, check_product_consistency
from ai_engine.providers.factory import get_ai_provider
from ai_engine.providers.base import AIProvider
from ai_engine.providers.gemini_provider import GeminiProvider
from ai_engine.providers.openai_provider import OpenAIProvider
from ai_engine.providers.mock_provider import MockAIProvider
from ai_engine.models import (
    ProductAnalysisResult,
    BrandDNA,
    BrandInstructions,
    FormatSpec,
    ColorwayRequest,
    SceneRequest,
    GenerationResult,
    ConsistencyValidationResult
)
from ai_engine.exceptions import (
    AIEngineError,
    ConfigurationError,
    MissingAPIKeyError,
    ImageInputError,
    UnsupportedImageFormatError,
    ProviderError,
    ModelResponseError,
    GenerationError,
    ConsistencyValidationError,
    RateLimitError,
    TimeoutError
)

__version__ = "1.0.0"

__all__ = [
    # Facade
    "AIEngine",
    
    # Core Functions
    "analyze_product",
    "build_brand_instructions",
    "generate_colorway",
    "generate_scene",
    "check_product_consistency",
    "get_format_config",
    "FORMAT_SPECS",
    
    # Classes / Services
    "ProductAnalyzer",
    "BrandDNAManager",
    "OmniStagePromptBuilder",
    "ColorwayGenerator",
    "SceneGenerator",
    "ConsistencyValidator",
    
    # Providers
    "get_ai_provider",
    "AIProvider",
    "GeminiProvider",
    "OpenAIProvider",
    "MockAIProvider",
    
    # Schemas & Models
    "ProductAnalysisResult",
    "BrandDNA",
    "BrandInstructions",
    "FormatSpec",
    "ColorwayRequest",
    "SceneRequest",
    "GenerationResult",
    "ConsistencyValidationResult",
    
    # Exceptions
    "AIEngineError",
    "ConfigurationError",
    "MissingAPIKeyError",
    "ImageInputError",
    "UnsupportedImageFormatError",
    "ProviderError",
    "ModelResponseError",
    "GenerationError",
    "ConsistencyValidationError",
    "RateLimitError",
    "TimeoutError"
]
