"""
Order service - business logic for checkout and order history operations.
"""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User


def _get_cart_with_items(db: Session, user_id: int) -> Cart | None:
    """Retrieve the user's cart with cart items and related products."""
    stmt = (
        select(Cart)
        .options(selectinload(Cart.items).selectinload(CartItem.product))
        .where(Cart.user_id == user_id)
    )
    return db.execute(stmt).scalar_one_or_none()


def _get_order_by_id(db: Session, user_id: int, order_id: int) -> Order:
    """Retrieve one order that belongs to the authenticated user."""
    stmt = (
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .where(Order.id == order_id, Order.user_id == user_id)
    )
    order = db.execute(stmt).scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    return order


def _serialize_order(order: Order) -> dict:
    """Convert an order model into the response payload shape."""
    items: list[dict] = []
    total_items = 0
    total_amount = 0.0

    for item in order.items:
        line_total = item.quantity * item.price
        total_items += item.quantity
        total_amount += line_total
        items.append(
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price,
                "line_total": line_total,
                "product": item.product,
            }
        )

    return {
        "id": order.id,
        "user_id": order.user_id,
        "status": order.status,
        "created_at": order.created_at,
        "items": items,
        "total_items": total_items,
        "total_amount": total_amount,
    }


def checkout(db: Session, user: User) -> dict:
    """Convert the current cart into a new order and clear the cart."""
    cart = _get_cart_with_items(db, user.id)

    if cart is None or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot checkout an empty cart.",
        )

    order = Order(user_id=user.id, status="pending")
    db.add(order)
    db.flush()

    for cart_item in cart.items:
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
            )
        )

    for cart_item in list(cart.items):
        db.delete(cart_item)

    db.commit()
    db.refresh(order)
    order = _get_order_by_id(db, user.id, order.id)
    return _serialize_order(order)


def get_order_history(db: Session, user: User) -> list[dict]:
    """Retrieve all orders for the authenticated user."""
    stmt = (
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .where(Order.user_id == user.id)
        .order_by(Order.created_at.desc(), Order.id.desc())
    )
    orders = db.execute(stmt).scalars().all()
    return [_serialize_order(order) for order in orders]


def get_order_details(db: Session, user: User, order_id: int) -> dict:
    """Retrieve one order for the authenticated user."""
    order = _get_order_by_id(db, user.id, order_id)
    return _serialize_order(order)
