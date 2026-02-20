import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { requireModerator } from '@/lib/auth'
import { authenticatedLimiter } from '@/lib/middleware/rateLimit'

// PATCH /api/mod/reports/[id]/status - Update report status (moderator only)
const updateStatusSchema = z.object({
    status: z.enum(['Verified', 'Under Review', 'Resolved', 'Rejected']),
    reviewNotes: z.string().max(2000).optional(),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const rateLimitResult = await authenticatedLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        const session = await requireModerator()

        const body = await request.json()
        const validationResult = updateStatusSchema.safeParse(body)

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

        const { status, reviewNotes } = validationResult.data

        // Check if report exists
        const report = await AirtableService.getReportById(params.id)
        if (!report) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Report not found',
                },
                { status: 404 }
            )
        }

        // Look up reviewer details
        const reviewerId = session.user?.id || ''
        const reviewer = await AirtableService.getUserById(reviewerId)

        // Update status with review metadata
        const updatedReport = await AirtableService.updateReportStatus(
            params.id,
            status,
            {
                reviewedBy: reviewerId,
                reviewedByName: reviewer?.username,
                reviewNotes,
            }
        )

        return NextResponse.json({
            success: true,
            data: updatedReport,
            message: `Report status updated to ${status}`,
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in',
                },
                { status: 401 }
            )
        }

        if (error.message === 'Forbidden') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden',
                    message: 'You must be a moderator or admin to update report status',
                },
                { status: 403 }
            )
        }

        console.error('Error updating report status:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update report status',
            },
            { status: 500 }
        )
    }
}
