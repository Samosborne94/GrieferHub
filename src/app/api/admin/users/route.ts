import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { requireAdmin } from '@/lib/auth'
import { authenticatedLimiter } from '@/lib/middleware/rateLimit'

// GET /api/admin/users - Get all users with pagination and enrichment (admin only)
export async function GET(request: NextRequest) {
    const rateLimitResult = await authenticatedLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        await requireAdmin()

        const { searchParams } = new URL(request.url)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '20')), 100)
        const role = searchParams.get('role') || undefined
        const search = searchParams.get('search') || undefined

        const allUsers = await AirtableService.getAllUsers({ role, search })

        // In-memory pagination
        const startIndex = (page - 1) * limit
        const paginatedUsers = allUsers.slice(startIndex, startIndex + limit)

        // Enrich each user with report counts
        const enrichedUsers = await Promise.all(
            paginatedUsers.map(async (user) => {
                try {
                    const reports = await AirtableService.getReportsByUserId(user.id)
                    return {
                        ...user,
                        reportCount: reports.length,
                        verifiedReports: reports.filter(r => r.status === 'Verified').length,
                    }
                } catch {
                    return { ...user, reportCount: 0, verifiedReports: 0 }
                }
            })
        )

        return NextResponse.json({
            success: true,
            data: enrichedUsers,
            pagination: {
                page,
                limit,
                total: allUsers.length,
                totalPages: Math.ceil(allUsers.length / limit),
            },
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in',
                },
                { status: 401 }
            )
        }

        if (error.message === 'Forbidden') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden',
                    message: 'You must be an admin to access this',
                },
                { status: 403 }
            )
        }

        console.error('Error fetching users:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch users',
            },
            { status: 500 }
        )
    }
}
