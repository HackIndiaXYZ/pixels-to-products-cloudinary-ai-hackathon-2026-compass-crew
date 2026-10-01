from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict
from fastapi.responses import JSONResponse


def iso_now() -> str:
    """
    Returns current UTC timestamp in ISO 8601 format.
    """
    return datetime.now(timezone.utc).isoformat()


def format_timestamp(dt: datetime) -> str:
    """
    Formats a datetime object to readable standard timestamp.
    """
    return dt.strftime("%Y-%m-%d %H:%M:%S UTC")


def json_serialize(obj: Any) -> str:
    """
    Serializes objects with datetime handling to JSON string.
    """
    def default_handler(o: Any) -> Any:
        if isinstance(o, datetime):
            return o.isoformat()
        raise TypeError(f"Object of type {type(o)} is not JSON serializable")

    return json.dumps(obj, default=default_handler)


def error_response(message: str, status_code: int = 400) -> JSONResponse:
    """
    Standardized JSON error response payload.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "error": True,
            "message": message,
            "timestamp": iso_now()
        }
    )
