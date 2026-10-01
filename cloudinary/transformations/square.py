from __future__ import annotations

import os
import cloudinary
import cloudinary.utils
from cloudinary.config import init_cloudinary


def get_transformation_url(
    public_id: str,
    width: int = 1000,
    height: int = 1000,
    crop: str = "pad",
    background: str = "gen_fill"
) -> str:
    """
    Generates a 1:1 square transformation URL (1000x1000) optimized with f_auto, q_auto,
    and generative fill background extension where needed.
    """
    init_cloudinary()
    cloud_name = cloudinary.config().cloud_name or os.getenv("CLOUDINARY_CLOUD_NAME", "")
    if not cloud_name:
        return f"https://res.cloudinary.com/demo/image/upload/ar_1:1,c_{crop},b_{background},w_{width},h_{height},f_auto,q_auto/{public_id}"

    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        aspect_ratio="1:1",
        width=width,
        height=height,
        crop=crop,
        background=background,
        fetch_format="auto",
        quality="auto",
        secure=True
    )
    return url
