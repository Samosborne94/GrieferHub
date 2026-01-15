# GrieferHub Development Guide

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Variables Guide](#environment-variables-guide)
- [Database Setup (Airtable)](#database-setup-airtable)
- [Media Storage Setup (Cloudinary)](#media-storage-setup-cloudinary)
- [Running the Development Server](#running-the-development-server)
- [Building for Production](#building-for-production)
- [Development Tools](#development-tools)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Prerequisites

Before you begin development, ensure you have the following installed:

### Required

- **Node.js**: v18.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **pnpm** (recommended)
  - Install pnpm: `npm install -g pnpm`
  - Verify: `pnpm --version`
- **Git**: Latest version
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Accounts Required

- **Airtable Account** (Free tier works)
  - Sign up at [airtable.com/signup](https://airtable.com/signup)
  - Used for database backend
- **Cloudinary Account** (Free tier works)
  - Sign up at [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
  - Used for image and video hosting

### Recommended Tools

- **Visual Studio Code** with extensions:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - [TypeScript and JavaScript Language Features](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
- **Browser Developer Tools**:
  - React Developer Tools
  - Redux DevTools (if using Redux)

---

## Local Development Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/GrieferHub.git
cd GrieferHub
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended - faster and more efficient)
pnpm install
```

This will install all dependencies listed in `package.json`, including:

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- NextAuth.js
- Airtable SDK
- Cloudinary SDK
- SWR
- Zod
- And more...

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values (see [Environment Variables Guide](#environment-variables-guide) below).

### 4. Verify Setup

Run a quick verification to ensure everything is set up correctly:

```bash
# Check Node version
node --version  # Should be v18.x or higher

# Check installed packages
npm list --depth=0

# Verify TypeScript configuration
npx tsc --version
```

---

## Environment Variables Guide

GrieferHub requires several environment variables for different services. Here's a comprehensive guide:

### File Location

Create a `.env.local` file in the **root directory** of the project. This file is automatically ignored by git (listed in `.gitignore`).

### Required Variables

#### 1. Airtable Configuration

```bash
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
```

**How to get these values:**

1. Go to [airtable.com/account](https://airtable.com/account)
2. Navigate to the "API" section
3. Generate a Personal Access Token (API Key)
4. Find your Base ID in the API documentation for your specific base

**Example:**

```bash
AIRTABLE_API_KEY=patABC123def456GHI789jkl
AIRTABLE_BASE_ID=appXYZ123456789
```

#### 2. Authentication (NextAuth.js)

```bash
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

**How to generate `NEXTAUTH_SECRET`:**

Option 1: Using OpenSSL (Mac/Linux/Git Bash on Windows):

```bash
openssl rand -base64 32
```

Option 2: Using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Option 3: Use online generator:

- Visit [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

**Example:**

```bash
NEXTAUTH_SECRET=wJ4t7v+Yh2ZK9qM3nP6rS8uX1aB4cD5e
NEXTAUTH_URL=http://localhost:3000
```

**Note:** In production, change `NEXTAUTH_URL` to your actual domain (e.g., `https://grieferhub.com`)

#### 3. Media Storage (Cloudinary)

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**How to get these values:**

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard > Settings
3. Find your Cloud Name, API Key, and API Secret

**Example:**

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=grieferhub-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

**Important:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` has the `NEXT_PUBLIC_` prefix because it's accessed from the client-side.

### Optional Variables

#### Application Settings

```bash
# Environment mode
NODE_ENV=development  # or 'production' or 'test'

# Feature flags
ENABLE_MODERATION=true
ENABLE_ANALYTICS=false
```

#### Analytics and Monitoring (Future)

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry Error Tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/123456
```

### Environment Variable Precedence

Next.js loads environment variables in this order (later files override earlier ones):

1. `.env` - Loaded in all environments
2. `.env.local` - Loaded in all environments, ignored by git
3. `.env.development` - Loaded only when `NODE_ENV=development`
4. `.env.production` - Loaded only when `NODE_ENV=production`

**Best Practice:** Use `.env.local` for all local development secrets.

### Accessing Environment Variables

**Server-side (API routes, Server Components):**

```typescript
const airtableKey = process.env.AIRTABLE_API_KEY;
```

**Client-side (must have `NEXT_PUBLIC_` prefix):**

```typescript
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
```

---

## Database Setup (Airtable)

### Step 1: Create Airtable Base

1. Log in to [Airtable](https://airtable.com)
2. Click "Add a base" > "Start from scratch"
3. Name it "GrieferHub"

### Step 2: Create Users Table

Create a table named **Users** with the following fields:

| Field Name     | Field Type       | Options/Settings                          |
| -------------- | ---------------- | ----------------------------------------- |
| id             | Autonumber       | -                                         |
| username       | Single line text | -                                         |
| email          | Email            | -                                         |
| password_hash  | Single line text | (stores bcrypt hash)                      |
| role           | Single select    | Options: user, moderator, admin           |
| created_at     | Created time     | -                                         |

**Important:** The `password_hash` field should never store plain text passwords. Passwords are hashed using bcrypt before storage.

### Step 3: Create Reports Table

Create a table named **Reports** with the following fields:

| Field Name    | Field Type         | Options/Settings                                     |
| ------------- | ------------------ | ---------------------------------------------------- |
| id            | Autonumber         | -                                                    |
| reporter_id   | Link to another record | Link to Users table                              |
| griefer_name  | Single line text   | -                                                    |
| game          | Single select      | Options: Minecraft, GTA V, Rust, ARK, etc.           |
| description   | Long text          | -                                                    |
| evidence_url  | URL                | -                                                    |
| status        | Single select      | Options: Under Review, Verified, Resolved, Rejected  |
| severity      | Single select      | Options: Low, Medium, High, Critical                 |
| server        | Single line text   | (optional)                                           |
| tags          | Multiple select    | Options: griefing, hacking, toxic, raiding, etc.     |
| created_at    | Created time       | -                                                    |
| updated_at    | Last modified time | -                                                    |

### Step 4: Configure Airtable API

1. Go to [airtable.com/account](https://airtable.com/account)
2. Navigate to "Developers" or "API" section
3. Generate a **Personal Access Token**:
   - Click "Create token"
   - Give it a name (e.g., "GrieferHub Development")
   - Select scopes: `data.records:read`, `data.records:write`
   - Select your "GrieferHub" base
   - Copy the generated token
4. Find your **Base ID**:
   - Go to [airtable.com/api](https://airtable.com/api)
   - Select your "GrieferHub" base
   - The Base ID is shown in the URL and documentation (starts with `app`)

### Step 5: Add to Environment Variables

Add your Airtable credentials to `.env.local`:

```bash
AIRTABLE_API_KEY=patYourPersonalAccessToken
AIRTABLE_BASE_ID=appYourBaseId
```

### Step 6: Test Connection

Create a test user manually in Airtable to verify the connection:

1. Add a record to the Users table
2. Start your dev server (`npm run dev`)
3. Try logging in with those credentials

---

## Media Storage Setup (Cloudinary)

### Step 1: Create Cloudinary Account

1. Sign up at [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Complete email verification
3. Log in to your Dashboard

### Step 2: Get API Credentials

1. Navigate to **Dashboard** (default landing page after login)
2. Find your credentials in the "Account Details" section:
   - **Cloud name**: Your unique Cloudinary identifier
   - **API Key**: Your public API key
   - **API Secret**: Your private API secret (keep this secure!)

### Step 3: Configure Upload Settings (Optional but Recommended)

1. Go to **Settings** > **Upload**
2. Configure upload presets:
   - Click "Add upload preset"
   - Name it: `grieferhub-reports`
   - Upload mode: `Unsigned` (for client-side uploads) or `Signed` (for server-side)
   - Folder: `grieferhub/reports`
   - Resource type: `Auto`
   - File size limit: 100 MB
   - Allowed formats: jpg, png, gif, mp4, webm

3. Configure transformations (optional):
   - Thumbnail generation
   - Video transcoding
   - Image optimization

### Step 4: Add to Environment Variables

Add your Cloudinary credentials to `.env.local`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### Step 5: Test Upload

You can test uploads using the Cloudinary console or through the app:

1. Start the dev server
2. Log in to GrieferHub
3. Navigate to `/submit`
4. Try uploading an image or video
5. Check Cloudinary Dashboard to verify the file appears

### File Storage Structure

Cloudinary organizes files in folders:

```
grieferhub/
├── reports/
│   ├── images/
│   │   ├── report-123-abc.jpg
│   │   └── report-456-def.png
│   └── videos/
│       ├── report-789-ghi.mp4
│       └── report-012-jkl.webm
└── users/
    └── avatars/
        └── user-123.jpg
```

---

## Running the Development Server

### Start Development Mode

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using yarn
yarn dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

### Development Mode Features

- **Hot Module Replacement (HMR)**: Changes appear instantly without full reload
- **Fast Refresh**: React components update while preserving state
- **Error Overlay**: Detailed error messages displayed in browser
- **Source Maps**: Debug original TypeScript code in browser DevTools

### Development Scripts

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Accessing the Application

Once the server is running:

- **Home (Intel Board)**: [http://localhost:3000](http://localhost:3000)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Register**: [http://localhost:3000/register](http://localhost:3000/register)
- **Submit Report**: [http://localhost:3000/submit](http://localhost:3000/submit)
- **User Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Mod Dashboard**: [http://localhost:3000/mod](http://localhost:3000/mod)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **API Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Building for Production

### Create Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Build Process

The build command does the following:

1. **Type Checking**: Validates TypeScript types
2. **Linting**: Checks code quality with ESLint
3. **Compilation**: Compiles TypeScript to JavaScript
4. **Optimization**: Minifies and optimizes code
5. **Asset Generation**: Processes images, CSS, and static files
6. **Static Page Generation**: Pre-renders static pages

### Build Output

```
.next/
├── cache/                 # Build cache (speeds up subsequent builds)
├── server/                # Server-side code
├── static/                # Static assets
└── standalone/            # Standalone deployment (if configured)
```

### Testing Production Build Locally

```bash
# Build and start
npm run build && npm start

# Open in browser
# http://localhost:3000
```

### Production Environment Variables

Before deploying, ensure all environment variables are set in your hosting platform:

```bash
AIRTABLE_API_KEY=production_key
AIRTABLE_BASE_ID=production_base
NEXTAUTH_SECRET=production_secret
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=production_cloud
CLOUDINARY_API_KEY=production_key
CLOUDINARY_API_SECRET=production_secret
NODE_ENV=production
```

---

## Development Tools

### VS Code Extensions

Install these recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Browser Extensions

- **React Developer Tools**: [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
- **Redux DevTools**: [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

### Debugging

#### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Next.js: debug server-side",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229,
      "console": "integratedTerminal"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Next.js: debug client-side",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

#### Browser DevTools

Use Chrome DevTools for debugging:

1. Open DevTools (F12)
2. Sources tab > Set breakpoints
3. Network tab > Monitor API calls
4. Console tab > View logs and errors
5. React DevTools > Inspect component tree

---

## Troubleshooting Common Issues

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**

```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
PORT=3001 npm run dev
```

### Module Not Found Errors

**Problem:** `Error: Cannot find module 'xyz'`

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or clear npm cache
npm cache clean --force
npm install
```

### Environment Variables Not Loading

**Problem:** `process.env.VARIABLE_NAME` is `undefined`

**Solution:**

1. Verify `.env.local` exists in root directory
2. Restart dev server after changing environment variables
3. Check variable names - client-side variables need `NEXT_PUBLIC_` prefix
4. No spaces around `=` in `.env.local` file
5. Ensure file is named `.env.local` (not `.env` or `.env.development`)

### Airtable Connection Errors

**Problem:** `Error: AUTHENTICATION_REQUIRED` or `Error: NOT_FOUND`

**Solution:**

1. Verify API key is correct and has proper permissions
2. Check Base ID matches your actual base
3. Ensure Personal Access Token has correct scopes:
   - `data.records:read`
   - `data.records:write`
4. Verify table names match exactly (case-sensitive)

### Cloudinary Upload Errors

**Problem:** Uploads fail with `401 Unauthorized` or `Invalid signature`

**Solution:**

1. Verify Cloudinary credentials in `.env.local`
2. Check API Secret is correct (it's case-sensitive)
3. Ensure Cloud Name is spelled correctly
4. Try regenerating API credentials in Cloudinary dashboard

### TypeScript Errors

**Problem:** Type errors in IDE or during build

**Solution:**

```bash
# Delete TypeScript cache
rm -rf .next tsconfig.tsbuildinfo

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"

# Rebuild
npm run build
```

### Build Fails with Memory Error

**Problem:** `FATAL ERROR: Reached heap limit Allocation failed`

**Solution:**

```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build

# Or add to package.json scripts:
"build": "NODE_OPTIONS='--max_old_space_size=4096' next build"
```

### Slow Hot Module Replacement (HMR)

**Problem:** Changes take a long time to reflect in browser

**Solution:**

1. Reduce the number of files watched by Next.js
2. Disable antivirus scanning for project folder
3. Use pnpm instead of npm (faster)
4. Close unnecessary applications
5. Increase system resources

### CSS Not Applying

**Problem:** Tailwind CSS classes not working

**Solution:**

1. Verify `tailwind.config.js` content paths are correct
2. Ensure `@tailwind` directives are in global CSS file
3. Restart dev server
4. Clear browser cache
5. Check for conflicting CSS

### Authentication Issues

**Problem:** Login/logout not working, session errors

**Solution:**

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your dev URL
3. Clear browser cookies
4. Check browser console for errors
5. Verify NextAuth configuration in `[...nextauth].ts`

### Database Schema Mismatch

**Problem:** Errors about missing fields or incorrect data

**Solution:**

1. Verify Airtable table structure matches documentation
2. Check field names (case-sensitive)
3. Ensure field types are correct
4. Update TypeScript types to match Airtable schema

---

## Getting Help

If you encounter issues not covered here:

1. **Check Documentation**:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Airtable API Docs](https://airtable.com/developers/web/api/introduction)
   - [Cloudinary Docs](https://cloudinary.com/documentation)

2. **Search Issues**: Check GitHub Issues for similar problems

3. **Ask for Help**: Create a new GitHub Issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Error messages and stack traces

---

**Last Updated**: 2026-01-12
**Maintainer**: GrieferHub Team
