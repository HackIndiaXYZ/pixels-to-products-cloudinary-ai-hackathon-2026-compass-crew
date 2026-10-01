from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.products import router as products_router
from app.api.brands import router as brands_router
from app.api.cloudinary import router as cloudinary_router
from app.api.generation import router as generation_router
from app.api.assets import router as assets_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(products_router)
api_router.include_router(brands_router)
api_router.include_router(cloudinary_router)
api_router.include_router(generation_router)
api_router.include_router(assets_router)

__all__ = ["api_router"]
