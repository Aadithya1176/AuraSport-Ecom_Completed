"""
FastAPI application entry point.

This is the root of the entire backend. It:
1. Creates the FastAPI app instance.
2. Configures CORS middleware so the React frontend can call the API.
3. Registers all routers (auth, categories, products, cart, orders).
4. Provides a health-check endpoint to verify the server is alive.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import auth as auth_router
from app.routers import categories as categories_router

settings = get_settings()

app = FastAPI(
    title="AuraSport API",
    description="Backend API for the AuraSport e-commerce platform",
    version="1.0.0",
)

# CORS Middleware
# Without this, the browser blocks all requests from localhost:5173 (React)
# to localhost:8000 (FastAPI) because they are on different ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Routers
# ──────────────────────────────────────────────
app.include_router(auth_router.router)
app.include_router(categories_router.router)


@app.get("/api/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """
    Health check endpoint.

    Returns a simple JSON response to verify:
    - The FastAPI server is running.
    - The configuration loaded correctly.
    """
    return {"status": "healthy", "message": "AuraSport API is running"}
