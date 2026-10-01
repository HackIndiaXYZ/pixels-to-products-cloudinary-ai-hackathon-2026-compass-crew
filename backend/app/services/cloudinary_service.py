from __future__ import annotations

import os
import time
from typing import Dict, Any, Optional
import cloudinary
import cloudinary.uploader
import cloudinary.utils
from app.core.config import settings


def _ensure_cloudinary_initialized() -> None:
    """
    Ensures Cloudinary credentials are set up using app settings.
    """
    c_name = settings.CLOUDINARY_CLOUD_NAME or os.getenv("CLOUDINARY_CLOUD_NAME", "")
    k_key = settings.CLOUDINARY_API_KEY or os.getenv("CLOUDINARY_API_KEY", "")
    s_secret = settings.CLOUDINARY_API_SECRET or os.getenv("CLOUDINARY_API_SECRET", "")

    cloudinary.config(
        cloud_name=c_name,
        api_key=k_key,
        api_secret=s_secret,
        secure=True
    )


def generate_upload_signature(params_to_sign: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Generates a secure cryptographic signature and timestamp for direct client-side uploads.
    """
    _ensure_cloudinary_initialized()
    api_secret = cloudinary.config().api_secret
    api_key = cloudinary.config().api_key
    cloud_name = cloudinary.config().cloud_name

    timestamp = int(time.time())
    params = params_to_sign.copy() if params_to_sign else {}
    params["timestamp"] = timestamp

    signature = cloudinary.utils.api_sign_request(params, api_secret) if api_secret else "dummy_dev_signature"

    return {
        "signature": signature,
        "timestamp": timestamp,
        "api_key": api_key,
        "cloud_name": cloud_name,
        "upload_preset": settings.CLOUDINARY_UPLOAD_PRESET,
        "params": params
    }


def upload_file(
    file_source: Any,
    folder: str = "omnistage/products",
    public_id: Optional[str] = None,
    tags: Optional[str] = "omnistage"
) -> Dict[str, Any]:
    """
    Uploads an image file to Cloudinary.
    """
    _ensure_cloudinary_initialized()
    upload_options: Dict[str, Any] = {
        "folder": folder,
        "resource_type": "image",
        "tags": tags
    }
    if public_id:
        upload_options["public_id"] = public_id

    # Fallback mock for testing environment without active Cloudinary credentials
    if not cloudinary.config().cloud_name or not cloudinary.config().api_secret:
        mock_id = public_id or f"omnistage/mock_{int(time.time())}"
        return {
            "public_id": mock_id,
            "secure_url": f"https://res.cloudinary.com/demo/image/upload/{mock_id}.jpg",
            "url": f"http://res.cloudinary.com/demo/image/upload/{mock_id}.jpg",
            "width": 1000,
            "height": 1000,
            "format": "jpg",
            "resource_type": "image"
        }

    return cloudinary.uploader.upload(file_source, **upload_options)


def get_transformation_url(
    public_id: str,
    aspect_ratio: str, # "1:1", "4:5", "9:16", "16:9"
    crop: str = "pad",
    background: str = "gen_fill"
) -> str:
    """
    Constructs a transformed and optimized delivery URL for a specific aspect ratio.
    """
    _ensure_cloudinary_initialized()
    aspect_map = {
        "1:1": {"width": 1000, "height": 1000, "ar": "1:1"},
        "4:5": {"width": 800, "height": 1000, "ar": "4:5"},
        "9:16": {"width": 1080, "height": 1920, "ar": "9:16"},
        "16:9": {"width": 1920, "height": 1080, "ar": "16:9"}
    }
    specs = aspect_map.get(aspect_ratio, {"width": 1000, "height": 1000, "ar": "1:1"})

    cloud_name = cloudinary.config().cloud_name or settings.CLOUDINARY_CLOUD_NAME or "demo"

    try:
        url, _ = cloudinary.utils.cloudinary_url(
            public_id,
            cloud_name=cloud_name,
            aspect_ratio=specs["ar"],
            width=specs["width"],
            height=specs["height"],
            crop=crop,
            background=background,
            fetch_format="auto",
            quality="auto",
            secure=True
        )
    except Exception:
        url = None

    if not url or url.startswith("https:///"):
        return f"https://res.cloudinary.com/{cloud_name}/image/upload/ar_{specs['ar']},c_{crop},b_{background},w_{specs['width']},h_{specs['height']},f_auto,q_auto/{public_id}"
    return url


def get_optimization_url(
    public_id: str,
    width: Optional[int] = None,
    height: Optional[int] = None,
    format: Optional[str] = None
) -> str:
    """
    Returns an optimized CDN delivery URL applying f_auto and q_auto.
    """
    _ensure_cloudinary_initialized()
    cloud_name = cloudinary.config().cloud_name or settings.CLOUDINARY_CLOUD_NAME or "demo"

    transform_options = {
        "cloud_name": cloud_name,
        "fetch_format": format or "auto",
        "quality": "auto",
        "secure": True
    }
    if width:
        transform_options["width"] = width
    if height:
        transform_options["height"] = height

    try:
        url, _ = cloudinary.utils.cloudinary_url(public_id, **transform_options)
    except Exception:
        url = None

    if not url or url.startswith("https:///"):
        dim_str = f"w_{width},h_{height}," if width and height else ""
        return f"https://res.cloudinary.com/{cloud_name}/image/upload/{dim_str}f_auto,q_auto/{public_id}"
    return url


def delete_asset(public_id: str) -> Dict[str, Any]:
    """
    Deletes an asset from Cloudinary storage.
    """
    _ensure_cloudinary_initialized()
    if not cloudinary.config().cloud_name or not cloudinary.config().api_secret:
        return {"result": "ok", "mock": True}
    return cloudinary.uploader.destroy(public_id)
