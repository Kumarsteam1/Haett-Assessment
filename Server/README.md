# Haett Partner Programme — Backend

Node.js + Express + MongoDB REST API powering the Haett affiliate partner programme.

---

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express.js
- **Database:** MongoDB (Atlas) via Mongoose
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Config:** dotenv

---

## Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB)

---

## Setup & Installation

### 1. Clone and install dependencies

```bash
cd Server
npm install
```

### 2. Configure environment variables

Create a `.env` file in the `Server/` root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Seed the database

This creates one admin account and one test user:

```bash
node seed.js
```

Expected output:
```
Seeded: admin@haett.com / admin123
Seeded: user@haett.com / user123
```

> The seed script is safe to re-run — it deletes and recreates those two accounts each time.

### 4. Start the server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## Test Credentials

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@haett.com    | admin123   |
| User  | user@haett.com     | user123    |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint     | Auth | Description          |
|--------|--------------|------|----------------------|
| POST   | `/register`  | No   | Create a new user    |
| POST   | `/login`     | No   | Login, returns JWT   |
| GET    | `/me`        | JWT  | Get logged-in user   |

**Login response:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "_id": "...",
    "name": "Admin",
    "email": "admin@haett.com",
    "role": "admin"
  }
}
```

---

### Partner — `/api/partner` (JWT required)

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| POST   | `/apply`           | Submit a partner application    |
| GET    | `/my-application`  | Get the logged-in user's application |
| GET    | `/my-codes`        | Get the logged-in user's discount codes |

---

### Admin — `/api/admin` (JWT + admin role required)

| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | `/applications?status=pending`  | List applications (filter by status) |
| POST   | `/applications/:id/approve`     | Approve application + auto-generate discount code |
| POST   | `/applications/:id/reject`      | Reject application with a reason     |
| GET    | `/applications/:id/codes`       | Get discount codes for a partner     |
| PATCH  | `/codes/:codeId/toggle`         | Activate or deactivate a code        |

---

## How Admin Access Works

The `role` field on the User model defaults to `"user"`. The only way to create an admin is via the seed script — there is no API endpoint for promoting users. When an admin logs in, the JWT payload includes their role, and all `/api/admin/*` routes are protected by both `protect` (valid JWT) and `adminOnly` (role === "admin") middleware.

---

## Auto-generated Discount Codes

When an admin approves an application, the backend automatically:
1. Sets `application.status = "approved"`
2. Creates a `DiscountCode` with format `HAETT-XXXXXX`, 20% off, assigned to that partner

No manual code creation is needed.