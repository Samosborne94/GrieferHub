import '@testing-library/jest-dom'

process.env.AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'test-airtable-key'
process.env.AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appTestBase'
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'test-cloudinary-key'
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'test-cloudinary-secret'
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'test-cloudinary-cloud'
