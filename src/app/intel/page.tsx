'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReportCard } from '@/components/reports/ReportCard'
import { SkeletonGrid } from '@/components/common/SkeletonCard'
import { NoReportsFound, NoReportsYet, ErrorState } from '@/components/common/EmptyState'
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
                <div className="glass-hover rounded-xl p-6 mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                            <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter Reports
                        </h2>
                        {(searchQuery || selectedGame || selectedStatus || selectedSeverity) && (
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedGame('')
                                    setSelectedStatus('')
                                    setSelectedSeverity('')
                                }}
                                className="text-sm text-accent-primary hover:text-accent-primary-hover transition-colors flex items-center gap-1 group"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear all filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <Input
                                    type="text"
                                    placeholder="Search by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10"
                                />
                            </div>
                        </div>

                        {/* Game Filter */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Game
                            </label>
                            <select
                                value={selectedGame}
                                onChange={(e) => setSelectedGame(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all hover:border-border-accent"
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
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as ReportStatus | '')}
                                className="w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all hover:border-border-accent"
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
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Severity
                            </label>
                            <select
                                value={selectedSeverity}
                                onChange={(e) => setSelectedSeverity(e.target.value as ReportSeverity | '')}
                                className="w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all hover:border-border-accent"
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
                        <div className="mt-6 pt-6 border-t border-border-secondary">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-text-tertiary">Active filters:</span>
                                {searchQuery && (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-accent-primary/10 text-accent-primary border border-accent-primary/30 flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        &ldquo;{searchQuery}&rdquo;
                                    </span>
                                )}
                                {selectedGame && (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-status-verified/10 text-status-verified border border-status-verified/30">
                                        {selectedGame}
                                    </span>
                                )}
                                {selectedStatus && (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-status-review/10 text-status-review border border-status-review/30">
                                        {selectedStatus}
                                    </span>
                                )}
                                {selectedSeverity && (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-severity-high/10 text-severity-high border border-severity-high/30">
                                        {selectedSeverity}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Reports Grid */}
                {loading ? (
                    <SkeletonGrid count={12} />
                ) : error ? (
                    <ErrorState
                        message={error}
                        onRetry={() => window.location.reload()}
                    />
                ) : reports.length === 0 ? (
                    searchQuery || selectedGame || selectedStatus || selectedSeverity ? (
                        <NoReportsFound
                            onClear={() => {
                                setSearchQuery('')
                                setSelectedGame('')
                                setSelectedStatus('')
                                setSelectedSeverity('')
                            }}
                        />
                    ) : (
                        <NoReportsYet />
                    )
                ) : (
                    <>
                        {/* Results count and view options */}
                        <div className="flex items-center justify-between mb-6 animate-fade-in">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-medium text-text-secondary">
                                    Showing <span className="text-text-primary font-semibold">{indexOfFirstReport + 1}-{Math.min(indexOfLastReport, reports.length)}</span> of <span className="text-text-primary font-semibold">{reports.length}</span> reports
                                </span>
                            </div>
                        </div>

                        {/* Reports grid with stagger animation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentReports.map((report, index) => (
                                <div
                                    key={report.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <ReportCard report={report} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="group px-5 py-2.5 rounded-lg glass-hover border border-border-primary text-text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>

                                <div className="flex gap-2">
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
                                                    className={`min-w-[44px] px-4 py-2.5 rounded-lg border font-medium transition-all ${
                                                        currentPage === page
                                                            ? 'bg-accent-primary border-accent-primary text-white shadow-glow'
                                                            : 'glass-hover border-border-primary text-text-primary'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <span key={page} className="px-2 py-2 text-text-tertiary">...</span>
                                        }
                                        return null
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="group px-5 py-2.5 rounded-lg glass-hover border border-border-primary text-text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none transition-all flex items-center gap-2"
                                >
                                    Next
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
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
