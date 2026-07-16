from __future__ import annotations

import argparse
from pathlib import Path

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from app.models import Base, Cart, Categories, OrderItems, Orders, Products, Users


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Copy AuraSport data from a SQLite database into a PostgreSQL database."
    )
    parser.add_argument("--sqlite-path", required=True, help="Path to the source SQLite database file.")
    parser.add_argument("--postgres-url", required=True, help="Target PostgreSQL SQLAlchemy URL.")
    parser.add_argument(
        "--drop-existing",
        action="store_true",
        help="Drop and recreate the target schema before importing data.",
    )
    return parser.parse_args()


def clone_row(model: type[Base], row: Base) -> Base:
    values = {
        column.name: getattr(row, column.name)
        for column in model.__table__.columns
    }
    return model(**values)


def copy_table(source_session: Session, target_session: Session, model: type[Base]) -> None:
    rows = source_session.execute(select(model)).scalars().all()
    for row in rows:
        target_session.merge(clone_row(model, row))
    target_session.commit()


def main() -> None:
    args = parse_args()
    sqlite_path = Path(args.sqlite_path).resolve()
    sqlite_url = f"sqlite:///{sqlite_path.as_posix()}"

    source_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    target_engine = create_engine(args.postgres_url, pool_pre_ping=True)

    if args.drop_existing:
        Base.metadata.drop_all(bind=target_engine)
    Base.metadata.create_all(bind=target_engine)

    source_session = sessionmaker(bind=source_engine, autocommit=False, autoflush=False, expire_on_commit=False)()
    target_session = sessionmaker(bind=target_engine, autocommit=False, autoflush=False, expire_on_commit=False)()

    try:
        for model in (Users, Categories, Products, Orders, Cart, OrderItems):
            copy_table(source_session, target_session, model)
        print("SQLite data migrated successfully to PostgreSQL.")
    finally:
        source_session.close()
        target_session.close()


if __name__ == "__main__":
    main()
