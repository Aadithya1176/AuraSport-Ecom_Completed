import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from ..core.config import get_settings


def ensure_runtime_directories() -> None:
    settings = get_settings()
    settings.uploads_dir.mkdir(parents=True, exist_ok=True)
    settings.logs_dir.mkdir(parents=True, exist_ok=True)


def _validate_extension(filename: str) -> str:
    settings = get_settings()
    extension = Path(filename).suffix.lower()
    if extension not in settings.allowed_image_extensions:
        allowed = ", ".join(settings.allowed_image_extensions)
        raise HTTPException(status_code=400, detail=f"Unsupported image format. Allowed formats: {allowed}")
    return extension


def save_product_image(upload: UploadFile | None) -> str | None:
    if upload is None or not upload.filename:
        return None

    settings = get_settings()
    extension = _validate_extension(upload.filename)
    generated_name = f"{uuid4().hex}{extension}"
    destination = settings.uploads_dir / generated_name

    with destination.open("wb") as file_object:
        shutil.copyfileobj(upload.file, file_object)

    return f"/uploads/{generated_name}"


def delete_product_image(image_url: str | None) -> None:
    if not image_url:
        return

    settings = get_settings()
    image_name = image_url.removeprefix("/uploads/")
    image_path = settings.uploads_dir / image_name

    if image_path.exists():
        image_path.unlink()
