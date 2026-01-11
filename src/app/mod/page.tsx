'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Input } from '@/components/common/Input'
import { StatusBadge } from '@/components/reports/StatusBadge'
import type { Report, ReportStatus, ReportSeverity } from '@/types/report'
import { hasRole } from '@/lib/auth'

export default function ModerationDashboardPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    // Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedGame, setSelectedGame] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<ReportStatus | ''>('')
    const [selectedSeverity, setSelectedSeverity] = useState<ReportSeverity | ''>('')

    // Check if user is moderator or admin
    const isModerator =
        session?.user?.role &&
        (session.user.role === 'moderator' || session.user.role === 'admin')

    // Redirect if not authenticated or not a moderator
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/mod')
        } else if (status === 'authenticated' && !isModerator) {
            router.push('/')
        }
    }, [status, isModerator, router])

    // Fetch reports
    useEffect(() => {
        if (status === 'authenticated' && isModerator) {
            fetchReports()
        }
    }, [status, isModerator, searchQuery, selectedGame, selectedStatus, selectedSeverity])

    const fetchReports = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()

            if (searchQuery) params.append('search', searchQuery)
            if (selectedGame) params.append('game', selectedGame)
            if (selectedStatus) params.append('status', selectedStatus)
            if (selectedSeverity) params.append('severity', selectedSeverity)

            const response = await fetch(`/api/mod/reports?${params.toString()}`)
            const data = await response.json()

            if (data.success) {
                setReports(data.data || [])
                setError(null)
            } else {
                setError(data.message || data.error || 'Failed to fetch reports')
            }
        } catch (err) {
            setError('Failed to fetch reports')
            console.error('Error fetching reports:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (reportId: string, newStatus: ReportStatus) => {
        try {
            setUpdatingId(reportId)

            const response = await fetch(`/api/mod/reports/${reportId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })

            const data = await response.json()

            if (data.success) {
                // Update local state
                setReports((prev) =>
                    prev.map((r) =>
                        r.id === reportId ? { ...r, status: newStatus } : r
                    )
                )
            } else {
                alert(data.message || 'Failed to update status')
            }
        } catch (err) {
            console.error('Error updating status:', err)
            alert('Failed to update status')
        } finally {
            setUpdatingId(null)
        }
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

    if (status === 'unauthenticated' || !isModerator) {
        return null // Will redirect
    }

    // Get unique games from reports
    const uniqueGames = Array.from(new Set(reports.map((r) => r.game))).sort()

    const severityColors = {
        Low: 'text-gray-400',
        Medium: 'text-yellow-500',
        High: 'text-orange-500',
        Critical: 'text-red-500',
    }

    // Stats
    const stats = {
        total: reports.length,
        underReview: reports.filter((r) => r.status === 'Under Review').length,
        verified: reports.filter((r) => r.status === 'Verified').length,
        rejected: reports.filter((r) => r.status === 'Rejected').length,
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                        Moderation Dashboard
                    </h1>
                    <p className="text-text-secondary">
                        Review and manage griefer reports
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-text-primary mb-1">
                            {stats.total}
                        </div>
                        <div className="text-sm text-text-tertiary">Total Reports</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-yellow-500 mb-1">
                            {stats.underReview}
                        </div>
                        <div className="text-sm text-text-tertiary">Under Review</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-green-500 mb-1">
                            {stats.verified}
                        </div>
                        <div className="text-sm text-text-tertiary">Verified</div>
                    </div>
                    <div className="glass rounded-lg p-6">
                        <div className="text-2xl font-bold text-red-500 mb-1">
                            {stats.rejected}
                        </div>
                        <div className="text-sm text-text-tertiary">Rejected</div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="glass rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <Input
                                type="text"
                                placeholder="Search by griefer name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Game Filter */}
                        <div>
                            <select
                                value={selectedGame}
                                onChange={(e) => setSelectedGame(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                            >
                                <option value="">All Games</option>
                                {uniqueGames.map((game) => (
                                    <option key={game} value={game}>
                                        {game}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(e.target.value as ReportStatus | '')
                                }
                                className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                            >
                                <option value="">All Statuses</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Verified">Verified</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Severity Filter */}
                        <div>
                            <select
                                value={selectedSeverity}
                                onChange={(e) =>
                                    setSelectedSeverity(e.target.value as ReportSeverity | '')
                                }
                                className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                            >
                                <option value="">All Severities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="glass rounded-lg p-8 text-center mb-8">
                        <p className="text-red-500 mb-2">Error loading reports</p>
                        <p className="text-text-tertiary text-sm">{error}</p>
                    </div>
                )}

                {/* Reports List */}
                {!error && reports.length === 0 ? (
                    <div className="glass rounded-lg p-8 text-center">
                        <p className="text-text-secondary mb-2">No reports found</p>
                        <p className="text-text-tertiary text-sm">
                            {searchQuery || selectedGame || selectedStatus || selectedSeverity
                                ? 'Try adjusting your filters'
                                : 'No reports to review at this time'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="mb-4 text-sm text-text-tertiary">
                            Showing {reports.length} report(s)
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
                                            <span>•</span>
                                            <span>
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                    {report.description}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    <button
                                        onClick={() => handleViewReport(report.id)}
                                        className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary text-sm hover:border-accent-primary transition-colors"
                                    >
                                        View Details
                                    </button>

                                    {/* Status Update Buttons */}
                                    <div className="flex gap-2 ml-auto">
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(report.id, 'Verified')
                                            }
                                            disabled={
                                                updatingId === report.id ||
                                                report.status === 'Verified'
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-green-900/20 border border-green-700 text-green-500 text-sm hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {updatingId === report.id ? 'Updating...' : 'Verify'}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(report.id, 'Rejected')
                                            }
                                            disabled={
                                                updatingId === report.id ||
                                                report.status === 'Rejected'
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-red-900/20 border border-red-700 text-red-500 text-sm hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {updatingId === report.id ? 'Updating...' : 'Reject'}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(report.id, 'Resolved')
                                            }
                                            disabled={
                                                updatingId === report.id ||
                                                report.status === 'Resolved'
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-blue-900/20 border border-blue-700 text-blue-500 text-sm hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {updatingId === report.id ? 'Updating...' : 'Resolve'}
                                        </button>
                                    </div>
                                </div>

                                {report.tags && report.tags.length > 0 && (
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {report.tags.map((tag, index) => (
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
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
