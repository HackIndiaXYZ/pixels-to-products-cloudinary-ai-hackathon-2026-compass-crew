from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse
from app.services.product_service import create_product, get_user_products, get_product

router = APIRouter(prefix="/products", tags=["Products"])


@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product record"
)
def create_new_product(
    product_in: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> ProductResponse:
    """
    Registers a new product record linked to Cloudinary media and the authenticated user.
    """
    product = create_product(db=db, user_id=str(current_user.id), product_in=product_in)
    return ProductResponse.model_validate(product)


@router.get(
    "/",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    summary="List all user products"
)
def list_products(
    skip: int = Query(0, ge=0, description="Offset pagination"),
    limit: int = Query(50, ge=1, le=100, description="Limit records"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[ProductResponse]:
    """
    Returns all product assets owned by the currently authenticated user.
    """
    products = get_user_products(db=db, user_id=str(current_user.id), skip=skip, limit=limit)
    return [ProductResponse.model_validate(p) for p in products]


@router.get(
    "/{id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single product details"
)
def get_single_product(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> ProductResponse:
    """
    Fetches detailed metadata for a single product with user isolation.
    """
    product = get_product(db=db, product_id=id, user_id=str(current_user.id))
    return ProductResponse.model_validate(product)
