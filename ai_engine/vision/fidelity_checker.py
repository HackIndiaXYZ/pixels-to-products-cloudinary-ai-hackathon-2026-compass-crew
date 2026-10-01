"""
Visual fidelity utilities and helpers for verifying product landmarks.
"""
from __future__ import annotations

from typing import List, Tuple
from ai_engine.models import ProductAnalysisResult


def verify_invariant_landmarks(
    original_analysis: ProductAnalysisResult,
    generated_analysis: ProductAnalysisResult
) -> Tuple[bool, List[str]]:
    """
    Compares two analysis records to check if critical landmarks were preserved.
    """
    violations = []
    
    # Check category
    if original_analysis.category.lower() != generated_analysis.category.lower():
        violations.append(
            f"Category changed from '{original_analysis.category}' to '{generated_analysis.category}'"
        )
    
    # Check missing components
    orig_comps = set(c.lower() for c in original_analysis.components)
    gen_comps = set(c.lower() for c in generated_analysis.components)
    missing = orig_comps - gen_comps
    if missing:
        violations.append(f"Missing original components: {', '.join(missing)}")
        
    is_preserved = len(violations) == 0
    return is_preserved, violations
