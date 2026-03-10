# Emprinte API – Frontend Integration Guide

This document describes how the frontend consumes the Emprinte backend API.

---

## Setup

Add to `.env` (or `.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- When **set**: Newsletter signup and Admin forms call the backend API.
- When **empty**: They fall back to same-origin `/api/*` (Next.js routes).

---

## What Uses the Backend

| Feature            | Endpoint(s)               | Method |
|--------------------|---------------------------|--------|
| Newsletter signup  | `/api/emails`             | POST   |
| Admin – settings   | `/api/settings`           | GET, PUT |
| Admin – Build a Reader | `/api/build-a-reader` | GET, PUT |
| Admin – insights   | `/api/insights`           | GET, POST |
| Admin – testimonials | `/api/testimonials`    | GET, PUT |

---

## API Client

The frontend uses `src/lib/api.ts`:

- `getApiUrl(path)` – returns full URL (backend or same-origin)
- `apiFetch(path, options)` – fetch helper with JSON headers

---

## Full Endpoint Reference

See the backend README or API docs for request/response shapes and error formats.
