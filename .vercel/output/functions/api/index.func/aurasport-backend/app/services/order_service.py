from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from ..models import Cart, OrderItems, Orders, Users
from ..schemas import OrderAdminUpdate, OrderRequestCreate


def _order_query(db: Session):
    return (
        db.query(Orders)
        .options(joinedload(Orders.order_items).joinedload(OrderItems.product))
        .order_by(Orders.id.desc())
    )


def create_order_from_cart(db: Session, user: Users, payload: OrderRequestCreate) -> Orders:
    cart_items = (
        db.query(Cart)
        .options(joinedload(Cart.product))
        .filter(Cart.user_id == user.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_price = sum(item.product.price * item.qty for item in cart_items)
    order = Orders(
        user_id=user.id,
        total_price=total_price,
        customer_name=payload.customer_name.strip(),
        phone_number=payload.phone_number.strip(),
        address_line=payload.address_line.strip(),
        city=payload.city.strip(),
        state=payload.state.strip(),
        postal_code=payload.postal_code.strip(),
        contact_preference=payload.contact_preference,
        notes=payload.notes.strip() if payload.notes else None,
        status="pending",
    )
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


def get_all_orders(db: Session) -> list[Orders]:
    return _order_query(db).all()


def get_order_by_id(db: Session, order_id: int) -> Orders:
    order = _order_query(db).filter(Orders.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def update_order_by_admin(db: Session, order_id: int, payload: OrderAdminUpdate) -> Orders:
    order = get_order_by_id(db, order_id)
    order.status = payload.status
    order.admin_notes = payload.admin_notes.strip() if payload.admin_notes else None
    db.commit()
    db.refresh(order)
    return get_order_by_id(db, order_id)
