"""
Prompts for Staging Products in Contextual Scenes while preserving product fidelity.
"""
from __future__ import annotations
from typing import Dict, Any

SCENE_SYSTEM_PROMPT = """You are OmniStage AI's Commercial Staging Director.
You place the authentic e-commerce product into a tailored commercial scene.
THE PRODUCT ITSELF MUST REMAIN 100% UNCHANGED in silhouette, logo, texture, colors, and craftsmanship.
Only the surrounding environment, podium/surface, ambient lighting reflections, and contextual background are generated.
"""

SCENE_NEGATIVE_PROMPT = (
    "altered product, changed logo, distorted shape, low quality, blurry, deformed, "
    "unnatural perspective, floating product without contact shadows, cartoon, CGI render"
)

SCENE_ARCHETYPES: Dict[str, Dict[str, str]] = {
    "Premium Studio": {
        "description": "High-end commercial studio setup",
        "surface": "Sleek matte pedestal or neutral seamless infinity cove",
        "lighting": "Balanced three-point commercial studio lighting with soft specular highlights and subtle contact shadows",
        "background": "Flawless soft gradient background with clean neutral tones",
        "mood": "Polished, crisp, authoritative e-commerce flagship quality"
    },
    "Minimal": {
        "description": "Contemporary minimalist gallery aesthetic",
        "surface": "Clean geometric concrete or matte stone plinth",
        "lighting": "Architectural daylight with defined, elegant soft shadows",
        "background": "Spacious monolithic backdrop in muted limestone or warm alabaster",
        "mood": "Quiet luxury, serene, uncluttered, pure focus on the product"
    },
    "Lifestyle": {
        "description": "Authentic aspirational real-world lifestyle environment",
        "surface": "Contextual real-world surface appropriate for the product (e.g. hardwood floor, cafe table, modern desk)",
        "lighting": "Natural ambient daylight with warm golden undertones",
        "background": "Softly blurred depth-of-field interior or contextual environment, keeping product dominant",
        "mood": "Approachable, dynamic, lived-in, contemporary"
    },
    "Urban": {
        "description": "Modern metropolitan street and architectural aesthetic",
        "surface": "Fine architectural concrete, clean asphalt, or polished industrial steel",
        "lighting": "Cool directional morning or late afternoon city light with crisp rim reflection",
        "background": "Subtle out-of-focus metropolitan cityscape, industrial glass, or brushed steel facade",
        "mood": "Edgy, energetic, modern streetwear, dynamic"
    },
    "Luxury": {
        "description": "High-fashion editorial luxury staging",
        "surface": "Polished Nero Marquina or Carrara marble slab with subtle dark wood or brushed brass trim",
        "lighting": "Dramatic moody chiaroscuro lighting, soft glowing rim light, controlled reflections",
        "background": "Deep textured velvet or brushed bronze luxury architectural partition",
        "mood": "Opulent, elite, prestigious, high fashion campaign"
    }
}


def get_scene_description(scene_type: str) -> Dict[str, str]:
    """Retrieve scene archetype details with fallback to Premium Studio."""
    # Case-insensitive lookup
    for key, val in SCENE_ARCHETYPES.items():
        if key.lower() == scene_type.strip().lower():
            return val
    return SCENE_ARCHETYPES["Premium Studio"]
