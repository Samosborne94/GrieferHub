import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { requireModerator } from '@/lib/auth'
import { authenticatedLimiter } from '@/lib/middleware/rateLimit'

// GET /api/mod/reports - Get all reports for moderation (moderator only)
export async function GET(request: NextRequest) {
    const rateLimitResult = await authenticatedLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        await requireModerator()

        const { searchParams } = new URL(request.url)

        const unreviewed = searchParams.get('unreviewed') === 'true'
        const reviewer = searchParams.get('reviewer') || undefined

        const filters: any = {
            game: searchParams.get('game') || undefined,
            severity: searchParams.get('severity') as any || undefined,
            search: searchParams.get('search') || undefined,
            unreviewed,
            reviewer,
        }

        // If unreviewed is set, ignore explicit status to avoid conflicts
        if (!unreviewed) {
            filters.status = searchParams.get('status') as any || undefined
        }

        const reports = await AirtableService.getReports(filters)

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
                    message: 'You must be a moderator or admin to access this',
                },
                { status: 403 }
            )
        }

        console.error('Error fetching reports:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch reports',
            },
            { status: 500 }
        )
    }
}
