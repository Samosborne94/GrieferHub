import Airtable from 'airtable'

if (!process.env.AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY is not defined in environment variables')
}

if (!process.env.AIRTABLE_BASE_ID) {
    throw new Error('AIRTABLE_BASE_ID is not defined in environment variables')
}

// Initialize Airtable client
const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
})

// Get base instance
export const base = airtable.base(process.env.AIRTABLE_BASE_ID)

// Table names
export const TABLES = {
    USERS: 'Users',
    REPORTS: 'Reports',
} as const
