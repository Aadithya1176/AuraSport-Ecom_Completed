"""
Pydantic schemas for Shopping Cart operations.
"""

from pydantic import BaseModel, ConfigDict, Field


class CartProductResponse(BaseModel):
    """Minimal product data returned inside cart items."""

    id: int
    name: str
    price: float
    image_url: str | None

    model_config = ConfigDict(from_attributes=True)


class CartItemResponse(BaseModel):
    """Cart item data returned in API responses."""

    id: int
    product_id: int
    quantity: int
    line_total: float
    product: CartProductResponse


class CartResponse(BaseModel):
    """Schema for returning the current user's cart."""

    id: int
    user_id: int
    items: list[CartItemResponse]
    total_items: int
    total_amount: float


class CartItemCreate(BaseModel):
    """Schema for adding a product to the cart."""

    product_id: int = Field(..., gt=0, examples=[1])
    quantity: int = Field(default=1, gt=0, examples=[2])


class CartItemUpdate(BaseModel):
    """Schema for updating a cart item's quantity."""

    quantity: int = Field(..., gt=0, examples=[3])
