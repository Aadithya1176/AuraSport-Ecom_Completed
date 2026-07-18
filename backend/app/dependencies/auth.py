"""
Authentication dependency for protecting routes.

Design decisions:
- OAuth2PasswordBearer: This tells FastAPI two things:
  1. Tokens are sent in the "Authorization: Bearer <token>" header.
  2. The Swagger UI should show an "Authorize" button that lets you
     paste a token. The tokenUrl points to the login endpoint so
     Swagger knows where to get tokens.
- get_current_user is a FastAPI dependency — any route that adds
  `current_user: User = Depends(get_current_user)` becomes a
  protected route automatically. No decorators, no middleware.
- The dependency extracts the email from the JWT "sub" claim,
  then fetches the full User from the database. This ensures:
  1. The token is valid and not expired.
  2. The user still exists (they might have been deleted after login).
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User

# tokenUrl is the path to the login endpoint (used by Swagger's Authorize button)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency that extracts and validates the current user from a JWT.

    Flow:
    1. FastAPI automatically extracts the Bearer token from the header.
    2. We decode the JWT to get the email (sub claim).
    3. We fetch the user from the database.
    4. If any step fails, return 401.

    Usage:
        @router.get("/protected")
        def protected_route(current_user: User = Depends(get_current_user)):
            return {"message": f"Hello, {current_user.name}"}
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode JWT
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    # Extract email from the "sub" claim
    email: str | None = payload.get("sub")
    if email is None:
        raise credentials_exception

    # Fetch user from database
    stmt = select(User).where(User.email == email)
    user = db.execute(stmt).scalar_one_or_none()

    if user is None:
        raise credentials_exception

    return user
