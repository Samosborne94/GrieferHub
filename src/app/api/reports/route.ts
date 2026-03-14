import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
    apiSuccess,
    getAuthenticatedUserId,
    handleApiError,
    parseJsonBody,
} from '@/lib/api/route'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth } from '@/lib/auth'

// GET /api/reports - List reports with filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const filters = {
            game: searchParams.get('game') || undefined,
            status: searchParams.get('status') as any || undefined,
            severity: searchParams.get('severity') as any || undefined,
            search: searchParams.get('search') || undefined,
        }

        const reports = await AirtableService.getReports(filters)

        return apiSuccess(reports)
    } catch (error) {
        return handleApiError(error, request, 'Fetch reports')
    }
}

// POST /api/reports - Create new report (authenticated)
const createReportSchema = z.object({
    grieferName: z.string().min(1).max(100),
    game: z.string().min(1),
    description: z.string().min(10).max(5000),
    evidenceUrl: z.string().url(),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
    server: z.string().optional(),
    tags: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth()
        const reportData = await parseJsonBody(request, createReportSchema)

        // Create report
        const report = await AirtableService.createReport({
            ...reportData,
            reporterId: getAuthenticatedUserId(session),
        })

        return apiSuccess(report, { status: 201, message: 'Report created successfully' })
    } catch (error) {
        return handleApiError(error, request, 'Create report')
    }
}
