from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import pytest

from app.core.database import Base, get_db
from app.core.security import create_access_token
from app.main import app
from app.models.user import User
from app.models.product import Product
from app.models.brand import Brand
from app.models.generation_job import GenerationJob
from app.models.asset import Asset

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_user_data_isolation():
    client = TestClient(app)
    db = TestingSessionLocal()

    # Create User A and User B
    user_a = User(id="user-a-111", email="usera@test.com", hashed_password="hash")
    user_b = User(id="user-b-222", email="userb@test.com", hashed_password="hash")
    db.add_all([user_a, user_b])
    db.commit()

    token_a = create_access_token({"sub": "user-a-111"})
    token_b = create_access_token({"sub": "user-b-222"})
    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # User A creates Product A
    prod_a = Product(
        id="prod-a-001",
        user_id="user-a-111",
        product_name="User A Shoe",
        cloudinary_public_id="pub-a",
        cloudinary_url="https://res.cloudinary.com/test/a.png"
    )
    # User A creates Brand A
    brand_a = Brand(
        id="brand-a-001",
        user_id="user-a-111",
        brand_name="Brand A"
    )
    # User A creates Job A
    job_a = GenerationJob(
        id="job-a-001",
        product_id="prod-a-001",
        status="COMPLETED",
        selected_colors=["Black"],
        selected_formats=["1:1"]
    )
    # User A creates Asset A
    asset_a = Asset(
        id="asset-a-001",
        generation_job_id="job-a-001",
        product_id="prod-a-001",
        colorway="Black",
        format="1:1",
        cloudinary_public_id="pub-asset-a",
        cloudinary_url="https://res.cloudinary.com/test/asset-a.png"
    )
    db.add_all([prod_a, brand_a, job_a, asset_a])
    db.commit()

    # User B tries to access User A's Product
    res = client.get("/api/products/prod-a-001", headers=headers_b)
    assert res.status_code == 404

    # User B tries to access User A's Brand
    res = client.get("/api/brands/brand-a-001", headers=headers_b)
    assert res.status_code == 404

    # User B tries to check status of User A's Job
    res = client.get("/api/generations/job-a-001/status", headers=headers_b)
    assert res.status_code == 404

    # User B tries to list assets for User A's Product
    res = client.get("/api/assets/product/prod-a-001", headers=headers_b)
    assert res.status_code == 404

    # User B tries to delete User A's Asset
    res = client.delete("/api/assets/asset-a-001", headers=headers_b)
    assert res.status_code == 404

    # User A can successfully access their own resources
    res = client.get("/api/products/prod-a-001", headers=headers_a)
    assert res.status_code == 200
    assert res.json()["product_name"] == "User A Shoe"

    res = client.get("/api/brands/brand-a-001", headers=headers_a)
    assert res.status_code == 200
    assert res.json()["brand_name"] == "Brand A"

    res = client.get("/api/generations/job-a-001/status", headers=headers_a)
    assert res.status_code == 200
    assert res.json()["id"] == "job-a-001"

    db.close()
