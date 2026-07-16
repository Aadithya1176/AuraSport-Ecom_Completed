import sys
import os
import traceback

# Add the aurasport-backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "aurasport-backend"))

_startup_error = None

try:
    from mangum import Mangum
    from app.main import app
    from app.init_db import init_db

    # Vercel serverless functions don't fire ASGI startup events,
    # so we run database initialization eagerly at import time.
    try:
        init_db()
    except Exception as e:
        print(f"init_db warning: {e}")
        traceback.print_exc()

    # Mangum wraps the FastAPI ASGI app into a handler that Vercel can call.
    # api_gateway_base_path="/api" strips the /api prefix so FastAPI sees
    # /register instead of /api/register.
    handler = Mangum(app, lifespan="off", api_gateway_base_path="/api")

except Exception as e:
    _startup_error = traceback.format_exc()
    print(f"FATAL STARTUP ERROR: {e}")
    print(_startup_error)

    # Fallback: create a minimal FastAPI app that returns the error
    from mangum import Mangum
    from fastapi import FastAPI

    fallback_app = FastAPI()

    @fallback_app.get("/{path:path}")
    @fallback_app.post("/{path:path}")
    def error_handler(path: str = ""):
        return {
            "error": "Backend failed to start",
            "detail": _startup_error,
            "env_check": {
                "DATABASE_URL_set": bool(os.getenv("DATABASE_URL")),
                "SECRET_KEY_set": bool(os.getenv("SECRET_KEY")),
                "APP_ENV": os.getenv("APP_ENV", "not set"),
            },
        }

    handler = Mangum(fallback_app, lifespan="off", api_gateway_base_path="/api")
