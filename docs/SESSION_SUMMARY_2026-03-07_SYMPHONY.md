# Session Summary - 2026-03-07 - Symphony

## User Request

Implement Symphony according to the OpenAI Symphony spec:
- https://github.com/openai/symphony/blob/main/SPEC.md

## Research Completed

- Retrieved and reviewed the Symphony spec from GitHub.
- Confirmed the repo already contains a separate `.agent` "Ralph" prototype that is PRD-oriented and not Symphony-compatible.
- Determined the clean path was to add a new isolated Symphony implementation instead of mutating Ralph in place.

## Files Added

- `.agent/symphony/types.ts`
- `.agent/symphony/template.ts`
- `.agent/symphony/workflow.ts`
- `.agent/symphony/state-store.ts`
- `.agent/symphony/agent-runner.ts`
- `.agent/symphony/linear-tracker.ts`

## Intended Remaining Work

- Add workspace lifecycle management:
  - create per-issue workspaces
  - run `after_create` / `before_remove` hooks
  - maintain `workpad.md`
- Add the main Symphony service/orchestrator:
  - reload `WORKFLOW.md` every cycle
  - reconcile active sessions against tracker state
  - stop and remove workspaces for terminal issues
  - restart agents until `codex_max_turns`
- Add CLI entry point:
  - `.agent/scripts/symphony.ts`
  - `package.json` script
- Add tests for:
  - workflow parsing
  - prompt rendering
  - orchestration/retry logic
- Add a sample `WORKFLOW.md`
- Update `.gitignore` for Symphony runtime state if desired

## Notes On Current State

- No verification was run after the partial implementation.
- The added tracker assumes the Linear GraphQL endpoint at `https://api.linear.app/graphql`.
- The current Linear query uses `projectV2(slugId: $projectSlug)` and may need validation against a live Linear workspace.
- This session ended before the implementation was completed.
