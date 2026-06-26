# VDMS Backend Deployment Checklist

Use this checklist before sharing with friends.

## Environment

- [ ] Set NODE_ENV=production
- [ ] Set PORT
- [ ] Set DATABASE_URL (or full DB host/user/pass vars)
- [ ] Set FRONTEND_URL to deployed frontend origin(s)

## Database

- [ ] PostgreSQL server is reachable from backend host
- [ ] Run scripts/schema.sql in target database
- [ ] Run scripts/seed.sql in target database
- [ ] Verify rows exist in projects, documents, team_members, notifications

## Backend health

- [ ] Backend starts without runtime errors
- [ ] Logs show server is running on expected port
- [ ] CORS allows deployed frontend origin

## Frontend integration

- [ ] Frontend VITE_API_BASE_URL points to deployed backend
- [ ] Dashboard loads without network errors
- [ ] Projects and stats show real data from API

## Final smoke test

- [ ] Open app in browser as a friend user
- [ ] See same project IDs (PROJ-2023-001 to PROJ-2023-007)
- [ ] Confirm notifications and documents are visible
