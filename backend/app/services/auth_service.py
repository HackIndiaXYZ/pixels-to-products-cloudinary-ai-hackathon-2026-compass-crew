from __future__ import annotations

from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.core.security import hash_password, verify_password, create_access_token, verify_token


def register_user(db: Session, user_in: UserCreate) -> User:
    """
    Registers a new user if the email does not already exist.
    """
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    db_user = User(
        email=user_in.email.lower(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, login_data: UserLogin) -> TokenResponse:
    """
    Validates user credentials and issues a JWT bearer token.
    """
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


import logging

logger = logging.getLogger("omnistage.auth")


def sync_firebase_user(db: Session, token_data: dict[str, Any]) -> TokenResponse:
    """
    Finds or creates a local application User record associated with the verified
    Firebase identity, then generates the standard application JWT session.
    """
    firebase_uid = token_data["uid"]
    email = token_data["email"].lower()
    full_name = token_data.get("full_name")

    logger.info(f"[FIREBASE AUTH] user lookup started for uid={firebase_uid}, email={email}")

    # 1. Search by firebase_uid first
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    # 2. If not found by firebase_uid, search by email to link existing accounts
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Link existing local account with Firebase UID
            user.firebase_uid = firebase_uid
            if not user.full_name and full_name:
                user.full_name = full_name
            db.commit()
            db.refresh(user)

    # 3. If still not found, create new local User record
    if not user:
        user = User(
            email=email,
            full_name=full_name,
            firebase_uid=firebase_uid,
            hashed_password=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    logger.info(f"[FIREBASE AUTH] user synchronized: user_id={user.id}, email={user.email}")

    # 4. Generate local application JWT access token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    logger.info("[FIREBASE AUTH] response returned")
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )
