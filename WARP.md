# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commonly Used Commands

- **Run the development server:**
  ```bash
  npm run dev
  ```

- **Create a production build:**
  ```bash
  npm run build
  ```

- **Run the production server:**
  ```bash
  npm run start
  ```

- **Run linter:**
  ```bash
  npm run lint
  ```

- **Fix linting errors:**
  ```bash
  npm run lint:fix
  ```

- **Format code with Prettier:**
  ```bash
  npm run format
  ```

- **Run tests:**
  ```bash
  npm run test
  ```

- **Run tests in watch mode:**
  ```bash
  npm run test:watch
  ```

- **Run tests with coverage:**
  ```bash
  npm run test:coverage
  ```

## High-level Code Architecture and Structure

The GrieferHub application is a Next.js project built with TypeScript, Tailwind CSS, and NextAuth.js for authentication. It follows a standard Next.js project structure with the App Router.

### Key Directories:

- `src/app/`: Contains the application's pages and API routes.
  - `api/`: Backend API endpoints for handling authentication, reports, and file uploads.
  - `(pages)/`: Different pages of the application like the intel board, login, register, admin, dashboard, etc.
- `src/components/`: Reusable React components, organized by feature.
- `src/lib/`: Utility functions and services, including Airtable and Cloudinary integrations and authentication utilities.
- `src/types/`: TypeScript type definitions for the application.
- `docs/`: Project documentation, including architecture, setup, and project plans.

### Core Technologies:

- **Frontend:** Next.js (with App Router) and React.
- **Styling:** Tailwind CSS.
- **Authentication:** NextAuth.js for session management and protected routes.
- **Database:** Airtable is used as a no-code backend for storing report and user data.
- **Media Storage:** Cloudinary is used for storing uploaded images and videos.
- **Data Fetching:** SWR is used for client-side data fetching and caching.
- **Form Handling:** React Hook Form is used for building and validating forms.
- **Schema Validation:** Zod is used for data validation.

### Application Flow:

- Users can publicly view the Intel Board, which displays a list of griefer reports.
- Authenticated users can submit new reports, including evidence in the form of images or videos.
- Users have a personal dashboard to view and manage their submitted reports.
- Admins and moderators have dedicated dashboards to review and manage all reports and users.