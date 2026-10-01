from __future__ import annotations

from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.product import Product
from app.schemas.product import ProductCreate


def create_product(db: Session, user_id: str, product_in: ProductCreate) -> Product:
    """
    Creates a new product record associated with the authenticated user.
    """
    db_product = Product(
        user_id=user_id,
        brand_id=product_in.brand_id,
        product_name=product_in.product_name,
        category=product_in.category,
        cloudinary_public_id=product_in.cloudinary_public_id,
        cloudinary_url=product_in.cloudinary_url,
        ai_metadata=product_in.ai_metadata or {}
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_user_products(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 100
) -> List[Product]:
    """
    Retrieves all products belonging to the specified user.
    """
    return db.query(Product).filter(
        Product.user_id == user_id
    ).order_by(Product.created_at.desc()).offset(skip).limit(limit).all()


def get_product(
    db: Session,
    product_id: str,
    user_id: Optional[str] = None
) -> Product:
    """
    Retrieves a single product by ID, ensuring user isolation when user_id is provided.
    """
    query = db.query(Product).filter(Product.id == product_id)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    product = query.first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found."
        )
    return product
