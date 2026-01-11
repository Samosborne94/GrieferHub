# GrieferHub Quick Reference

A quick reference guide for common tasks and commands.

## 🚀 Common Commands

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## 📁 Directory Quick Reference

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js pages (App Router) |
| `src/components/` | React components |
| `src/lib/services/` | API service layer |
| `src/types/` | TypeScript types |
| `docs/` | Project documentation |
| `tests/` | Test files |

## 🔗 Important Links

- **Documentation**: `/docs`
- **API Routes**: `src/app/api`
- **Components**: `src/components`
- **Airtable**: [airtable.com/account](https://airtable.com/account)

## 🎨 Component Patterns

### Creating a Component

```typescript
// src/components/category/MyComponent.tsx
interface MyComponentProps {
  title: string
  onClick?: () => void
}

export const MyComponent = ({ title, onClick }: MyComponentProps) => {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
    </div>
  )
}
```

### Creating a Page

```typescript
// src/app/mypage/page.tsx
export const metadata = {
  title: 'My Page - GrieferHub',
  description: 'Page description'
}

export default function MyPage() {
  return <div>My Page Content</div>
}
```

### Creating an API Route

```typescript
// src/app/api/myroute/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ data: 'success' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

## 🔐 Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `AIRTABLE_API_KEY` | Airtable authentication | Yes |
| `AIRTABLE_BASE_ID` | Database identifier | Yes |
| `NEXTAUTH_SECRET` | Auth token secret | Yes |
| `NEXTAUTH_URL` | App base URL | Yes |

## 📊 Data Schema Quick Reference

### Report Status

- `Verified` - Confirmed by moderators
- `Under Review` - Awaiting moderation
- `Resolved` - Issue resolved
- `Rejected` - Report rejected

### Severity Levels

- `Low` - Minor offense
- `Medium` - Moderate offense
- `High` - Serious offense
- `Critical` - Severe offense

### User Roles

- `user` - Regular user
- `moderator` - Can moderate reports
- `admin` - Full access

## 🐛 Troubleshooting

### Port in Use

```powershell
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Clear Cache

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Not Loading

```bash
# Ensure .env.local exists
cp .env.example .env.local
# Fill in values and restart dev server
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit with conventional message
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature
```

## 🎯 Project Phase Status

- [x] **Phase 0**: Initialization ✅
- [ ] **Phase 1**: Foundation (Current)
- [ ] **Phase 2**: Core Features
- [ ] **Phase 3**: User Engagement
- [ ] **Phase 4**: Moderation
- [ ] **Phase 5**: Enhancement
- [ ] **Phase 6**: Community Features

## 📞 Support

- Create an issue on GitHub
- Check documentation in `/docs`
- Review `SETUP.md` for setup issues
- See `CONTRIBUTING.md` for contribution guidelines

---

**Last Updated**: 2026-01-03  
**Version**: 0.1.0
