from __future__ import annotations

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class AssetBase(BaseModel):
    colorway: str
    format: str
    cloudinary_public_id: str
    cloudinary_url: str
    width: Optional[int] = None
    height: Optional[int] = None


class AssetCreate(AssetBase):
    generation_job_id: str
    product_id: str


class AssetResponse(AssetBase):
    id: str
    generation_job_id: str
    product_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AssetListResponse(BaseModel):
    total: int
    items: List[AssetResponse]
