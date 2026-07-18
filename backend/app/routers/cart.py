"""
Cart router - endpoints for the authenticated user's shopping cart.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse
from app.services import cart_service

router = APIRouter(prefix="/api/cart", tags=["Cart"])


@router.get("", response_model=CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the current authenticated user's cart.
    Protected endpoint.
    """
    return cart_service.get_current_cart(db, current_user)


@router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_cart_item(
    item_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Add an item to the current user's cart.
    Protected endpoint.
    """
    return cart_service.add_item_to_cart(
        db,
        current_user,
        product_id=item_data.product_id,
        quantity=item_data.quantity,
    )


@router.put("/items/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update a cart item's quantity.
    Protected endpoint.
    """
    return cart_service.update_cart_item_quantity(
        db,
        current_user,
        item_id=item_id,
        quantity=item_data.quantity,
    )


@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Remove an item from the current user's cart.
    Protected endpoint.
    """
    return cart_service.remove_cart_item(db, current_user, item_id)
