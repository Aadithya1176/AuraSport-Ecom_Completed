"""
Authentication router — register, login, and current user endpoints.

Design decisions:
- All auth endpoints are prefixed with /api/auth for clear namespacing.
- POST for register and login (they create resources / perform actions).
- GET for /me (it reads the current user, no side effects).
- status_code=201 for register (a new resource was created).
- response_model ensures the response shape is validated and documented
  in Swagger. It also strips any extra fields (like hashed_password)
  that the SQLAlchemy model might carry.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.auth_service import authenticate_user, register_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
    summary="Register a new user",
)
def register(user_data: UserCreate, db: Session = Depends(get_db)) -> User:
    """
    Create a new user account.

    - Validates email format and password length (via Pydantic schema).
    - Checks for duplicate email.
    - Hashes the password before storing.
    - Returns the created user (without password hash).
    """
    return register_user(db=db, user_data=user_data)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive a JWT token",
)
def login(user_data: UserLogin, db: Session = Depends(get_db)) -> dict:
    """
    Authenticate with email and password.

    - Returns a JWT access token on success.
    - Returns 401 if credentials are invalid.
    - Use the token in the Authorization header: `Bearer <token>`
    """
    return authenticate_user(db=db, email=user_data.email, password=user_data.password)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user",
)
def get_me(current_user: User = Depends(get_current_user)) -> User:
    """
    Return the currently authenticated user's profile.

    This is a protected route — requires a valid JWT in the
    Authorization header. Demonstrates how `get_current_user`
    works as a dependency.
    """
    return current_user
