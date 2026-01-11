# Changelog

All notable changes to the GrieferHub project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

- Phase 3 status updated to COMPLETE in project documentation
- README.md updated with User Dashboard feature details
- PROJECT_PLAN.md updated with completion status

### Planned

- Phase 4: Moderation dashboard (next priority)
  - Admin/mod review queue
  - Report status management
  - User management tools
- Phase 5: Advanced features and enhancements

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
