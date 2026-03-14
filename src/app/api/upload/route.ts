import { NextRequest } from 'next/server'
import { apiSuccess, handleApiError } from '@/lib/api/route'
import { validationError } from '@/lib/errors'
import { uploadImage, uploadVideo } from '@/lib/services/cloudinary'
import { requireAuth } from '@/lib/auth'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export async function POST(request: NextRequest) {
    try {
        await requireAuth()

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            throw validationError('No file provided')
        }

        // Validate file type
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

        if (!isImage && !isVideo) {
            throw validationError('Only images (JPEG, PNG, WebP) and videos (MP4, WebM, MOV) are allowed')
        }

        // Validate file size
        const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024)
            throw validationError(`File size must be less than ${maxSizeMB}MB`)
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary
        let result
        if (isImage) {
            result = await uploadImage(buffer)
        } else {
            result = await uploadVideo(buffer)
        }

        return apiSuccess(
            {
                url: result.url,
                publicId: result.publicId,
            },
            { message: 'Upload completed successfully' }
        )
    } catch (error) {
        return handleApiError(error, request, 'Upload media')
    }
}
