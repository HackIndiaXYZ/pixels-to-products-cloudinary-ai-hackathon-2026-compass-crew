from __future__ import annotations

from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from fastapi import HTTPException, status


def test_firebase_auth_new_user(client: TestClient):
    """
    Verifies that a verified Firebase token creates a new user,
    associates the firebase_uid, and returns an application JWT.
    """
    mock_token_payload = {
        "uid": "fb_uid_new_12345",
        "email": "newfirebaseuser@omnistage.ai",
        "full_name": "Firebase User",
        "picture": "https://lh3.googleusercontent.com/a/sample",
        "email_verified": True
    }

    with patch("app.api.auth.verify_firebase_id_token", return_value=mock_token_payload):
        response = client.post(
            "/api/auth/firebase",
            json={"id_token": "valid_firebase_mock_token"}
        )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "newfirebaseuser@omnistage.ai"
    assert data["user"]["full_name"] == "Firebase User"
    assert data["user"]["firebase_uid"] == "fb_uid_new_12345"

    # Test that returned JWT token can access protected endpoints
    jwt_token = data["access_token"]
    prod_res = client.get(
        "/api/products/",
        headers={"Authorization": f"Bearer {jwt_token}"}
    )
    assert prod_res.status_code == 200


def test_firebase_auth_existing_user_linking(client: TestClient):
    """
    Verifies that an existing user who previously registered with email/password
    is linked to their Firebase UID when logging in via Firebase.
    """
    # 1. Existing user registered via email
    client.post(
        "/api/auth/signup",
        json={"email": "existing_account@omnistage.ai", "password": "password123", "full_name": "Original Name"}
    )

    # 2. User logs in via Google/Firebase with matching email
    mock_token_payload = {
        "uid": "fb_uid_linked_9999",
        "email": "existing_account@omnistage.ai",
        "full_name": "Original Name",
        "email_verified": True
    }

    with patch("app.api.auth.verify_firebase_id_token", return_value=mock_token_payload):
        response = client.post(
            "/api/auth/firebase",
            json={"id_token": "valid_mock_token_for_linking"}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "existing_account@omnistage.ai"
    assert data["user"]["firebase_uid"] == "fb_uid_linked_9999"


def test_firebase_auth_invalid_token(client: TestClient):
    """
    Verifies that invalid or forged Firebase ID tokens are rejected with 401.
    """
    with patch(
        "app.api.auth.verify_firebase_id_token",
        side_effect=HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase authentication token."
        )
    ):
        response = client.post(
            "/api/auth/firebase",
            json={"id_token": "invalid_forged_token"}
        )

    assert response.status_code == 401
    assert "Invalid Firebase" in response.json()["detail"]


def test_firebase_auth_expired_token(client: TestClient):
    """
    Verifies that expired Firebase ID tokens are rejected with 401.
    """
    with patch(
        "app.api.auth.verify_firebase_id_token",
        side_effect=HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token has expired. Please sign in again."
        )
    ):
        response = client.post(
            "/api/auth/firebase",
            json={"id_token": "expired_token"}
        )

    assert response.status_code == 401
    assert "expired" in response.json()["detail"]
