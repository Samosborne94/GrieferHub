import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'

// GET /api/griefers/[name] - Get griefer profile with aggregated data
export async function GET(
    request: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        const grieferName = decodeURIComponent(params.name)

        const [stats, reports] = await Promise.all([
            AirtableService.getGrieferStats(grieferName),
            AirtableService.getReportsByGrieferName(grieferName),
        ])

        if (reports.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No reports found for this player' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                grieferName: reports[0].grieferName,
                stats,
                reports,
            },
        })
    } catch (error) {
        console.error('Error fetching griefer profile:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch griefer profile' },
            { status: 500 }
        )
    }
}
