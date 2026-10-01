from __future__ import annotations

import re
from typing import Optional


def email_valid(email: str) -> bool:
    """
    Validates email format using regex pattern.
    """
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email.strip()))


def password_valid(password: str) -> tuple[bool, Optional[str]]:
    """
    Ensures password is at least 6 characters.
    """
    if len(password) < 6:
        return False, "Password must be at least 6 characters long."
    return True, None


def hex_color_valid(hex_str: Optional[str]) -> bool:
    """
    Validates whether a string is a valid 3 or 6 digit hex color (e.g. #FFFFFF or #000).
    """
    if not hex_str:
        return True
    pattern = r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    return bool(re.match(pattern, hex_str.strip()))


def aspect_ratio_valid(aspect_ratio: str) -> bool:
    """
    Validates supported aspect ratios: 1:1, 4:5, 9:16, 16:9.
    """
    valid_ratios = {"1:1", "4:5", "9:16", "16:9"}
    return aspect_ratio in valid_ratios
