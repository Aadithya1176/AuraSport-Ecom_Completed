from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from ..auth import get_current_user
from ..database import get_db
from ..models import Cart, Products, Users
from ..schemas import CartCreate, CartResponse, CartUpdate, ErrorResponse, MessageResponse


cart_router = APIRouter(prefix="", tags=["Cart"])


def _cart_query(db: Session):
    return db.query(Cart).options(joinedload(Cart.product))


@cart_router.post(
    "/carts",
    response_model=CartResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add item to cart",
    description="Add a product to the authenticated user's cart. If the product already exists in the cart, quantity is increased.",
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def add_to_cart(
    payload: CartCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
) -> Cart:
    product = db.query(Products).filter(Products.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart_item = (
        _cart_query(db)
        .filter(Cart.user_id == current_user.id, Cart.product_id == payload.product_id)
        .first()
    )

    if cart_item:
        cart_item.qty += payload.qty
        db.commit()
        db.refresh(cart_item)
        return cart_item

    cart_item = Cart(user_id=current_user.id, product_id=payload.product_id, qty=payload.qty)
    db.add(cart_item)
    try:
        db.commit()
        db.refresh(cart_item)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Unable to add product to cart") from exc

    return _cart_query(db).filter(Cart.id == cart_item.id).first()


@cart_router.get(
    "/cart",
    response_model=list[CartResponse],
    summary="Get cart",
    description="Return the authenticated user's cart with nested product details.",
)
def get_cart(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
) -> list[Cart]:
    return _cart_query(db).filter(Cart.user_id == current_user.id).order_by(Cart.id.desc()).all()


@cart_router.patch(
    "/cart/{cart_item_id}",
    response_model=CartResponse,
    summary="Update cart item quantity",
    responses={404: {"model": ErrorResponse}},
)
def update_cart_item(
    cart_item_id: int,
    payload: CartUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
) -> Cart:
    cart_item = (
        _cart_query(db)
        .filter(Cart.id == cart_item_id, Cart.user_id == current_user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.qty = payload.qty
    db.commit()
    db.refresh(cart_item)
    return cart_item


@cart_router.delete(
    "/cart/{cart_item_id}",
    response_model=MessageResponse,
    summary="Delete cart item",
    responses={404: {"model": ErrorResponse}},
)
def delete_cart_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
) -> MessageResponse:
    cart_item = (
        db.query(Cart)
        .filter(Cart.id == cart_item_id, Cart.user_id == current_user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return MessageResponse(message="Cart item deleted successfully")
