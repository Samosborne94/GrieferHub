import React from 'react'
import type { ReportStatus } from '@/types/report'

interface StatusBadgeProps {
    status: ReportStatus
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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

    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${config.bg} ${config.border} ${config.text}
      border
    `}>
            {status}
        </span>
    )
}
