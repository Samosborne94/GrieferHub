import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth } from '@/lib/auth'
import { publicLimiter, commentLimiter } from '@/lib/middleware/rateLimit'

// GET /api/reports/[id]/comments - Get all comments for a report
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const rateLimitResult = await publicLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        const reportId = params.id

        const comments = await AirtableService.getCommentsByReportId(reportId)

        return NextResponse.json({
            success: true,
            data: comments,
        })
    } catch (error) {
        console.error('Error fetching comments:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch comments',
            },
            { status: 500 }
        )
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
    const rateLimitResult = await commentLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        // Require authentication
        const session = await requireAuth()

        const reportId = params.id
        const body = await request.json()

        // Validate input
        const validationResult = createCommentSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: validationResult.error.issues[0].message,
                },
                { status: 400 }
            )
        }

        const { content } = validationResult.data

        // Check if report exists
        const report = await AirtableService.getReportById(reportId)
        if (!report) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Report not found',
                },
                { status: 404 }
            )
        }

        // Get user details
        const user = await AirtableService.getUserById(session.user?.id || '')
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            )
        }

        // Create comment
        const comment = await AirtableService.createComment({
            reportId,
            content,
            authorId: user.id,
            authorUsername: user.username,
            authorRole: user.role,
        })

        return NextResponse.json(
            {
                success: true,
                data: comment,
                message: 'Comment created successfully',
            },
            { status: 201 }
        )
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in to comment',
                },
                { status: 401 }
            )
        }

        console.error('Error creating comment:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create comment',
            },
            { status: 500 }
        )
    }
}
