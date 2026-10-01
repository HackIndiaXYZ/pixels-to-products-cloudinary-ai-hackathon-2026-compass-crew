from __future__ import annotations

import os
import cloudinary
import cloudinary.utils
from cloudinary.config import init_cloudinary


def get_transformation_url(
    public_id: str,
    width: int = 1080,
    height: int = 1920,
    crop: str = "pad",
    background: str = "gen_fill"
) -> str:
    """
    Generates a 9:16 vertical transformation URL (1080x1920) for Stories, TikTok, and Reels.
    """
    init_cloudinary()
    cloud_name = cloudinary.config().cloud_name or os.getenv("CLOUDINARY_CLOUD_NAME", "")
    if not cloud_name:
        return f"https://res.cloudinary.com/demo/image/upload/ar_9:16,c_{crop},b_{background},w_{width},h_{height},f_auto,q_auto/{public_id}"

    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        aspect_ratio="9:16",
        width=width,
        height=height,
        crop=crop,
        background=background,
        fetch_format="auto",
        quality="auto",
        secure=True
    )
    return url
