import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { AirtableService } from '@/lib/services/airtable'

// PUT /api/notifications/read-all - Mark all notifications as read
export async function PUT() {
    try {
        const session = await requireAuth()
        const userId = session.user?.id

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await AirtableService.markAllNotificationsRead(userId)

        return NextResponse.json({
            success: true,
            message: 'All notifications marked as read',
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        console.error('Error marking all as read:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to mark all as read' },
            { status: 500 }
        )
    }
}
