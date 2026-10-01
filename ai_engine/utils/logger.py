"""
Sanitized logging for OmniStage AI Engine.
"""
from __future__ import annotations

import logging
import re
from ai_engine.config import settings

SECRET_PATTERNS = [
    re.compile(r"(AIzaSy[A-Za-z0-9_-]{33})"),
    re.compile(r"(sk-[A-Za-z0-9_-]{32,})"),
    re.compile(r"(r8_[A-Za-z0-9]{32,})"),
]


class SanitizedFormatter(logging.Formatter):
    """Masks API keys and secrets in log messages."""
    def format(self, record: logging.LogRecord) -> str:
        msg = super().format(record)
        for pattern in SECRET_PATTERNS:
            msg = pattern.sub(r"***REDACTED***", msg)
        return msg


def get_logger(name: str = "ai_engine") -> logging.Logger:
    """Returns a preconfigured logger for the AI Engine."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = SanitizedFormatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    
    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(level)
    return logger
