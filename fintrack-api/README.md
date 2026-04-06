# FinTrack API

> **Finance Data Processing & Access Control Backend**
> Built with Node.js · TypeScript · Express · Prisma (SQLite) · JWT

A production-quality REST API backend for a finance dashboard system. Supports
role-based access control, full financial record management, advanced analytics,
a tamper-evident audit trail, and CSV export — all runnable locally with zero
infrastructure setup.

---

## Quick Start

```bash
# 1. Clone and install dependencies
npm install

# 2. Push database schema and seed with demo data
npm run db:push && npm run db:seed

# 3. Start the development server
npm run dev
```

Server runs at **http://localhost:3000**
Interactive API docs at **http://localhost:3000/api-docs**

---

## Test Credentials

All demo accounts use the password **`Password@123`**

| Email                    | Role    | Permissions                          |
|--------------------------|---------|--------------------------------------|
| admin@fintrack.io        | ADMIN   | Full access — users, records, audit  |
| analyst@fintrack.io      | ANALYST | Read + write transactions, dashboard |
| viewer@fintrack.io       | VIEWER  | Read-only — dashboard and records    |

---

## Tech Stack

| Layer         | Technology                                              |
|---------------|---------------------------------------------------------|
| Runtime       | Node.js 20 + TypeScript                                 |
| Framework     | Express 4                                               |
| ORM           | Prisma with SQLite (zero-setup, swap to PostgreSQL trivially) |
| Auth          | JWT access tokens (15 min) + opaque refresh tokens (7 d) |
| Validation    | Zod (request body, query params, env vars)              |
| Docs          | Swagger UI / OpenAPI 3.0                                |
| Tests         | Jest + Supertest                                        |
| Security      | Helmet, CORS, express-rate-limit                        |

---

## Architecture

```
src/
├── config/          # Env validation (Zod), Swagger spec
├── lib/             # Prisma singleton client
├── middlewares/
│   ├── auth.ts          # JWT verification + live user status check
│   ├── rbac.ts          # Role-based access control guard factory
│   ├── validate.ts      # Zod request validation middleware
│   ├── errorHandler.ts  # Centralised error normalisation
│   ├── requestId.ts     # UUID per-request tracing
│   └── rateLimiter.ts   # Per-endpoint rate limits
├── modules/
│   ├── auth/            # Login, refresh, logout, change-password
│   ├── users/           # User CRUD (Admin only)
│   ├── transactions/    # Financial record CRUD, soft delete, CSV export
│   ├── dashboard/       # Analytics engine
│   └── audit/           # Immutable change history
└── utils/
    ├── ApiResponse.ts   # Consistent success response builder
    ├── ApiError.ts      # Custom error class hierarchy
    ├── asyncHandler.ts  # Async try/catch eliminator
    └── pagination.ts    # Page/limit extractor
```

Every module follows the same **Controller → Service → Prisma** layering.
Controllers handle HTTP concerns. Services hold all business logic. Prisma
is never called directly from a controller.

---

## API Reference

All routes are prefixed `/api/v1`. The full interactive reference is available
at `/api-docs` when the server is running.

### Auth

| Method | Endpoint                    | Access    | Description                           |
|--------|-----------------------------|-----------|---------------------------------------|
| POST   | /auth/login                 | Public    | Obtain access + refresh tokens        |
| POST   | /auth/refresh               | Public    | Rotate token pair                     |
| POST   | /auth/logout                | Any auth  | Revoke session                        |
| GET    | /auth/me                    | Any auth  | Get own profile                       |
| PUT    | /auth/change-password       | Any auth  | Change password (revokes all sessions)|

### Users

| Method | Endpoint        | Access | Description                      |
|--------|-----------------|--------|----------------------------------|
| GET    | /users          | ADMIN  | List users with filter/pagination|
| POST   | /users          | ADMIN  | Create a new user                |
| GET    | /users/:id      | ADMIN  | Get user by ID                   |
| PATCH  | /users/:id      | ADMIN  | Update role, name, status        |
| DELETE | /users/:id      | ADMIN  | Soft-deactivate user             |

### Transactions

| Method | Endpoint                  | Access          | Description                        |
|--------|---------------------------|-----------------|------------------------------------|
| GET    | /transactions             | All             | List with 8+ filter options        |
| POST   | /transactions             | ANALYST, ADMIN  | Create transaction                 |
| GET    | /transactions/export/csv  | All             | Download as CSV                    |
| GET    | /transactions/:id         | All             | Get single record                  |
| PATCH  | /transactions/:id         | ANALYST, ADMIN  | Update record                      |
| DELETE | /transactions/:id         | ANALYST, ADMIN  | Soft delete (restorable)           |
| POST   | /transactions/:id/restore | ADMIN           | Restore soft-deleted record        |

### Dashboard

| Method | Endpoint                     | Access | Description                            |
|--------|------------------------------|--------|----------------------------------------|
| GET    | /dashboard/summary           | All    | Income, expenses, net balance, savings |
| GET    | /dashboard/categories        | All    | Category breakdown with % shares       |
| GET    | /dashboard/trends/monthly    | All    | Month-by-month income vs expense       |
| GET    | /dashboard/trends/weekly     | All    | Week-by-week current month cash flow   |
| GET    | /dashboard/recent            | All    | Latest N transactions                  |
| GET    | /dashboard/anomalies         | All    | Statistical outlier detection          |

### Audit

| Method | Endpoint              | Access          | Description                        |
|--------|-----------------------|-----------------|------------------------------------|
| GET    | /audit                | ADMIN           | Full audit log with filters        |
| GET    | /audit/:entity/:id    | ANALYST, ADMIN  | Change history for a specific record|

---

## Key Design Decisions

### 1. Role Hierarchy (not flat permissions)
Roles follow a hierarchy: `ADMIN > ANALYST > VIEWER`. The `requireRole()` guard
compares numeric levels, so `requireRole("ANALYST")` automatically permits
ADMINs without listing every allowed role.

### 2. Refresh Token Rotation
Each use of a refresh token immediately revokes it and issues a new one.
If an old token is replayed, the system rejects it. This limits exposure from
token theft.

### 3. Soft Delete with Restore
Transactions are never hard-deleted. A `isDeleted` flag plus `deletedAt` timestamp
preserves the full record. Admins can restore accidentally deleted entries. The
audit trail captures every delete and restore event.

### 4. Audit Trail as First-Class Feature
`AuditService.log()` is called from every service method that mutates data.
Failures in audit logging are caught and logged to stderr but never bubble up
to the caller — a failed audit write must not break the main operation.

### 5. Statistical Anomaly Detection
The `/dashboard/anomalies` endpoint computes a z-score per transaction against
the mean and standard deviation of its category. Transactions beyond 2 standard
deviations are flagged. This is lightweight but demonstrates analytical thinking
beyond basic aggregation.

### 6. Consistent Response Envelope
Every response — success or error — follows the same shape:
```json
{
  "success": true,
  "message": "...",
  "data": {},
  "pagination": {},
  "requestId": "uuid",
  "timestamp": "ISO 8601"
}
```
This makes frontend integration and debugging predictable.

### 7. SQLite for Zero-Infrastructure Dev
Prisma makes the database swappable with a one-line change. SQLite removes the
need for Docker or a running database service to evaluate the project.

---

## Running Tests

```bash
npm test                # Run all tests
npm run test:coverage   # Run with coverage report
```

Tests spin up their own isolated SQLite database (`test.db`) and teardown
after each suite. No manual setup required.

---

## Environment Variables

Copy `.env.example` to `.env`. All variables have safe defaults for development.

| Variable                 | Default          | Description                       |
|--------------------------|------------------|-----------------------------------|
| `PORT`                   | 3000             | HTTP server port                  |
| `NODE_ENV`               | development      | Environment                       |
| `DATABASE_URL`           | file:./dev.db    | Prisma database URL               |
| `JWT_ACCESS_SECRET`      | (dev default)    | **Must change in production**     |
| `JWT_REFRESH_SECRET`     | (dev default)    | **Must change in production**     |
| `JWT_ACCESS_EXPIRES_IN`  | 15m              | Access token lifetime             |
| `JWT_REFRESH_EXPIRES_IN` | 7d               | Refresh token lifetime            |
| `RATE_LIMIT_WINDOW_MS`   | 900000           | Rate limit window (15 min)        |
| `RATE_LIMIT_MAX`         | 100              | Max requests per window           |

---

## Scripts

```bash
npm run dev          # Hot-reload development server
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled production build
npm run db:push      # Sync schema to database (no migration file)
npm run db:seed      # Seed with demo users and transactions
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:reset     # Reset database and re-seed
npm test             # Run Jest test suite
```

---

## Switching to PostgreSQL

1. Change the provider in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/fintrack"
   ```
3. Run `npm run db:migrate` to apply the schema.

---

## Assumptions Made

- **Soft delete only**: Financial records are never permanently destroyed.
  This reflects real-world accounting requirements where audit history must
  be preserved.
- **Amount as float**: Stored as `Float` in SQLite (double precision). For a
  true production system, `Decimal` via PostgreSQL's `numeric` type would be
  preferred to avoid floating point rounding on large values.
- **Tags as JSON string**: SQLite does not support array columns, so tags are
  stored as a JSON-serialised string and parsed on read. This is transparent to
  API consumers.
- **Role model**: Three roles were deemed sufficient for a dashboard system.
  A production system might use a finer-grained permissions table.
- **Single-tenant**: The current schema does not include multi-tenancy (organisations
  or workspaces). This would be a natural next step for a real product.

---

## What I Would Add Given More Time

- [ ] Redis caching for dashboard aggregations (expensive queries)
- [ ] WebSocket events for real-time dashboard updates
- [ ] Multi-tenancy (organisations with members)
- [ ] Two-factor authentication
- [ ] Background jobs for scheduled report generation
- [ ] OpenTelemetry tracing integration
- [ ] CI/CD pipeline (GitHub Actions)
