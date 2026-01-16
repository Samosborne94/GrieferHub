import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AirtableService } from '@/lib/services/airtable'
import { requireAuth } from '@/lib/auth'

// PUT /api/comments/[id] - Update a comment
const updateCommentSchema = z.object({
    content: z.string().min(1).max(2000),
})

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Require authentication
        const session = await requireAuth()

        const commentId = params.id
        const body = await request.json()

        // Validate input
        const validationResult = updateCommentSchema.safeParse(body)

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

        const { content } = validationResult.data

        // Check if comment exists
        const comment = await AirtableService.getCommentById(commentId)
        if (!comment) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Comment not found',
                },
                { status: 404 }
            )
        }

        // Check if user owns the comment or is a moderator/admin
        const user = await AirtableService.getUserById(session.user?.id || '')
        const canEdit =
            comment.authorId === session.user?.id ||
            user?.role === 'moderator' ||
            user?.role === 'admin'

        if (!canEdit) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden',
                    message: 'You can only edit your own comments',
                },
                { status: 403 }
            )
        }

        // Update comment
        const updatedComment = await AirtableService.updateComment(commentId, content)

        return NextResponse.json({
            success: true,
            data: updatedComment,
            message: 'Comment updated successfully',
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in to edit comments',
                },
                { status: 401 }
            )
        }

        console.error('Error updating comment:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update comment',
            },
            { status: 500 }
        )
    }
}

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Require authentication
        const session = await requireAuth()

        const commentId = params.id

        // Check if comment exists
        const comment = await AirtableService.getCommentById(commentId)
        if (!comment) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Comment not found',
                },
                { status: 404 }
            )
        }

        // Check if user owns the comment or is a moderator/admin
        const user = await AirtableService.getUserById(session.user?.id || '')
        const canDelete =
            comment.authorId === session.user?.id ||
            user?.role === 'moderator' ||
            user?.role === 'admin'

        if (!canDelete) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Forbidden',
                    message: 'You can only delete your own comments',
                },
                { status: 403 }
            )
        }

        // Delete comment
        await AirtableService.deleteComment(commentId)

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully',
        })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'You must be logged in to delete comments',
                },
                { status: 401 }
            )
        }

        console.error('Error deleting comment:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete comment',
            },
            { status: 500 }
        )
    }
}
