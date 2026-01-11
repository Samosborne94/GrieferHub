import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { requireAdmin } from '@/lib/auth'

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
    try {
        await requireAdmin()

        const users = await AirtableService.getAllUsers()

        return NextResponse.json({
            success: true,
            data: users,
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
                    message: 'You must be an admin to access this',
                },
                { status: 403 }
            )
        }

        console.error('Error fetching users:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch users',
            },
            { status: 500 }
        )
    }
}
