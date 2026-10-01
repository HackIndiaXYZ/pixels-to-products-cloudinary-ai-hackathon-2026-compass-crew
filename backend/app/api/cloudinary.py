from __future__ import annotations

from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, File, UploadFile, Query, status, HTTPException

from app.core.security import get_current_user
from app.models.user import User
from app.services.cloudinary_service import (
    generate_upload_signature,
    upload_file,
    get_transformation_url,
    get_optimization_url
)

router = APIRouter(prefix="/cloudinary", tags=["Cloudinary Integration"])


@router.get(
    "/upload-signature",
    status_code=status.HTTP_200_OK,
    summary="Generate signed parameters for client upload"
)
def get_signed_upload(
    folder: str = Query("omnistage/products", description="Destination Cloudinary folder"),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Generates a secure signature and timestamp allowing the frontend
    to upload large media files directly to Cloudinary without backend bottleneck.
    """
    params = {"folder": folder}
    signature_data = generate_upload_signature(params)
    return signature_data


@router.post(
    "/upload-product",
    status_code=status.HTTP_200_OK,
    summary="Direct server-side product image upload"
)
async def upload_product_file(
    file: UploadFile = File(...),
    folder: str = Query("omnistage/products"),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Accepts a multipart file upload and transfers it to Cloudinary storage.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image (PNG, JPG, WebP)."
        )

    file_bytes = await file.read()
    result = upload_file(
        file_source=file_bytes,
        folder=folder,
        tags=f"user_{current_user.id},omnistage_upload"
    )
    return {
        "public_id": result.get("public_id"),
        "secure_url": result.get("secure_url"),
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format")
    }


@router.get(
    "/transform/{public_id:path}",
    status_code=status.HTTP_200_OK,
    summary="Get transformed URL for specific aspect ratio"
)
def transform_asset(
    public_id: str,
    format: str = Query("1:1", description="Target format: 1:1, 4:5, 9:16, 16:9"),
    crop: str = Query("pad", description="Crop mode: pad, fill, fit"),
    background: str = Query("gen_fill", description="Background mode: gen_fill, auto")
) -> Dict[str, Any]:
    """
    Dynamically generates the optimized Cloudinary transformation URL for a specific aspect ratio.
    """
    valid_formats = {"1:1", "4:5", "9:16", "16:9"}
    if format not in valid_formats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid format '{format}'. Supported: {list(valid_formats)}"
        )

    transformed_url = get_transformation_url(
        public_id=public_id,
        aspect_ratio=format,
        crop=crop,
        background=background
    )

    return {
        "public_id": public_id,
        "format": format,
        "transformed_url": transformed_url
    }


@router.get(
    "/transform-all/{public_id:path}",
    status_code=status.HTTP_200_OK,
    summary="Get multi-format suite (1:1, 4:5, 9:16, 16:9)"
)
def transform_all_formats(
    public_id: str,
    crop: str = Query("pad"),
    background: str = Query("gen_fill")
) -> Dict[str, Any]:
    """
    Generates all 4 multi-channel URLs (1:1, 4:5, 9:16, 16:9) and an optimized raw URL.
    """
    formats = ["1:1", "4:5", "9:16", "16:9"]
    result: Dict[str, str] = {}
    for fmt in formats:
        result[fmt] = get_transformation_url(
            public_id=public_id,
            aspect_ratio=fmt,
            crop=crop,
            background=background
        )

    return {
        "public_id": public_id,
        "optimized_url": get_optimization_url(public_id),
        "formats": result
    }
