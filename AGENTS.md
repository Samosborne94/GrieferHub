# Agent Operating Rules (Launch Hardening)

These rules are mandatory for all agent-driven changes in this repository.

## 1) Plan First

- Start each task with a short implementation plan before editing code.
- Define scope, affected files, validation steps, and rollback approach.
- Do not begin edits until the plan is explicit and consistent with the request.

## 2) Minimal Diffs

- Keep changes as small and focused as possible.
- Avoid drive-by refactors, formatting-only churn, and unrelated file edits.
- Prefer surgical patches that are easy to review and revert.

## 3) Security Gates (Public Launch)

- Block merge for any unresolved critical/high security issue.
- Verify authn/authz paths, input validation, secret handling, and dependency risk.
- Document data exposure changes and any new external integrations.
- Require a rollback/mitigation note for security-relevant changes.

## 4) Build and Lint Requirements

- PRs must pass build and lint before merge.
- If tests exist for changed behavior, they must pass.
- If checks are skipped, include a clear reason and follow-up owner.
