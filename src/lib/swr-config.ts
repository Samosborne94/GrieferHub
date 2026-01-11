import { SWRConfiguration } from 'swr'

/**
 * SWR Configuration with aggressive caching to prevent Airtable rate limiting
 * Airtable API limit: 5 requests/second
 */
export const swrConfig: SWRConfiguration = {
    // Deduplicate requests within 1 minute
    dedupingInterval: 60000,

    // Don't revalidate on window focus (prevents unnecessary API calls)
    revalidateOnFocus: false,

    // Don't revalidate on reconnect
    revalidateOnReconnect: false,

    // Revalidate every 5 minutes when data is stale
    refreshInterval: 300000,

    // Retry configuration for rate limit errors
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404
        if (error.status === 404) return

        // Max 3 retries
        if (retryCount >= 3) return

        // If rate limited (429), wait longer before retry
        if (error.status === 429) {
            setTimeout(() => revalidate({ retryCount }), 5000)
            return
        }

        // Retry after 3 seconds for other errors
        setTimeout(() => revalidate({ retryCount }), 3000)
    },

    // Error retry count
    errorRetryCount: 3,

    // Show stale data while revalidating
    revalidateOnMount: true,
}

/**
 * Default fetcher for SWR
 */
export const fetcher = async (url: string) => {
    const res = await fetch(url)

    if (!res.ok) {
        const error: any = new Error('An error occurred while fetching the data.')
        error.info = await res.json()
        error.status = res.status
        throw error
    }

    return res.json()
}
