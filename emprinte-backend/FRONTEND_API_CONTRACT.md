# Emprinte Backend – Frontend API Contract

> **Purpose**: This document describes the Emprinte Readers Hub frontend so a backend can be built that fits it exactly. Feed this doc to Cursor when building the backend in this folder.

---

## 1. Project Overview

**Emprinte Readers Hub** is a book club / reading community website for Africa. The frontend is a Next.js 16 app with these sections (in order):

- **Header** – Logo, nav links, Contact Us CTA
- **Hero** – Main tagline, CTA to join
- **Stats** – Numbers (members, reviews, stories) + Book Club growth tracker
- **BookClub** – “Build a Reader” initiative with progress bar
- **Initiatives** – Virtual Bootcamps intro + featured bootcamp card
- **Bootcamps** – Stacked bootcamp cards
- **Insights** – Article list (Emprinte Insider)
- **Testimonials** – Reader testimonials carousel
- **Newsletter** – Email signup form
- **Footer** – Contact, navigation, social links

The frontend uses **static data** from `@/constants/data` and **one live API**: newsletter signup. The goal is to support a **custom backend and database** (any stack: Node, Python, etc.) that powers all content and actions. **No Strapi** – you are building your own API and DB.

---

## 2. Tech Stack (Frontend)

- **Framework**: Next.js 16, React 19
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **API**: Plain `fetch()` to your backend (or via Next.js API routes that proxy to your backend). Frontend expects REST + JSON.

---

## 3. TypeScript Interfaces (Single Source of Truth)

These are the exact shapes the frontend expects. The backend should return data matching these types.

```typescript
// Navigation
interface NavigationLink {
  label: string;
  href: string;
}

// Social & Contact
interface SocialMediaLink {
  platform: 'instagram' | 'linkedin' | 'twitter';
  href: string;
}

interface ContactInfo {
  email: string;
  phone: { label: string; number: string }[];
}

// Testimonials
interface Testimonial {
  id: string;
  text: string;
  name: string;
  title: string;
  rating?: number; // 1–5, default 5
}

// Insights (blog/articles)
interface InsightArticle {
  id: string;
  date: string;       // e.g. "Friday, April 8, 2026"
  title: string;
  description: string;
  image: string;      // URL
  href?: string;      // optional link
}

// Bootcamps
interface BootcampCardProps {
  title: string;
  cohort: string;     // e.g. "Cohort II"
  participants: string; // e.g. "8 20+" or "23+"
  backgroundColor: string; // Tailwind class, e.g. "bg-pink-200"
}

// Stats (simple)
interface StatCardProps {
  value: string;  // e.g. "50+"
  label: string;  // e.g. "Active Members"
}

// Build a Reader initiative
interface BookProgress {
  booksCollected: number;
  totalBooks: number;
  pricePerBook: number; // in NGN
}
```

---

## 4. API Contracts

### 4.1 Newsletter Signup (Required – Used by Frontend)

**Endpoint**: `POST /api/emails`  
(The frontend calls this. Your backend can expose `POST /emails` or `POST /newsletter`; the frontend’s Next.js route can proxy to your API, or the frontend can be changed to call your base URL directly.)

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Validation** (frontend uses Zod; backend should validate too):
- `email`: non-empty string, valid email format

**Success (201)**:
```json
{
  "ok": true,
  "data": { "id": "<optional-id>", "email": "user@example.com" }
}
```
The frontend only checks `response.ok` and status 201; `data` can be minimal.

**Error (400)** – validation:
```json
{
  "error": "Invalid input",
  "details": { "email": ["Please enter a valid email address"] }
}
```

**Error (409)** – duplicate (optional):
```json
{
  "error": "Already subscribed",
  "message": "This email is already on the list."
}
```

**Error (500)** – server:
```json
{
  "error": "Failed to subscribe",
  "message": "<string>"
}
```

**Backend responsibility**: Persist the email in your database (e.g. `newsletter_subscribers` or `emails` table with unique constraint on `email`).

---

### 4.2 Content APIs (Proposed for Backend)

These are not implemented yet. The frontend currently uses static data but can be refactored to fetch from these endpoints.

#### Site Settings (Navigation, Contact, Social)

```
GET /api/settings
# or GET /settings – single resource (e.g. one row or config document)
```

**Response shape**:
```json
{
  "navigationLinks": [{ "label": "About Us", "href": "#about" }, ...],
  "footerNavigation": [...],
  "socialMediaLinks": [{ "platform": "instagram", "href": "..." }, ...],
  "contactInfo": {
    "email": "hello@emprintereaders.com",
    "phone": [{ "label": "Adepeju", "number": "081029348475" }, ...]
  }
}
```

#### Stats

```
GET /api/stats
```

**Response shape**:
```json
[
  { "value": "50+", "label": "Active Members" },
  { "value": "156+", "label": "Book Reviews" },
  { "value": "2000+", "label": "Beautiful Stories" }
]
```

#### Book Club Hero Copy

```
GET /api/book-club-hero
```

**Response shape**:
```json
{
  "badge": "Book Club",
  "title": "Reading That Changes the World.",
  "description": "...",
  "buttonText": "Join Now"
}
```

#### Build a Reader Progress

```
GET /api/build-a-reader
```

**Response shape**:
```json
{
  "booksCollected": 119,
  "totalBooks": 500,
  "pricePerBook": 2500
}
```

#### Insights (Articles)

```
GET /api/insights
# or GET /insights
```

**Response shape**:
```json
[
  {
    "id": "1",
    "date": "Friday, April 8, 2026",
    "title": "Article Title",
    "description": "Article excerpt...",
    "image": "https://...",
    "href": "/insights/1"
  }
]
```

#### Testimonials

```
GET /api/testimonials
```

**Response shape**: Array of `Testimonial` objects.

#### Bootcamps

```
GET /api/bootcamps
```

**Response shape**: Array of `BootcampCardProps` objects.

---

## 5. Current Static Data (Reference)

Use this as a baseline for seed content or default responses.

### Navigation
```json
{
  "navigationLinks": [
    { "label": "About Us", "href": "#about" },
    { "label": "Initiatives", "href": "#initiatives" },
    { "label": "Bootcamps", "href": "#bootcamps" }
  ],
  "footerNavigation": [
    { "label": "Home", "href": "/" },
    { "label": "Bootcamps", "href": "#bootcamps" },
    { "label": "Initiatives", "href": "#initiatives" },
    { "label": "About Us", "href": "#about" }
  ]
}
```

### Social
```json
{
  "socialMediaLinks": [
    { "platform": "instagram", "href": "https://instagram.com/emprinte" },
    { "platform": "linkedin", "href": "https://linkedin.com/company/emprinte" },
    { "platform": "twitter", "href": "https://twitter.com/emprinte" }
  ]
}
```

### Contact
```json
{
  "contactInfo": {
    "email": "hello@emprintereaders.com",
    "phone": [
      { "label": "Adepeju", "number": "081029348475" },
      { "label": "Abiola", "number": "081029348475" }
    ]
  }
}
```

### Stats
```json
[
  { "value": "50+", "label": "Active Members" },
  { "value": "156+", "label": "Book Reviews" },
  { "value": "2000+", "label": "Beautiful Stories" }
]
```

### Book Progress (Build a Reader)
```json
{
  "booksCollected": 119,
  "totalBooks": 500,
  "pricePerBook": 2500
}
```

### Insights
Each article: `id`, `date`, `title`, `description`, `image` (URL), optional `href`.

### Testimonials
Each: `id`, `text`, `name`, `title`, `rating` (1–5).

### Bootcamps
Each: `title`, `cohort`, `participants`, `backgroundColor` (Tailwind class).

---

## 6. Environment Variables (Frontend ↔ Backend)

| Variable | Where | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_API_URL` | Frontend | Base URL of your backend (e.g. `https://api.emprinte.com`). Used when frontend calls your API directly. |
| Backend URL in Next.js route | Frontend | If keeping Next.js proxy, the frontend’s API route needs your backend base URL (e.g. `API_URL` or `BACKEND_URL`). |

No Strapi or third-party CMS env vars. Your backend uses its own DB URL, secrets, etc.

---

## 7. How the Frontend Consumes APIs

### Newsletter

- Form submits to `POST /api/emails` (Next.js route). You can keep that route and have it call your backend’s `POST /emails` (or similar), or change the frontend to call your backend URL directly.
- Frontend expects 201 on success; 400/500 with `error` and optional `message` on failure.

### Content Fetching (when you add it)

- Use `fetch(NEXT_PUBLIC_API_URL + '/insights')` (or similar).
- Expect JSON matching the interfaces in §3.
- Handle loading and error states in each section.

---

## 8. Database / Model Suggestions (Any Stack)

Use these as a guide for your own DB (Postgres, SQLite, MongoDB, etc.).

### Table/Collection: `emails` (newsletter subscribers)
- `id` (PK)
- `email` (unique, required)
- `created_at` (optional)

### Table/Collection: `settings` (single row or key-value)
- Store: `navigationLinks`, `footerNavigation`, `socialMediaLinks`, `contactInfo` (JSON or separate columns/tables)

### Table/Collection: `stats`
- `id`, `value`, `label`, `sort_order`

### Table/Collection: `book_club_hero` (single row)
- `badge`, `title`, `description`, `button_text`

### Table/Collection: `build_a_reader`
- Single row: `books_collected`, `total_books`, `price_per_book`

### Table/Collection: `insight_articles`
- `id`, `date`, `title`, `description`, `image` (URL or path), `href` (optional), `created_at`

### Table/Collection: `testimonials`
- `id`, `text`, `name`, `title`, `rating` (1–5), `sort_order`

### Table/Collection: `bootcamps`
- `id`, `title`, `cohort`, `participants`, `background_color`

---

## 9. Design Tokens (Optional)

Colors used in the UI:

- Primary green: `#015B51`
- Dark: `#142218`
- Accent red: `#E63715`, `#FB1300`
- Gray: `#7B7B7B`, `#A7A7A7`
- Background: `#F0FFFD`, `#CAE594`, `#FFDBF3`, etc.

---

## 10. Implementation Checklist for Your Backend

- [ ] **Newsletter**: `POST /emails` (or `/newsletter`) – persist email in your DB; return 201 with `{ ok: true, data: { ... } }`
- [ ] **CORS**: Allow the frontend origin (e.g. `http://localhost:3000`, production domain)
- [ ] **Error format**: Use `error` and optional `message` in JSON error responses
- [ ] **Optional**: Content endpoints (settings, stats, book-club-hero, build-a-reader, insights, testimonials, bootcamps) with response shapes from §4.2

---

*Custom backend + database only. No Strapi.*
