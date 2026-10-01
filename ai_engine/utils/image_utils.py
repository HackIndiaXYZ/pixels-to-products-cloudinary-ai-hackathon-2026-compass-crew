"""
Image handling, format conversion, and validation utilities for OmniStage AI Engine.
"""
from __future__ import annotations

import base64
import io
import os
import re
from pathlib import Path
from typing import Tuple, Union, Optional
from PIL import Image

import httpx

from ai_engine.exceptions import ImageInputError, UnsupportedImageFormatError

# Supported formats
SUPPORTED_MIME_TYPES = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
    "image/jpg": "JPEG",
}

ImageInputType = Union[str, Path, bytes, Image.Image]


def get_image_mime_type(image_bytes: bytes) -> str:
    """Detect image MIME type from image bytes header."""
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    elif image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    elif image_bytes.startswith(b"RIFF") and image_bytes[8:12] == b"WEBP":
        return "image/webp"
    
    # Try PIL detection fallback
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            fmt = (img.format or "").upper()
            if fmt in ("JPEG", "JPG"):
                return "image/jpeg"
            elif fmt == "PNG":
                return "image/png"
            elif fmt == "WEBP":
                return "image/webp"
            raise UnsupportedImageFormatError(f"Unsupported image format: {fmt}. Supported: JPEG, PNG, WEBP.")
    except Exception as exc:
        if isinstance(exc, UnsupportedImageFormatError):
            raise
        raise ImageInputError(f"Failed to identify image format from bytes: {str(exc)}") from exc


def load_image(image_input: ImageInputType) -> Tuple[Image.Image, bytes, str]:
    """
    Unified image loader. Accepts:
    - URL (http/https)
    - File path (str or Path)
    - Base64 string (with or without 'data:image/...;base64,' prefix)
    - Raw bytes
    - PIL.Image.Image instance

    Returns:
        Tuple of (PIL.Image.Image, raw_bytes, mime_type)
    """
    if image_input is None:
        raise ImageInputError("Image input cannot be None.")

    # 1. If already a PIL Image
    if isinstance(image_input, Image.Image):
        img = image_input.copy()
        buf = io.BytesIO()
        fmt = (img.format or "PNG").upper()
        if fmt not in ("JPEG", "PNG", "WEBP"):
            fmt = "PNG"
        img.save(buf, format=fmt)
        raw_bytes = buf.getvalue()
        mime_type = "image/png" if fmt == "PNG" else ("image/jpeg" if fmt == "JPEG" else "image/webp")
        return img, raw_bytes, mime_type

    # 2. If raw bytes
    if isinstance(image_input, bytes):
        raw_bytes = image_input
        mime_type = get_image_mime_type(raw_bytes)
        try:
            img = Image.open(io.BytesIO(raw_bytes))
            img.load()
            return img, raw_bytes, mime_type
        except Exception as exc:
            raise ImageInputError(f"Invalid image byte stream: {str(exc)}") from exc

    # 3. If Path or string
    if isinstance(image_input, (str, Path)):
        str_val = str(image_input).strip()

        # 3a. URL
        if str_val.startswith(("http://", "https://")):
            try:
                resp = httpx.get(str_val, timeout=30.0, follow_redirects=True)
                resp.raise_for_status()
                raw_bytes = resp.content
                mime_type = get_image_mime_type(raw_bytes)
                img = Image.open(io.BytesIO(raw_bytes))
                img.load()
                return img, raw_bytes, mime_type
            except httpx.HTTPError as exc:
                raise ImageInputError(f"Failed to download image from URL '{str_val}': {str(exc)}") from exc
            except Exception as exc:
                raise ImageInputError(f"Failed to process image from URL '{str_val}': {str(exc)}") from exc

        # 3b. Data URI base64
        if str_val.startswith("data:image/"):
            try:
                header, encoded = str_val.split(",", 1)
                raw_bytes = base64.b64decode(encoded)
                mime_type = get_image_mime_type(raw_bytes)
                img = Image.open(io.BytesIO(raw_bytes))
                img.load()
                return img, raw_bytes, mime_type
            except Exception as exc:
                raise ImageInputError(f"Failed to parse base64 data URI: {str(exc)}") from exc

        # 3c. Local file path
        if os.path.exists(str_val):
            try:
                with open(str_val, "rb") as f:
                    raw_bytes = f.read()
                mime_type = get_image_mime_type(raw_bytes)
                img = Image.open(io.BytesIO(raw_bytes))
                img.load()
                return img, raw_bytes, mime_type
            except Exception as exc:
                raise ImageInputError(f"Failed to read image file at '{str_val}': {str(exc)}") from exc

        # 3d. Raw base64 string
        try:
            raw_bytes = base64.b64decode(str_val, validate=True)
            mime_type = get_image_mime_type(raw_bytes)
            img = Image.open(io.BytesIO(raw_bytes))
            img.load()
            return img, raw_bytes, mime_type
        except Exception:
            raise ImageInputError(
                f"Image input '{str_val[:50]}...' is neither a valid URL, file path, nor valid base64 payload."
            )

    raise ImageInputError(f"Unsupported image input type: {type(image_input)}")


def encode_image_to_base64(raw_bytes: bytes, mime_type: str = "image/png") -> str:
    """Encode bytes to base64 data URI string."""
    encoded = base64.b64encode(raw_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


def create_solid_color_image(color_name: str, width: int = 512, height: int = 512) -> Tuple[Image.Image, bytes]:
    """Helper to create a simple mock test image."""
    img = Image.new("RGB", (width, height), color=color_name)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return img, buf.getvalue()
