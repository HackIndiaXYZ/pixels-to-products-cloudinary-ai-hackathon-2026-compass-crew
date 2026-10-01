from __future__ import annotations

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class BrandBase(BaseModel):
    brand_name: str
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    aesthetic: Optional[str] = None
    lighting: Optional[str] = None
    background_style: Optional[str] = None


class BrandCreate(BrandBase):
    pass


class BrandUpdate(BaseModel):
    brand_name: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    aesthetic: Optional[str] = None
    lighting: Optional[str] = None
    background_style: Optional[str] = None


class BrandResponse(BrandBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
