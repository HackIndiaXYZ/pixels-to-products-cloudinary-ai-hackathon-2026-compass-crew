from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.brand import BrandCreate, BrandUpdate, BrandResponse
from app.services.brand_service import create_brand, get_user_brands, get_brand, update_brand

router = APIRouter(prefix="/brands", tags=["Brand DNA"])


@router.post(
    "/",
    response_model=BrandResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Brand DNA profile"
)
def create_new_brand(
    brand_in: BrandCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> BrandResponse:
    """
    Creates a new Brand DNA configuration (colors, aesthetic, lighting, style) for the user.
    """
    brand = create_brand(db=db, user_id=str(current_user.id), brand_in=brand_in)
    return BrandResponse.model_validate(brand)


@router.get(
    "/",
    response_model=List[BrandResponse],
    status_code=status.HTTP_200_OK,
    summary="List all user Brand DNA profiles"
)
def list_brands(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[BrandResponse]:
    """
    Returns all saved brand profiles belonging to the authenticated user.
    """
    brands = get_user_brands(db=db, user_id=str(current_user.id), skip=skip, limit=limit)
    return [BrandResponse.model_validate(b) for b in brands]


@router.get(
    "/{id}",
    response_model=BrandResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single Brand DNA profile"
)
def get_single_brand(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> BrandResponse:
    """
    Fetches a specific Brand DNA profile by ID.
    """
    brand = get_brand(db=db, brand_id=id, user_id=str(current_user.id))
    return BrandResponse.model_validate(brand)


@router.put(
    "/{id}",
    response_model=BrandResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Brand DNA profile"
)
def update_existing_brand(
    id: str,
    brand_update: BrandUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> BrandResponse:
    """
    Updates aesthetic attributes or palette of an existing brand profile.
    """
    brand = update_brand(db=db, brand_id=id, user_id=str(current_user.id), brand_update=brand_update)
    return BrandResponse.model_validate(brand)
