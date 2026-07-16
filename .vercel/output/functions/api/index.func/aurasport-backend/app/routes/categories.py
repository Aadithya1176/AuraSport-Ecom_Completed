from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from ..auth import admin_required
from ..database import get_db
from ..models import Categories, Products, Users
from ..schemas import CategoryCreate, CategoryResponse, ErrorResponse, MessageResponse, ProductResponse


category_router = APIRouter(prefix="", tags=["Categories"])


def _category_query(db: Session):
    return db.query(Categories).options(joinedload(Categories.products).joinedload(Products.category))


def _get_category_or_404(db: Session, category_id: int) -> Categories:
    category = db.query(Categories).filter(Categories.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@category_router.post(
    "/categories",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create category",
    description="Create a product category.",
    responses={400: {"model": ErrorResponse}},
)
def create_category(
    payload: CategoryCreate,
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
) -> Categories:
    category = Categories(name=payload.name.strip())
    db.add(category)
    try:
        db.commit()
        db.refresh(category)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Category name already exists") from exc
    return category


@category_router.get(
    "/categories",
    response_model=list[CategoryResponse],
    summary="List categories",
    description="Return all product categories.",
)
def get_categories(db: Session = Depends(get_db)) -> list[Categories]:
    return db.query(Categories).order_by(Categories.name.asc()).all()


@category_router.get(
    "/categories/{category_id}",
    response_model=CategoryResponse,
    summary="Get category by ID",
    responses={404: {"model": ErrorResponse}},
)
def get_category(category_id: int, db: Session = Depends(get_db)) -> Categories:
    return _get_category_or_404(db, category_id)


@category_router.put(
    "/categories/{category_id}",
    response_model=CategoryResponse,
    summary="Update category",
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def update_category(
    category_id: int,
    payload: CategoryCreate,
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
) -> Categories:
    category = _get_category_or_404(db, category_id)
    category.name = payload.name.strip()
    try:
        db.commit()
        db.refresh(category)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Category name already exists") from exc
    return category


@category_router.delete(
    "/categories/{category_id}",
    response_model=MessageResponse,
    summary="Delete category",
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def delete_category(
    category_id: int,
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
) -> MessageResponse:
    category = _get_category_or_404(db, category_id)
    if category.products:
        raise HTTPException(status_code=400, detail="Cannot delete category while products are assigned to it")
    db.delete(category)
    db.commit()
    return MessageResponse(message="Category deleted successfully")


@category_router.get(
    "/categories/{category_id}/products",
    response_model=list[ProductResponse],
    summary="List products in a category",
    responses={404: {"model": ErrorResponse}},
)
def get_category_products(category_id: int, db: Session = Depends(get_db)):
    category = _category_query(db).filter(Categories.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category.products
