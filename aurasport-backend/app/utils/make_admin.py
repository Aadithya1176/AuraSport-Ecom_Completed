import sys

from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Users


def make_admin(email: str) -> None:
    db: Session = SessionLocal()
    try:
        user = db.query(Users).filter(Users.email == email.strip().lower()).first()
        if not user:
            print(f"User with email '{email}' was not found.")
            return

        user.role = "admin"
        db.commit()
        print(f"User '{email}' promoted to admin successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m app.utils.make_admin <email>")
        raise SystemExit(1)

    make_admin(sys.argv[1])
