'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/reports/StatusBadge'
import type { Report } from '@/types/report'

export default function DashboardPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/dashboard')
        }
    }, [status, router])

    // Fetch user's reports
    useEffect(() => {
        if (status === 'authenticated') {
            fetchReports()
        }
    }, [status])

    const fetchReports = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/reports/me')
            const data = await response.json()

            if (data.success) {
                setReports(data.data || [])
                setError(null)
            } else {
                setError(data.error || 'Failed to fetch your reports')
            }
        } catch (err) {
            setError('Failed to fetch your reports')
            console.error('Error fetching reports:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            return
        }

        try {
            setDeletingId(id)
            const response = await fetch(`/api/reports/${id}`, {
                method: 'DELETE',
            })

            const data = await response.json()

            if (data.success) {
                // Remove from local state
                setReports((prev) => prev.filter((r) => r.id !== id))
            } else {
                alert(data.message || 'Failed to delete report')
            }
        } catch (err) {
            console.error('Error deleting report:', err)
            alert('Failed to delete report')
        } finally {
            setDeletingId(null)
        }
    }

    const handleEdit = (id: string) => {
        router.push(`/report/${id}/edit`)
    }

    const handleViewReport = (id: string) => {
        router.push(`/report/${id}`)
    }

    if (status === 'loading' || (status === 'authenticated' && loading)) {
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

    if (status === 'unauthenticated') {
        return null // Will redirect
    }

    const severityColors = {
        Low: 'text-gray-400',
        Medium: 'text-yellow-500',
        High: 'text-orange-500',
        Critical: 'text-red-500',
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                        My Dashboard
                    </h1>
                    <p className="text-text-secondary">
                        Manage your submitted reports and track their status
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-text-primary mb-1">
                            {reports.length}
                        </div>
                        <div className="text-sm text-text-tertiary">Total Reports</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-green-500 mb-1">
                            {reports.filter((r) => r.status === 'Verified').length}
                        </div>
                        <div className="text-sm text-text-tertiary">Verified</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-yellow-500 mb-1">
                            {reports.filter((r) => r.status === 'Under Review').length}
                        </div>
                        <div className="text-sm text-text-tertiary">Under Review</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-blue-500 mb-1">
                            {reports.filter((r) => r.status === 'Resolved').length}
                        </div>
                        <div className="text-sm text-text-tertiary">Resolved</div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="glass rounded-lg p-8 text-center mb-8">
                        <p className="text-red-500 mb-2">Error loading reports</p>
                        <p className="text-text-tertiary text-sm">{error}</p>
                        <Button onClick={fetchReports} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Reports List */}
                {!error && reports.length === 0 ? (
                    <div className="glass rounded-lg p-8 text-center">
                        <p className="text-text-secondary mb-2">No reports yet</p>
                        <p className="text-text-tertiary text-sm mb-6">
                            Submit your first report to start tracking griefers
                        </p>
                        <Button onClick={() => router.push('/submit')}>
                            Submit Report
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-text-primary">
                                Your Reports ({reports.length})
                            </h2>
                            <Button onClick={() => router.push('/submit')}>
                                + New Report
                            </Button>
                        </div>

                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="glass rounded-lg p-6 hover:border-accent-primary transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-text-primary">
                                                {report.grieferName}
                                            </h3>
                                            <StatusBadge status={report.status} />
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-text-tertiary mb-3">
                                            <span>{report.game}</span>
                                            <span>•</span>
                                            <span
                                                className={`font-medium ${
                                                    severityColors[report.severity]
                                                }`}
                                            >
                                                {report.severity}
                                            </span>
                                            {report.server && (
                                                <>
                                                    <span>•</span>
                                                    <span>{report.server}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewReport(report.id)}
                                            className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary text-sm hover:border-accent-primary transition-colors"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(report.id)}
                                            className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary text-sm hover:border-blue-500 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(report.id)}
                                            disabled={deletingId === report.id}
                                            className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-gray-700 text-red-500 text-sm hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {deletingId === report.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                    {report.description}
                                </p>

                                <div className="flex items-center justify-between text-xs">
                                    {report.tags && report.tags.length > 0 && (
                                        <div className="flex gap-2 flex-wrap">
                                            {report.tags.slice(0, 5).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 rounded text-xs bg-bg-tertiary text-text-tertiary"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="text-text-tertiary ml-auto">
                                        <div>
                                            Created: {new Date(report.createdAt).toLocaleDateString()}
                                        </div>
                                        <div>
                                            Updated: {new Date(report.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
