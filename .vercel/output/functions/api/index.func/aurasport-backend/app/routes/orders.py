from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..auth import admin_required, get_current_user
from ..database import get_db
from ..models import Users
from ..schemas import ErrorResponse, OrderAdminUpdate, OrderRequestCreate, OrderResponse
from ..services.order_service import (
    create_order_from_cart,
    get_all_orders,
    get_order_by_id,
    get_order_for_user,
    get_orders_for_user,
    update_order_by_admin,
)


orders_router = APIRouter(prefix="", tags=["Orders"])


@orders_router.post(
    "/orders/request",
    response_model=OrderResponse,
    summary="Create order request",
    description="Convert the authenticated user's cart into a manual order request with contact and delivery details.",
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def create_order_request(
    payload: OrderRequestCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    return create_order_from_cart(db, current_user, payload)


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


@orders_router.get(
    "/admin/orders",
    response_model=list[OrderResponse],
    summary="List all order requests",
    description="Admin-only endpoint to review every order request in the system.",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)
def admin_get_orders(
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return get_all_orders(db)


@orders_router.get(
    "/admin/orders/{order_id}",
    response_model=OrderResponse,
    summary="Get one order request",
    description="Admin-only endpoint to inspect a single order request.",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def admin_get_order(
    order_id: int,
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return get_order_by_id(db, order_id)


@orders_router.patch(
    "/admin/orders/{order_id}",
    response_model=OrderResponse,
    summary="Update order request",
    description="Admin-only endpoint to update order request status and admin notes.",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def admin_update_order(
    order_id: int,
    payload: OrderAdminUpdate,
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
):
    return update_order_by_admin(db, order_id, payload)
