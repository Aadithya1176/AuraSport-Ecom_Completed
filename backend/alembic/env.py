"""
Alembic environment configuration.

Key customizations from the default template:
1. We import all models via `app.models` so that Base.metadata contains
   every table definition. Without this, autogenerate would produce
   an empty migration.
2. We read DATABASE_URL from our Pydantic Settings (which reads .env)
   instead of hardcoding it in alembic.ini. This keeps credentials in
   one place and out of version control.
3. We inject the URL into Alembic's config at runtime using
   config.set_main_option().
"""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

from app.core.config import get_settings
from app.core.database import Base

# Import all models so Base.metadata is fully populated.
# Without this line, Alembic would see zero tables to migrate.
import app.models  # noqa: F401

# ──────────────────────────────────────────────
# Alembic Config object — provides access to alembic.ini values
# ──────────────────────────────────────────────
config = context.config

# Set up Python logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ──────────────────────────────────────────────
# Inject DATABASE_URL from .env into Alembic's config
# ──────────────────────────────────────────────
settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# ──────────────────────────────────────────────
# Point Alembic at our models' metadata
# ──────────────────────────────────────────────
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    Generates SQL scripts without connecting to the database.
    Useful for reviewing migration SQL before applying it.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    Creates a real database connection and applies migrations directly.
    This is the mode used by `alembic upgrade head`.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
