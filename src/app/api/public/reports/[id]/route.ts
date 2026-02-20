import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { publicLimiter } from '@/lib/middleware/rateLimit'

// GET /api/public/reports/[id] - Get single verified report
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const rateLimitResult = await publicLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        const report = await AirtableService.getReportById(params.id)

        if (!report) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Report not found',
                    message: 'The requested report does not exist',
                },
                { status: 404 }
            )
        }

        // Only return verified reports via public API
        if (report.status !== 'Verified') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Report not available',
                    message: 'Only verified reports are available via public API',
                },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            data: report,
            meta: {
                api_version: '1.0',
                documentation: '/api-docs',
            },
        })
    } catch (error) {
        console.error('Error fetching report:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch report',
                message: 'An error occurred while fetching the report',
            },
            { status: 500 }
        )
    }
}
