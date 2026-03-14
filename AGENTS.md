# Agent Learnings (AGENTS.md)

This file tracks patterns, conventions, and "gotchas" discovered by AI agents working on this codebase.

## Patterns & Conventions

- Backend routes should prefer the shared paved path in `src/lib/api/route.ts` for JSON parsing, success envelopes, and error handling.
- Shared server failures should use typed `AppError`s from `src/lib/errors.ts` and structured logging from `src/lib/logger.ts`.
- Dynamic Airtable formulas should be constructed with `src/lib/airtable-formula.ts`, never with raw string interpolation.
- Server-only runtime config should be read through `src/lib/env.ts` instead of direct unchecked `process.env` access in service modules.

## Gotchas & Warnings

- Airtable `filterByFormula` is injection-prone if values are interpolated directly; always escape via the formula helpers.
- Several API routes historically matched auth failures by error message string. New code should throw typed errors instead.
- This repo has Jest coverage for shared backend guardrails; keep those tests updated when changing env parsing, API helpers, or Airtable query builders.

## Useful Context

- `npx tsc --noEmit` and `npm test -- --runInBand` are both green after the Harness-principles refactor.
- The main migrated routes are auth registration, reports, report comments, comment mutations, own-profile routes, moderation status updates, and uploads.
