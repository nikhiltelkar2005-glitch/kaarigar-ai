# KalaSetu — Delivery Roadmap

This roadmap is ordered by dependencies and product risk. It describes outcomes, not fixed calendar commitments; assign owners and dates after confirming team capacity. The current repository is a prototype foundation: it has client/API source, auth and product flows, AI generation paths, Prisma schema, and starter documentation. The first milestone is to make that vertical slice reliable before expanding into marketplace features.

## Product direction

**Primary user:** an artisan using a phone to prepare and share product listings.

**Near-term outcome:** an artisan can securely create a product, improve its listing with AI, review/edit the result, and share it with customers.

**Success measures to establish:** onboarding completion, time to first saved product, AI action success rate and latency, share/copy usage, return usage, and support reports. Capture a baseline before setting numeric targets.

## Phase 0 — Confirm the runnable baseline

**Outcome:** a new contributor can run the whole product and understand what is implemented.

- Add a root-level setup guide with prerequisites, environment variables, database setup/migrations, and client/API startup steps.
- Confirm the current screens match the advertised journey; label unimplemented screens and flows accurately.
- Align API documentation with actual response fields and routes; remove stale examples.
- Establish a repeatable local database and a small, non-sensitive demo dataset.
- Make CI install the AI package if needed, validate the server, run existing server tests, and build the client.

**Exit checks:** fresh setup succeeds from documented instructions; CI is green; one artisan can register, log in, create and retrieve an owned product.

## Phase 1 — Secure and reliable core

**Outcome:** account and product data are safe and predictable for a small pilot.

- Enforce request validation for auth, product CRUD, and every AI action; reject invalid costs, unsupported languages, and malformed IDs.
- Review authorization on every product read/update/delete and AI operation; ensure responses never include password hashes.
- Configure explicit allowed origins, production-safe error responses, secure secret handling, and rate limits for authentication and AI endpoints.
- Add database indexes/constraints where access patterns require them and verify migrations/backups for deployment.
- Improve API tests for registration/login, ownership isolation, validation failures, CRUD, and AI provider failures.
- Add bounded timeouts and consistent provider error mapping; prevent malformed AI output from being persisted as a valid price.

**Exit checks:** cross-account access tests fail safely; expected bad inputs return useful 4xx responses; provider outages do not crash the API; restore procedure is documented.

## Phase 2 — Complete the artisan listing workflow

**Outcome:** artisans can maintain a polished listing and share it without depending on manual technical help.

- Finish dashboard, product list/detail, create/edit forms, and empty/loading/error states.
- Let artisans edit and save generated description, translations, caption, and suggested price before using them.
- Provide clear generation status, retry behavior, copy-to-clipboard, and mobile-friendly controls.
- Add product image upload/storage with file type/size limits and a documented storage provider; avoid treating arbitrary external URLs as uploads.
- Clarify draft/published semantics. For this phase, “share” can use a public preview or platform share sheet only if its privacy and URL behavior are defined.
- Add accessible labels, keyboard support, readable contrast, and low-bandwidth-friendly loading behavior.

**Exit checks:** a phone user completes add → improve → review/edit → share; refreshing preserves saved work; draft/public visibility is unambiguous.

## Phase 3 — Pilot, learn, and improve AI value

**Outcome:** real artisans can use the workflow and feedback drives changes.

- Run a small opt-in pilot with artisans across a few craft categories and language needs.
- Add privacy-respecting product analytics for funnel steps and AI latency/success, plus a simple feedback route.
- Review generated text with artisans for factual accuracy, cultural respect, tone, and usefulness; add prompt examples and guardrails based on findings.
- Replace price-only AI judgment with transparent cost inputs, configurable margin guidance, and an editable recommendation rationale. Make clear that it is a suggestion.
- Track provider cost/usage and introduce quotas or caching if needed.

**Exit checks:** pilot feedback is reviewed, the largest usability and content issues have owners, and success measures have baselines and targets.

## Phase 4 — Decide on commerce expansion

**Outcome:** choose a validated next product direction before committing to marketplace complexity.

Evaluate whether artisans need public storefront pages, buyer discovery, direct inquiries, inventory, orders, payments, shipping, or integrations with existing social commerce. Prototype the highest-value path with users, then scope privacy, fraud, support, and operational needs before implementation.

**Exit checks:** a product decision is documented with user evidence, measurable outcome, dependencies, and a bounded first release. Do not assume checkout or payment processing is part of the current product.

## Cross-cutting work for every phase

- Keep API and database changes documented alongside implementation.
- Use short-lived branches and reviewed changes; keep CI checks required for integration.
- Do not commit `.env` files or real user data.
- Make user-facing errors actionable and avoid leaking internal exception details.
- Review logs and metrics for sensitive information before launch.

## Suggested sequencing at a glance

| Order | Milestone | Dependency |
|---|---|---|
| 0 | Runnable baseline and truthful docs | Current source inventory |
| 1 | Secure, reliable core | Phase 0 setup and contracts |
| 2 | Complete listing and sharing UX | Stable auth, products, and API |
| 3 | Artisan pilot and AI iteration | End-to-end workflow |
| 4 | Commerce direction decision | Pilot evidence |
