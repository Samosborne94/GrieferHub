import { AppError } from '@/lib/errors'
import { getServerEnv, resetServerEnvForTests } from '@/lib/env'

const originalEnv = { ...process.env }

describe('server env validation', () => {
    beforeEach(() => {
        process.env = { ...originalEnv }
        resetServerEnvForTests()
    })

    afterAll(() => {
        process.env = originalEnv
        resetServerEnvForTests()
    })

    it('returns typed env values when configuration is complete', () => {
        process.env.AIRTABLE_API_KEY = 'key'
        process.env.AIRTABLE_BASE_ID = 'base'
        process.env.CLOUDINARY_API_KEY = 'cloud-key'
        process.env.CLOUDINARY_API_SECRET = 'cloud-secret'
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'cloud-name'

        expect(getServerEnv()).toMatchObject({
            AIRTABLE_API_KEY: 'key',
            AIRTABLE_BASE_ID: 'base',
            CLOUDINARY_API_KEY: 'cloud-key',
            CLOUDINARY_API_SECRET: 'cloud-secret',
            NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'cloud-name',
        })
    })

    it('fails fast on missing configuration', () => {
        delete process.env.AIRTABLE_API_KEY
        process.env.AIRTABLE_BASE_ID = 'base'
        process.env.CLOUDINARY_API_KEY = 'cloud-key'
        process.env.CLOUDINARY_API_SECRET = 'cloud-secret'
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'cloud-name'

        expect(() => getServerEnv()).toThrow(AppError)
    })
})
