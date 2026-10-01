"""
Format Specifications and Aspect Ratio Requirements for OmniStage AI.
Supplies geometric and composition parameters for multi-channel e-commerce syndication.
Note: Cloudinary handles final crop/pad/gen_fill; AI engine provides generation framing requirements.
"""
from __future__ import annotations

from typing import Dict
from ai_engine.models import FormatSpec

FORMAT_SPECS: Dict[str, FormatSpec] = {
    "1:1": FormatSpec(
        aspect_ratio="1:1",
        use_case="marketplace/social",
        target_width=1080,
        target_height=1080,
        padding_percent=0.10,
        composition_guide="Center-aligned composition with 10% safe margin padding on all 4 borders. Square framing for Amazon, Shopify, and Instagram feed."
    ),
    "4:5": FormatSpec(
        aspect_ratio="4:5",
        use_case="social media",
        target_width=1080,
        target_height=1350,
        padding_percent=0.12,
        composition_guide="Vertical portrait orientation optimized for Instagram mobile feed. Product centered slightly below midline with vertical breathing room."
    ),
    "9:16": FormatSpec(
        aspect_ratio="9:16",
        use_case="reels/stories",
        target_width=1080,
        target_height=1920,
        padding_percent=0.20,
        composition_guide="Full-screen vertical story/reel format. Product strictly anchored in central focal safe zone (middle 60% vertical axis) to avoid UI overlay obstructions."
    ),
    "16:9": FormatSpec(
        aspect_ratio="16:9",
        use_case="website/banner",
        target_width=1920,
        target_height=1080,
        padding_percent=0.15,
        composition_guide="Horizontal panoramic landscape for hero banners and desktop category headers. Ample negative space on sides for typography and overlay elements."
    )
}


def get_format_config(aspect_ratio: str) -> FormatSpec:
    """
    Retrieves the configuration specification for a given aspect ratio.
    Defaults to '1:1' if aspect_ratio is not recognized.
    """
    cleaned = aspect_ratio.strip()
    if cleaned in FORMAT_SPECS:
        return FORMAT_SPECS[cleaned]
    # Fallback to 1:1
    return FORMAT_SPECS["1:1"]
