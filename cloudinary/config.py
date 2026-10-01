from __future__ import annotations

import os
import cloudinary
from typing import Optional

def init_cloudinary(
    cloud_name: Optional[str] = None,
    api_key: Optional[str] = None,
    api_secret: Optional[str] = None
) -> None:
    """
    Initializes Cloudinary configuration with provided credentials or from environment variables.
    """
    c_name = cloud_name or os.getenv("CLOUDINARY_CLOUD_NAME", "")
    k_key = api_key or os.getenv("CLOUDINARY_API_KEY", "")
    s_secret = api_secret or os.getenv("CLOUDINARY_API_SECRET", "")

    cloudinary.config(
        cloud_name=c_name,
        api_key=k_key,
        api_secret=s_secret,
        secure=True
    )

# Automatically initialize with current environment on import
init_cloudinary()
