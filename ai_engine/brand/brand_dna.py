"""
Brand DNA Interpretation Layer for OmniStage AI.
Translates structured Brand DNA parameters into authoritative, reusable AI generation instructions.
"""
from __future__ import annotations

from typing import Union, Dict, Any, Optional
from ai_engine.models import BrandDNA, BrandInstructions
from ai_engine.prompts.brand_prompts import BRAND_DNA_BASE_DIRECTIVE
from ai_engine.utils.logger import get_logger

logger = get_logger("ai_engine.brand.dna")


class BrandDNAManager:
    """
    Interprets, parses, and converts Brand DNA profiles into structured directives.
    """

    @staticmethod
    def parse(brand_input: Union[BrandDNA, Dict[str, Any]]) -> BrandDNA:
        """Coerce dict or BrandDNA instance into validated BrandDNA model."""
        if isinstance(brand_input, BrandDNA):
            return brand_input
        return BrandDNA.model_validate(brand_input)

    @classmethod
    def build_instructions(cls, brand_dna: Union[BrandDNA, Dict[str, Any]]) -> BrandInstructions:
        """
        Converts Brand DNA into a structured set of instructions suitable for
        colorway generation, scene generation, and composition.
        """
        brand = cls.parse(brand_dna)
        logger.info(f"BrandDNAManager: Compiling brand directives for '{brand.brand_name}'")

        # Color palette string
        palette_parts = []
        if brand.primary_color:
            palette_parts.append(f"Primary: {brand.primary_color}")
        accent = brand.accent_color or brand.secondary_color
        if accent:
            palette_parts.append(f"Accent/Secondary: {accent}")
        palette_str = ", ".join(palette_parts) if palette_parts else "Neutral studio palette"

        # Custom rules
        custom_rules_str = ""
        if brand.custom_guidelines:
            custom_rules_str = "- Brand Directives: " + "; ".join(brand.custom_guidelines)

        prompt_snippet = BRAND_DNA_BASE_DIRECTIVE.format(
            brand_name=brand.brand_name,
            aesthetic=brand.aesthetic or "Contemporary E-Commerce",
            lighting=brand.lighting or "Soft Diffused Studio",
            background_style=brand.background_style or "Neutral Clean Studio",
            mood=brand.mood or "Polished and Professional",
            palette_info=palette_str,
            custom_rules=custom_rules_str
        ).strip()

        summary = (
            f"Brand DNA for {brand.brand_name}: {brand.aesthetic} aesthetic, "
            f"{brand.lighting} lighting, {brand.mood} mood."
        )

        return BrandInstructions(
            brand_name=brand.brand_name,
            summary=summary,
            lighting_directive=f"Apply {brand.lighting or 'soft studio'} lighting consistent with {brand.brand_name} aesthetic.",
            color_palette_directive=f"Adhere to signature brand palette ({palette_str}) for accents and environmental ambient reflection.",
            background_directive=f"Stage against a {brand.background_style or 'premium neutral'} background styling.",
            mood_directive=f"Project a {brand.mood or 'confident'} commercial mood.",
            preservation_directive=f"Maintain the authentic physical product structure; brand aesthetic governs context and lighting only.",
            prompt_snippet=prompt_snippet
        )


def build_brand_instructions(brand_dna: Union[BrandDNA, Dict[str, Any]]) -> BrandInstructions:
    """
    Reusable top-level function for backend engineers and generation pipelines.
    Translates raw Brand DNA profile into structured BrandInstructions.
    """
    return BrandDNAManager.build_instructions(brand_dna)
