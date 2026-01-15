# API Documentation

## Overview

The GrieferHub API provides programmatic access to griefer reports, user management, and moderation features. All API endpoints follow RESTful conventions and return JSON responses.

**Base URL**: `https://your-domain.com/api`
**Authentication**: JWT-based session tokens (NextAuth.js)
**Content-Type**: `application/json`

---

## Table of Contents

- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Public Endpoints](#public-endpoints)
  - [Get All Reports](#get-all-reports)
  - [Get Report by ID](#get-report-by-id)
  - [Search Reports](#search-reports)
- [Protected Endpoints](#protected-endpoints)
  - [Submit Report](#submit-report)
  - [Update Report](#update-report)
  - [Delete Report](#delete-report)
  - [Get User Reports](#get-user-reports)
- [Moderation Endpoints](#moderation-endpoints)
  - [Review Reports](#review-reports)
  - [Update Report Status](#update-report-status)
- [Admin Endpoints](#admin-endpoints)
  - [Manage Users](#manage-users)
  - [Update User Role](#update-user-role)
- [File Upload](#file-upload)
- [Webhooks](#webhooks-planned)
- [Code Examples](#code-examples)

---

## Authentication

### Overview

GrieferHub uses NextAuth.js with JWT sessions for authentication. To access protected endpoints, you need to:

1. Authenticate via the login endpoint or web interface
2. Include the session cookie in subsequent requests
3. For API clients, use session tokens in the Authorization header

### Login

**Endpoint**: `POST /api/auth/callback/credentials`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Get Session

**Endpoint**: `GET /api/auth/session`

**Response**:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "expires": "2026-02-01T00:00:00.000Z"
}
```

### Register

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "secure-password",
  "name": "Jane Smith"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "new-user-id",
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "role": "user"
  }
}
```

---

## Rate Limiting

To ensure fair usage and system stability, API requests are rate-limited:

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 300 requests per 15 minutes per user
- **File uploads**: 20 uploads per hour per user

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

When rate limited, you'll receive a `429 Too Many Requests` response:
```json
{
  "error": "Too many requests",
  "retryAfter": 300
}
```

---

## Error Handling

All errors follow a consistent format:

**Error Response Structure**:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional context"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTH_REQUIRED` | Authentication needed |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `FILE_TOO_LARGE` | Upload exceeds size limit |
| `INVALID_FILE_TYPE` | Unsupported file format |

---

## Public Endpoints

### Get All Reports

Retrieve a paginated list of all griefer reports.

**Endpoint**: `GET /api/reports`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `game` | string | No | Filter by game name |
| `status` | string | No | Filter by status (pending, verified, rejected, resolved) |
| `severity` | string | No | Filter by severity (low, medium, high, critical) |
| `search` | string | No | Search in username and description |
| `sortBy` | string | No | Sort field (createdAt, updatedAt, severity) |
| `order` | string | No | Sort order (asc, desc) |

**Example Request**:
```bash
curl "https://your-domain.com/api/reports?page=1&limit=10&game=Minecraft&status=verified"
```

**Response**:
```json
{
  "reports": [
    {
      "id": "rec123abc",
      "username": "GrieferX",
      "game": "Minecraft",
      "description": "Destroying builds and harassing players",
      "evidence": "https://res.cloudinary.com/...",
      "evidenceType": "video",
      "status": "verified",
      "severity": "high",
      "tags": ["griefing", "harassment"],
      "submittedBy": "user-id",
      "submittedByName": "Reporter Name",
      "createdAt": "2026-01-10T12:00:00.000Z",
      "updatedAt": "2026-01-11T15:30:00.000Z",
      "reviewedBy": "mod-id",
      "reviewedByName": "Moderator Name"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Report by ID

Retrieve detailed information about a specific report.

**Endpoint**: `GET /api/reports/[id]`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Report ID |

**Example Request**:
```bash
curl "https://your-domain.com/api/reports/rec123abc"
```

**Response**:
```json
{
  "id": "rec123abc",
  "username": "GrieferX",
  "game": "Minecraft",
  "serverId": "mc.example.com",
  "description": "Destroying builds and harassing players",
  "evidence": "https://res.cloudinary.com/...",
  "evidenceType": "video",
  "alternativeUrl": "https://youtube.com/watch?v=...",
  "status": "verified",
  "severity": "high",
  "tags": ["griefing", "harassment"],
  "submittedBy": "user-id",
  "submittedByName": "Reporter Name",
  "createdAt": "2026-01-10T12:00:00.000Z",
  "updatedAt": "2026-01-11T15:30:00.000Z",
  "reviewedBy": "mod-id",
  "reviewedByName": "Moderator Name",
  "reviewNotes": "Evidence verified, action taken"
}
```

### Search Reports

Advanced search across reports.

**Endpoint**: `GET /api/reports/search`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `fields` | string | No | Fields to search (username, description, game) |
| `page` | number | No | Page number |
| `limit` | number | No | Items per page |

**Example Request**:
```bash
curl "https://your-domain.com/api/reports/search?q=Minecraft&fields=game,description"
```

---

## Protected Endpoints

These endpoints require authentication. Include session cookie or JWT token.

### Submit Report

Submit a new griefer report.

**Endpoint**: `POST /api/reports`

**Authentication**: Required (User, Moderator, or Admin)

**Request Body**:
```json
{
  "username": "GrieferX",
  "game": "Minecraft",
  "serverId": "mc.example.com",
  "description": "Player destroyed multiple builds and used offensive language",
  "evidence": "cloudinary-url-or-file-id",
  "evidenceType": "video",
  "alternativeUrl": "https://youtube.com/watch?v=...",
  "severity": "high",
  "tags": ["griefing", "harassment", "toxic"]
}
```

**Field Validation**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `username` | string | Yes | 2-50 characters |
| `game` | string | Yes | 2-100 characters |
| `serverId` | string | No | Max 200 characters |
| `description` | string | Yes | 10-2000 characters |
| `evidence` | string | No | Valid URL or Cloudinary ID |
| `evidenceType` | string | No | image, video, or url |
| `alternativeUrl` | string | No | Valid URL |
| `severity` | string | Yes | low, medium, high, or critical |
| `tags` | array | No | Max 10 tags, each 2-30 chars |

**Example Request**:
```bash
curl -X POST "https://your-domain.com/api/reports" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "username": "GrieferX",
    "game": "Minecraft",
    "description": "Destroyed builds",
    "severity": "high",
    "tags": ["griefing"]
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "report": {
    "id": "rec456def",
    "username": "GrieferX",
    "game": "Minecraft",
    "status": "pending",
    "severity": "high",
    "submittedBy": "user-id",
    "createdAt": "2026-01-12T10:00:00.000Z"
  }
}
```

### Update Report

Update an existing report (own reports only, or any report for moderators/admins).

**Endpoint**: `PATCH /api/reports/[id]`

**Authentication**: Required (Owner, Moderator, or Admin)

**Request Body**: Same fields as Submit Report (all optional)

**Example Request**:
```bash
curl -X PATCH "https://your-domain.com/api/reports/rec456def" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "severity": "critical",
    "description": "Updated description with more details"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Report updated successfully",
  "report": {
    "id": "rec456def",
    "updatedAt": "2026-01-12T11:00:00.000Z"
  }
}
```

### Delete Report

Delete a report (own reports only, or any report for admins).

**Endpoint**: `DELETE /api/reports/[id]`

**Authentication**: Required (Owner or Admin)

**Example Request**:
```bash
curl -X DELETE "https://your-domain.com/api/reports/rec456def" \
  -H "Cookie: next-auth.session-token=..."
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

### Get User Reports

Retrieve all reports submitted by the authenticated user.

**Endpoint**: `GET /api/reports/user`

**Authentication**: Required

**Query Parameters**: Same pagination and filtering as Get All Reports

**Example Request**:
```bash
curl "https://your-domain.com/api/reports/user?page=1&limit=20" \
  -H "Cookie: next-auth.session-token=..."
```

---

## Moderation Endpoints

These endpoints require moderator or admin role.

### Review Reports

Get all reports for moderation review.

**Endpoint**: `GET /api/mod/reports`

**Authentication**: Required (Moderator or Admin)

**Query Parameters**: Same as Get All Reports, plus:
| Parameter | Type | Description |
|-----------|------|-------------|
| `unreviewed` | boolean | Show only pending reports |
| `reviewer` | string | Filter by reviewer ID |

### Update Report Status

Change the status of a report.

**Endpoint**: `POST /api/mod/reports/[id]/status`

**Authentication**: Required (Moderator or Admin)

**Request Body**:
```json
{
  "status": "verified",
  "reviewNotes": "Evidence confirmed, appropriate action taken"
}
```

**Valid Status Values**:
- `pending`: Initial status (default)
- `verified`: Report confirmed and validated
- `rejected`: Report invalid or insufficient evidence
- `resolved`: Action taken, case closed

**Example Request**:
```bash
curl -X POST "https://your-domain.com/api/mod/reports/rec123abc/status" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "status": "verified",
    "reviewNotes": "Video evidence confirmed"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Report status updated",
  "report": {
    "id": "rec123abc",
    "status": "verified",
    "reviewedBy": "mod-id",
    "reviewedAt": "2026-01-12T12:00:00.000Z"
  }
}
```

---

## Admin Endpoints

These endpoints require admin role.

### Manage Users

Get all users in the system.

**Endpoint**: `GET /api/admin/users`

**Authentication**: Required (Admin)

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `role` | string | Filter by role (user, moderator, admin) |
| `search` | string | Search by name or email |

**Example Request**:
```bash
curl "https://your-domain.com/api/admin/users?page=1&limit=50" \
  -H "Cookie: next-auth.session-token=..."
```

**Response**:
```json
{
  "users": [
    {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "lastLogin": "2026-01-12T08:00:00.000Z",
      "reportCount": 5,
      "verifiedReports": 3
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 125
  }
}
```

### Update User Role

Change a user's role.

**Endpoint**: `PATCH /api/admin/users/[userId]/role`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "role": "moderator"
}
```

**Example Request**:
```bash
curl -X PATCH "https://your-domain.com/api/admin/users/user-123/role" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"role": "moderator"}'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "id": "user-123",
    "role": "moderator",
    "updatedAt": "2026-01-12T13:00:00.000Z"
  }
}
```

---

## File Upload

Upload evidence files (images or videos).

**Endpoint**: `POST /api/upload`

**Authentication**: Required

**Content-Type**: `multipart/form-data`

**Request Body**:
- `file`: File to upload (image or video)

**File Constraints**:
- **Images**: Max 10MB, formats: JPG, PNG, GIF, WEBP
- **Videos**: Max 100MB, formats: MP4, WEBM, MOV, AVI

**Example Request** (with curl):
```bash
curl -X POST "https://your-domain.com/api/upload" \
  -H "Cookie: next-auth.session-token=..." \
  -F "file=@/path/to/evidence.mp4"
```

**Example Request** (JavaScript):
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});

const data = await response.json();
```

**Response** (200 OK):
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/grieferhub/video/upload/v123/evidence.mp4",
  "publicId": "evidence_abc123",
  "format": "mp4",
  "resourceType": "video",
  "secure_url": "https://res.cloudinary.com/grieferhub/video/upload/v123/evidence.mp4"
}
```

**Error Responses**:

File too large (413):
```json
{
  "error": "File size exceeds limit",
  "maxSize": "100MB",
  "receivedSize": "150MB"
}
```

Invalid file type (400):
```json
{
  "error": "Invalid file type",
  "allowed": ["mp4", "jpg", "png", "webm"],
  "received": "exe"
}
```

---

## Webhooks (Planned)

Webhooks will be available in Phase 6 to notify external systems of events.

### Planned Events

- `report.created`: New report submitted
- `report.updated`: Report updated
- `report.status_changed`: Report status changed
- `user.registered`: New user registered
- `user.role_changed`: User role updated

### Webhook Payload Example

```json
{
  "event": "report.status_changed",
  "timestamp": "2026-01-12T14:00:00.000Z",
  "data": {
    "reportId": "rec123abc",
    "oldStatus": "pending",
    "newStatus": "verified",
    "changedBy": "mod-id"
  }
}
```

---

## Code Examples

### JavaScript / TypeScript

**Fetch all reports**:
```typescript
const response = await fetch('https://your-domain.com/api/reports?page=1&limit=20');
const data = await response.json();

console.log(data.reports);
```

**Submit a report (authenticated)**:
```typescript
const reportData = {
  username: 'GrieferX',
  game: 'Minecraft',
  description: 'Destroyed builds',
  severity: 'high',
  tags: ['griefing']
};

const response = await fetch('https://your-domain.com/api/reports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify(reportData)
});

const result = await response.json();
```

**Upload file with progress**:
```typescript
const formData = new FormData();
formData.append('file', file);

const xhr = new XMLHttpRequest();

xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const percentComplete = (e.loaded / e.total) * 100;
    console.log(`Upload: ${percentComplete}%`);
  }
});

xhr.addEventListener('load', () => {
  const response = JSON.parse(xhr.responseText);
  console.log('Upload complete:', response.url);
});

xhr.open('POST', 'https://your-domain.com/api/upload');
xhr.send(formData);
```

### Python

**Get all reports**:
```python
import requests

response = requests.get('https://your-domain.com/api/reports', params={
    'page': 1,
    'limit': 20,
    'game': 'Minecraft'
})

data = response.json()
for report in data['reports']:
    print(f"{report['username']} - {report['game']}")
```

**Submit a report**:
```python
import requests

session = requests.Session()
# Authenticate first
login = session.post('https://your-domain.com/api/auth/callback/credentials', json={
    'email': 'user@example.com',
    'password': 'password'
})

# Submit report
report_data = {
    'username': 'GrieferX',
    'game': 'Minecraft',
    'description': 'Destroyed builds',
    'severity': 'high',
    'tags': ['griefing']
}

response = session.post('https://your-domain.com/api/reports', json=report_data)
print(response.json())
```

### cURL

**Get reports with filters**:
```bash
curl -X GET "https://your-domain.com/api/reports?game=Minecraft&status=verified&page=1"
```

**Submit report (authenticated)**:
```bash
curl -X POST "https://your-domain.com/api/reports" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "username": "GrieferX",
    "game": "Minecraft",
    "description": "Destroyed builds",
    "severity": "high"
  }'
```

**Upload file**:
```bash
curl -X POST "https://your-domain.com/api/upload" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@evidence.mp4"
```

---

## Postman Collection

A Postman collection with all endpoints is available for download:

**[Download GrieferHub.postman_collection.json](#)** (coming soon)

The collection includes:
- Pre-configured requests for all endpoints
- Environment variables for easy switching between dev/prod
- Example requests and responses
- Authentication setup

---

## API Versioning

Currently, the API is at version 1 (implied in all endpoints). Future versions will be introduced as:

- `GET /api/v2/reports` (when breaking changes are introduced)
- Version 1 will be maintained for backward compatibility
- Deprecation notices will be provided 6 months before sunset

---

## Support

For API-related questions:

- **Documentation**: Check this guide and [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Issues**: Open a GitHub issue with the `api` label
- **Community**: Join our community discussions
- **Email**: api-support@grieferhub.com

---

**Last Updated**: January 2026
**API Version**: 1.0
**Status**: Active Development (Phase 5 Complete)
