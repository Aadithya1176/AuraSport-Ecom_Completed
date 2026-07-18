"""
CartItem model.

Design decisions:
- quantity defaults to 1 (adding an item without specifying quantity
  means you want 1 of it).
- The composite of cart_id + product_id should logically be unique
  (you don't want two separate rows for the same product in a cart,
  you increase the quantity instead). This is enforced in the service
  layer rather than a DB constraint, giving us more control over the
  error message.
"""

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cart_id: Mapped[int] = mapped_column(
        ForeignKey("carts.id"), nullable=False
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Relationships
    cart: Mapped["Cart"] = relationship("Cart", back_populates="items")
    product: Mapped["Product"] = relationship(
        "Product", back_populates="cart_items"
    )
