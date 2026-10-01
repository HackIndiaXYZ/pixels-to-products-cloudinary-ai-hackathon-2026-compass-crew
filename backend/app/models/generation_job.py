from __future__ import annotations

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class GenerationJob(Base):
    """
    SQLAlchemy model tracking generation jobs and execution status.
    """
    __tablename__ = "generation_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="QUEUED", nullable=False) # QUEUED, PROCESSING, GENERATING, TRANSFORMING, COMPLETED, FAILED
    selected_colors = Column(JSON, default=list, nullable=False)
    selected_formats = Column(JSON, default=list, nullable=False)
    progress_percent = Column(Integer, default=0, nullable=False)
    current_step = Column(String(255), default="Job initialized", nullable=False)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    product = relationship("Product", back_populates="generation_jobs")
    assets = relationship("Asset", back_populates="generation_job", cascade="all, delete-orphan")
