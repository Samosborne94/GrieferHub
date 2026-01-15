import React from 'react'

/**
 * Badge Component
 *
 * A versatile badge component for displaying status, labels, and counts.
 * Supports multiple variants, sizes, and interactive states.
 *
 * Design Rationale:
 * - Semantic color coding for instant recognition
 * - Consistent sizing system for visual hierarchy
 * - Optional dot indicator for status visualization
 * - Smooth transitions for polished interactions
 */

export interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'verified' | 'pending' | 'rejected'
    size?: 'sm' | 'md' | 'lg'
    dot?: boolean
    outline?: boolean
    className?: string
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    outline = false,
    className = '',
}) => {
    // Variant styling maps
    const variantClasses = {
        default: outline
            ? 'bg-transparent text-text-secondary border-border-primary hover:border-border-accent hover:text-text-primary'
            : 'bg-bg-elevated text-text-secondary border-border-secondary',
        primary: outline
            ? 'bg-transparent text-accent-primary border-accent-primary/30 hover:bg-accent-muted'
            : 'bg-accent-muted text-accent-primary border-accent-primary/30 hover:bg-accent-muted-hover',
        success: outline
            ? 'bg-transparent text-status-verified border-status-verified-border hover:bg-status-verified-bg'
            : 'bg-status-verified-bg text-status-verified border-status-verified-border hover:bg-success-bg',
        warning: outline
            ? 'bg-transparent text-status-review border-status-review-border hover:bg-status-review-bg'
            : 'bg-status-review-bg text-status-review border-status-review-border hover:bg-warning-bg',
        error: outline
            ? 'bg-transparent text-status-rejected border-status-rejected-border hover:bg-status-rejected-bg'
            : 'bg-status-rejected-bg text-status-rejected border-status-rejected-border hover:bg-error-bg',
        info: outline
            ? 'bg-transparent text-status-resolved border-status-resolved-border hover:bg-status-resolved-bg'
            : 'bg-status-resolved-bg text-status-resolved border-status-resolved-border hover:bg-info-bg',
        verified: outline
            ? 'bg-transparent text-status-verified border-status-verified-border hover:bg-status-verified-bg'
            : 'bg-status-verified-bg text-status-verified border-status-verified-border',
        pending: outline
            ? 'bg-transparent text-status-pending border-status-pending-border hover:bg-status-pending-bg'
            : 'bg-status-pending-bg text-status-pending border-status-pending-border',
        rejected: outline
            ? 'bg-transparent text-status-rejected border-status-rejected-border hover:bg-status-rejected-bg'
            : 'bg-status-rejected-bg text-status-rejected border-status-rejected-border',
    }

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    }

    const dotSizeClasses = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5',
    }

    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                font-semibold rounded-full
                border
                transition-all duration-200
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${className}
            `}
        >
            {dot && (
                <span
                    className={`
                        rounded-full
                        ${dotSizeClasses[size]}
                        bg-current
                        animate-pulse-fast
                    `}
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    )
}

// Convenience components for specific use cases
export const StatusBadgeEnhanced: React.FC<{ status: 'Verified' | 'Under Review' | 'Resolved' | 'Rejected' | 'Pending'; className?: string }> = ({ status, className }) => {
    const variantMap = {
        'Verified': 'verified' as const,
        'Under Review': 'warning' as const,
        'Resolved': 'info' as const,
        'Rejected': 'rejected' as const,
        'Pending': 'pending' as const,
    }

    return (
        <Badge variant={variantMap[status]} dot className={className}>
            {status}
        </Badge>
    )
}

export const SeverityBadge: React.FC<{ severity: 'Low' | 'Medium' | 'High' | 'Critical'; className?: string }> = ({ severity, className }) => {
    const variantMap = {
        'Low': 'default' as const,
        'Medium': 'warning' as const,
        'High': 'error' as const,
        'Critical': 'error' as const,
    }

    const dots = {
        'Low': 1,
        'Medium': 2,
        'High': 3,
        'Critical': 4,
    }

    return (
        <Badge variant={variantMap[severity]} className={className}>
            <span className="flex items-center gap-1">
                <span aria-label={`Severity: ${severity}`}>
                    {'●'.repeat(dots[severity])}
                </span>
                <span>{severity}</span>
            </span>
        </Badge>
    )
}
