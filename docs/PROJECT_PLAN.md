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

### Phase 4: Moderation

**Goal**: Implement moderation tools

#### Deliverables

- [ ] Admin/Mod Dashboard
  - Review unverified reports
  - Approve/reject submissions
  - Update report statuses
  - User management
- [ ] Notification system for status changes
- [ ] Mod action logging

### Phase 5: Enhancement

**Goal**: Advanced features and polish

#### Deliverables

- [ ] Advanced search (tags, multiple filters)
- [ ] Report voting/community feedback
- [ ] User reputation system
- [ ] API for external integrations
- [ ] Performance optimizations
- [ ] SEO improvements

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

1. **Immediate**: Build Moderation Dashboard (`/admin` or `/mod`)
   - Review queue for unverified reports
   - Approve/reject submissions
   - Update report statuses
   - User management tools
2. **Next**: Advanced features from Phase 5
   - Advanced search with multiple filters
   - Report voting/community feedback
   - User reputation system
   - API for external integrations
3. **Future**: Community features (Phase 6)

---

**Last Updated**: 2026-01-11
**Current Phase**: Phase 3 - Complete | Phase 4 - Moderation (Next)
