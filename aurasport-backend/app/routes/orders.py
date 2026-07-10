from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Users
from ..schemas import ErrorResponse, OrderResponse
from ..services.order_service import create_order_from_cart, get_order_for_user, get_orders_for_user


orders_router = APIRouter(prefix="", tags=["Orders"])


@orders_router.post(
    "/orders/checkout",
    response_model=OrderResponse,
    summary="Checkout cart",
    description="Convert the authenticated user's cart into an order with nested item and product details.",
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def checkout(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    return create_order_from_cart(db, current_user)


@orders_router.get(
    "/orders",
    response_model=list[OrderResponse],
    summary="List orders",
    description="Return all orders for the authenticated user with order item details.",
)
def get_orders(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    return get_orders_for_user(db, current_user.id)


@orders_router.get(
    "/orders/{order_id}",
    response_model=OrderResponse,
    summary="Get order by ID",
    description="Return a single order with nested order items and product details.",
    responses={404: {"model": ErrorResponse}},
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    return get_order_for_user(db, current_user.id, order_id)
