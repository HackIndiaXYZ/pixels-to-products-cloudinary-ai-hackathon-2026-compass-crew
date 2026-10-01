from __future__ import annotations

from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    product_name: str
    category: Optional[str] = None
    brand_id: Optional[str] = None
    cloudinary_public_id: str
    cloudinary_url: str


class ProductCreate(ProductBase):
    ai_metadata: Optional[Dict[str, Any]] = None


class ProductResponse(ProductBase):
    id: str
    user_id: str
    ai_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
