'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReportCard } from '@/components/reports/ReportCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Input } from '@/components/common/Input'
import type { Report, ReportStatus, ReportSeverity } from '@/types/report'

export default function IntelBoardPage() {
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedGame, setSelectedGame] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<ReportStatus | ''>('')
    const [selectedSeverity, setSelectedSeverity] = useState<ReportSeverity | ''>('')

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const reportsPerPage = 12

    // Fetch reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true)
                const params = new URLSearchParams()

                if (searchQuery) params.append('search', searchQuery)
                if (selectedGame) params.append('game', selectedGame)
                if (selectedStatus) params.append('status', selectedStatus)
                if (selectedSeverity) params.append('severity', selectedSeverity)

                const response = await fetch(`/api/reports?${params.toString()}`)
                const data = await response.json()

                if (data.success) {
                    setReports(data.data || [])
                    setError(null)
                } else {
                    setError(data.error || 'Failed to fetch reports')
                }
            } catch (err) {
                setError('Failed to fetch reports')
                console.error('Error fetching reports:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [searchQuery, selectedGame, selectedStatus, selectedSeverity])

    // Get unique games from reports
    const uniqueGames = Array.from(new Set(reports.map(r => r.game))).sort()

    // Pagination logic
    const indexOfLastReport = currentPage * reportsPerPage
    const indexOfFirstReport = indexOfLastReport - reportsPerPage
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport)
    const totalPages = Math.ceil(reports.length / reportsPerPage)

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedGame, selectedStatus, selectedSeverity])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                        Intel Board
                    </h1>
                    <p className="text-text-secondary">
                        Browse verified reports of griefers across different games
                    </p>
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
                                onChange={(e) => setSelectedStatus(e.target.value as ReportStatus | '')}
                                className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                            >
                                <option value="">All Statuses</option>
                                <option value="Verified">Verified</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Severity Filter */}
                        <div>
                            <select
                                value={selectedSeverity}
                                onChange={(e) => setSelectedSeverity(e.target.value as ReportSeverity | '')}
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

                    {/* Active Filters Display */}
                    {(searchQuery || selectedGame || selectedStatus || selectedSeverity) && (
                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-text-tertiary">Active filters:</span>
                            {searchQuery && (
                                <span className="px-3 py-1 rounded-full text-xs bg-accent-primary/20 text-accent-primary border border-accent-primary">
                                    Search: "{searchQuery}"
                                </span>
                            )}
                            {selectedGame && (
                                <span className="px-3 py-1 rounded-full text-xs bg-accent-primary/20 text-accent-primary border border-accent-primary">
                                    Game: {selectedGame}
                                </span>
                            )}
                            {selectedStatus && (
                                <span className="px-3 py-1 rounded-full text-xs bg-accent-primary/20 text-accent-primary border border-accent-primary">
                                    Status: {selectedStatus}
                                </span>
                            )}
                            {selectedSeverity && (
                                <span className="px-3 py-1 rounded-full text-xs bg-accent-primary/20 text-accent-primary border border-accent-primary">
                                    Severity: {selectedSeverity}
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedGame('')
                                    setSelectedStatus('')
                                    setSelectedSeverity('')
                                }}
                                className="text-xs text-text-tertiary hover:text-accent-primary transition-colors"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Reports Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="glass rounded-lg p-8 text-center">
                        <p className="text-red-500 mb-2">Error loading reports</p>
                        <p className="text-text-tertiary text-sm">{error}</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="glass rounded-lg p-8 text-center">
                        <p className="text-text-secondary mb-2">No reports found</p>
                        <p className="text-text-tertiary text-sm">
                            {searchQuery || selectedGame || selectedStatus || selectedSeverity
                                ? 'Try adjusting your filters'
                                : 'Be the first to submit a report!'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Results count */}
                        <div className="mb-4 text-sm text-text-tertiary">
                            Showing {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, reports.length)} of {reports.length} reports
                        </div>

                        {/* Reports grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentReports.map((report) => (
                                <ReportCard key={report.id} report={report} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-primary transition-colors"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        // Show first page, last page, current page, and pages around current
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-4 py-2 rounded-lg border transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-accent-primary border-accent-primary text-white'
                                                            : 'bg-bg-tertiary border-gray-700 text-text-primary hover:border-accent-primary'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <span key={page} className="px-2 text-text-tertiary">...</span>
                                        }
                                        return null
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-primary transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}
