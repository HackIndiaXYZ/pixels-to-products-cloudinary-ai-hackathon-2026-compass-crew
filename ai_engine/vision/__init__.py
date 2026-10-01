"""
Vision package for OmniStage AI.
"""
from ai_engine.vision.analyzer import ProductAnalyzer, analyze_product
from ai_engine.vision.schemas import ProductAnalysisResult
from ai_engine.vision.attribute_extractor import (
    extract_materials,
    extract_components,
    extract_preservation_landmarks
)
from ai_engine.vision.fidelity_checker import verify_invariant_landmarks

__all__ = [
    "ProductAnalyzer",
    "analyze_product",
    "ProductAnalysisResult",
    "extract_materials",
    "extract_components",
    "extract_preservation_landmarks",
    "verify_invariant_landmarks"
]
