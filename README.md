# Haett Partner Programme

A full-stack web application for managing affiliate partner applications. Influencers, gyms, and businesses can apply to become partners, get reviewed by an admin, and receive unique discount codes to share with their audience.

Built as part of the Haett Intern Assessment — Full-Stack Role.

---

## What It Does

The entire app lives on a single page at `/` and renders one of six views depending on who is logged in:

| View | Who Sees It |
|------|-------------|
| **Landing** | Visitor — not logged in |
| **Application Form** | Logged-in user with no application yet |
| **Pending** | User who has submitted and is awaiting review |
| **Rejected** | User whose application was rejected (can reapply) |
| **Partner Dashboard** | Approved partner — shows discount codes and usage stats |
| **Admin Panel** | Admin — approve/reject applications, toggle discount codes |

All transitions happen in-state — no page reloads, no routing library.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, inline styles |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcryptjs |

---

## Project Structure

```
Haett-Assessment/
├── Client/
│   └── haett-frontend/     # React frontend
└── Server/                 # Express backend
```

---

## Quick Start

### Prerequisites

- Node.js v18+
- A MongoDB Atlas URI (or local MongoDB)

---

### 1. Backend Setup

```bash
cd Server
npm install
```

Create a `.env` file inside `Server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Seed the database (creates admin + test user):

```bash
node seed.js
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

---

### 2. Frontend Setup

Open a new terminal:

```bash
cd Client/haett-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

> All `/api` requests are proxied to `http://localhost:5000` automatically — no extra config needed.

---

## Test Credentials

| Role  | Email           | Password |
|-------|-----------------|----------|
| Admin | admin@haett.com | admin123 |
| User  | user@haett.com  | user123  |

---

## Key Features

**Partner Flow**
- Register / login
- Submit an application (partner type, business name, optional details)
- See pending status after submission
- If rejected — view the reason and reapply
- If approved — view assigned discount codes with copy-to-clipboard, usage count, and expiry

**Admin Flow**
- Filter applications by All / Pending / Approved / Rejected
- Approve an application (auto-generates a `HAETT-XXXXXX` discount code at 20% off)
- Reject with a required reason (inline form, confirm button disabled until reason is typed)
- View and toggle (activate/deactivate) discount codes per partner
- Toast notification after every action

---

## API Overview

| Group | Endpoints |
|-------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Partner | `POST /api/partner/apply`, `GET /api/partner/my-application`, `GET /api/partner/my-codes` |
| Admin | `GET /api/admin/applications`, `POST /api/admin/applications/:id/approve`, `POST /api/admin/applications/:id/reject`, `GET /api/admin/applications/:id/codes`, `PATCH /api/admin/codes/:codeId/toggle` |

All partner and admin routes require a valid JWT (`Authorization: Bearer <token>`). Admin routes additionally require `role === "admin"`.

---

## What's Working

- All six views render correctly based on auth state and application status
- Register, login, logout
- Partner application submit → pending → approved / rejected flow
- Rejected partner can reapply
- Admin approve (with auto discount code) and reject (with reason)
- Admin can view and toggle partner codes
- Toast notifications after every admin action
- Session persistence via localStorage JWT
