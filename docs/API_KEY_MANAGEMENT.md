# API Key Management System

**Status**: ✅ Complete
**Phase**: 8 - Integrations
**Last Updated**: 2026-01-21

---

## 📋 Overview

The API Key Management system allows users to generate API keys for programmatic access to GrieferHub. This enables external applications, scripts, and integrations to interact with the platform securely.

### Key Features

- Generate multiple API keys per user
- Scope-based permissions (read/write access control)
- Customizable rate limiting per key
- Optional expiration dates
- Usage tracking and statistics
- Secure key hashing (keys visible only once)
- Easy revocation

---

## 🗄️ Database Schema

### Airtable `API_Keys` Table

```
Field Name      Type              Description
─────────────────────────────────────────────────────────
id              Auto-number       Unique identifier
user_id         Link to Users     Key owner
name            Text              User-defined name
key_prefix      Text              First 12 chars for display (e.g., "ghk_abcd...")
hashed_key      Text              Bcrypt hashed full key
scopes          Multiple Select   Permissions array
rate_limit      Number            Requests per minute (1-1000)
usage_count     Number            Total API calls made
last_used       Date              Last request timestamp
expires_at      Date              Optional expiration date
is_active       Checkbox          Active/revoked status
created_at      Date              Creation timestamp
```

### Available Scopes

| Scope | Description |
|-------|-------------|
| `reports:read` | Read reports (default) |
| `reports:write` | Create and update reports |
| `reports:delete` | Delete reports |
| `comments:read` | Read comments |
| `comments:write` | Create and edit comments |
| `users:read` | Read user profiles |

---

## 🔌 API Endpoints

### 1. Generate API Key

**Endpoint**: `POST /api/keys`

**Authentication**: Required (user session)

**Rate Limit**: 100 requests/minute

**Request Body**:
```typescript
{
  name: string                    // Required: Display name (1-100 chars)
  scopes?: ApiKeyScope[]          // Optional: Permissions (default: ['reports:read'])
  rateLimit?: number              // Optional: Requests/minute (1-1000, default: 100)
  expiresAt?: string              // Optional: ISO date string
}
```

**Success Response** (201):
```typescript
{
  success: true,
  data: {
    id: string
    userId: string
    name: string
    key: string                   // ⚠️ ONLY RETURNED ONCE
    keyPrefix: string             // "ghk_abcd..." for future reference
    scopes: ApiKeyScope[]
    rateLimit: number
    usageCount: 0
    lastUsed: null
    expiresAt: Date | null
    isActive: true
    createdAt: Date
  },
  message: "API key created successfully. Please save the key now - you will not be able to see it again!"
}
```

**Error Responses**:
- `400` - Validation error (missing name, invalid scopes, etc.)
- `401` - Not authenticated
- `429` - Rate limit exceeded
- `500` - Server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/keys \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "Production Bot",
    "scopes": ["reports:read", "reports:write"],
    "rateLimit": 200,
    "expiresAt": "2026-12-31T23:59:59Z"
  }'
```

---

### 2. List API Keys

**Endpoint**: `GET /api/keys`

**Authentication**: Required (user session)

**Rate Limit**: 100 requests/minute

**Success Response** (200):
```typescript
{
  success: true,
  data: [
    {
      id: string
      userId: string
      name: string
      keyPrefix: string           // "ghk_abcd..." (NOT full key)
      scopes: ApiKeyScope[]
      rateLimit: number
      usageCount: number
      lastUsed: Date | null
      expiresAt: Date | null
      isActive: boolean
      createdAt: Date
    }
  ]
}
```

**Example**:
```bash
curl http://localhost:3000/api/keys \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

### 3. Get API Key Details

**Endpoint**: `GET /api/keys/[id]`

**Authentication**: Required (must own key or be admin)

**Rate Limit**: 100 requests/minute

**Success Response** (200):
```typescript
{
  success: true,
  data: {
    id: string
    userId: string
    name: string
    keyPrefix: string
    scopes: ApiKeyScope[]
    rateLimit: number
    usageCount: number
    lastUsed: Date | null
    expiresAt: Date | null
    isActive: boolean
    createdAt: Date
  }
}
```

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized (not owner or admin)
- `404` - Key not found

---

### 4. Revoke API Key

**Endpoint**: `DELETE /api/keys/[id]`

**Authentication**: Required (must own key or be admin)

**Rate Limit**: 100 requests/minute

**Success Response** (200):
```typescript
{
  success: true,
  message: "API key revoked successfully"
}
```

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized (not owner or admin)
- `404` - Key not found
- `500` - Server error

**Example**:
```bash
curl -X DELETE http://localhost:3000/api/keys/recABC123 \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

## 🔐 Using API Keys

### Authentication Methods

API keys can be provided in three ways:

#### 1. Authorization Header (Recommended)
```bash
curl http://localhost:3000/api/public/reports \
  -H "Authorization: Bearer ghk_your_full_key_here"
```

#### 2. Custom Header
```bash
curl http://localhost:3000/api/public/reports \
  -H "X-API-Key: ghk_your_full_key_here"
```

#### 3. Query Parameter (Not Recommended for Production)
```bash
curl "http://localhost:3000/api/public/reports?api_key=ghk_your_full_key_here"
```

### Middleware Integration

Use the `authenticateApiKey` middleware in API endpoints:

```typescript
import { authenticateApiKey } from '@/lib/middleware/apiKeyAuth'

export async function GET(request: NextRequest) {
  // Authenticate with required scopes
  const { error, apiKey, userId } = await authenticateApiKey(request, [
    'reports:read',
  ])

  if (error) return error

  // Use userId for queries
  const reports = await AirtableService.getReportsByUserId(userId!)

  return NextResponse.json({ success: true, data: reports })
}
```

---

## 🔒 Security Features

### 1. Key Hashing

- Keys are hashed with bcrypt (10 rounds) before storage
- Original key is only returned once during creation
- Database stores only the hash (cannot be reversed)

### 2. Key Format

- Prefix: `ghk_` (GrieferHub Key)
- Random: 64 hex characters
- Total length: 68 characters
- Example: `ghk_a1b2c3d4e5f6...` (64 more chars)

### 3. Verification Process

1. Extract key from request headers/params
2. Query active keys from database
3. Compare provided key against each hash
4. Update usage statistics on match
5. Check expiration and active status

### 4. Rate Limiting

- Per-key rate limits (configurable)
- Independent from IP-based limits
- Default: 100 requests/minute
- Range: 1-1000 requests/minute
- Headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 5. Scope Validation

- Keys can only access endpoints matching their scopes
- Read-only keys cannot write data
- Scope checking built into middleware

---

## 📊 Usage Tracking

Each API key tracks:

- **Usage Count**: Total number of requests made
- **Last Used**: Timestamp of most recent request
- **Creation Date**: When key was generated
- **Expiration**: Optional expiration date
- **Active Status**: Whether key is active or revoked

### Analytics (Future Enhancement)

Planned features:
- Request history over time
- Endpoint usage breakdown
- Error rate tracking
- Geographic distribution

---

## 🎨 Frontend Integration

### API Key Dashboard Component

```typescript
// Example: Display user's API keys
import { useState, useEffect } from 'react'

export function ApiKeyDashboard() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/keys')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setKeys(data.data)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2>API Keys</h2>
      {keys.map((key) => (
        <div key={key.id}>
          <strong>{key.name}</strong>
          <code>{key.keyPrefix}...</code>
          <span>Rate Limit: {key.rateLimit}/min</span>
          <span>Usage: {key.usageCount}</span>
          <button onClick={() => revokeKey(key.id)}>Revoke</button>
        </div>
      ))}
    </div>
  )
}
```

### Generate Key Form

```typescript
export function GenerateKeyForm() {
  const [name, setName] = useState('')
  const [scopes, setScopes] = useState(['reports:read'])
  const [generatedKey, setGeneratedKey] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, scopes }),
    })

    const data = await res.json()
    if (data.success) {
      setGeneratedKey(data.data.key)
      alert('⚠️ Save this key now! You will not see it again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Key name"
        required
      />

      <select multiple value={scopes} onChange={(e) => setScopes([...e.target.selectedOptions].map(o => o.value))}>
        <option value="reports:read">Read Reports</option>
        <option value="reports:write">Write Reports</option>
        <option value="comments:read">Read Comments</option>
        <option value="comments:write">Write Comments</option>
      </select>

      <button type="submit">Generate Key</button>

      {generatedKey && (
        <div className="alert">
          <strong>Your API Key (save it now!):</strong>
          <code>{generatedKey}</code>
        </div>
      )}
    </form>
  )
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Generate API key with default scopes
- [ ] Generate API key with custom scopes
- [ ] Generate API key with expiration date
- [ ] List all user's API keys
- [ ] View specific API key details
- [ ] Revoke an API key
- [ ] Use API key to access endpoint
- [ ] Verify scope enforcement
- [ ] Test rate limiting per key
- [ ] Test expired key rejection
- [ ] Test revoked key rejection
- [ ] Verify usage tracking updates

### Test API Key Creation

```bash
# Create test key
KEY_RESPONSE=$(curl -s -X POST http://localhost:3000/api/keys \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=$SESSION_TOKEN" \
  -d '{"name":"Test Key","scopes":["reports:read"]}')

# Extract key
API_KEY=$(echo $KEY_RESPONSE | jq -r '.data.key')

# Test using key
curl http://localhost:3000/api/public/reports \
  -H "Authorization: Bearer $API_KEY"
```

---

## 📝 Configuration

### Required Airtable Setup

1. Create `API_Keys` table in Airtable
2. Add all fields listed in schema
3. Configure field types correctly
4. Link to `Users` table

### Environment Variables

No additional environment variables needed beyond standard Airtable config:

```env
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=your_base_id
```

---

## 🚀 Production Considerations

### Security Best Practices

1. **Always use HTTPS** in production
2. **Rotate keys regularly** (encourage users to regenerate)
3. **Monitor usage** for suspicious activity
4. **Implement alerting** for unusual patterns
5. **Log key usage** for audit trails

### Rate Limiting

- Default in-memory limiter works for single-server deployments
- For distributed systems, implement Redis-based limiter
- Consider tiered limits based on user role/plan

### Key Storage

- Keys are hashed with bcrypt (cannot be reversed)
- No plain-text keys in database
- Verification requires comparing against all hashes

### Scaling Considerations

- Key verification queries increase with key count
- Consider caching active keys
- Implement key ID prefix for faster lookup
- Add indexes on `user_id` and `is_active` fields

---

## 🔮 Future Enhancements

### Planned Features

1. **Key Rotation**
   - Auto-generate new key before expiration
   - Deprecation period for old keys

2. **Advanced Scopes**
   - Fine-grained permissions (e.g., `reports:own:write`)
   - Resource-specific scopes

3. **Usage Analytics**
   - Dashboard with charts
   - Export usage reports
   - Cost tracking (for paid tiers)

4. **Webhooks**
   - Key events notifications
   - Usage threshold alerts

5. **IP Whitelisting**
   - Restrict keys to specific IPs
   - Enhanced security for sensitive operations

---

## 📚 Related Documentation

- [Backend Launch Readiness](./BACKEND_LAUNCH_READINESS.md)
- [API Documentation](../API_DOCUMENTATION.md)
- [Security Guide](../SECURITY.md)

---

## 💡 Usage Examples

### Example 1: Read-Only Bot

```javascript
// Script to fetch and display recent reports
const API_KEY = 'ghk_your_key_here'

async function getRecentReports() {
  const response = await fetch('https://grieferhub.com/api/public/reports', {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  })

  const data = await response.json()
  console.log('Recent reports:', data.data)
}

getRecentReports()
```

### Example 2: Auto-Report Submission

```javascript
// Automated report submission from game server
const API_KEY = 'ghk_your_key_here'

async function submitReport(grieferName, evidence) {
  const response = await fetch('https://grieferhub.com/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      grieferName,
      game: 'Minecraft',
      description: 'Auto-reported by server plugin',
      evidenceUrl: evidence,
      severity: 'Medium',
    }),
  })

  return response.json()
}
```

### Example 3: Python Integration

```python
import requests

API_KEY = 'ghk_your_key_here'
BASE_URL = 'https://grieferhub.com/api'

def get_reports(game=None):
    headers = {'Authorization': f'Bearer {API_KEY}'}
    params = {'game': game} if game else {}

    response = requests.get(f'{BASE_URL}/public/reports',
                           headers=headers,
                           params=params)
    return response.json()

# Get all Minecraft reports
minecraft_reports = get_reports('Minecraft')
print(f"Found {len(minecraft_reports['data'])} reports")
```

---

**Status**: ✅ Implementation Complete

The API Key Management system is fully implemented and ready for use. All endpoints are functional, secure, and documented.

**Next Steps**: Create frontend UI for API key management dashboard.
