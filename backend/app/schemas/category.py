"""
Pydantic schemas for Category CRUD operations.
"""

from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["Running Shoes"])


class CategoryCreate(CategoryBase):
    """Schema for creating a new category."""
    pass


class CategoryUpdate(BaseModel):
    """Schema for updating an existing category."""
    name: str | None = Field(None, min_length=1, max_length=100, examples=["Apparel"])


class CategoryResponse(CategoryBase):
    """Schema for returning category data in API responses."""
    id: int

    model_config = ConfigDict(from_attributes=True)
