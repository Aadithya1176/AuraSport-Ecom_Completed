# AuraSport Backend

FastAPI backend for the AuraSport request-based storefront.

## Structure

```text
aurasport-backend/
|-- alembic.ini
|-- migrations/
|-- logs/
|-- uploads/
|-- requirements.txt
`-- app/
    |-- auth.py
    |-- database.py
    |-- init_db.py
    |-- main.py
    |-- models.py
    |-- schemas.py
    |-- core/
    |-- middleware/
    |-- routes/
    |-- services/
    `-- utils/
```

## Features

- JWT authentication with role support
- Admin-only catalog and request management
- Product image upload with static file serving
- Manual order request flow instead of online payments
- Profile saving and delivery autofill support
- Product filtering and search endpoints
- Alembic support for migrations
- Runtime schema backfill for local SQLite development

## Install

From `aurasport-backend`:

```bash
..\venv\Scripts\python -m pip install -r requirements.txt
```

## Environment

Copy `app/.env.example` to `app/.env` and update the values:

```env
DATABASE_URL=sqlite:///../aurasport.db
SECRET_KEY=change-this-to-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
MAX_UPLOAD_SIZE_BYTES=5242880
```

Notes:

- `SECRET_KEY` is required.
- For production, replace SQLite with PostgreSQL.
- `CORS_ORIGINS` should match your deployed frontend URL.

## Database

Local development can use the automatic startup initialization.

If you want Alembic-managed migrations:

```bash
..\venv\Scripts\python -m alembic upgrade head
```

If the current database already matches the existing migrations:

```bash
..\venv\Scripts\python -m alembic stamp head
```

## Run

Start the API from `aurasport-backend`:

```bash
..\venv\Scripts\python -m uvicorn app.main:app --reload
```

API docs:

```text
http://127.0.0.1:8000/docs
```

Health endpoint:

```text
http://127.0.0.1:8000/health
```

Uploads:

```text
http://127.0.0.1:8000/uploads/<filename>
```

## Admin Setup

Register a normal user first, then promote that account to admin:

```bash
..\venv\Scripts\python -m app.utils.make_admin yourmail@example.com
```

After promotion, log in again so the JWT token includes the admin role.

## Main Request Flow

### 1. Register

`POST /register`

### 2. Login

`POST /login`

### 3. Create or update profile

`GET /me`

`PATCH /me`

### 4. Browse catalog

`GET /products`

`GET /products/search`

`GET /categories`

### 5. Add cart items

`POST /carts`

`GET /cart`

`PATCH /cart/{cart_item_id}`

`DELETE /cart/{cart_item_id}`

### 6. Submit request

`POST /orders/request`

This includes customer name, phone number, address, contact preference, and optional notes.

### 7. Track requests

`GET /orders`

`GET /orders/{order_id}`

### 8. Admin request management

`GET /admin/orders`

`GET /admin/orders/{order_id}`

`PATCH /admin/orders/{order_id}`

### 9. Admin catalog management

`POST /categories`

`PUT /categories/{category_id}`

`DELETE /categories/{category_id}`

`POST /products`

`PUT /products/{product_id}`

`PATCH /products/{product_id}`

`DELETE /products/{product_id}`

## Production Notes

- Replace SQLite with PostgreSQL.
- Replace local `uploads/` with cloud storage.
- Use a strong production `SECRET_KEY`.
- Lock `CORS_ORIGINS` to real frontend domains only.
- Prefer full Alembic migrations instead of relying on local auto-backfill behavior long-term.
