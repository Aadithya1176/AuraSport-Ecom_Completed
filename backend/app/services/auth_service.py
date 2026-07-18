"""
Authentication service — business logic for register and login.

Design decisions:
- Services are separated from routers because:
  1. Routers handle HTTP concerns (status codes, request parsing).
  2. Services handle business logic (duplicate checks, password verification).
  This separation makes the business logic testable without HTTP.
- We raise HTTPException here (not in the router) because the service
  knows *why* something failed (duplicate email, wrong password).
  The router just calls the service and returns the result.
- select() uses SQLAlchemy 2.0 style queries (not the legacy Query API).
"""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


def register_user(db: Session, user_data: UserCreate) -> User:
    """
    Register a new user.

    Steps:
    1. Check if the email already exists (unique constraint).
    2. Hash the password (never store plain text).
    3. Create the User record in the database.
    4. Return the created user.

    Raises:
        HTTPException 400: If email is already registered.
    """
    # Check for duplicate email
    stmt = select(User).where(User.email == user_data.email)
    existing_user = db.execute(stmt).scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )

    # Create user with hashed password
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str) -> dict:
    """
    Authenticate a user and return a JWT token.

    Steps:
    1. Look up the user by email.
    2. Verify the password against the stored hash.
    3. Generate a JWT access token with the user's email as the subject.

    Raises:
        HTTPException 401: If email not found or password doesn't match.

    Why a single generic error message for both cases?
    - Telling the user "email not found" vs "wrong password" leaks
      information about which emails are registered. A single message
      prevents email enumeration attacks.
    """
    stmt = select(User).where(User.email == email)
    user = db.execute(stmt).scalar_one_or_none()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT with user's email as the subject claim
    access_token = create_access_token(data={"sub": user.email})

    return {"access_token": access_token, "token_type": "bearer"}
