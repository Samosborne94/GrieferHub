import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { uploadImage, uploadVideo } from '@/lib/services/cloudinary'
import { requireAuth } from '@/lib/auth'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export async function POST(request: NextRequest) {
    try {
        // Require authentication
        await requireAuth()

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No file provided',
                },
                { status: 400 }
            )
        }

        // Validate file type
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

        if (!isImage && !isVideo) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid file type',
                    message: 'Only images (JPEG, PNG, WebP) and videos (MP4, WebM, MOV) are allowed',
                },
                { status: 400 }
            )
        }

        // Validate file size
        const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024)
            return NextResponse.json(
                {
                    success: false,
                    error: 'File too large',
                    message: `File size must be less than ${maxSizeMB}MB`,
                },
                { status: 400 }
            )
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

        return NextResponse.json(
            {
                success: true,
                url: result.url,
                publicId: result.publicId,
            },
            { status: 200 }
        )
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in to upload files',
                },
                { status: 401 }
            )
        }

        console.error('Upload error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Upload failed',
                message: 'Failed to upload file',
            },
            { status: 500 }
        )
    }
}
