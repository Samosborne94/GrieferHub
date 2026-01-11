# GrieferHub Development Setup

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **pnpm**: Latest version
- **Git**: For version control
- **Airtable Account**: For database backend
- **Code Editor**: VS Code recommended

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd GrieferHub
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in the required environment variables (see Configuration section below).

### 4. Run Development Server

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: External Services
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### Airtable Setup

1. **Create Airtable Base**:
   - Go to [airtable.com](https://airtable.com)
   - Create a new base named "GrieferHub"

2. **Create Users Table**:
   - Fields: id (Auto-number), username (Single line text), email (Email), role (Single select: user/moderator/admin), created_at (Created time)

3. **Create Reports Table**:
   - Fields: id (Auto-number), reporter_id (Link to Users), griefer_name (Single line text), game (Single select), description (Long text), evidence_url (URL), status (Single select: Verified/Under Review/Resolved/Rejected), severity (Single select: Low/Medium/High/Critical), server (Single line text), tags (Multiple select), created_at (Created time), updated_at (Last modified time)

4. **Get API Credentials**:
   - Go to Account → API
   - Generate a personal access token
   - Copy your Base ID from the API documentation

## 📁 Project Structure

```
GrieferHub/
├── .agent/              # Automation workflows
├── docs/                # Project documentation
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── page.tsx    # Home (Intel Board)
│   │   ├── layout.tsx  # Root layout
│   │   ├── report/     # Report pages
│   │   ├── submit/     # Submission page
│   │   ├── dashboard/  # User dashboard
│   │   └── admin/      # Admin dashboard
│   ├── components/      # React components
│   │   ├── layout/     # Layout components
│   │   ├── reports/    # Report components
│   │   ├── filters/    # Filter components
│   │   ├── media/      # Media components
│   │   └── common/     # Shared components
│   ├── lib/            # Utilities
│   │   ├── services/   # API services
│   │   ├── utils/      # Helper functions
│   │   └── hooks/      # Custom hooks
│   ├── types/          # TypeScript types
│   └── styles/         # Global styles
├── tests/              # Test files
├── .env.example        # Environment template
├── .env.local          # Local environment (gitignored)
├── next.config.js      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## 🛠️ Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format with Prettier
npm run format
```

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🎨 Styling Guidelines

- **CSS Modules** or **Tailwind CSS** for component styling
- **Dark theme first** - all components should use dark theme variables
- **Mobile responsive** - use mobile-first approach
- **Accessibility** - ensure WCAG 2.1 AA compliance

## 🧩 Adding New Features

### Creating a New Component

1. Create component file in appropriate directory:

   ```bash
   src/components/category/ComponentName.tsx
   ```

2. Use TypeScript for type safety:

   ```typescript
   interface ComponentNameProps {
     // Define props
   }
   
   export const ComponentName = ({ ...props }: ComponentNameProps) => {
     // Component logic
   }
   ```

3. Export from index file if needed

### Adding a New Page

1. Create page in `src/app/[route]/page.tsx`
2. Export default component
3. Add metadata for SEO
4. Update navigation if needed

### Creating an API Route

1. Create route in `src/app/api/[route]/route.ts`
2. Export GET, POST, PUT, DELETE handlers as needed
3. Add proper error handling
4. Validate inputs

## 🐛 Debugging

### Development Tools

- **React DevTools**: Browser extension for React debugging
- **Next.js DevTools**: Built-in development overlay
- **Network Tab**: Monitor API calls
- **Console Logging**: Use `console.log()` for debugging

### Common Issues

**Port already in use**:

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Module not found**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Airtable API](https://airtable.com/developers/web/api/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure linting passes
5. Submit a pull request

## 💬 Getting Help

- Check existing documentation
- Search closed issues
- Create a new issue with detailed description

---

**Last Updated**: 2026-01-03  
**Maintainer**: GrieferHub Team
