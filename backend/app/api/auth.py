from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, FirebaseAuthRequest
from app.services.auth_service import register_user, authenticate_user, sync_firebase_user
from app.services.firebase_auth_service import verify_firebase_id_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new seller account"
)
def signup(user_in: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    """
    Creates a new user account with hashed password and returns user profile.
    """
    user = register_user(db, user_in)
    return UserResponse.model_validate(user)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate and receive JWT token"
)
def login(login_data: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    """
    Validates user credentials and returns a signed JWT access token.
    """
    return authenticate_user(db, login_data)


@router.post(
    "/firebase",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate via Firebase ID Token"
)
def authenticate_firebase(
    payload: FirebaseAuthRequest,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Exchanges a cryptographically verified Firebase ID token for an application JWT session.
    Synchronizes local user record by Firebase UID or email.
    """
    token_data = verify_firebase_id_token(payload.id_token)
    return sync_firebase_user(db, token_data)
