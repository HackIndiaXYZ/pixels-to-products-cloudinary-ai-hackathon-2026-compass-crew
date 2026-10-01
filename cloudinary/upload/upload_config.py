from __future__ import annotations

import time
import os
from typing import Dict, Any, Optional
import cloudinary
import cloudinary.uploader
import cloudinary.utils
from cloudinary.config import init_cloudinary


def generate_upload_signature(params_to_sign: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Generates a cryptographic signature and timestamp for direct client-side signed uploads.
    """
    init_cloudinary()
    api_secret = cloudinary.config().api_secret or os.getenv("CLOUDINARY_API_SECRET", "")
    api_key = cloudinary.config().api_key or os.getenv("CLOUDINARY_API_KEY", "")
    cloud_name = cloudinary.config().cloud_name or os.getenv("CLOUDINARY_CLOUD_NAME", "")

    timestamp = int(time.time())
    params = params_to_sign.copy() if params_to_sign else {}
    params["timestamp"] = timestamp

    # Cloudinary requires alphabetical sorting of parameters before signing
    signature = cloudinary.utils.api_sign_request(params, api_secret)

    return {
        "signature": signature,
        "timestamp": timestamp,
        "api_key": api_key,
        "cloud_name": cloud_name,
        "params": params
    }


def upload_file(
    file_source: Any,
    folder: str = "omnistage/products",
    public_id: Optional[str] = None,
    tags: Optional[str] = "omnistage"
) -> Dict[str, Any]:
    """
    Uploads a file (file path, file-like object, or URL) to Cloudinary.
    """
    init_cloudinary()
    upload_options: Dict[str, Any] = {
        "folder": folder,
        "resource_type": "image",
        "tags": tags
    }
    if public_id:
        upload_options["public_id"] = public_id

    result = cloudinary.uploader.upload(file_source, **upload_options)
    return result
