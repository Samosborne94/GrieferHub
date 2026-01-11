# Changelog

All notable changes to the GrieferHub project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Moderation Dashboard** (`/mod`) - Full-featured moderation interface
  - Review queue showing all reports with filters
  - Filter by game, status, severity, and search by name/description
  - Update report statuses (Verify, Reject, Resolve) with one-click actions
  - Stats overview cards (Total, Under Review, Verified, Rejected)
  - Role-based access (moderator and admin only)
  - Real-time status updates with optimistic UI
  - Color-coded action buttons for quick moderation
- **Admin Dashboard** (`/admin`) - User management and administration
  - View all users in sortable table format
  - Update user roles (promote/demote: user, moderator, admin)
  - User statistics (total users, admins, moderators, regular users)
  - Role badges with color coding
  - Quick access to moderation dashboard
  - Admin-only access control
  - Prevent self-role modification
- **API Endpoints for Moderation**:
  - `GET /api/mod/reports` - Fetch all reports (moderator/admin only)
  - `PATCH /api/mod/reports/[id]/status` - Update report status
  - `GET /api/admin/users` - Fetch all users (admin only)
  - `PATCH /api/admin/users/[id]/role` - Update user role (admin only)
- **Auth Helpers**:
  - `requireModerator()` - Require moderator or admin role
  - `requireAdmin()` - Require admin role only
- **Airtable Service Methods**:
  - `updateReportStatus()` - Update report status
  - `getUserById()` - Fetch user by ID
  - `getAllUsers()` - Fetch all users
  - `updateUserRole()` - Update user role
- **Navigation Updates**:
  - Moderation link in header (blue, visible to moderators/admins)
  - Admin link in header (red, visible to admins only)
  - Role-based conditional rendering

- **User Dashboard** (`/dashboard`) - Complete personal dashboard for managing reports
  - View all submitted reports with search and filtering
  - Stats overview cards (Total, Verified, Under Review, Resolved)
  - Edit functionality with full form (`/report/[id]/edit`)
  - Delete functionality with confirmation dialog
  - Status tracking with timestamps (created/updated dates)
  - Quick actions (View, Edit, Delete) for each report
  - Responsive design with dark theme
  - Protected route with authentication gate
- **API Endpoint** - `/api/reports/me` for fetching user's own reports
- **Report Edit Page** (`/report/[id]/edit`) - Full-featured edit interface
  - Pre-populated form with existing report data
  - Authorization check (owner or admin only)
  - All fields editable except status
  - Tag management with add/remove
  - Cancel button to return to report detail
- Report Submission Page (`/submit`) - Full-featured form for submitting griefer reports
  - Multi-step form with validation
  - File upload support (images and videos up to 10MB/100MB)
  - Direct integration with Cloudinary for media hosting
  - Alternative URL input for external evidence links
  - Severity level selection with descriptions (Low, Medium, High, Critical)
  - Tag management system for categorization
  - Authentication gate with redirect
  - Real-time upload progress indicator
  - Comprehensive form validation
  - Auto-redirect to report detail page on success
- NextAuth type extensions for User and Session types
- Dashboard navigation link in Header (visible when authenticated)

### Fixed

- TypeScript errors in API routes (Zod error.issues vs error.errors)
- Type safety for session.user in authorization checks
- Cloudinary upload Buffer handling with base64 encoding
- NextAuth JWT and Session type definitions

### Changed

- Phase 3 & 4 status updated to COMPLETE in project documentation
- README.md updated with Moderation and Admin Dashboard features
- PROJECT_PLAN.md updated with Phase 4 completion status
- Header navigation now includes role-based links (Moderation, Admin)

### Security

- Role-based access control implemented throughout
- Authorization checks on all moderation/admin API endpoints
- Protection against unauthorized status updates
- Protection against unauthorized user role changes
- Self-modification prevention in admin dashboard

### Planned

- Phase 5: Enhancement and advanced features (next priority)
  - Advanced search with tag filtering
  - Community voting system
  - User reputation system
  - Public API for external integrations
  - Performance optimizations
  - SEO improvements
- Phase 6: Community features
  - Notification system for status changes
  - Mod action logging
  - Comment system
  - User and griefer profiles

## [0.1.0] - 2026-01-03

### Added

- Initial project structure
- Project documentation:
  - README.md with project overview
  - PROJECT_PLAN.md with detailed roadmap
  - ARCHITECTURE.md with system design
  - SETUP.md with development instructions
  - CONTRIBUTING.md with contribution guidelines
- Configuration files:
  - package.json with dependencies
  - tsconfig.json for TypeScript
  - next.config.js for Next.js
  - .env.example for environment variables
  - .gitignore for version control
- Workflow automation:
  - /innit workflow for project initialization
- Directory structure:
  - src/api for API routes
  - src/app for Next.js pages
  - src/components for React components
  - src/lib for utilities
  - src/types for TypeScript types
  - tests for testing
  - docs for documentation

### Status

🚧 **In Development** - Foundation phase active

---

## Release Notes

### Version 0.1.0 - Project Initialization

This is the initial setup of the GrieferHub project. The foundation has been laid with:

✅ **Complete Documentation**

- Comprehensive README
- Detailed project plan with 6 phases
- System architecture documentation
- Development setup guide
- Contributing guidelines

✅ **Project Structure**

- Next.js app structure
- TypeScript configuration
- Component organization
- API route structure

✅ **Development Workflow**

- Package management setup
- Environment variable template
- Git ignore rules
- Automation workflows

🎯 **Next Steps**

1. Set up Airtable database
2. Implement authentication system
3. Create basic UI components
4. Build Intel Board (Home Page)

---

[Unreleased]: https://github.com/yourusername/GrieferHub/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/GrieferHub/releases/tag/v0.1.0
