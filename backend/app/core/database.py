"""
Database engine, session, and declarative Base.

Architecture decisions:
- create_engine: One global engine manages the connection pool to PostgreSQL.
- sessionmaker: Creates new database sessions per-request (not per-app).
- DeclarativeBase: SQLAlchemy 2.0 style base class for all ORM models.
- get_db: A FastAPI dependency that provides a session and guarantees cleanup.
"""

from collections.abc import Generator
from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

# pool_pre_ping=True: Before handing out a connection from the pool,
# SQLAlchemy pings the database to verify the connection is still alive.
# This prevents "server closed the connection unexpectedly" errors.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """
    SQLAlchemy 2.0 declarative base.

    All ORM models will inherit from this class.
    This is the modern replacement for declarative_base().
    """
    pass


def get_db() -> Generator[Session, Any, None]:
    """
    FastAPI dependency that yields a database session.

    Why a generator?
    - The session is created when the request starts.
    - It's injected into the route handler via Depends(get_db).
    - The finally block guarantees the session is closed even if
      the route handler raises an exception.

    Usage:
        @router.get("/items")
        def list_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
