import Airtable from 'airtable'
import { getServerEnv } from '@/lib/env'

const env = getServerEnv()

// Initialize Airtable client
const airtable = new Airtable({
    apiKey: env.AIRTABLE_API_KEY,
})

// Get base instance
export const base = airtable.base(env.AIRTABLE_BASE_ID)

// Table names
export const TABLES = {
    USERS: 'Users',
    REPORTS: 'Reports',
    COMMENTS: 'Comments',
    API_KEYS: 'API_Keys',
    NOTIFICATIONS: 'Notifications',
} as const
