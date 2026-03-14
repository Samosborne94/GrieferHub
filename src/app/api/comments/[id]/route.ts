import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
    apiSuccess,
    getAuthenticatedUserId,
    handleApiError,
    parseJsonBody,
} from '@/lib/api/route'
import { forbidden, notFound } from '@/lib/errors'
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
        const session = await requireAuth()

        const commentId = params.id
        const { content } = await parseJsonBody(request, updateCommentSchema)

        // Check if comment exists
        const comment = await AirtableService.getCommentById(commentId)
        if (!comment) {
            throw notFound('Comment not found')
        }

        // Check if user owns the comment or is a moderator/admin
        const user = await AirtableService.getUserById(getAuthenticatedUserId(session))
        const canEdit =
            comment.authorId === getAuthenticatedUserId(session) ||
            user?.role === 'moderator' ||
            user?.role === 'admin'

        if (!canEdit) {
            throw forbidden('You can only edit your own comments')
        }

        // Update comment
        const updatedComment = await AirtableService.updateComment(commentId, content)

        return apiSuccess(updatedComment, { message: 'Comment updated successfully' })
    } catch (error) {
        return handleApiError(error, request, 'Update comment', { commentId: params.id })
    }
}

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth()

        const commentId = params.id

        // Check if comment exists
        const comment = await AirtableService.getCommentById(commentId)
        if (!comment) {
            throw notFound('Comment not found')
        }

        // Check if user owns the comment or is a moderator/admin
        const user = await AirtableService.getUserById(getAuthenticatedUserId(session))
        const canDelete =
            comment.authorId === getAuthenticatedUserId(session) ||
            user?.role === 'moderator' ||
            user?.role === 'admin'

        if (!canDelete) {
            throw forbidden('You can only delete your own comments')
        }

        // Delete comment
        await AirtableService.deleteComment(commentId)

        return apiSuccess(undefined, { message: 'Comment deleted successfully' })
    } catch (error) {
        return handleApiError(error, request, 'Delete comment', { commentId: params.id })
    }
}
