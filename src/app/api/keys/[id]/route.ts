import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AirtableService } from '@/lib/services/airtable'

// DELETE /api/keys/[id] - Revoke an API key
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const keyId = params.id

        // Verify key exists and belongs to user
        const apiKey = await AirtableService.getApiKeyById(keyId)
        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'API key not found',
                },
                { status: 404 }
            )
        }

        // Check ownership (unless admin)
        if (
            apiKey.userId !== session.user.id &&
            session.user.role !== 'admin'
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden - You can only revoke your own API keys',
                },
                { status: 403 }
            )
        }

        // Revoke the key
        await AirtableService.revokeApiKey(keyId, session.user.id)

        return NextResponse.json({
            success: true,
            message: 'API key revoked successfully',
        })
    } catch (error) {
        console.error('Error revoking API key:', error)

        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden - You can only revoke your own API keys',
                },
                { status: 403 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to revoke API key',
            },
            { status: 500 }
        )
    }
}

// GET /api/keys/[id] - Get API key details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const keyId = params.id

        // Get key details
        const apiKey = await AirtableService.getApiKeyById(keyId)
        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'API key not found',
                },
                { status: 404 }
            )
        }

        // Check ownership (unless admin)
        if (
            apiKey.userId !== session.user.id &&
            session.user.role !== 'admin'
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden - You can only view your own API keys',
                },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            data: apiKey,
        })
    } catch (error) {
        console.error('Error fetching API key:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch API key',
            },
            { status: 500 }
        )
    }
}
