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

## Recommended Deployment Direction

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or Fly.io
- Database: PostgreSQL on Render, Railway, Neon, or Supabase
- File storage: Cloudinary or Supabase Storage

## Admin Workflow

- Admin users can manage products and categories from `/admin/catalog`
- Admin users can review and update request statuses from `/admin/orders`

## Final Notes

AuraSport is designed as a no-payment request-first commerce experience. Customers place requests, and the business confirms details manually through phone, WhatsApp, or email.
