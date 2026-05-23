# VDMS Backend Team Setup

This guide explains how to run the backend with PostgreSQL and share real output with your team.

## 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment

Copy example file and edit values.

```bash
cp .env.example .env
```

Windows PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

## 4. Create database and seed data

1. Create a database named vdms_db (or change DATABASE_NAME in .env).
2. Load schema:

```bash
psql -U postgres -d vdms_db -f scripts/schema.sql
```

3. Run seed script:

```bash
psql -U postgres -d vdms_db -f scripts/seed.sql
```

## 5. Start backend

```bash
npm run start:dev
```

Backend runs on PORT from .env (default 3000).

---

## Shared Real Output Rules

Your team will see the same output only when all of these are true:

1. Everyone uses the same backend URL.
2. Backend uses one shared PostgreSQL database.
3. Frontend points to that backend URL.
4. CORS FRONTEND_URL includes all allowed frontend origins.

If anyone uses localhost with their own local DB, they will see different data.

---

## Deploy mode (shared for all friends)

Use .env.production.example as reference.

Required production env values:

- DATABASE_URL (preferred for hosted PostgreSQL)
- PORT
- FRONTEND_URL (comma-separated frontend URLs)
- NODE_ENV=production

Example FRONTEND_URL with multiple apps:

```text
https://vdms-frontend.vercel.app,https://vdms-frontend-preview.vercel.app
```

---

## Troubleshooting

- 401/403/CORS error:
  - Verify FRONTEND_URL includes exact frontend origin.
- Database connection error:
  - Verify DATABASE_URL or DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME.
- Empty projects:
  - Re-run schema then seed:
    - psql -U postgres -d vdms_db -f scripts/schema.sql
    - psql -U postgres -d vdms_db -f scripts/seed.sql
