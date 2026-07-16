from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from ..auth import admin_required
from ..database import get_db
from ..models import Categories, Products, Users
from ..schemas import ErrorResponse, MessageResponse, ProductResponse
from ..utils.files import delete_product_image, save_product_image


router = APIRouter(prefix="", tags=["Products"])


def _product_query(db: Session):
    return db.query(Products).options(joinedload(Products.category))


def _get_product_or_404(db: Session, product_id: int) -> Products:
    product = _product_query(db).filter(Products.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def _validate_category(db: Session, category_id: int | None) -> None:
    if category_id is None:
        return
    category = db.query(Categories).filter(Categories.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")


@router.get(
    "/products/search",
    response_model=list[ProductResponse],
    summary="Search products",
    description="Search products using any combination of name, category name, minimum price, and maximum price.",
)
def search_products(
    name: str | None = Query(default=None, description="Partial product name match"),
    category: str | None = Query(default=None, description="Category name match"),
    min_price: float | None = Query(default=None, gt=0),
    max_price: float | None = Query(default=None, gt=0),
    db: Session = Depends(get_db),
) -> list[Products]:
    query = _product_query(db).outerjoin(Categories)

    if name:
        query = query.filter(Products.name.ilike(f"%{name.strip()}%"))
    if category:
        query = query.filter(Categories.name.ilike(f"%{category.strip()}%"))
    if min_price is not None:
        query = query.filter(Products.price >= min_price)
    if max_price is not None:
        query = query.filter(Products.price <= max_price)
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=400, detail="min_price cannot be greater than max_price")

    return query.order_by(Products.id.desc()).all()


@router.post(
    "/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a product",
    description="Create a product with optional image upload. Admin access required.",
    responses={400: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)
def create_product(
    name: Annotated[str, Form(description="Product name")],
    price: Annotated[float, Form(description="Product price")],
    category_id: Annotated[int | None, Form(description="Category ID")] = None,
    image: UploadFile | None = File(default=None, description="Product image file"),
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
) -> Products:
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be positive")

    _validate_category(db, category_id)
    image_url = save_product_image(image)

    product = Products(
        name=name.strip(),
        price=price,
        category_id=category_id,
        image_url=image_url,
    )

    try:
        db.add(product)
        db.commit()
        db.refresh(product)
    except IntegrityError as exc:
        db.rollback()
        delete_product_image(image_url)
        raise HTTPException(status_code=400, detail="Invalid category or duplicate product data") from exc

    return _get_product_or_404(db, product.id)


@router.get(
    "/products",
    response_model=list[ProductResponse],
    summary="List products",
    description="List products with pagination, price filtering, and sorting support.",
)
def get_products(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    min_price: float | None = Query(default=None, gt=0),
    max_price: float | None = Query(default=None, gt=0),
    sort: str | None = Query(default=None, pattern="^(price|-price|name|-name)?$"),
    db: Session = Depends(get_db),
) -> list[Products]:
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=400, detail="min_price cannot be greater than max_price")

    query = _product_query(db)

    if min_price is not None:
        query = query.filter(Products.price >= min_price)
    if max_price is not None:
        query = query.filter(Products.price <= max_price)

    if sort == "price":
        query = query.order_by(Products.price.asc())
    elif sort == "-price":
        query = query.order_by(Products.price.desc())
    elif sort == "name":
        query = query.order_by(Products.name.asc())
    elif sort == "-name":
        query = query.order_by(Products.name.desc())
    else:
        query = query.order_by(Products.id.desc())

    return query.offset(offset).limit(limit).all()


@router.get(
    "/products/{product_id}",
    response_model=ProductResponse,
    summary="Get product by ID",
    description="Return a single product with category details.",
    responses={404: {"model": ErrorResponse}},
)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)) -> Products:
    return _get_product_or_404(db, product_id)


@router.put(
    "/products/{product_id}",
    response_model=ProductResponse,
    summary="Replace a product",
    description="Replace product details and optionally upload a new image. Admin access required.",
    responses={400: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def update_product(
    product_id: int,
    name: Annotated[str, Form(description="Product name")],
    price: Annotated[float, Form(description="Product price")],
    category_id: Annotated[int | None, Form(description="Category ID")] = None,
    image: UploadFile | None = File(default=None, description="Product image file"),
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
) -> Products:
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be positive")

    product = _get_product_or_404(db, product_id)
    _validate_category(db, category_id)

    new_image_url = save_product_image(image) if image else product.image_url
    old_image_url = product.image_url

    product.name = name.strip()
    product.price = price
    product.category_id = category_id
    product.image_url = new_image_url

    try:
        db.commit()
        db.refresh(product)
    except IntegrityError as exc:
        db.rollback()
        if image and new_image_url != old_image_url:
            delete_product_image(new_image_url)
        raise HTTPException(status_code=400, detail="Invalid category or duplicate product data") from exc

    if image and old_image_url and old_image_url != new_image_url:
        delete_product_image(old_image_url)

    return _get_product_or_404(db, product.id)


@router.patch(
    "/products/{product_id}",
    response_model=ProductResponse,
    summary="Partially update a product",
    description="Patch product fields and optionally upload a new image. Admin access required.",
    responses={400: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def patch_product(
    product_id: int,
    name: Annotated[str | None, Form(description="Product name")] = None,
    price: Annotated[float | None, Form(description="Product price")] = None,
    category_id: Annotated[int | None, Form(description="Category ID")] = None,
    image: UploadFile | None = File(default=None, description="Product image file"),
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
) -> Products:
    product = _get_product_or_404(db, product_id)

    if price is not None and price <= 0:
        raise HTTPException(status_code=400, detail="Price must be positive")
    if category_id is not None:
        _validate_category(db, category_id)

    old_image_url = product.image_url
    if name is not None:
        product.name = name.strip()
    if price is not None:
        product.price = price
    if category_id is not None:
        product.category_id = category_id
    if image is not None:
        product.image_url = save_product_image(image)

    try:
        db.commit()
        db.refresh(product)
    except IntegrityError as exc:
        db.rollback()
        if image is not None and product.image_url != old_image_url:
            delete_product_image(product.image_url)
            product.image_url = old_image_url
        raise HTTPException(status_code=400, detail="Invalid category or duplicate product data") from exc

    if image is not None and old_image_url and old_image_url != product.image_url:
        delete_product_image(old_image_url)

    return _get_product_or_404(db, product.id)


@router.delete(
    "/products/{product_id}",
    response_model=MessageResponse,
    summary="Delete a product",
    description="Delete a product and its uploaded image. Admin access required.",
    responses={403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def delete_product(
    product_id: int,
    _: Users = Depends(admin_required),
    db: Session = Depends(get_db),
) -> MessageResponse:
    product = _get_product_or_404(db, product_id)
    image_url = product.image_url
    db.delete(product)
    db.commit()
    delete_product_image(image_url)
    return MessageResponse(message="Product deleted successfully")
