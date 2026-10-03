from __future__ import annotations

import os
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from pydantic import BaseModel
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


class ProductAnalyzeRequest(BaseModel):
    image_url: Optional[str] = None
    product_id: Optional[str] = None


def _resolve_image_source(source: str) -> str:
    if source.startswith("http://") or source.startswith("https://") or source.startswith("data:"):
        return source
    local_path = os.path.join(os.getcwd(), "frontend", "public", source.lstrip("/"))
    if os.path.exists(local_path):
        return local_path
    return source


@router.post(
    "/analyze",
    status_code=status.HTTP_200_OK,
    summary="Run AI analysis on an image URL or product"
)
def analyze_image_endpoint(
    req: ProductAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Executes multimodal vision analysis using the active AI engine provider.
    Extracts category, material, base color, components, and preservation locks.
    """
    import os
    from ai_engine.engine import AIEngine

    target_image = None
    product = None
    if req.product_id:
        product = get_product(db=db, product_id=req.product_id, user_id=str(current_user.id))
        target_image = product.cloudinary_url
    elif req.image_url:
        target_image = req.image_url
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either product_id or image_url must be provided for AI analysis."
        )

    resolved_image = _resolve_image_source(target_image)
    try:
        engine = AIEngine()
        analysis = engine.analyze_product(resolved_image)
        metadata = analysis.model_dump()
        if product:
            product.ai_metadata = metadata
            if analysis.category:
                product.category = analysis.category
            db.commit()
            db.refresh(product)
        return {
            "success": True,
            "product_id": product.id if product else None,
            "analysis": metadata
        }
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Analysis failed: {str(exc)}"
        )


@router.post(
    "/{id}/analyze",
    status_code=status.HTTP_200_OK,
    summary="Run AI analysis on a specific product"
)
def analyze_specific_product(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Executes multimodal vision analysis on an existing registered product.
    """
    return analyze_image_endpoint(
        ProductAnalyzeRequest(product_id=id),
        current_user=current_user,
        db=db
    )
