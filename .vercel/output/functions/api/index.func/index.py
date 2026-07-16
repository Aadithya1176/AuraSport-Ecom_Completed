import sys
import os

# Add the aurasport-backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "aurasport-backend"))

from mangum import Mangum  # noqa: E402

from app.main import app  # noqa: E402
from app.init_db import init_db  # noqa: E402

# Vercel serverless functions don't fire ASGI startup events,
# so we run database initialization eagerly at import time.
try:
    init_db()
except Exception as e:
    print(f"init_db warning: {e}")

# Mangum wraps the FastAPI ASGI app into a handler that Vercel can call.
# api_gateway_base_path="/api" strips the /api prefix so FastAPI sees
# /register instead of /api/register.
handler = Mangum(app, lifespan="off", api_gateway_base_path="/api")

