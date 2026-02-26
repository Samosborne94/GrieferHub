import { base, TABLES } from '../airtable-client'
import type { Report, ReportInput, ReportFilters } from '@/types/report'
import type { User, UserInput, UserProfile, UserProfileUpdate, UserStats } from '@/types/user'
import type { Comment, CommentInput } from '@/types/comment'
import type { ApiKey, ApiKeyInput, ApiKeyWithKey, ApiKeyListItem } from '@/types/apiKey'
import type { FieldSet, Records } from 'airtable'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

/**
 * Transform Airtable record to Report object
 */
function transformReport(record: any): Report {
    return {
        id: record.id,
        reporterId: record.get('reporter_id'),
        grieferName: record.get('griefer_name'),
        game: record.get('game'),
        description: record.get('description'),
        evidenceUrl: record.get('evidence_url'),
        status: record.get('status'),
        severity: record.get('severity'),
        server: record.get('server'),
        tags: record.get('tags') || [],
        createdAt: new Date(record.get('created_at')),
        updatedAt: new Date(record.get('updated_at')),
    }
}

/**
 * Transform Airtable record to User object
 */
function transformUser(record: any): User {
    return {
        id: record.id,
        username: record.get('username'),
        email: record.get('email'),
        role: record.get('role') || 'user',
        createdAt: new Date(record.get('created_at')),
    }
}

/**
 * Transform Airtable record to Comment object
 */
function transformComment(record: any): Comment {
    return {
        id: record.id,
        reportId: record.get('report_id'),
        authorId: record.get('author_id'),
        authorUsername: record.get('author_username'),
        authorRole: record.get('author_role') || 'user',
        content: record.get('content'),
        createdAt: new Date(record.get('created_at')),
        updatedAt: new Date(record.get('updated_at')),
        isEdited: record.get('is_edited') || false,
    }
}

/**
 * Transform Airtable record to ApiKey object (without actual key)
 */
function transformApiKey(record: any): ApiKeyListItem {
    const lastUsed = record.get('last_used')
    const expiresAt = record.get('expires_at')

    return {
        id: record.id,
        userId: record.get('user_id'),
        name: record.get('name'),
        keyPrefix: record.get('key_prefix'),
        scopes: record.get('scopes') || [],
        rateLimit: record.get('rate_limit') || 100,
        usageCount: record.get('usage_count') || 0,
        lastUsed: lastUsed ? new Date(lastUsed) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: record.get('is_active') || false,
        createdAt: new Date(record.get('created_at')),
    } as ApiKeyListItem
}

export class AirtableService {
    /**
     * Get reports with optional filtering
     */
    static async getReports(filters?: ReportFilters): Promise<Report[]> {
        try {
            let query = base(TABLES.REPORTS).select({
                sort: [{ field: 'created_at', direction: 'desc' }],
            })

            // Build filter formula
            const filterFormulas: string[] = []

            if (filters?.game) {
                filterFormulas.push(`{game} = '${filters.game}'`)
            }

            if (filters?.status) {
                filterFormulas.push(`{status} = '${filters.status}'`)
            }

            if (filters?.severity) {
                filterFormulas.push(`{severity} = '${filters.severity}'`)
            }

            if (filters?.search) {
                filterFormulas.push(
                    `OR(FIND(LOWER('${filters.search}'), LOWER({griefer_name})), FIND(LOWER('${filters.search}'), LOWER({description})))`
                )
            }

            if (filterFormulas.length > 0) {
                query = base(TABLES.REPORTS).select({
                    filterByFormula: `AND(${filterFormulas.join(', ')})`,
                    sort: [{ field: 'created_at', direction: 'desc' }],
                })
            }

            const records = await query.all()
            return records.map(transformReport)
        } catch (error) {
            console.error('Error fetching reports:', error)
            throw new Error('Failed to fetch reports')
        }
    }

    /**
     * Get a single report by ID
     */
    static async getReportById(id: string): Promise<Report | null> {
        try {
            const record = await base(TABLES.REPORTS).find(id)
            return transformReport(record)
        } catch (error) {
            console.error('Error fetching report:', error)
            return null
        }
    }

    /**
     * Create a new report
     */
    static async createReport(data: ReportInput & { reporterId: string }): Promise<Report> {
        try {
            const record = await base(TABLES.REPORTS).create({
                reporter_id: data.reporterId,
                griefer_name: data.grieferName,
                game: data.game,
                description: data.description,
                evidence_url: data.evidenceUrl,
                severity: data.severity,
                status: 'Under Review',
                server: data.server,
                tags: data.tags,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })

            return transformReport(record)
        } catch (error) {
            console.error('Error creating report:', error)
            throw new Error('Failed to create report')
        }
    }

    /**
     * Update a report
     */
    static async updateReport(id: string, data: Partial<ReportInput>): Promise<Report> {
        try {
            const updateData: any = {
                updated_at: new Date().toISOString(),
            }

            if (data.grieferName) updateData.griefer_name = data.grieferName
            if (data.game) updateData.game = data.game
            if (data.description) updateData.description = data.description
            if (data.evidenceUrl) updateData.evidence_url = data.evidenceUrl
            if (data.severity) updateData.severity = data.severity
            if (data.server) updateData.server = data.server
            if (data.tags) updateData.tags = data.tags

            const record = await base(TABLES.REPORTS).update(id, updateData)
            return transformReport(record)
        } catch (error) {
            console.error('Error updating report:', error)
            throw new Error('Failed to update report')
        }
    }

    /**
     * Delete a report
     */
    static async deleteReport(id: string): Promise<void> {
        try {
            await base(TABLES.REPORTS).destroy(id)
        } catch (error) {
            console.error('Error deleting report:', error)
            throw new Error('Failed to delete report')
        }
    }

    /**
     * Get user by email (for authentication)
     */
    static async getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
        try {
            const records = await base(TABLES.USERS)
                .select({
                    filterByFormula: `{email} = '${email}'`,
                    maxRecords: 1,
                })
                .all()

            if (records.length === 0) return null

            const record = records[0]
            return {
                ...transformUser(record),
                password: record.get('password') as string,
            }
        } catch (error) {
            console.error('Error fetching user by email:', error)
            return null
        }
    }

    /**
     * Create a new user (for registration)
     */
    static async createUser(data: UserInput & { hashedPassword: string }): Promise<User> {
        try {
            const record = await base(TABLES.USERS).create({
                username: data.username,
                email: data.email,
                password: data.hashedPassword,
                role: 'user',
                created_at: new Date().toISOString(),
            })

            return transformUser(record)
        } catch (error) {
            console.error('Error creating user:', error)
            throw new Error('Failed to create user')
        }
    }

    /**
     * Get reports by user ID
     */
    static async getReportsByUserId(userId: string): Promise<Report[]> {
        try {
            const records = await base(TABLES.REPORTS)
                .select({
                    filterByFormula: `{reporter_id} = '${userId}'`,
                    sort: [{ field: 'created_at', direction: 'desc' }],
                })
                .all()

            return records.map(transformReport)
        } catch (error) {
            console.error('Error fetching user reports:', error)
            throw new Error('Failed to fetch user reports')
        }
    }

    /**
     * Get recent reports by user (limited)
     */
    static async getRecentReportsByUserId(userId: string, limit: number = 5): Promise<Report[]> {
        try {
            const records = await base(TABLES.REPORTS)
                .select({
                    filterByFormula: `{reporter_id} = '${userId}'`,
                    sort: [{ field: 'created_at', direction: 'desc' }],
                    maxRecords: limit,
                })
                .all()

            return records.map(transformReport)
        } catch (error) {
            console.error('Error fetching recent user reports:', error)
            throw new Error('Failed to fetch recent user reports')
        }
    }

    /**
     * Get recent comments by user (limited)
     */
    static async getRecentCommentsByUserId(userId: string, limit: number = 5): Promise<Comment[]> {
        try {
            const records = await base(TABLES.COMMENTS)
                .select({
                    filterByFormula: `{author_id} = '${userId}'`,
                    sort: [{ field: 'created_at', direction: 'desc' }],
                    maxRecords: limit,
                })
                .all()

            return records.map(transformComment)
        } catch (error) {
            console.error('Error fetching recent user comments:', error)
            throw new Error('Failed to fetch recent user comments')
        }
    }

    /**
     * Update report status (moderator/admin only)
     */
    static async updateReportStatus(
        id: string,
        status: Report['status']
    ): Promise<Report> {
        try {
            const record = await base(TABLES.REPORTS).update(id, {
                status,
                updated_at: new Date().toISOString(),
            })

            return transformReport(record)
        } catch (error) {
            console.error('Error updating report status:', error)
            throw new Error('Failed to update report status')
        }
    }

    /**
     * Get user by ID
     */
    static async getUserById(id: string): Promise<User | null> {
        try {
            const record = await base(TABLES.USERS).find(id)
            return transformUser(record)
        } catch (error) {
            console.error('Error fetching user:', error)
            return null
        }
    }

    /**
     * Get all users (admin only)
     */
    static async getAllUsers(): Promise<User[]> {
        try {
            const records = await base(TABLES.USERS)
                .select({
                    sort: [{ field: 'created_at', direction: 'desc' }],
                })
                .all()

            return records.map(transformUser)
        } catch (error) {
            console.error('Error fetching users:', error)
            throw new Error('Failed to fetch users')
        }
    }

    /**
     * Update user role (admin only)
     */
    static async updateUserRole(id: string, role: User['role']): Promise<User> {
        try {
            const record = await base(TABLES.USERS).update(id, {
                role,
            })

            return transformUser(record)
        } catch (error) {
            console.error('Error updating user role:', error)
            throw new Error('Failed to update user role')
        }
    }

    /**
     * Get comments for a report
     */
    static async getCommentsByReportId(reportId: string): Promise<Comment[]> {
        try {
            const records = await base(TABLES.COMMENTS)
                .select({
                    filterByFormula: `{report_id} = '${reportId}'`,
                    sort: [{ field: 'created_at', direction: 'desc' }],
                })
                .all()

            return records.map(transformComment)
        } catch (error) {
            console.error('Error fetching comments:', error)
            throw new Error('Failed to fetch comments')
        }
    }

    /**
     * Create a new comment
     */
    static async createComment(
        data: CommentInput & { authorId: string; authorUsername: string; authorRole: string }
    ): Promise<Comment> {
        try {
            const record = await base(TABLES.COMMENTS).create({
                report_id: data.reportId,
                author_id: data.authorId,
                author_username: data.authorUsername,
                author_role: data.authorRole,
                content: data.content,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_edited: false,
            })

            return transformComment(record)
        } catch (error) {
            console.error('Error creating comment:', error)
            throw new Error('Failed to create comment')
        }
    }

    /**
     * Update a comment
     */
    static async updateComment(id: string, content: string): Promise<Comment> {
        try {
            const record = await base(TABLES.COMMENTS).update(id, {
                content,
                updated_at: new Date().toISOString(),
                is_edited: true,
            })

            return transformComment(record)
        } catch (error) {
            console.error('Error updating comment:', error)
            throw new Error('Failed to update comment')
        }
    }

    /**
     * Delete a comment
     */
    static async deleteComment(id: string): Promise<void> {
        try {
            await base(TABLES.COMMENTS).destroy(id)
        } catch (error) {
            console.error('Error deleting comment:', error)
            throw new Error('Failed to delete comment')
        }
    }

    /**
     * Get a single comment by ID
     */
    static async getCommentById(id: string): Promise<Comment | null> {
        try {
            const record = await base(TABLES.COMMENTS).find(id)
            return transformComment(record)
        } catch (error) {
            console.error('Error fetching comment:', error)
            return null
        }
    }

    /**
     * Get user profile by username
     */
    static async getUserByUsername(username: string): Promise<User | null> {
        try {
            const records = await base(TABLES.USERS)
                .select({
                    filterByFormula: `{username} = '${username}'`,
                    maxRecords: 1,
                })
                .all()

            if (records.length === 0) return null
            return transformUser(records[0])
        } catch (error) {
            console.error('Error fetching user by username:', error)
            return null
        }
    }

    /**
     * Get user statistics (reports, comments, reputation)
     */
    static async getUserStats(userId: string): Promise<UserStats> {
        try {
            // Get all reports by user
            const reports = await this.getReportsByUserId(userId)

            // Get all comments by user
            const comments = await base(TABLES.COMMENTS)
                .select({
                    filterByFormula: `{author_id} = '${userId}'`,
                })
                .all()

            // Calculate stats
            const verifiedReports = reports.filter(r => r.status === 'Verified').length
            const underReviewReports = reports.filter(r => r.status === 'Under Review').length
            const resolvedReports = reports.filter(r => r.status === 'Resolved').length
            const rejectedReports = reports.filter(r => r.status === 'Rejected').length

            // Calculate reputation score (simple formula)
            const reputationScore = (verifiedReports * 10) + (comments.length * 2) - (rejectedReports * 5)

            // Get user to get join date
            const user = await this.getUserById(userId)

            return {
                totalReports: reports.length,
                verifiedReports,
                underReviewReports,
                resolvedReports,
                rejectedReports,
                totalComments: comments.length,
                reputationScore: Math.max(0, reputationScore), // Never negative
                joinDate: user?.createdAt || new Date(),
            }
        } catch (error) {
            console.error('Error calculating user stats:', error)
            throw new Error('Failed to calculate user stats')
        }
    }

    /**
     * Update user profile
     */
    static async updateUserProfile(
        userId: string,
        data: UserProfileUpdate
    ): Promise<void> {
        try {
            const updateData: any = {}

            if (data.bio !== undefined) updateData.bio = data.bio
            if (data.avatar !== undefined) updateData.avatar = data.avatar
            if (data.location !== undefined) updateData.location = data.location
            if (data.website !== undefined) updateData.website = data.website
            if (data.discord !== undefined) updateData.discord = data.discord
            if (data.steam !== undefined) updateData.steam = data.steam

            await base(TABLES.USERS).update(userId, updateData)
        } catch (error) {
            console.error('Error updating user profile:', error)
            throw new Error('Failed to update user profile')
        }
    }

    /**
     * Get full user profile with stats
     */
    static async getUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const user = await this.getUserById(userId)
            if (!user) return null

            const stats = await this.getUserStats(userId)

            // Get profile fields from user record
            const record = await base(TABLES.USERS).find(userId)

            return {
                ...user,
                bio: record.get('bio') as string || undefined,
                avatar: record.get('avatar') as string || undefined,
                location: record.get('location') as string || undefined,
                website: record.get('website') as string || undefined,
                discord: record.get('discord') as string || undefined,
                steam: record.get('steam') as string || undefined,
                reputationScore: stats.reputationScore,
                totalReports: stats.totalReports,
                verifiedReports: stats.verifiedReports,
                totalComments: stats.totalComments,
            }
        } catch (error) {
            console.error('Error fetching user profile:', error)
            return null
        }
    }

    // ===== API KEY MANAGEMENT (Phase 8) =====

    /**
     * Generate a new API key
     * Returns the unhashed key only once
     */
    static async createApiKey(
        userId: string,
        data: ApiKeyInput
    ): Promise<ApiKeyWithKey> {
        try {
            // Generate random API key
            const rawKey = `ghk_${randomBytes(32).toString('hex')}`
            const keyPrefix = rawKey.substring(0, 12) // "ghk_abcd..." for display

            // Hash the key for storage
            const hashedKey = await bcrypt.hash(rawKey, 10)

            // Default values
            const scopes = data.scopes || ['reports:read']
            const rateLimit = data.rateLimit || 100 // 100 requests per minute default

            // Create record
            const record = await base(TABLES.API_KEYS).create({
                user_id: userId,
                name: data.name,
                key_prefix: keyPrefix,
                hashed_key: hashedKey,
                scopes: scopes,
                rate_limit: rateLimit,
                usage_count: 0,
                last_used: null,
                expires_at: data.expiresAt?.toISOString() || null,
                is_active: true,
                created_at: new Date().toISOString(),
            })

            const apiKey = transformApiKey(record)

            // Return with unhashed key (only time it's visible)
            return {
                ...apiKey,
                key: rawKey,
            }
        } catch (error) {
            console.error('Error creating API key:', error)
            throw new Error('Failed to create API key')
        }
    }

    /**
     * Get all API keys for a user (without actual key values)
     */
    static async getApiKeysByUserId(userId: string): Promise<ApiKeyListItem[]> {
        try {
            const records = await base(TABLES.API_KEYS)
                .select({
                    filterByFormula: `{user_id} = '${userId}'`,
                    sort: [{ field: 'created_at', direction: 'desc' }],
                })
                .all()

            return records.map(transformApiKey)
        } catch (error) {
            console.error('Error fetching API keys:', error)
            throw new Error('Failed to fetch API keys')
        }
    }

    /**
     * Verify and get API key by raw key value
     */
    static async verifyApiKey(rawKey: string): Promise<ApiKey | null> {
        try {
            // Get all active keys
            const records = await base(TABLES.API_KEYS)
                .select({
                    filterByFormula: `{is_active} = TRUE()`,
                })
                .all()

            // Check each key hash
            for (const record of records) {
                const hashedKey = record.get('hashed_key') as string
                const isMatch = await bcrypt.compare(rawKey, hashedKey)

                if (isMatch) {
                    // Check if expired
                    const expiresAt = record.get('expires_at')
                    if (expiresAt && new Date(expiresAt) < new Date()) {
                        return null // Expired
                    }

                    // Update usage
                    await base(TABLES.API_KEYS).update(record.id, {
                        usage_count: (record.get('usage_count') as number || 0) + 1,
                        last_used: new Date().toISOString(),
                    })

                    const lastUsed = record.get('last_used')
                    const expires = record.get('expires_at')

                    return {
                        id: record.id,
                        userId: record.get('user_id') as string,
                        name: record.get('name') as string,
                        keyPrefix: record.get('key_prefix') as string,
                        hashedKey: hashedKey,
                        scopes: record.get('scopes') as any[] || [],
                        rateLimit: record.get('rate_limit') as number || 100,
                        usageCount: (record.get('usage_count') as number || 0) + 1,
                        lastUsed: lastUsed ? new Date(lastUsed as string) : null,
                        expiresAt: expires ? new Date(expires as string) : null,
                        isActive: true,
                        createdAt: new Date(record.get('created_at') as string),
                    }
                }
            }

            return null // No match found
        } catch (error) {
            console.error('Error verifying API key:', error)
            return null
        }
    }

    /**
     * Revoke (deactivate) an API key
     */
    static async revokeApiKey(keyId: string, userId: string): Promise<void> {
        try {
            // Verify ownership
            const record = await base(TABLES.API_KEYS).find(keyId)
            const keyUserId = record.get('user_id') as string

            if (keyUserId !== userId) {
                throw new Error('Unauthorized to revoke this key')
            }

            // Deactivate instead of delete (for audit trail)
            await base(TABLES.API_KEYS).update(keyId, {
                is_active: false,
            })
        } catch (error) {
            console.error('Error revoking API key:', error)
            throw new Error('Failed to revoke API key')
        }
    }

    /**
     * Get API key by ID (for admin purposes)
     */
    static async getApiKeyById(keyId: string): Promise<ApiKeyListItem | null> {
        try {
            const record = await base(TABLES.API_KEYS).find(keyId)
            return transformApiKey(record)
        } catch (error) {
            console.error('Error fetching API key:', error)
            return null
        }
    }

    /**
     * Delete API key permanently (admin only)
     */
    static async deleteApiKey(keyId: string): Promise<void> {
        try {
            await base(TABLES.API_KEYS).destroy(keyId)
        } catch (error) {
            console.error('Error deleting API key:', error)
            throw new Error('Failed to delete API key')
        }
    }
}
