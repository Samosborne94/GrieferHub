import { v2 as cloudinary } from 'cloudinary'
import { externalServiceError } from '@/lib/errors'
import { getServerEnv } from '@/lib/env'
import { logServerError } from '@/lib/logger'

const env = getServerEnv()

// Configure Cloudinary
cloudinary.config({
    cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
    url: string
    publicId: string
    width?: number
    height?: number
    format?: string
    duration?: number
}

/**
 * Helper to convert buffer to data URI
 */
function bufferToDataUri(buffer: Buffer, mimetype: string): string {
    const b64 = buffer.toString('base64')
    return `data:${mimetype};base64,${b64}`
}

/**
 * Upload an image to Cloudinary
 * Automatically optimizes quality and format
 */
export async function uploadImage(
    file: string | Buffer,
    folder: string = 'griefer-evidence/images'
): Promise<UploadResult> {
    try {
        let fileToUpload = file

        // Convert buffer to data URI if needed
        if (Buffer.isBuffer(file)) {
            fileToUpload = bufferToDataUri(file, 'image/jpeg') // Default to jpeg as intermediate, Cloudinary handles format
        }

        const result = await cloudinary.uploader.upload(fileToUpload as string, {
            folder,
            resource_type: 'image',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' },
                { width: 1920, height: 1080, crop: 'limit' },
            ],
        })

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
        }
    } catch (error) {
        logServerError('Image upload failed', error)
        throw externalServiceError('Failed to upload image', error)
    }
}

/**
 * Upload a video to Cloudinary
 * Automatically transcodes for web playback
 */
export async function uploadVideo(
    file: string | Buffer,
    folder: string = 'griefer-evidence/videos'
): Promise<UploadResult> {
    try {
        let fileToUpload = file

        // Convert buffer to data URI if needed
        if (Buffer.isBuffer(file)) {
            fileToUpload = bufferToDataUri(file, 'video/mp4') // Default to mp4 as intermediate
        }

        const result = await cloudinary.uploader.upload(fileToUpload as string, {
            folder,
            resource_type: 'video',
            eager: [
                { streaming_profile: 'hd', format: 'mp4' },
                { format: 'webm' },
            ],
            eager_async: true,
        })

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            duration: result.duration,
        }
    } catch (error) {
        logServerError('Video upload failed', error)
        throw externalServiceError('Failed to upload video', error)
    }
}

/**
 * Delete media from Cloudinary
 */
export async function deleteMedia(publicId: string): Promise<void> {
    try {
        // Determine resource type from public ID
        const resourceType = publicId.includes('/videos/') ? 'video' : 'image'
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
    } catch (error) {
        logServerError('Media deletion failed', error, { publicId })
        throw externalServiceError('Failed to delete media', error)
    }
}

export { cloudinary }
