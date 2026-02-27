import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { AirtableService } from '@/lib/services/airtable'

// GET /api/admin/analytics - Get platform analytics (admin only)
export async function GET() {
    try {
        await requireAdmin()

        const [overview, topReporters, recentActivity] = await Promise.all([
            AirtableService.getAnalyticsOverview(),
            AirtableService.getTopReporters(10),
            AirtableService.getRecentActivity(10),
        ])

        return NextResponse.json({
            success: true,
            data: {
                overview,
                topReporters,
                recentActivity,
            },
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            )
        }

        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
