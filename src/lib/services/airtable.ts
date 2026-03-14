import type { Report, ReportInput, ReportFilters } from '@/types/report'
import type { User, UserInput, UserProfile, UserProfileUpdate, UserStats } from '@/types/user'
import type { Comment, CommentInput } from '@/types/comment'
import type { ApiKey, ApiKeyInput, ApiKeyWithKey, ApiKeyListItem } from '@/types/apiKey'
import type { Notification, NotificationType } from '@/types/notification'

type AirtableServiceModule = typeof import('@/lib/services/airtable-real')
type AirtableServiceClass = AirtableServiceModule['AirtableService']

function isMockDataEnabled() {
    return process.env.USE_MOCK_DATA === 'true'
}

async function getAirtableService(): Promise<AirtableServiceClass> {
    const serviceModule = isMockDataEnabled()
        ? await import('@/lib/services/airtable-mock')
        : await import('@/lib/services/airtable-real')

    return serviceModule.AirtableService
}

export class AirtableService {
    static async getReports(filters?: ReportFilters): Promise<Report[]> {
        const service = await getAirtableService()
        return service.getReports(filters)
    }

    static async getReportById(id: string): Promise<Report | null> {
        const service = await getAirtableService()
        return service.getReportById(id)
    }

    static async createReport(data: ReportInput & { reporterId: string }): Promise<Report> {
        const service = await getAirtableService()
        return service.createReport(data)
    }

    static async updateReport(id: string, data: Partial<ReportInput>): Promise<Report> {
        const service = await getAirtableService()
        return service.updateReport(id, data)
    }

    static async deleteReport(id: string): Promise<void> {
        const service = await getAirtableService()
        return service.deleteReport(id)
    }

    static async getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
        const service = await getAirtableService()
        return service.getUserByEmail(email)
    }

    static async createUser(data: UserInput & { hashedPassword: string }): Promise<User> {
        const service = await getAirtableService()
        return service.createUser(data)
    }

    static async getReportsByUserId(userId: string): Promise<Report[]> {
        const service = await getAirtableService()
        return service.getReportsByUserId(userId)
    }

    static async getRecentReportsByUserId(userId: string, limit: number = 5): Promise<Report[]> {
        const service = await getAirtableService()
        return service.getRecentReportsByUserId(userId, limit)
    }

    static async getRecentCommentsByUserId(userId: string, limit: number = 5): Promise<Comment[]> {
        const service = await getAirtableService()
        return service.getRecentCommentsByUserId(userId, limit)
    }

    static async updateReportStatus(id: string, status: Report['status']): Promise<Report> {
        const service = await getAirtableService()
        return service.updateReportStatus(id, status)
    }

    static async getUserById(id: string): Promise<User | null> {
        const service = await getAirtableService()
        return service.getUserById(id)
    }

    static async getAllUsers(): Promise<User[]> {
        const service = await getAirtableService()
        return service.getAllUsers()
    }

    static async updateUserRole(id: string, role: User['role']): Promise<User> {
        const service = await getAirtableService()
        return service.updateUserRole(id, role)
    }

    static async getCommentsByReportId(reportId: string): Promise<Comment[]> {
        const service = await getAirtableService()
        return service.getCommentsByReportId(reportId)
    }

    static async createComment(
        data: CommentInput & { authorId: string; authorUsername: string; authorRole: string }
    ): Promise<Comment> {
        const service = await getAirtableService()
        return service.createComment(data)
    }

    static async updateComment(id: string, content: string): Promise<Comment> {
        const service = await getAirtableService()
        return service.updateComment(id, content)
    }

    static async deleteComment(id: string): Promise<void> {
        const service = await getAirtableService()
        return service.deleteComment(id)
    }

    static async getCommentById(id: string): Promise<Comment | null> {
        const service = await getAirtableService()
        return service.getCommentById(id)
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        const service = await getAirtableService()
        return service.getUserByUsername(username)
    }

    static async getUserStats(userId: string): Promise<UserStats> {
        const service = await getAirtableService()
        return service.getUserStats(userId)
    }

    static async updateUserProfile(userId: string, data: UserProfileUpdate): Promise<void> {
        const service = await getAirtableService()
        return service.updateUserProfile(userId, data)
    }

    static async getUserProfile(userId: string): Promise<UserProfile | null> {
        const service = await getAirtableService()
        return service.getUserProfile(userId)
    }

    static async getReportsByGrieferName(name: string): Promise<Report[]> {
        const service = await getAirtableService()
        return service.getReportsByGrieferName(name)
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
        const service = await getAirtableService()
        return service.getGrieferStats(name)
    }

    static calculateGrieferRiskLevel(
        totalReports: number,
        severityBreakdown: Record<string, number>
    ): 'Low' | 'Medium' | 'High' | 'Critical' {
        const criticalCount = severityBreakdown.Critical || 0
        const highCount = severityBreakdown.High || 0

        if (criticalCount >= 2 || totalReports >= 10) return 'Critical'
        if (criticalCount >= 1 || highCount >= 3 || totalReports >= 5) return 'High'
        if (highCount >= 1 || totalReports >= 3) return 'Medium'
        return 'Low'
    }

    static async getAnalyticsOverview(): Promise<{
        totalReports: number
        reportsByStatus: Record<string, number>
        reportsBySeverity: Record<string, number>
        reportsByGame: Record<string, number>
        totalUsers: number
        totalComments: number
    }> {
        const service = await getAirtableService()
        return service.getAnalyticsOverview()
    }

    static async getTopReporters(limit: number = 10): Promise<Array<{
        userId: string
        username: string
        verifiedReports: number
        totalReports: number
    }>> {
        const service = await getAirtableService()
        return service.getTopReporters(limit)
    }

    static async getRecentActivity(limit: number = 10): Promise<Array<{
        type: 'report' | 'comment'
        id: string
        summary: string
        createdAt: string
    }>> {
        const service = await getAirtableService()
        return service.getRecentActivity(limit)
    }

    static async createNotification(data: {
        userId: string
        type: NotificationType
        title: string
        message: string
        relatedReportId?: string
    }): Promise<Notification> {
        const service = await getAirtableService()
        return service.createNotification(data)
    }

    static async getUserNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
        const service = await getAirtableService()
        return service.getUserNotifications(userId, limit)
    }

    static async markNotificationRead(id: string): Promise<void> {
        const service = await getAirtableService()
        return service.markNotificationRead(id)
    }

    static async markAllNotificationsRead(userId: string): Promise<void> {
        const service = await getAirtableService()
        return service.markAllNotificationsRead(userId)
    }

    static async getUnreadNotificationCount(userId: string): Promise<number> {
        const service = await getAirtableService()
        return service.getUnreadNotificationCount(userId)
    }

    static async createApiKey(userId: string, data: ApiKeyInput): Promise<ApiKeyWithKey> {
        const service = await getAirtableService()
        return service.createApiKey(userId, data)
    }

    static async getApiKeysByUserId(userId: string): Promise<ApiKeyListItem[]> {
        const service = await getAirtableService()
        return service.getApiKeysByUserId(userId)
    }

    static async verifyApiKey(rawKey: string): Promise<ApiKey | null> {
        const service = await getAirtableService()
        return service.verifyApiKey(rawKey)
    }

    static async revokeApiKey(keyId: string, userId: string): Promise<void> {
        const service = await getAirtableService()
        return service.revokeApiKey(keyId, userId)
    }

    static async getApiKeyById(keyId: string): Promise<ApiKeyListItem | null> {
        const service = await getAirtableService()
        return service.getApiKeyById(keyId)
    }

    static async deleteApiKey(keyId: string): Promise<void> {
        const service = await getAirtableService()
        return service.deleteApiKey(keyId)
    }
}
