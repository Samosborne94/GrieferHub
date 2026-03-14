import { randomUUID } from 'crypto'

export interface UploadResult {
    url: string
    publicId: string
    width?: number
    height?: number
    format?: string
    duration?: number
}

function isMockDataEnabled() {
    return process.env.USE_MOCK_DATA === 'true'
}

function createMockUploadResult(kind: 'image' | 'video'): UploadResult {
    const id = `mock/${kind}/${randomUUID()}`

    if (kind === 'video') {
        return {
            url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            publicId: id,
            width: 1280,
            height: 720,
            format: 'mp4',
            duration: 5,
        }
    }

    return {
        url: 'https://placehold.co/1280x720/png?text=GrieferHub+Mock+Upload',
        publicId: id,
        width: 1280,
        height: 720,
        format: 'png',
    }
}

export async function uploadImage(
    file: string | Buffer,
    folder: string = 'griefer-evidence/images'
): Promise<UploadResult> {
    if (isMockDataEnabled()) {
        return createMockUploadResult('image')
    }

    const { uploadImage: uploadImageReal } = await import('@/lib/services/cloudinary-real')
    return uploadImageReal(file, folder)
}

export async function uploadVideo(
    file: string | Buffer,
    folder: string = 'griefer-evidence/videos'
): Promise<UploadResult> {
    if (isMockDataEnabled()) {
        return createMockUploadResult('video')
    }

    const { uploadVideo: uploadVideoReal } = await import('@/lib/services/cloudinary-real')
    return uploadVideoReal(file, folder)
}

export async function deleteMedia(publicId: string): Promise<void> {
    if (isMockDataEnabled()) {
        return
    }

    const { deleteMedia: deleteMediaReal } = await import('@/lib/services/cloudinary-real')
    return deleteMediaReal(publicId)
}

export const cloudinary = null
