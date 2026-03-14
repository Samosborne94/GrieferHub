import React from 'react'
import Link from 'next/link'
import { Button } from './Button'

/**
 * EmptyState Component
 *
 * Displays engaging empty state messages with contextual actions.
 * Improves UX by providing clear guidance when no data is available.
 *
 * Design principles:
 * - Clear messaging about why content is empty
 * - Actionable next steps with CTA buttons
 * - Visually appealing icons and illustrations
 * - Responsive layout that works on all screen sizes
 */

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description: string
    action?: {
        label: string
        href?: string
        onClick?: () => void
    }
    variant?: 'default' | 'search' | 'filter' | 'error'
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    variant = 'default',
}) => {
    const defaultIcons = {
        default: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
            </svg>
        ),
        search: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        ),
        filter: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
            </svg>
        ),
        error: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
        ),
    }

    const displayIcon = icon || defaultIcons[variant]

    return (
        <div className="glass rounded-2xl p-12 md:p-16 text-center animate-fade-in">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-bg-elevated/50 text-text-tertiary mb-6">
                {displayIcon}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-text-primary mb-3">{title}</h3>

            {/* Description */}
            <p className="text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
                {description}
            </p>

            {/* Action Button */}
            {action && (
                <div className="flex justify-center">
                    {action.href ? (
                        <Link href={action.href}>
                            <Button variant="primary" glow>
                                {action.label}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="primary"
                            glow
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

/**
 * Pre-configured empty states for common scenarios
 */
export const NoReportsFound: React.FC<{ onClear?: () => void }> = ({ onClear }) => (
    <EmptyState
        variant="search"
        title="No Reports Found"
        description="We couldn't find any reports matching your search criteria. Try adjusting your filters or search terms."
        action={
            onClear
                ? {
                      label: 'Clear Filters',
                      onClick: onClear,
                  }
                : undefined
        }
    />
)

export const NoReportsYet: React.FC = () => (
    <EmptyState
        variant="default"
        title="No Reports Yet"
        description="Be the first to contribute! Help build a safer gaming community by submitting a report."
        action={{
            label: 'Submit First Report',
            href: '/submit',
        }}
    />
)

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
    message,
    onRetry,
}) => (
    <EmptyState
        variant="error"
        title="Something Went Wrong"
        description={
            message || "We're having trouble loading the data. Please try again in a moment."
        }
        action={
            onRetry
                ? {
                      label: 'Try Again',
                      onClick: onRetry,
                  }
                : undefined
        }
    />
)
