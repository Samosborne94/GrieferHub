# 🎯 GrieferHub

**A community-driven platform for tracking and reporting griefers in gaming communities**

---

## 📋 Overview

GrieferHub is a dark-themed utility dashboard that enables gaming communities to report, track, and share information about griefers. The platform provides a public Intel Board for browsing reports, video evidence integration, user submissions, and moderation tools.

## ✨ Key Features

### Public Features ✅ IMPLEMENTED

- **Intel Board** (`/intel`): Searchable directory of griefer reports with filtering and status badges
- **Report Details** (`/report/[id]`): Detailed view with video evidence player, full metadata, and timestamps
- **Advanced Filtering**: Filter by game, status, severity, and search by name/description
- **Pagination**: Navigate through large numbers of reports efficiently

### User Features ✅ IMPLEMENTED

- **User Authentication**: Secure login and registration with NextAuth and JWT
  - Email/password authentication
  - Session management
  - Protected routes and API endpoints
- **Submit Reports** (`/submit`): Full-featured report submission form
  - File upload support (images up to 10MB, videos up to 100MB)
  - Cloudinary integration for media hosting
  - Alternative URL input for external evidence links
  - Severity level selection (Low, Medium, High, Critical)
  - Tag management for categorization
  - Form validation with real-time feedback
  - Upload progress tracking
  - Auto-redirect to report on success

- **User Dashboard** (`/dashboard`): Comprehensive personal dashboard
  - View all your submitted reports
  - Stats overview (Total, Verified, Under Review, Resolved)
  - Edit your own reports with full form
  - Delete your own reports with confirmation
  - Track status changes and timestamps
  - Quick actions (View, Edit, Delete)

### Admin/Mod Features 📋 PLANNED

- **Moderation Dashboard**: Review and verify unverified reports
- **Status Management**: Update report statuses (Verified, Under Review, Resolved, etc.)
- **User Management**: Basic user administration tools

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) / React 19
- **Language**: TypeScript with full type safety
- **Styling**: Tailwind CSS with dark theme
- **Database**: Airtable (No-code backend)
- **Authentication**: NextAuth.js with JWT sessions
- **Media Storage**: Cloudinary (images and videos)
- **Validation**: Zod schemas
- **Data Fetching**: SWR for client-side caching

## 📂 Project Structure

```
GrieferHub/
├── .agent/
│   └── workflows/          # Automation workflows
├── docs/                   # Project documentation
│   ├── PROJECT_PLAN.md    # Roadmap and phases
│   ├── ARCHITECTURE.md    # System design
│   └── SETUP.md           # Setup instructions
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/          # API routes
│   │   │   ├── auth/     # Authentication endpoints
│   │   │   ├── reports/  # Report CRUD endpoints
│   │   │   └── upload/   # File upload endpoint
│   │   ├── intel/        # Intel Board page
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── dashboard/    # User dashboard page
│   │   ├── report/[id]/  # Report detail & edit pages
│   │   ├── submit/       # Report submission page
│   │   └── page.tsx      # Home page
│   ├── components/        # React components
│   │   ├── common/       # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   ├── providers/    # Context providers
│   │   └── reports/      # Report-specific components
│   ├── lib/               # Utilities and services
│   │   ├── services/     # Airtable and Cloudinary services
│   │   ├── auth.ts       # Auth utilities
│   │   └── swr-config.ts # SWR configuration
│   └── types/             # TypeScript definitions
│       ├── api.ts
│       ├── next-auth.d.ts
│       ├── report.ts
│       └── user.ts
└── tests/                 # Test files (future)
```

## 🚀 Getting Started

See [SETUP.md](./docs/SETUP.md) for detailed development setup instructions.

## 📖 Documentation

- [Project Plan](./docs/PROJECT_PLAN.md) - Roadmap and feature planning
- [Architecture](./docs/ARCHITECTURE.md) - System architecture overview
- [Setup Guide](./docs/SETUP.md) - Development environment setup

## 🤝 Contributing

This is a community-driven project. Contributions are welcome!

## 📄 License

TBD

---

## 🎯 Current Status

**Phase 3 - User Engagement (COMPLETE) | Phase 4 - Moderation (Next)**

### ✅ Completed Features
- Phase 1: Foundation (Infrastructure, Auth, Database) - 100%
- Phase 2: Core Features (Intel Board, Report Details) - 100%
- Phase 3: User Engagement - 100%
  - Full submission form with validation
  - File upload integration
  - Tag and severity management
  - User Dashboard with report management
  - Edit/delete functionality for own reports

### 📋 Next Up
- Phase 4: Moderation Dashboard
  - Review queue for unverified reports
  - Status management tools
  - User management

**Status**: ✅ Phase 3 Complete | Ready for Phase 4
