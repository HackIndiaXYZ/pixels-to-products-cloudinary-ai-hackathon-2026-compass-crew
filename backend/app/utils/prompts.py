from __future__ import annotations

from typing import Optional


def build_brand_dna_prompt(
    brand_name: str,
    aesthetic: Optional[str] = "Minimalist Luxury",
    lighting: Optional[str] = "Soft Studio",
    background_style: Optional[str] = "Seamless Clean Podium",
    primary_color: Optional[str] = None
) -> str:
    """
    Constructs a descriptive prompt conditioning generative AI on brand identity.
    """
    color_hint = f" with accent palette {primary_color}" if primary_color else ""
    return (
        f"Commercial studio product photography for brand '{brand_name}'{color_hint}. "
        f"Aesthetic: {aesthetic}. Lighting: {lighting} with balanced soft shadows. "
        f"Environment: {background_style}. Ultra-sharp product details, accurate textures, "
        f"commercial catalog quality, 8k resolution, award-winning advertising visual."
    )


def build_colorway_prompt(
    base_product: str,
    target_color: str,
    original_color: str = "navy",
    preserve_details: bool = True
) -> str:
    """
    Constructs a targeted recoloring prompt that commands the diffusion/vision model
    to preserve logos, sole geometry, and texture while changing only the primary fabric/material.
    """
    preservation = (
        "Preserve exact silhouette, sole geometry, stitching, hardware, and brand logos without alterations. "
        if preserve_details else ""
    )
    return (
        f"Recolor {base_product} from {original_color} to {target_color}. "
        f"{preservation}"
        f"Material texture, leather grain, and surface highlights must remain authentic and photo-realistic."
    )
