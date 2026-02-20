import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth } from '@/lib/auth'
import { authenticatedLimiter } from '@/lib/middleware/rateLimit'

// PUT /api/users/me/profile - Update own profile
const updateProfileSchema = z.object({
    bio: z.string().max(500).optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    location: z.string().max(100).optional(),
    website: z.string().url().optional().or(z.literal('')),
    discord: z.string().max(50).optional(),
    steam: z.string().max(100).optional(),
})

export async function PUT(request: NextRequest) {
    const rateLimitResult = await authenticatedLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        // Require authentication
        const session = await requireAuth()
        const userId = session.user?.id

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            )
        }

        const body = await request.json()

        // Validate input
        const validationResult = updateProfileSchema.safeParse(body)

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

        const profileData = validationResult.data

        // Update profile
        await AirtableService.updateUserProfile(userId, profileData)

        // Get updated profile
        const profile = await AirtableService.getUserProfile(userId)

        return NextResponse.json({
            success: true,
            data: profile,
            message: 'Profile updated successfully',
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in to update your profile',
                },
                { status: 401 }
            )
        }

        console.error('Error updating profile:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update profile',
            },
            { status: 500 }
        )
    }
}

// GET /api/users/me/profile - Get own profile
export async function GET(request: NextRequest) {
    const rateLimitResult = await authenticatedLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        // Require authentication
        const session = await requireAuth()
        const userId = session.user?.id

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            )
        }

        // Get profile
        const profile = await AirtableService.getUserProfile(userId)

        if (!profile) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Profile not found',
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: profile,
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            )
        }

        console.error('Error fetching profile:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch profile',
            },
            { status: 500 }
        )
    }
}
