"""
Product model.

Design decisions:
- price uses Float for simplicity. In a payment-critical system you'd
  use Numeric(10, 2), but for this project Float is sufficient.
- stock defaults to 0 so newly created products don't accidentally
  appear as "in stock" without explicit inventory.
- image_url is nullable because a product can exist without an image.
- category_id is a foreign key to categories.id.
"""

from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), nullable=False
    )

    # Relationships
    category: Mapped["Category"] = relationship(
        "Category", back_populates="products"
    )
    cart_items: Mapped[list["CartItem"]] = relationship(
        "CartItem", back_populates="product"
    )
    order_items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem", back_populates="product"
    )
