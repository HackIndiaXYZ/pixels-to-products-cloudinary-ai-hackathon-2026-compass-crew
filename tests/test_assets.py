from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


def test_assets_flow_and_deletion(client: TestClient):
    # Setup
    email = "asset_tester@test.com"
    client.post("/api/auth/signup", json={"email": email, "password": "password123"})
    res = client.post("/api/auth/login", json={"email": email, "password": "password123"})
    headers = {"Authorization": f"Bearer {res.json()['access_token']}"}

    prod_res = client.post(
        "/api/products/",
        json={
            "product_name": "Asset Test Shoe",
            "category": "Shoes",
            "cloudinary_public_id": "omnistage/products/test_shoe_asset",
            "cloudinary_url": "https://res.cloudinary.com/demo/image/upload/test_shoe_asset.jpg"
        },
        headers=headers
    )
    product_id = prod_res.json()["id"]

    # Trigger generation
    gen_res = client.post(
        f"/api/generations/{product_id}/generate",
        json={"selected_colors": ["White"], "selected_formats": ["1:1"]},
        headers=headers
    )
    job_id = gen_res.json()["id"]

    # 1. Get Job Assets
    job_assets_res = client.get(f"/api/assets/job/{job_id}", headers=headers)
    assert job_assets_res.status_code == 200
    assets = job_assets_res.json()
    assert isinstance(assets, list)

    # 2. Get Product Assets
    prod_assets_res = client.get(f"/api/assets/product/{product_id}", headers=headers)
    assert prod_assets_res.status_code == 200
    prod_assets = prod_assets_res.json()
    assert isinstance(prod_assets, list)


def test_cloudinary_endpoints(client: TestClient):
    # Setup user
    email = "cloud_user@test.com"
    client.post("/api/auth/signup", json={"email": email, "password": "password123"})
    res = client.post("/api/auth/login", json={"email": email, "password": "password123"})
    headers = {"Authorization": f"Bearer {res.json()['access_token']}"}

    # 1. Upload signature
    sig_res = client.get("/api/cloudinary/upload-signature", headers=headers)
    assert sig_res.status_code == 200
    sig_data = sig_res.json()
    assert "signature" in sig_data
    assert "timestamp" in sig_data

    # 2. Aspect Ratio Transformation URL
    trans_res = client.get(
        "/api/cloudinary/transform/omnistage/products/sample_shoe?format=9:16",
        headers=headers
    )
    assert trans_res.status_code == 200
    trans_data = trans_res.json()
    assert "transformed_url" in trans_data
    assert "ar_9:16" in trans_data["transformed_url"]

    # 3. Transform All Formats
    all_res = client.get(
        "/api/cloudinary/transform-all/omnistage/products/sample_shoe",
        headers=headers
    )
    assert all_res.status_code == 200
    all_data = all_res.json()
    assert "formats" in all_data
    assert "1:1" in all_data["formats"]
    assert "4:5" in all_data["formats"]
    assert "9:16" in all_data["formats"]
    assert "16:9" in all_data["formats"]
    assert "optimized_url" in all_data
