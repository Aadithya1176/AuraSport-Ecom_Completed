"""Initial production-style schema for AuraSport."""

from alembic import op
import sqlalchemy as sa


revision = "20260630_0001"
down_revision = None
branch_labels = None
depends_on = None


def _has_table(inspector: sa.Inspector, table_name: str) -> bool:
    return table_name in inspector.get_table_names()


def _has_column(inspector: sa.Inspector, table_name: str, column_name: str) -> bool:
    return column_name in {column["name"] for column in inspector.get_columns(table_name)}


def _has_unique_constraint(inspector: sa.Inspector, table_name: str, constraint_name: str) -> bool:
    return constraint_name in {constraint["name"] for constraint in inspector.get_unique_constraints(table_name)}


def _has_foreign_key(inspector: sa.Inspector, table_name: str, constrained_columns: list[str]) -> bool:
    foreign_keys = inspector.get_foreign_keys(table_name)
    constrained = tuple(constrained_columns)
    return any(tuple(fk.get("constrained_columns", [])) == constrained for fk in foreign_keys)


def _has_index(inspector: sa.Inspector, table_name: str, index_name: str) -> bool:
    return index_name in {index["name"] for index in inspector.get_indexes(table_name)}


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not _has_table(inspector, "users"):
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("username", sa.String(length=50), nullable=False),
            sa.Column("email", sa.String(length=255), nullable=False),
            sa.Column("password", sa.String(length=255), nullable=False),
            sa.Column("role", sa.String(length=20), nullable=False, server_default="user"),
        )
    else:
        if not _has_column(inspector, "users", "role"):
            op.add_column("users", sa.Column("role", sa.String(length=20), nullable=False, server_default="user"))
            op.execute(sa.text("UPDATE users SET role = 'user' WHERE role IS NULL"))

    inspector = sa.inspect(bind)
    if not _has_unique_constraint(inspector, "users", "users_username_key"):
        op.create_unique_constraint("users_username_key", "users", ["username"])
    if not _has_unique_constraint(inspector, "users", "users_email_key"):
        op.create_unique_constraint("users_email_key", "users", ["email"])
    for index_name, column_name in (
        ("ix_users_id", "id"),
        ("ix_users_username", "username"),
        ("ix_users_email", "email"),
        ("ix_users_role", "role"),
    ):
        if not _has_index(inspector, "users", index_name):
            op.create_index(index_name, "users", [column_name], unique=False)

    if not _has_table(inspector, "categories"):
        op.create_table(
            "categories",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("name", sa.String(length=100), nullable=False),
        )
    inspector = sa.inspect(bind)
    if not _has_unique_constraint(inspector, "categories", "categories_name_key"):
        op.create_unique_constraint("categories_name_key", "categories", ["name"])
    for index_name, column_name in (("ix_categories_id", "id"), ("ix_categories_name", "name")):
        if not _has_index(inspector, "categories", index_name):
            op.create_index(index_name, "categories", [column_name], unique=False)

    if not _has_table(inspector, "products"):
        op.create_table(
            "products",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("name", sa.String(length=150), nullable=False),
            sa.Column("price", sa.Float(), nullable=False),
            sa.Column("image_url", sa.String(length=255), nullable=True),
            sa.Column("category_id", sa.Integer(), nullable=True),
        )
    else:
        if not _has_column(inspector, "products", "image_url"):
            op.add_column("products", sa.Column("image_url", sa.String(length=255), nullable=True))
    inspector = sa.inspect(bind)
    if not _has_foreign_key(inspector, "products", ["category_id"]):
        op.create_foreign_key(
            "products_category_id_fkey",
            "products",
            "categories",
            ["category_id"],
            ["id"],
        )
    for index_name, column_name in (("ix_products_id", "id"), ("ix_products_name", "name")):
        if not _has_index(inspector, "products", index_name):
            op.create_index(index_name, "products", [column_name], unique=False)

    if not _has_table(inspector, "orders"):
        op.create_table(
            "orders",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("total_price", sa.Float(), nullable=False, server_default="0"),
            sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"),
        )
    else:
        if not _has_column(inspector, "orders", "total_price"):
            op.add_column("orders", sa.Column("total_price", sa.Float(), nullable=False, server_default="0"))
        if not _has_column(inspector, "orders", "status"):
            op.add_column("orders", sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"))
    inspector = sa.inspect(bind)
    if not _has_foreign_key(inspector, "orders", ["user_id"]):
        op.create_foreign_key("orders_user_id_fkey", "orders", "users", ["user_id"], ["id"])
    for index_name, column_name in (("ix_orders_id", "id"), ("ix_orders_user_id", "user_id")):
        if not _has_index(inspector, "orders", index_name):
            op.create_index(index_name, "orders", [column_name], unique=False)

    if not _has_table(inspector, "order_items"):
        op.create_table(
            "order_items",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("order_id", sa.Integer(), nullable=False),
            sa.Column("product_id", sa.Integer(), nullable=False),
            sa.Column("quantity", sa.Integer(), nullable=False),
            sa.Column("price", sa.Float(), nullable=False),
        )
    inspector = sa.inspect(bind)
    if not _has_foreign_key(inspector, "order_items", ["order_id"]):
        op.create_foreign_key("order_items_order_id_fkey", "order_items", "orders", ["order_id"], ["id"])
    if not _has_foreign_key(inspector, "order_items", ["product_id"]):
        op.create_foreign_key("order_items_product_id_fkey", "order_items", "products", ["product_id"], ["id"])
    for index_name, column_name in (
        ("ix_order_items_id", "id"),
        ("ix_order_items_order_id", "order_id"),
    ):
        if not _has_index(inspector, "order_items", index_name):
            op.create_index(index_name, "order_items", [column_name], unique=False)

    if not _has_table(inspector, "cart"):
        op.create_table(
            "cart",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("product_id", sa.Integer(), nullable=False),
            sa.Column("qty", sa.Integer(), nullable=False),
        )
    else:
        if not _has_column(inspector, "cart", "user_id"):
            op.add_column("cart", sa.Column("user_id", sa.Integer(), nullable=True))
        if not _has_column(inspector, "cart", "product_id"):
            op.add_column("cart", sa.Column("product_id", sa.Integer(), nullable=True))
        if not _has_column(inspector, "cart", "qty"):
            op.add_column("cart", sa.Column("qty", sa.Integer(), nullable=True))
        op.execute(sa.text("UPDATE cart SET qty = 1 WHERE qty IS NULL"))
        op.alter_column("cart", "user_id", nullable=False)
        op.alter_column("cart", "product_id", nullable=False)
        op.alter_column("cart", "qty", nullable=False)
    inspector = sa.inspect(bind)
    if not _has_foreign_key(inspector, "cart", ["user_id"]):
        op.create_foreign_key("cart_user_id_fkey", "cart", "users", ["user_id"], ["id"])
    if not _has_foreign_key(inspector, "cart", ["product_id"]):
        op.create_foreign_key("cart_product_id_fkey", "cart", "products", ["product_id"], ["id"])
    if not _has_unique_constraint(inspector, "cart", "uq_cart_user_product"):
        op.create_unique_constraint("uq_cart_user_product", "cart", ["user_id", "product_id"])
    for index_name, column_name in (
        ("ix_cart_id", "id"),
        ("ix_cart_user_id", "user_id"),
        ("ix_cart_product_id", "product_id"),
    ):
        if not _has_index(inspector, "cart", index_name):
            op.create_index(index_name, "cart", [column_name], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if _has_table(inspector, "cart"):
        if _has_unique_constraint(inspector, "cart", "uq_cart_user_product"):
            op.drop_constraint("uq_cart_user_product", "cart", type_="unique")
        if _has_foreign_key(inspector, "cart", ["product_id"]):
            op.drop_constraint("cart_product_id_fkey", "cart", type_="foreignkey")
        if _has_foreign_key(inspector, "cart", ["user_id"]):
            op.drop_constraint("cart_user_id_fkey", "cart", type_="foreignkey")
        op.drop_table("cart")

    inspector = sa.inspect(bind)
    if _has_table(inspector, "order_items"):
        if _has_foreign_key(inspector, "order_items", ["product_id"]):
            op.drop_constraint("order_items_product_id_fkey", "order_items", type_="foreignkey")
        if _has_foreign_key(inspector, "order_items", ["order_id"]):
            op.drop_constraint("order_items_order_id_fkey", "order_items", type_="foreignkey")
        op.drop_table("order_items")

    inspector = sa.inspect(bind)
    if _has_table(inspector, "orders"):
        if _has_foreign_key(inspector, "orders", ["user_id"]):
            op.drop_constraint("orders_user_id_fkey", "orders", type_="foreignkey")
        op.drop_table("orders")

    inspector = sa.inspect(bind)
    if _has_table(inspector, "products"):
        if _has_foreign_key(inspector, "products", ["category_id"]):
            op.drop_constraint("products_category_id_fkey", "products", type_="foreignkey")
        op.drop_table("products")

    inspector = sa.inspect(bind)
    if _has_table(inspector, "categories"):
        op.drop_table("categories")

    inspector = sa.inspect(bind)
    if _has_table(inspector, "users"):
        op.drop_table("users")
