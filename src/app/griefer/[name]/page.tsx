'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatusBadge } from '@/components/reports/StatusBadge'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { ReportStatus, ReportSeverity } from '@/types/report'

interface GrieferReport {
    id: string
    grieferName: string
    game: string
    description: string
    status: ReportStatus
    severity: ReportSeverity
    createdAt: string
    reporterId: string
}

interface GrieferStats {
    totalReports: number
    severityBreakdown: Record<string, number>
    gameBreakdown: Record<string, number>
    statusBreakdown: Record<string, number>
    firstReported: string | null
    lastReported: string | null
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
}

interface GrieferData {
    grieferName: string
    stats: GrieferStats
    reports: GrieferReport[]
}

const riskColors: Record<string, string> = {
    Critical: 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    High: 'bg-orange-500/10 text-orange-500 border-orange-500/50',
    Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50',
    Low: 'bg-gray-800 text-gray-400 border-gray-700',
}

const severityColors: Record<string, string> = {
    Critical: 'bg-red-500/20 text-red-500',
    High: 'bg-orange-500/20 text-orange-500',
    Medium: 'bg-yellow-500/20 text-yellow-500',
    Low: 'bg-gray-700 text-gray-300',
}

function timeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    return `${months}mo ago`
}

export default function GrieferProfilePage() {
    const params = useParams()
    const name = Array.isArray(params?.name)
        ? decodeURIComponent(params.name[0])
        : decodeURIComponent(params?.name || '')

    const [data, setData] = useState<GrieferData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!name) return

        async function fetchGriefer() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`/api/griefers/${encodeURIComponent(name)}`)
                const json = await res.json()

                if (!res.ok || !json.success) {
                    setError(json.error || 'Not found')
                    return
                }

                setData(json.data)
            } catch {
                setError('Failed to load griefer profile')
            } finally {
                setLoading(false)
            }
        }

        fetchGriefer()
    }, [name])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 container py-12">
                    <div className="glass rounded-2xl p-8 mb-8 border border-border-primary animate-pulse">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="w-32 h-32 rounded-full bg-bg-elevated" />
                            <div className="flex-1 space-y-4">
                                <div className="h-10 w-48 bg-bg-elevated rounded" />
                                <div className="h-6 w-64 bg-bg-elevated rounded" />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 container py-12">
                    <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-border-primary">
                        <div className="text-6xl mb-4 opacity-20">?</div>
                        <h3 className="text-xl font-bold text-text-secondary mb-2">No Reports Found</h3>
                        <p className="text-text-tertiary max-w-md mx-auto">
                            No reports exist for &quot;{name}&quot; in our database.
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const { stats, reports, grieferName } = data
    const verifiedCount = stats.statusBreakdown['Verified'] || 0

    return (
        <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
            <Header />

            <main className="flex-1 container py-12">
                {/* Dossier Header */}
                <div className="glass rounded-2xl p-8 mb-8 border border-red-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="text-xs font-mono text-red-500 border border-red-500 px-2 py-1 rounded">
                            THREAT DOSSIER
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0 text-center">
                            <div className="w-32 h-32 rounded-full bg-bg-elevated border-2 border-red-500/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,68,68,0.3)]">
                                <span className="text-4xl font-bold text-red-500">
                                    {grieferName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tight mb-2">{grieferName}</h1>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                                {stats.firstReported && (
                                    <div className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm border border-border-primary">
                                        <span className="text-text-secondary">First Seen:</span>{' '}
                                        <span className="text-white font-medium">
                                            {new Date(stats.firstReported).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                                {Object.keys(stats.gameBreakdown).map(game => (
                                    <div key={game} className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm border border-border-primary">
                                        <span className="text-text-secondary">Game:</span>{' '}
                                        <span className="text-white font-medium">{game}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Risk Level */}
                            <div className="inline-block">
                                <div className="text-sm text-text-secondary mb-1">Threat Assessment</div>
                                <div className={`text-2xl font-bold px-4 py-2 rounded-lg border ${riskColors[stats.riskLevel]}`}>
                                    {stats.riskLevel} Risk
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary">
                                <div className="text-3xl font-bold text-white mb-1">{stats.totalReports}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Reports</div>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary">
                                <div className="text-3xl font-bold text-green-500 mb-1">{verifiedCount}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Verified</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Severity Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="glass rounded-2xl p-6 border border-border-primary">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Severity Breakdown</h3>
                        <div className="space-y-3">
                            {(['Critical', 'High', 'Medium', 'Low'] as const).map(severity => {
                                const count = stats.severityBreakdown[severity] || 0
                                const pct = stats.totalReports > 0 ? (count / stats.totalReports) * 100 : 0
                                return (
                                    <div key={severity} className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold w-16 text-center ${severityColors[severity]}`}>
                                            {severity}
                                        </span>
                                        <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${
                                                    severity === 'Critical' ? 'bg-red-500' :
                                                    severity === 'High' ? 'bg-orange-500' :
                                                    severity === 'Medium' ? 'bg-yellow-500' : 'bg-gray-500'
                                                }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-text-secondary w-8 text-right">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6 border border-border-primary">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Status Breakdown</h3>
                        <div className="space-y-3">
                            {(['Verified', 'Under Review', 'Resolved', 'Rejected'] as const).map(status => {
                                const count = stats.statusBreakdown[status] || 0
                                return (
                                    <div key={status} className="flex items-center justify-between">
                                        <StatusBadge status={status} />
                                        <span className="text-sm text-text-secondary">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Report History */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-red-500 rounded-full"></span>
                    Report History ({reports.length})
                </h2>

                <div className="space-y-4">
                    {reports.map((report) => (
                        <Link
                            key={report.id}
                            href={`/report/${report.id}`}
                            className="block glass-hover rounded-xl p-6 border border-border-primary hover:border-red-500/30 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-3">
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={report.status} />
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        report.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        report.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                        report.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        'bg-gray-700 text-gray-300 border-gray-600'
                                    }`}>
                                        {report.severity.toUpperCase()}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-bg-tertiary border border-border-primary text-text-secondary">
                                        {report.game}
                                    </span>
                                    <span className="text-text-tertiary text-sm">{timeAgo(report.createdAt)}</span>
                                </div>
                            </div>
                            <p className="text-text-primary text-sm leading-relaxed line-clamp-2">
                                {report.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}
