"""
Category model.

Design decisions:
- name has a unique constraint because duplicate category names
  would confuse both the UI and the admin.
- The relationship to products uses back_populates for explicit
  bidirectional navigation (Category.products ↔ Product.category).
"""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    # Relationships
    products: Mapped[list["Product"]] = relationship(
        "Product", back_populates="category"
    )
