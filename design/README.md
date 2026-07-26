# GrieferHub Design System Bundle

This directory is the source of truth for the GrieferHub design system as synced to the
**Claude Design** project on claude.ai (Design System pane). Each `.html` file is a
self-contained preview card — inline CSS only, no external requests — with a first-line
`<!-- @dsCard group="…" -->` marker that registers it as a card in the Design System pane.

## Structure

| Path | Group | Contents |
| --- | --- | --- |
| `foundations/colors.html` | Foundations | Layered backgrounds, text hierarchy, accent, borders |
| `foundations/status-severity.html` | Foundations | Status + severity token vocabulary and usage rule |
| `foundations/typography.html` | Foundations | Type scale 2xs–6xl, gradient-text rule |
| `components/buttons.html` | Components | primary / secondary / danger / ghost × sm / md / lg, loading, disabled |
| `components/badges.html` | Components | Status badges, severity pills, tags |
| `components/inputs.html` | Components | Text / select / textarea, focus + error states |
| `components/report-card.html` | Components | Current flagship Intel Board card |
| `components/navigation.html` | Components | Sticky glass header with role-tinted nav |
| `components/states.html` | Components | Empty state, skeleton shimmer, spinner |
| `components/stat-tiles.html` | Components | LiveStats tiles with deltas |
| `proposals/report-card-v2.html` | Proposals | Evidence-first card: thumbnail, threat gauge, corroborations |
| `proposals/hero-intel.html` | Proposals | Search-first Intel Board hero with live ticker |
| `proposals/griefer-profile.html` | Proposals | Phase 6 griefer profile: aliases, threat score, timeline |
| `proposals/moderation-queue.html` | Proposals | Keyboard-first mod triage queue |

Tokens mirror `tailwind.config.js` and `DESIGN_SYSTEM.md` exactly — if a token changes
there, change it here in the same commit.

## Workflow

1. **Edit or add** a preview card here (keep it self-contained, keep the `@dsCard` marker).
2. **Sync** it to the claude.ai "Design System" project with the DesignSync tool from a
   Claude Code session (incremental — one component at a time, never wholesale replace).
3. **Review visually** in the Design System pane on claude.ai; iterate on the canvas or
   ask Claude to adjust, then sync refinements back into this directory and into the
   React components in `src/components/`.
4. `Proposals` cards are design intent, not shipped UI — once a proposal is approved,
   implement it in `src/components/` and move/rename the card into `Components`.
