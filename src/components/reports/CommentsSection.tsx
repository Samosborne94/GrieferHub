'use client'

import React, { useState } from 'react'
import { Button } from '@/components/common/Button'

interface Comment {
    id: string
    author: string
    content: string
    timestamp: string
    verified: boolean
    role: 'User' | 'Moderator' | 'Admin'
}

// Mock Data
const MOCK_COMMENTS: Comment[] = [
    {
        id: '1',
        author: 'SquadLeader_01',
        content: 'Can confirm. This guy joined our lobby last week and did the exact same thing. Stay away.',
        timestamp: '2 hours ago',
        verified: true,
        role: 'User'
    },
    {
        id: '2',
        author: 'GrieferHunter',
        content: 'We are tracking this ID across 3 different servers. Thanks for the report.',
        timestamp: '45 mins ago',
        verified: true,
        role: 'Moderator'
    }
]

export const CommentsSection = () => {
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
    const [newComment, setNewComment] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const comment: Comment = {
            id: Date.now().toString(),
            author: 'You', // Placeholder for current user
            content: newComment,
            timestamp: 'Just now',
            verified: false,
            role: 'User'
        }

        setComments([comment, ...comments])
        setNewComment('')
    }

    return (
        <div className="mt-12 border-t border-border-primary pt-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Intel Discussion <span className="text-sm font-normal text-text-tertiary ml-2">({comments.length})</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8 bg-bg-tertiary/30 p-4 rounded-xl border border-border-secondary">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add to the intelligence report..."
                    className="w-full bg-bg-secondary border border-border-primary rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/50 transition-all resize-none h-24 mb-3"
                />
                <div className="flex justify-between items-center">
                    <span className="text-xs text-text-tertiary">Please keep discussions civil and relevant.</span>
                    <Button type="submit" size="sm" disabled={!newComment.trim()}>Post Comment</Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bg-elevated border border-border-primary flex items-center justify-center text-accent-primary font-bold">
                            {comment.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`font-semibold text-sm ${comment.role === 'Moderator' ? 'text-green-400' : 'text-text-primary'}`}>
                                    {comment.author}
                                </span>
                                {comment.role === 'Moderator' && (
                                    <span className="px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 text-[10px] uppercase font-bold border border-green-900/50">MOD</span>
                                )}
                                {comment.verified && (
                                    <span className="text-accent-primary" title="Verified Reporter">✓</span>
                                )}
                                <span className="text-xs text-text-tertiary">• {comment.timestamp}</span>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
