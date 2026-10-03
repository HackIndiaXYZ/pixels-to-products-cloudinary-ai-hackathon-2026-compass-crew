from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class GenerationRequest(BaseModel):
    selected_colors: List[str] = Field(..., description="List of colorway names to generate, e.g. ['Crimson Red', 'Triple Black']")
    selected_formats: List[str] = Field(
        default=["1:1", "4:5", "9:16", "16:9"],
        description="Target aspect ratio formats: '1:1', '4:5', '9:16', '16:9'"
    )
    selected_scene: Optional[str] = Field(default="minimal", description="Scene environment: minimal, luxury, urban, studio")
    brand_id: Optional[str] = Field(default=None, description="Optional Brand DNA ID to apply")


class GenerationJobResponse(BaseModel):
    id: str
    product_id: str
    status: str
    selected_colors: List[str]
    selected_formats: List[str]
    progress_percent: int
    current_step: str
    error_message: Optional[str] = None
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
