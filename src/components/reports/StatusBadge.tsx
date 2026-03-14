import React from 'react'
import type { ReportStatus } from '@/types/report'
import { Badge } from '../common/Badge'
import type { BadgeProps } from '../common/Badge'

interface StatusBadgeProps {
    status: ReportStatus
    size?: BadgeProps['size']
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
    const variantMap: Record<ReportStatus, BadgeProps['variant']> = {
        'Verified': 'success',
        'Under Review': 'warning',
        'Resolved': 'info',
        'Rejected': 'error',
    }

    return (
        <Badge variant={variantMap[status]} dot size={size}>
            {status}
        </Badge>
    )
}
