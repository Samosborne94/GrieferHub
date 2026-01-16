'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/common/Button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import type { Comment } from '@/types/comment'

interface CommentsSectionProps {
    reportId: string
}

export const CommentsSection = ({ reportId }: CommentsSectionProps) => {
    const { data: session, status } = useSession()
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Fetch comments on mount
    useEffect(() => {
        fetchComments()
    }, [reportId])

    const fetchComments = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/reports/${reportId}/comments`)
            const data = await response.json()

            if (data.success) {
                setComments(data.data)
            } else {
                setError('Failed to load comments')
            }
        } catch (err) {
            console.error('Error fetching comments:', err)
            setError('Failed to load comments')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !session) return

        try {
            setIsSubmitting(true)
            setError(null)

            const response = await fetch(`/api/reports/${reportId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newComment }),
            })

            const data = await response.json()

            if (data.success) {
                setComments([data.data, ...comments])
                setNewComment('')
            } else {
                setError(data.message || 'Failed to post comment')
            }
        } catch (err) {
            console.error('Error posting comment:', err)
            setError('Failed to post comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = async (commentId: string) => {
        if (!editContent.trim()) return

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editContent }),
            })

            const data = await response.json()

            if (data.success) {
                setComments(
                    comments.map((c) => (c.id === commentId ? data.data : c))
                )
                setEditingId(null)
                setEditContent('')
            } else {
                setError(data.message || 'Failed to update comment')
            }
        } catch (err) {
            console.error('Error updating comment:', err)
            setError('Failed to update comment')
        }
    }

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
            })

            const data = await response.json()

            if (data.success) {
                setComments(comments.filter((c) => c.id !== commentId))
            } else {
                setError(data.message || 'Failed to delete comment')
            }
        } catch (err) {
            console.error('Error deleting comment:', err)
            setError('Failed to delete comment')
        }
    }

    const startEdit = (comment: Comment) => {
        setEditingId(comment.id)
        setEditContent(comment.content)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditContent('')
    }

    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

        if (seconds < 60) return 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
        return new Date(date).toLocaleDateString()
    }

    const canEditComment = (comment: Comment) => {
        return (
            session?.user?.id === comment.authorId ||
            session?.user?.role === 'moderator' ||
            session?.user?.role === 'admin'
        )
    }

    return (
        <div className="mt-12 border-t border-border-primary pt-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <svg
                    className="w-5 h-5 text-accent-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                </svg>
                Intel Discussion{' '}
                <span className="text-sm font-normal text-text-tertiary ml-2">
                    ({comments.length})
                </span>
            </h3>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}

            {/* Comment Form */}
            {session ? (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 bg-bg-tertiary/30 p-4 rounded-xl border border-border-secondary"
                >
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add to the intelligence report..."
                        className="w-full bg-bg-secondary border border-border-primary rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/50 transition-all resize-none h-24 mb-3"
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-text-tertiary">
                            Please keep discussions civil and relevant.
                        </span>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!newComment.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="mb-8 bg-bg-tertiary/30 p-4 rounded-xl border border-border-secondary text-center">
                    <p className="text-sm text-text-secondary">
                        Please{' '}
                        <a href="/login" className="text-accent-primary hover:underline">
                            sign in
                        </a>{' '}
                        to post a comment.
                    </p>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                    <p>No comments yet. Be the first to add intel!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bg-elevated border border-border-primary flex items-center justify-center text-accent-primary font-bold">
                                {comment.authorUsername.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className={`font-semibold text-sm ${
                                            comment.authorRole === 'moderator'
                                                ? 'text-green-400'
                                                : comment.authorRole === 'admin'
                                                ? 'text-red-400'
                                                : 'text-text-primary'
                                        }`}
                                    >
                                        {comment.authorUsername}
                                    </span>
                                    {comment.authorRole === 'moderator' && (
                                        <span className="px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 text-[10px] uppercase font-bold border border-green-900/50">
                                            MOD
                                        </span>
                                    )}
                                    {comment.authorRole === 'admin' && (
                                        <span className="px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 text-[10px] uppercase font-bold border border-red-900/50">
                                            ADMIN
                                        </span>
                                    )}
                                    <span className="text-xs text-text-tertiary">
                                        • {formatTimeAgo(comment.createdAt)}
                                    </span>
                                    {comment.isEdited && (
                                        <span className="text-xs text-text-tertiary">(edited)</span>
                                    )}
                                </div>

                                {editingId === comment.id ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full bg-bg-secondary border border-border-primary rounded-lg p-2 text-sm text-text-primary focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/50 transition-all resize-none h-20 mb-2"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleEdit(comment.id)}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-text-secondary text-sm leading-relaxed">
                                            {comment.content}
                                        </p>
                                        {canEditComment(comment) && (
                                            <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEdit(comment)}
                                                    className="text-xs text-text-tertiary hover:text-accent-primary transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="text-xs text-text-tertiary hover:text-red-400 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
