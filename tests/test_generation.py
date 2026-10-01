from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


def test_generation_job_flow(client: TestClient):
    # Setup user and product
    email = "gen_user@test.com"
    client.post("/api/auth/signup", json={"email": email, "password": "password123"})
    res = client.post("/api/auth/login", json={"email": email, "password": "password123"})
    headers = {"Authorization": f"Bearer {res.json()['access_token']}"}

    prod_res = client.post(
        "/api/products/",
        json={
            "product_name": "Urban Runner",
            "category": "Sneakers",
            "cloudinary_public_id": "omnistage/products/sample_runner",
            "cloudinary_url": "https://res.cloudinary.com/demo/image/upload/sample_runner.jpg"
        },
        headers=headers
    )
    product_id = prod_res.json()["id"]

    # 1. Trigger Generation Job
    gen_payload = {
        "selected_colors": ["Triple Black", "Crimson Red"],
        "selected_formats": ["1:1", "9:16"]
    }
    gen_res = client.post(
        f"/api/generations/{product_id}/generate",
        json=gen_payload,
        headers=headers
    )
    assert gen_res.status_code == 202
    job = gen_res.json()
    assert job["product_id"] == product_id
    assert "id" in job
    job_id = job["id"]

    # 2. Check Job Status
    status_res = client.get(f"/api/generations/{job_id}/status", headers=headers)
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["id"] == job_id
    assert status_data["status"] in ["QUEUED", "PROCESSING", "GENERATING", "TRANSFORMING", "COMPLETED"]
