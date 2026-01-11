import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { requireModerator } from '@/lib/auth'

// GET /api/mod/reports - Get all reports for moderation (moderator only)
export async function GET(request: NextRequest) {
    try {
        await requireModerator()

        const { searchParams } = new URL(request.url)

        const filters = {
            game: searchParams.get('game') || undefined,
            status: searchParams.get('status') as any || undefined,
            severity: searchParams.get('severity') as any || undefined,
            search: searchParams.get('search') || undefined,
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
