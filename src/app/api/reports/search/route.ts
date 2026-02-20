import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { publicLimiter } from '@/lib/middleware/rateLimit'

const ALLOWED_FIELDS = ['username', 'description', 'game'] as const

const searchSchema = z.object({
    q: z.string().min(1, 'Search query is required'),
    fields: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

// GET /api/reports/search - Search reports
export async function GET(request: NextRequest) {
    const rateLimitResult = await publicLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        const { searchParams } = new URL(request.url)

        const validationResult = searchSchema.safeParse({
            q: searchParams.get('q'),
            fields: searchParams.get('fields') || undefined,
            page: searchParams.get('page') || 1,
            limit: searchParams.get('limit') || 20,
        })

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: validationResult.error.issues[0].message,
                },
                { status: 400 }
            )
        }

        const { q, fields: fieldsParam, page, limit } = validationResult.data

        // Parse and validate fields
        let fields: string[] = ['username', 'description', 'game']
        if (fieldsParam) {
            const requested = fieldsParam.split(',').map(f => f.trim())
            const valid = requested.filter(f => (ALLOWED_FIELDS as readonly string[]).includes(f))
            if (valid.length > 0) {
                fields = valid
            }
        }

        const allResults = await AirtableService.searchReports(q, fields)

        // In-memory pagination
        const startIndex = (page - 1) * limit
        const paginatedResults = allResults.slice(startIndex, startIndex + limit)

        return NextResponse.json({
            success: true,
            data: paginatedResults,
            pagination: {
                page,
                limit,
                total: allResults.length,
                totalPages: Math.ceil(allResults.length / limit),
            },
        })
    } catch (error) {
        console.error('Error searching reports:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to search reports',
            },
            { status: 500 }
        )
    }
}
