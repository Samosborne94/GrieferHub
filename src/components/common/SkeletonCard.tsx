import React from 'react'

/**
 * SkeletonCard Component
 *
 * Displays a loading skeleton that matches the ReportCard layout.
 * Provides visual feedback during data fetching to improve perceived performance.
 *
 * Design decisions:
 * - Matches ReportCard structure for seamless transition
 * - Uses shimmer animation for engaging loading state
 * - Maintains consistent spacing and sizing with actual cards
 */

export const SkeletonCard: React.FC = () => {
    return (
        <div className="glass rounded-xl p-6 relative overflow-hidden">
            {/* Accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 skeleton" />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                    <div className="skeleton h-6 w-3/4 mb-2" />
                    <div className="skeleton h-4 w-1/2" />
                </div>
                <div className="skeleton h-6 w-20 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-2 mb-4">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-5/6" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
                <div className="skeleton h-7 w-16 rounded-full" />
                <div className="skeleton h-7 w-20 rounded-full" />
                <div className="skeleton h-7 w-16 rounded-full" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border-secondary">
                <div className="skeleton h-8 w-24 rounded-lg" />
                <div className="skeleton h-4 w-28" />
            </div>
        </div>
    )
}

/**
 * Grid of skeleton cards for displaying multiple loading states
 */
export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }, (_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}
