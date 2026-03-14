import type { Report, ReportInput, ReportFilters } from '@/types/report'
import type { User, UserInput, UserProfile, UserProfileUpdate, UserStats } from '@/types/user'
import type { Comment, CommentInput } from '@/types/comment'
import type { ApiKey, ApiKeyInput, ApiKeyWithKey, ApiKeyListItem } from '@/types/apiKey'
import type { Notification, NotificationType } from '@/types/notification'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

// ===== IN-MEMORY STORES =====

interface StoredUser extends User {
    password: string
    bio?: string
    avatar?: string
    location?: string
    website?: string
    discord?: string
    steam?: string
}

interface StoredApiKey extends ApiKey {}

const users = new Map<string, StoredUser>()
const reports = new Map<string, Report>()
const comments = new Map<string, Comment>()
const apiKeys = new Map<string, StoredApiKey>()
const notifications = new Map<string, Notification>()

let userCounter = 0
let reportCounter = 0
let commentCounter = 0
let apiKeyCounter = 0
let notificationCounter = 0

function nextUserId() { return `mock_user_${++userCounter}` }
function nextReportId() { return `mock_report_${++reportCounter}` }
function nextCommentId() { return `mock_comment_${++commentCounter}` }
function nextApiKeyId() { return `mock_apikey_${++apiKeyCounter}` }
function nextNotificationId() { return `mock_notif_${++notificationCounter}` }

// ===== SEED DATA =====

const SEED_READY = (async () => {
    // --- Users ---
    const pw1 = await bcrypt.hash('password123', 10)
    const pw2 = await bcrypt.hash('admin123', 10)
    const pw3 = await bcrypt.hash('mod12345', 10)

    const testUser: StoredUser = {
        id: nextUserId(), username: 'TestUser', email: 'test@grieferhub.com',
        role: 'user', password: pw1, createdAt: new Date('2025-06-15'),
        bio: 'Extraction shooter veteran. Keeping the community clean since 2024.',
        discord: 'TestUser#1234', steam: 'testuser_steam', location: 'United States',
    }
    const adminUser: StoredUser = {
        id: nextUserId(), username: 'AdminUser', email: 'admin@grieferhub.com',
        role: 'admin', password: pw2, createdAt: new Date('2025-05-01'),
    }
    const modUser: StoredUser = {
        id: nextUserId(), username: 'ModUser', email: 'mod@grieferhub.com',
        role: 'moderator', password: pw3, createdAt: new Date('2025-07-20'),
    }

    users.set(testUser.id, testUser)
    users.set(adminUser.id, adminUser)
    users.set(modUser.id, modUser)

    // --- Reports ---
    const now = new Date()
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000)

    const seedReports: Array<Omit<Report, 'id'>> = [
        {
            reporterId: testUser.id, grieferName: 'ToxicRaider42', game: 'Arc Raiders',
            description: 'Intentionally team-killed our entire squad during extraction. Grabbed all the loot and extracted solo. Has done this in multiple lobbies based on other player reports.',
            evidenceUrl: 'https://imgur.com/evidence/toxicraider42-tk.png',
            status: 'Verified', severity: 'High', server: 'EU West',
            tags: ['team-kill', 'loot-steal'],
            createdAt: daysAgo(14), updatedAt: daysAgo(12),
        },
        {
            reporterId: testUser.id, grieferName: 'xX_GriefLord_Xx', game: 'Escape from Tarkov',
            description: 'Camping extraction points with a squad and killing solo players. Been doing this for weeks on Customs and Interchange maps. Multiple witnesses.',
            evidenceUrl: 'https://imgur.com/evidence/grieflord-camp.png',
            status: 'Verified', severity: 'Critical', server: 'NA East',
            tags: ['extract-camp', 'squad-grief'],
            createdAt: daysAgo(12), updatedAt: daysAgo(10),
        },
        {
            reporterId: testUser.id, grieferName: 'RustBandit99', game: 'Rust',
            description: 'Using exploits to clip through base walls and raid without proper raiding tools. Stole an entire base worth of sulfur and components.',
            evidenceUrl: 'https://imgur.com/evidence/rustbandit-exploit.png',
            status: 'Verified', severity: 'Critical', server: 'Rustafied US Main',
            tags: ['exploit', 'base-raid'],
            createdAt: daysAgo(10), updatedAt: daysAgo(8),
        },
        {
            reporterId: testUser.id, grieferName: 'BackstabBenny', game: 'DayZ',
            description: 'Pretends to be friendly, trades gear, then shoots you in the back. Has done this to at least 5 players in our group over the past week.',
            evidenceUrl: 'https://imgur.com/evidence/backstab-benny.png',
            status: 'Resolved', severity: 'Medium', server: 'DayZ Official LA 4302',
            tags: ['betrayal', 'friendly-fire'],
            createdAt: daysAgo(9), updatedAt: daysAgo(5),
        },
        {
            reporterId: testUser.id, grieferName: 'ToxicRaider42', game: 'Arc Raiders',
            description: 'Second report on this player. Was spotted using aim assistance software during PvP encounters. Consistently hitting impossible shots through smoke.',
            evidenceUrl: 'https://imgur.com/evidence/toxicraider42-aim.png',
            status: 'Under Review', severity: 'Critical', server: 'EU West',
            tags: ['cheating', 'aimbot'],
            createdAt: daysAgo(7), updatedAt: daysAgo(7),
        },
        {
            reporterId: testUser.id, grieferName: 'LootGoblin_Pro', game: 'Escape from Tarkov',
            description: 'Repeatedly joins groups from LFG channels, waits until teammates are in fights, then loots all the bodies and disconnects. Low effort grief but very annoying.',
            evidenceUrl: 'https://imgur.com/evidence/lootgoblin-steal.png',
            status: 'Rejected', severity: 'Low', server: 'EU Central',
            tags: ['loot-steal', 'LFG-abuse'],
            createdAt: daysAgo(6), updatedAt: daysAgo(4),
        },
        {
            reporterId: testUser.id, grieferName: 'WallHacker_Mike', game: 'Rust',
            description: 'Seems to know exactly where players are at all times. Pre-fires corners, knows base layouts without scouting. Multiple clans have reported similar behavior.',
            evidenceUrl: 'https://imgur.com/evidence/wallhack-mike.png',
            status: 'Under Review', severity: 'High', server: 'Moose Main',
            tags: ['cheating', 'wallhack'],
            createdAt: daysAgo(3), updatedAt: daysAgo(3),
        },
        {
            reporterId: testUser.id, grieferName: 'FriendlyFire_Fred', game: 'Arc Raiders',
            description: 'Joins random squads and immediately starts shooting teammates. Does not communicate. Just griefs and leaves. Encountered him three times this week.',
            evidenceUrl: 'https://imgur.com/evidence/fred-tk.png',
            status: 'Under Review', severity: 'Medium', server: 'NA West',
            tags: ['team-kill', 'random-grief'],
            createdAt: daysAgo(1), updatedAt: daysAgo(1),
        },
    ]

    const reportIds: string[] = []
    for (const r of seedReports) {
        const id = nextReportId()
        reports.set(id, { id, ...r })
        reportIds.push(id)
    }

    // --- Comments ---
    const seedComments: Array<Omit<Comment, 'id'>> = [
        {
            reportId: reportIds[0], authorId: modUser.id, authorUsername: 'ModUser', authorRole: 'moderator',
            content: 'Can confirm, I was in the same squad. This player intentionally downed all three of us before extracting.',
            createdAt: daysAgo(13), updatedAt: daysAgo(13), isEdited: false,
        },
        {
            reportId: reportIds[0], authorId: adminUser.id, authorUsername: 'AdminUser', authorRole: 'admin',
            content: 'Verified. Multiple reports from different users corroborate this behavior. Marking as confirmed.',
            createdAt: daysAgo(12), updatedAt: daysAgo(12), isEdited: false,
        },
        {
            reportId: reportIds[1], authorId: testUser.id, authorUsername: 'TestUser', authorRole: 'user',
            content: "I've seen this squad camping D-2 extract on Interchange as well. They run 4-man and block the exit.",
            createdAt: daysAgo(11), updatedAt: daysAgo(11), isEdited: false,
        },
        {
            reportId: reportIds[2], authorId: modUser.id, authorUsername: 'ModUser', authorRole: 'moderator',
            content: 'The wall-clipping exploit was patched last update but this player found a new spot near the TC. Evidence video clearly shows it.',
            createdAt: daysAgo(9), updatedAt: daysAgo(9), isEdited: false,
        },
        {
            reportId: reportIds[4], authorId: adminUser.id, authorUsername: 'AdminUser', authorRole: 'admin',
            content: 'This is now the second report for ToxicRaider42. Escalating severity. Community, keep submitting evidence.',
            createdAt: daysAgo(6), updatedAt: daysAgo(6), isEdited: false,
        },
        {
            reportId: reportIds[3], authorId: modUser.id, authorUsername: 'ModUser', authorRole: 'moderator',
            content: 'BackstabBenny reached out and apologized. Says it was a misunderstanding. Marking as resolved but keeping on record.',
            createdAt: daysAgo(5), updatedAt: daysAgo(5), isEdited: false,
        },
    ]

    for (const c of seedComments) {
        const id = nextCommentId()
        comments.set(id, { id, ...c })
    }

    console.log('[mock] In-memory data seeded: 3 users, 8 reports, 6 comments')
})()

// ===== SERVICE CLASS =====

export class AirtableService {

    private static async ready() { await SEED_READY }

    // ---------- REPORTS ----------

    static async getReports(filters?: ReportFilters): Promise<Report[]> {
        await this.ready()
        let result = Array.from(reports.values())

        if (filters?.game) result = result.filter(r => r.game === filters.game)
        if (filters?.status) result = result.filter(r => r.status === filters.status)
        if (filters?.severity) result = result.filter(r => r.severity === filters.severity)
        if (filters?.search) {
            const q = filters.search.toLowerCase()
            result = result.filter(r =>
                r.grieferName.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q)
            )
        }

        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit
            result = result.slice(start, start + filters.limit)
        }

        return result
    }

    static async getReportById(id: string): Promise<Report | null> {
        await this.ready()
        return reports.get(id) || null
    }

    static async createReport(data: ReportInput & { reporterId: string }): Promise<Report> {
        await this.ready()
        const id = nextReportId()
        const report: Report = {
            id,
            reporterId: data.reporterId,
            grieferName: data.grieferName,
            game: data.game,
            description: data.description,
            evidenceUrl: data.evidenceUrl,
            status: 'Under Review',
            severity: data.severity,
            server: data.server,
            tags: data.tags || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        reports.set(id, report)
        return report
    }

    static async updateReport(id: string, data: Partial<ReportInput>): Promise<Report> {
        await this.ready()
        const report = reports.get(id)
        if (!report) throw new Error('Report not found')

        if (data.grieferName) report.grieferName = data.grieferName
        if (data.game) report.game = data.game
        if (data.description) report.description = data.description
        if (data.evidenceUrl) report.evidenceUrl = data.evidenceUrl
        if (data.severity) report.severity = data.severity
        if (data.server) report.server = data.server
        if (data.tags) report.tags = data.tags
        report.updatedAt = new Date()

        reports.set(id, report)
        return report
    }

    static async deleteReport(id: string): Promise<void> {
        await this.ready()
        reports.delete(id)
    }

    static async updateReportStatus(id: string, status: Report['status']): Promise<Report> {
        await this.ready()
        const report = reports.get(id)
        if (!report) throw new Error('Report not found')
        report.status = status
        report.updatedAt = new Date()
        reports.set(id, report)
        return report
    }

    static async getReportsByUserId(userId: string): Promise<Report[]> {
        await this.ready()
        return Array.from(reports.values())
            .filter(r => r.reporterId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    static async getRecentReportsByUserId(userId: string, limit: number = 5): Promise<Report[]> {
        const all = await this.getReportsByUserId(userId)
        return all.slice(0, limit)
    }

    // ---------- USERS ----------

    static async getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
        await this.ready()
        for (const u of users.values()) {
            if (u.email === email) {
                return {
                    id: u.id, username: u.username, email: u.email,
                    role: u.role, createdAt: u.createdAt, password: u.password,
                }
            }
        }
        return null
    }

    static async createUser(data: UserInput & { hashedPassword: string }): Promise<User> {
        await this.ready()
        const id = nextUserId()
        const user: StoredUser = {
            id, username: data.username, email: data.email,
            role: 'user', password: data.hashedPassword, createdAt: new Date(),
        }
        users.set(id, user)
        return { id: user.id, username: user.username, email: user.email, role: user.role, createdAt: user.createdAt }
    }

    static async getUserById(id: string): Promise<User | null> {
        await this.ready()
        const u = users.get(id)
        if (!u) return null
        return { id: u.id, username: u.username, email: u.email, role: u.role, createdAt: u.createdAt }
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        await this.ready()
        for (const u of users.values()) {
            if (u.username === username) {
                return { id: u.id, username: u.username, email: u.email, role: u.role, createdAt: u.createdAt }
            }
        }
        return null
    }

    static async getAllUsers(): Promise<User[]> {
        await this.ready()
        return Array.from(users.values())
            .map(u => ({ id: u.id, username: u.username, email: u.email, role: u.role, createdAt: u.createdAt }))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    static async updateUserRole(id: string, role: User['role']): Promise<User> {
        await this.ready()
        const u = users.get(id)
        if (!u) throw new Error('User not found')
        u.role = role
        users.set(id, u)
        return { id: u.id, username: u.username, email: u.email, role: u.role, createdAt: u.createdAt }
    }

    static async getUserStats(userId: string): Promise<UserStats> {
        await this.ready()
        const userReports = Array.from(reports.values()).filter(r => r.reporterId === userId)
        const userComments = Array.from(comments.values()).filter(c => c.authorId === userId)

        const verifiedReports = userReports.filter(r => r.status === 'Verified').length
        const underReviewReports = userReports.filter(r => r.status === 'Under Review').length
        const resolvedReports = userReports.filter(r => r.status === 'Resolved').length
        const rejectedReports = userReports.filter(r => r.status === 'Rejected').length

        const reputationScore = (verifiedReports * 10) + (userComments.length * 2) - (rejectedReports * 5)

        const user = users.get(userId)

        return {
            totalReports: userReports.length,
            verifiedReports,
            underReviewReports,
            resolvedReports,
            rejectedReports,
            totalComments: userComments.length,
            reputationScore: Math.max(0, reputationScore),
            joinDate: user?.createdAt || new Date(),
        }
    }

    static async updateUserProfile(userId: string, data: UserProfileUpdate): Promise<void> {
        await this.ready()
        const u = users.get(userId)
        if (!u) throw new Error('User not found')

        if (data.bio !== undefined) u.bio = data.bio
        if (data.avatar !== undefined) u.avatar = data.avatar
        if (data.location !== undefined) u.location = data.location
        if (data.website !== undefined) u.website = data.website
        if (data.discord !== undefined) u.discord = data.discord
        if (data.steam !== undefined) u.steam = data.steam

        users.set(userId, u)
    }

    static async getUserProfile(userId: string): Promise<UserProfile | null> {
        await this.ready()
        const u = users.get(userId)
        if (!u) return null

        const stats = await this.getUserStats(userId)

        return {
            id: u.id, username: u.username, email: u.email, role: u.role, createdAt: u.createdAt,
            bio: u.bio, avatar: u.avatar, location: u.location,
            website: u.website, discord: u.discord, steam: u.steam,
            reputationScore: stats.reputationScore,
            totalReports: stats.totalReports,
            verifiedReports: stats.verifiedReports,
            totalComments: stats.totalComments,
        }
    }

    // ---------- COMMENTS ----------

    static async getCommentsByReportId(reportId: string): Promise<Comment[]> {
        await this.ready()
        return Array.from(comments.values())
            .filter(c => c.reportId === reportId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    static async createComment(
        data: CommentInput & { authorId: string; authorUsername: string; authorRole: string }
    ): Promise<Comment> {
        await this.ready()
        const id = nextCommentId()
        const comment: Comment = {
            id,
            reportId: data.reportId,
            authorId: data.authorId,
            authorUsername: data.authorUsername,
            authorRole: data.authorRole as Comment['authorRole'],
            content: data.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            isEdited: false,
        }
        comments.set(id, comment)
        return comment
    }

    static async updateComment(id: string, content: string): Promise<Comment> {
        await this.ready()
        const c = comments.get(id)
        if (!c) throw new Error('Comment not found')
        c.content = content
        c.updatedAt = new Date()
        c.isEdited = true
        comments.set(id, c)
        return c
    }

    static async deleteComment(id: string): Promise<void> {
        await this.ready()
        comments.delete(id)
    }

    static async getCommentById(id: string): Promise<Comment | null> {
        await this.ready()
        return comments.get(id) || null
    }

    static async getRecentCommentsByUserId(userId: string, limit: number = 5): Promise<Comment[]> {
        await this.ready()
        return Array.from(comments.values())
            .filter(c => c.authorId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit)
    }

    // ---------- GRIEFER PROFILES (Phase 6) ----------

    static async getReportsByGrieferName(name: string): Promise<Report[]> {
        await this.ready()
        const lower = name.toLowerCase()
        return Array.from(reports.values())
            .filter(r => r.grieferName.toLowerCase() === lower)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    static async getGrieferStats(name: string): Promise<{
        totalReports: number
        severityBreakdown: Record<string, number>
        gameBreakdown: Record<string, number>
        statusBreakdown: Record<string, number>
        firstReported: string | null
        lastReported: string | null
        riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
    }> {
        const reps = await this.getReportsByGrieferName(name)

        const severityBreakdown: Record<string, number> = {}
        const gameBreakdown: Record<string, number> = {}
        const statusBreakdown: Record<string, number> = {}

        for (const r of reps) {
            severityBreakdown[r.severity] = (severityBreakdown[r.severity] || 0) + 1
            gameBreakdown[r.game] = (gameBreakdown[r.game] || 0) + 1
            statusBreakdown[r.status] = (statusBreakdown[r.status] || 0) + 1
        }

        const dates = reps.map(r => new Date(r.createdAt).getTime()).sort((a, b) => a - b)

        return {
            totalReports: reps.length,
            severityBreakdown,
            gameBreakdown,
            statusBreakdown,
            firstReported: dates.length > 0 ? new Date(dates[0]).toISOString() : null,
            lastReported: dates.length > 0 ? new Date(dates[dates.length - 1]).toISOString() : null,
            riskLevel: this.calculateGrieferRiskLevel(reps.length, severityBreakdown),
        }
    }

    static calculateGrieferRiskLevel(
        totalReports: number,
        severityBreakdown: Record<string, number>
    ): 'Low' | 'Medium' | 'High' | 'Critical' {
        const criticalCount = severityBreakdown['Critical'] || 0
        const highCount = severityBreakdown['High'] || 0

        if (criticalCount >= 2 || totalReports >= 10) return 'Critical'
        if (criticalCount >= 1 || highCount >= 3 || totalReports >= 5) return 'High'
        if (highCount >= 1 || totalReports >= 3) return 'Medium'
        return 'Low'
    }

    // ---------- ANALYTICS (Phase 6) ----------

    static async getAnalyticsOverview(): Promise<{
        totalReports: number
        reportsByStatus: Record<string, number>
        reportsBySeverity: Record<string, number>
        reportsByGame: Record<string, number>
        totalUsers: number
        totalComments: number
    }> {
        await this.ready()

        const reportsByStatus: Record<string, number> = {}
        const reportsBySeverity: Record<string, number> = {}
        const reportsByGame: Record<string, number> = {}

        for (const r of reports.values()) {
            reportsByStatus[r.status] = (reportsByStatus[r.status] || 0) + 1
            reportsBySeverity[r.severity] = (reportsBySeverity[r.severity] || 0) + 1
            reportsByGame[r.game] = (reportsByGame[r.game] || 0) + 1
        }

        return {
            totalReports: reports.size,
            reportsByStatus,
            reportsBySeverity,
            reportsByGame,
            totalUsers: users.size,
            totalComments: comments.size,
        }
    }

    static async getTopReporters(limit: number = 10): Promise<Array<{
        userId: string
        username: string
        verifiedReports: number
        totalReports: number
    }>> {
        await this.ready()

        const reportCounts = new Map<string, { verified: number; total: number }>()
        for (const r of reports.values()) {
            const counts = reportCounts.get(r.reporterId) || { verified: 0, total: 0 }
            counts.total++
            if (r.status === 'Verified') counts.verified++
            reportCounts.set(r.reporterId, counts)
        }

        return Array.from(reportCounts.entries())
            .map(([userId, counts]) => {
                const u = users.get(userId)
                return {
                    userId,
                    username: u?.username || 'Unknown',
                    verifiedReports: counts.verified,
                    totalReports: counts.total,
                }
            })
            .sort((a, b) => b.verifiedReports - a.verifiedReports)
            .slice(0, limit)
    }

    static async getRecentActivity(limit: number = 10): Promise<Array<{
        type: 'report' | 'comment'
        id: string
        summary: string
        createdAt: string
    }>> {
        await this.ready()

        const items: Array<{ type: 'report' | 'comment'; id: string; summary: string; createdAt: string }> = []

        for (const r of reports.values()) {
            items.push({
                type: 'report', id: r.id,
                summary: `Report on "${r.grieferName}" in ${r.game}`,
                createdAt: new Date(r.createdAt).toISOString(),
            })
        }

        for (const c of comments.values()) {
            items.push({
                type: 'comment', id: c.id,
                summary: `Comment by ${c.authorUsername}: "${c.content.slice(0, 80)}"`,
                createdAt: new Date(c.createdAt).toISOString(),
            })
        }

        return items
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit)
    }

    // ---------- NOTIFICATIONS (Phase 6) ----------

    static async createNotification(data: {
        userId: string
        type: NotificationType
        title: string
        message: string
        relatedReportId?: string
    }): Promise<Notification> {
        await this.ready()
        const id = nextNotificationId()
        const notif: Notification = {
            id,
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            relatedReportId: data.relatedReportId,
            isRead: false,
            createdAt: new Date(),
        }
        notifications.set(id, notif)
        return notif
    }

    static async getUserNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
        await this.ready()
        return Array.from(notifications.values())
            .filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit)
    }

    static async markNotificationRead(id: string): Promise<void> {
        await this.ready()
        const n = notifications.get(id)
        if (n) { n.isRead = true; notifications.set(id, n) }
    }

    static async markAllNotificationsRead(userId: string): Promise<void> {
        await this.ready()
        for (const n of notifications.values()) {
            if (n.userId === userId && !n.isRead) {
                n.isRead = true
                notifications.set(n.id, n)
            }
        }
    }

    static async getUnreadNotificationCount(userId: string): Promise<number> {
        await this.ready()
        let count = 0
        for (const n of notifications.values()) {
            if (n.userId === userId && !n.isRead) count++
        }
        return count
    }

    // ---------- API KEYS (Phase 8) ----------

    static async createApiKey(userId: string, data: ApiKeyInput): Promise<ApiKeyWithKey> {
        await this.ready()
        const rawKey = `ghk_${randomBytes(32).toString('hex')}`
        const keyPrefix = rawKey.substring(0, 12)
        const hashedKey = await bcrypt.hash(rawKey, 10)
        const scopes = data.scopes || ['reports:read']
        const rateLimit = data.rateLimit || 100

        const id = nextApiKeyId()
        const stored: StoredApiKey = {
            id, userId, name: data.name, keyPrefix, hashedKey,
            scopes, rateLimit, usageCount: 0,
            lastUsed: null, expiresAt: data.expiresAt || null,
            isActive: true, createdAt: new Date(),
        }
        apiKeys.set(id, stored)

        const { hashedKey: _, ...rest } = stored
        return { ...rest, key: rawKey }
    }

    static async getApiKeysByUserId(userId: string): Promise<ApiKeyListItem[]> {
        await this.ready()
        return Array.from(apiKeys.values())
            .filter(k => k.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(({ hashedKey, ...rest }) => rest)
    }

    static async verifyApiKey(rawKey: string): Promise<ApiKey | null> {
        await this.ready()
        for (const k of apiKeys.values()) {
            if (!k.isActive) continue
            const isMatch = await bcrypt.compare(rawKey, k.hashedKey)
            if (isMatch) {
                if (k.expiresAt && new Date(k.expiresAt) < new Date()) return null
                k.usageCount++
                k.lastUsed = new Date()
                apiKeys.set(k.id, k)
                return { ...k }
            }
        }
        return null
    }

    static async revokeApiKey(keyId: string, userId: string): Promise<void> {
        await this.ready()
        const k = apiKeys.get(keyId)
        if (!k) throw new Error('API key not found')
        if (k.userId !== userId) throw new Error('Unauthorized to revoke this key')
        k.isActive = false
        apiKeys.set(keyId, k)
    }

    static async getApiKeyById(keyId: string): Promise<ApiKeyListItem | null> {
        await this.ready()
        const k = apiKeys.get(keyId)
        if (!k) return null
        const { hashedKey, ...rest } = k
        return rest
    }

    static async deleteApiKey(keyId: string): Promise<void> {
        await this.ready()
        apiKeys.delete(keyId)
    }
}
