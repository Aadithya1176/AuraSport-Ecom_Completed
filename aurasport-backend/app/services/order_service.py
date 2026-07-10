from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from ..models import Cart, OrderItems, Orders, Users


def _order_query(db: Session):
    return (
        db.query(Orders)
        .options(joinedload(Orders.order_items).joinedload(OrderItems.product))
        .order_by(Orders.id.desc())
    )


def create_order_from_cart(db: Session, user: Users) -> Orders:
    cart_items = (
        db.query(Cart)
        .options(joinedload(Cart.product))
        .filter(Cart.user_id == user.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_price = sum(item.product.price * item.qty for item in cart_items)
    order = Orders(user_id=user.id, total_price=total_price, status="pending")
    db.add(order)
    db.flush()

    for item in cart_items:
        db.add(
            OrderItems(
                order_id=order.id,
                product_id=item.product_id,
                quantity=item.qty,
                price=item.product.price,
            )
        )

    for item in cart_items:
        db.delete(item)

    db.commit()
    return get_order_for_user(db, user.id, order.id)


def get_orders_for_user(db: Session, user_id: int) -> list[Orders]:
    return _order_query(db).filter(Orders.user_id == user_id).all()


def get_order_for_user(db: Session, user_id: int, order_id: int) -> Orders:
    order = _order_query(db).filter(Orders.user_id == user_id, Orders.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
