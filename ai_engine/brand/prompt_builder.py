"""
Centralized Prompt Builder for OmniStage AI.
Assembles modular prompts following the architecture:
PRODUCT CONTEXT + BRAND DNA + USER REQUEST + TARGET FORMAT + FIDELITY REQUIREMENTS = FINAL PROMPT.
"""
from __future__ import annotations

from typing import Optional, Union, Dict, Any, List

from ai_engine.models import (
    ProductAnalysisResult,
    BrandDNA,
    BrandInstructions,
    FormatSpec
)
from ai_engine.brand.brand_dna import build_brand_instructions
from ai_engine.prompts.colorway_prompts import COLORWAY_SYSTEM_PROMPT, COLORWAY_NEGATIVE_PROMPT
from ai_engine.prompts.scene_prompts import (
    SCENE_SYSTEM_PROMPT,
    SCENE_NEGATIVE_PROMPT,
    get_scene_description
)


class OmniStagePromptBuilder:
    """
    Deterministic prompt compiler creating strictly structured generation prompts.
    """

    @staticmethod
    def format_product_context(product: Optional[Union[ProductAnalysisResult, Dict[str, Any]]]) -> str:
        """Serializes product analysis into a structured preservation context."""
        if not product:
            return "PRODUCT CONTEXT: High-fidelity commercial product photo."

        if isinstance(product, dict):
            product = ProductAnalysisResult.model_validate(product)

        lines = [
            "AUTHENTIC PRODUCT SPECIFICATIONS (MUST PRESERVE):",
            f"- Category: {product.category}" + (f" ({product.subcategory})" if product.subcategory else ""),
            f"- Original Primary Color: {product.primary_color}",
            f"- Original Material: {product.material}",
            f"- Verified Physical Components: {', '.join(product.components)}",
            f"- Camera Angle / Perspective: {product.orientation}",
            f"- Essential Details To Lock: {', '.join(product.important_details) if product.important_details else 'all logos and stitching'}"
        ]
        return "\n".join(lines)

    @staticmethod
    def format_brand_context(brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]]) -> str:
        """Converts Brand DNA into formatted directives or returns empty string if omitted."""
        if not brand_dna:
            return ""
        instructions = build_brand_instructions(brand_dna)
        return instructions.prompt_snippet

    @staticmethod
    def format_fidelity_constraints(product: Optional[Union[ProductAnalysisResult, Dict[str, Any]]]) -> str:
        """Constructs explicit non-negotiable fidelity boundaries."""
        base_constraints = [
            "PRODUCT FIDELITY MANDATE:",
            "1. SILHOUETTE & GEOMETRY: Do NOT change the product's shape, dimensions, thickness, curves, or proportion.",
            "2. BRANDING & LOGOS: All logos, insignia, emblems, and brand signatures must remain in EXACT original placement and form.",
            "3. STRUCTURAL COMPONENTS: Retain all soles, eyelets, laces, stitching paths, zippers, and functional seams.",
            "4. NO ARTIFACTS: Render with razor-sharp commercial catalog clarity, true-to-life surface textures, and correct physics."
        ]
        if product and isinstance(product, ProductAnalysisResult) and product.important_details:
            base_constraints.append(f"5. SPECIFIC LANDMARKS TO LOCK: {'; '.join(product.important_details)}.")
        return "\n".join(base_constraints)

    @classmethod
    def build_colorway_prompt(
        cls,
        target_color: str,
        product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
        brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]] = None,
        format_spec: Optional[FormatSpec] = None,
        additional_instructions: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Assembles final colorway generation prompt with negative constraints.
        """
        sections: List[str] = []

        # 1. Product Context
        sections.append(cls.format_product_context(product_context))

        # 2. Brand DNA
        brand_snippet = cls.format_brand_context(brand_dna)
        if brand_snippet:
            sections.append(brand_snippet)

        # 3. Targeted User Request
        user_request = (
            f"TARGET RE-COLORING REQUEST:\n"
            f"- Transform the product's primary body material to: **{target_color}**.\n"
            f"- Apply the new colorway naturally according to material physics (light reflection, grain, sheen).\n"
            f"- Do NOT modify neutral structural trim, soles, or metal accents unless specified."
        )
        if additional_instructions:
            user_request += f"\n- Additional specification: {additional_instructions}"
        sections.append(user_request)

        # 4. Format Requirements
        if format_spec:
            sections.append(
                f"COMPOSITION & FORMAT:\n"
                f"- Aspect ratio: {format_spec.aspect_ratio}\n"
                f"- Channel use case: {format_spec.use_case}\n"
                f"- Framing: {format_spec.composition_guide}"
            )

        # 5. Fidelity Invariants
        sections.append(cls.format_fidelity_constraints(product_context))

        final_prompt = "\n\n".join(sections)
        return {
            "system_prompt": COLORWAY_SYSTEM_PROMPT,
            "prompt": final_prompt,
            "negative_prompt": COLORWAY_NEGATIVE_PROMPT
        }

    @classmethod
    def build_scene_prompt(
        cls,
        scene_type: str,
        product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
        brand_dna: Optional[Union[BrandDNA, Dict[str, Any]]] = None,
        format_spec: Optional[FormatSpec] = None,
        environment_description: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Assembles final commercial scene staging prompt.
        """
        sections: List[str] = []

        # 1. Product Context
        sections.append(cls.format_product_context(product_context))

        # 2. Brand DNA
        brand_snippet = cls.format_brand_context(brand_dna)
        if brand_snippet:
            sections.append(brand_snippet)

        # 3. Scene Archetype Specification
        scene_info = get_scene_description(scene_type)
        scene_section = [
            f"COMMERCIAL SCENE STAGING: [{scene_type.upper()}]",
            f"- Style: {scene_info['description']}",
            f"- Staging Surface / Podium: {scene_info['surface']}",
            f"- Lighting Setup: {scene_info['lighting']}",
            f"- Background Atmosphere: {scene_info['background']}",
            f"- Scene Mood: {scene_info['mood']}"
        ]
        if environment_description:
            scene_section.append(f"- Custom Environment Detail: {environment_description}")
        sections.append("\n".join(scene_section))

        # 4. Format Requirements
        if format_spec:
            sections.append(
                f"COMPOSITION & FORMAT:\n"
                f"- Aspect ratio: {format_spec.aspect_ratio}\n"
                f"- Channel use case: {format_spec.use_case}\n"
                f"- Framing: {format_spec.composition_guide}"
            )

        # 5. Product Preservation Invariant
        sections.append(
            "CRITICAL DIRECTIVE: The product itself must remain 100% physically authentic and unaltered. "
            "Only the surrounding environment, surface podium, and lighting atmosphere are composed."
        )
        sections.append(cls.format_fidelity_constraints(product_context))

        final_prompt = "\n\n".join(sections)
        return {
            "system_prompt": SCENE_SYSTEM_PROMPT,
            "prompt": final_prompt,
            "negative_prompt": SCENE_NEGATIVE_PROMPT
        }
