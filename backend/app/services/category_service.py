"""
Category service — business logic for Category CRUD operations.
"""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def get_all_categories(db: Session) -> list[Category]:
    """Retrieve all categories."""
    stmt = select(Category).order_by(Category.id)
    return list(db.execute(stmt).scalars().all())


def get_category_by_id(db: Session, category_id: int) -> Category:
    """Retrieve a category by ID."""
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found."
        )
    return category


def create_category(db: Session, category_data: CategoryCreate) -> Category:
    """Create a new category."""
    # Check if category with this name already exists
    stmt = select(Category).where(Category.name == category_data.name)
    existing_category = db.execute(stmt).scalar_one_or_none()
    
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A category with this name already exists."
        )
        
    new_category = Category(name=category_data.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


def update_category(db: Session, category_id: int, category_data: CategoryUpdate) -> Category:
    """Update an existing category."""
    category = get_category_by_id(db, category_id)
    
    if category_data.name is not None:
        # Check if new name conflicts with an existing category
        stmt = select(Category).where(Category.name == category_data.name, Category.id != category_id)
        existing_category = db.execute(stmt).scalar_one_or_none()
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A category with this name already exists."
            )
        category.name = category_data.name

    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int) -> None:
    """Delete a category."""
    category = get_category_by_id(db, category_id)
    
    try:
        db.delete(category)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category because it contains products."
        )
