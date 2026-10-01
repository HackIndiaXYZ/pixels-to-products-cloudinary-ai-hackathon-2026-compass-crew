from __future__ import annotations

import os
from typing import Optional
import cloudinary
import cloudinary.utils
from cloudinary.config import init_cloudinary


def get_optimized_url(
    public_id: str,
    width: Optional[int] = None,
    height: Optional[int] = None,
    format: Optional[str] = None
) -> str:
    """
    Generates a production-ready CDN delivery URL with automatic format (f_auto)
    and automatic quality (q_auto) optimization.
    """
    init_cloudinary()
    cloud_name = cloudinary.config().cloud_name or os.getenv("CLOUDINARY_CLOUD_NAME", "")
    if not cloud_name:
        dim_str = ""
        if width and height:
            dim_str = f"w_{width},h_{height},"
        elif width:
            dim_str = f"w_{width},"
        return f"https://res.cloudinary.com/demo/image/upload/{dim_str}f_auto,q_auto/{public_id}"

    transform_options = {
        "fetch_format": format or "auto",
        "quality": "auto",
        "secure": True
    }
    if width:
        transform_options["width"] = width
    if height:
        transform_options["height"] = height

    url, _ = cloudinary.utils.cloudinary_url(public_id, **transform_options)
    return url
