"""
Orders router - checkout and order history endpoints.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.order import OrderResponse
from app.services import order_service

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Convert the current user's cart into an order.
    Protected endpoint.
    """
    return order_service.checkout(db, current_user)


@router.get("", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get order history for the current user.
    Protected endpoint.
    """
    return order_service.get_order_history(db, current_user)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get details for a specific order.
    Protected endpoint.
    """
    return order_service.get_order_details(db, current_user, order_id)
