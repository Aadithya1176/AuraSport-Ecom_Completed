import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


APP_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = APP_DIR.parent
ENV_PATH = APP_DIR / ".env"

load_dotenv(ENV_PATH)


@dataclass(frozen=True)
class Settings:
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    cors_origins: list[str]
    uploads_dir: Path
    logs_dir: Path
    log_file: Path
    allowed_image_extensions: tuple[str, ...]
    max_upload_size_bytes: int


@lru_cache
def get_settings() -> Settings:
    database_url = os.getenv("DATABASE_URL", "").strip()
    secret_key = os.getenv("SECRET_KEY", "")
    algorithm = os.getenv("ALGORITHM", "HS256")
    cors_origins_raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )

    if not database_url:
        database_url = f"sqlite:///{(PROJECT_DIR / 'aurasport.db').as_posix()}"

    if not secret_key:
        raise RuntimeError("SECRET_KEY environment variable is not set in aurasport-backend/app/.env")

    uploads_dir = PROJECT_DIR / "uploads"
    logs_dir = PROJECT_DIR / "logs"

    return Settings(
        database_url=database_url,
        secret_key=secret_key,
        algorithm=algorithm,
        access_token_expire_minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")),
        cors_origins=[origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()],
        uploads_dir=uploads_dir,
        logs_dir=logs_dir,
        log_file=logs_dir / "app.log",
        allowed_image_extensions=(".jpg", ".jpeg", ".png", ".webp"),
        max_upload_size_bytes=int(os.getenv("MAX_UPLOAD_SIZE_BYTES", str(5 * 1024 * 1024))),
    )
