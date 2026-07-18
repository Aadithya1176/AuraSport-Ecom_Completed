"""
Pydantic schemas for User and Authentication.

Design decisions:
- Separate schemas for each operation (Create, Login, Response, Token)
  following the "one schema per use case" principle. This prevents
  accidentally exposing fields (like hashed_password) or accepting
  fields that shouldn't be user-editable (like id).
- model_config with from_attributes=True: Allows Pydantic to read
  data directly from SQLAlchemy model instances (which use attribute
  access, not dict access). Without this, UserResponse(user) would fail.
- EmailStr: Validates email format at the schema level, before it
  ever reaches the database. Catches typos like "user@" early.
- password has min_length=8: A basic security requirement. In production,
  you'd add complexity rules.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """Schema for user registration."""

    name: str = Field(..., min_length=1, max_length=100, examples=["Aadithya"])
    email: EmailStr = Field(..., examples=["aadithya@example.com"])
    password: str = Field(..., min_length=8, max_length=128, examples=["strongpass123"])


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr = Field(..., examples=["aadithya@example.com"])
    password: str = Field(..., examples=["strongpass123"])


class UserResponse(BaseModel):
    """
    Schema for returning user data in API responses.

    Note: hashed_password is intentionally excluded.
    Never return password hashes to the client.
    """

    id: int
    name: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """Schema for JWT token response after login."""

    access_token: str
    token_type: str = "bearer"
