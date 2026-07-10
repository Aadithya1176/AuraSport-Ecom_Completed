import re
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


class ORMBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class MessageResponse(BaseModel):
    message: str = Field(..., examples=["Product deleted successfully"])


class ErrorPayload(BaseModel):
    type: str
    message: str
    details: object | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorPayload


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, examples=["Football"])


class CategoryResponse(ORMBaseModel):
    id: int
    name: str


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, examples=["Nike Football"])
    price: float = Field(..., gt=0, examples=[1200])
    category_id: int | None = Field(default=None, gt=0, examples=[1])


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    price: float | None = Field(default=None, gt=0)
    category_id: int | None = Field(default=None, gt=0)


class ProductSummaryResponse(ORMBaseModel):
    id: int
    name: str
    price: float
    image_url: str | None = None


class ProductResponse(ProductSummaryResponse):
    category: CategoryResponse | None = None


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, examples=["aadhi1176"])
    email: str = Field(..., examples=["aadhi@example.com"])
    password: str = Field(..., min_length=6, max_length=128, examples=["secret123"])

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized_value = value.strip().lower()
        if not EMAIL_REGEX.match(normalized_value):
            raise ValueError("Please enter a valid email address")
        return normalized_value


class UserLogin(BaseModel):
    email: str = Field(..., examples=["aadhi@example.com"])
    password: str = Field(..., min_length=6, max_length=128, examples=["secret123"])

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized_value = value.strip().lower()
        if not EMAIL_REGEX.match(normalized_value):
            raise ValueError("Please enter a valid email address")
        return normalized_value


class UserResponse(ORMBaseModel):
    id: int
    username: str
    email: str
    role: Literal["user", "admin"]


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class CartCreate(BaseModel):
    qty: int = Field(..., gt=0, examples=[1])
    product_id: int = Field(..., gt=0, examples=[7])


class CartUpdate(BaseModel):
    qty: int = Field(..., gt=0, examples=[2])


class CartResponse(ORMBaseModel):
    id: int
    qty: int
    product: ProductSummaryResponse


class OrderItemResponse(ORMBaseModel):
    id: int
    quantity: int
    price: float
    product: ProductSummaryResponse


class OrderResponse(ORMBaseModel):
    id: int
    total_price: float = Field(..., gt=0)
    status: str
    order_items: list[OrderItemResponse] = Field(default_factory=list)
