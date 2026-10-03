from typing import List, Optional
from fastapi import APIRouter, Depends, BackgroundTasks, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db, SessionLocal
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.generation import GenerationRequest, GenerationJobResponse
from app.services.generation_service import (
    create_generation_job,
    get_job_status,
    get_user_generation_jobs,
    process_generation_pipeline
)
from app.services.product_service import get_product

router = APIRouter(prefix="/generations", tags=["Generations"])


def _format_job_response(job) -> GenerationJobResponse:
    resp = GenerationJobResponse.model_validate(job)
    if hasattr(job, "product") and job.product:
        resp.product_name = job.product.product_name
        resp.product_image = job.product.cloudinary_url
    return resp


@router.get(
    "/",
    response_model=List[GenerationJobResponse],
    status_code=status.HTTP_200_OK,
    summary="List all generation jobs for authenticated user"
)
def list_generation_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[GenerationJobResponse]:
    """
    Returns all generation jobs associated with products owned by the authenticated user.
    """
    jobs = get_user_generation_jobs(db=db, user_id=str(current_user.id), skip=skip, limit=limit)
    return [_format_job_response(j) for j in jobs]


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

    return _format_job_response(job)


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
    job = get_job_status(db=db, job_id=job_id, user_id=str(current_user.id))
    return _format_job_response(job)
