# Scholar Plug — School Supplies for CBC & International Curricula

A full-stack e-commerce starter for a Kenyan school-supplies store, with three
product tracks: **CBC** (Competence-Based Curriculum, KICD-aligned),
**International** (Cambridge, IB, IGCSE), and **University**, organized by
school/faculty.

## Stack
- **Backend:** Node.js + Express, JSON file storage (swap for a real DB later), Stripe for card payments, a stubbed M-Pesa (Daraja) flow
- **Frontend:** React + Vite + React Router, cart persisted in the browser, dark mode toggle persisted in the browser

## Project structure
```
scholar/
  server/        Express API (products, orders, payments)
  client/        React storefront
```

## Running it locally

### 1. Backend
```bash
cd server
cp .env.example .env     # then fill in STRIPE_SECRET_KEY if you want card payments
npm install
npm run dev               # http://localhost:4000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

Open http://localhost:5173 — the Vite dev server proxies `/api` calls to the
Express backend automatically (see `client/vite.config.js`).

## What's included
- Product catalog seeded with CBC, International, and University items (`server/data/products.json`) — textbooks, stationery, learning kits, uniforms, and faculty-specific materials, each tagged by category/subcategory/level
- Category browsing and search-ready filtering (`/api/products?category=cbc`), including school-level filtering for university items (`/api/products?category=university&subcategory=School%20of%20Law`)
- A **University** section on the homepage linking directly into each school
- Product detail pages with quantity picker
- Cart (persisted in `localStorage`)
- **Dark mode toggle** in the navbar — theme is saved to `localStorage` and falls back to the visitor's OS preference on first visit (`client/src/context/ThemeContext.jsx`)
- A **Feedback** page (`/feedback`) with a star rating and message form, saved via `POST /api/feedback` to `server/data/feedback.json`
- Checkout with three payment paths:
  - **M-Pesa** — stubbed; wire up Safaricom's Daraja STK Push API in `server/routes/orders.js` using the `MPESA_*` env vars
  - **Card** — working Stripe Checkout Session in test mode once `STRIPE_SECRET_KEY` is set
  - **Cash on Delivery** — works out of the box
- Order confirmation page and `/api/orders/:id` lookup

## Before going live
1. **Swap JSON storage for a real database** (Postgres/MySQL via Prisma, or MongoDB) — the current file-based storage is fine for development but not for concurrent production traffic.
2. **Finish the M-Pesa integration** — register on the [Daraja developer portal](https://developer.safaricom.co.ke/), get your shortcode/passkey, and implement the STK Push + callback handling in `server/routes/orders.js`.
3. **Switch Stripe to live keys** and add webhook handling for `checkout.session.completed` to reliably mark orders paid (right now the frontend trusts the redirect, which is fine for a demo but not for production).
4. **Add authentication** for an admin dashboard (manage products/orders) and optionally customer accounts/order history.
5. **Add image hosting** — products currently use emoji placeholders; swap `image` for real photo URLs (e.g. Cloudinary, S3) and update `ProductCard`/`ProductDetail`.
6. **Deploy:** e.g. frontend on Vercel/Netlify, backend on Render/Railway/Fly.io, with environment variables set there instead of `.env`.
7. **Add input validation/rate limiting** on the API before exposing it publicly.

## Notes on the product tracks
- CBC products are tagged `category: "cbc"` with Kenyan grade levels (PP1–PP2, Primary, Junior School).
- International products are tagged `category: "international"` with levels like Cambridge Primary, IB PYP, IGCSE, A-Level.
- University products are tagged `category: "university"`, with `subcategory` set to the school/faculty name (e.g. `"School of Computing and Informatics"`). The current schools are: School of Engineering (Architecture), School of Computing and Informatics, School of Business, School of Medicine and Health Sciences, and School of Law. Add a new school by giving products a new `subcategory` value and adding that name to the `SCHOOLS` list in `client/src/pages/Products.jsx` and `client/src/pages/Home.jsx`.
- Add more items by appending to `server/data/products.json` — no code changes needed for new products in existing categories/schools.
