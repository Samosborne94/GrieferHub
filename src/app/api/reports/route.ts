import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { getServerSession, requireAuth } from '@/lib/auth'

// GET /api/reports - List reports with filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const filters = {
            game: searchParams.get('game') || undefined,
            status: searchParams.get('status') as any || undefined,
            severity: searchParams.get('severity') as any || undefined,
            search: searchParams.get('search') || undefined,
        }

        const reports = await AirtableService.getReports(filters)

        return NextResponse.json({
            success: true,
            data: reports,
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
