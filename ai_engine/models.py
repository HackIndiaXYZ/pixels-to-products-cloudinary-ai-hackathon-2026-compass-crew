"""
Core Pydantic models and schemas for OmniStage AI Engine.
"""
from __future__ import annotations

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, model_validator, ConfigDict


class ProductAnalysisResult(BaseModel):
    """
    Structured visual breakdown of a product image.
    Guarantees consistent schema for downstream prompt generation and validation.
    """
    category: str = Field(..., description="High-level product category (e.g. Sneaker, Handbag, Watch, Jacket)")
    subcategory: Optional[str] = Field(default=None, description="Granular subcategory (e.g. Lifestyle Sneaker)")
    primary_color: str = Field(..., description="Dominant primary color of the product (e.g. Navy, Onyx Black)")
    secondary_colors: List[str] = Field(default_factory=list, description="Secondary or accent colors detected")
    material: str = Field(..., description="Dominant material (e.g. Synthetic Mesh, Full-Grain Leather, Brushed Metal)")
    components: List[str] = Field(default_factory=list, description="Identified components (e.g. laces, sole, logo, stitching)")
    orientation: str = Field(default="three-quarter", description="Camera perspective / orientation (e.g. side, front, three-quarter, top)")
    background: str = Field(default="plain", description="Background nature (e.g. plain, studio white, outdoor, textured)")
    product_position: str = Field(default="center", description="Position in frame (e.g. center, off-center)")
    important_details: List[str] = Field(
        default_factory=list,
        description="Key aesthetic landmarks that MUST be preserved (e.g. logo badge, stitching lines, sole geometry)"
    )
    visual_attributes: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional visual attributes (finish, texture, pattern, reflectivity)"
    )
    confidence: Dict[str, float] = Field(
        default_factory=dict,
        description="Confidence scores per detected attribute"
    )

    model_config = ConfigDict(extra="ignore")


class BrandDNA(BaseModel):
    """
    Brand aesthetic and identity profile used to style generation without altering product geometry.
    """
    brand_name: str = Field(..., description="Name of the brand")
    aesthetic: Optional[str] = Field(default="Modern Minimalist", description="Visual aesthetic philosophy")
    primary_color: Optional[str] = Field(default=None, description="Primary brand color hex or name")
    accent_color: Optional[str] = Field(default=None, description="Accent/secondary brand color hex or name")
    secondary_color: Optional[str] = Field(default=None, description="Alias for accent_color")
    lighting: Optional[str] = Field(default="Soft Studio", description="Signature brand lighting style")
    background_style: Optional[str] = Field(default="Clean Neutral", description="Standard brand background environment")
    mood: Optional[str] = Field(default="Sophisticated", description="Emotional mood conveyed")
    target_audience: Optional[str] = Field(default=None, description="Target demographic context")
    custom_guidelines: Optional[List[str]] = Field(default_factory=list, description="Specific brand rules")

    @model_validator(mode="before")
    @classmethod
    def harmonize_colors(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # Harmonize secondary_color and accent_color
            accent = data.get("accent_color") or data.get("secondary_color")
            if accent:
                data["accent_color"] = accent
                data["secondary_color"] = accent
        return data

    model_config = ConfigDict(extra="ignore")


class BrandInstructions(BaseModel):
    """
    Compiled directives from Brand DNA for prompt injection.
    """
    brand_name: str
    summary: str
    lighting_directive: str
    color_palette_directive: str
    background_directive: str
    mood_directive: str
    preservation_directive: str
    prompt_snippet: str


class FormatSpec(BaseModel):
    """
    Specifications for target asset aspect ratio and layout composition.
    """
    aspect_ratio: str = Field(..., description="Aspect ratio label (e.g. '1:1', '4:5', '9:16', '16:9')")
    use_case: str = Field(..., description="Target distribution channel (e.g. 'marketplace/social', 'reels/stories')")
    target_width: int = Field(..., description="Recommended pixel width")
    target_height: int = Field(..., description="Recommended pixel height")
    padding_percent: float = Field(default=0.10, description="Product safe margin padding percentage")
    composition_guide: str = Field(..., description="Guidance for composition and visual focal placement")


class ColorwayRequest(BaseModel):
    """
    Request model for generating a product colorway.
    """
    target_color: str = Field(..., description="Requested colorway name or specification (e.g. 'Crimson Red', 'Triple Black')")
    product_context: Optional[ProductAnalysisResult] = None
    brand_dna: Optional[BrandDNA] = None
    target_format: str = Field(default="1:1", description="Target aspect ratio ('1:1', '4:5', '9:16', '16:9')")
    additional_instructions: Optional[str] = None


class SceneRequest(BaseModel):
    """
    Request model for staging a product in a contextual scene.
    """
    scene_type: str = Field(..., description="Scene archetype ('Premium Studio', 'Minimal', 'Lifestyle', 'Urban', 'Luxury')")
    product_context: Optional[ProductAnalysisResult] = None
    brand_dna: Optional[BrandDNA] = None
    target_format: str = Field(default="1:1", description="Target aspect ratio ('1:1', '4:5', '9:16', '16:9')")
    environment_description: Optional[str] = Field(default=None, description="Optional custom environment description")


class GenerationResult(BaseModel):
    """
    Result returned by the AI image generation layer.
    """
    image_bytes: Optional[bytes] = Field(default=None, repr=False)
    image_base64: Optional[str] = Field(default=None, repr=False)
    image_url: Optional[str] = None
    prompt_used: str
    negative_prompt_used: Optional[str] = None
    provider: str
    model: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(arbitrary_types_allowed=True)


class ConsistencyValidationResult(BaseModel):
    """
    Structured outcome of product fidelity and consistency verification.
    """
    is_consistent: bool = Field(..., description="True if generated product matches original identity")
    score: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    issues: List[str] = Field(default_factory=list, description="Any detected fidelity violations")
    changed_attributes: List[str] = Field(default_factory=list, description="Attributes that changed between images")
    passed_checks: List[str] = Field(default_factory=list, description="Checks that passed successfully")
    details: Dict[str, Any] = Field(default_factory=dict, description="Detailed breakdown per component")
