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


DEFAULT_PRODUCT_TEMPLATES = [
    {
        "product_name": "Aero Low Leather Sneaker",
        "category": "Footwear",
        "cloudinary_public_id": "omnistage/sneaker_navy",
        "cloudinary_url": "/products/sneaker-navy.png",
        "ai_metadata": {
            "category": "Footwear",
            "material": "Full-grain calfskin leather",
            "primary_color": "Navy Blue #1D2A4A",
            "resolution": "3024 × 3024 px",
            "components": ["laces", "sole", "side logo badge", "stitching lines"],
            "important_details": ["Logo & branding", "Sole texture", "Stitch lines", "Silhouette"]
        }
    },
    {
        "product_name": "Maison Top-Handle Bag",
        "category": "Leather Goods",
        "cloudinary_public_id": "omnistage/handbag",
        "cloudinary_url": "/products/handbag.png",
        "ai_metadata": {
            "category": "Leather Goods",
            "material": "Smooth Box Calf Leather",
            "primary_color": "Sandstone #D4B996",
            "resolution": "2800 × 2800 px",
            "components": ["handle", "gold clasp", "leather grain"],
            "important_details": ["Gold clasp geometry", "Handle arch", "Edge glazing"]
        }
    },
    {
        "product_name": "Meridian Steel Watch",
        "category": "Timepieces",
        "cloudinary_public_id": "omnistage/watch",
        "cloudinary_url": "/products/watch.png",
        "ai_metadata": {
            "category": "Timepieces",
            "material": "316L Brushed Stainless Steel",
            "primary_color": "Steel #94A3B8",
            "resolution": "3000 × 3000 px",
            "components": ["bezel", "dial", "crown", "bracelet"],
            "important_details": ["Fluted bezel", "Sub-dials", "Crown texture"]
        }
    }
]


def get_user_products(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 100
) -> List[Product]:
    """
    Retrieves all products belonging to the specified user. If user has no products,
    seeds default studio demonstration products.
    """
    products = db.query(Product).filter(
        Product.user_id == user_id
    ).order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

    if not products and skip == 0:
        for tpl in DEFAULT_PRODUCT_TEMPLATES:
            prod = Product(user_id=user_id, **tpl)
            db.add(prod)
        db.commit()
        products = db.query(Product).filter(
            Product.user_id == user_id
        ).order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

    return products


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
