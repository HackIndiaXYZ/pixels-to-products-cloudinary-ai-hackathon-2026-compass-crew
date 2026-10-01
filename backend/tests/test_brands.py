from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


def get_auth_headers(client: TestClient, email: str = "brand_tester@test.com") -> dict:
    client.post("/api/auth/signup", json={"email": email, "password": "password123"})
    res = client.post("/api/auth/login", json={"email": email, "password": "password123"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_brand_dna_crud(client: TestClient):
    headers = get_auth_headers(client, "luxury_brand@test.com")

    # 1. Create Brand
    brand_payload = {
        "brand_name": "Aether Studio",
        "primary_color": "#000000",
        "secondary_color": "#D4AF37",
        "aesthetic": "Minimalist Luxury",
        "lighting": "Soft Studio",
        "background_style": "Polished Concrete"
    }
    res = client.post("/api/brands/", json=brand_payload, headers=headers)
    assert res.status_code == 201
    brand = res.json()
    assert brand["brand_name"] == "Aether Studio"
    brand_id = brand["id"]

    # 2. List Brands
    list_res = client.get("/api/brands/", headers=headers)
    assert list_res.status_code == 200
    assert any(b["id"] == brand_id for b in list_res.json())

    # 3. Get Single Brand
    single_res = client.get(f"/api/brands/{brand_id}", headers=headers)
    assert single_res.status_code == 200
    assert single_res.json()["aesthetic"] == "Minimalist Luxury"

    # 4. Update Brand
    update_res = client.put(
        f"/api/brands/{brand_id}",
        json={"lighting": "Dramatic Rim Lighting", "primary_color": "#111111"},
        headers=headers
    )
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["lighting"] == "Dramatic Rim Lighting"
    assert updated["primary_color"] == "#111111"
