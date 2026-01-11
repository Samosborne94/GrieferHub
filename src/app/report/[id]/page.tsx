'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatusBadge } from '@/components/reports/StatusBadge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/common/Button'
import type { Report } from '@/types/report'

export default function ReportDetailPage() {
    const params = useParams()
    const router = useRouter()
    const reportId = params.id as string

    const [report, setReport] = useState<Report | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/reports/${reportId}`)
                const data = await response.json()

                if (data.success) {
                    setReport(data.data)
                    setError(null)
                } else {
                    setError(data.error || 'Failed to fetch report')
                }
            } catch (err) {
                setError('Failed to fetch report')
                console.error('Error fetching report:', err)
            } finally {
                setLoading(false)
            }
        }

        if (reportId) {
            fetchReport()
        }
    }, [reportId])

    const severityColors = {
        Low: 'text-gray-400',
        Medium: 'text-yellow-500',
        High: 'text-orange-500',
        Critical: 'text-red-500',
    }

    const severityBgColors = {
        Low: 'bg-gray-500/20 border-gray-500',
        Medium: 'bg-yellow-500/20 border-yellow-500',
        High: 'bg-orange-500/20 border-orange-500',
        Critical: 'bg-red-500/20 border-red-500',
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </main>
                <Footer />
            </div>
        )
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container py-8">
                    <div className="glass rounded-lg p-8 text-center max-w-2xl mx-auto">
                        <p className="text-red-500 mb-4 text-lg">
                            {error || 'Report not found'}
                        </p>
                        <Button onClick={() => router.push('/intel')} variant="primary">
                            Back to Intel Board
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="text-text-secondary hover:text-accent-primary transition-colors mb-6 flex items-center gap-2"
                >
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Report Header */}
                        <div className="glass rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                                        {report.grieferName}
                                    </h1>
                                    <p className="text-text-secondary">{report.game}</p>
                                </div>
                                <StatusBadge status={report.status} />
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full border ${severityBgColors[report.severity]} ${severityColors[report.severity]} font-medium`}
                                >
                                    {report.severity} Severity
                                </span>
                                {report.server && (
                                    <span className="text-text-tertiary">
                                        Server: {report.server}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Evidence Video */}
                        {report.evidenceUrl && (
                            <div className="glass rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-4">
                                    Evidence
                                </h2>
                                <div className="aspect-video bg-bg-tertiary rounded-lg overflow-hidden">
                                    {/* Check if it's a video URL */}
                                    {report.evidenceUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video
                                            controls
                                            className="w-full h-full"
                                            src={report.evidenceUrl}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : report.evidenceUrl.includes('youtube.com') ||
                                      report.evidenceUrl.includes('youtu.be') ? (
                                        <iframe
                                            className="w-full h-full"
                                            src={report.evidenceUrl.replace(
                                                'watch?v=',
                                                'embed/'
                                            )}
                                            title="Evidence video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-6">
                                            <a
                                                href={report.evidenceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent-primary hover:underline mb-2"
                                            >
                                                View Evidence
                                            </a>
                                            <p className="text-xs text-text-tertiary text-center">
                                                Evidence link available but cannot be embedded
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="glass rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">
                                Description
                            </h2>
                            <p className="text-text-secondary whitespace-pre-wrap">
                                {report.description}
                            </p>
                        </div>

                        {/* Tags */}
                        {report.tags && report.tags.length > 0 && (
                            <div className="glass rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-4">
                                    Tags
                                </h2>
                                <div className="flex gap-2 flex-wrap">
                                    {report.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 rounded-full text-sm bg-bg-tertiary text-text-secondary border border-gray-700"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Metadata */}
                        <div className="glass rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">
                                Report Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-text-tertiary mb-1">Report ID</p>
                                    <p className="text-sm text-text-secondary font-mono">
                                        #{report.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-tertiary mb-1">
                                        Submitted
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-xs text-text-tertiary">
                                        {new Date(report.createdAt).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-tertiary mb-1">
                                        Last Updated
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        {new Date(report.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="glass rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">
                                Actions
                            </h2>
                            <div className="space-y-2">
                                <Button
                                    variant="secondary"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href)
                                        alert('Link copied to clipboard!')
                                    }}
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Share Report
                                </Button>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="glass rounded-lg p-6 border-l-4 border-accent-primary">
                            <p className="text-xs text-text-tertiary">
                                Reports are community-submitted and reviewed by moderators.
                                Always verify information independently.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
