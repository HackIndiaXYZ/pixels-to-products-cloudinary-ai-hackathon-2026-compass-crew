from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


def test_signup_success(client: TestClient):
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "seller@urbanstep.com",
            "password": "securepassword123",
            "full_name": "UrbanStep Seller"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "seller@urbanstep.com"
    assert "id" in data
    assert "hashed_password" not in data


def test_signup_duplicate_email(client: TestClient):
    # First registration
    client.post(
        "/api/auth/signup",
        json={"email": "dupe@test.com", "password": "password123"}
    )
    # Second registration with same email
    response = client.post(
        "/api/auth/signup",
        json={"email": "dupe@test.com", "password": "password123"}
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_login_success(client: TestClient):
    client.post(
        "/api/auth/signup",
        json={"email": "login@test.com", "password": "mypassword123"}
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "login@test.com", "password": "mypassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login@test.com"


def test_login_invalid_password(client: TestClient):
    client.post(
        "/api/auth/signup",
        json={"email": "wrongpwd@test.com", "password": "correctpassword"}
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "wrongpwd@test.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
