from __future__ import annotations

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Brand(Base):
    """
    SQLAlchemy model representing a Brand DNA profile.
    """
    __tablename__ = "brands"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    brand_name = Column(String(150), nullable=False)
    primary_color = Column(String(50), nullable=True)     # Hex code e.g. #000000
    secondary_color = Column(String(50), nullable=True)   # Hex code e.g. #D4AF37
    aesthetic = Column(String(100), nullable=True)        # Minimalist Luxury, Streetwear, Neon Cyber
    lighting = Column(String(100), nullable=True)         # Soft Studio, Golden Hour, Hard Edge
    background_style = Column(String(100), nullable=True) # Clean Concrete, Marble Podium, Seamless White
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="brands")
    products = relationship("Product", back_populates="brand")
