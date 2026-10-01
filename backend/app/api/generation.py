from __future__ import annotations

from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.orm import Session

from app.core.database import get_db, SessionLocal
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.generation import GenerationRequest, GenerationJobResponse
from app.services.generation_service import (
    create_generation_job,
    get_job_status,
    process_generation_pipeline
)
from app.services.product_service import get_product

router = APIRouter(prefix="/generations", tags=["Generations"])


def _run_job_in_background(job_id: str) -> None:
    """
    Spawns background task with isolated DB session.
    """
    db = SessionLocal()
    try:
        process_generation_pipeline(job_id=job_id, db=db)
    finally:
        db.close()


@router.post(
    "/{product_id}/generate",
    response_model=GenerationJobResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Trigger AI variant & multi-format generation job"
)
def trigger_generation(
    product_id: str,
    gen_request: GenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> GenerationJobResponse:
    """
    Initiates an asynchronous generation job creating colorways and multi-format assets.
    """
    # Verify product belongs to user
    _ = get_product(db=db, product_id=product_id, user_id=str(current_user.id))

    # Initialize job in DB
    job = create_generation_job(db=db, product_id=product_id, gen_request=gen_request)

    # Schedule background processing
    background_tasks.add_task(_run_job_in_background, job.id)

    return GenerationJobResponse.model_validate(job)


@router.get(
    "/{job_id}/status",
    response_model=GenerationJobResponse,
    status_code=status.HTTP_200_OK,
    summary="Get generation job progress and status"
)
def check_job_status(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> GenerationJobResponse:
    """
    Polls the current status, step message, and percentage completion of a generation job.
    """
    job = get_job_status(db=db, job_id=job_id)
    return GenerationJobResponse.model_validate(job)
