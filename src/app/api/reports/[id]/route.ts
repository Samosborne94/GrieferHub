import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
    apiSuccess,
    handleApiError,
    parseJsonBody,
} from '@/lib/api/route'
import { forbidden, notFound } from '@/lib/errors'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth, hasRole } from '@/lib/auth'

// GET /api/reports/[id] - Get single report
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const report = await AirtableService.getReportById(params.id)

        if (!report) {
            throw notFound('Report not found')
        }

        return apiSuccess(report)
    } catch (error) {
        return handleApiError(error, request, 'Fetch report', { reportId: params.id })
    }
}

// PATCH /api/reports/[id] - Update report (owner or admin)
const updateReportSchema = z.object({
    grieferName: z.string().min(1).max(100).optional(),
    game: z.string().min(1).optional(),
    description: z.string().min(10).max(5000).optional(),
    evidenceUrl: z.string().url().optional(),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    server: z.string().optional(),
    tags: z.array(z.string()).optional(),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth()
        const report = await AirtableService.getReportById(params.id)

        if (!report) {
            throw notFound('Report not found')
        }

        // Check if user is owner or has admin role
        const isOwner = report.reporterId === session.user?.id
        const isAdmin = hasRole(session.user?.role || 'user', 'admin')

        if (!isOwner && !isAdmin) {
            throw forbidden('You can only edit your own reports')
        }

        const payload = await parseJsonBody(request, updateReportSchema)

        const updatedReport = await AirtableService.updateReport(
            params.id,
            payload
        )

        return apiSuccess(updatedReport, { message: 'Report updated successfully' })
    } catch (error) {
        return handleApiError(error, request, 'Update report', { reportId: params.id })
    }
}

// DELETE /api/reports/[id] - Delete report (owner or admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth()
        const report = await AirtableService.getReportById(params.id)

        if (!report) {
            throw notFound('Report not found')
        }

        // Check if user is owner or has admin role
        const isOwner = report.reporterId === session.user?.id
        const isAdmin = hasRole(session.user?.role || 'user', 'admin')

        if (!isOwner && !isAdmin) {
            throw forbidden('You can only delete your own reports')
        }

        await AirtableService.deleteReport(params.id)

        return apiSuccess(undefined, { message: 'Report deleted successfully' })
    } catch (error) {
        return handleApiError(error, request, 'Delete report', { reportId: params.id })
    }
}
