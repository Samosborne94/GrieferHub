import React from 'react'
import type { ReportStatus } from '@/types/report'

export interface StatusBadgeProps {
    status: ReportStatus
    size?: 'sm' | 'md' | 'lg'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
    const statusConfig = {
        'Verified': {
            bg: 'bg-green-500/20',
            border: 'border-green-500',
            text: 'text-green-500',
        },
        'Under Review': {
            bg: 'bg-yellow-500/20',
            border: 'border-yellow-500',
            text: 'text-yellow-500',
        },
        'Resolved': {
            bg: 'bg-blue-500/20',
            border: 'border-blue-500',
            text: 'text-blue-500',
        },
        'Rejected': {
            bg: 'bg-red-500/20',
            border: 'border-red-500',
            text: 'text-red-500',
        },
    }

    const config = statusConfig[status]

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
    }

    return (
        <span className={`
      inline-flex items-center rounded-full font-medium
      ${sizeClasses[size]}
      ${config.bg} ${config.border} ${config.text}
      border
    `}>
            {status}
        </span>
    )
}
