import logging
from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy.orm import Session

from .core.config import get_settings
from .database import SessionLocal
from .models import Cart, Categories, OrderItems, Orders, Products, Users  # noqa: F401
from .utils.files import ensure_runtime_directories


logger = logging.getLogger(__name__)
settings = get_settings()


def run_migrations() -> None:
    project_dir = Path(__file__).resolve().parents[1]
    alembic_ini_path = project_dir / "alembic.ini"
    alembic_cfg = Config(str(alembic_ini_path))
    alembic_cfg.set_main_option("script_location", str(project_dir / "migrations"))
    alembic_cfg.set_main_option("sqlalchemy.url", settings.database_url)
    command.upgrade(alembic_cfg, "head")
    logger.info("Database migrations applied successfully")


def seed_demo_data() -> None:
    if not settings.seed_demo_data:
        logger.info("Skipping demo data seeding because SEED_DEMO_DATA is disabled")
        return

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
                Products(name="Velocity Sprint Tee", price=49.0, category_id=categories[0].id, image_url="/products/velocity_sprint_tee.png"),
                Products(name="CoreLift Hoodie", price=89.0, category_id=categories[1].id, image_url="/products/corelift_hoodie.png"),
                Products(name="Matchday Elite Ball", price=59.0, category_id=categories[2].id, image_url="/products/matchday_elite_ball.png"),
                Products(name="Summit Trail Pack", price=109.0, category_id=categories[3].id, image_url="/products/summit_trail_pack.png"),
                Products(name="AeroFlex Leggings", price=72.0, category_id=categories[1].id, image_url="/products/aeroflex_leggings.png"),
                Products(name="StreetRun Sneakers", price=134.0, category_id=categories[0].id, image_url="/products/streetrun_sneakers.png"),
            ]
        )
        db.commit()
        logger.info("Seeded demo AuraSport catalog data")
    finally:
        db.close()


def init_db() -> None:
    ensure_runtime_directories()
    run_migrations()
    seed_demo_data()
    logger.info("Database initialization completed using Alembic migrations.")


if __name__ == "__main__":
    init_db()
