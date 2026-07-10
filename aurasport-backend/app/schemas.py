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
    full_name: str | None = None
    phone_number: str | None = None
    address_line: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    preferred_contact: Literal["whatsapp", "call", "email"] | None = None


class UserProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    phone_number: str | None = Field(default=None, min_length=8, max_length=30)
    address_line: str | None = Field(default=None, min_length=8, max_length=255)
    city: str | None = Field(default=None, min_length=2, max_length=100)
    state: str | None = Field(default=None, min_length=2, max_length=100)
    postal_code: str | None = Field(default=None, min_length=4, max_length=20)
    preferred_contact: Literal["whatsapp", "call", "email"] | None = None


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


class OrderRequestCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=120, examples=["Aadithya R"])
    phone_number: str = Field(..., min_length=8, max_length=30, examples=["9876543210"])
    address_line: str = Field(..., min_length=8, max_length=255, examples=["12 Lake View Road"])
    city: str = Field(..., min_length=2, max_length=100, examples=["Chennai"])
    state: str = Field(..., min_length=2, max_length=100, examples=["Tamil Nadu"])
    postal_code: str = Field(..., min_length=4, max_length=20, examples=["600001"])
    contact_preference: Literal["whatsapp", "call", "email"] = Field(default="whatsapp")
    notes: str | None = Field(default=None, max_length=500, examples=["Please contact me after 6 PM"])


class OrderAdminUpdate(BaseModel):
    status: Literal["pending", "contacted", "confirmed", "packed", "shipped", "completed", "cancelled"]
    admin_notes: str | None = Field(default=None, max_length=500, examples=["Customer confirmed on WhatsApp"])


class OrderResponse(ORMBaseModel):
    id: int
    total_price: float = Field(..., gt=0)
    status: str
    customer_name: str
    phone_number: str
    address_line: str
    city: str
    state: str
    postal_code: str
    contact_preference: Literal["whatsapp", "call", "email"]
    notes: str | None = None
    admin_notes: str | None = None
    order_items: list[OrderItemResponse] = Field(default_factory=list)
