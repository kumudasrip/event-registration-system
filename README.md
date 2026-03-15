# Full Stack Event Registration System — Zenith 2026

## 1. Project Overview

Zenith 2026 is a full-stack event registration system built to manage participant registrations for a college-level event. The system provides a public-facing registration portal where attendees can sign up, and a secure admin dashboard where organizers can monitor registrations, apply filters, and view real-time analytics.

**Problem it solves:** Manual event registration through spreadsheets or Google Forms offers no duplicate prevention, no real-time analytics, and no role-based access control. This system replaces that with a purpose-built web application that handles validation, deduplication, JWT-protected admin views, and live charts — all in one place.

**Core functionality:**
- Public registration form with full field validation
- Unique registration ID generation per attendee
- JWT-authenticated admin login
- Searchable, filterable attendee table
- Analytics dashboard with domain split and daily registration graph

---

## 2. Features

### User Features
- Register for the event using a clean, responsive form
- Fields: Full Name, Email, College/University, Year of Study, Domain (Technical / Non-Technical), Interest description
- Client-side validation with real-time error messages
- Duplicate email detection with a clear error response
- Confirmation page displaying a unique Registration ID and submitted details
- Fully mobile-responsive layout

### Admin Features
- Secure login with email and password (JWT-based)
- View all registrations in a paginated, sortable table
- Search registrations by name or email
- Filter by college (partial match) and domain
- Analytics overview: total registrations, Technical vs Non-Technical count, daily registration bar chart, domain split pie chart
- One-click navigation back to the registration portal from the admin panel

### Backend Features
- RESTful API built with Express and TypeScript
- Server-side validation using Zod schemas shared between frontend and backend
- Duplicate email prevention before insert
- Secure password hashing using Node's built-in `scrypt` (no third-party bcrypt dependency)
- JWT token issuance with 24-hour expiry
- Protected routes via Bearer token middleware
- Seed script that auto-creates the admin user on first boot

---

## 3. Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 (Vite) | UI framework and build tooling |
| TypeScript | Static typing across all components |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible component primitives (forms, cards, tables, badges) |
| TanStack Query (React Query v5) | Server state management, caching, and mutations |
| React Hook Form + Zod | Form state and schema-driven validation |
| Recharts | Analytics charts (bar chart, pie chart) |
| Wouter | Lightweight client-side routing |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server and API routing |
| TypeScript | Type-safe server logic |
| Drizzle ORM | Type-safe database queries and schema definition |
| Zod | Runtime validation of request payloads |
| jsonwebtoken | JWT generation and verification |
| Node.js `crypto` (scrypt) | Secure password hashing with salt |

### Database
| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database for persistent storage |
| drizzle-kit | Schema migration tooling (`db:push`) |

### Other Tools
| Tool | Purpose |
|---|---|
| `drizzle-zod` | Auto-generates Zod schemas from Drizzle table definitions |
| `date-fns` | Date formatting in the dashboard |
| `tsx` | TypeScript execution for the Express server in development |

---

## 4. System Architecture

The application follows a classic three-tier architecture: a React SPA for the frontend, an Express REST API for the backend, and PostgreSQL as the database. Both frontend and backend share types through a `shared/` directory, making the API contract type-safe end-to-end.

```
┌─────────────────────────────────┐
│         Browser (React SPA)     │
│  Registration Form / Dashboard  │
│     TanStack Query + Zod        │
└────────────┬────────────────────┘
             │ HTTP (fetch)
             │ Bearer Token (admin routes)
             ▼
┌─────────────────────────────────┐
│      Express REST API           │
│  server/routes.ts               │
│  Zod validation middleware      │
│  JWT auth middleware            │
└────────────┬────────────────────┘
             │ Drizzle ORM
             ▼
┌─────────────────────────────────┐
│         PostgreSQL              │
│  tables: users, registrations   │
└─────────────────────────────────┘

Shared Layer (shared/)
  schema.ts  ──▶  Drizzle table defs + inferred TypeScript types
  routes.ts  ──▶  Zod API contract used by both client and server
```

**Key design choice:** The `shared/` directory acts as the single source of truth for both the database schema and the API contract. This means if a field is added to the database, the TypeScript types and Zod validation schemas update automatically everywhere — no manual synchronisation.

---

## 5. Folder Structure

```
zenith-2026/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminNav.tsx        # Admin header with navigation and logout
│   │   │   ├── RegistrationForm.tsx # Public registration form component
│   │   │   └── ui/                 # shadcn/ui component primitives
│   │   ├── hooks/
│   │   │   ├── use-auth.ts         # JWT token storage, login/logout mutations
│   │   │   └── use-registrations.ts # TanStack Query hooks for registration data
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Public registration page with hero panel
│   │   │   ├── Success.tsx         # Confirmation page after registration
│   │   │   └── admin/
│   │   │       ├── Login.tsx       # Admin authentication page
│   │   │       └── Dashboard.tsx   # Registrations table + analytics
│   │   ├── lib/
│   │   │   ├── queryClient.ts      # TanStack Query client configuration
│   │   │   └── utils.ts            # Tailwind class merge utility
│   │   ├── App.tsx                 # Route declarations (wouter)
│   │   ├── index.css               # Tailwind directives + CSS custom properties
│   │   └── main.tsx                # React DOM entry point
│   └── index.html
│
├── server/                     # Express backend
│   ├── db.ts                   # Drizzle + PostgreSQL pool initialisation
│   ├── storage.ts              # DatabaseStorage class (all DB operations)
│   ├── routes.ts               # Route handlers, auth middleware, seed logic
│   ├── index.ts                # Express app bootstrap
│   └── vite.ts                 # Vite dev middleware integration
│
├── shared/                     # Shared between client and server
│   ├── schema.ts               # Drizzle table definitions + TypeScript types
│   └── routes.ts               # Zod API contract (paths, inputs, responses)
│
├── drizzle.config.ts           # Drizzle kit configuration
├── tailwind.config.ts          # Tailwind theme (colours, fonts, radius)
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript project settings
└── package.json
```

---

## 6. Database Schema

The database has two tables: `users` for admin accounts and `registrations` for event attendees.

### `users` table — Admin accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Auto-incrementing integer |
| `email` | `text` | NOT NULL, UNIQUE | Admin login identifier |
| `password` | `text` | NOT NULL | Scrypt-hashed password with embedded salt |
| `role` | `text` | NOT NULL, DEFAULT `'admin'` | Role field for future RBAC extension |

**Design rationale:** Passwords are stored as `hash.salt` in a single text column using Node's `scrypt` with a 16-byte random salt and a 64-byte derived key. This avoids any third-party dependency while remaining cryptographically secure. The `role` field is included for forward compatibility with multi-level access control.

### `registrations` table — Event attendees

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Internal auto-increment ID |
| `registration_id` | `text` | NOT NULL, UNIQUE | Public-facing ID e.g. `REG-3A4F9C1B` |
| `name` | `text` | NOT NULL | Full name of attendee |
| `email` | `text` | NOT NULL, UNIQUE | Enforces one registration per email |
| `college` | `text` | NOT NULL | College/university name |
| `year` | `text` | NOT NULL | Year of study (1st–4th, Postgrad, Other) |
| `domain` | `text` | NOT NULL | `'Tech'` or `'Non-Tech'` |
| `interest_answer` | `text` | NOT NULL | Short description of interest |
| `created_at` | `timestamp` | NOT NULL, DEFAULT `now()` | Registration timestamp for analytics |

**Design rationale:** The `registration_id` is a human-readable `REG-` prefixed 8-character uppercase hex string generated via `crypto.randomUUID()`. This is used on the confirmation page and is distinct from the internal integer `id`. The `email` column has a UNIQUE constraint at the database level as a final safety net against duplicates — the application layer also checks before inserting. The `created_at` field drives the daily registrations graph in the analytics dashboard.

**Normalisation:** Both tables are in 3NF. Admins and registrations are fully separated. There is no redundant data. The `role` column on `users` avoids the need for a separate roles join table at this scale, while still being extensible.

---

## 7. API Endpoints

All endpoints are prefixed with `/api`. Admin-protected endpoints require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/admin/login` | No | Authenticate admin, returns JWT |
| `POST` | `/api/register` | No | Register a new attendee |
| `GET` | `/api/registrations` | Yes | List all registrations (supports filters) |
| `GET` | `/api/analytics` | Yes | Aggregated analytics data |

---

### `POST /api/admin/login`

**Request body:**
```json
{
  "email": "adminzen@event.com",
  "password": "admin123zen"
}
```

**Success response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error response `401`:**
```json
{ "message": "Invalid credentials" }
```

---

### `POST /api/register`

**Request body:**
```json
{
  "name": "Priya Sharma",
  "email": "priya@college.edu",
  "college": "IIT Madras",
  "year": "3rd Year",
  "domain": "Tech",
  "interestAnswer": "I want to explore AI and ML workshops."
}
```

**Success response `201`:**
```json
{
  "id": 1,
  "registrationId": "REG-A3F19C2E",
  "name": "Priya Sharma",
  "email": "priya@college.edu",
  "college": "IIT Madras",
  "year": "3rd Year",
  "domain": "Tech",
  "interestAnswer": "I want to explore AI and ML workshops.",
  "createdAt": "2026-03-13T09:00:00.000Z"
}
```

**Error — duplicate email `400`:**
```json
{ "message": "Email already registered", "field": "email" }
```

**Error — validation failure `400`:**
```json
{ "message": "Invalid email", "field": "email" }
```

---

### `GET /api/registrations`

**Headers:** `Authorization: Bearer <token>`

**Query parameters (all optional):**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Partial match on name, email, or registration ID |
| `college` | string | Partial case-insensitive match on college name |
| `domain` | `Tech` \| `Non-Tech` | Exact match on domain |

**Example:** `GET /api/registrations?search=priya&domain=Tech`

**Success response `200`:** Array of registration objects (same shape as the `POST /api/register` response).

---

### `GET /api/analytics`

**Headers:** `Authorization: Bearer <token>`

**Success response `200`:**
```json
{
  "totalRegistrations": 42,
  "domainSplit": {
    "tech": 28,
    "nonTech": 14
  },
  "dailyRegistrations": [
    { "date": "2026-03-10", "count": 5 },
    { "date": "2026-03-11", "count": 12 },
    { "date": "2026-03-12", "count": 25 }
  ]
}
```

---

## 8. State Management Approach

State is managed using a layered approach:

| Layer | Tool | Responsibility |
|-------|------|----------------|
| Server state | **TanStack Query v5** | Fetching, caching, and invalidating API data. All queries use typed `queryKey` arrays. Mutations call `queryClient.invalidateQueries` on success to keep the UI in sync. |
| Form state | **React Hook Form** | Controlled inputs with Zod resolver for schema-driven validation. Default values are always set to prevent uncontrolled component warnings. |
| Auth state | **localStorage + custom hook** | The JWT token is persisted in `localStorage`. The `use-auth.ts` hook exposes `getToken()`, `isAuthenticated()`, `login` mutation, and `logout`. This avoids a global auth context while keeping auth logic centralised. |
| UI state | **React `useState`** | Local component state for filter inputs (search, college, domain) on the dashboard. |
| Navigation state | **Wouter** | Client-side routing between `/`, `/success`, `/admin/login`, and `/admin/dashboard`. No server-side redirects are needed. |

---

## 9. Error Handling Strategy

**Client-side (form validation):**
- Zod schemas from `shared/routes.ts` are used directly with `zodResolver` in React Hook Form
- Errors render below each field using shadcn's `<FormMessage />`
- The submit button is disabled during pending mutations

**Server-side (API validation):**
- Every request body is parsed with `schema.parse(req.body)` — a `ZodError` is caught and returns `400` with the failing field name
- Duplicate email is checked at the application layer before insert, returning `400` with `{ field: "email" }`
- The database has a UNIQUE constraint on `email` as a final safety net
- All catch blocks return appropriate HTTP status codes — never silent failures

**HTTP status codes used:**

| Code | Meaning | When used |
|------|---------|-----------|
| `200` | OK | Successful GET or login |
| `201` | Created | Successful registration |
| `400` | Bad Request | Validation failure or duplicate email |
| `401` | Unauthorised | Missing/invalid/expired JWT |
| `500` | Internal Server Error | Unexpected server-side failure |

---

## 10. Authentication

The system uses **stateless JWT authentication** for all admin routes.

**Login flow:**
1. Admin submits email and password to `POST /api/admin/login`
2. Server fetches the user record by email, then verifies the supplied password against the stored scrypt hash using timing-safe comparison (`timingSafeEqual`)
3. On success, a JWT is signed with `{ id, email, role }` payload, `24h` expiry, using the `SESSION_SECRET` environment variable as the signing key
4. The token is returned to the client and stored in `localStorage`

**Protecting routes:**
- The `authenticateToken` Express middleware extracts the `Authorization: Bearer <token>` header
- `jwt.verify()` validates the signature and expiry — on failure it returns `401`
- The decoded user payload is attached to `req.user` for downstream handlers

**Frontend guard:**
- The Dashboard component calls `isAuthenticated()` on mount and redirects to `/admin/login` if no valid token is found
- The `use-auth.ts` hook calls `logout()` automatically when a `401` response is received from any protected endpoint, clearing the token and redirecting

---

## 11. Scalability Considerations

| Concern | Current approach | How it scales |
|---------|-----------------|---------------|
| **Database** | PostgreSQL with Drizzle ORM | PostgreSQL handles millions of rows efficiently. Indexes can be added on `email`, `domain`, and `created_at` as load grows. |
| **API filtering** | `ilike` + `and()` in Drizzle | Query composition keeps filtering at the DB layer — the server never loads all rows into memory before filtering. |
| **Auth** | Stateless JWT | No session store needed. Horizontally scalable — any server instance can verify any token without shared state. |
| **Schema evolution** | Drizzle + `db:push` | Adding fields or tables is a one-command operation. Drizzle generates and applies safe migrations. |
| **Frontend** | TanStack Query cache | API responses are cached client-side — repeated navigations to the dashboard don't re-fetch unless data changes. |
| **Separation of concerns** | `shared/`, `server/`, `client/` | Frontend and backend can be deployed independently (e.g. CDN + separate API server) without any code changes. |

---

## 12. How to Run the Project Locally

### Prerequisites
- Node.js 20+
- PostgreSQL database (or use the Replit built-in database)

### Clone and install

```bash
git clone <repository-url>
cd zenith-2026
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/zenith
SESSION_SECRET=your_super_secret_jwt_key
```

### Push the database schema

```bash
npm run db:push
```

This creates the `users` and `registrations` tables. The admin seed user (`adminzen@event.com` / `admin123zen`) is created automatically when the server first starts.

### Start the development server

```bash
npm run dev
```

This starts both the Express backend (port 5000) and the Vite frontend dev server simultaneously. Visit `http://localhost:5000` in your browser.

### Seed admin credentials

The admin user is seeded automatically on startup if it does not already exist:

| Field | Value |
|-------|-------|
| Email | `adminzen@event.com` |
| Password | `admin123zen` |

---

## 13. Deployment

The project is structured as a unified full-stack application where Vite's built output is served by Express in production.

**Build:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

The Express server serves the compiled React app as static files and handles all `/api/*` routes. No separate frontend hosting is required.

**Environment variables required in production:**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret key for JWT signing (use a long random string) |
| `NODE_ENV` | Set to `production` |

---

## 14. API Testing with Postman

### Setup

1. Open Postman and create a new collection named **Zenith 2026 API**
2. Set a collection variable: `baseUrl = http://localhost:5000`

### Step 1 — Register a user (no auth needed)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/register`
- **Body (JSON):**
```json
{
  "name": "Test User",
  "email": "test@college.edu",
  "college": "Sample University",
  "year": "2nd Year",
  "domain": "Tech",
  "interestAnswer": "Exploring new tech."
}
```

### Step 2 — Admin login (get token)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/admin/login`
- **Body (JSON):**
```json
{
  "email": "adminzen@event.com",
  "password": "admin123zen"
}
```
- Copy the `token` from the response and set it as a collection variable: `token`

### Step 3 — Get all registrations (protected)
- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/registrations`
- **Header:** `Authorization: Bearer {{token}}`
- Add optional query params: `search`, `college`, `domain`

### Step 4 — Get analytics (protected)
- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/analytics`
- **Header:** `Authorization: Bearer {{token}}`

---

## 15. Postman Collection

You can import the following collection directly into Postman to test all API endpoints immediately.

**Steps:**
1. Copy the JSON below
2. Open Postman → click **Import** (top-left)
3. Select **Raw text**, paste the JSON, then click **Continue → Import**
4. After import, set the collection variable `token` to the value returned by the **Admin Login** request before calling protected endpoints

```json
{
  "info": {
    "name": "Zenith 2026 — Event Registration API",
    "_postman_id": "zenith-2026-collection",
    "description": "Complete API collection for the Zenith 2026 Full Stack Event Registration System. Covers public registration, admin authentication, filtered attendee listing, and analytics.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string",
      "description": "JWT token returned by POST /api/admin/login. Paste the value here after logging in."
    }
  ],
  "item": [
    {
      "name": "Public",
      "item": [
        {
          "name": "Register Attendee",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "register"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Priya Sharma\",\n  \"email\": \"priya.sharma@college.edu\",\n  \"college\": \"IIT Madras\",\n  \"year\": \"3rd Year\",\n  \"domain\": \"Tech\",\n  \"interestAnswer\": \"I am deeply interested in AI/ML and want to attend the workshops on neural networks.\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "description": "Register a new attendee for Zenith 2026. Returns a unique registrationId on success. Returns 400 if the email is already registered or any required field is missing."
          },
          "response": [
            {
              "name": "201 Created",
              "status": "Created",
              "code": 201,
              "body": "{\n  \"id\": 1,\n  \"registrationId\": \"REG-A3F19C2E\",\n  \"name\": \"Priya Sharma\",\n  \"email\": \"priya.sharma@college.edu\",\n  \"college\": \"IIT Madras\",\n  \"year\": \"3rd Year\",\n  \"domain\": \"Tech\",\n  \"interestAnswer\": \"I am deeply interested in AI/ML and want to attend the workshops on neural networks.\",\n  \"createdAt\": \"2026-03-13T09:00:00.000Z\"\n}"
            },
            {
              "name": "400 Duplicate Email",
              "status": "Bad Request",
              "code": 400,
              "body": "{\n  \"message\": \"Email already registered\",\n  \"field\": \"email\"\n}"
            },
            {
              "name": "400 Validation Error",
              "status": "Bad Request",
              "code": 400,
              "body": "{\n  \"message\": \"Invalid email\",\n  \"field\": \"email\"\n}"
            }
          ]
        },
        {
          "name": "Register Attendee — Non-Tech Domain",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "register"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Rahul Verma\",\n  \"email\": \"rahul.verma@university.ac.in\",\n  \"college\": \"Delhi University\",\n  \"year\": \"2nd Year\",\n  \"domain\": \"Non-Tech\",\n  \"interestAnswer\": \"I am passionate about entrepreneurship and product management.\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "description": "Register a Non-Tech domain attendee. The domain field only accepts 'Tech' or 'Non-Tech'."
          },
          "response": []
        }
      ]
    },
    {
      "name": "Admin — Auth",
      "item": [
        {
          "name": "Admin Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "var jsonData = pm.response.json();",
                  "if (jsonData.token) {",
                  "  pm.collectionVariables.set('token', jsonData.token);",
                  "  console.log('Token saved to collection variable: token');",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "admin", "login"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"adminzen@event.com\",\n  \"password\": \"admin123zen\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "description": "Authenticate as admin. Returns a signed JWT valid for 24 hours. The test script automatically saves the token to the 'token' collection variable so protected requests work without manual copy-paste."
          },
          "response": [
            {
              "name": "200 OK",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbnplbkBldmVudC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDA4NjQwMH0.example_signature\"\n}"
            },
            {
              "name": "401 Invalid Credentials",
              "status": "Unauthorized",
              "code": 401,
              "body": "{\n  \"message\": \"Invalid credentials\"\n}"
            }
          ]
        }
      ]
    },
    {
      "name": "Admin — Registrations",
      "item": [
        {
          "name": "Get All Registrations",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"]
            },
            "description": "Returns the complete list of all registered attendees. Requires a valid JWT in the Authorization header."
          },
          "response": [
            {
              "name": "200 OK",
              "status": "OK",
              "code": 200,
              "body": "[\n  {\n    \"id\": 1,\n    \"registrationId\": \"REG-A3F19C2E\",\n    \"name\": \"Priya Sharma\",\n    \"email\": \"priya.sharma@college.edu\",\n    \"college\": \"IIT Madras\",\n    \"year\": \"3rd Year\",\n    \"domain\": \"Tech\",\n    \"interestAnswer\": \"I am deeply interested in AI/ML.\",\n    \"createdAt\": \"2026-03-13T09:00:00.000Z\"\n  }\n]"
            },
            {
              "name": "401 Unauthorized",
              "status": "Unauthorized",
              "code": 401,
              "body": "{\n  \"message\": \"Unauthorized\"\n}"
            }
          ]
        },
        {
          "name": "Get Registrations — Filter by Domain",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations?domain=Tech",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"],
              "query": [
                {
                  "key": "domain",
                  "value": "Tech",
                  "description": "Filter by domain. Accepted values: 'Tech' or 'Non-Tech'"
                }
              ]
            },
            "description": "Returns only registrations matching the specified domain. domain must be exactly 'Tech' or 'Non-Tech'."
          },
          "response": []
        },
        {
          "name": "Get Registrations — Search by Name or Email",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations?search=priya",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"],
              "query": [
                {
                  "key": "search",
                  "value": "priya",
                  "description": "Partial text match against name, email, or registrationId"
                }
              ]
            },
            "description": "Searches registrations by partial name, email, or registration ID."
          },
          "response": []
        },
        {
          "name": "Get Registrations — Filter by College",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations?college=IIT",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"],
              "query": [
                {
                  "key": "college",
                  "value": "IIT",
                  "description": "Partial case-insensitive match on college name"
                }
              ]
            },
            "description": "Filters registrations by college name using a partial case-insensitive match."
          },
          "response": []
        },
        {
          "name": "Get Registrations — Combined Filters",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations?search=sharma&college=IIT&domain=Tech",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"],
              "query": [
                {
                  "key": "search",
                  "value": "sharma"
                },
                {
                  "key": "college",
                  "value": "IIT"
                },
                {
                  "key": "domain",
                  "value": "Tech"
                }
              ]
            },
            "description": "Demonstrates using all three filters simultaneously: search, college, and domain."
          },
          "response": []
        }
      ]
    },
    {
      "name": "Admin — Analytics",
      "item": [
        {
          "name": "Get Analytics",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/analytics",
              "host": ["{{baseUrl}}"],
              "path": ["api", "analytics"]
            },
            "description": "Returns aggregated analytics: total registrations, Tech vs Non-Tech domain split, and a day-by-day registration count array (used to render the bar chart in the admin dashboard)."
          },
          "response": [
            {
              "name": "200 OK",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"totalRegistrations\": 42,\n  \"domainSplit\": {\n    \"tech\": 28,\n    \"nonTech\": 14\n  },\n  \"dailyRegistrations\": [\n    { \"date\": \"2026-03-10\", \"count\": 5 },\n    { \"date\": \"2026-03-11\", \"count\": 12 },\n    { \"date\": \"2026-03-12\", \"count\": 25 }\n  ]\n}"
            },
            {
              "name": "401 Unauthorized",
              "status": "Unauthorized",
              "code": 401,
              "body": "{\n  \"message\": \"Unauthorized\"\n}"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 16. What This Project Demonstrates

| Engineering Skill | How it's demonstrated |
|---|---|
| **Clean separation of concerns** | Frontend, backend, and shared types live in isolated directories. No business logic leaks into components; no presentation logic lives in route handlers. |
| **Type-safe API contract** | `shared/routes.ts` defines Zod schemas for every endpoint. Both sides call `.parse()` on the same schema — no type drift between client and server. |
| **Modular backend design** | `storage.ts` encapsulates all database access behind an interface (`IStorage`). Routes are thin — they validate input, call storage, and return responses. |
| **REST API design** | Correct HTTP verbs (`GET`, `POST`), correct status codes (`200`, `201`, `400`, `401`), and consistent JSON error envelopes. |
| **Database schema design** | Tables are normalised (3NF). Unique constraints are applied at the DB level as a safety net. `registration_id` is separate from the internal `id` for clean public-facing identifiers. |
| **Security** | Passwords are hashed with scrypt + random salt. JWTs are signed with an environment secret, expire in 24 hours, and are verified on every protected request. Timing-safe comparison prevents timing attacks. |
| **Validation and error handling** | Zod validates both client forms and server request bodies using the same schema. Duplicate emails are caught at the application layer before the DB unique constraint triggers. All errors return structured JSON with the failing field name. |
| **Real-time UI** | TanStack Query keeps the dashboard in sync with the server — mutations invalidate relevant query keys so data refreshes automatically. |
| **Responsive design** | The UI adapts cleanly from mobile (320px) to desktop (1440px+) using Tailwind's responsive utility classes and conditional column visibility in the data table. |
