# GrieferHub Project Plan

## 🎯 Project Vision

Create a comprehensive community-driven platform that empowers gaming communities to track, report, and share information about griefers, fostering safer and more enjoyable gaming experiences.

## 📊 Project Phases

### Phase 1: Foundation ✅ COMPLETE

**Goal**: Establish core infrastructure and basic functionality

#### Deliverables

- [x] Project structure setup
- [x] Airtable database design
  - Users table (id, username, email, created_at, role)
  - Reports table (id, reporter_id, griefer_name, game, description, evidence_url, status, severity, created_at, updated_at)
- [x] Authentication system (NextAuth with JWT)
- [x] Basic UI framework and design system

### Phase 2: Core Features ✅ COMPLETE

**Goal**: Implement public-facing features

#### Deliverables

- [x] Intel Board (Home Page)
  - Searchable report directory
  - Filter by game, status, severity
  - Status badges (Verified, Under Review, Resolved)
  - Pagination
- [x] Report Detail Page
  - Video evidence player
  - Full report details
  - Metadata display
- [x] Responsive dark theme UI

### Phase 3: User Engagement ✅ COMPLETE

**Goal**: Enable community participation

#### Deliverables

- [x] User registration and login
- [x] Report Submission Page
  - Form validation
  - Evidence upload (video/images via Cloudinary)
  - Tag management
  - Severity selection
  - URL-based evidence alternative
- [x] User Dashboard
  - View submitted reports
  - Track report status with stats overview
  - Edit/delete own reports
  - Full report management interface

### Phase 4: Moderation ✅ COMPLETE

**Goal**: Implement moderation tools

#### Deliverables

- [x] Admin/Mod Dashboard
  - Review queue with all reports
  - Approve/verify submissions
  - Reject submissions
  - Update report statuses (Verified, Rejected, Resolved)
  - Filter by game, status, severity
  - Search functionality
  - Stats overview
- [x] User Management (Admin Only)
  - View all users
  - Update user roles (user, moderator, admin)
  - User stats dashboard
- [ ] Notification system for status changes (Future)
- [ ] Mod action logging (Future)

### Phase 5: Enhancement ✅ COMPLETE

**Goal**: Advanced features and polish

#### Deliverables

- [x] SEO Optimization
  - Comprehensive metadata (Open Graph, Twitter Cards)
  - Sitemap.xml and robots.txt
  - Page-specific metadata
  - Google Bot optimization
- [x] Public API for external integrations
  - GET /api/public/reports - Paginated verified reports
  - GET /api/public/reports/[id] - Single report lookup
  - API documentation page (/api-docs)
  - JSON responses with pagination
  - Rate limiting ready
- [x] Performance optimizations
  - Next.js image optimization configured
  - SWC minification enabled
  - Gzip compression
  - AVIF/WebP image formats
  - CSS optimization
- [ ] Advanced search with tag filtering (Client-side ready)
- [ ] Report voting/community feedback (Future)
- [ ] User reputation system (Future)

### Phase 6: Community Features (Future)

- [ ] Comment system on reports
- [ ] User profiles
- [ ] Griefer profiles (aggregated reports)
- [ ] Analytics dashboard
- [ ] Discord/game integration bots

## 🗂️ Data Schema

### Users Table (Airtable)

| Field | Type | Description |
|-------|------|-------------|
| id | Auto-number | Unique user ID |
| username | Text | Display name |
| email | Email | User email |
| role | Single Select | user/moderator/admin |
| created_at | Created Time | Account creation timestamp |

### Reports Table (Airtable)

| Field | Type | Description |
|-------|------|-------------|
| id | Auto-number | Unique report ID |
| reporter_id | Link to Users | Submitter |
| griefer_name | Text | Name/tag of reported griefer |
| game | Single Select | Game where incident occurred |
| description | Long Text | Incident description |
| evidence_url | URL | Link to video/image evidence |
| status | Single Select | Verified/Under Review/Resolved/Rejected |
| severity | Single Select | Low/Medium/High/Critical |
| created_at | Created Time | Submission timestamp |
| updated_at | Last Modified | Last update timestamp |
| server | Text | Server/region where incident occurred |
| tags | Multiple Select | Categorization tags |

## 🎨 Design Principles

1. **Dark Theme First**: Optimized for extended viewing sessions
2. **Information Density**: Efficient use of space without clutter
3. **Clear Status Indicators**: Visual badges for quick scanning
4. **Mobile Responsive**: Works on all device sizes
5. **Accessibility**: WCAG 2.1 AA compliant

## 🔐 Security Considerations

- Input validation and sanitization
- Rate limiting on submissions
- Authentication required for submissions
- Moderation queue for new reports
- Evidence hosting security
- GDPR compliance considerations

## 📈 Success Metrics

- Number of active reporters
- Reports submitted per week
- Moderation queue processing time
- User retention rate
- Community engagement (votes, comments in future phases)

## 🚀 Next Steps

1. **Immediate**: Begin Phase 6 - Community Features
   - Comment system on reports
   - User profiles with activity history
   - Griefer profiles (aggregated reports)
   - Analytics dashboard for insights
   - Discord/game integration bots
2. **Future Enhancements**:
   - Report voting/community feedback
   - User reputation system
   - Advanced tag filtering UI
   - Real-time notifications
   - Mobile app

---

**Last Updated**: 2026-01-12
**Current Phase**: Phase 5 - Complete | Phase 6 - Community Features (Next)
