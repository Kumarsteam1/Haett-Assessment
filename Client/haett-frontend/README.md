# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





# Haett Partner Programme — Frontend

React single-page application for the Haett affiliate partner programme. Renders six different views on a single page based on the logged-in user's role and application status — no full page reloads.

---

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8 with `@vitejs/plugin-react-swc`
- **Styling:** Inline styles (no CSS framework)
- **Font:** DM Sans (Google Fonts)
- **HTTP:** Native `fetch` API

---

## Prerequisites

- Node.js v18+
- Backend server running at `http://localhost:5000`

---

## Setup & Installation

### 1. Install dependencies

```bash
cd haett-frontend
npm install
```

### 2. Start the development server

```bash
npm run dev
```

App runs at `http://localhost:3000`

> The Vite dev server proxies all `/api` requests to `http://localhost:5000` automatically — no CORS configuration needed during development.

---

## The Six Views

The entire app lives on one page. The view rendered depends on auth state and application status:

| State | View | Description |
|-------|------|-------------|
| Not logged in | **Landing** | Explains the programme with a call-to-action to sign in |
| Logged in, no application | **Application Form** | Form to apply as a partner (type + business name required) |
| Application pending | **Pending** | Status card showing the application is under review |
| Application rejected | **Rejected** | Shows the rejection reason with an option to reapply |
| Application approved | **Dashboard** | Shows discount codes, usage stats, and copy-to-clipboard |
| Admin user | **Admin Panel** | Tabs to filter applications, approve/reject, toggle codes |

All view transitions happen in-state — no page reloads, no routing library.

---

## Auth Flow

1. User clicks **Sign In** → `LoginModal` opens
2. On successful login, the JWT is stored in `localStorage`
3. `App.jsx` calls `GET /api/auth/me` on mount to restore session
4. If `user.role === "admin"` → routed to `AdminView`
5. Otherwise, `GET /api/partner/my-application` determines which view to show

---

## Test Credentials

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@haett.com    | admin123   |
| User  | user@haett.com     | user123    |

> These are created by the backend seed script. Run `node seed.js` in the `Server/` directory before testing.

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file host or `npm run preview` for a local preview.

---

## Notes

- Uses `@vitejs/plugin-react-swc` (SWC-based) instead of the default Babel plugin for better compatibility with React 19 + Vite 8
- All API calls are centralised in `src/api.js` — the `BASE` URL points to `http://localhost:5000/api`
- Toast notifications auto-dismiss after 3 seconds
- The admin panel auto-generates a `HAETT-XXXXXX` discount code (20% off) on approval