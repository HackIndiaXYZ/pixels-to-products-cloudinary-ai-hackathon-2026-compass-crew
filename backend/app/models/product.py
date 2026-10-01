from __future__ import annotations

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Product(Base):
    """
    SQLAlchemy model representing a product uploaded by a user.
    """
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    brand_id = Column(String(36), ForeignKey("brands.id", ondelete="SET NULL"), nullable=True, index=True)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    cloudinary_public_id = Column(String(255), nullable=False)
    cloudinary_url = Column(String(1000), nullable=False)
    ai_metadata = Column(JSON, nullable=True, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="products")
    brand = relationship("Brand", back_populates="products")
    generation_jobs = relationship("GenerationJob", back_populates="product", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="product", cascade="all, delete-orphan")
