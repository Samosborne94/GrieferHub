import { base, TABLES } from '../airtable-client'
import type { Report, ReportInput, ReportFilters } from '@/types/report'
import type { User, UserInput } from '@/types/user'
import type { Comment, CommentInput } from '@/types/comment'
import type { FieldSet, Records } from 'airtable'

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
}
