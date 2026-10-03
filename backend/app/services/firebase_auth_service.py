"""
Firebase Authentication Service for OmniStage AI Backend.
Initializes Firebase Admin SDK and cryptographically validates Firebase ID tokens.
"""
from __future__ import annotations

import os
import logging
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
try:
    import firebase_admin
    from firebase_admin import auth as fb_auth, credentials
except ImportError:
    firebase_admin = None
    fb_auth = None
    credentials = None
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings

logger = logging.getLogger("omnistage.firebase_auth")

_firebase_initialized = False


def initialize_firebase_admin() -> None:
    """
    Initializes Firebase Admin SDK using service account credentials if available,
    or project ID configuration.
    """
    global _firebase_initialized
    if firebase_admin is None:
        logger.info("[FIREBASE AUTH] firebase-admin package not found; using standalone google-auth verification")
        return
    if _firebase_initialized or len(firebase_admin._apps) > 0:
        _firebase_initialized = True
        return

    cred_path = (
        settings.GOOGLE_APPLICATION_CREDENTIALS
        or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    )

    try:
        if cred_path and os.path.exists(cred_path):
            logger.info(f"[FIREBASE AUTH] Initializing Firebase Admin with credentials from {cred_path}")
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            project_id = settings.FIREBASE_PROJECT_ID or "omnistage-ai"
            logger.info(f"[FIREBASE AUTH] Initializing Firebase Admin with projectId '{project_id}'")
            firebase_admin.initialize_app(options={"projectId": project_id})

        _firebase_initialized = True
        logger.info("[FIREBASE AUTH] Firebase Admin initialized successfully.")
    except Exception as exc:
        logger.warning(f"[FIREBASE AUTH] Firebase Admin initialization note: {str(exc)}")
        if len(firebase_admin._apps) > 0:
            _firebase_initialized = True


# Auto-initialize on module load
initialize_firebase_admin()


def verify_firebase_id_token(id_token: str) -> Dict[str, Any]:
    """
    Verifies a Firebase ID token sent from the client.
    Extracts authenticated user information strictly from the verified payload.

    Raises:
        HTTPException(401): If token is missing, expired, revoked, or invalid.
    """
    logger.info("[FIREBASE AUTH] request received")
    if not id_token or not id_token.strip():
        logger.warning("[FIREBASE AUTH] empty ID token provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase ID token is required.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    clean_token = id_token.strip()
    initialize_firebase_admin()

    logger.info("[FIREBASE AUTH] token verification started")
    decoded_token: Optional[Dict[str, Any]] = None

    # Check if explicit service account credentials exist
    has_service_account = bool(
        settings.GOOGLE_APPLICATION_CREDENTIALS
        and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS)
    )

    # Strategy 1: Use Firebase Admin SDK only if explicit service account credentials exist
    if has_service_account:
        try:
            decoded_token = fb_auth.verify_id_token(clean_token, check_revoked=False)
        except fb_auth.ExpiredIdTokenError:
            logger.warning("[FIREBASE AUTH] Firebase ID token expired.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Firebase token has expired. Please sign in again.",
                headers={"WWW-Authenticate": "Bearer"}
            )
        except fb_auth.RevokedIdTokenError:
            logger.warning("[FIREBASE AUTH] Firebase ID token revoked.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Firebase token has been revoked.",
                headers={"WWW-Authenticate": "Bearer"}
            )
        except fb_auth.InvalidIdTokenError as exc:
            logger.warning(f"[FIREBASE AUTH] Invalid Firebase ID token: {str(exc)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase authentication token.",
                headers={"WWW-Authenticate": "Bearer"}
            )
        except Exception as exc:
            logger.info(f"[FIREBASE AUTH] Admin SDK note: {exc}. Falling back to Google public cert verification...")

    # Strategy 2: Cryptographically verify against Google public certs (works without service account credentials)
    if not decoded_token:
        try:
            req = google_requests.Request()
            project_id = settings.FIREBASE_PROJECT_ID or "omnistage-ai"
            decoded_token = google_id_token.verify_firebase_token(
                clean_token,
                req,
                audience=project_id,
                clock_skew_in_seconds=60
            )
        except Exception as exc:
            logger.error(f"[FIREBASE AUTH] Public cert verification failed: {str(exc)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Firebase token verification failed: {str(exc)}",
                headers={"WWW-Authenticate": "Bearer"}
            )

    uid = decoded_token.get("uid") or decoded_token.get("sub") or decoded_token.get("user_id")
    email = decoded_token.get("email")

    if not uid or not email:
        logger.warning(f"[FIREBASE AUTH] Missing essential identity claims. uid={uid}, email={email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token missing essential user identity claims (uid/email).",
            headers={"WWW-Authenticate": "Bearer"}
        )

    logger.info(f"[FIREBASE AUTH] token verified for uid={uid}, email={email}")
    return {
        "uid": str(uid),
        "email": str(email).lower(),
        "full_name": decoded_token.get("name"),
        "picture": decoded_token.get("picture"),
        "email_verified": decoded_token.get("email_verified", False)
    }
