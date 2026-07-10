import logging

from sqlalchemy.orm import Session

from .database import Base, SessionLocal, engine
from .models import Cart, Categories, OrderItems, Orders, Products, Users  # noqa: F401
from .utils.files import ensure_runtime_directories


logger = logging.getLogger(__name__)


def seed_demo_data() -> None:
    db: Session = SessionLocal()
    try:
        has_products = db.query(Products.id).first() is not None
        if has_products:
            return

        categories = [
            Categories(name="Running"),
            Categories(name="Training"),
            Categories(name="Football"),
            Categories(name="Outdoor"),
        ]
        db.add_all(categories)
        db.flush()

        db.add_all(
            [
                Products(name="Velocity Sprint Tee", price=49.0, category_id=categories[0].id),
                Products(name="CoreLift Hoodie", price=89.0, category_id=categories[1].id),
                Products(name="Matchday Elite Ball", price=59.0, category_id=categories[2].id),
                Products(name="Summit Trail Pack", price=109.0, category_id=categories[3].id),
                Products(name="AeroFlex Leggings", price=72.0, category_id=categories[1].id),
                Products(name="StreetRun Sneakers", price=134.0, category_id=categories[0].id),
            ]
        )
        db.commit()
        logger.info("Seeded demo AuraSport catalog data")
    finally:
        db.close()


def init_db() -> None:
    ensure_runtime_directories()
    Base.metadata.create_all(bind=engine)
    seed_demo_data()
    logger.info("Database tables created using SQLAlchemy metadata. Prefer Alembic migrations for schema changes.")


if __name__ == "__main__":
    init_db()
