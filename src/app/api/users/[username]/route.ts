import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { publicLimiter } from '@/lib/middleware/rateLimit'

// GET /api/users/[username] - Get user profile by username
export async function GET(
    request: NextRequest,
    { params }: { params: { username: string } }
) {
    const rateLimitResult = await publicLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        const username = params.username

        // Get user by username
        const user = await AirtableService.getUserByUsername(username)

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            )
        }

        // Get full profile with stats
        const profile = await AirtableService.getUserProfile(user.id)

        if (!profile) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Profile not found',
                },
                { status: 404 }
            )
        }

        // Remove sensitive data
        const { email, ...publicProfile } = profile

        return NextResponse.json({
            success: true,
            data: publicProfile,
        })
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch user profile',
            },
            { status: 500 }
        )
    }
}
