"""
Helper functions for extracting and parsing attributes from product analysis.
"""
from __future__ import annotations

from typing import List, Dict, Any
from ai_engine.models import ProductAnalysisResult


def extract_materials(analysis: ProductAnalysisResult) -> List[str]:
    """Extract individual material keywords from analysis."""
    raw = analysis.material.replace(" and ", ",").replace(" with ", ",")
    return [m.strip() for m in raw.split(",") if m.strip()]


def extract_components(analysis: ProductAnalysisResult) -> List[str]:
    """Return all detected functional and visual components."""
    return analysis.components


def extract_preservation_landmarks(analysis: ProductAnalysisResult) -> List[str]:
    """
    Combines identified components and important_details to form an authoritative
    list of invariant landmarks that must NEVER be altered during generation.
    """
    landmarks = set(analysis.important_details)
    for comp in analysis.components:
        if any(keyword in comp.lower() for keyword in ["logo", "badge", "sole", "stitching", "buckle", "crown"]):
            landmarks.add(comp)
    return sorted(list(landmarks))
