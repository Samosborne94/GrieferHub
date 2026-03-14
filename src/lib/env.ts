import 'server-only'
import { z } from 'zod'
import { configError } from '@/lib/errors'

const serverEnvSchema = z.object({
    AIRTABLE_API_KEY: z.string().min(1, 'AIRTABLE_API_KEY is required'),
    AIRTABLE_BASE_ID: z.string().min(1, 'AIRTABLE_BASE_ID is required'),
    CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
    CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(
        1,
        'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required'
    ),
})

let cachedServerEnv: z.infer<typeof serverEnvSchema> | null = null

export function getServerEnv() {
    if (cachedServerEnv) {
        return cachedServerEnv
    }

    const result = serverEnvSchema.safeParse(process.env)

    if (!result.success) {
        throw configError('Invalid server environment configuration', result.error.flatten())
    }

    cachedServerEnv = result.data
    return cachedServerEnv
}

export function resetServerEnvForTests() {
    cachedServerEnv = null
}
