"""
Central model registry.

Why re-export here?
- Alembic's env.py imports Base.metadata to detect all tables.
- For that to work, every model class must have been imported
  (and therefore registered on Base) before Alembic reads the metadata.
- Importing from app.models triggers all 7 model imports in one shot.
"""

from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.order import Order
from app.models.order_item import OrderItem

__all__ = [
    "User",
    "Category",
    "Product",
    "Cart",
    "CartItem",
    "Order",
    "OrderItem",
]
