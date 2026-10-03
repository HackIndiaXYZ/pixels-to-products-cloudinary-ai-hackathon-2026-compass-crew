import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import Base, engine
from app.api import api_router
import app.models  # Ensures all models are registered with Base.metadata

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("omnistage.main")


from sqlalchemy import text


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Lifespan event handler for startup and shutdown procedures.
    Creates all database tables on initial startup.
    """
    logger.info("Initializing OmniStage AI database tables...")
    Base.metadata.create_all(bind=engine)

    # Ensure schema integrity for SQLite local deployments
    try:
        with engine.connect() as conn:
            res = conn.execute(text("PRAGMA table_info(users)")).fetchall()
            col_names = [row[1] for row in res]
            if "firebase_uid" not in col_names:
                logger.info("Auto-migrating SQLite users table: adding firebase_uid...")
                conn.execute(text("ALTER TABLE users ADD COLUMN firebase_uid VARCHAR(128)"))
                conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_firebase_uid ON users (firebase_uid)"))
                conn.commit()
    except Exception as exc:
        logger.warning(f"Database schema check notice: {exc}")

    logger.info("Database initialized successfully.")
    yield
    logger.info("Shutting down OmniStage AI backend service...")


app = FastAPI(
    title=settings.APP_NAME,
    description="OmniStage AI: Automated e-commerce product media pipeline for colorways and multi-format assets.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS Middleware
# Always allow the deployed OmniStage frontend in addition to configured origins.
allowed_origins = list(dict.fromkeys([
    *settings.BACKEND_CORS_ORIGINS,
    "https://omnistage-ai.netlify.app",
]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "message": "Internal Server Error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred."
        }
    )


# Mount All API Routes under /api
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
def root_endpoint() -> dict:
    """
    Root ping endpoint.
    """
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs"
    }


@app.get("/api/health", tags=["Health"])
def health_check() -> dict:
    """
    Health check endpoint for container and deployment monitors.
    """
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
