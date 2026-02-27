import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { AirtableService } from '@/lib/services/airtable'

// GET /api/notifications/unread-count - Get unread notification count
export async function GET() {
    try {
        const session = await requireAuth()
        const userId = session.user?.id

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const count = await AirtableService.getUnreadNotificationCount(userId)

        return NextResponse.json({
            success: true,
            data: { count },
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        console.error('Error fetching unread count:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch unread count' },
            { status: 500 }
        )
    }
}
