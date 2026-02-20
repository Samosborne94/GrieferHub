import { NextRequest, NextResponse } from 'next/server'
import { AirtableService } from '@/lib/services/airtable'
import { publicLimiter } from '@/lib/middleware/rateLimit'

// GET /api/public/reports - Public API endpoint for fetching verified reports
export async function GET(request: NextRequest) {
    const rateLimitResult = await publicLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        const { searchParams } = new URL(request.url)

        const filters = {
            game: searchParams.get('game') || undefined,
            severity: searchParams.get('severity') as any || undefined,
            search: searchParams.get('search') || undefined,
            // Only return verified reports for public API
            status: 'Verified' as const,
        }

        const page = parseInt(searchParams.get('page') || '1')
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100 per request

        const allReports = await AirtableService.getReports(filters)

        // Pagination
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedReports = allReports.slice(startIndex, endIndex)

        return NextResponse.json({
            success: true,
            data: paginatedReports,
            pagination: {
                page,
                limit,
                total: allReports.length,
                totalPages: Math.ceil(allReports.length / limit),
            },
            meta: {
                api_version: '1.0',
                documentation: '/api-docs',
            },
        })
    } catch (error) {
        console.error('Error fetching reports:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch reports',
                message: 'An error occurred while fetching reports',
            },
            { status: 500 }
        )
    }
}
