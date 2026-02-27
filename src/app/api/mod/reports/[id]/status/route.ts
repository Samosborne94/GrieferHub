import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { requireModerator } from '@/lib/auth'

// PATCH /api/mod/reports/[id]/status - Update report status (moderator only)
const updateStatusSchema = z.object({
    status: z.enum(['Verified', 'Under Review', 'Resolved', 'Rejected']),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireModerator()

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

        const { status } = validationResult.data

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

        const oldStatus = report.status

        // Update status
        const updatedReport = await AirtableService.updateReportStatus(
            params.id,
            status
        )

        // Create notification for report author
        if (report.reporterId && oldStatus !== status) {
            try {
                const notificationType = status === 'Verified' ? 'report_verified' as const
                    : status === 'Rejected' ? 'report_rejected' as const
                    : 'report_status_change' as const

                await AirtableService.createNotification({
                    userId: report.reporterId,
                    type: notificationType,
                    title: status === 'Verified' ? 'Report Verified!'
                        : status === 'Rejected' ? 'Report Rejected'
                        : `Report Status: ${status}`,
                    message: `Your report on "${report.grieferName}" was changed from ${oldStatus} to ${status}.`,
                    relatedReportId: params.id,
                })
            } catch (notifError) {
                // Don't fail the status update if notification fails
                console.error('Failed to create notification:', notifError)
            }
        }

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
