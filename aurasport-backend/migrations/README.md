Alembic migration workflow for AuraSport:

1. Create the initial or latest schema locally:
   `alembic upgrade head`

2. Generate a new migration after changing SQLAlchemy models:
   `alembic revision --autogenerate -m "describe change"`

3. Apply the generated migration:
   `alembic upgrade head`

4. If your database already matches the models and you only need to align Alembic history:
   `alembic stamp head`
