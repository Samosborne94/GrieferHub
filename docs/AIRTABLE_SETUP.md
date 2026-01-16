# Airtable Setup Guide

Complete guide for setting up your Airtable base for GrieferHub.

## Prerequisites

- Airtable account (free or paid)
- Access to create a new base or modify existing base
- AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables

## Base Structure

Your Airtable base should contain the following tables:

1. **Users** - User accounts and authentication
2. **Reports** - Griefer reports submitted by users
3. **Comments** - Discussion comments on reports (Phase 6)

---

## Table 1: Users

### Fields Configuration

| Field Name | Field Type | Configuration | Required |
|------------|-----------|---------------|----------|
| id | Auto-number | Auto-generated | Yes |
| username | Single line text | Max 50 characters | Yes |
| email | Email | Unique | Yes |
| password | Single line text | Hashed passwords only | Yes |
| role | Single select | Options: user, moderator, admin | Yes |
| created_at | Created time | Auto-generated | Yes |

### Single Select Options (role field)
- user (default)
- moderator
- admin

### Notes
- Password should NEVER store plain text - only bcrypt hashed values
- Email should be unique across all users
- Default role should be "user"

---

## Table 2: Reports

### Fields Configuration

| Field Name | Field Type | Configuration | Required |
|------------|-----------|---------------|----------|
| id | Auto-number | Auto-generated | Yes |
| reporter_id | Single line text | User ID reference | Yes |
| griefer_name | Single line text | Max 100 characters | Yes |
| game | Single select | See options below | Yes |
| description | Long text | Max 5000 characters | Yes |
| evidence_url | URL | Valid URL format | Yes |
| status | Single select | See options below | Yes |
| severity | Single select | See options below | Yes |
| server | Single line text | Optional | No |
| tags | Multiple select | See options below | No |
| created_at | Created time | Auto-generated | Yes |
| updated_at | Last modified time | Auto-generated | Yes |

### Single Select Options

**game field:**
- Minecraft
- Rust
- ARK: Survival Evolved
- GTA V
- Counter-Strike 2
- Valorant
- Apex Legends
- Fortnite
- Call of Duty
- Other

**status field:**
- Under Review (default)
- Verified
- Resolved
- Rejected

**severity field:**
- Low
- Medium
- High
- Critical

### Multiple Select Options (tags field)
- Griefing
- Hacking
- Exploiting
- Toxic Behavior
- Team Killing
- Base Raiding
- Loot Stealing
- Betrayal
- Fake Friendly
- Spawn Camping
- Verbal Abuse
- Cheating
- Trolling
- Stream Sniping

---

## Table 3: Comments (Phase 6 - NEW)

### Fields Configuration

| Field Name | Field Type | Configuration | Required |
|------------|-----------|---------------|----------|
| id | Auto-number | Auto-generated | Yes |
| report_id | Single line text | Report ID reference | Yes |
| author_id | Single line text | User ID reference | Yes |
| author_username | Single line text | Denormalized username | Yes |
| author_role | Single select | user/moderator/admin | Yes |
| content | Long text | Max 2000 characters | Yes |
| created_at | Created time | Auto-generated | Yes |
| updated_at | Last modified time | Auto-generated | Yes |
| is_edited | Checkbox | Default: unchecked | Yes |

### Single Select Options (author_role field)
- user (default)
- moderator
- admin

### Optional Enhancements

**Linked Records** (for easier navigation):
- Link `report_id` to Reports table → This allows clicking to view the report
- Link `author_id` to Users table → This allows clicking to view the user

**Views**:
- "All Comments" (default view, sorted by created_at desc)
- "By Report" (grouped by report_id)
- "By Author" (grouped by author_id)
- "Recent Comments" (filter: created within last 7 days)

---

## Step-by-Step Setup Instructions

### 1. Create New Base (or use existing)

1. Go to [Airtable](https://airtable.com)
2. Click "Add a base" → "Start from scratch"
3. Name it "GrieferHub" (or your preferred name)
4. Copy the Base ID from the URL: `https://airtable.com/app{BASE_ID}/...`

### 2. Create Users Table

1. Rename the default table to "Users"
2. Add fields as specified in the Users section above
3. Set "user" as default for role field
4. Save the table

### 3. Create Reports Table

1. Click "Add or import" → "Create empty table"
2. Name it "Reports"
3. Add all fields as specified in the Reports section
4. Configure all single/multiple select options
5. Set "Under Review" as default for status
6. Save the table

### 4. Create Comments Table

1. Click "Add or import" → "Create empty table"
2. Name it "Comments"
3. Add all fields as specified in the Comments section
4. Configure single select options for author_role
5. Set checkbox default to unchecked for is_edited
6. **Optional**: Link report_id and author_id fields to their respective tables
7. Save the table

### 5. Get API Key

1. Click your profile icon (top right)
2. Go to "Account" → "API"
3. Copy your API key
4. Store securely in `.env.local` as `AIRTABLE_API_KEY`

### 6. Configure Environment Variables

Create or update `.env.local`:

```env
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Verification Steps

### Test Users Table

1. Manually create a test user in Airtable:
   - username: "testuser"
   - email: "test@example.com"
   - password: (use bcrypt hash of "password123")
   - role: "user"

### Test Reports Table

1. Manually create a test report:
   - reporter_id: (use the ID from test user)
   - griefer_name: "TestGriefer"
   - game: "Minecraft"
   - description: "Test description"
   - evidence_url: "https://example.com/test.jpg"
   - status: "Under Review"
   - severity: "Medium"

### Test Comments Table

1. Manually create a test comment:
   - report_id: (use the ID from test report)
   - author_id: (use the ID from test user)
   - author_username: "testuser"
   - author_role: "user"
   - content: "This is a test comment"
   - is_edited: unchecked

### Test API Connection

Run this test script to verify connection:

```bash
npm run dev
```

Then visit:
- `http://localhost:3000/api/reports` - Should return reports
- `http://localhost:3000/api/reports/{reportId}/comments` - Should return comments

---

## Common Issues & Solutions

### Issue: "AIRTABLE_API_KEY is not defined"
**Solution**: Check that `.env.local` exists and contains valid API key

### Issue: "Table not found"
**Solution**: Verify table names are exactly: "Users", "Reports", "Comments" (case-sensitive)

### Issue: "Field not found"
**Solution**: Verify field names match exactly (snake_case: report_id, author_username, etc.)

### Issue: Comments not loading
**Solution**:
1. Verify Comments table exists
2. Check field names match schema exactly
3. Verify report_id references valid report
4. Check browser console for API errors

### Issue: Cannot create comments
**Solution**:
1. Ensure user is authenticated
2. Verify all required fields are present
3. Check content length (1-2000 characters)
4. Review API logs for specific error

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Restrict API key access** in Airtable settings if possible
3. **Use environment variables** for all sensitive data
4. **Hash passwords** using bcrypt (never store plain text)
5. **Validate input** on both client and server side
6. **Rate limit API calls** to prevent abuse (future enhancement)

---

## Backup & Migration

### Backup Your Data

1. Go to Airtable base
2. Click "..." menu → "Export base to CSV"
3. Store backups regularly

### Migration Path (Future)

When scaling to PostgreSQL or MongoDB:
1. Export data from Airtable
2. Transform to new schema
3. Import to new database
4. Update service layer (keep same interface)
5. Test thoroughly before switching

---

## Performance Considerations

### Current Limits (Airtable Free Tier)
- 1,200 records per base
- 2 GB attachment space
- 5 API requests per second per base

### Optimization Tips
1. Use indexes on frequently queried fields
2. Denormalize data when appropriate (author_username in comments)
3. Cache frequently accessed data on frontend
4. Implement pagination for large result sets
5. Consider upgrading to Pro plan for larger scale

---

## Support & Resources

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Airtable JavaScript SDK](https://github.com/Airtable/airtable.js)
- [GrieferHub Comment System Docs](./COMMENT_SYSTEM.md)
- [GrieferHub Project Plan](./PROJECT_PLAN.md)

---

**Last Updated**: 2026-01-16
**Maintained by**: GrieferHub Development Team
