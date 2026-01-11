import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth, hasRole } from '@/lib/auth'

// GET /api/reports/[id] - Get single report
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const report = await AirtableService.getReportById(params.id)

        if (!report) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Report not found',
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: report,
        })
    } catch (error) {
        console.error('Error fetching report:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch report',
            },
            { status: 500 }
        )
    }
}

// PATCH /api/reports/[id] - Update report (owner or admin)
const updateReportSchema = z.object({
    grieferName: z.string().min(1).max(100).optional(),
    game: z.string().min(1).optional(),
    description: z.string().min(10).max(5000).optional(),
    evidenceUrl: z.string().url().optional(),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    server: z.string().optional(),
    tags: z.array(z.string()).optional(),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth()
        const report = await AirtableService.getReportById(params.id)

        if (!report) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Report not found',
                },
                { status: 404 }
            )
        }

        // Check if user is owner or has admin role
        const isOwner = report.reporterId === session.user?.id
        const isAdmin = hasRole(session.user?.role || 'user', 'admin')

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden',
                    message: 'You can only edit your own reports',
                },
                { status: 403 }
            )
        }

        const body = await request.json()
        const validationResult = updateReportSchema.safeParse(body)

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

        const updatedReport = await AirtableService.updateReport(
            params.id,
            validationResult.data
        )

        return NextResponse.json({
            success: true,
            data: updatedReport,
            message: 'Report updated successfully',
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            )
        }

        console.error('Error updating report:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update report',
            },
            { status: 500 }
        )
    }
}

// DELETE /api/reports/[id] - Delete report (owner or admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth()
        const report = await AirtableService.getReportById(params.id)

        if (!report) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Report not found',
                },
                { status: 404 }
            )
        }

        // Check if user is owner or has admin role
        const isOwner = report.reporterId === session.user?.id
        const isAdmin = hasRole(session.user?.role || 'user', 'admin')

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden',
                    message: 'You can only delete your own reports',
                },
                { status: 403 }
            )
        }

        await AirtableService.deleteReport(params.id)

        return NextResponse.json({
            success: true,
            message: 'Report deleted successfully',
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            )
        }

        console.error('Error deleting report:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete report',
            },
            { status: 500 }
        )
    }
}
