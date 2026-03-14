import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
    apiSuccess,
    getAuthenticatedUserId,
    handleApiError,
    parseJsonBody,
} from '@/lib/api/route'
import { notFound } from '@/lib/errors'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth } from '@/lib/auth'

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
    try {
        const session = await requireAuth()
        const userId = getAuthenticatedUserId(session)
        const profileData = await parseJsonBody(request, updateProfileSchema)

        // Update profile
        await AirtableService.updateUserProfile(userId, profileData)

        // Get updated profile
        const profile = await AirtableService.getUserProfile(userId)

        return apiSuccess(profile, { message: 'Profile updated successfully' })
    } catch (error) {
        return handleApiError(error, request, 'Update own profile')
    }
}

// GET /api/users/me/profile - Get own profile
export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth()
        const userId = getAuthenticatedUserId(session)

        // Get profile
        const profile = await AirtableService.getUserProfile(userId)

        if (!profile) {
            throw notFound('Profile not found')
        }

        return apiSuccess(profile)
    } catch (error) {
        return handleApiError(error, request, 'Fetch own profile')
    }
}
