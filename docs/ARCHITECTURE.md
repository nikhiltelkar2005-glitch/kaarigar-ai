# KalaSetu — Product and Technical Architecture

## Product intent

KalaSetu helps independent artisans create, describe, price, and share product listings. The current product boundary is an artisan workspace: account, product catalog, AI assisted content, and a dashboard. Marketplace checkout, payments, shipping, and buyer accounts are outside the current implementation and should be treated as later product decisions.

## Current system shape

```text
Artisan (mobile or desktop browser)
  └─ React 18 + Vite (`client/`)
       └─ JSON over HTTP, JWT bearer token
            └─ Express API (`server/`)
                 ├─ Auth, product, dashboard, and AI routes
                 ├─ Services: business rules and ownership checks
                 ├─ Prisma ───────────── PostgreSQL
                 └─ AI service adapter ─ Gemini API

Prompt and content helpers (`ai-service/`) are currently a local
source module imported by the Express server; they are not a deployed
network service or independent runtime.
```

### Responsibilities

| Area | Owns | Current implementation |
|---|---|---|
| Client | Screens, forms, client-side navigation, API calls, and presenting generated content | React, React Router, Axios, Vite |
| API | Authentication, input validation, authorization, business rules, HTTP responses | Express routes/controllers/middleware/services |
| Persistence | Artisan accounts, products, generated copy and pricing suggestion | PostgreSQL via Prisma `User` and `Product` models |
| AI integration | Prompt construction, provider calls, output parsing, and saving generated results | `server/services/aiService.js` calls Gemini; prompt helpers live in `ai-service/` |
| Operations | Configuration, health endpoint, logs, deployment, and migrations | Environment variables, `/api/health`, Morgan, Prisma |

## Main request flows

### Sign in and product work

1. Client submits credentials to `/api/auth/register` or `/api/auth/login`.
2. API hashes and verifies passwords and returns a signed JWT with a safe user profile.
3. Client attaches the token as `Authorization: Bearer …` on protected requests.
4. Auth middleware verifies the token. Product services scope every read and write to the authenticated user ID.
5. Prisma reads or writes the PostgreSQL records; the API returns the shared JSON response shape.

### AI-assisted content

1. Client submits an AI action and product ID to `/api/ai/*`.
2. API authenticates the artisan and retrieves a product only if it belongs to that artisan.
3. AI service builds a task-specific prompt and calls Gemini using a server-side API key.
4. The response is checked/parsed and saved to the product; API returns the updated data.

Keep provider keys and database credentials on the server. Treat generated text and suggested prices as drafts for artisan review, not automatic publishing or guaranteed market advice.

## Data model

```text
User 1 ─────────── * Product
```

`User` represents one artisan account. `Product` stores core listing details, material/labour cost, publication state, optional image URL, and generated English/Hindi/Marathi copy, caption, and suggested price. Product ownership is enforced in service queries. Add database indexes and constraints alongside features when query patterns become clear; use Prisma migrations for all schema changes.

## API boundaries

- `/api/auth`: registration, login, current profile.
- `/api/products`: artisan-owned product CRUD.
- `/api/dashboard`: artisan summary.
- `/api/ai`: description, translation, price suggestion, caption.
- `/api/health`: deployment liveness check.

Keep controllers thin: HTTP parsing/response only. Put reusable business logic and authorization in services. Validate all untrusted input at the API boundary and return consistent errors through the shared error handler.

## Deployment shape (recommended near-term)

Deploy the client as a static web app, the Express API as one application service, PostgreSQL as a managed database, and use Gemini as an external dependency. Keep the prompt module packaged with the API for now; split it into a separate service only when independent scaling, queueing, or team ownership justifies the added operational cost. Configure exact client origins, HTTPS, secret storage, database backups, and migration execution per environment.

## Key quality attributes

- **Privacy:** every product query is scoped to the current user; never expose password hashes or secrets.
- **Resilience:** bound AI request time, handle provider/network errors, and provide clear retryable failures.
- **Usability:** design mobile-first, support low-bandwidth conditions, and make generated text editable before sharing.
- **Maintainability:** preserve client/API contracts, keep provider-specific logic behind an adapter, and document schema/API changes.
- **Observability:** log request IDs, latency, error class, and AI usage without logging tokens, secrets, or unnecessary personal data.

## Architecture decisions to revisit

1. Whether authentication should move from browser-managed JWT storage to secure same-site cookies before a public launch.
2. Whether generated AI work needs a background queue as usage or latency grows.
3. Image storage/provider and image upload limits before enabling product photos.
4. Whether “publish” means a shareable public listing or simply a local status flag; define this before building buyer-facing routes.
