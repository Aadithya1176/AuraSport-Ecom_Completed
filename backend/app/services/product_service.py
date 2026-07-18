"""
Product service - business logic for Product CRUD operations.
"""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.models.category import Category
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def get_all_products(db: Session) -> list[Product]:
    """Retrieve all products with their categories."""
    stmt = (
        select(Product)
        .options(selectinload(Product.category))
        .order_by(Product.id)
    )
    return list(db.execute(stmt).scalars().all())


def get_product_by_id(db: Session, product_id: int) -> Product:
    """Retrieve a product by ID with its category."""
    stmt = (
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.id == product_id)
    )
    product = db.execute(stmt).scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return product


def _get_category_by_id(db: Session, category_id: int) -> Category:
    """Retrieve a category by ID or raise a 404 error."""
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )
    return category


def create_product(db: Session, product_data: ProductCreate) -> Product:
    """Create a new product."""
    _get_category_by_id(db, product_data.category_id)

    new_product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        stock=product_data.stock,
        image_url=product_data.image_url,
        category_id=product_data.category_id,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return get_product_by_id(db, new_product.id)


def update_product(db: Session, product_id: int, product_data: ProductUpdate) -> Product:
    """Update an existing product."""
    product = get_product_by_id(db, product_id)
    update_data = product_data.model_dump(exclude_unset=True)

    if "category_id" in update_data:
        _get_category_by_id(db, update_data["category_id"])

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return get_product_by_id(db, product.id)


def delete_product(db: Session, product_id: int) -> None:
    """Delete a product."""
    product = get_product_by_id(db, product_id)

    try:
        db.delete(product)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete product because it is referenced by cart or order items.",
        )
