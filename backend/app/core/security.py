"""
Security utilities: password hashing and JWT token management.

Design decisions:
- passlib with bcrypt: Industry-standard password hashing. bcrypt is
  intentionally slow (adaptive cost factor) to resist brute-force attacks.
  passlib wraps it with a clean, future-proof API that handles salt
  generation automatically.
- python-jose for JWT: Lightweight library that supports HS256 signing.
  We encode the user's email as the "sub" (subject) claim, which is
  the standard JWT claim for identifying the token holder.
- Token expiry: Tokens expire after ACCESS_TOKEN_EXPIRE_MINUTES (from .env).
  After expiry, the user must log in again. This limits the damage window
  if a token is leaked.
"""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

# ──────────────────────────────────────────────
# Password Hashing
# ──────────────────────────────────────────────

# CryptContext manages the hashing algorithm and handles:
# - Automatic salt generation
# - Algorithm versioning (if we switch from bcrypt later, old hashes still verify)
# - deprecated="auto" means if we add a new scheme, old ones are still accepted
#   but new passwords are hashed with the latest scheme.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ──────────────────────────────────────────────
# JWT Token Management
# ──────────────────────────────────────────────

def create_access_token(data: dict) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload to encode. Typically {"sub": user_email}.

    Returns:
        Encoded JWT string.

    The token includes an "exp" (expiration) claim set to
    ACCESS_TOKEN_EXPIRE_MINUTES from now. After this time,
    any attempt to decode the token will raise an error.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """
    Decode and validate a JWT access token.

    Args:
        token: The JWT string from the Authorization header.

    Returns:
        The decoded payload dict if valid, None if invalid or expired.

    Why return None instead of raising?
    - The caller (get_current_user dependency) handles the HTTP 401 response.
    - Returning None keeps this function pure and testable without FastAPI.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
