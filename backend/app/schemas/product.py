"""
Pydantic schemas for Product CRUD operations.
"""

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.category import CategoryResponse


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, examples=["Velocity Sprint Tee"])
    description: str | None = Field(
        default=None,
        max_length=5000,
        examples=["Lightweight performance t-shirt for high-intensity training."],
    )
    price: float = Field(..., gt=0, examples=[49.99])
    stock: int = Field(default=0, ge=0, examples=[25])
    image_url: str | None = Field(
        default=None,
        max_length=500,
        examples=["/products/velocity_sprint_tee.png"],
    )
    category_id: int = Field(..., gt=0, examples=[1])


class ProductCreate(ProductBase):
    """Schema for creating a new product."""


class ProductUpdate(BaseModel):
    """Schema for updating an existing product."""

    name: str | None = Field(default=None, min_length=1, max_length=200, examples=["AeroFlex Leggings"])
    description: str | None = Field(
        default=None,
        max_length=5000,
        examples=["Updated product description."],
    )
    price: float | None = Field(default=None, gt=0, examples=[59.99])
    stock: int | None = Field(default=None, ge=0, examples=[12])
    image_url: str | None = Field(
        default=None,
        max_length=500,
        examples=["/products/aeroflex_leggings.png"],
    )
    category_id: int | None = Field(default=None, gt=0, examples=[2])


class ProductResponse(ProductBase):
    """Schema for returning product data in API responses."""

    id: int
    category: CategoryResponse

    model_config = ConfigDict(from_attributes=True)
