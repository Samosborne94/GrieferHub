'use client'

import React from 'react'
import Link from 'next/link'
import type { Report } from '@/types/report'
import { StatusBadge } from './StatusBadge'

interface ReportCardProps {
    report: Report
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
    const severityColors = {
        Low: 'text-gray-400',
        Medium: 'text-yellow-500',
        High: 'text-orange-500',
        Critical: 'text-red-500',
    }

    return (
        <Link href={`/report/${report.id}`}>
            <div className="glass rounded-lg p-5 hover:border-accent-primary transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                            {report.grieferName}
                        </h3>
                        <p className="text-sm text-text-tertiary">{report.game}</p>
                    </div>
                    <StatusBadge status={report.status} />
                </div>

                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                    {report.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                        <span className={`font-medium ${severityColors[report.severity]}`}>
                            {report.severity}
                        </span>
                        {report.server && (
                            <span className="text-text-tertiary">
                                {report.server}
                            </span>
                        )}
                    </div>
                    <span className="text-text-tertiary">
                        {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {report.tags && report.tags.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {report.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 rounded text-xs bg-bg-tertiary text-text-tertiary"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    )
}
