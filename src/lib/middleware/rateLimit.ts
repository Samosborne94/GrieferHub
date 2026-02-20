import { NextRequest, NextResponse } from 'next/server'

/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting
 */

interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) {
            delete store[key]
        }
    })
}, 5 * 60 * 1000)

export interface RateLimitOptions {
    /**
     * Maximum number of requests allowed within the window
     */
    max: number

    /**
     * Time window in milliseconds
     */
    windowMs: number

    /**
     * Custom error message
     */
    message?: string

    /**
     * Custom key generator function
     * Defaults to IP address
     */
    keyGenerator?: (request: NextRequest) => string

    /**
     * Skip rate limiting for certain requests
     */
    skip?: (request: NextRequest) => boolean
}

/**
 * Rate limiting middleware factory
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   max: 100,
 *   windowMs: 60 * 1000, // 1 minute
 * })
 *
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await limiter(request)
 *   if (rateLimitResult) return rateLimitResult
 *
 *   // Your endpoint logic here
 * }
 * ```
 */
export function createRateLimiter(options: RateLimitOptions) {
    const {
        max,
        windowMs,
        message = 'Too many requests, please try again later.',
        keyGenerator = getClientIp,
        skip,
    } = options

    return async (request: NextRequest): Promise<NextResponse | null> => {
        // Skip rate limiting if specified
        if (skip && skip(request)) {
            return null
        }

        const key = keyGenerator(request)
        const now = Date.now()

        // Initialize or get existing entry
        if (!store[key] || store[key].resetTime < now) {
            store[key] = {
                count: 0,
                resetTime: now + windowMs,
            }
        }

        // Increment count
        store[key].count++

        // Check if limit exceeded
        if (store[key].count > max) {
            const remaining = Math.ceil((store[key].resetTime - now) / 1000)

            return NextResponse.json(
                {
                    success: false,
                    error: 'Rate limit exceeded',
                    message,
                    retryAfter: remaining,
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': max.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': store[key].resetTime.toString(),
                        'Retry-After': remaining.toString(),
                    },
                }
            )
        }

        // Add rate limit headers to response
        // Note: These will need to be added to the actual response in the endpoint
        return null
    }
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
    // Check common headers for IP
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    if (realIp) {
        return realIp
    }

    if (cfConnectingIp) {
        return cfConnectingIp
    }

    // Fallback to unknown (shouldn't happen in production)
    return 'unknown'
}

/**
 * Get API key from request headers or query params
 */
export function getApiKey(request: NextRequest): string | null {
    // Check Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }

    // Check custom header
    const apiKeyHeader = request.headers.get('x-api-key')
    if (apiKeyHeader) {
        return apiKeyHeader
    }

    // Check query parameter (not recommended for production)
    const { searchParams } = new URL(request.url)
    const apiKeyParam = searchParams.get('api_key')
    if (apiKeyParam) {
        return apiKeyParam
    }

    return null
}

/**
 * Predefined rate limiters for common use cases
 */

// Strict rate limiter for sensitive operations (10 requests per hour)
export const strictLimiter = createRateLimiter({
    max: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests. Please try again in an hour.',
})

// Standard API limiter (100 requests per minute)
export const apiLimiter = createRateLimiter({
    max: 100,
    windowMs: 60 * 1000, // 1 minute
})

// Lenient limiter for reads (300 requests per minute)
export const readLimiter = createRateLimiter({
    max: 300,
    windowMs: 60 * 1000, // 1 minute
})

// Login rate limiter (5 attempts per 15 minutes)
export const loginLimiter = createRateLimiter({
    max: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.',
})

// Report submission limiter (10 reports per hour per user)
export const reportLimiter = createRateLimiter({
    max: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'You have reached the maximum number of reports for this hour.',
})

// Comment limiter (50 comments per hour)
export const commentLimiter = createRateLimiter({
    max: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'You are posting comments too quickly. Please slow down.',
})

// Public endpoint limiter (100 requests per 15 minutes per IP)
export const publicLimiter = createRateLimiter({
    max: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests. Please try again later.',
})

// Authenticated endpoint limiter (300 requests per 15 minutes per IP)
export const authenticatedLimiter = createRateLimiter({
    max: 300,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests. Please try again later.',
})

// Upload limiter (20 uploads per hour per IP)
export const uploadLimiter = createRateLimiter({
    max: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many uploads. Please try again later.',
})
