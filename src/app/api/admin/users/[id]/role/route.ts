import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { requireAdmin } from '@/lib/auth'

// PATCH /api/admin/users/[id]/role - Update user role (admin only)
const updateRoleSchema = z.object({
    role: z.enum(['user', 'moderator', 'admin']),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin()

        const body = await request.json()
        const validationResult = updateRoleSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: validationResult.error.issues[0].message,
                },
                { status: 400 }
            )
        }

        const { role } = validationResult.data

        // Check if user exists
        const user = await AirtableService.getUserById(params.id)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            )
        }

        // Update role
        const updatedUser = await AirtableService.updateUserRole(params.id, role)

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: `User role updated to ${role}`,
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
                    message: 'You must be an admin to update user roles',
                },
                { status: 403 }
            )
        }

        console.error('Error updating user role:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update user role',
            },
            { status: 500 }
        )
    }
}
