import mimetypes
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from supabase import create_client

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


def get_supabase_client():
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase configuration is missing in backend")
    return create_client(settings.supabase_url, settings.supabase_key)


def save_product_image(upload: UploadFile | None) -> str | None:
    if upload is None or not upload.filename:
        return None

    settings = get_settings()
    extension = _validate_extension(upload.filename)
    generated_name = f"{uuid4().hex}{extension}"

    supabase = get_supabase_client()
    file_bytes = upload.file.read()

    content_type, _ = mimetypes.guess_type(upload.filename)
    if not content_type:
        content_type = "application/octet-stream"

    supabase.storage.from_("products").upload(
        path=generated_name,
        file=file_bytes,
        file_options={"content-type": content_type}
    )

    res = supabase.storage.from_("products").get_public_url(generated_name)
    return res


def delete_product_image(image_url: str | None) -> None:
    if not image_url:
        return

    try:
        if "/products/" in image_url:
            image_name = image_url.split("/products/")[-1]
            supabase = get_supabase_client()
            supabase.storage.from_("products").remove([image_name])
    except Exception as e:
        print(f"Failed to delete image {image_url} from Supabase: {e}")
