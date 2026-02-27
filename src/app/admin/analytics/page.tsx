'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

interface AnalyticsData {
    overview: {
        totalReports: number
        reportsByStatus: Record<string, number>
        reportsBySeverity: Record<string, number>
        reportsByGame: Record<string, number>
        totalUsers: number
        totalComments: number
    }
    topReporters: Array<{
        userId: string
        username: string
        verifiedReports: number
        totalReports: number
    }>
    recentActivity: Array<{
        type: 'report' | 'comment'
        id: string
        summary: string
        createdAt: string
    }>
}

const severityColors: Record<string, string> = {
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-gray-500',
}

const statusColors: Record<string, string> = {
    Verified: 'text-green-500',
    'Under Review': 'text-yellow-500',
    Resolved: 'text-blue-500',
    Rejected: 'text-red-500',
}

function timeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

export default function AdminAnalyticsPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const isAdmin = session?.user?.role === 'admin'

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/admin/analytics')
        } else if (status === 'authenticated' && !isAdmin) {
            router.push('/')
        }
    }, [status, isAdmin, router])

    useEffect(() => {
        if (status !== 'authenticated' || !isAdmin) return

        async function fetchAnalytics() {
            setLoading(true)
            try {
                const res = await fetch('/api/admin/analytics')
                const json = await res.json()

                if (!res.ok || !json.success) {
                    setError(json.error || 'Failed to load analytics')
                    return
                }

                setData(json.data)
            } catch {
                setError('Failed to load analytics')
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [status, isAdmin])

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 container py-12">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-48 bg-bg-elevated rounded" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-bg-elevated rounded-xl" />
                            ))}
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
                        <h3 className="text-xl font-bold text-text-secondary mb-2">Error</h3>
                        <p className="text-text-tertiary">{error || 'Something went wrong'}</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const { overview, topReporters, recentActivity } = data
    const verificationRate = overview.totalReports > 0
        ? Math.round(((overview.reportsByStatus['Verified'] || 0) / overview.totalReports) * 100)
        : 0

    return (
        <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
            <Header />

            <main className="flex-1 container py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <Link href="/admin" className="text-sm text-accent-primary hover:underline">
                        Back to Admin
                    </Link>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-xl p-6 border border-border-primary">
                        <div className="text-3xl font-bold text-white mb-1">{overview.totalReports}</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wider">Total Reports</div>
                    </div>
                    <div className="glass rounded-xl p-6 border border-border-primary">
                        <div className="text-3xl font-bold text-blue-400 mb-1">{overview.totalUsers}</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wider">Total Users</div>
                    </div>
                    <div className="glass rounded-xl p-6 border border-border-primary">
                        <div className="text-3xl font-bold text-purple-400 mb-1">{overview.totalComments}</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wider">Total Comments</div>
                    </div>
                    <div className="glass rounded-xl p-6 border border-border-primary">
                        <div className="text-3xl font-bold text-green-400 mb-1">{verificationRate}%</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wider">Verification Rate</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Reports by Game */}
                    <div className="glass rounded-2xl p-6 border border-border-primary">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Reports by Game</h3>
                        <div className="space-y-3">
                            {Object.entries(overview.reportsByGame)
                                .sort(([, a], [, b]) => b - a)
                                .map(([game, count]) => {
                                    const pct = (count / overview.totalReports) * 100
                                    return (
                                        <div key={game} className="flex items-center gap-3">
                                            <span className="text-sm text-text-primary w-32 truncate">{game}</span>
                                            <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                                <div className="h-full rounded-full bg-accent-primary" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-sm text-text-secondary w-8 text-right">{count}</span>
                                        </div>
                                    )
                                })}
                            {Object.keys(overview.reportsByGame).length === 0 && (
                                <p className="text-sm text-text-tertiary">No data yet</p>
                            )}
                        </div>
                    </div>

                    {/* Reports by Severity */}
                    <div className="glass rounded-2xl p-6 border border-border-primary">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Reports by Severity</h3>
                        <div className="space-y-3">
                            {(['Critical', 'High', 'Medium', 'Low']).map(severity => {
                                const count = overview.reportsBySeverity[severity] || 0
                                const pct = overview.totalReports > 0 ? (count / overview.totalReports) * 100 : 0
                                return (
                                    <div key={severity} className="flex items-center gap-3">
                                        <span className="text-sm text-text-primary w-20">{severity}</span>
                                        <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${severityColors[severity]}`} style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-sm text-text-secondary w-8 text-right">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Reports by Status */}
                    <div className="glass rounded-2xl p-6 border border-border-primary">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Reports by Status</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {(['Verified', 'Under Review', 'Resolved', 'Rejected']).map(status => {
                                const count = overview.reportsByStatus[status] || 0
                                return (
                                    <div key={status} className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary text-center">
                                        <div className={`text-2xl font-bold mb-1 ${statusColors[status]}`}>{count}</div>
                                        <div className="text-xs text-text-secondary">{status}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Top Reporters */}
                    <div className="glass rounded-2xl p-6 border border-border-primary">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Top Reporters</h3>
                        {topReporters.length > 0 ? (
                            <div className="space-y-2">
                                {topReporters.map((reporter, i) => (
                                    <div key={reporter.userId} className="flex items-center gap-3 py-2">
                                        <span className="w-6 text-center text-sm font-bold text-text-tertiary">{i + 1}</span>
                                        <Link
                                            href={`/player/${encodeURIComponent(reporter.username)}`}
                                            className="flex-1 text-sm text-text-primary hover:text-accent-primary transition-colors"
                                        >
                                            {reporter.username}
                                        </Link>
                                        <span className="text-sm text-green-500 font-medium">{reporter.verifiedReports} verified</span>
                                        <span className="text-xs text-text-tertiary">/ {reporter.totalReports} total</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-text-tertiary">No reporters yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass rounded-2xl p-6 border border-border-primary">
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Recent Activity</h3>
                    {recentActivity.length > 0 ? (
                        <div className="space-y-3">
                            {recentActivity.map((item, i) => (
                                <div key={`${item.type}-${item.id}-${i}`} className="flex items-start gap-3 py-2 border-b border-border-secondary last:border-b-0">
                                    <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        item.type === 'report'
                                            ? 'bg-accent-primary/20 text-accent-primary'
                                            : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {item.type}
                                    </span>
                                    <p className="flex-1 text-sm text-text-primary">{item.summary}</p>
                                    <span className="text-xs text-text-tertiary whitespace-nowrap">{timeAgo(item.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-text-tertiary">No activity yet</p>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
