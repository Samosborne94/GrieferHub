import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { AirtableService } from '@/lib/services/airtable'

// PUT /api/notifications/[id]/read - Mark a notification as read
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth()
        if (!session.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await AirtableService.markNotificationRead(params.id)

        return NextResponse.json({
            success: true,
            message: 'Notification marked as read',
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        console.error('Error marking notification as read:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to mark notification as read' },
            { status: 500 }
        )
    }
}
