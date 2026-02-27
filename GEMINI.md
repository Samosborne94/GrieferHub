# GEMINI.md - GrieferHub Project Context

## Project Overview
GrieferHub is a community-driven platform designed for tracking and reporting griefers in online games (specifically targeting "Arc Raiders" and similar extraction shooters). It enables users to submit reports with evidence, participate in discussions via a comment system, and maintain user profiles with reputation scores.

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v3)
- **Database/Backend**: Airtable (via `airtable` SDK)
- **Authentication**: NextAuth.js
- **Media Storage**: Cloudinary (integrated for avatars/evidence)
- **API Strategy**: SWR for client-side data fetching; Next.js Route Handlers for backend logic.

### Architecture
- **Frontend Layer (`src/app`)**: Uses the Next.js App Router. Pages are organized by feature (e.g., `/player/[username]`, `/report/[id]`, `/submit`).
- **Component Architecture (`src/components`)**: 
    - `common/`: Atomic UI components (Button, Badge, Input, etc.).
    - `layout/`: Global structures (Header, Footer).
    - `reports/`, `home/`, `search/`: Feature-specific composite components.
- **Service Layer (`src/lib/services`)**: Centralized logic for external integrations:
    - `airtable.ts`: Core Data Access Layer (DAL) for all CRUD operations.
    - `cloudinary.ts`: Media upload management.
    - `discord.ts`: Optional webhook integrations.
- **Data Models (`src/types`)**: Centralized TypeScript interfaces for Reports, Users, Comments, and API Keys.

---

## Building and Running

### Development Commands
- `npm run dev`: Starts the development server at `http://localhost:3000`.
- `npm run build`: Compiles the application for production.
- `npm start`: Runs the built production application.
- `npm run lint`: Executes ESLint for code quality checks.
- `npm run format`: Runs Prettier to format the codebase.
- `npm test`: Executes Jest test suites.

### Environment Setup
Requires a `.env` file (see `.env.example`) with the following keys:
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `CLOUDINARY_URL` (for media uploads)

---

## Development Conventions

### 🎨 Design System (V2.0.0 Dark Gaming)
- **Core Aesthetic**: High-end, minimalist precision (Linear/Vercel inspired).
- **Grid**: Strict 8px base grid for spacing and layout.
- **Color Palette**:
    - Primary BG: `#0a0a0a` (`--bg-primary`)
    - Accent: `#ff4444` (`--accent-primary`)
- **Visual Effects**:
    - **Glassmorphism**: Use `.glass` or `.glass-card` (16px+ blur, subtle borders).
    - **Interactive**: Use `.card-elevated` and `.hover-lift` for interactive elements.
- **Typography**: High contrast (The Economist style). Use `font-black` and `tracking-tighter` for display headings.

### 🛠️ Coding Standards
- **Component Pattern**: Prefer Functional Components with Tailwind CSS.
- **API Handlers**: Follow the `NextResponse` pattern in `route.ts` files. Always wrap Airtable calls in `try/catch` and return a standard `{ success: boolean, data?: any, error?: string }` JSON response.
- **Data Fetching**: Use SWR in client components for caching and optimistic updates.
- **Airtable Integration**: Never call the Airtable SDK directly from components; always use `AirtableService` methods.
- **Accessibility**: Standardize touch targets to `min-h-[44px]` and ensure 4.5:1 contrast ratios.

---

## Key Files & Directories
- `src/lib/services/airtable.ts`: The most critical file for data logic.
- `src/app/globals.css`: Contains the design system's CSS variables and utility animations.
- `src/types/*.ts`: Source of truth for all data structures.
- `docs/ARCHITECTURE.md`: Deep dive into system design and data flows.
- `docs/PHASE_6_PROGRESS.md`: Current roadmap and feature completion status.
