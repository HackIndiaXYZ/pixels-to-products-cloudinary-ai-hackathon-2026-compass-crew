from __future__ import annotations

from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandUpdate


def create_brand(db: Session, user_id: str, brand_in: BrandCreate) -> Brand:
    """
    Creates a new Brand DNA profile for the user.
    """
    db_brand = Brand(
        user_id=user_id,
        brand_name=brand_in.brand_name,
        primary_color=brand_in.primary_color,
        secondary_color=brand_in.secondary_color,
        aesthetic=brand_in.aesthetic,
        lighting=brand_in.lighting,
        background_style=brand_in.background_style
    )
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand


def get_user_brands(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 100
) -> List[Brand]:
    """
    Lists all Brand DNA profiles created by the user.
    """
    return db.query(Brand).filter(
        Brand.user_id == user_id
    ).order_by(Brand.created_at.desc()).offset(skip).limit(limit).all()


def get_brand(
    db: Session,
    brand_id: str,
    user_id: Optional[str] = None
) -> Brand:
    """
    Retrieves a single Brand profile by ID with user isolation check.
    """
    query = db.query(Brand).filter(Brand.id == brand_id)
    if user_id:
        query = query.filter(Brand.user_id == user_id)
    brand = query.first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Brand with id {brand_id} not found."
        )
    return brand


def update_brand(
    db: Session,
    brand_id: str,
    user_id: str,
    brand_update: BrandUpdate
) -> Brand:
    """
    Updates an existing Brand DNA profile.
    """
    brand = get_brand(db, brand_id=brand_id, user_id=user_id)
    update_data = brand_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(brand, field, value)

    db.commit()
    db.refresh(brand)
    return brand
