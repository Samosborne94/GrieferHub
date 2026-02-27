import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { AirtableService } from '@/lib/services/airtable'

// GET /api/notifications - Get current user's notifications
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

        const notifications = await AirtableService.getUserNotifications(userId, 50)

        return NextResponse.json({
            success: true,
            data: notifications,
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        console.error('Error fetching notifications:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}
