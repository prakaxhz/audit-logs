# Audit Log Dashboard

Full-stack exercise: upload, view, filter, search, sort, and paginate system audit logs.
Built with **React (Vite) + Redux Toolkit/RTK Query** on the frontend and **Node.js + Express (feature-based modules) + MongoDB** on the backend.

## Monorepo layout

```
express/
  backend/     Express API (feature/module-based) + MongoDB
  frontend/    React dashboard (Redux Toolkit + RTK Query)
  scripts/     generate-sample-logs.mjs — creates a random N-record JSON file for testing bulk upload
```

## 1. Backend (`backend/`)

### Structure — feature/module-based

```
src/
  app.js                     Express app: middleware, routes, error handling
  server.js                  Entry point — connects DB, starts HTTP server
  config/
    env.js                   Loads/validates environment variables
    database.js              Mongoose connection
  constants/index.js         Severity/Status enums — single source of truth
  middlewares/               asyncHandler, error handler, 404 handler, validate (cross-cutting, shared by every module)
  utils/                     ApiError, ApiResponse, logger (winston), pagination (shared)
  routes/index.js            Top-level router — mounts each module's routes
  modules/
    audit-log/
      controller/            Thin request/response handler
      service/                Business logic
      repository/             Data-access layer (only place that talks to Mongoose)
      model/                   Mongoose schema
      dto/                     Shapes validated input into persistence-ready objects
      validator/               Zod schemas for request body/query validation
      routes/                  Express router for this module
```

Each resource lives in its own self-contained module — `controller → service → repository → model`,
with `dto`/`validator` alongside. Adding a new resource means adding one new folder under `modules/`
rather than touching `controllers/`, `services/`, `models/`, etc. scattered across the tree. Only truly
cross-cutting concerns (`config`, `constants`, `middlewares`, `utils`) live outside `modules/`. Requests
are validated by **Zod** schemas before they reach a controller.

### Setup

```
cd backend
npm install
cp .env.example .env   # then set MONGO_URI to a reachable MongoDB instance
npm run dev            # nodemon, http://localhost:5000
```

Required env vars (`backend/.env`):

| Var | Description |
|---|---|
| `NODE_ENV` | `development` \| `production` |
| `PORT` | HTTP port (default 5000) |
| `MONGO_URI` | MongoDB connection string — **required**, the app fails fast at boot if missing |

### API

All routes are mounted under `/api`.

**`POST /api/audit-logs/upload`**
Body: JSON array of 1–10,000 log records:
```json
[
  {
    "actor": "priya.nair@company.com",
    "role": "admin",
    "action": "DELETE_USER",
    "resource": "/api/users/334",
    "resourceType": "USER",
    "ipAddress": "192.168.1.45",
    "region": "ap-south-1",
    "severity": "HIGH",
    "status": "Unresolved",
    "timestamp": "2025-06-14T08:32:11Z"
  }
]
```
Response: `{ success, message, data: { insertedCount, failedCount, partial? } }`

**`GET /api/audit-logs`**
Query params (all optional, all validated server-side):
`page`, `limit` (max 100), `search`, `role`, `severity` (`LOW|MEDIUM|HIGH`), `status` (`Resolved|Unresolved`),
`region`, `action`, `sortBy` (whitelisted field), `sortOrder` (`asc|desc`).
Response: `{ success, message, data: { logs, pagination: { page, limit, total, totalPages } } }`

**`GET /api/health`** — liveness check.

### Generating test data

```
node ../scripts/generate-sample-logs.mjs 10000 sample-logs.json
```
Then upload `sample-logs.json` from the dashboard's upload panel.

## 2. Frontend (`frontend/`)

### Structure — Redux Toolkit + RTK Query

```
src/
  app/store.js                       configureStore — wires the RTK Query middleware
  features/auditLogs/
    auditLogsApi.js                  RTK Query endpoints (useGetAuditLogsQuery, useUploadAuditLogsMutation)
    filtersSlice.js                  Redux slice: search/filters/sort/page/limit
  pages/DashboardPage.jsx            Connects Redux state + RTK Query to the view
  components/
    UploadPanel.jsx                  JSON file upload
    FiltersBar.jsx                   Search + filter controls (debounced search)
    LogsTable.jsx                    Sortable table (click a header to sort)
    PaginationBar.jsx                Page controls + page-size selector
```

All filtering, searching, sorting, and pagination happen **server-side** — the frontend only ever sends
the current filter/sort/page state as query params and renders what the API returns.

### Setup

```
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL, defaults to http://localhost:5000/api
npm run dev            # http://localhost:5173
```

## Technical decisions

- **Backend: feature/module folders over layer-based MVC.** Each resource (`modules/audit-log/`) owns
  its full stack — controller, service, repository, model, dto, validator, routes — so adding or removing
  a resource touches one folder instead of nine scattered type-based ones. This scales better as the
  number of resources grows; only genuinely cross-cutting code (`config`, `constants`, `middlewares`,
  `utils`) sits outside `modules/`.
- **Kept repository + DTO + validator layers inside each module**, rather than collapsing to bare
  Model-Controller-Service. The repository isolates all Mongoose calls (so the ORM could be swapped
  without touching business logic), the DTO shapes validated input before persistence, and the validator
  is a pure Zod schema reused by both the route middleware and (implicitly) the data contract.
- **Zod for validation** over Joi/express-validator — schema-first, composable, and used for *both* the
  upload body and the `GET` query string. Validating the query string specifically closes a NoSQL
  operator-injection vector: query params are parsed with bracket notation by Express (`?role[$ne]=null`
  becomes an object), and a Zod `z.string()` check rejects anything that isn't a plain string before it
  ever reaches a Mongo filter.
- **`sortBy` is whitelisted to a fixed set of fields** (not an arbitrary passthrough) so a client can't
  force a sort on an unindexed or nonexistent field.
- **Bulk insert uses `insertMany(..., { ordered: false })`** so one bad document doesn't abort a
  10,000-record batch. The service catches partial-failure errors and reports
  `{ insertedCount, failedCount, partial: true }` instead of surfacing an opaque 500 for a mostly-successful upload.
- **express-rate-limit** on both endpoints (20 req/15 min on upload, 300 req/15 min on read) since neither
  endpoint has authentication in this exercise — rate limiting is the cheapest guard against abuse without
  adding a login flow that's out of scope for the spec.
- **No authentication layer.** The exercise spec doesn't call for a login/user system, and building one
  would add scope not requested (JWT signing, a user store, etc.). If this shipped as a real internal tool,
  the next step would be a static API key or SSO-backed JWT in front of both routes.
- **Winston for logging**, including a dedicated `error.log`, so failures are queryable after the fact
  instead of relying on console output in production.
- **Enums centralized in `constants/index.js`** and imported by both the Mongoose schema and the Zod
  validator, so `severity`/`status` values are defined exactly once instead of duplicated across layers.
- **Frontend: Redux Toolkit + RTK Query** over local component state/hooks. RTK Query gives cache
  invalidation for free — uploading logs invalidates the `AuditLog` tag and the table refetches
  automatically, with no manual "refresh" callback threaded through props. It also tracks
  loading/error state per request without hand-rolled `useEffect` + `AbortController` bookkeeping.
- **Search input is debounced locally (300ms)** before it's dispatched into Redux, so typing doesn't
  trigger a network request per keystroke; every other filter (selects) dispatches immediately since
  they change far less frequently.
- **Plain CSS, no component/utility library.** Keeps the exercise's dependency footprint focused on the
  functionality being graded (upload/filter/search/sort/paginate) rather than visual polish.

## Known limitations / next steps

- No automated tests (unit/integration) — would add Jest + Supertest for the API and React Testing Library
  for the dashboard next.
- No authentication (see rationale above).
- Not yet deployed — see exercise submission requirements for the deployed link.
