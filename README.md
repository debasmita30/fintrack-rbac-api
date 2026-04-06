<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=FinTrack%20API&fontSize=80&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=Finance%20Data%20Processing%20%7C%20Role-Based%20Access%20Control%20%7C%20Anomaly%20Detection&descAlignY=60&descSize=16" width="100%"/>

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&pause=1000&color=7C6DFA&center=true&vCenter=true&width=600&lines=Finance+RBAC+Backend;JWT+Auth+%2B+Refresh+Tokens;Anomaly+Detection+Engine;Role-Based+Access+Control;Built+with+TypeScript+%2B+Prisma" alt="Typing SVG" />

<br/><br/>

<a href="https://fintrack-rbac-api.onrender.com" target="_blank">
  <img src="https://img.shields.io/badge/🚀%20LIVE%20API-Click%20Here-7C6DFA?style=for-the-badge&logoColor=white" alt="Live API"/>
</a>
&nbsp;
<a href="https://fintrack-rbac-api.onrender.com/api-docs" target="_blank">
  <img src="https://img.shields.io/badge/📚%20Swagger%20Docs-Interactive-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger Docs"/>
</a>
&nbsp;
<a href="https://creative-crumble-894489.netlify.app" target="_blank">
  <img src="https://img.shields.io/badge/🖥️%20Live%20Dashboard-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Dashboard"/>
</a>

<br/><br/>

<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
&nbsp;
<img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white"/>
&nbsp;
<img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
&nbsp;
<img src="https://img.shields.io/badge/SQLite-Production-003B57?style=for-the-badge&logo=sqlite&logoColor=white"/>
&nbsp;
<img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>

<br/><br/>

<img src="https://img.shields.io/badge/Status-Live%20%26%20Running-22D07A?style=for-the-badge"/>
&nbsp;
<img src="https://img.shields.io/badge/Tests-Jest%20%2B%20Supertest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
&nbsp;
<img src="https://img.shields.io/badge/Roles-Admin%20%7C%20Analyst%20%7C%20Viewer-7C6DFA?style=for-the-badge"/>
&nbsp;
<img src="https://img.shields.io/badge/Anomaly-Z--Score%20Detection-F59E0B?style=for-the-badge"/>

<br/><br/>

> ⚠️ **Heads up — Render Free Tier Cold Start**
> The API is hosted on Render's free tier which **spins down after 15 minutes of inactivity**.
> If the dashboard shows a connection error, **[click here to wake the API](https://fintrack-rbac-api.onrender.com/health)**, wait ~30 seconds for it to boot, then refresh the dashboard.

<br/>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

<br/>

## 📌 Quick Links

<div align="center">

| 🚀 [Live API](https://fintrack-rbac-api.onrender.com) | 📚 [Swagger Docs](https://fintrack-rbac-api.onrender.com/api-docs) | 🖥️ [Dashboard](https://creative-crumble-894489.netlify.app) |
|:---:|:---:|:---:|
| ❓ [Problem Statement](#-problem-statement) | 💡 [Solution](#-solution) | 🏗️ [Architecture](#-system-architecture) |
| ✨ [Features](#-features) | 🛠️ [Tech Stack](#%EF%B8%8F-tech-stack) | ⚡ [Quick Start](#-quick-start) |
| 🔐 [API Reference](#-api-reference) | 📁 [File Structure](#-file-structure) | 🧪 [Testing](#-testing) |

</div>

<br/>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<br/>

## ❓ Problem Statement

<div align="center">

```
Financial platforms handle sensitive multi-user data yet most backends
lack proper access control, audit trails, and behavioral anomaly detection.
```

</div>

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1a1a2e', 'primaryTextColor': '#E0E0F0', 'primaryBorderColor': '#7C6DFA', 'lineColor': '#7C6DFA', 'secondaryColor': '#16213e', 'tertiaryColor': '#0f0f1a', 'background': '#0f0f1a', 'mainBkg': '#1a1a2e', 'nodeBorder': '#7C6DFA', 'clusterBkg': '#16213e', 'titleColor': '#E0E0F0', 'edgeLabelBackground': '#1a1a2e', 'fontFamily': 'monospace'}}}%%
flowchart LR
    subgraph PAIN ["🚨 The Pain Points"]
        direction TB
        A["🔓 No Access Control\nAll users see all data\nNo role segregation"]
        B["🪪 Weak Auth\nNo token rotation\nSessions never expire"]
        C["👻 No Audit Trail\nWho changed what?\nNo accountability"]
        D["📊 No Anomaly Detection\nFraudulent transactions\ngo unnoticed"]
        E["🗑️ Hard Deletes\nData lost forever\nNo recovery possible"]
    end

    subgraph IMPACT ["📉 Business Impact"]
        direction TB
        F["Data Breaches\nUnauthorized access"]
        G["Compliance Failure\nNo audit evidence"]
        H["Financial Fraud\nUndetected outliers"]
        I["Data Loss\nIrrecoverable records"]
    end

    PAIN --> IMPACT

    style A fill:#2d1a1a,stroke:#F05252,color:#FB7185
    style B fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style C fill:#1a2d1a,stroke:#22D07A,color:#4ADE80
    style D fill:#1a1a2d,stroke:#7C6DFA,color:#A89BFC
    style E fill:#2d1a2d,stroke:#F05252,color:#FB7185
    style F fill:#1a1a2e,stroke:#F05252,color:#F05252
    style G fill:#1a1a2e,stroke:#F59E0B,color:#F59E0B
    style H fill:#1a1a2e,stroke:#7C6DFA,color:#7C6DFA
    style I fill:#1a1a2e,stroke:#F05252,color:#F05252
    style PAIN fill:#0f0f1a,stroke:#F05252,stroke-width:2px,color:#E0E0F0
    style IMPACT fill:#0f0f1a,stroke:#7C6DFA,stroke-width:2px,color:#E0E0F0
```

| # | Problem | Impact |
|---|---------|--------|
| 🔓 | **No role segregation** — every user can read, write, and delete everything | Data leaks, unauthorized mutations |
| 🪪 | **Stateless token abuse** — access tokens never rotate or expire properly | Session hijacking, replay attacks |
| 👻 | **Zero audit trail** — no record of who performed which action and when | Compliance failure, no forensic trail |
| 📊 | **No anomaly detection** — unusual transactions blend in with normal ones | Financial fraud goes undetected |
| 🗑️ | **Destructive deletes** — records permanently lost with no recovery path | Data loss, no rollback capability |
| 🚦 | **No rate limiting** — APIs exposed to brute-force and DDoS attacks | Auth bypass, server overload |

<br/>

## 💡 Solution

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1a1a2e', 'primaryTextColor': '#E0E0F0', 'primaryBorderColor': '#7C6DFA', 'lineColor': '#22D07A', 'secondaryColor': '#16213e', 'tertiaryColor': '#0f0f1a', 'background': '#0f0f1a', 'mainBkg': '#1a1a2e', 'clusterBkg': '#16213e', 'titleColor': '#E0E0F0', 'edgeLabelBackground': '#1a1a2e', 'fontFamily': 'monospace'}}}%%
flowchart TD
    TITLE(["🏦 FinTrack RBAC API\nComplete Finance Backend Solution"])

    subgraph SOLUTION ["✅ What FinTrack API Solves"]
        direction LR
        S1["🔐 JWT Auth\nAccess + Refresh tokens\nAutomatic rotation"]
        S2["👥 RBAC\nAdmin · Analyst · Viewer\nEndpoint-level guards"]
        S3["📋 Audit Logs\nEvery action recorded\nWho · What · When"]
        S4["🔍 Anomaly Detection\nZ-Score based\nPer-category outliers"]
        S5["♻️ Soft Deletes\nRecords restorable\nAdmin-only restore"]
        S6["🚦 Rate Limiting\nPer-IP throttling\nIPv6 safe guards"]
    end

    TITLE --> SOLUTION

    style TITLE fill:#7C6DFA,stroke:#22D07A,stroke-width:3px,color:#fff,font-size:16px
    style S1 fill:#1a1a2d,stroke:#7C6DFA,color:#A89BFC
    style S2 fill:#1a2d1a,stroke:#22D07A,color:#4ADE80
    style S3 fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style S4 fill:#2d1a1a,stroke:#F05252,color:#FB7185
    style S5 fill:#1a2d22,stroke:#22D07A,color:#4ADE80
    style S6 fill:#2d1a2d,stroke:#F05252,color:#FB7185
    style SOLUTION fill:#0f0f1a,stroke:#22D07A,stroke-width:2px,color:#E0E0F0
```

FinTrack API is a **production-grade REST backend** built with TypeScript, Express 5, Prisma ORM, and SQLite. It implements enterprise-level RBAC with JWT authentication, full audit logging, z-score anomaly detection, soft deletes with restore, and comprehensive Swagger documentation — all tested with Jest + Supertest.

<br/>

## 🏗️ System Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1a1a2e', 'primaryTextColor': '#E0E0F0', 'primaryBorderColor': '#7C6DFA', 'lineColor': '#7C6DFA', 'secondaryColor': '#16213e', 'tertiaryColor': '#0f0f1a', 'background': '#0f0f1a', 'mainBkg': '#1a1a2e', 'clusterBkg': '#111128', 'titleColor': '#E0E0F0', 'edgeLabelBackground': '#1a1a2e', 'fontFamily': 'monospace'}}}%%
flowchart TD
    subgraph CLIENT ["🖥️ Layer 1 — Clients"]
        direction LR
        DB["🌐 Web Dashboard\nNetlify Frontend"]
        SW["📚 Swagger UI\n/api-docs"]
        PM["📮 Postman\nCollection"]
    end

    subgraph MIDDLEWARE ["🛡️ Layer 2 — Middleware Pipeline"]
        direction LR
        RL["🚦 Rate Limiter\nexpress-rate-limit\nIPv6-safe keyGen"]
        HM["🪖 Helmet\nSecurity headers\nCSP in production"]
        AU["🔐 Auth Middleware\nJWT verify\nBearer token extract"]
        RB["👮 RBAC Guard\nRole check\nADMIN·ANALYST·VIEWER"]
        VL["✅ Zod Validator\nBody · Query · Params\nType coercion"]
    end

    subgraph MODULES ["⚙️ Layer 3 — Feature Modules"]
        direction LR
        AM["🔑 Auth Module\nlogin · logout\nrefresh · /me"]
        UM["👥 Users Module\nCRUD · status\nAdmin only"]
        TM["💰 Transactions Module\nCRUD · soft delete\nrestore · paginate"]
        DM["📊 Dashboard Module\nsummary · trends\ncategories · anomalies"]
        ALM["📋 Audit Module\nfull history\nfilter · paginate"]
    end

    subgraph DATA ["🗄️ Layer 4 — Data Layer"]
        direction LR
        PR["🔷 Prisma ORM\nType-safe queries\nMigrations"]
        SQ["🗃️ SQLite DB\nprod.db\nfile-based"]
        AT["🔁 Audit Service\nauto-log all\nmutations"]
    end

    CLIENT --> MIDDLEWARE
    RL --> HM --> AU --> RB --> VL
    MIDDLEWARE --> MODULES
    AM & UM & TM & DM & ALM --> DATA
    PR --> SQ
    PR --> AT

    style DB fill:#1a1a2e,stroke:#7C6DFA,color:#A89BFC
    style SW fill:#1a2d1a,stroke:#85EA2D,color:#85EA2D
    style PM fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style RL fill:#2d1a2d,stroke:#F05252,color:#FB7185
    style HM fill:#1a1a2e,stroke:#7C6DFA,color:#A89BFC
    style AU fill:#1a1a2d,stroke:#7C6DFA,color:#A89BFC
    style RB fill:#2d1a1a,stroke:#F05252,color:#FB7185
    style VL fill:#1a2d1a,stroke:#22D07A,color:#4ADE80
    style AM fill:#1a1a2d,stroke:#7C6DFA,color:#A89BFC
    style UM fill:#1a2d1a,stroke:#22D07A,color:#4ADE80
    style TM fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style DM fill:#2d1f1a,stroke:#F59E0B,color:#FCD34D
    style ALM fill:#2d1a2d,stroke:#F05252,color:#FB7185
    style PR fill:#1a1a2e,stroke:#7C6DFA,color:#A89BFC
    style SQ fill:#1a1a2e,stroke:#38BDF8,color:#7DD3FC
    style AT fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style CLIENT fill:#0a0a18,stroke:#7C6DFA,stroke-width:2px,color:#E0E0F0
    style MIDDLEWARE fill:#0a0a18,stroke:#F05252,stroke-width:2px,color:#E0E0F0
    style MODULES fill:#0a0a18,stroke:#F59E0B,stroke-width:2px,color:#E0E0F0
    style DATA fill:#0a0a18,stroke:#22D07A,stroke-width:2px,color:#E0E0F0
```

<br/>

### 🔄 Request Lifecycle

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1a1a2e', 'primaryTextColor': '#E0E0F0', 'primaryBorderColor': '#7C6DFA', 'lineColor': '#22D07A', 'background': '#0f0f1a', 'mainBkg': '#1a1a2e', 'clusterBkg': '#111128', 'titleColor': '#E0E0F0', 'edgeLabelBackground': '#1a1a2e', 'fontFamily': 'monospace'}}}%%
sequenceDiagram
    participant C as 🌐 Client
    participant RL as 🚦 Rate Limiter
    participant AU as 🔐 Auth Middleware
    participant RB as 👮 RBAC Guard
    participant VL as ✅ Zod Validator
    participant CT as ⚙️ Controller
    participant DB as 🗄️ Prisma / DB
    participant AL as 📋 Audit Service

    C->>RL: HTTP Request
    RL-->>C: 429 if limit exceeded
    RL->>AU: Pass through
    AU-->>C: 401 if token invalid
    AU->>RB: Attach req.user
    RB-->>C: 403 if role insufficient
    RB->>VL: Role approved
    VL-->>C: 422 if schema fails
    VL->>CT: Parsed + coerced data
    CT->>DB: Prisma query
    DB-->>CT: Result
    CT->>AL: Log action async
    CT-->>C: 200 JSON response
```

<br/>

### 🔐 RBAC Permission Matrix

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1a1a2e', 'primaryTextColor': '#E0E0F0', 'primaryBorderColor': '#7C6DFA', 'lineColor': '#7C6DFA', 'background': '#0f0f1a', 'mainBkg': '#1a1a2e', 'clusterBkg': '#111128', 'titleColor': '#E0E0F0', 'fontFamily': 'monospace'}}}%%
flowchart LR
    subgraph ADMIN ["👑 ADMIN"]
        A1["✅ View all transactions"]
        A2["✅ Create transactions"]
        A3["✅ Delete transactions"]
        A4["✅ Restore deleted"]
        A5["✅ View all users"]
        A6["✅ Create users"]
        A7["✅ View audit logs"]
        A8["✅ All dashboard data"]
    end

    subgraph ANALYST ["🔬 ANALYST"]
        B1["✅ View all transactions"]
        B2["✅ Create transactions"]
        B3["✅ Delete transactions"]
        B4["❌ Cannot restore"]
        B5["❌ Cannot view users"]
        B6["❌ Cannot view audit"]
        B7["✅ All dashboard data"]
    end

    subgraph VIEWER ["👁️ VIEWER"]
        C1["✅ View transactions"]
        C2["❌ Cannot create"]
        C3["❌ Cannot delete"]
        C4["❌ Cannot restore"]
        C5["❌ Cannot view users"]
        C6["❌ Cannot view audit"]
        C7["✅ Dashboard read-only"]
    end

    style ADMIN fill:#1a1a2d,stroke:#7C6DFA,stroke-width:2px,color:#E0E0F0
    style ANALYST fill:#1a2d22,stroke:#22D07A,stroke-width:2px,color:#E0E0F0
    style VIEWER fill:#2d2a1a,stroke:#F59E0B,stroke-width:2px,color:#E0E0F0
```

<br/>

### 🔍 Anomaly Detection Logic

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1a1a2e', 'primaryTextColor': '#E0E0F0', 'primaryBorderColor': '#F05252', 'lineColor': '#F05252', 'background': '#0f0f1a', 'mainBkg': '#1a1a2e', 'clusterBkg': '#111128', 'titleColor': '#E0E0F0', 'fontFamily': 'monospace'}}}%%
flowchart TD
    TXN(["💳 Transaction\nEnters Pipeline"])

    TXN --> GRP["Group by\ncategory + type"]
    GRP --> CNT{Transactions\nin group?}
    CNT -->|"< 3"| SKIP["⏭️ Skip\nInsufficient data"]
    CNT -->|"≥ 3"| STAT["📐 Compute Statistics\nMean · Std Dev"]
    STAT --> Z["🧮 Z-Score\nz = (amount − mean) / stdDev"]
    Z --> CHK{"|z| > 2.0?"}
    CHK -->|No| CLEAN["✅ Normal Transaction"]
    CHK -->|Yes| FLAG["🚨 Anomaly Flagged"]
    FLAG --> DIR{z > 0?}
    DIR -->|Yes| HIGH["🔴 Unusually High\nz-score · mean · stdDev"]
    DIR -->|No| LOW["🟡 Unusually Low\nz-score · mean · stdDev"]

    style TXN fill:#7C6DFA,stroke:#22D07A,color:#fff,stroke-width:2px
    style GRP fill:#1a1a2e,stroke:#A89BFC,color:#C4C0FF
    style CNT fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style SKIP fill:#1a1a2e,stroke:#64748B,color:#94A3B8
    style STAT fill:#1a1a2e,stroke:#7C6DFA,color:#A89BFC
    style Z fill:#1a1a2e,stroke:#7C6DFA,color:#A89BFC
    style CHK fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style CLEAN fill:#1a2d1a,stroke:#22D07A,color:#4ADE80
    style FLAG fill:#2d1a1a,stroke:#F05252,color:#FB7185
    style DIR fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style HIGH fill:#2d1a1a,stroke:#F05252,color:#F05252
    style LOW fill:#2d2a1a,stroke:#F59E0B,color:#F59E0B
```

<br/>

### 🔑 JWT Token Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1a1a2e', 'primaryTextColor': '#E0E0F0', 'primaryBorderColor': '#7C6DFA', 'lineColor': '#7C6DFA', 'background': '#0f0f1a', 'mainBkg': '#1a1a2e', 'clusterBkg': '#111128', 'titleColor': '#E0E0F0', 'fontFamily': 'monospace'}}}%%
flowchart TD
    LOGIN(["POST /auth/login\nemail + password"])
    LOGIN --> VERIFY["✅ bcrypt verify\npassword hash"]
    VERIFY --> ISSUE["🎟️ Issue Token Pair\nAccess: 15min JWT\nRefresh: 7d DB-stored"]
    ISSUE --> USE["🔐 Use Access Token\nAuthorization: Bearer"]
    USE --> EXPIRE{Token\nexpired?}
    EXPIRE -->|No| API["✅ API Access\nGranted"]
    EXPIRE -->|Yes| REFRESH["POST /auth/refresh\nsend refreshToken"]
    REFRESH --> ROTATE["🔁 Token Rotation\nOld token revoked\nNew pair issued"]
    ROTATE --> USE
    API --> LOGOUT["POST /auth/logout\nrefreshToken revoked\nDB entry deleted"]

    style LOGIN fill:#7C6DFA,stroke:#22D07A,color:#fff,stroke-width:2px
    style VERIFY fill:#1a1a2e,stroke:#7C6DFA,color:#A89BFC
    style ISSUE fill:#1a2d1a,stroke:#22D07A,color:#4ADE80
    style USE fill:#1a1a2e,stroke:#7C6DFA,color:#A89BFC
    style EXPIRE fill:#2d2a1a,stroke:#F59E0B,color:#FCD34D
    style API fill:#1a2d1a,stroke:#22D07A,color:#4ADE80
    style REFRESH fill:#2d1a1a,stroke:#F05252,color:#FB7185
    style ROTATE fill:#1a2d22,stroke:#22D07A,color:#4ADE80
    style LOGOUT fill:#2d1a2d,stroke:#F05252,color:#FB7185
```

<br/>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Authentication & Security
- **JWT access tokens** (15-minute expiry) + **refresh tokens** (7-day, DB-stored)
- **Token rotation** — refresh invalidates old token immediately
- **bcrypt** password hashing with cost factor 12
- **Helmet** security headers + CORS with credential support
- **Per-IP rate limiting** with IPv6-safe key generation
- Inactive user accounts **blocked at login**

### 👥 Role-Based Access Control
- Three roles: **ADMIN · ANALYST · VIEWER**
- Enforced at middleware level — not just UI
- Admin-only: user management, audit logs, restore deleted records
- Analyst: full transaction CRUD
- Viewer: read-only access to own data

### 💰 Transactions
- Full **CRUD** with Zod schema validation
- **Soft delete** — records marked `isDeleted`, never destroyed
- **Admin-only restore** endpoint
- Pagination · sorting · filtering by type, category, search
- Future date rejection · negative amount rejection

</td>
<td width="50%" valign="top">

### 📊 Dashboard Analytics
- **Financial summary** — income, expenses, net balance, savings rate
- **Monthly trends** — 6-month income vs expense vs net chart data
- **Weekly cash flow** — rolling 4-week breakdown
- **Category breakdown** — top expense categories with totals
- **Recent activity** — last N transactions
- **Anomaly detection** — z-score outliers per category

### 📋 Audit Logging
- Every **CREATE · UPDATE · DELETE · RESTORE · LOGIN · LOGOUT** recorded
- Stores: action · entity · entityId · performedBy · IP · timestamp
- Filterable by action type and entity
- Paginated with full user context

### 🧪 Test Coverage
- **Jest + Supertest** integration tests
- Auth flows: login, refresh rotation, logout, invalid tokens
- Transaction RBAC: role-based 201/403 enforcement
- Dashboard: summary totals, date-range filtering, anomaly shape
- In-memory **SQLite test DB** — zero external dependencies

</td>
</tr>
</table>

<br/>

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white) | Type-safe backend |
| **Framework** | ![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white) | HTTP server & routing |
| **ORM** | ![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white) | Type-safe DB queries + migrations |
| **Database** | ![SQLite](https://img.shields.io/badge/SQLite-file--based-003B57?style=flat-square&logo=sqlite&logoColor=white) | Lightweight production DB |
| **Auth** | ![JWT](https://img.shields.io/badge/JWT-jsonwebtoken-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | Access + refresh token auth |
| **Validation** | ![Zod](https://img.shields.io/badge/Zod-3.x-3E67B1?style=flat-square) | Runtime schema validation |
| **Security** | ![Helmet](https://img.shields.io/badge/Helmet-security-FF6B35?style=flat-square) + ![bcrypt](https://img.shields.io/badge/bcryptjs-hashing-4A90D9?style=flat-square) | Headers + password hashing |
| **Rate Limiting** | `express-rate-limit` | IPv6-safe per-IP throttling |
| **API Docs** | ![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?style=flat-square&logo=swagger&logoColor=black) | Interactive API documentation |
| **Testing** | ![Jest](https://img.shields.io/badge/Jest-30.x-C21325?style=flat-square&logo=jest&logoColor=white) + `supertest` | Integration test suite |
| **Logging** | `morgan` | HTTP request logging |
| **Deployment** | ![Render](https://img.shields.io/badge/Render-Live-46E3B7?style=flat-square&logo=render&logoColor=white) | Cloud hosting |

</div>

<br/>

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/debasmita30/fintrack-rbac-api.git
cd fintrack-rbac-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# 4. Push DB schema + seed demo data
npx prisma db push
npm run db:seed

# 5. Start development server
npm run dev
```

Open **http://localhost:10000** — Swagger docs at **http://localhost:10000/api-docs**

<br/>

### 🔧 Environment Variables

```env
# Server
NODE_ENV=development
PORT=10000

# Database
DATABASE_URL="file:./dev.db"

# JWT Secrets — use long random strings in production
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Frontend (for CORS in production)
FRONTEND_URL=https://your-frontend.netlify.app
```

<br/>

## 🔐 API Reference

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@fintrack.io` | `Password@123` |
| 🔬 Analyst | `analyst@fintrack.io` | `Password@123` |
| 👁️ Viewer | `viewer@fintrack.io` | `Password@123` |

<br/>

### Endpoints Overview

```
AUTH
  POST   /api/v1/auth/login          Public       Login → access + refresh tokens
  POST   /api/v1/auth/refresh        Public       Rotate refresh token
  POST   /api/v1/auth/logout         Auth         Revoke refresh token
  GET    /api/v1/auth/me             Auth         Get current user profile

TRANSACTIONS
  GET    /api/v1/transactions        Auth         List with pagination + filters
  POST   /api/v1/transactions        Analyst+     Create new transaction
  GET    /api/v1/transactions/:id    Auth         Get by ID
  PATCH  /api/v1/transactions/:id    Analyst+     Update transaction
  DELETE /api/v1/transactions/:id    Analyst+     Soft delete
  POST   /api/v1/transactions/:id/restore  Admin  Restore soft-deleted

DASHBOARD
  GET    /api/v1/dashboard/summary          Auth  Financial totals + savings rate
  GET    /api/v1/dashboard/trends/monthly   Auth  6-month income/expense/net
  GET    /api/v1/dashboard/trends/weekly    Auth  Rolling 4-week cash flow
  GET    /api/v1/dashboard/categories       Auth  Breakdown by category
  GET    /api/v1/dashboard/recent           Auth  Recent transactions
  GET    /api/v1/dashboard/anomalies        Auth  Z-score outlier detection

USERS                                       (Admin only)
  GET    /api/v1/users               Admin        List all users
  POST   /api/v1/users               Admin        Create user
  GET    /api/v1/users/:id           Admin        Get user by ID
  PATCH  /api/v1/users/:id           Admin        Update user role/status

AUDIT                                       (Admin only)
  GET    /api/v1/audit               Admin        Paginated audit log with filters
```

> 📚 Full interactive documentation with request/response schemas available at **[/api-docs](https://fintrack-rbac-api.onrender.com/api-docs)**

<br/>

## 📁 File Structure

```
fintrack-rbac-api/
│
├── 📄 src/
│   ├── app.ts                          # Express app — middleware + routes
│   │
│   ├── config/
│   │   ├── env.ts                      # Zod-validated environment config
│   │   └── swagger.ts                  # Swagger/OpenAPI spec builder
│   │
│   ├── middlewares/
│   │   ├── auth.ts                     # JWT verification + req.user injection
│   │   ├── rbac.ts                     # Role-based access control guard
│   │   ├── validate.ts                 # Zod schema validator (body/query/params)
│   │   ├── errorHandler.ts             # Global error handler → structured JSON
│   │   ├── rateLimiter.ts              # express-rate-limit (IPv6-safe)
│   │   └── requestId.ts                # UUID request ID injector
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts          # POST login · refresh · logout · GET me
│   │   │   ├── auth.controller.ts      # Request handlers
│   │   │   ├── auth.service.ts         # Business logic + token management
│   │   │   └── auth.schema.ts          # Zod schemas for auth inputs
│   │   │
│   │   ├── users/
│   │   │   ├── user.routes.ts          # Admin CRUD endpoints
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.schema.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── transaction.routes.ts   # CRUD + soft-delete + restore
│   │   │   ├── transaction.controller.ts
│   │   │   ├── transaction.service.ts
│   │   │   └── transaction.schema.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard.routes.ts     # Summary · trends · anomalies
│   │   │   ├── dashboard.controller.ts
│   │   │   └── dashboard.service.ts    # Z-score anomaly detection engine
│   │   │
│   │   └── audit/
│   │       ├── audit.routes.ts         # Paginated audit log
│   │       ├── audit.controller.ts
│   │       └── audit.service.ts        # Async audit writer
│   │
│   └── utils/
│       └── ApiError.ts                 # Structured error class
│
├── 🗃️ prisma/
│   ├── schema.prisma                   # DB models: User · Transaction · AuditLog · RefreshToken
│   └── seed.ts                         # Demo data for all 3 roles
│
├── 🧪 tests/
│   ├── setup.ts                        # In-memory SQLite test DB setup
│   ├── auth.test.ts                    # Login · refresh rotation · logout
│   ├── transactions.test.ts            # RBAC · CRUD · soft-delete · restore
│   └── dashboard.test.ts               # Summary totals · anomaly shape
│
├── 📋 .env.example                     # Environment variable template
├── 📋 package.json
├── 📋 tsconfig.json
└── 📖 README.md
```

<br/>

## 🧪 Testing

```bash
# Run full test suite
npm test

# Run with coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage

| Module | Tests | What's Covered |
|--------|-------|----------------|
| **Auth** | 10 tests | Login success/fail, refresh rotation, token revocation, logout, malformed tokens |
| **Transactions** | 12 tests | Role-based create/delete/restore, validation rejection, pagination, soft-delete visibility |
| **Dashboard** | 8 tests | Summary totals, date-range filtering, category breakdown, anomaly response shape |

> Tests use an isolated **in-memory SQLite database** — no external services needed, zero flakiness.

<br/>

## 🗺️ Roadmap

- [ ] 🐘 PostgreSQL support for production scale
- [ ] 📧 Email alerts on anomaly detection
- [ ] 🔔 Webhook support for transaction events
- [ ] 📊 CSV export for transactions
- [ ] 🔒 Two-factor authentication (TOTP)
- [ ] 🌍 Multi-tenant organization support

<br/>

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/AmazingFeature`
3. Commit your changes — `git commit -m 'Add AmazingFeature'`
4. Push to the branch — `git push origin feature/AmazingFeature`
5. Open a Pull Request

<br/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=100&section=footer" width="100%"/>

<br/>

**Built with ❤️ for production-grade backend engineering**

<br/>

[![Live API](https://img.shields.io/badge/🚀%20Live%20API-fintrack--rbac--api.onrender.com-7C6DFA?style=for-the-badge)](https://fintrack-rbac-api.onrender.com)
&nbsp;
[![Swagger Docs](https://img.shields.io/badge/📚%20Swagger-Interactive%20Docs-85EA2D?style=for-the-badge)](https://fintrack-rbac-api.onrender.com/api-docs)
&nbsp;
[![Dashboard](https://img.shields.io/badge/🖥️%20Dashboard-Live%20Frontend-00C7B7?style=for-the-badge)](https://creative-crumble-894489.netlify.app)

<br/>

*If this project helped you, please give it a ⭐ — it means a lot!*

</div>
