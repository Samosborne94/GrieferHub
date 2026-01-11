import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
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
 * Upload an image to Cloudinary
 * Automatically optimizes quality and format
 */
export async function uploadImage(
    file: string | Buffer,
    folder: string = 'griefer-evidence/images'
): Promise<UploadResult> {
    try {
        const fileData = Buffer.isBuffer(file) ? `data:image/png;base64,${file.toString('base64')}` : file;
        const result = await cloudinary.uploader.upload(fileData, {
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
        console.error('Image upload error:', error)
        throw new Error('Failed to upload image')
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
        const fileData = Buffer.isBuffer(file) ? `data:video/mp4;base64,${file.toString('base64')}` : file;
        const result = await cloudinary.uploader.upload(fileData, {
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
        console.error('Video upload error:', error)
        throw new Error('Failed to upload video')
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
        console.error('Media deletion error:', error)
        throw new Error('Failed to delete media')
    }
}

export { cloudinary }
