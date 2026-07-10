import logging

import sqlalchemy as sa
from sqlalchemy.orm import Session

from .database import Base, SessionLocal, engine
from .models import Cart, Categories, OrderItems, Orders, Products, Users  # noqa: F401
from .utils.files import ensure_runtime_directories


logger = logging.getLogger(__name__)


def ensure_user_profile_columns() -> None:
    bind = engine.connect()
    try:
        inspector = sa.inspect(bind)
        if "users" not in inspector.get_table_names():
            return

        existing_columns = {column["name"] for column in inspector.get_columns("users")}
        required_columns: list[tuple[str, str, str | None]] = [
            ("full_name", "VARCHAR(120)", None),
            ("phone_number", "VARCHAR(30)", None),
            ("address_line", "VARCHAR(255)", None),
            ("city", "VARCHAR(100)", None),
            ("state", "VARCHAR(100)", None),
            ("postal_code", "VARCHAR(20)", None),
            ("preferred_contact", "VARCHAR(20)", "'whatsapp'"),
        ]

        for column_name, column_type, default_value in required_columns:
            if column_name in existing_columns:
                continue

            default_clause = f" DEFAULT {default_value}" if default_value is not None else ""
            bind.execute(
                sa.text(
                    f"ALTER TABLE users ADD COLUMN {column_name} {column_type}{default_clause}"
                )
            )
            logger.info("Added missing users.%s column for saved profile data", column_name)
    finally:
        bind.commit()
        bind.close()


def ensure_order_request_columns() -> None:
    bind = engine.connect()
    try:
        inspector = sa.inspect(bind)
        if "orders" not in inspector.get_table_names():
            return

        existing_columns = {column["name"] for column in inspector.get_columns("orders")}
        required_columns: list[tuple[str, str, str | None]] = [
            ("customer_name", "VARCHAR(120)", "'Customer Name'"),
            ("phone_number", "VARCHAR(30)", "'0000000000'"),
            ("address_line", "VARCHAR(255)", "'Address pending'"),
            ("city", "VARCHAR(100)", "'City'"),
            ("state", "VARCHAR(100)", "'State'"),
            ("postal_code", "VARCHAR(20)", "'000000'"),
            ("contact_preference", "VARCHAR(20)", "'whatsapp'"),
            ("notes", "VARCHAR(500)", None),
            ("admin_notes", "VARCHAR(500)", None),
        ]

        for column_name, column_type, default_value in required_columns:
            if column_name in existing_columns:
                continue

            default_clause = f" DEFAULT {default_value}" if default_value is not None else ""
            bind.execute(
                sa.text(
                    f"ALTER TABLE orders ADD COLUMN {column_name} {column_type}{default_clause}"
                )
            )
            logger.info("Added missing orders.%s column for request-based order flow", column_name)
    finally:
        bind.commit()
        bind.close()


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
    ensure_user_profile_columns()
    ensure_order_request_columns()
    seed_demo_data()
    logger.info("Database tables created using SQLAlchemy metadata. Prefer Alembic migrations for schema changes.")


if __name__ == "__main__":
    init_db()
