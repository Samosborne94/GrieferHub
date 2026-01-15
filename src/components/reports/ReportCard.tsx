'use client'

import React from 'react'
import Link from 'next/link'
import type { Report } from '@/types/report'
import { StatusBadge } from './StatusBadge'

interface ReportCardProps {
    report: Report
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
    const severityConfig = {
        Low: {
            color: 'text-severity-low',
            bg: 'bg-severity-low/10',
            border: 'border-severity-low/30',
            icon: '●',
        },
        Medium: {
            color: 'text-severity-medium',
            bg: 'bg-severity-medium/10',
            border: 'border-severity-medium/30',
            icon: '●●',
        },
        High: {
            color: 'text-severity-high',
            bg: 'bg-severity-high/10',
            border: 'border-severity-high/30',
            icon: '●●●',
        },
        Critical: {
            color: 'text-severity-critical',
            bg: 'bg-severity-critical/10',
            border: 'border-severity-critical/30',
            icon: '●●●●',
        },
    }

    const config = severityConfig[report.severity]

    return (
        <Link href={`/report/${report.id}`}>
            <article className="glass-hover rounded-xl p-6 cursor-pointer group relative overflow-hidden">
                {/* Accent bar on the left */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bg} group-hover:w-1.5 transition-all duration-300`} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors duration-200 truncate">
                            {report.grieferName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-text-tertiary">{report.game}</span>
                            {report.server && (
                                <>
                                    <span className="text-text-muted">•</span>
                                    <span className="text-sm text-text-tertiary truncate">
                                        {report.server}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusBadge status={report.status} />
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 group-hover:text-text-primary transition-colors duration-200">
                    {report.description}
                </p>

                {/* Tags */}
                {report.tags && report.tags.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {report.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 rounded-full text-xs bg-bg-elevated text-text-tertiary border border-border-secondary group-hover:border-border-primary transition-colors duration-200"
                            >
                                {tag}
                            </span>
                        ))}
                        {report.tags.length > 3 && (
                            <span className="px-3 py-1 rounded-full text-xs text-text-muted">
                                +{report.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border-secondary">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} border ${config.border}`}>
                        <span className={`text-xs ${config.color}`}>{config.icon}</span>
                        <span className={`text-xs font-semibold ${config.color}`}>
                            {report.severity}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time dateTime={new Date(report.createdAt).toISOString()}>
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </time>
                    </div>
                </div>

                {/* Hover arrow indicator */}
                <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                    <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </article>
        </Link>
    )
}
