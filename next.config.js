const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            'airtable.com',
            'res.cloudinary.com', // Cloudinary for uploaded evidence
            'img.youtube.com', // YouTube thumbnails
            'i.imgur.com', // Imgur images
        ],
        formats: ['image/avif', 'image/webp'],
    },
    env: {
        AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false,
    // Enable experimental features for better performance
    experimental: {
        optimizeCss: false,
    },
    webpack: (config) => {
        if (process.env.USE_MOCK_DATA === 'true') {
            config.resolve.alias['@/lib/services/airtable'] =
                path.resolve(__dirname, 'src/lib/services/airtable-mock')
        }
        return config
    },
}

module.exports = nextConfig
