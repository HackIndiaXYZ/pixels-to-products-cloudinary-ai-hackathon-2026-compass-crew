from __future__ import annotations

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base


class Asset(Base):
    """
    SQLAlchemy model representing a generated and transformed product asset.
    """
    __tablename__ = "assets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    generation_job_id = Column(String(36), ForeignKey("generation_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    colorway = Column(String(100), nullable=False)
    format = Column(String(20), nullable=False) # '1:1', '4:5', '9:16', '16:9'
    cloudinary_public_id = Column(String(255), nullable=False)
    cloudinary_url = Column(String(1000), nullable=False)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    generation_job = relationship("GenerationJob", back_populates="assets")
    product = relationship("Product", back_populates="assets")
