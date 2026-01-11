/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            // Add allowed image domains here
            'airtable.com',
        ],
    },
    env: {
        AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    },
}

module.exports = nextConfig
