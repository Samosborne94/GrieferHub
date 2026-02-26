import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { uploadImage } from '@/lib/services/cloudinary'
import { AirtableService } from '@/lib/services/airtable'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// POST /api/users/me/avatar - Upload avatar image
export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth()
        const userId = session.user?.id

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('avatar') as File | null

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            )
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid file type. Accepted: JPG, PNG, WebP' },
                { status: 400 }
            )
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { success: false, error: 'File too large. Maximum size is 2MB' },
                { status: 400 }
            )
        }

        // Upload to Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer())
        const result = await uploadImage(buffer, 'griefer-hub/avatars')

        // Save avatar URL to user profile
        await AirtableService.updateUserProfile(userId, { avatar: result.url })

        return NextResponse.json({
            success: true,
            data: { url: result.url },
            message: 'Avatar uploaded successfully',
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        console.error('Error uploading avatar:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to upload avatar' },
            { status: 500 }
        )
    }
}
