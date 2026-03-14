import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
    apiSuccess,
    getAuthenticatedUserId,
    handleApiError,
    parseJsonBody,
} from '@/lib/api/route'
import { notFound } from '@/lib/errors'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth } from '@/lib/auth'

// GET /api/reports/[id]/comments - Get all comments for a report
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const reportId = params.id

        const comments = await AirtableService.getCommentsByReportId(reportId)

        return apiSuccess(comments)
    } catch (error) {
        return handleApiError(error, request, 'Fetch report comments', { reportId: params.id })
    }
}

// POST /api/reports/[id]/comments - Create a new comment
const createCommentSchema = z.object({
    content: z.string().min(1).max(2000),
})

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth()
        const reportId = params.id
        const { content } = await parseJsonBody(request, createCommentSchema)

        // Check if report exists
        const report = await AirtableService.getReportById(reportId)
        if (!report) {
            throw notFound('Report not found')
        }

        // Get user details
        const user = await AirtableService.getUserById(getAuthenticatedUserId(session))
        if (!user) {
            throw notFound('User not found')
        }

        // Create comment
        const comment = await AirtableService.createComment({
            reportId,
            content,
            authorId: user.id,
            authorUsername: user.username,
            authorRole: user.role,
        })

        return apiSuccess(comment, { status: 201, message: 'Comment created successfully' })
    } catch (error) {
        return handleApiError(error, request, 'Create comment', { reportId: params.id })
    }
}
