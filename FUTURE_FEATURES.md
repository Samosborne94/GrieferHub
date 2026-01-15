# GrieferHub Future Features & Implementation Plans

## 📋 Table of Contents

- [Overview](#overview)
- [Phase 6: Community Features (Q1 2026)](#phase-6-community-features-q1-2026)
- [Phase 7: Analytics & Insights (Q2 2026)](#phase-7-analytics--insights-q2-2026)
- [Phase 8: Integrations & Automation (Q3 2026)](#phase-8-integrations--automation-q3-2026)
- [Phase 9: Mobile Platform (Q4 2026)](#phase-9-mobile-platform-q4-2026)
- [Phase 10+: Long-Term Vision (2027+)](#phase-10-long-term-vision-2027)
- [Community-Requested Features](#community-requested-features)
- [Integration Opportunities](#integration-opportunities)
- [Scalability Considerations](#scalability-considerations)
- [Mobile App Possibilities](#mobile-app-possibilities)

---

## Overview

This document outlines the future development plans for GrieferHub beyond Phase 5. Each phase includes detailed implementation plans, technical specifications, user stories, and success metrics.

**Current Status**: Phase 5 Complete
**Next Priority**: Phase 6 - Community Features

---

## Phase 6: Community Features (Q1 2026)

**Timeline**: 8-10 weeks
**Priority**: HIGH
**Budget**: $15,000 - $20,000

### 1. Comment System

**Goal**: Enable community discussion on griefer reports.

#### Technical Implementation

**Database Schema (Airtable)**:

```
Comments Table:
- id (Autonumber)
- report_id (Link to Reports)
- user_id (Link to Users)
- content (Long text, max 1000 chars)
- parent_id (Link to Comments, for threading)
- is_deleted (Checkbox)
- is_hidden (Checkbox, moderation)
- created_at (Created time)
- updated_at (Last modified time)
- likes_count (Number)
- dislikes_count (Number)
```

#### API Endpoints

```typescript
// POST /api/reports/[id]/comments
// Create new comment
interface CreateCommentRequest {
  content: string;
  parent_id?: string; // For threaded replies
}

// GET /api/reports/[id]/comments
// List comments with pagination
interface ListCommentsRequest {
  page?: number;
  limit?: number; // Default 20, max 100
  sort?: 'newest' | 'oldest' | 'top'; // Default 'newest'
}

// PUT /api/comments/[id]
// Update own comment
interface UpdateCommentRequest {
  content: string;
}

// DELETE /api/comments/[id]
// Delete own comment (soft delete)

// POST /api/comments/[id]/like
// Like/unlike comment

// POST /api/comments/[id]/report
// Report inappropriate comment
interface ReportCommentRequest {
  reason: string;
}
```

#### React Components

```typescript
// CommentList Component
interface CommentListProps {
  reportId: string;
  initialComments?: Comment[];
}

export function CommentList({ reportId, initialComments }: CommentListProps) {
  // SWR for data fetching
  // Pagination
  // Real-time updates
  // Sort options
}

// CommentItem Component
interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
}

// CommentForm Component
interface CommentFormProps {
  reportId: string;
  parentId?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
}

export function CommentForm({ reportId, parentId, onSubmit }: CommentFormProps) {
  // Rich text editor (optional)
  // Character count
  // Validation
  // Submit button state
}
```

#### Moderation Features

- **Hide Comment**: Moderators can hide inappropriate comments
- **Delete Comment**: Admins can permanently delete comments
- **Report Comment**: Users can report violations
- **Auto-Moderation**: Filter spam and profanity
- **Shadow Ban**: Hide comments from specific users

#### User Experience

- **Threading**: Reply directly to comments (1 level deep)
- **Mentions**: @username notifications (future)
- **Reactions**: Like/dislike buttons
- **Edit History**: Show edited indicator
- **Sorting**: Newest, oldest, top (by likes)
- **Pagination**: Load more comments

#### Success Metrics

- 40%+ of report viewers leave comments
- Average 2-3 comments per report
- Less than 5% of comments flagged
- 95% moderation response time under 24 hours

---

### 2. User Profiles

**Goal**: Create comprehensive user profile pages with activity history.

#### Technical Implementation

**Database Schema Extensions**:

```
Users Table (Additional Fields):
- avatar_url (URL, Cloudinary)
- bio (Long text, max 500 chars)
- location (Single line text)
- website (URL)
- discord_username (Single line text)
- steam_id (Single line text)
- reputation_score (Number, calculated)
- trust_level (Single select: New, Regular, Trusted, Veteran)
- badges (Multiple select: Contributor, Moderator, Top Reporter, etc.)
- is_verified (Checkbox)
- last_active (Last modified time)
```

#### Profile Page (`/user/[username]`)

```typescript
interface UserProfilePageProps {
  username: string;
}

export default function UserProfilePage({ username }: UserProfilePageProps) {
  // Layout sections:
  // 1. User Info Card (avatar, name, bio, badges)
  // 2. Statistics Dashboard
  // 3. Activity Timeline
  // 4. Submitted Reports List
  // 5. Comments History
}
```

**Profile Sections**:

1. **User Info Card**:

   - Avatar (150x150px)
   - Username and display name
   - Bio/description
   - Location
   - Website link
   - Social links (Discord, Steam)
   - Join date
   - Trust level and badges
   - Verification checkmark

2. **Statistics Dashboard**:

   - Total reports submitted
   - Reports by status (Verified, Under Review, Resolved, Rejected)
   - Total comments
   - Reputation score
   - Most reported games
   - Activity streak

3. **Activity Timeline**:

   - Recent reports submitted
   - Recent comments
   - Report status changes
   - Badges earned

4. **Reports List**:

   - All reports by user
   - Filterable by status, game
   - Sortable by date
   - Paginated

5. **Comments History**:
   - Recent comments
   - Link to original reports

#### Profile Editing (`/settings/profile`)

```typescript
interface ProfileEditFormProps {
  user: User;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  // Fields:
  // - Upload avatar (crop and resize)
  // - Bio textarea (500 chars max)
  // - Location input
  // - Website URL
  // - Discord username
  // - Steam ID
  // - Privacy settings
}
```

#### Reputation System

**Reputation Calculation**:

```typescript
function calculateReputation(user: User): number {
  let score = 0;

  // Base points
  score += user.verified_reports * 10; // +10 per verified report
  score += user.total_comments * 2; // +2 per comment
  score += user.helpful_votes * 5; // +5 per helpful vote on comments

  // Penalties
  score -= user.rejected_reports * 5; // -5 per rejected report
  score -= user.flagged_comments * 10; // -10 per flagged comment

  // Bonuses
  if (user.has_verified_email) score += 50;
  if (user.has_linked_discord) score += 25;
  if (user.days_active > 30) score += 100;

  return Math.max(score, 0); // Minimum 0
}
```

**Trust Levels**:

- **New** (0-49 rep): Basic access
- **Regular** (50-199 rep): Can vote on comments
- **Trusted** (200-499 rep): Can flag comments, edit tags
- **Veteran** (500+ rep): Can suggest edits, higher priority in moderation queue

**Badges**:

- Contributor: 10+ verified reports
- Top Reporter: Top 100 by verified reports
- Community Helper: 50+ helpful comments
- Moderator: Granted by admins
- Verified: Verified email and social accounts

#### Privacy Settings

```typescript
interface PrivacySettings {
  show_email: boolean; // Default: false
  show_location: boolean; // Default: true
  show_reports: 'public' | 'friends' | 'private'; // Default: public
  show_comments: 'public' | 'friends' | 'private'; // Default: public
  allow_mentions: boolean; // Default: true
  email_notifications: boolean; // Default: true
}
```

#### Success Metrics

- 60%+ of users complete profile
- Profile views increase by 200%
- User retention improves by 25%
- 40%+ of users link social accounts

---

### 3. Griefer Profiles

**Goal**: Aggregate all reports for specific griefers to track patterns and history.

#### Technical Implementation

**Database Schema**:

```
Griefers Table:
- id (Autonumber)
- name (Single line text, primary identifier)
- aliases (Multiple select, alternate names)
- total_reports (Number, calculated)
- verified_reports (Number, calculated)
- first_reported (Formula, MIN of report dates)
- last_reported (Formula, MAX of report dates)
- games_affected (Multiple select, auto-populated)
- servers_affected (Multiple select)
- severity_distribution (Long text, JSON)
- is_tracked (Checkbox, user watchlist)
- notes (Long text, admin/mod notes)
```

#### Griefer Profile Page (`/griefer/[name]`)

```typescript
interface GrieferProfilePageProps {
  grieferName: string;
}

export default function GrieferProfilePage({ grieferName }: GrieferProfilePageProps) {
  // Layout sections:
  // 1. Griefer Info Card
  // 2. Statistics Overview
  // 3. Timeline of Incidents
  // 4. All Reports List
  // 5. Pattern Analysis
}
```

**Profile Sections**:

1. **Griefer Info Card**:

   - Name and known aliases
   - Warning level indicator
   - Total reports
   - Active status (recent activity)
   - Track button (add to watchlist)

2. **Statistics Overview**:

   - Total reports (all statuses)
   - Verified reports
   - Games affected
   - Servers/regions
   - First and last reported dates
   - Severity distribution (pie chart)

3. **Timeline of Incidents**:

   - Chronological list of reports
   - Visual timeline with dates
   - Clickable to full report

4. **Reports List**:

   - All reports for this griefer
   - Filterable by game, status, severity
   - Sortable by date
   - Paginated

5. **Pattern Analysis** (Future - ML):
   - Common tactics
   - Preferred games/servers
   - Active times
   - Associated players

#### Alias Tracking

**Alias Management**:

```typescript
interface AliasManagementProps {
  grieferId: string;
  currentAliases: string[];
}

export function AliasManagement({ grieferId, currentAliases }: AliasManagementProps) {
  // Add alias: Input field + verification
  // Merge griefer profiles
  // Admin approval required
}
```

**Auto-Detection**:

- Fuzzy matching on similar names
- Suggest potential aliases
- Community voting on alias accuracy

#### Watchlist Feature

```typescript
// Add to personal watchlist
POST /api/griefers/[name]/watch

// Get watchlist
GET /api/users/me/watchlist

// Watchlist notifications
interface WatchlistNotification {
  griefer_name: string;
  event: 'new_report' | 'status_change' | 'new_alias';
  timestamp: Date;
}
```

#### Success Metrics

- Griefer profiles for 80%+ of unique names
- 30% reduction in duplicate reports
- 50%+ users utilize watchlist
- Improved pattern detection accuracy

---

### 4. Notification System

**Goal**: Keep users informed about activity on their reports and comments.

#### Technical Implementation

**Database Schema**:

```
Notifications Table:
- id (Autonumber)
- user_id (Link to Users)
- type (Single select: report_status, comment_reply, mention, mod_action, etc.)
- related_report_id (Link to Reports)
- related_comment_id (Link to Comments)
- title (Single line text)
- message (Long text)
- link_url (URL)
- is_read (Checkbox)
- is_email_sent (Checkbox)
- created_at (Created time)
```

#### Notification Types

1. **Report Status Changed**:

   ```
   Title: "Your report has been verified"
   Message: "Your report on [Griefer Name] in [Game] has been verified by moderators."
   Link: /report/[id]
   ```

2. **Comment on Your Report**:

   ```
   Title: "[Username] commented on your report"
   Message: "[Username] commented: [First 50 chars...]"
   Link: /report/[id]#comment-[id]
   ```

3. **Reply to Your Comment**:

   ```
   Title: "[Username] replied to your comment"
   Message: "[Username] replied: [First 50 chars...]"
   Link: /report/[id]#comment-[id]
   ```

4. **Mentioned in Comment**:

   ```
   Title: "[Username] mentioned you"
   Message: "You were mentioned in a comment on [Report]"
   Link: /report/[id]#comment-[id]
   ```

5. **Moderator Action**:
   ```
   Title: "Moderator action on your content"
   Message: "Your [report/comment] has been [action] by a moderator."
   Link: /report/[id] or /settings/notifications
   ```

#### API Endpoints

```typescript
// GET /api/notifications
// List all notifications for current user
interface ListNotificationsRequest {
  page?: number;
  limit?: number;
  unread_only?: boolean;
}

// GET /api/notifications/unread/count
// Get count of unread notifications
interface UnreadCountResponse {
  count: number;
}

// PUT /api/notifications/[id]/read
// Mark notification as read

// PUT /api/notifications/read-all
// Mark all as read

// DELETE /api/notifications/[id]
// Dismiss notification

// DELETE /api/notifications/clear-all
// Clear all notifications
```

#### UI Components

**Notification Bell**:

```typescript
export function NotificationBell() {
  const { data: unreadCount } = useSWR('/api/notifications/unread/count');

  return (
    <button className="relative">
      <BellIcon />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
```

**Notification Dropdown**:

```typescript
export function NotificationDropdown() {
  const { data: notifications } = useSWR('/api/notifications?limit=10');

  return (
    <div className="notifications-dropdown">
      <div className="header">
        <h3>Notifications</h3>
        <button onClick={markAllAsRead}>Mark all as read</button>
      </div>
      <div className="list">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
      <div className="footer">
        <Link href="/notifications">View all</Link>
      </div>
    </div>
  );
}
```

#### Email Notifications

**Email Templates**:

- Daily digest (summary of activity)
- Instant notifications for important events
- Weekly summary
- Customizable preferences

**User Preferences** (`/settings/notifications`):

```typescript
interface NotificationPreferences {
  email_enabled: boolean;
  email_frequency: 'instant' | 'daily' | 'weekly' | 'never';
  notify_report_status: boolean;
  notify_comments: boolean;
  notify_replies: boolean;
  notify_mentions: boolean;
  notify_mod_actions: boolean;
  notify_watchlist: boolean;
}
```

#### Real-Time Notifications (Optional - WebSockets)

```typescript
// Socket.io integration
import { useSocket } from '@/lib/hooks/useSocket';

export function RealTimeNotifications() {
  const socket = useSocket();

  useEffect(() => {
    socket.on('notification', (notification) => {
      // Show toast notification
      toast.info(notification.message);
      // Update notification count
      mutate('/api/notifications/unread/count');
    });

    return () => socket.off('notification');
  }, [socket]);
}
```

#### Success Metrics

- 80%+ notification open rate
- 50% reduction in "where's my report status?" inquiries
- 60%+ email open rate
- Improved user engagement by 30%

---

## Phase 7: Analytics & Insights (Q2 2026)

**Timeline**: 8-12 weeks
**Priority**: MEDIUM-HIGH
**Budget**: $20,000 - $25,000

### 1. Platform Analytics Dashboard

**Goal**: Provide comprehensive analytics for understanding griefing patterns and platform usage.

#### Analytics Dashboard (`/analytics`)

**Metrics to Track**:

1. **Report Metrics**:

   - Total reports over time (line chart)
   - Reports by status (pie chart)
   - Reports by game (bar chart)
   - Reports by severity (stacked bar chart)
   - Geographic distribution (world map heatmap)
   - Peak reporting times (heatmap by hour/day)
   - Average moderation time
   - Rejection rate

2. **User Metrics**:

   - Active users (DAU, MAU)
   - New registrations over time
   - User retention rate
   - Most active reporters (leaderboard)
   - User growth rate
   - Churn rate

3. **Content Metrics**:

   - Comments per report (average)
   - Comment engagement rate
   - Most commented reports
   - User interaction rate

4. **Moderation Metrics**:
   - Reports in queue
   - Average processing time
   - Moderator efficiency
   - Appeal rate
   - Accuracy rate

#### Implementation

**Data Aggregation Service**:

```typescript
// lib/services/analyticsService.ts
export class AnalyticsService {
  async getReportMetrics(timeRange: TimeRange): Promise<ReportMetrics> {
    // Aggregate report data from Airtable
    // Calculate metrics
    // Cache results
  }

  async getUserMetrics(timeRange: TimeRange): Promise<UserMetrics> {
    // Aggregate user data
  }

  async getModeratorMetrics(timeRange: TimeRange): Promise<ModeratorMetrics> {
    // Aggregate moderation data
  }

  async getTrendingGriefers(limit: number): Promise<Griefer[]> {
    // Find most reported griefers recently
  }
}
```

**Chart Components** (using Recharts or Chart.js):

```typescript
import { LineChart, BarChart, PieChart, Heatmap } from 'recharts';

export function ReportsOverTimeChart({ data }) {
  return <LineChart data={data} xAxis="date" yAxis="count" />;
}

export function ReportsByGameChart({ data }) {
  return <BarChart data={data} xAxis="game" yAxis="count" />;
}

export function SeverityDistributionChart({ data }) {
  return <PieChart data={data} dataKey="value" nameKey="severity" />;
}

export function GeographicHeatmap({ data }) {
  return <WorldMap data={data} colorScale="reds" />;
}
```

#### Filters and Date Ranges

```typescript
interface AnalyticsFilters {
  timeRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom';
  startDate?: Date;
  endDate?: Date;
  game?: string;
  severity?: string;
  status?: string;
}
```

#### Export Functionality

- Export charts as PNG/SVG
- Export data as CSV/Excel
- Generate PDF reports
- Scheduled reports (email delivery)

---

### 2. Predictive Analytics & Machine Learning

**Goal**: Use ML to detect patterns, predict behavior, and automate moderation.

#### ML Features

1. **Auto-Categorization**:

   - Automatically suggest game based on description
   - Suggest severity level
   - Suggest tags

2. **Duplicate Detection**:

   - Identify potential duplicate reports
   - Suggest merging similar reports

3. **Griefer Pattern Recognition**:

   - Detect serial griefers across games
   - Identify coordinated griefing (groups)
   - Predict likely reoffenders

4. **Spam Detection**:

   - Auto-flag spam reports
   - Detect fake reports
   - Identify bot submissions

5. **Content Moderation**:
   - Auto-flag inappropriate comments
   - Detect hate speech
   - Filter profanity

#### Implementation (Python Microservice)

```python
# ml-service/app.py
from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load models
classifier = pipeline("text-classification", model="distilbert-base-uncased")
spam_detector = pipeline("text-classification", model="spam-detection-model")

@app.route('/classify', methods=['POST'])
def classify_report():
    data = request.json
    description = data['description']

    # Predict game
    game_prediction = classifier(description)

    # Detect spam
    spam_score = spam_detector(description)

    return jsonify({
        'game': game_prediction,
        'is_spam': spam_score > 0.8
    })

@app.route('/detect-duplicate', methods=['POST'])
def detect_duplicate():
    data = request.json
    description = data['description']

    # Semantic similarity search
    # Return potential duplicates

    return jsonify({
        'is_duplicate': False,
        'similar_reports': []
    })
```

---

### 3. Game-Specific Analytics

**Goal**: Provide detailed analytics for each supported game.

#### Game Analytics Page (`/analytics/[game]`)

**Metrics**:

- Total reports for this game
- Trend over time
- Most reported servers
- Common griefing tactics (word cloud)
- Severity distribution
- Most active reporters
- Resolution rate
- Average moderation time

**Comparative Analysis**:

- Compare to other games
- Benchmark against platform average
- Identify outliers

---

## Phase 8: Integrations & Automation (Q3 2026)

**Timeline**: 12-16 weeks
**Priority**: MEDIUM
**Budget**: $30,000 - $40,000

### 1. Discord Bot Integration

**Goal**: Enable report submissions and notifications via Discord.

#### Bot Commands

```
/griefer report [name] [game] [description]
- Submit a report from Discord
- Upload evidence as attachment
- Interactive form using Discord modals

/griefer search [name]
- Search for griefer reports
- Returns summary and link

/griefer status [report-id]
- Check status of your report
- Get detailed information

/griefer stats
- View server statistics
- Top reported games
- Recent verified reports

/griefer watchlist add [name]
- Add griefer to personal watchlist

/griefer watchlist list
- View your watchlist

/griefer leaderboard
- Top reporters (opt-in)

/griefer help
- Show all commands and usage
```

#### Notifications

**Server Notifications**:

- New verified report in followed games
- Trending griefers
- High-severity alerts
- Daily/weekly digest

**Personal Notifications** (DM):

- Your report status changed
- New comment on your report
- Watchlist alert (tracked griefer reported)

#### Server Integration Features

**Auto-Moderation**:

- Warn when known griefer joins
- Auto-kick option for verified griefers
- Ban sync with GrieferHub database

**Server Configuration**:

```
/griefer-config set channel #griefer-alerts
- Set notification channel

/griefer-config set auto-warn true
- Enable auto-warnings

/griefer-config set auto-kick false
- Disable auto-kick

/griefer-config set games minecraft rust
- Set games to track

/griefer-config set severity high critical
- Only alert for high/critical severity
```

#### Implementation

**Tech Stack**:

- discord.js or discord.py
- PostgreSQL for bot configuration
- Redis for caching
- Docker for deployment

```typescript
// discord-bot/commands/report.ts
import { SlashCommandBuilder } from '@discordjs/builders';

export const command = new SlashCommandBuilder()
  .setName('report')
  .setDescription('Report a griefer')
  .addStringOption((option) =>
    option.setName('name').setDescription('Griefer name').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('game').setDescription('Game').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('description').setDescription('What happened').setRequired(true)
  )
  .addAttachmentOption((option) =>
    option.setName('evidence').setDescription('Upload evidence').setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  const name = interaction.options.getString('name');
  const game = interaction.options.getString('game');
  const description = interaction.options.getString('description');
  const evidence = interaction.options.getAttachment('evidence');

  // Upload evidence to Cloudinary
  // Create report via API
  // Send confirmation

  await interaction.reply({
    content: `Report submitted for ${name} in ${game}. Report ID: ${reportId}`,
    ephemeral: true,
  });
}
```

---

### 2. Game Server Plugins

**Goal**: Direct in-game integration for seamless reporting.

#### Minecraft Plugin

**Features**:

- `/griefer report <player> <reason>` - Report from in-game
- Automatic screenshot capture
- Server log extraction
- Coordinate logging
- Auto-sync with GrieferHub

**Implementation** (Spigot/Paper):

```java
// MinecraftPlugin/commands/GrieferCommand.java
public class GrieferCommand implements CommandExecutor {
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) return false;

        Player player = (Player) sender;

        if (args[0].equals("report")) {
            String grieferName = args[1];
            String reason = String.join(" ", Arrays.copyOfRange(args, 2, args.length));

            // Take screenshot
            BufferedImage screenshot = captureScreenshot(player);

            // Get player location
            Location loc = player.getLocation();

            // Get server logs
            List<String> logs = getRecentLogs(grieferName);

            // Submit to GrieferHub API
            submitReport(grieferName, reason, screenshot, loc, logs);

            player.sendMessage("§aReport submitted to GrieferHub!");
        }

        return true;
    }
}
```

**Auto-Moderation**:

- Check joining players against GrieferHub database
- Warn moderators of known griefers
- Optional auto-kick/ban integration
- Log griefer activity automatically

---

### 3. Steam Integration

**Goal**: Authenticate users via Steam and link Steam profiles to reports.

#### Features

- **Steam Login**: Alternative authentication method
- **Profile Linking**: Link Steam profile to GrieferHub account
- **Steam Data**: Pull playtime, VAC bans, game library
- **Steam ID in Reports**: Include Steam ID64 in reports
- **Steam Community Integration**: Share reports to Steam groups

#### Implementation

```typescript
// NextAuth Steam Provider
import SteamProvider from 'next-auth-steam';

export const authOptions = {
  providers: [
    SteamProvider({
      clientSecret: process.env.STEAM_API_KEY,
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/steam`,
    }),
    // ... other providers
  ],
};
```

**Steam Data Integration**:

```typescript
async function getSteamUserData(steamId: string) {
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamId}`
  );

  const data = await response.json();

  return {
    steamId: data.steamid,
    personaName: data.personaname,
    avatarUrl: data.avatarfull,
    profileUrl: data.profileurl,
    vacBans: await getVACBans(steamId),
    recentGames: await getRecentGames(steamId),
  };
}
```

---

## Phase 9: Mobile Platform (Q4 2026)

**Timeline**: 16-20 weeks
**Priority**: MEDIUM-LOW
**Budget**: $50,000 - $70,000

### React Native Mobile App

**Goal**: Native mobile apps for iOS and Android with full feature parity.

#### Core Features (MVP)

1. **Authentication**: Login/register with email or social
2. **Browse Intel Board**: Scroll through verified reports
3. **View Report Details**: Full report with media player
4. **Submit Reports**: Form with camera integration
5. **User Dashboard**: Manage your reports
6. **Notifications**: Push notifications for updates
7. **Offline Mode**: Cache data for offline viewing
8. **Share Reports**: Share to social media

#### Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **API**: Axios with SWR
- **Auth**: React Native App Auth
- **Push Notifications**: Expo Notifications
- **Camera**: Expo Camera
- **Media**: Expo Image Picker

#### Key Screens

```
/screens
├── Auth
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── ForgotPasswordScreen.tsx
├── Home
│   ├── IntelBoardScreen.tsx (Main feed)
│   ├── ReportDetailScreen.tsx
│   └── SearchScreen.tsx
├── Submit
│   ├── SubmitReportScreen.tsx
│   ├── CameraScreen.tsx
│   └── SuccessScreen.tsx
├── Dashboard
│   ├── DashboardScreen.tsx
│   ├── MyReportsScreen.tsx
│   └── EditReportScreen.tsx
├── Profile
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   └── NotificationsScreen.tsx
└── More
    ├── AboutScreen.tsx
    ├── HelpScreen.tsx
    └── PrivacyScreen.tsx
```

#### Platform-Specific Considerations

**iOS**:

- App Store submission and review
- Apple Push Notification Service (APNS)
- TestFlight for beta testing
- iOS Design Guidelines compliance

**Android**:

- Google Play submission
- Firebase Cloud Messaging (FCM)
- Google Play Beta for testing
- Material Design compliance

---

### Progressive Web App (PWA)

**Goal**: Installable web app with offline capabilities.

#### PWA Features

- **Installable**: Add to home screen prompt
- **Offline Mode**: Service worker caching
- **Push Notifications**: Web push API
- **Background Sync**: Sync data when back online
- **Camera Access**: PWA camera API
- **Share Target**: Share to GrieferHub from other apps

#### Implementation

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // ... existing config
});
```

**Service Worker**:

```typescript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('grieferhub-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/intel',
        '/offline',
        '/styles/globals.css',
        '/logo.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

## Phase 10+: Long-Term Vision (2027+)

### 1. Database Migration (PostgreSQL)

**Why Migrate**:

- Better performance at scale
- Advanced querying capabilities
- Full-text search
- Better indexing
- More control

**Migration Strategy**:

1. Set up PostgreSQL database
2. Create schema matching Airtable structure
3. Write migration scripts
4. Dual-write period (write to both databases)
5. Data validation
6. Switch read operations to PostgreSQL
7. Deprecate Airtable

### 2. Multi-Language Support (i18n)

**Supported Languages**:

- English (default)
- Spanish
- French
- German
- Portuguese
- Russian
- Japanese
- Chinese (Simplified)

**Implementation**:

```typescript
// i18n configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
    // ...
  },
  lng: 'en',
  fallbackLng: 'en',
});
```

### 3. AI-Powered Moderation

**Features**:

- Auto-approve obvious valid reports
- Auto-reject obvious spam
- Content warning detection
- Toxic comment filtering
- Image recognition for evidence validation

### 4. Blockchain Verification (Experimental)

**Concept**: Use blockchain for immutable report records.

**Benefits**:

- Tamper-proof records
- Transparent history
- Trustless verification

**Challenges**:

- Cost
- Complexity
- Environmental concerns

---

## Community-Requested Features

### Top 10 Requested Features

1. **Dark/Light Mode Toggle**: Currently dark only
2. **Advanced Search Filters**: Enhanced filtering UI
3. **Report Templates**: Pre-filled forms for common griefing types
4. **Bulk Actions**: Moderator bulk approve/reject
5. **Griefer Watchlist**: Track and get notified
6. **Reputation System**: Trust scores for reporters
7. **Appeals Process**: Contest rejected reports
8. **Private Messaging**: User-to-user communication
9. **Server Partnerships**: Official verification badges
10. **Tournament Mode**: Special handling for competitive events

---

**Last Updated**: 2026-01-12
**Maintained by**: GrieferHub Core Team
**Status**: Active Development - Phase 6 Starting

**Want to contribute?** Check out [CONTRIBUTING.md](./CONTRIBUTING.md) and [ROADMAP.md](./ROADMAP.md)!
