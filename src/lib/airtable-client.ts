import Airtable from 'airtable'

// The client is initialized lazily so that `next build` (page-data collection)
// does not require runtime secrets. Missing configuration still fails loudly,
// but at request time instead of import time.
let cachedBase: ReturnType<Airtable['base']> | null = null

function getBase(): ReturnType<Airtable['base']> {
    if (!cachedBase) {
        if (!process.env.AIRTABLE_API_KEY) {
            throw new Error('AIRTABLE_API_KEY is not defined in environment variables')
        }

        if (!process.env.AIRTABLE_BASE_ID) {
            throw new Error('AIRTABLE_BASE_ID is not defined in environment variables')
        }

        cachedBase = new Airtable({
            apiKey: process.env.AIRTABLE_API_KEY,
        }).base(process.env.AIRTABLE_BASE_ID)
    }

    return cachedBase
}

// Get table instance, e.g. base(TABLES.REPORTS).select(...)
export const base = (tableName: string) => getBase()(tableName)

// Table names
export const TABLES = {
    USERS: 'Users',
    REPORTS: 'Reports',
    COMMENTS: 'Comments',
} as const
