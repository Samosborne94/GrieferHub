import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth } from '@/lib/auth'
import { authenticatedLimiter } from '@/lib/middleware/rateLimit'

// GET /api/reports/me - Get current user's reports
export async function GET(request: NextRequest) {
    const rateLimitResult = await authenticatedLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        const session = await requireAuth()

        const reports = await AirtableService.getReportsByUserId(
            session.user?.id || ''
        )

        return NextResponse.json({
            success: true,
            data: reports,
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in to view your reports',
                },
                { status: 401 }
            )
        }

        console.error('Error fetching user reports:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch reports',
            },
            { status: 500 }
        )
    }
}
