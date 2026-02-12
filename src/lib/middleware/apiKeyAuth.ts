import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { getApiKey } from './rateLimit'
import type { ApiKey, ApiKeyScope } from '@/types/apiKey'

/**
 * API Key Authentication Result
 */
export interface ApiKeyAuthResult {
    authenticated: boolean
    apiKey: ApiKey | null
    userId: string | null
    scopes: ApiKeyScope[]
}

/**
 * Authenticate request using API key
 * Returns null if authenticated, or NextResponse with error if not
 *
 * @example
 * ```typescript
 * const authResult = await authenticateApiKey(request, ['reports:read'])
 * if (authResult.error) return authResult.error
 *
 * // Use authResult.apiKey.userId for the request
 * ```
 */
export async function authenticateApiKey(
    request: NextRequest,
    requiredScopes?: ApiKeyScope[]
): Promise<{
    error: NextResponse | null
    apiKey: ApiKey | null
    userId: string | null
}> {
    // Get API key from request
    const rawKey = getApiKey(request)

    if (!rawKey) {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    error: 'API key required',
                    message:
                        'Please provide an API key via Authorization header (Bearer token), X-API-Key header, or api_key query parameter',
                },
                { status: 401 }
            ),
            apiKey: null,
            userId: null,
        }
    }

    // Verify API key
    const apiKey = await AirtableService.verifyApiKey(rawKey)

    if (!apiKey) {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    error: 'Invalid API key',
                    message: 'The provided API key is invalid or has expired',
                },
                { status: 401 }
            ),
            apiKey: null,
            userId: null,
        }
    }

    // Check if key is active
    if (!apiKey.isActive) {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    error: 'API key revoked',
                    message: 'This API key has been revoked',
                },
                { status: 401 }
            ),
            apiKey: null,
            userId: null,
        }
    }

    // Check expiration
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    error: 'API key expired',
                    message: 'This API key has expired',
                },
                { status: 401 }
            ),
            apiKey: null,
            userId: null,
        }
    }

    // Check scopes if required
    if (requiredScopes && requiredScopes.length > 0) {
        const hasAllScopes = requiredScopes.every((scope) =>
            apiKey.scopes.includes(scope)
        )

        if (!hasAllScopes) {
            return {
                error: NextResponse.json(
                    {
                        success: false,
                        error: 'Insufficient permissions',
                        message: `This API key does not have the required scopes: ${requiredScopes.join(', ')}`,
                    },
                    { status: 403 }
                ),
                apiKey: null,
                userId: null,
            }
        }
    }

    // Successfully authenticated
    return {
        error: null,
        apiKey,
        userId: apiKey.userId,
    }
}

/**
 * Create rate limiter for API key with custom limit
 */
export function createApiKeyRateLimiter(apiKey: ApiKey) {
    // Track requests per API key
    const keyStore: { [keyId: string]: { count: number; resetTime: number } } =
        {}

    return async (): Promise<NextResponse | null> => {
        const now = Date.now()
        const windowMs = 60 * 1000 // 1 minute

        // Initialize or reset
        if (
            !keyStore[apiKey.id] ||
            keyStore[apiKey.id].resetTime < now
        ) {
            keyStore[apiKey.id] = {
                count: 0,
                resetTime: now + windowMs,
            }
        }

        // Increment
        keyStore[apiKey.id].count++

        // Check limit
        if (keyStore[apiKey.id].count > apiKey.rateLimit) {
            const remaining = Math.ceil(
                (keyStore[apiKey.id].resetTime - now) / 1000
            )

            return NextResponse.json(
                {
                    success: false,
                    error: 'Rate limit exceeded',
                    message: `You have exceeded the rate limit for this API key (${apiKey.rateLimit} requests per minute)`,
                    retryAfter: remaining,
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': apiKey.rateLimit.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset':
                            keyStore[apiKey.id].resetTime.toString(),
                        'Retry-After': remaining.toString(),
                    },
                }
            )
        }

        return null
    }
}

/**
 * Check if a scope is allowed for an API key
 */
export function hasScope(apiKey: ApiKey, scope: ApiKeyScope): boolean {
    return apiKey.scopes.includes(scope)
}

/**
 * Check if API key has any of the provided scopes
 */
export function hasAnyScope(
    apiKey: ApiKey,
    scopes: ApiKeyScope[]
): boolean {
    return scopes.some((scope) => apiKey.scopes.includes(scope))
}

/**
 * Check if API key has all of the provided scopes
 */
export function hasAllScopes(
    apiKey: ApiKey,
    scopes: ApiKeyScope[]
): boolean {
    return scopes.every((scope) => apiKey.scopes.includes(scope))
}
