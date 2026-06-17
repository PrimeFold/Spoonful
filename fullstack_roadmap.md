# 🗺️ Fullstack Development Roadmap
### A battle-tested, niche-agnostic checklist for building robust apps — distilled from real builds.

---

## Phase 1 — Project Foundation

- [ ] Initialize repository with a clear folder structure: `frontend/`, `backend/`, `shared/`
- [ ] Set up `tsconfig.base.json` at the root and extend per-package for consistent TypeScript across the monorepo
- [ ] Add a `README.md` with setup instructions from day one
- [ ] Set up `.env` files for every environment; never hardcode secrets
- [ ] Install a linter (ESLint) and formatter (Prettier) early — enforce rules, don't fight them later
- [ ] Set up `package.json` scripts: `dev`, `build`, `type-check`, `test`

---

## Phase 2 — Backend Architecture

### 2.1 Server Setup
- [ ] Spin up a basic HTTP server (Express / Hono / Fastify)
- [ ] Apply global middleware: `cors`, `helmet`, `express.json()`, rate limiting
- [ ] Configure CORS to only allow your actual frontend origin(s) in production
- [ ] Add a health-check route (`GET /health`) immediately

### 2.2 Database & ORM
- [ ] Set up your ORM (Prisma / Drizzle / TypeORM) and connect to the database
- [ ] Define your schema models with proper types, relations, and constraints
- [ ] **Always run migrations after every schema change** — schema drift between the model file and the real DB is silent at TypeScript level but explodes at runtime
- [ ] After every `schema.prisma` change, run `prisma migrate dev` AND `prisma generate` to regenerate client types
- [ ] Add `@@index` on columns you will filter or sort by frequently
- [ ] Use `@unique` carefully — duplicate key violations are runtime errors if not guarded

### 2.3 CRUD (Create, Read, Update, Delete)
- [ ] Implement the **Repository Pattern**: all raw DB queries live in `*.repository.ts` — never mix them into service functions
- [ ] Layer architecture: `Router → Controller → Service → Repository`
- [ ] Controllers handle HTTP concerns only (parsing req, returning res)
- [ ] Services handle business logic only (decisions, transformations, cache)
- [ ] Repositories handle all database interactions only
- [ ] Write **DTO (Data Transfer Object) mappers** — never return raw DB rows to the client; always transform to a clean, versioned shape
- [ ] Standardize API response shapes in a **shared types file** so frontend and backend always speak the same contract:
  ```ts
  interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
  }
  ```
- [ ] All list endpoints must support **pagination** — `page`, `limit`, `skip`, `total`, `hasMore`
- [ ] Always filter sensitive data (passwords, tokens, internal IDs) before sending responses

### 2.4 Input Validation
- [ ] Validate ALL incoming data with a schema validation library (Zod / Joi / Yup) **at the controller level**, before it reaches the service
- [ ] Validate `req.body`, `req.query`, and `req.params` separately
- [ ] Strip empty strings, nullish values, and blank arrays from query params before passing to DB filters
- [ ] Coerce types where appropriate (e.g., `z.coerce.number()` for pagination params from query strings)
- [ ] Return structured `400 Bad Request` errors with the validation failure details

### 2.5 AUTH (Authentication)
- [ ] Implement session-based or JWT-based auth — pick one and be consistent
- [ ] Configure cookies correctly per environment:
  - Dev: `sameSite: "lax"`, `secure: false` (HTTP works)
  - Prod: `sameSite: "none"`, `secure: true` (HTTPS only)
  - **Browsers silently drop `secure` cookies over HTTP in dev** — this breaks auth invisibly
- [ ] Always read session/user from the auth layer in middleware, not re-fetching in controllers
- [ ] Add an `authMiddleware` that validates the session/token before any protected route runs
- [ ] Protect routes that mutate data — never trust the client for identity
- [ ] OTP / Email Verification:
  - [ ] Hash OTPs before storing — never store plaintext
  - [ ] Set OTP expiry timestamps
  - [ ] Delete OTP from DB immediately after successful verification
  - [ ] Force session cache refresh after email verification (to sync `emailVerified` state to client)
- [ ] Password Reset:
  - [ ] Use short-lived, single-use reset tokens
  - [ ] Send HTML emails — use the `html:` mailer field, not `text:`; email clients render HTML, not raw text strings
  - [ ] Revoke all sessions on password reset

### 2.6 RBAC (Role-Based Access Control)
- [ ] Define user roles as an enum in your schema (e.g., `STUDENT | ADMIN | OWNER`)
- [ ] Add a `requireRole(...roles)` middleware — chain it **after** `authMiddleware`, never before
- [ ] Expose role in the session object (many auth libraries omit custom fields by default — explicitly add them as `additionalFields`)
- [ ] Each role should only access its own endpoints — keep RBAC boundaries strict:
  - Students: their own data only
  - Admins: moderation actions only
  - Owner: admin management only
- [ ] Keep role mutation logic safe — only allow valid transitions (e.g., `STUDENT → ADMIN`, `ADMIN → STUDENT`); block illogical ones
- [ ] Log privileged actions (admin approvals/rejections) to an audit table for owner oversight

### 2.7 Filtering, Searching & Sorting
- [ ] Always do filtering, searching, and sorting **on the backend**, never the frontend
  - Frontend filtering = sending all data over the network, then discarding most of it
  - This causes higher hydration cost, more JS memory, slower mobile performance, worse Core Web Vitals
- [ ] Build a centralized filter builder function (e.g., `buildFilters()`) that constructs the DB `where` clause from optional params
- [ ] Make all filter params optional — empty filters should return everything
- [ ] Filter by content status before returning public data — e.g., only show `VERIFIED` items in public feeds, never `PENDING` or `REJECTED`

### 2.8 Caching
- [ ] Add a caching layer (Redis / in-memory) for expensive or frequently-hit read queries
- [ ] Cache keys must encode ALL variable dimensions (page, limit, search term, filters) — not just entity type
- [ ] Set short TTLs on lists that change frequently (e.g., pending queues: 15s)
- [ ] Set longer TTLs on stable data (e.g., public feeds: 5–10 min)
- [ ] **Invalidate cache proactively** after any write that would change the cached data — stale cache silently breaks the UI
- [ ] Use pattern-based key deletion (e.g., `redis.keys("pending-spots:*")`) to clear all pagination variants at once

### 2.9 Error Handling
- [ ] Every controller should be wrapped in a `try/catch`
- [ ] Return `500 Internal Server Error` for unexpected throws — never let the server crash silently
- [ ] Services should return structured error objects, not throw raw errors to controllers
- [ ] Never expose internal stack traces or Prisma errors to the client — sanitize the message
- [ ] Remove all `console.log` debug statements from production code — they are noise and potential security leaks

---

## Phase 3 — Frontend Architecture

### 3.1 Project Setup
- [ ] Set up routing (React Router / Next.js App Router) with a clear route hierarchy
- [ ] Define protected vs public routes explicitly — wrap protected routes in a `<ProtectedRoute>` guard
- [ ] Create a single axios/fetch instance with base URL and auth headers baked in — never duplicate this across files
- [ ] Create a centralized `actions.ts` (or equivalent) for all API calls — never write `fetch`/`axios` calls inline in components

### 3.2 State Management & Data Fetching
- [ ] Use a server-state library (TanStack Query / SWR) for all remote data — don't reinvent loading/error/caching
- [ ] Use a single `QueryClient` instance for the whole app — wrap root with `<QueryClientProvider>`
- [ ] Use a single `queryClient` export for imperative invalidation — don't call `useQueryClient()` from multiple places
- [ ] Define cache query keys consistently — use arrays, and include all relevant params so cache is precise
- [ ] After a mutation succeeds, **invalidate related queries** so the UI auto-refreshes without a manual page reload
- [ ] Use `keepPreviousData` (or `placeholderData`) on paginated/filtered queries so toggling filters doesn't flash a blank screen

### 3.3 AUTH on the Frontend
- [ ] Create an `AuthContext` with `signIn`, `signUp`, `signOut`, `resetPassword` — centralize all auth actions
- [ ] Read the user/session from a single source — never call the session hook in multiple places independently
- [ ] After sign-in, read `role` from the response and **route to the role-appropriate dashboard**:
  - `ADMIN` → admin dashboard
  - `OWNER` → owner dashboard
  - Everyone else → regular home
- [ ] After OTP verification, force-refresh the session with `disableCookieCache: true` before navigating, to sync `emailVerified` state
- [ ] **Rules of Hooks**: always declare all hooks at the top level of a component — never inside event handlers, `if` blocks, or early returns. Violation causes silent or corrupt state bugs.

### 3.4 UI Feedback & UX
- [ ] Mount a global `<Toaster />` component at the root of your app — toast calls are no-ops without it
- [ ] Every user action that hits the network must have 3 states:
  - **Idle** — normal
  - **Loading** — button disabled, label changes to "Saving..." / "Approving..."
  - **Done** — success toast + redirect, or error toast with message
- [ ] Inline form error messages are mandatory — don't rely on toasts alone for auth form errors
- [ ] Every data-dependent page must handle:
  - `isLoading` → show skeleton or spinner
  - `isError` → show error page/banner
  - empty state → show helpful "nothing here yet" message with a CTA
- [ ] Never render fetched data without a null/undefined guard first

### 3.5 Routing & Navigation
- [ ] Register all routes in one central file (`App.tsx` or equivalent)
- [ ] Use `useNavigate()` and `useEffect()` for programmatic redirects based on conditions — don't use early returns that return non-JSX from a component
- [ ] `toast.error()` returns `void` — never return it from a component, it renders nothing and produces a blank page
- [ ] For role-aware nav items, fetch the session in the `Navbar` component and conditionally render panel toggles based on user role

### 3.6 Component Design
- [ ] Build UI from small, focused components — one responsibility per component
- [ ] Separate presentational components (pure UI) from data-fetching components (containers)
- [ ] For dashboards: constrain to viewport height (`h-screen overflow-hidden`) and let individual panels scroll internally — prevents nested scrollbars and cheap-looking layouts
- [ ] Use `enabled: !!param` in `useQuery` to prevent fetching with `undefined` params when a URL param is required

---

## Phase 4 — Type Safety & Shared Contracts

- [ ] Put shared types (DTOs, enums, API response shapes) in a `shared/` directory accessible to both frontend and backend
- [ ] Never use `any` unless absolutely necessary — always type API responses and query results
- [ ] Run `tsc --noEmit` on both frontend and backend before every push — type errors at runtime are invisible until they crash
- [ ] Run `npm run build` locally before deploying — bundlers (like Vite/Rolldown) are stricter with peer dependencies than TypeScript itself

---

## Phase 5 — Feature-Specific Design Patterns

### Content Moderation / Approval Flows
- [ ] Add a `status` enum to the content model: `PENDING | VERIFIED | REJECTED`
- [ ] Only serve `VERIFIED` content to public-facing endpoints — always filter by status in the query
- [ ] Delete `REJECTED` records immediately after rejection — don't leave orphaned rows in the DB
- [ ] Clean up related orphaned records too (e.g., unique location linked to a rejected spot)
- [ ] Log all moderation actions to an audit table with timestamp, actor ID, and action taken

### Analytics & Charts
- [ ] Compute stats server-side — never send raw records to the frontend to aggregate
- [ ] Use `keepPreviousData` when toggling time periods on charts — avoids flicker and layout shift
- [ ] Separate chart data generation logic into its own repository method — don't inline it in service files

### Pagination
- [ ] All paginated endpoints return: `items`, `page`, `limit`, `total`, `hasMore`
- [ ] Cache keys must include the page number — `page 1` and `page 2` are different caches
- [ ] `skip = (page - 1) * limit` is always correct. `skip=0` for page 1 is valid — don't over-validate it

### Email Flows
- [ ] Always use `html:` field in nodemailer config — not `text:`
- [ ] Build a proper HTML email template with inline styles — email clients don't support external CSS
- [ ] Store the email template as a function/module, not inline in the mailer config

---

## Phase 6 — Testing

- [ ] Write unit tests for service functions — mock the repository and cache layers
- [ ] Write integration tests for auth flows (signup → signin → session validation)
- [ ] Test cache hit/miss behavior explicitly
- [ ] Test that cache is invalidated after writes
- [ ] Test role enforcement — an admin route should return 403 for a student
- [ ] Test pagination edge cases (`page=1`, `skip=0`, last page, empty results)
- [ ] Run the full test suite before every merge

---

## Phase 7 — Security Hardening

- [ ] Never trust client-supplied IDs for ownership checks — always verify against the session user
- [ ] Rate-limit auth routes (login, OTP generation) separately and more aggressively
- [ ] Sanitize all user inputs that are stored and later displayed — prevent XSS
- [ ] Never expose raw DB errors to the client
- [ ] Remove all debug `console.log` statements before shipping — they can leak internal details
- [ ] Ensure SMTP credentials, DB connection strings, JWT secrets, and API keys are in `.env` and gitignored

---

## Phase 8 — Polish & Deployment Readiness

- [ ] Ensure cookie `secure` and `sameSite` attributes are set conditionally per `NODE_ENV`
- [ ] Run `tsc --noEmit` on both frontend and backend — zero type errors
- [ ] Run `npm run build` locally — verify the production bundle resolves all imports cleanly
- [ ] Check for missing peer dependencies that bundlers (Rolldown/Webpack) won't resolve automatically
- [ ] Verify Redis connection string is production-ready (TLS enabled for production Redis)
- [ ] Verify CORS `trustedOrigins` only includes the real production frontend URL
- [ ] Verify all admin/owner/private routes are behind both `authMiddleware` and `requireRole`
- [ ] Review API surface for any unprotected write/delete routes

---

## ⚡ Quick Anti-Pattern Reference

| ❌ Anti-Pattern | ✅ Correct Approach |
|---|---|
| Calling hooks inside event handlers / conditionals | Always call hooks at top level of the component |
| Returning `toast.error(...)` from a component | Use `useEffect` + `navigate()` for redirect, render JSX for UI |
| Filtering data on the frontend | Filter on the backend in the query |
| Sending all records over the network, then slicing | Paginate at the DB level with `skip` / `take` |
| Storing plaintext OTPs | Hash with SHA-256 before storing |
| Using `text:` in nodemailer for HTML emails | Always use `html:` field |
| Schema change without running migration | `prisma migrate dev` + `prisma generate` after every schema change |
| Mixing DB queries inside service functions | All DB access goes in Repository files only |
| Cache keys without pagination params | Include `page` + `limit` + all filter dimensions in cache key |
| Invalidating nothing after a mutation | Always call `queryClient.invalidateQueries(...)` after writes |
| Hardcoding `secure: true` cookies for dev | Set conditionally: `secure: NODE_ENV === 'production'` |
| Leaving `REJECTED` rows in DB with status update only | Delete the record and its orphaned relations immediately |
| Leaving debug `console.log` in production code | Remove all debug logs before shipping |
