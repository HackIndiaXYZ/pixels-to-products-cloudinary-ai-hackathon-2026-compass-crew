"""
Centralized prompt engineering module for OmniStage AI.
"""
from ai_engine.prompts.analysis_prompts import (
    PRODUCT_ANALYSIS_SYSTEM_PROMPT,
    PRODUCT_ANALYSIS_USER_PROMPT
)
from ai_engine.prompts.brand_prompts import (
    BRAND_DNA_BASE_DIRECTIVE
)
from ai_engine.prompts.colorway_prompts import (
    COLORWAY_SYSTEM_PROMPT,
    COLORWAY_NEGATIVE_PROMPT
)
from ai_engine.prompts.scene_prompts import (
    SCENE_SYSTEM_PROMPT,
    SCENE_NEGATIVE_PROMPT,
    SCENE_ARCHETYPES,
    get_scene_description
)
from ai_engine.prompts.consistency_prompts import (
    CONSISTENCY_SYSTEM_PROMPT,
    CONSISTENCY_USER_PROMPT
)

__all__ = [
    "PRODUCT_ANALYSIS_SYSTEM_PROMPT",
    "PRODUCT_ANALYSIS_USER_PROMPT",
    "BRAND_DNA_BASE_DIRECTIVE",
    "COLORWAY_SYSTEM_PROMPT",
    "COLORWAY_NEGATIVE_PROMPT",
    "SCENE_SYSTEM_PROMPT",
    "SCENE_NEGATIVE_PROMPT",
    "SCENE_ARCHETYPES",
    "get_scene_description",
    "CONSISTENCY_SYSTEM_PROMPT",
    "CONSISTENCY_USER_PROMPT"
]
