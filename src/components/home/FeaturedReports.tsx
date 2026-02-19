'use client'

import React from 'react'
import { Carousel } from '@/components/common/Carousel'
import { StatusBadge } from '@/components/reports/StatusBadge'
import Link from 'next/link'
import type { Report } from '@/types/report'

interface FeaturedReportsProps {
    reports: Report[]
}

export const FeaturedReports = ({ reports }: FeaturedReportsProps) => {
    if (reports.length === 0) {
        return null
    }

    return (
        <section className="py-16 bg-bg-secondary">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Featured Reports</h2>
                    <p className="text-text-secondary text-lg">
                        High-priority verified reports from the community
                    </p>
                </div>

                <div className="max-w-6xl mx-auto group">
                    <Carousel autoPlay interval={6000} showIndicators showControls>
                        {reports.map((report) => (
                            <FeaturedReportCard key={report.id} report={report} />
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    )
}

interface FeaturedReportCardProps {
    report: Report
}

const FeaturedReportCard = ({ report }: FeaturedReportCardProps) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical':
                return 'from-red-600 to-red-800'
            case 'High':
                return 'from-orange-600 to-orange-800'
            case 'Medium':
                return 'from-yellow-600 to-yellow-800'
            case 'Low':
                return 'from-green-600 to-green-800'
            default:
                return 'from-gray-600 to-gray-800'
        }
    }

    return (
        <div className="relative h-[500px] overflow-hidden rounded-2xl">
            {/* Background gradient based on severity */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${getSeverityColor(
                    report.severity
                )} opacity-20`}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col md:flex-row items-center gap-8 p-12">
                {/* Left Side - Report Info */}
                <div className="flex-1 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <StatusBadge status={report.status} />
                        <span
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                                report.severity === 'Critical'
                                    ? 'bg-red-500/10 text-red-500 border-red-500/30'
                                    : report.severity === 'High'
                                    ? 'bg-orange-500/10 text-orange-500 border-orange-500/30'
                                    : report.severity === 'Medium'
                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                                    : 'bg-green-500/10 text-green-500 border-green-500/30'
                            }`}
                        >
                            {report.severity.toUpperCase()} SEVERITY
                        </span>
                    </div>

                    {/* Griefer Name */}
                    <div>
                        <h3 className="text-5xl font-bold mb-2">{report.grieferName}</h3>
                        <p className="text-text-secondary text-lg">
                            Reported in <span className="text-accent-primary font-semibold">{report.game}</span>
                        </p>
                    </div>

                    {/* Description Preview */}
                    <p className="text-text-secondary leading-relaxed line-clamp-3 text-lg">
                        {report.description}
                    </p>

                    {/* Tags */}
                    {report.tags && report.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {report.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm text-text-tertiary border border-border-secondary"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-6 text-sm text-text-tertiary">
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        {report.server && (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                                    />
                                </svg>
                                {report.server}
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <Link href={`/report/${report.id}`}>
                        <button className="px-8 py-4 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2">
                            View Full Report
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </button>
                    </Link>
                </div>

                {/* Right Side - Visual Element */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-80 h-80">
                        {/* Animated Circle */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 animate-pulse" />

                        {/* Warning Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 rounded-full bg-red-500/10 border-4 border-red-500/30 flex items-center justify-center">
                                <svg
                                    className="w-24 h-24 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Report ID Badge */}
                        <div className="absolute -top-4 -right-4 bg-bg-elevated border border-border-primary rounded-full px-6 py-3 shadow-lg">
                            <p className="text-xs text-text-tertiary">Report ID</p>
                            <p className="font-mono font-bold text-accent-primary">
                                #{report.id.slice(0, 8)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
        </div>
    )
}
