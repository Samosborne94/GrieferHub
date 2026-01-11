import { base, TABLES } from '../airtable-client'
import type { Report, ReportInput, ReportFilters } from '@/types/report'
import type { User, UserInput } from '@/types/user'
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
}
