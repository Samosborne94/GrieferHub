import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, handleApiError, parseJsonBody } from '@/lib/api/route'
import { notFound } from '@/lib/errors'
import { AirtableService } from '@/lib/services/airtable'
import { requireModerator } from '@/lib/auth'
import { sendDiscordWebhook } from '@/lib/services/discord'
import { logServerError } from '@/lib/logger'

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

        const { status } = await parseJsonBody(request, updateStatusSchema)

        // Check if report exists
        const report = await AirtableService.getReportById(params.id)
        if (!report) {
            throw notFound('Report not found')
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
                logServerError('Failed to create report status notification', notifError, {
                    reportId: params.id,
                    reporterId: report.reporterId,
                    status,
                })
            }
        }

        // Send Discord webhook when report is verified
        if (status === 'Verified') {
            sendDiscordWebhook(updatedReport).catch(err => {
                logServerError('Discord webhook failed after report verification', err, {
                    reportId: updatedReport.id,
                })
            })
        }

        return apiSuccess(updatedReport, {
            message: `Report status updated to ${status}`,
        })
    } catch (error) {
        return handleApiError(error, request, 'Update report status', { reportId: params.id })
    }
}
