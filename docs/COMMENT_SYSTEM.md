# Comment System Documentation

## Overview

The Comment System allows authenticated users to engage in discussions on report pages, providing additional intel, confirmations, or insights about reported griefers.

## Features

- **Post Comments**: Authenticated users can add comments to any report
- **Edit Comments**: Users can edit their own comments (moderators and admins can edit any comment)
- **Delete Comments**: Users can delete their own comments (moderators and admins can delete any comment)
- **Real-time Updates**: Comments are fetched and displayed dynamically
- **Role-Based Styling**: Comments display user roles (User, Moderator, Admin) with appropriate badges
- **Edit Tracking**: Edited comments are marked with an "(edited)" indicator
- **Time Display**: Comments show relative time ("2 hours ago", "Just now", etc.)

## Database Schema

### Airtable Comments Table

Create a new table in Airtable called `Comments` with the following fields:

| Field Name       | Field Type   | Description                          |
| ---------------- | ------------ | ------------------------------------ |
| report_id        | Text         | ID of the report (linked to Reports) |
| author_id        | Text         | ID of the comment author             |
| author_username  | Text         | Username of the author               |
| author_role      | Single Select| Role: user, moderator, admin         |
| content          | Long Text    | Comment content (max 2000 chars)     |
| created_at       | Date         | Comment creation timestamp           |
| updated_at       | Date         | Last update timestamp                |
| is_edited        | Checkbox     | Whether comment has been edited      |

## API Endpoints

### GET /api/reports/[id]/comments

Fetch all comments for a specific report.

**Parameters:**
- `id` (path): Report ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rec123...",
      "reportId": "rec456...",
      "authorId": "rec789...",
      "authorUsername": "johndoe",
      "authorRole": "user",
      "content": "Can confirm. This player griefed our server too.",
      "createdAt": "2026-01-16T10:30:00.000Z",
      "updatedAt": "2026-01-16T10:30:00.000Z",
      "isEdited": false
    }
  ]
}
```

### POST /api/reports/[id]/comments

Create a new comment on a report.

**Authentication:** Required

**Parameters:**
- `id` (path): Report ID

**Body:**
```json
{
  "content": "This player has been banned from our server."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rec123...",
    "reportId": "rec456...",
    "authorId": "rec789...",
    "authorUsername": "johndoe",
    "authorRole": "moderator",
    "content": "This player has been banned from our server.",
    "createdAt": "2026-01-16T10:35:00.000Z",
    "updatedAt": "2026-01-16T10:35:00.000Z",
    "isEdited": false
  },
  "message": "Comment created successfully"
}
```

### PUT /api/comments/[id]

Update an existing comment.

**Authentication:** Required (must be comment owner, moderator, or admin)

**Parameters:**
- `id` (path): Comment ID

**Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rec123...",
    "reportId": "rec456...",
    "authorId": "rec789...",
    "authorUsername": "johndoe",
    "authorRole": "user",
    "content": "Updated comment content",
    "createdAt": "2026-01-16T10:30:00.000Z",
    "updatedAt": "2026-01-16T10:40:00.000Z",
    "isEdited": true
  },
  "message": "Comment updated successfully"
}
```

### DELETE /api/comments/[id]

Delete a comment.

**Authentication:** Required (must be comment owner, moderator, or admin)

**Parameters:**
- `id` (path): Comment ID

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## Component Usage

### CommentsSection Component

The `CommentsSection` component is used on report detail pages to display and manage comments.

**Props:**
- `reportId` (string): The ID of the report

**Example:**
```tsx
import { CommentsSection } from '@/components/reports/CommentsSection'

export default function ReportDetailPage() {
  const reportId = 'rec123...'

  return (
    <div>
      {/* Report content */}
      <CommentsSection reportId={reportId} />
    </div>
  )
}
```

## User Permissions

### Post Comment
- **Requirement:** User must be authenticated
- **Who can do it:** All authenticated users

### Edit Comment
- **Requirement:** User must be authenticated
- **Who can do it:**
  - Comment author (can edit own comments)
  - Moderators (can edit any comment)
  - Admins (can edit any comment)

### Delete Comment
- **Requirement:** User must be authenticated
- **Who can do it:**
  - Comment author (can delete own comments)
  - Moderators (can delete any comment)
  - Admins (can delete any comment)

## Security Considerations

1. **Authentication:** All comment actions require authentication
2. **Authorization:** Edit and delete operations verify ownership or moderator/admin role
3. **Input Validation:** Content is validated (min 1 char, max 2000 chars)
4. **XSS Prevention:** Comment content should be sanitized before display
5. **Rate Limiting:** Consider implementing rate limiting to prevent spam (future enhancement)

## Future Enhancements

- **Threaded Replies:** Allow users to reply to specific comments
- **Like/Dislike:** Community voting on comments
- **Mentions:** @username mentions with notifications
- **Rich Text:** Support for markdown formatting
- **Spam Detection:** Automatic spam filtering
- **Moderation Queue:** Flag inappropriate comments for review
- **Real-time Updates:** WebSocket integration for live comment updates

## Testing

### Manual Testing Checklist

- [ ] User can post a comment when authenticated
- [ ] Unauthenticated users see login prompt
- [ ] User can edit their own comment
- [ ] User cannot edit others' comments
- [ ] Moderator can edit any comment
- [ ] User can delete their own comment
- [ ] Moderator can delete any comment
- [ ] Edited comments show "(edited)" indicator
- [ ] Time stamps display correctly
- [ ] Role badges display correctly (MOD, ADMIN)
- [ ] Comments load on page refresh
- [ ] Error messages display appropriately

### Airtable Setup Instructions

1. Go to your Airtable base
2. Create a new table named `Comments`
3. Add the following fields:
   - `report_id` (Single line text)
   - `author_id` (Single line text)
   - `author_username` (Single line text)
   - `author_role` (Single select: user, moderator, admin)
   - `content` (Long text)
   - `created_at` (Date with time)
   - `updated_at` (Date with time)
   - `is_edited` (Checkbox)
4. Optionally, link `report_id` to the Reports table for easier navigation
5. Set permissions appropriately in Airtable

## Troubleshooting

### Comments Not Loading
- Check that the Comments table exists in Airtable
- Verify AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set
- Check browser console for API errors
- Verify report ID is valid

### Cannot Post Comments
- Ensure user is authenticated (check session)
- Verify API endpoint is accessible
- Check network tab for request/response details
- Ensure content length is between 1-2000 characters

### Edit/Delete Not Working
- Verify user has permission (owner, moderator, or admin)
- Check that comment ID is valid
- Review API logs for errors

## Related Documentation

- [Project Plan](./PROJECT_PLAN.md) - Phase 6: Community Features
- [API Documentation](../src/app/api-docs/page.tsx) - Public API reference
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute
