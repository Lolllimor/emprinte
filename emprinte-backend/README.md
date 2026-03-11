# Emprinte Backend

Custom backend and database for the Emprinte Readers Hub frontend. **No Strapi** – build your own API and DB (Node, Python, etc.).

## How to Use This With Cursor

1. **Open this folder** in Cursor.
2. **Reference the contract**: Start backend tasks with *"Read FRONTEND_API_CONTRACT.md and build X"*.
3. **Contract file**: `FRONTEND_API_CONTRACT.md` contains:
   - TypeScript interfaces the frontend expects
   - REST API contracts (request/response shapes)
   - Newsletter endpoint (the one the frontend uses today)
   - Optional content endpoints (settings, stats, insights, testimonials, bootcamps)
   - Database/model suggestions (tables, fields) – stack-agnostic
   - Seed data reference

## Frontend Location

The frontend lives in the parent folder: `../` (same repo as `emprinte`).

- **Stack**: Next.js 16, React 19, Tailwind
- **API**: The frontend currently posts newsletter signup to `POST /api/emails` (a Next.js route). That route can proxy to your backend’s newsletter endpoint. For other content, the frontend can be updated to call your backend base URL (e.g. `NEXT_PUBLIC_API_URL`).

## Quick Start

1. Build your backend (Express, Fastify, FastAPI, etc.) and database (Postgres, SQLite, MongoDB, etc.).
2. Implement **newsletter signup** first: accept `POST` with `{ "email": "..." }`, validate, store in DB, return 201 and `{ ok: true, data: { ... } }`.
3. Enable **CORS** for the frontend origin.
4. Optionally add content endpoints (settings, stats, insights, testimonials, bootcamps) using the response shapes in the contract.
5. Point the frontend at your API (env var or by updating the Next.js API route to proxy to your backend).
