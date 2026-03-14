# Harness Engineering Principles

This codebase now follows a paved-path backend model inspired by strong platform engineering practice: secure defaults, explicit boundaries, consistent failure handling, and testable shared primitives.

## Principles

1. Validate at the boundary
   All request bodies and server configuration must be validated before business logic runs.

2. Fail closed
   Authentication, authorization, and config errors must stop execution immediately and return explicit API errors.

3. Standardize the happy path and the error path
   Routes should use shared helpers for success envelopes, body parsing, and error responses instead of hand-rolled JSON shapes.

4. Make dangerous operations safe by default
   Dynamic Airtable formulas must be built with escaping helpers, never with raw string interpolation.

5. Prefer observable failures over silent ones
   Server failures should emit structured logs with route context and request metadata.

6. Keep the path testable
   Shared infrastructure must have direct unit coverage so the contract is enforced outside of page-level tests.

## Implemented In This Repo

- `src/lib/env.ts`
  Centralized server environment validation with fast-fail config checks.

- `src/lib/errors.ts`
  Typed application errors with HTTP semantics.

- `src/lib/api/route.ts`
  Shared route helpers for JSON parsing, success envelopes, and consistent error handling.

- `src/lib/logger.ts`
  Structured server-side error logging.

- `src/lib/airtable-formula.ts`
  Safe Airtable formula construction helpers to avoid injection-style bugs.

- Core route migrations
  Authentication, report, comment, moderation, profile, and upload routes now use the shared primitives.

- Guardrail tests
  Added direct tests for env validation, route helpers, and Airtable formula escaping.

## Rules For Future Changes

- Do not interpolate untrusted values directly into Airtable formulas.
- Do not call `request.json()` directly in new routes when `parseJsonBody()` can be used.
- Do not return ad hoc `{ error: '...' }` payloads from new routes; use the shared response helpers.
- Do not throw raw string-matched auth errors from shared libraries; throw typed `AppError`s.
- Add tests when extending shared backend infrastructure.
