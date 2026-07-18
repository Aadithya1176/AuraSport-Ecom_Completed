"""
Cart service - business logic for Shopping Cart operations.
"""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.product import Product
from app.models.user import User


def _get_or_create_cart(db: Session, user_id: int) -> Cart:
    """Return the user's cart, creating it when it does not exist yet."""
    stmt = (
        select(Cart)
        .options(selectinload(Cart.items).selectinload(CartItem.product))
        .where(Cart.user_id == user_id)
    )
    cart = db.execute(stmt).scalar_one_or_none()

    if cart is None:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
        cart = db.execute(stmt).scalar_one()

    return cart


def _get_product_by_id(db: Session, product_id: int) -> Product:
    """Retrieve a product by ID or raise a 404 error."""
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )
    return product


def _get_cart_item_by_id(cart: Cart, item_id: int) -> CartItem:
    """Find a cart item that belongs to the given cart."""
    cart_item = next((item for item in cart.items if item.id == item_id), None)
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found.",
        )
    return cart_item


def _serialize_cart(cart: Cart) -> dict:
    """Convert a cart model into the response payload shape."""
    items: list[dict] = []
    total_items = 0
    total_amount = 0.0

    for item in cart.items:
        line_total = item.quantity * item.product.price
        total_items += item.quantity
        total_amount += line_total
        items.append(
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "line_total": line_total,
                "product": item.product,
            }
        )

    return {
        "id": cart.id,
        "user_id": cart.user_id,
        "items": items,
        "total_items": total_items,
        "total_amount": total_amount,
    }


def get_current_cart(db: Session, user: User) -> dict:
    """Retrieve the authenticated user's cart."""
    cart = _get_or_create_cart(db, user.id)
    return _serialize_cart(cart)


def add_item_to_cart(db: Session, user: User, product_id: int, quantity: int) -> dict:
    """Add a product to the user's cart or increase quantity if it already exists."""
    product = _get_product_by_id(db, product_id)
    cart = _get_or_create_cart(db, user.id)

    existing_item = next((item for item in cart.items if item.product_id == product_id), None)

    if existing_item:
        existing_item.quantity += quantity
    else:
        db.add(
            CartItem(
                cart_id=cart.id,
                product_id=product.id,
                quantity=quantity,
            )
        )

    db.commit()
    db.refresh(cart)
    cart = _get_or_create_cart(db, user.id)
    return _serialize_cart(cart)


def update_cart_item_quantity(db: Session, user: User, item_id: int, quantity: int) -> dict:
    """Update the quantity of a cart item."""
    cart = _get_or_create_cart(db, user.id)
    cart_item = _get_cart_item_by_id(cart, item_id)
    cart_item.quantity = quantity

    db.commit()
    db.refresh(cart)
    cart = _get_or_create_cart(db, user.id)
    return _serialize_cart(cart)


def remove_cart_item(db: Session, user: User, item_id: int) -> dict:
    """Remove an item from the authenticated user's cart."""
    cart = _get_or_create_cart(db, user.id)
    cart_item = _get_cart_item_by_id(cart, item_id)

    db.delete(cart_item)
    db.commit()
    db.refresh(cart)
    cart = _get_or_create_cart(db, user.id)
    return _serialize_cart(cart)
