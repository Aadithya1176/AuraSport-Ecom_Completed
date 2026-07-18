"""
Application configuration using Pydantic Settings.

Why Pydantic Settings?
- Automatic validation of environment variables at startup.
- Type safety — if DATABASE_URL is missing, the app crashes immediately
  with a clear error instead of failing silently at the first DB call.
- Single source of truth for all configuration values.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:8080"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache
def get_settings() -> Settings:
    """
    Return a cached Settings instance.

    Why lru_cache?
    - The .env file is read and validated only once.
    - Every subsequent call returns the same object instantly.
    - This avoids re-reading the file on every request.
    """
    return Settings()
