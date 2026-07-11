# AuraSport

AuraSport is a request-based sports storefront built with a React frontend and FastAPI backend. Customers can browse products, save wishlist items, add items to cart, and submit manual order requests without online payments.

## What Works

- Customer auth with signup, login, and profile saving
- Product catalog with categories, search, sort, filtering, and product detail pages
- Wishlist saved locally in the browser
- Cart flow and manual order request checkout
- Customer order history and order tracking timeline
- Help/support page
- Admin catalog management
- Admin request management

## Tech Stack

- Frontend: React, TanStack Router, Vite, TypeScript, Tailwind
- Backend: FastAPI, SQLAlchemy, SQLite

## Project Structure

- `src/` frontend app
- `aurasport-backend/` backend FastAPI app
- `backend_main.py` root ASGI entry that exposes the backend app

## Local Run

### 1. Frontend

From the project root:

```bash
npm install
npm run dev
```

Frontend default dev URL:

```text
http://127.0.0.1:3000
```

If your frontend needs to point to a different backend URL, set:

```text
VITE_API_URL=http://127.0.0.1:8000
```

You can copy `.env.example` to `.env` if you want a local frontend env file.

### 2. Backend

Create and use the Python virtual environment if needed, then install backend dependencies and run Uvicorn from the project root:

```bash
venv\Scripts\python -m pip install fastapi uvicorn sqlalchemy python-multipart passlib[bcrypt] python-jose[email]
venv\Scripts\python -m uvicorn backend_main:app --reload --host 127.0.0.1 --port 8000
```

Backend default URL:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

## Default Data

- The backend seeds demo categories and products automatically on startup if the database is empty.
- The app currently uses a local SQLite database file in the project root.

## Production Notes

- This project is currently optimized for local/demo deployment.
- Payments are intentionally not included.
- Wishlist is browser-local, not server-synced.
- For production, move from SQLite to a hosted database and replace local uploads with managed storage.
- Alembic migrations are now the expected schema source of truth for backend changes.

## Recommended Deployment Direction

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or Fly.io
- Database: PostgreSQL on Render, Railway, Neon, or Supabase
- File storage: Cloudinary or Supabase Storage

## Environment Files

- Frontend example: `.env.example`
- Backend example: `aurasport-backend/app/.env.example`

## Admin Account Setup

1. Register a normal user from the app or Swagger.
2. Promote that user to admin from `aurasport-backend`:

```bash
..\venv\Scripts\python -m app.utils.make_admin yourmail@example.com
```

3. Log in again so the token contains the admin role.

## Database Migration Path

For a real production move from SQLite to PostgreSQL:

1. Point the backend `DATABASE_URL` to PostgreSQL.
2. Run Alembic migrations to create the target schema.
3. Use the backend migration script to copy data from the old SQLite database:

```bash
cd aurasport-backend
..\venv\Scripts\python -m app.utils.migrate_sqlite_to_postgres --sqlite-path ..\aurasport.db --postgres-url postgresql://postgres:password@localhost/aurasport
```

## Admin Workflow

- Admin users can manage products and categories from `/admin/catalog`
- Admin users can review and update request statuses from `/admin/orders`

## Final Notes

AuraSport is designed as a no-payment request-first commerce experience. Customers place requests, and the business confirms details manually through phone, WhatsApp, or email.
