import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AirtableService } from '@/lib/services/airtable'
import { apiLimiter } from '@/lib/middleware/rateLimit'
import type { ApiKeyInput } from '@/types/apiKey'

// GET /api/keys - List user's API keys
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized - Please login',
                },
                { status: 401 }
            )
        }

        // Get user's API keys
        const keys = await AirtableService.getApiKeysByUserId(session.user.id)

        return NextResponse.json({
            success: true,
            data: keys,
        })
    } catch (error) {
        console.error('Error fetching API keys:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch API keys',
            },
            { status: 500 }
        )
    }
}

// POST /api/keys - Generate new API key
export async function POST(request: NextRequest) {
    try {
        // Apply rate limiting
        const rateLimitResult = await apiLimiter(request)
        if (rateLimitResult) return rateLimitResult

        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized - Please login',
                },
                { status: 401 }
            )
        }

        // Parse request body
        const body = await request.json()
        const { name, scopes, rateLimit, expiresAt } = body as ApiKeyInput

        // Validate name
        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'API key name is required',
                },
                { status: 400 }
            )
        }

        if (name.length > 100) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'API key name must be 100 characters or less',
                },
                { status: 400 }
            )
        }

        // Validate scopes if provided
        const validScopes = [
            'reports:read',
            'reports:write',
            'reports:delete',
            'comments:read',
            'comments:write',
            'users:read',
        ]

        if (scopes) {
            const invalidScopes = scopes.filter(
                (scope) => !validScopes.includes(scope)
            )
            if (invalidScopes.length > 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Invalid scopes: ${invalidScopes.join(', ')}`,
                    },
                    { status: 400 }
                )
            }
        }

        // Validate rate limit if provided
        if (rateLimit !== undefined) {
            if (rateLimit < 1 || rateLimit > 1000) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Rate limit must be between 1 and 1000',
                    },
                    { status: 400 }
                )
            }
        }

        // Validate expiration date if provided
        if (expiresAt) {
            const expirationDate = new Date(expiresAt)
            if (isNaN(expirationDate.getTime())) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Invalid expiration date',
                    },
                    { status: 400 }
                )
            }

            if (expirationDate <= new Date()) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Expiration date must be in the future',
                    },
                    { status: 400 }
                )
            }
        }

        // Create API key
        const apiKey = await AirtableService.createApiKey(session.user.id, {
            name: name.trim(),
            scopes,
            rateLimit,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        })

        return NextResponse.json(
            {
                success: true,
                data: apiKey,
                message:
                    'API key created successfully. Please save the key now - you will not be able to see it again!',
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating API key:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create API key',
            },
            { status: 500 }
        )
    }
}
