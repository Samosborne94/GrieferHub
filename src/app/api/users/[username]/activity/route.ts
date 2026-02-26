import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'

// GET /api/users/[username]/activity - Get user's recent reports and comments
export async function GET(
    request: NextRequest,
    { params }: { params: { username: string } }
) {
    try {
        const user = await AirtableService.getUserByUsername(params.username)

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        const [reports, comments] = await Promise.all([
            AirtableService.getRecentReportsByUserId(user.id, 5),
            AirtableService.getRecentCommentsByUserId(user.id, 5),
        ])

        return NextResponse.json({
            success: true,
            data: { reports, comments },
        })
    } catch (error) {
        console.error('Error fetching user activity:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user activity' },
            { status: 500 }
        )
    }
}
