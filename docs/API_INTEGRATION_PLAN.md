# API Integration Plan

**Version**: 1.0
**Date**: 2026-01-16
**Status**: Planning Phase
**Target**: Phase 8 (Q3 2026)

---

## Overview

This document outlines the strategy for integrating GrieferHub with external services, third-party platforms, and game servers. The goal is to create a comprehensive ecosystem that enables seamless data exchange and automation.

---

## Integration Categories

### 1. Gaming Platforms
### 2. Communication Platforms
### 3. Game Server Integrations
### 4. Cloud Services
### 5. Analytics & Monitoring
### 6. Authentication Providers

---

## 1. Gaming Platforms Integration

### Steam API

**Priority**: HIGH
**Timeline**: Q3 2026 (2 weeks)
**Complexity**: Medium

#### Features
- Link Steam profiles to GrieferHub accounts
- Fetch Steam user data (playtime, VAC bans, game library)
- Verify game ownership for report validation
- Display Steam profile badges on user profiles

#### Implementation

**Endpoints Needed**:
```typescript
// Steam Integration
GET  /api/integrations/steam/auth          // OAuth flow
GET  /api/integrations/steam/profile       // Get Steam profile
POST /api/integrations/steam/link          // Link Steam account
DELETE /api/integrations/steam/unlink      // Unlink Steam account
GET  /api/integrations/steam/games         // Get owned games
GET  /api/integrations/steam/bans          // Check VAC/game bans
```

**Data Model**:
```typescript
interface SteamIntegration {
    userId: string              // GrieferHub user ID
    steamId: string             // Steam ID64
    steamUsername: string       // Steam display name
    profileUrl: string          // Steam profile URL
    avatarUrl: string          // Steam avatar
    vacBanned: boolean         // VAC ban status
    gameBanCount: number       // Number of game bans
    daysSinceLastBan: number   // Days since last ban
    ownedGames: SteamGame[]    // List of owned games
    linkedAt: Date             // Link timestamp
    lastSynced: Date           // Last data sync
}

interface SteamGame {
    appId: number              // Steam app ID
    name: string               // Game name
    playtime: number           // Total playtime (minutes)
    lastPlayed: Date          // Last played timestamp
}
```

**Security Considerations**:
- Use Steam Web API key stored in environment variables
- Implement OAuth 2.0 for user authorization
- Rate limit: 100,000 calls per day (Steam's limit)
- Cache Steam data for 24 hours to reduce API calls

**Dependencies**:
- Steam Web API key
- `steamapi` npm package or custom implementation
- Redis for caching (optional but recommended)

---

### Discord Integration

**Priority**: HIGH
**Timeline**: Q3 2026 (3 weeks)
**Complexity**: Medium-High

#### Features
- Discord bot for server notifications
- User account linking
- Report alerts in Discord servers
- Griefer watchlist notifications
- Moderation commands via Discord

#### Implementation

**Discord Bot Commands**:
```
/report [griefer] [game]      - Submit report from Discord
/search [griefer]             - Search for griefer records
/status [report-id]           - Check report status
/subscribe [griefer]          - Get alerts for specific griefer
/stats                        - View server statistics
/verify [report-id]           - Moderator: Verify report
/reject [report-id]           - Moderator: Reject report
```

**Endpoints**:
```typescript
POST /api/integrations/discord/webhook     // Discord webhook receiver
POST /api/integrations/discord/link        // Link Discord account
GET  /api/integrations/discord/servers     // List connected servers
POST /api/integrations/discord/notify      // Send notification to Discord
```

**Data Model**:
```typescript
interface DiscordIntegration {
    userId: string              // GrieferHub user ID
    discordId: string           // Discord user ID
    discordUsername: string     // Discord username#0000
    discordAvatar: string       // Discord avatar URL
    guilds: DiscordGuild[]      // Servers user is in
    linkedAt: Date
}

interface DiscordGuild {
    guildId: string            // Discord server ID
    guildName: string          // Server name
    notificationsEnabled: boolean
    webhookUrl?: string        // Webhook for notifications
    roles: string[]            // User roles in server
}

interface DiscordNotification {
    type: 'report_verified' | 'comment_added' | 'griefer_alert'
    title: string
    description: string
    color: number              // Embed color (hex)
    fields: DiscordField[]
    thumbnail?: string
    footer?: string
}
```

**Security**:
- Discord bot token in environment variables
- Webhook signature verification
- Role-based permissions for bot commands
- Rate limiting per server

**Bot Permissions**:
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Use Slash Commands

---

### Twitch Integration

**Priority**: MEDIUM
**Timeline**: Q4 2026 (2 weeks)
**Complexity**: Medium

#### Features
- Link Twitch accounts
- Clip evidence integration
- Stream griefer alerts for streamers
- VOD timestamp linking

#### Implementation

**Endpoints**:
```typescript
GET  /api/integrations/twitch/auth         // OAuth flow
POST /api/integrations/twitch/link         // Link account
GET  /api/integrations/twitch/clips        // Fetch user clips
POST /api/integrations/twitch/submit-clip  // Submit clip as evidence
```

**Use Cases**:
1. Streamers can submit clips directly as evidence
2. Auto-detect griefers from stream chat
3. Display streamer badge on profiles
4. Alert streamers when reported griefer joins their game

---

## 2. Game Server Integrations

### Minecraft Server Plugin

**Priority**: HIGH
**Timeline**: Q3 2026 (4 weeks)
**Complexity**: High

#### Features
- In-game `/griefer report` command
- Auto-kick known griefers on join
- Sync bans with GrieferHub database
- Server dashboard integration

#### Architecture

**Plugin Components**:
```
GrieferHubPlugin/
├── src/main/java/
│   ├── GrieferHubPlugin.java       // Main plugin class
│   ├── commands/
│   │   ├── ReportCommand.java      // /griefer report
│   │   ├── CheckCommand.java       // /griefer check
│   │   └── SyncCommand.java        // /griefer sync
│   ├── listeners/
│   │   ├── PlayerJoinListener.java // Check on join
│   │   └── ChatListener.java       // Monitor chat
│   ├── api/
│   │   └── GrieferHubAPI.java      // API client
│   └── config/
│       └── PluginConfig.java       // Configuration
├── resources/
│   ├── plugin.yml                  // Plugin metadata
│   └── config.yml                  // Default config
└── pom.xml                         // Maven build
```

**API Integration**:
```java
public class GrieferHubAPI {
    private String apiKey;
    private String baseUrl = "https://grieferhub.com/api";

    // Check if player is reported griefer
    public GrieferStatus checkPlayer(String username) {
        // GET /api/public/griefers/check?username=...
    }

    // Submit report from in-game
    public void submitReport(ReportData report) {
        // POST /api/integrations/minecraft/report
    }

    // Sync ban list
    public List<String> getBanList(String serverId) {
        // GET /api/integrations/minecraft/bans?server=...
    }
}
```

**Server Configuration**:
```yaml
# config.yml
grieferhub:
  api-key: "your-api-key-here"
  server-id: "minecraft-server-001"
  auto-kick: true
  kick-message: "You have been flagged in GrieferHub database"
  notify-admins: true
  sync-interval: 300 # seconds

  actions:
    verified-griefer:
      kick: true
      ban: false
      notify: true
    high-severity:
      kick: true
      ban: true
```

**Endpoints**:
```typescript
GET  /api/integrations/minecraft/check      // Check player status
POST /api/integrations/minecraft/report     // Submit report
GET  /api/integrations/minecraft/bans       // Get ban list
POST /api/integrations/minecraft/sync       // Sync player data
GET  /api/integrations/minecraft/config     // Get server config
```

---

### Rust Server Plugin

**Priority**: MEDIUM
**Timeline**: Q4 2026 (4 weeks)
**Complexity**: High

#### Features
- Oxide/uMod plugin support
- In-game report system
- Auto-ban integration
- Chat monitoring

**Plugin Structure** (Similar to Minecraft but for Rust/Oxide):
```csharp
// GrieferHubPlugin.cs
namespace Oxide.Plugins
{
    [Info("GrieferHub", "YourName", "1.0.0")]
    class GrieferHubPlugin : RustPlugin
    {
        // Plugin implementation
    }
}
```

---

## 3. Public API Expansion

### API Key Management System

**Priority**: HIGH
**Timeline**: Q2 2026 (2 weeks)
**Complexity**: Medium

#### Features
- Generate API keys for users
- Rate limiting per key
- Usage analytics
- Key rotation
- Scope-based permissions

#### Implementation

**Data Model**:
```typescript
interface ApiKey {
    id: string                 // Key ID
    userId: string             // Owner user ID
    key: string                // API key (hashed)
    name: string               // Key name/description
    scopes: ApiScope[]         // Permissions
    rateLimit: number          // Requests per minute
    usageCount: number         // Total requests made
    lastUsed: Date            // Last usage timestamp
    expiresAt?: Date          // Optional expiration
    createdAt: Date
    isActive: boolean
}

type ApiScope =
    | 'reports:read'          // Read reports
    | 'reports:write'         // Create reports
    | 'comments:read'         // Read comments
    | 'comments:write'        // Write comments
    | 'users:read'            // Read user data
    | 'admin:all'             // Full access

interface ApiKeyUsage {
    apiKeyId: string
    endpoint: string
    method: string
    statusCode: number
    responseTime: number
    timestamp: Date
    ip: string
    userAgent: string
}
```

**Endpoints**:
```typescript
GET    /api/keys              // List user's API keys
POST   /api/keys              // Create new API key
DELETE /api/keys/:id          // Revoke API key
GET    /api/keys/:id/usage    // Get usage stats
POST   /api/keys/:id/rotate   // Rotate key
PUT    /api/keys/:id/scopes   // Update scopes
```

**Rate Limiting Tiers**:
```typescript
const RATE_LIMITS = {
    free: {
        requestsPerMinute: 60,
        requestsPerDay: 1000,
    },
    pro: {
        requestsPerMinute: 600,
        requestsPerDay: 50000,
    },
    enterprise: {
        requestsPerMinute: 6000,
        requestsPerDay: 1000000,
    },
}
```

---

### GraphQL API

**Priority**: MEDIUM
**Timeline**: Q3 2026 (3 weeks)
**Complexity**: Medium-High

#### Why GraphQL?
- More efficient data fetching
- Reduce over-fetching
- Better for mobile apps
- Self-documenting with introspection

#### Schema Example:
```graphql
type Query {
    report(id: ID!): Report
    reports(
        filter: ReportFilter
        limit: Int = 20
        offset: Int = 0
    ): ReportConnection!

    user(username: String!): User
    griefer(name: String!): Griefer

    comments(reportId: ID!): [Comment!]!
}

type Mutation {
    createReport(input: CreateReportInput!): Report!
    updateReport(id: ID!, input: UpdateReportInput!): Report!
    deleteReport(id: ID!): Boolean!

    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!
}

type Subscription {
    reportCreated: Report!
    reportUpdated(id: ID!): Report!
    commentAdded(reportId: ID!): Comment!
}

type Report {
    id: ID!
    griefer: Griefer!
    reporter: User!
    game: String!
    description: String!
    evidence: String!
    status: ReportStatus!
    severity: Severity!
    comments: [Comment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
}
```

---

## 4. Webhook System

**Priority**: MEDIUM
**Timeline**: Q2 2026 (2 weeks)
**Complexity**: Medium

### Features
- Subscribe to events via webhooks
- Configurable event types
- Retry mechanism for failed deliveries
- Webhook signature verification

### Event Types:
```typescript
type WebhookEvent =
    | 'report.created'
    | 'report.verified'
    | 'report.rejected'
    | 'comment.created'
    | 'griefer.flagged'       // Multiple verified reports
    | 'user.banned'

interface WebhookSubscription {
    id: string
    userId: string
    url: string              // Webhook endpoint
    events: WebhookEvent[]   // Subscribed events
    secret: string           // For signature verification
    isActive: boolean
    createdAt: Date
}

interface WebhookDelivery {
    subscriptionId: string
    event: WebhookEvent
    payload: any
    attempt: number
    statusCode?: number
    deliveredAt?: Date
    error?: string
}
```

### Payload Example:
```json
{
  "event": "report.verified",
  "timestamp": "2026-01-16T10:30:00Z",
  "data": {
    "reportId": "rec123...",
    "griefer": "PlayerName",
    "game": "Minecraft",
    "severity": "High",
    "verifiedBy": "ModeratorName"
  }
}
```

---

## 5. Rate Limiting Implementation

### Strategy

**Global Limits**:
- Unauthenticated: 60 requests/minute per IP
- Authenticated: 300 requests/minute per user
- API Key: Based on tier (see API Key section)

**Endpoint-Specific Limits**:
```typescript
const ENDPOINT_LIMITS = {
    'POST /api/reports': { limit: 10, window: '1h' },
    'POST /api/comments': { limit: 100, window: '1h' },
    'GET /api/reports': { limit: 300, window: '1h' },
}
```

### Implementation

**Middleware**:
```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export const createRateLimiter = (options: {
    windowMs: number
    max: number
    message?: string
}) => {
    return rateLimit({
        windowMs: options.windowMs,
        max: options.max,
        message: options.message || 'Too many requests',
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
            client: redis,
            prefix: 'rl:',
        }),
    })
}

// Usage
export const apiLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
})

export const strictLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
})
```

---

## 6. Analytics Integration

### Google Analytics 4

**Priority**: MEDIUM
**Timeline**: Q2 2026 (1 week)

**Events to Track**:
- Report submitted
- Report viewed
- User registration
- Comment posted
- Search performed
- Filter applied

### Mixpanel / PostHog

**Priority**: LOW
**Timeline**: Q4 2026

**Advanced Analytics**:
- User journey tracking
- Funnel analysis
- Cohort analysis
- A/B testing framework

---

## 7. CDN & Asset Delivery

### Cloudinary (Current)

**Status**: ✅ Implemented
**Usage**: Image and video evidence

### Cloudflare CDN

**Priority**: MEDIUM
**Timeline**: Q3 2026

**Benefits**:
- Global content delivery
- DDoS protection
- SSL/TLS
- Caching layer
- Bot protection

---

## Implementation Roadmap

### Q2 2026 (Current)
- [x] Comment System
- [x] User Profiles (In Progress)
- [ ] API Key Management
- [ ] Rate Limiting
- [ ] Webhook System

### Q3 2026
- [ ] Steam Integration
- [ ] Discord Bot
- [ ] Minecraft Plugin
- [ ] GraphQL API
- [ ] Cloudflare CDN

### Q4 2026
- [ ] Twitch Integration
- [ ] Rust Plugin
- [ ] Advanced Analytics
- [ ] Mobile API optimization

---

## Security Considerations

### API Security Checklist

- [ ] HTTPS enforced for all endpoints
- [ ] API key authentication
- [ ] OAuth 2.0 for user authorization
- [ ] Rate limiting per endpoint
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Webhook signature verification
- [ ] API versioning (/api/v1, /api/v2)
- [ ] Error handling (don't leak sensitive info)
- [ ] Audit logging
- [ ] IP whitelisting for sensitive endpoints

### Data Privacy

- GDPR compliance for EU users
- CCPA compliance for California users
- User data export functionality
- Right to deletion (account removal)
- Consent management
- Cookie policy
- Privacy policy

---

## Testing Strategy

### API Testing
- Unit tests for all endpoints
- Integration tests for third-party APIs
- Load testing (target: 1000 req/sec)
- Security penetration testing
- Mock external services in tests

### Monitoring
- API response times
- Error rates by endpoint
- Rate limit hits
- Third-party API failures
- Webhook delivery success rate

---

## Documentation Requirements

### Public API Docs
- Interactive API explorer (Swagger/OpenAPI)
- Code examples (JavaScript, Python, cURL)
- Authentication guide
- Rate limiting explanation
- Error codes reference
- Changelog

### Integration Guides
- Steam integration tutorial
- Discord bot setup guide
- Minecraft plugin installation
- API key generation guide
- Webhook configuration

---

## Budget Estimates

| Integration | Estimated Cost | Timeline |
|-------------|---------------|----------|
| Steam API | Free (with key) | 2 weeks |
| Discord Bot | Free | 3 weeks |
| GraphQL Server | $50/mo hosting | 3 weeks |
| Redis (caching) | $20/mo | - |
| CDN (Cloudflare) | $200/mo | - |
| Monitoring | $50/mo | - |
| **Total Monthly** | **$320** | - |

---

## Success Metrics

### Adoption Metrics
- API key sign-ups: 100+ in first month
- Discord bot servers: 50+ in first quarter
- Minecraft servers: 25+ in first quarter
- API calls per day: 10,000+

### Performance Metrics
- API response time: <200ms (p95)
- Uptime: 99.9%
- Error rate: <0.1%
- Webhook delivery success: >95%

---

## References

- [Steam Web API Documentation](https://steamcommunity.com/dev)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [Twitch API Reference](https://dev.twitch.tv/docs/api/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [REST API Design Guide](https://restfulapi.net/)

---

**Last Updated**: 2026-01-16
**Maintained By**: GrieferHub Development Team
**Next Review**: 2026-02-16
