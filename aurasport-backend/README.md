# AuraSport Backend

Production-style localhost backend for the AuraSport e-commerce project.

## Structure

```text
aurasport-backend/
├── alembic.ini
├── migrations/
├── logs/
├── uploads/
├── requirements.txt
└── app/
    ├── auth.py
    ├── database.py
    ├── init_db.py
    ├── main.py
    ├── models.py
    ├── schemas.py
    ├── core/
    ├── middleware/
    ├── routes/
    ├── services/
    └── utils/
```

## Features

- JWT authentication with role support
- RBAC for admin-only product management
- Product image upload with static file serving
- Product search with combinable filters
- Nested cart and order responses
- Request logging middleware
- File + console logging
- Global exception handling
- Alembic migrations
- Pydantic validation
- CORS for React frontend at `http://localhost:5173`

## Install

From `aurasport-backend`:

```bash
..\venv\Scripts\python -m pip install -r requirements.txt
```

If you are using a separate backend virtual environment, install the same dependencies there.

## Environment

Create or update `app/.env`:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost/aurasport
SECRET_KEY=mysecretkey123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
MAX_UPLOAD_SIZE_BYTES=5242880
```

## Database

Run the initial migration:

```bash
..\venv\Scripts\python -m alembic upgrade head
```

If you already have an existing database and only need Alembic to track the current schema:

```bash
..\venv\Scripts\python -m alembic stamp head
```

## Future Migrations

After changing SQLAlchemy models:

```bash
..\venv\Scripts\python -m alembic revision --autogenerate -m "describe change"
..\venv\Scripts\python -m alembic upgrade head
```

## Run

Start the API from `aurasport-backend`:

```bash
..\venv\Scripts\python -m uvicorn app.main:app --reload
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

Uploaded product images:

```text
http://127.0.0.1:8000/uploads/<filename>
```

## Admin Setup

Register a user normally in Swagger with `/register`, then promote that user to admin:

```bash
..\venv\Scripts\python -m app.utils.make_admin yourmail@example.com
```

Then log in again using `/login`. The token from that login can be used for admin-only product endpoints.

## Swagger Testing Flow

Use this order in Swagger:

### 1. Register User

`POST /register`

```json
{
  "username": "aadhi1176",
  "email": "aadhi@example.com",
  "password": "secret123"
}
```

### 2. Login

`POST /login`

```json
{
  "email": "aadhi@example.com",
  "password": "secret123"
}
```

Copy the `access_token`, click `Authorize` in Swagger, and enter:

```text
Bearer <your_access_token>
```

### 3. Create Category

`POST /categories`

```json
{
  "name": "Football"
}
```

### 4. Promote User to Admin

Run:

```bash
..\venv\Scripts\python -m app.utils.make_admin aadhi@example.com
```

### 5. Login Again as Admin

`POST /login`

```json
{
  "email": "aadhi@example.com",
  "password": "secret123"
}
```

Authorize Swagger again with the new token.

### 6. Create Product

`POST /products`

This endpoint uses `multipart/form-data`, not JSON.

Swagger form values:

```text
name = Nike Football
price = 1200
category_id = 1
image = <choose image file>
```

### 7. Update Product

`PUT /products/{product_id}`

Swagger form values:

```text
name = Adidas Football
price = 1500
category_id = 1
image = <optional new image file>
```

### 8. Partially Update Product

`PATCH /products/{product_id}`

Swagger form values:

```text
price = 1800
image = <optional new image file>
```

### 9. List Products

`GET /products`

Example query:

```text
/products?limit=20&offset=0&min_price=500&max_price=5000&sort=-price
```

### 10. Search Products

`GET /products/search`

Examples:

```text
/products/search?name=football
/products/search?category=football
/products/search?name=football&min_price=1000&max_price=2000
/products/search?name=football&category=football&min_price=500&max_price=3000
```

### 11. Add to Cart

`POST /carts`

```json
{
  "qty": 2,
  "product_id": 1
}
```

### 12. Get Cart

`GET /cart`

Example response:

```json
[
  {
    "id": 1,
    "qty": 2,
    "product": {
      "id": 1,
      "name": "Nike Football",
      "price": 1200,
      "image_url": "/uploads/sample.jpg"
    }
  }
]
```

### 13. Checkout

`POST /orders/checkout`

No request body required.

Example response:

```json
{
  "id": 1,
  "total_price": 2400,
  "status": "pending",
  "order_items": [
    {
      "id": 1,
      "quantity": 2,
      "price": 1200,
      "product": {
        "id": 1,
        "name": "Nike Football",
        "price": 1200,
        "image_url": "/uploads/sample.jpg"
      }
    }
  ]
}
```

### 14. List Orders

`GET /orders`

### 15. Get One Order

`GET /orders/{order_id}`

## Notes

- `POST /products`, `PUT /products/{id}`, `PATCH /products/{id}`, and `DELETE /products/{id}` require an admin token.
- `GET /products`, `GET /products/search`, `GET /products/{id}`, cart endpoints, and order endpoints work for authenticated users.
- Logs are written to `logs/app.log`.
- Uploaded files are stored in `uploads/`.
