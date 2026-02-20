import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { getServerSession, requireAuth } from '@/lib/auth'
import { publicLimiter, authenticatedLimiter } from '@/lib/middleware/rateLimit'

// GET /api/reports - List reports with filtering and pagination
export async function GET(request: NextRequest) {
    const rateLimitResult = await publicLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        const { searchParams } = new URL(request.url)

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '20')), 100)
        const sortBy = searchParams.get('sortBy') as any || undefined
        const order = searchParams.get('order') as any || undefined

        const filters = {
            game: searchParams.get('game') || undefined,
            status: searchParams.get('status') as any || undefined,
            severity: searchParams.get('severity') as any || undefined,
            search: searchParams.get('search') || undefined,
            sortBy,
            order,
        }

        const allReports = await AirtableService.getReports(filters)

        // In-memory pagination
        const startIndex = (page - 1) * limit
        const paginatedReports = allReports.slice(startIndex, startIndex + limit)

        return NextResponse.json({
            success: true,
            data: paginatedReports,
            pagination: {
                page,
                limit,
                total: allReports.length,
                totalPages: Math.ceil(allReports.length / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching reports:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch reports',
            },
            { status: 500 }
        )
    }
}

// POST /api/reports - Create new report (authenticated)
const createReportSchema = z.object({
    grieferName: z.string().min(1).max(100),
    game: z.string().min(1),
    description: z.string().min(10).max(5000),
    evidenceUrl: z.string().url(),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
    server: z.string().optional(),
    tags: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
    const rateLimitResult = await authenticatedLimiter(request)
    if (rateLimitResult) return rateLimitResult

    try {
        // Require authentication
        const session = await requireAuth()

        const body = await request.json()

        // Validate input
        const validationResult = createReportSchema.safeParse(body)

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

        const reportData = validationResult.data

        // Create report
        const report = await AirtableService.createReport({
            ...reportData,
            reporterId: session.user?.id || '',
        })

        return NextResponse.json(
            {
                success: true,
                data: report,
                message: 'Report created successfully',
            },
            { status: 201 }
        )
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in to create a report',
                },
                { status: 401 }
            )
        }

        console.error('Error creating report:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create report',
            },
            { status: 500 }
        )
    }
}
