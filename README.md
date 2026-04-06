<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a0f,50:1a1033,100:2d1b69&height=240&section=header&text=FinTrack&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=Finance%20Data%20Processing%20%26%20Access%20Control%20Backend&descAlignY=58&descSize=18&descColor=a89bfc&animation=fadeIn" width="100%"/>

<br/>

<p>
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=flat-square"/>
  <img src="https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=flat-square&logo=swagger&logoColor=black"/>
  <img src="https://img.shields.io/badge/Tests-Jest_+_Supertest-C21325?style=flat-square&logo=jest&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render&logoColor=black"/>
</p>

<br/>

<table>
<tr>
<td align="center">
<a href="https://fintrack-rbac-api.vercel.app">
<img src="https://img.shields.io/badge/🌐%20%20Live%20Dashboard%20%20—%20Click%20to%20Launch-7c6dfa?style=for-the-badge" alt="Live Dashboard"/>
</a>
</td>
<td align="center">
<a href="https://fintrack-rbac-api.onrender.com/api-docs">
<img src="https://img.shields.io/badge/📚%20%20Swagger%20API%20Docs%20%20—%20Interactive-85EA2D?style=for-the-badge&logoColor=black" alt="API Docs"/>
</a>
</td>
<td align="center">
<a href="https://fintrack-rbac-api.onrender.com/health">
<img src="https://img.shields.io/badge/💚%20%20Health%20Check%20%20—%20Live%20Status-22c55e?style=for-the-badge" alt="Health"/>
</a>
</td>
</tr>
</table>

<br/>

> **A production-grade REST API backend** for a finance dashboard system — featuring JWT authentication with refresh token rotation, hierarchical role-based access control, advanced analytics with statistical anomaly detection, a tamper-evident audit trail, and CSV export. Built with TypeScript, Express, and Prisma.

<br/>

---

</div>

## ⚡ Important — Wake Up the API First

> The backend runs on **Render's free tier** which spins down after 15 minutes of inactivity.
> If the dashboard shows **"API Disconnected"** or login fails, the server is sleeping.

**→ Click this link first and wait for it to respond (up to 60 seconds):**

**[https://fintrack-rbac-api.onrender.com/health](https://fintrack-rbac-api.onrender.com/health)**

Once you see `{"status":"ok"}` in your browser, go back to the dashboard and everything will work normally.

---

## 📋 Table of Contents

| # | Section |
|---|---------|
| 1 | [🎯 Problem Statement](#-problem-statement) |
| 2 | [✨ Features](#-features) |
| 3 | [🏗️ Architecture](#-architecture) |
| 4 | [📁 Project Structure](#-project-structure) |
| 5 | [🔐 Role-Based Access Control](#-role-based-access-control) |
| 6 | [📊 Analytics Engine](#-analytics-engine) |
| 7 | [🗄️ Data Model](#-data-model) |
| 8 | [🚀 Quick Start](#-quick-start) |
| 9 | [🌐 API Reference](#-api-reference) |
| 10 | [👤 Demo Credentials](#-demo-credentials) |
| 11 | [🧪 Running Tests](#-running-tests) |
| 12 | [☁️ Deployment](#-deployment) |
| 13 | [🔧 Design Decisions](#-design-decisions) |

---

## 🎯 Problem Statement

<details open>
<summary><b>🔐 Challenge 1 — Secure Multi-Role Data Access</b></summary>
<br/>

> Finance systems contain sensitive data that different users must access at different privilege levels. A viewer should never modify records. An analyst should not manage users. Without enforced access control at the API level, a single compromised endpoint exposes the entire system.

**→ Solved with a [hierarchical RBAC middleware](#-role-based-access-control) that enforces role boundaries on every route — not just at the UI level.**

<br/>
</details>

<details>
<summary><b>💰 Challenge 2 — Financial Record Integrity</b></summary>
<br/>

> Permanently deleting financial records violates basic accounting principles and destroys audit history. Yet most CRUD implementations hard-delete records, making recovery impossible.

**→ Solved with [soft delete + restore](#-features) — records are archived with `isDeleted` flag and `deletedAt` timestamp. Admins can restore any deleted record. The full history is preserved.**

<br/>
</details>

<details>
<summary><b>📊 Challenge 3 — Meaningful Financial Intelligence</b></summary>
<br/>

> Raw transaction data is not useful on its own. Finance teams need aggregated summaries, trend analysis, and anomaly detection to make decisions — but building analytics on top of CRUD APIs is rarely done well.

**→ Solved with a dedicated [Analytics Engine](#-analytics-engine) featuring monthly trends, category breakdowns, weekly cash flow, and statistical z-score anomaly detection.**

<br/>
</details>

<details>
<summary><b>🔍 Challenge 4 — Accountability and Auditability</b></summary>
<br/>

> In financial systems, knowing *who* changed *what* and *when* is not optional — it's a compliance requirement. Most backends have no mutation logging, making it impossible to trace errors or unauthorized changes.

**→ Solved with an [immutable audit trail](#-features) — every create, update, delete, restore, login, and logout is automatically logged with user ID, timestamp, IP address, and before/after data snapshots.**

<br/>
</details>

<details>
<summary><b>🔑 Challenge 5 — Token Security</b></summary>
<br/>

> Long-lived JWTs are a security liability — a stolen token remains valid until expiry. Most implementations never rotate tokens, leaving sessions permanently exposed after a breach.

**→ Solved with [refresh token rotation](#-features) — access tokens expire in 15 minutes. Each refresh token use immediately revokes the old token and issues a new pair. Replay attacks are blocked.**

<br/>
</details>

---

## ✨ Features

<div align="center">

| Module | What It Does | Highlight |
|--------|-------------|-----------|
| 🔐 **Auth** | JWT + Refresh Token Rotation | Tokens expire in 15min, rotation on every refresh |
| 👥 **RBAC** | Role hierarchy enforcement | `ADMIN > ANALYST > VIEWER` via middleware |
| 💰 **Transactions** | Full CRUD with soft delete | 8 filter options, CSV export, restore |
| 📊 **Dashboard** | Aggregated analytics | Monthly trends, categories, weekly flow |
| ⚡ **Anomalies** | Statistical outlier detection | Z-score analysis per category |
| 📝 **Audit Trail** | Tamper-evident change history | Every mutation logged automatically |
| 📚 **Swagger Docs** | Interactive API documentation | Try every endpoint in browser |
| 🆔 **Request Tracing** | UUID per request | `X-Request-ID` header on every response |
| 🚦 **Rate Limiting** | Per-endpoint throttling | Stricter limits on auth routes |
| 📤 **CSV Export** | Download transactions | Role-scoped data export |

</div>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│              dashboard.html  ·  Postman  ·  Swagger UI          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│                      MIDDLEWARE CHAIN                           │
│   RequestID → Helmet → CORS → RateLimit → Auth → RBAC → Zod    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼──────┐  ┌───────▼──────┐
│  Auth Module │  │  Tx Module    │  │ Dashboard    │
│  /auth/*     │  │  /transactions│  │ /dashboard/* │
└───────┬──────┘  └────────┬──────┘  └───────┬──────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
              ┌────────────▼────────────┐
              │      SERVICE LAYER      │
              │  Business Logic + Rules │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │      PRISMA ORM         │
              │  Type-safe DB queries   │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │    SQLite Database      │
              │  Users · Transactions   │
              │  AuditLogs · Tokens     │
              └─────────────────────────┘
```

**Request flow:** Every request passes through the full middleware chain. Auth middleware verifies the JWT and checks the user is still active in the database. RBAC middleware compares role hierarchy levels. Controllers only handle HTTP — all business logic lives in services.

---

## 📁 Project Structure

```
fintrack-rbac-api/
│
├── 📄 src/
│   ├── 📄 app.ts                        # Express app — middleware, routes, Swagger
│   │
│   ├── 📂 config/
│   │   ├── 📄 env.ts                    # Zod-validated environment variables
│   │   └── 📄 swagger.ts               # OpenAPI 3.0 specification
│   │
│   ├── 📂 lib/
│   │   └── 📄 prisma.ts                # Prisma singleton client
│   │
│   ├── 📂 middlewares/
│   │   ├── 📄 auth.ts                  # JWT verification + live user check
│   │   ├── 📄 rbac.ts                  # Role hierarchy guard factory
│   │   ├── 📄 validate.ts              # Zod request validation
│   │   ├── 📄 errorHandler.ts          # Global error normalizer
│   │   ├── 📄 requestId.ts             # UUID per-request tracing
│   │   └── 📄 rateLimiter.ts           # Per-endpoint rate limits
│   │
│   ├── 📂 modules/
│   │   ├── 📂 auth/                    # Login · Refresh · Logout · Change Password
│   │   ├── 📂 users/                   # User CRUD (Admin only)
│   │   ├── 📂 transactions/            # Financial records + soft delete + CSV
│   │   ├── 📂 dashboard/               # Analytics, trends, anomaly detection
│   │   └── 📂 audit/                   # Immutable change history
│   │
│   ├── 📂 types/
│   │   └── 📄 express.d.ts             # Express type augmentation
│   │
│   └── 📂 utils/
│       ├── 📄 ApiResponse.ts           # Consistent success response builder
│       ├── 📄 ApiError.ts              # Custom error class hierarchy
│       ├── 📄 asyncHandler.ts          # Async try/catch eliminator
│       └── 📄 pagination.ts            # Page/limit extractor
│
├── 📂 prisma/
│   ├── 📄 schema.prisma                # Database schema
│   └── 📄 seed.ts                      # Demo data (4 users, 134 transactions)
│
├── 📂 tests/
│   ├── 📄 auth.test.ts                 # Auth flow integration tests
│   ├── 📄 transactions.test.ts         # RBAC + CRUD integration tests
│   ├── 📄 dashboard.test.ts            # Analytics endpoint tests
│   └── 📄 setup.ts                     # Isolated test database
│
├── 📄 dashboard.html                   # Single-file frontend dashboard
├── 📄 FinTrack.postman_collection.json # 25+ pre-configured API requests
├── 📄 vercel.json                      # Vercel static deployment config
├── 📄 .env.example                     # Environment variable template
└── 📄 package.json
```

---

## 🔐 Role-Based Access Control

Roles follow a **numeric hierarchy** — higher roles inherit all lower permissions:

```
ADMIN (3)  >  ANALYST (2)  >  VIEWER (1)
```

The `requireRole()` middleware factory compares levels — `requireRole("ANALYST")` automatically permits ADMINs without listing every allowed role.

| Endpoint | VIEWER | ANALYST | ADMIN |
|----------|--------|---------|-------|
| GET /transactions | ✅ own only | ✅ own only | ✅ all |
| POST /transactions | ❌ | ✅ | ✅ |
| PATCH /transactions/:id | ❌ | ✅ own only | ✅ all |
| DELETE /transactions/:id | ❌ | ✅ own only | ✅ all |
| POST /transactions/:id/restore | ❌ | ❌ | ✅ |
| GET /dashboard/* | ✅ | ✅ | ✅ |
| GET /users | ❌ | ❌ | ✅ |
| POST /users | ❌ | ❌ | ✅ |
| GET /audit | ❌ | ❌ | ✅ |
| GET /audit/:entity/:id | ❌ | ✅ | ✅ |

---

## 📊 Analytics Engine

The `/dashboard` module provides six analytical endpoints:

| Endpoint | What It Returns |
|----------|----------------|
| `GET /dashboard/summary` | Income, expenses, net balance, savings rate, averages |
| `GET /dashboard/categories` | Category breakdown with % share for income and expenses |
| `GET /dashboard/trends/monthly` | Month-by-month income vs expense for last N months |
| `GET /dashboard/trends/weekly` | Week-by-week cash flow for the current month |
| `GET /dashboard/recent` | Latest N transactions |
| `GET /dashboard/anomalies` | **Statistical z-score outlier detection** |

### Anomaly Detection Algorithm

```
For each transaction T in category C:
  1. Compute mean(C) and stdDev(C)
  2. zScore = |T.amount - mean(C)| / stdDev(C)
  3. If zScore > 2.0 → flag as anomaly
  4. Return top 10 sorted by zScore descending
```

Transactions deviating more than **2 standard deviations** from their category average are flagged with z-score, mean, std deviation, and deviation direction (`unusually_high` / `unusually_low`).

---

## 🗄️ Data Model

```
Users                    Transactions
─────────────────        ──────────────────────────
id          UUID    ←──  createdById    UUID
email       STRING        id            UUID
name        STRING        amount        FLOAT
password    STRING        type          INCOME|EXPENSE
role        STRING        category      STRING
status      ACTIVE|       date          DATETIME
            INACTIVE      description   STRING?
createdAt   DATETIME      notes         STRING?
                          tags          JSON[]
                          isDeleted     BOOLEAN
                          deletedAt     DATETIME?

AuditLogs                RefreshTokens
─────────────────        ──────────────────────────
id          UUID          id            UUID
action      STRING        token         STRING (unique)
entity      STRING        userId        UUID  →  Users
entityId    UUID          expiresAt     DATETIME
performedBy UUID  →Users  isRevoked     BOOLEAN
oldData     JSON?
newData     JSON?
ipAddress   STRING?
createdAt   DATETIME
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/debasmita30/fintrack-rbac-api.git
cd fintrack-rbac-api

# 2. Install
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Create database + seed demo data
npm run db:push && npm run db:seed

# 5. Start dev server
npm run dev
```

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | API root |
| `http://localhost:3000/api/v1` | All API endpoints |
| `http://localhost:3000/api-docs` | Swagger interactive docs |
| `http://localhost:3000/health` | Health check |

Open `dashboard.html` in your browser to use the frontend.

---

## 🌐 API Reference

All routes are prefixed `/api/v1`. Full interactive docs available at `/api-docs`.

<details>
<summary><b>🔐 Auth Endpoints</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | Public | Get access + refresh tokens |
| POST | `/auth/refresh` | Public | Rotate token pair |
| POST | `/auth/logout` | Any | Revoke session |
| GET | `/auth/me` | Any | Get own profile |
| PUT | `/auth/change-password` | Any | Change password |

</details>

<details>
<summary><b>💰 Transaction Endpoints</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/transactions` | Any | List with 8 filters + pagination |
| POST | `/transactions` | Analyst+ | Create transaction |
| GET | `/transactions/export/csv` | Any | Download as CSV |
| GET | `/transactions/:id` | Any | Get single record |
| PATCH | `/transactions/:id` | Analyst+ | Update record |
| DELETE | `/transactions/:id` | Analyst+ | Soft delete |
| POST | `/transactions/:id/restore` | Admin | Restore deleted |

**Query filters:** `type`, `category`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `search`, `sortBy`, `sortOrder`, `includeDeleted`

</details>

<details>
<summary><b>📊 Dashboard Endpoints</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/summary` | Any | Financial totals + savings rate |
| GET | `/dashboard/categories` | Any | Category breakdown |
| GET | `/dashboard/trends/monthly` | Any | Monthly income vs expense |
| GET | `/dashboard/trends/weekly` | Any | Weekly cash flow |
| GET | `/dashboard/recent` | Any | Recent activity |
| GET | `/dashboard/anomalies` | Any | Z-score outlier detection |

</details>

<details>
<summary><b>👥 User Endpoints (Admin only)</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users with filters |
| POST | `/users` | Create user |
| GET | `/users/:id` | Get user + transaction count |
| PATCH | `/users/:id` | Update role / status |
| DELETE | `/users/:id` | Soft deactivate |

</details>

<details>
<summary><b>📝 Audit Endpoints</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/audit` | Admin | All logs with filters |
| GET | `/audit/:entity/:id` | Analyst+ | Record change history |

</details>

---

## 👤 Demo Credentials

> All accounts use password: **`Password@123`**

| Email | Role | Access |
|-------|------|--------|
| `admin@fintrack.io` | ADMIN | Full access — users, all transactions, audit log |
| `analyst@fintrack.io` | ANALYST | Read + write own transactions, dashboard |
| `viewer@fintrack.io` | VIEWER | Read-only — dashboard and own transactions |

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# With coverage report
npm run test:coverage
```

Tests use an isolated `test.db` SQLite database that is created and torn down automatically. No manual setup required.

**Test coverage includes:**
- Auth flow — login, token rotation, replay attack prevention, logout
- RBAC enforcement — viewer blocked from create, analyst blocked from admin routes
- Soft delete + restore lifecycle
- Dashboard analytics with seeded data
- Input validation — negative amounts, future dates, invalid types

---

## ☁️ Deployment

| Layer | Platform | URL |
|-------|----------|-----|
| **Backend** | Render (free) | `https://fintrack-rbac-api.onrender.com` |
| **Frontend** | Vercel (free) | `https://fintrack-rbac-api.vercel.app` |
| **API Docs** | Render | `https://fintrack-rbac-api.onrender.com/api-docs` |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `file:./prod.db` for SQLite |
| `JWT_ACCESS_SECRET` | Long random string — **change in production** |
| `JWT_REFRESH_SECRET` | Different long random string |
| `JWT_ACCESS_EXPIRES_IN` | `15m` recommended |
| `JWT_REFRESH_EXPIRES_IN` | `7d` recommended |
| `NODE_ENV` | `production` on Render |
| `FRONTEND_URL` | Your Vercel URL for CORS |

---

## 🔧 Design Decisions

**Why SQLite?** Zero infrastructure — reviewers clone and run with a single command. Prisma makes switching to PostgreSQL a one-line change in `schema.prisma`.

**Why soft delete?** Financial records should never be permanently destroyed. The `isDeleted` flag preserves full history. Admins can restore accidentally deleted records. The audit trail captures every delete and restore event.

**Why refresh token rotation?** Each refresh token use immediately revokes the old token. If a token is stolen and replayed, the system detects reuse and rejects it. Access tokens expire in 15 minutes to limit exposure window.

**Why a separate audit service?** `AuditService.log()` is called from every service method that mutates data. Critically — failures in audit logging are caught and logged to stderr but never bubble up to the caller. A failed audit write must never break the main operation.

**Why Zod for env validation?** The app fails fast at startup with a clear error message if any required environment variable is missing or malformed — before any routes are registered.

---

<div align="center">

<br/>

**Built by [Debasmita](https://github.com/debasmita30) for the Zorvyn FinTech Backend Intern Assessment**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2d1b69,50:1a1033,100:0a0a0f&height=120&section=footer" width="100%"/>

</div>
