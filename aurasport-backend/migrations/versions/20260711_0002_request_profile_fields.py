"""Add request and profile fields for production schema parity."""

from alembic import op
import sqlalchemy as sa


revision = "20260711_0002"
down_revision = "20260630_0001"
branch_labels = None
depends_on = None


def _has_column(inspector: sa.Inspector, table_name: str, column_name: str) -> bool:
    return column_name in {column["name"] for column in inspector.get_columns(table_name)}


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    user_columns: list[tuple[str, sa.types.TypeEngine, bool, str | None]] = [
        ("full_name", sa.String(length=120), True, None),
        ("phone_number", sa.String(length=30), True, None),
        ("address_line", sa.String(length=255), True, None),
        ("city", sa.String(length=100), True, None),
        ("state", sa.String(length=100), True, None),
        ("postal_code", sa.String(length=20), True, None),
        ("preferred_contact", sa.String(length=20), True, "whatsapp"),
    ]
    for name, column_type, nullable, server_default in user_columns:
        if _has_column(inspector, "users", name):
            continue
        op.add_column("users", sa.Column(name, column_type, nullable=nullable, server_default=server_default))

    inspector = sa.inspect(bind)
    order_columns: list[tuple[str, sa.types.TypeEngine, bool, str | None]] = [
        ("customer_name", sa.String(length=120), False, "Customer Name"),
        ("phone_number", sa.String(length=30), False, "0000000000"),
        ("address_line", sa.String(length=255), False, "Address pending"),
        ("city", sa.String(length=100), False, "City"),
        ("state", sa.String(length=100), False, "State"),
        ("postal_code", sa.String(length=20), False, "000000"),
        ("contact_preference", sa.String(length=20), False, "whatsapp"),
        ("notes", sa.String(length=500), True, None),
        ("admin_notes", sa.String(length=500), True, None),
    ]
    for name, column_type, nullable, server_default in order_columns:
        if _has_column(inspector, "orders", name):
            continue
        op.add_column("orders", sa.Column(name, column_type, nullable=True, server_default=server_default))

    op.execute(sa.text("UPDATE orders SET customer_name = 'Customer Name' WHERE customer_name IS NULL"))
    op.execute(sa.text("UPDATE orders SET phone_number = '0000000000' WHERE phone_number IS NULL"))
    op.execute(sa.text("UPDATE orders SET address_line = 'Address pending' WHERE address_line IS NULL"))
    op.execute(sa.text("UPDATE orders SET city = 'City' WHERE city IS NULL"))
    op.execute(sa.text("UPDATE orders SET state = 'State' WHERE state IS NULL"))
    op.execute(sa.text("UPDATE orders SET postal_code = '000000' WHERE postal_code IS NULL"))
    op.execute(sa.text("UPDATE orders SET contact_preference = 'whatsapp' WHERE contact_preference IS NULL"))

    with op.batch_alter_table("orders") as batch_op:
        batch_op.alter_column("customer_name", nullable=False)
        batch_op.alter_column("phone_number", nullable=False)
        batch_op.alter_column("address_line", nullable=False)
        batch_op.alter_column("city", nullable=False)
        batch_op.alter_column("state", nullable=False)
        batch_op.alter_column("postal_code", nullable=False)
        batch_op.alter_column("contact_preference", nullable=False)


def downgrade() -> None:
    with op.batch_alter_table("orders") as batch_op:
        for column_name in (
            "admin_notes",
            "notes",
            "contact_preference",
            "postal_code",
            "state",
            "city",
            "address_line",
            "phone_number",
            "customer_name",
        ):
            batch_op.drop_column(column_name)

    with op.batch_alter_table("users") as batch_op:
        for column_name in (
            "preferred_contact",
            "postal_code",
            "state",
            "city",
            "address_line",
            "phone_number",
            "full_name",
        ):
            batch_op.drop_column(column_name)
