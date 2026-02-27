# CLAUDE.md

## Project Overview

GrieferHub is a community-driven platform for tracking and reporting griefers in online games. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Airtable as the backend database.

## Quick Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix lint issues
npm run format       # Prettier formatting
npm test             # Run Jest tests
npm run test:watch   # Tests in watch mode
```

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS 3 with dark theme
- **Auth**: NextAuth.js 4 (credentials provider, session-based)
- **Database**: Airtable (via `airtable` npm package)
- **Media**: Cloudinary (image/video uploads)
- **Data fetching**: SWR (client-side caching)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # API endpoints (auth, reports, keys, etc.)
│   ├── admin/              # Admin dashboard
│   ├── dashboard/          # User dashboard
│   ├── intel/              # Intel board (public report list)
│   ├── forum/              # Forum pages
│   ├── player/             # Player profile pages
│   ├── report/             # Individual report pages
│   ├── submit/             # Report submission
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable React components
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── airtable-client.ts  # Airtable connection client
│   ├── swr-config.ts       # SWR configuration
│   ├── services/
│   │   ├── airtable.ts     # Main data access layer (reports, users, comments)
│   │   └── cloudinary.ts   # Media upload service
│   └── middleware/
│       ├── apiKeyAuth.ts   # API key authentication middleware
│       └── rateLimit.ts    # Rate limiting middleware
├── types/                  # TypeScript type definitions
│   ├── report.ts           # Report types
│   ├── user.ts             # User types
│   ├── apiKey.ts           # API key types
│   ├── comment.ts          # Comment types
│   ├── api.ts              # API response types
│   └── next-auth.d.ts      # NextAuth type augmentation
└── api/                    # Legacy API directory (pre-App Router)
tests/                      # Test files (currently empty)
.agent/                     # Ralph autonomous agent system
scripts/ralph/              # Ralph agent scripts & config
docs/                       # Project documentation
```

## Path Aliases

Defined in `tsconfig.json`:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/types/*` → `./src/types/*`

## Environment Variables

Required in `.env.local` (see `.env.example`):
- `AIRTABLE_API_KEY` - Airtable personal access token
- `AIRTABLE_BASE_ID` - Airtable base identifier
- `NEXTAUTH_SECRET` - JWT signing secret
- `NEXTAUTH_URL` - App base URL (http://localhost:3000 in dev)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` - Cloudinary credentials

## Key Patterns

### API Routes
Use Next.js App Router convention: `src/app/api/[endpoint]/route.ts` exporting `GET`, `POST`, `PUT`, `DELETE` handlers that return `NextResponse.json()`.

### Components
Functional components with TypeScript interfaces for props. Organized by feature in `src/components/`.

### Data Access
All Airtable operations go through `src/lib/services/airtable.ts`. Never call Airtable directly from components or API routes — use the service layer.

### Authentication
NextAuth.js handles sessions. Protected routes check `getServerSession()` server-side. Client-side uses `useSession()` hook.

### User Roles
Three roles: `user`, `moderator`, `admin`. Role-gated access for mod/admin dashboards.

### Report Statuses
`Verified` | `Under Review` | `Resolved` | `Rejected`

### Severity Levels
`Low` | `Medium` | `High` | `Critical`

## Git Workflow

- **Main branch**: `master`
- **Ralph agent branch**: `ralph/setup-tasks`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Ralph PRs to `master` when sprint is complete

## Ralph Agent System

The project uses an autonomous agent system called Ralph (`.agent/` directory):
- PRD stored in `prd.json` at repo root
- Ralph picks highest-priority story where `passes: false`
- Implements one story per iteration, commits, updates PRD
- Run with `npm run ralph`

## Known Issues

- Pre-existing TypeScript errors in auth routes, API key routes, player page, and airtable service
- `API_Keys` Airtable table may not be provisioned — API key endpoints will fail without it
- `tests/` directory is empty — no test coverage yet
