from __future__ import annotations

import logging
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.generation_job import GenerationJob
from app.models.product import Product
from app.models.asset import Asset
from app.schemas.generation import GenerationRequest
from app.services.cloudinary_service import get_transformation_url

logger = logging.getLogger(__name__)


def create_generation_job(
    db: Session,
    product_id: str,
    gen_request: GenerationRequest
) -> GenerationJob:
    """
    Initializes a new generation job in QUEUED status.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found."
        )

    job = GenerationJob(
        product_id=product_id,
        status="QUEUED",
        selected_colors=gen_request.selected_colors,
        selected_formats=gen_request.selected_formats,
        progress_percent=0,
        current_step="Queued for generation"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_job_status(db: Session, job_id: str, user_id: Optional[str] = None) -> GenerationJob:
    """
    Fetches the current progress and status of a generation job with user isolation.
    """
    query = db.query(GenerationJob).filter(GenerationJob.id == job_id)
    if user_id:
        query = query.join(Product).filter(Product.user_id == user_id)
    job = query.first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Generation job with id {job_id} not found."
        )
    return job


def get_user_generation_jobs(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 50
) -> List[GenerationJob]:
    """
    Fetches all generation jobs for products owned by the user, newest first.
    """
    return (
        db.query(GenerationJob)
        .join(Product)
        .filter(Product.user_id == user_id)
        .order_by(GenerationJob.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def process_generation_pipeline(job_id: str, db: Session) -> None:
    """
    Background worker pipeline executing variant creation and Cloudinary transformations.
    Updates progress through: PROCESSING -> GENERATING -> TRANSFORMING -> COMPLETED.
    """
    job = db.query(GenerationJob).filter(GenerationJob.id == job_id).first()
    if not job:
        return

    try:
        job.status = "PROCESSING"
        job.progress_percent = 15
        job.current_step = "Analyzing product features and colorway requests"
        db.commit()

        product = db.query(Product).filter(Product.id == job.product_id).first()
        if not product:
            job.status = "FAILED"
            job.error_message = "Parent product missing"
            db.commit()
            return

        colors = job.selected_colors or ["Original"]
        formats = job.selected_formats or ["1:1", "4:5", "9:16", "16:9"]

        total_assets = len(colors) * len(formats)
        created_count = 0

        job.status = "GENERATING"
        job.progress_percent = 35
        job.current_step = f"Generating {len(colors)} colorways with Brand DNA"
        db.commit()

        dim_map = {
            "1:1": (1000, 1000),
            "4:5": (800, 1000),
            "9:16": (1080, 1920),
            "16:9": (1920, 1080)
        }

        job.status = "TRANSFORMING"
        db.commit()

        for color in colors:
            for fmt in formats:
                dims = dim_map.get(fmt, (1000, 1000))
                
                # Cloudinary transformation URL for this specific aspect ratio
                transform_url = get_transformation_url(
                    public_id=product.cloudinary_public_id,
                    aspect_ratio=fmt,
                    crop="pad",
                    background="gen_fill"
                )

                asset = Asset(
                    generation_job_id=job.id,
                    product_id=product.id,
                    colorway=color,
                    format=fmt,
                    cloudinary_public_id=f"{product.cloudinary_public_id}_{color.lower().replace(' ', '_')}_{fmt.replace(':', '_')}",
                    cloudinary_url=transform_url,
                    width=dims[0],
                    height=dims[1]
                )
                db.add(asset)
                created_count += 1
                
                # Update progress increment
                pct = 35 + int((created_count / total_assets) * 60)
                job.progress_percent = min(pct, 95)
                job.current_step = f"Prepared {color} ({fmt}) - {created_count}/{total_assets}"
                db.commit()

        job.status = "COMPLETED"
        job.progress_percent = 100
        job.current_step = f"All {total_assets} brand assets ready in gallery"
        db.commit()

    except Exception as e:
        logger.error(f"Error executing generation job {job_id}: {str(e)}", exc_info=True)
        job.status = "FAILED"
        job.error_message = str(e)
        db.commit()
