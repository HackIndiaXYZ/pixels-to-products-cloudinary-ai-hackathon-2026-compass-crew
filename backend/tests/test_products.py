from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


def get_auth_headers(client: TestClient, email: str = "prod_user@test.com") -> dict:
    client.post("/api/auth/signup", json={"email": email, "password": "password123"})
    res = client.post("/api/auth/login", json={"email": email, "password": "password123"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_get_product(client: TestClient):
    headers = get_auth_headers(client, "sneaker_seller@test.com")

    # 1. Create product
    payload = {
        "product_name": "Running Shoe Pro",
        "category": "Footwear",
        "cloudinary_public_id": "omnistage/products/shoe_navy_01",
        "cloudinary_url": "https://res.cloudinary.com/demo/image/upload/shoe_navy_01.jpg",
        "ai_metadata": {"primary_color": "Navy", "material": "Mesh"}
    }
    create_res = client.post("/api/products/", json=payload, headers=headers)
    assert create_res.status_code == 201
    product = create_res.json()
    assert product["product_name"] == "Running Shoe Pro"
    assert product["category"] == "Footwear"
    product_id = product["id"]

    # 2. List products
    list_res = client.get("/api/products/", headers=headers)
    assert list_res.status_code == 200
    products = list_res.json()
    assert len(products) >= 1
    assert any(p["id"] == product_id for p in products)

    # 3. Get single product
    get_res = client.get(f"/api/products/{product_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == product_id


def test_product_unauthorized(client: TestClient):
    res = client.get("/api/products/")
    assert res.status_code == 401
