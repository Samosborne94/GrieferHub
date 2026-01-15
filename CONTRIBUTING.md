# GrieferHub Contributing Guide

## 🤝 How to Contribute

Thank you for your interest in contributing to GrieferHub! This guide will help you get started with development setup, coding standards, and contribution workflow.

## 📋 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others
- Respect maintainer decisions and project direction

## 🚀 Getting Started

### 1. Development Setup

#### Prerequisites

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm** or **pnpm**: Latest version
- **Git**: For version control ([Download](https://git-scm.com/))
- **Airtable Account**: Free account for database ([Sign up](https://airtable.com/signup))
- **Cloudinary Account**: Free account for media storage ([Sign up](https://cloudinary.com/users/register/free))
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

#### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:

   ```bash
   git clone https://github.com/your-username/GrieferHub.git
   cd GrieferHub
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/original-owner/GrieferHub.git
   ```

#### Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended for faster installs)
pnpm install
```

#### Environment Configuration

1. **Copy environment template**:

   ```bash
   cp .env.example .env.local
   ```

2. **Configure Airtable**:
   - Create an Airtable base named "GrieferHub"
   - Create Users table with fields: id, username, email, password_hash, role, created_at
   - Create Reports table with fields: id, reporter_id, griefer_name, game, description, evidence_url, status, severity, server, tags, created_at, updated_at
   - Get your API key from [airtable.com/account](https://airtable.com/account)
   - Find your Base ID in the API documentation

3. **Configure Cloudinary**:
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your cloud name, API key, and API secret from Dashboard > Settings
   - Add to `.env.local`

4. **Generate NextAuth Secret**:

   ```bash
   # Using OpenSSL
   openssl rand -base64 32

   # Or visit https://generate-secret.vercel.app/32
   ```

5. **Fill in `.env.local`** with your actual values

#### Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

Follow the code style guidelines below and ensure tests pass.

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new filter option"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Fill in the PR template with details about your changes

## 📝 Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🧪 Testing Requirements

### Test Coverage

- **Write tests for all new features** and bug fixes
- **Maintain minimum 80% code coverage** for new code
- **Test edge cases** and error scenarios
- **Run tests locally** before pushing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- ReportCard.test.tsx
```

### Test Structure

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { ReportCard } from './ReportCard';

describe('ReportCard', () => {
  it('renders report information correctly', () => {
    const mockReport = {
      id: '1',
      griefer_name: 'TestGriefer',
      game: 'Minecraft',
      status: 'verified'
    };

    render(<ReportCard report={mockReport} />);

    expect(screen.getByText('TestGriefer')).toBeInTheDocument();
    expect(screen.getByText('Minecraft')).toBeInTheDocument();
  });

  it('handles status change callback', async () => {
    const onStatusChange = jest.fn();
    // ... test implementation
  });
});
```

### What to Test

- **Component rendering** with different props
- **User interactions** (clicks, form submissions)
- **API endpoints** (mocked responses)
- **Utility functions** with various inputs
- **Error handling** and edge cases

### Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking (when implemented)

## 📖 Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update relevant documentation in `/docs`

## 🎨 Code Style Guidelines

### TypeScript

- **Always use TypeScript** for new files (`.tsx` for components, `.ts` for utilities)
- **Define interfaces** for all props, API responses, and data structures
- **Avoid `any` type** - use `unknown` or proper types
- **Use type inference** where possible to reduce verbosity

```typescript
// Good
interface ReportCardProps {
  report: Report;
  onStatusChange?: (status: ReportStatus) => void;
}

// Bad - using any
interface ReportCardProps {
  report: any;
  onStatusChange?: any;
}
```

### React Components

- **Use functional components** with hooks
- **Name files with PascalCase** (e.g., `ReportCard.tsx`)
- **Export as named exports** for better tree-shaking
- **Keep components small** - split into sub-components if over 200 lines
- **Use React Server Components** by default (mark with `'use client'` only when needed)

```typescript
// Good - named export
export function ReportCard({ report }: ReportCardProps) {
  return <div>...</div>;
}

// Avoid - default export
export default function ReportCard() {}
```

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route group for auth pages
│   ├── api/               # API routes
│   └── [feature]/         # Feature pages
├── components/
│   ├── common/            # Reusable UI components
│   ├── layout/            # Layout components
│   └── [feature]/         # Feature-specific components
├── lib/
│   ├── services/          # External service integrations
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
└── types/                 # TypeScript type definitions
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ReportCard`, `StatusBadge`)
- **Files**: Match component name (e.g., `ReportCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate`, `validateEmail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (e.g., `Report`, `User`, `ApiResponse`)

### Styling

- **Use Tailwind CSS** for all styling
- **Follow mobile-first** approach (default styles for mobile, then add breakpoints)
- **Use dark theme colors** from the design system
- **Keep utility classes organized** - group by category (layout, spacing, colors, typography)

```tsx
// Good - organized classes
<div className="
  flex items-center gap-4
  p-4 rounded-lg
  bg-gray-800 hover:bg-gray-700
  text-white text-sm
">
  Content
</div>
```

### API Routes

- **Use proper HTTP methods** (GET, POST, PUT, PATCH, DELETE)
- **Validate all inputs** with Zod schemas
- **Return consistent error responses**
- **Use try-catch** for error handling
- **Add JSDoc comments** for API documentation

```typescript
// Good - proper structure
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

### State Management

- **Use React hooks** for local state (`useState`, `useReducer`)
- **Use SWR** for data fetching and caching
- **Use Context** sparingly for global state
- **Avoid prop drilling** - use composition instead

### Performance

- **Use `next/image`** for all images
- **Implement lazy loading** for heavy components
- **Memoize expensive calculations** with `useMemo`
- **Debounce search inputs** to reduce API calls
- **Use Server Components** when possible to reduce client-side JavaScript

## 🐛 Reporting Bugs

Create an issue with:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## 💡 Suggesting Features

Create an issue with:

- Clear use case
- Expected behavior
- Mockups/wireframes if applicable
- Why this benefits the community

## 🔄 Git Workflow and Branching Strategy

### Branch Naming

- **Feature**: `feature/description` (e.g., `feature/comment-system`)
- **Bug fix**: `fix/issue-description` (e.g., `fix/login-redirect`)
- **Hotfix**: `hotfix/critical-issue` (e.g., `hotfix/security-patch`)
- **Refactor**: `refactor/component-name` (e.g., `refactor/report-card`)
- **Documentation**: `docs/topic` (e.g., `docs/api-guide`)

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your local main
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main

# Rebase your feature branch on updated main
git checkout feature/your-feature
git rebase main
```

### Commit Best Practices

- **Make atomic commits** - one logical change per commit
- **Write descriptive messages** - explain why, not just what
- **Keep commits small** - easier to review and revert if needed
- **Sign commits** (optional but recommended)

```bash
# Example of good commit messages
git commit -m "feat: add comment system to report detail page

- Add CommentList component with pagination
- Add CommentForm with validation
- Integrate with Airtable comments table
- Update API routes for comment CRUD operations

Closes #42"
```

## ✅ Pull Request Process

### Before Submitting

1. **Update your branch** with latest main
2. **Run all tests** and ensure they pass
3. **Run linter** and fix any issues
4. **Test manually** in the browser
5. **Review your own changes** in GitHub's diff view

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass locally (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] New tests added for new features (80% coverage)
- [ ] Documentation updated (README, inline comments, /docs)
- [ ] Commit messages follow Conventional Commits
- [ ] No merge conflicts with main branch
- [ ] PR description clearly explains changes
- [ ] Screenshots/videos included for UI changes
- [ ] Breaking changes are documented

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe how you tested your changes.

## Screenshots (if applicable)
Add screenshots or videos demonstrating the changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

## 🔍 Code Review Process

### For Contributors

1. **Submit PR** with clear description and context
2. **Automated checks** run (linting, tests, type checking)
3. **Maintainer review** - expect feedback within 2-3 days
4. **Address feedback** - push new commits or respond to comments
5. **Re-review** if changes were substantial
6. **Approval and merge** by maintainer

### Review Criteria

Reviewers will check:

- **Functionality**: Does it work as intended?
- **Code quality**: Is it readable and maintainable?
- **Tests**: Are there adequate tests?
- **Performance**: Any performance implications?
- **Security**: Any security concerns?
- **Documentation**: Is it well documented?
- **Design patterns**: Follows project conventions?

### Code Review Checklist

#### Functionality
- [ ] Feature works as described
- [ ] Edge cases handled
- [ ] Error states handled gracefully
- [ ] Loading states implemented

#### Code Quality
- [ ] TypeScript types properly defined
- [ ] No `any` types without justification
- [ ] Functions are focused and single-purpose
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Complex logic is commented

#### Security
- [ ] Input validation on all user inputs
- [ ] Authentication checks where needed
- [ ] No sensitive data exposed in client
- [ ] SQL injection / XSS protections

#### Performance
- [ ] No unnecessary re-renders
- [ ] Large lists are paginated/virtualized
- [ ] Images are optimized
- [ ] API calls are efficient

#### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels where appropriate
- [ ] Color contrast meets WCAG standards
- [ ] Focus states are visible

#### Testing
- [ ] Unit tests for new logic
- [ ] Integration tests for features
- [ ] Tests are meaningful (not just coverage)
- [ ] All tests pass

## 📧 Questions?

Feel free to create an issue for discussion!

---

Thank you for contributing to GrieferHub! 🎯
