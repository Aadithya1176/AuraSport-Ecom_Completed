from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .core.config import get_settings
from .core.exception_handlers import register_exception_handlers
from .core.logging_config import setup_logging
from .init_db import init_db
from .middleware.request_logging import RequestLoggingMiddleware
from .routes.cart import cart_router
from .routes.categories import category_router
from .routes.orders import orders_router
from .routes.products import router as products_router
from .routes.users import user_router
from .utils.files import ensure_runtime_directories


setup_logging()
settings = get_settings()
ensure_runtime_directories()

app = FastAPI(
    title="AuraSport Backend",
    description="Production-style localhost API for the AuraSport e-commerce backend.",
    version="1.0.0",
    openapi_tags=[
        {"name": "Users", "description": "Authentication and user management endpoints."},
        {"name": "Products", "description": "Product catalog management, image upload, and search APIs."},
        {"name": "Categories", "description": "Category management and category product listings."},
        {"name": "Cart", "description": "Shopping cart APIs for authenticated users."},
        {"name": "Orders", "description": "Order checkout and order history endpoints."},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)
app.mount("/uploads", StaticFiles(directory=settings.uploads_dir), name="uploads")

register_exception_handlers(app)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(user_router)
app.include_router(products_router)
app.include_router(category_router)
app.include_router(cart_router)
app.include_router(orders_router)
