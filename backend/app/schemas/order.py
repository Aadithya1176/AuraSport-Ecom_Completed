"""
Pydantic schemas for Order operations.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OrderProductResponse(BaseModel):
    """Minimal product data returned inside order items."""

    id: int
    name: str
    image_url: str | None

    model_config = ConfigDict(from_attributes=True)


class OrderItemResponse(BaseModel):
    """Order item data returned in API responses."""

    id: int
    product_id: int
    quantity: int
    price: float
    line_total: float
    product: OrderProductResponse


class OrderResponse(BaseModel):
    """Schema for returning order data in API responses."""

    id: int
    user_id: int
    status: str
    created_at: datetime
    items: list[OrderItemResponse]
    total_items: int
    total_amount: float

