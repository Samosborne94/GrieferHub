# 🎯 GrieferHub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Phase](https://img.shields.io/badge/Phase-5%20Complete-success)](./docs/PROJECT_PLAN.md)

**A community-driven platform for tracking and reporting griefers in gaming communities**

[Live Demo](#) | [Documentation](#-documentation) | [Contributing](./CONTRIBUTING.md) | [Roadmap](./ROADMAP.md)

---

## 📋 Overview

GrieferHub is a dark-themed utility dashboard that enables gaming communities to report, track, and share information about griefers. The platform provides a public Intel Board for browsing reports, video evidence integration, user submissions, and moderation tools.

## 🎉 What's New

**January 2026 - Phase 6: Community Features (IN PROGRESS)**

We're actively developing Phase 6 community features:

- **NEW:** [Comment System](./docs/COMMENT_SYSTEM.md) - Full-featured commenting on reports with edit/delete capabilities
- Interactive discussions on report pages
- Role-based comment moderation
- Real-time comment updates

**January 2026 - Comprehensive Documentation Release**

We've created extensive documentation to help developers and contributors:

- [Development Guide](./DEVELOPMENT.md) - Complete setup instructions with troubleshooting
- [Features Documentation](./FEATURES.md) - 40+ features with user flows and implementation details
- [Roadmap](./ROADMAP.md) - Detailed timeline through 2026 and beyond
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment on multiple platforms
- [Future Features](./FUTURE_FEATURES.md) - Phase 6+ plans with technical specs
- [Contributing Guide](./CONTRIBUTING.md) - Enhanced with code review checklist and best practices

All documentation is beginner-friendly with code examples and step-by-step instructions!

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

### Admin/Mod Features ✅ IMPLEMENTED

- **Moderation Dashboard** (`/mod`): Comprehensive moderation interface
  - Review queue with all reports
  - Filter by game, status, severity, and search
  - Update report statuses (Verify, Reject, Resolve)
  - Stats overview (Total, Under Review, Verified, Rejected)
  - Quick actions for each report
  - Role-based access (moderator and admin)
- **Admin Dashboard** (`/admin`): User management tools
  - View all users with role badges
  - Update user roles (promote to moderator/admin)
  - User statistics dashboard
  - Quick access to moderation dashboard
  - Admin-only access

### Community Features ✅ IMPLEMENTED (Phase 6)

- **Comment System**: Interactive discussions on reports
  - Post comments on any report (authenticated users)
  - Edit your own comments (moderators can edit any)
  - Delete comments with confirmation
  - Role-based badges (User, Moderator, Admin)
  - Relative time display ("2 hours ago")
  - Edit tracking with "(edited)" indicator
  - Real-time comment updates

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
│   │   ├── admin/        # Admin dashboard (user management)
│   │   ├── dashboard/    # User dashboard page
│   │   ├── mod/          # Moderation dashboard
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

Comprehensive documentation to help you get started and contribute:

### Getting Started

- **[Development Guide](./DEVELOPMENT.md)** - Complete local setup, environment variables, database configuration, and troubleshooting
- **[Setup Guide](./docs/SETUP.md)** - Quick start guide for development
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute, code style, git workflow, and PR process

### Project Information

- **[Features](./FEATURES.md)** - Comprehensive feature list with status, user flows, and implementation details
- **[Roadmap](./ROADMAP.md)** - Short-term, medium-term, and long-term development goals
- **[Future Features](./FUTURE_FEATURES.md)** - Detailed Phase 6+ implementation plans and community requests
- **[Project Plan](./docs/PROJECT_PLAN.md)** - Complete project roadmap and phase breakdown
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture, design patterns, and technical decisions
- **[Harness Engineering Principles](./docs/HARNESS_ENGINEERING_PRINCIPLES.md)** - Backend guardrails, paved paths, and shared route/service standards

### Deployment & Operations

- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment on Vercel, Netlify, AWS, or self-hosted
- **[Changelog](./CHANGELOG.md)** - Version history and release notes

### Quick Reference

- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Command cheat sheet and common tasks

## 🤝 Contributing

We welcome contributions from the community! GrieferHub is built by developers for the gaming community.

### How to Contribute

1. Read the [Contributing Guide](./CONTRIBUTING.md)
2. Check the [Roadmap](./ROADMAP.md) for planned features
3. Pick an issue or suggest a new feature
4. Follow the code style guidelines
5. Submit a pull request

### Areas for Contribution

- Frontend development (React/Next.js)
- Backend development (API routes)
- UI/UX design improvements
- Documentation improvements
- Testing and quality assurance
- Feature suggestions and feedback

**New to open source?** Check out issues labeled `good-first-issue` to get started!

## 📄 License

TBD

---

## 🎯 Current Status

**Phase 6 - Community Features (IN PROGRESS)**

### ✅ Completed Features
- Phase 1: Foundation (Infrastructure, Auth, Database) - 100%
- Phase 2: Core Features (Intel Board, Report Details) - 100%
- Phase 3: User Engagement - 100%
  - Full submission form with validation
  - File upload integration
  - Tag and severity management
  - User Dashboard with report management
  - Edit/delete functionality for own reports
- Phase 4: Moderation - 100%
  - Moderation dashboard with review queue
  - Report status management (Verify, Reject, Resolve)
  - Admin dashboard with user management
  - Role-based access control
- Phase 5: Enhancement - 100%
  - SEO optimization (metadata, sitemap, robots.txt)
  - Public API with documentation
  - Performance optimizations
  - Image optimization
- Phase 6: Community Features - 30% (In Progress)
  - ✅ Comment system on reports
  - 🚧 User profiles (Next)
  - 🚧 Griefer profiles (Next)
  - 🚧 Notification system (Planned)

### 📋 Next Up
- Complete Phase 6: Community Features
  - User profiles with activity history
  - Griefer profiles (aggregated reports)
  - Notification system
  - Enhanced analytics

**Status**: 🚧 Phase 6 In Progress | Comment System Complete
