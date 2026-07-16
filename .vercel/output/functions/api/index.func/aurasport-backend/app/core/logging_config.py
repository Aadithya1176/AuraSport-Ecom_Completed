import logging
from pathlib import Path

from .config import get_settings


def setup_logging() -> None:
    settings = get_settings()
    
    handlers: list[logging.Handler] = [logging.StreamHandler()]
    
    if settings.app_env != "production":
        settings.logs_dir.mkdir(parents=True, exist_ok=True)
        Path(settings.log_file).touch(exist_ok=True)
        handlers.append(logging.FileHandler(settings.log_file, encoding="utf-8"))

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=handlers,
        force=True,
    )
