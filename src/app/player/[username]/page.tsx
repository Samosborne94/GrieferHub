'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useParams } from 'next/navigation'
import { StatusBadge } from '@/components/reports/StatusBadge'

// Type definition for a mock report
interface MockReport {
    id: string
    date: string
    game: string
    severity: 'Low' | 'Medium' | 'High' | 'Critical'
    status: 'Verified' | 'Under Review' | 'Resolved' | 'Rejected'
    description: string
    reporter: string
}

export default function PlayerProfilePage() {
    const params = useParams()
    // Handle potential array or string for username
    const username = Array.isArray(params?.username)
        ? decodeURIComponent(params.username[0])
        : decodeURIComponent(params?.username || '')

    // Mock data for specific scenarios or generic filler
    const isFakeFriendly = username.toLowerCase().includes('trustme')

    // Stats
    const totalReports = isFakeFriendly ? 12 : 0
    const reputationScore = isFakeFriendly ? 'Critical Risk' : 'Unknown'

    // Mock Reports List
    const reports: MockReport[] = isFakeFriendly ? [
        {
            id: 'RPT-8291',
            date: '2 hours ago',
            game: 'Arc Raiders',
            severity: 'Critical',
            status: 'Verified',
            description: 'Approached as a friendly solo player near the extraction point. Waited until I was loading my loot, then shot me in the back. Stole full kit.',
            reporter: 'Survivor_01'
        },
        {
            id: 'RPT-8105',
            date: '1 day ago',
            game: 'Arc Raiders',
            severity: 'High',
            status: 'Verified',
            description: 'Uses voice chat to bait players into "teaming up". Do not trust.',
            reporter: 'Extraction_Team_Alpha'
        }
    ] : []

    return (
        <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
            <Header />

            <main className="flex-1 container py-12">
                {/* Dossier Header */}
                <div className="glass rounded-2xl p-8 mb-8 border border-accent-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="text-xs font-mono text-accent-primary border border-accent-primary px-2 py-1 rounded">
                            CLASSIFIED DOSSIER
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Avatar / Identity */}
                        <div className="flex-shrink-0 text-center">
                            <div className="w-32 h-32 rounded-full bg-bg-elevated border-2 border-accent-primary/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,68,68,0.2)]">
                                <span className="text-4xl font-bold text-accent-primary">
                                    {username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="text-xs text-text-tertiary font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold mb-2 tracking-tight">{username}</h1>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                                <div className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm border border-border-primary">
                                    <span className="text-text-secondary">Game:</span> <span className="text-white font-medium">Arc Raiders</span>
                                </div>
                                <div className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm border border-border-primary">
                                    <span className="text-text-secondary">First Seen:</span> <span className="text-white font-medium">Oct 2025</span>
                                </div>
                            </div>

                            {/* Threat Level */}
                            <div className="inline-block">
                                <div className="text-sm text-text-secondary mb-1">Thireat Assessment</div>
                                <div className={`text-2xl font-bold px-4 py-2 rounded-lg border ${isFakeFriendly
                                        ? 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                        : 'bg-gray-800 text-gray-400 border-gray-700'
                                    }`}>
                                    {reputationScore}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary">
                                <div className="text-3xl font-bold text-white mb-1">{totalReports}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Reports</div>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary">
                                <div className="text-3xl font-bold text-accent-primary mb-1">{isFakeFriendly ? '100%' : '0%'}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Veracity</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report History */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-accent-primary rounded-full"></span>
                    Recent Intelligence
                </h2>

                <div className="space-y-4">
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report.id} className="glass-hover rounded-xl p-6 border border-border-primary hover:border-accent-primary/30 transition-all group">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={report.status} />
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${report.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                report.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                    'bg-gray-700 text-gray-300'
                                            }`}>
                                            {report.severity.toUpperCase()}
                                        </span>
                                        <span className="text-text-tertiary text-sm">• {report.date}</span>
                                    </div>
                                    <div className="text-sm font-mono text-text-tertiary">
                                        REF: {report.id}
                                    </div>
                                </div>
                                <p className="text-text-primary mb-4 leading-relaxed bg-bg-tertiary/30 p-4 rounded-lg">
                                    "{report.description}"
                                </p>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-text-secondary">
                                        Reported by <span className="text-accent-primary/80 font-medium">{report.reporter}</span>
                                    </div>
                                    <div className="group-hover:translate-x-1 transition-transform text-accent-primary font-medium cursor-pointer">
                                        View Evidence →
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-border-primary">
                            <div className="text-6xl mb-4 opacity-20">🛡️</div>
                            <h3 className="text-xl font-bold text-text-secondary mb-2">No Reports Found</h3>
                            <p className="text-text-tertiary max-w-md mx-auto">
                                This player has a clean record... for now. Stay vigilant.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
