'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatusBadge } from '@/components/reports/StatusBadge'
import { CommentsSection } from '@/components/reports/CommentsSection'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Report } from '@/types/report'

export default function ReportDetailPage() {
    const params = useParams()
    const reportId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'UNKNOWN'

    const [report, setReport] = useState<Report | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!reportId || reportId === 'UNKNOWN') return

        const fetchReport = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/reports/${reportId}`)
                const json = await res.json()

                if (json.success) {
                    setReport(json.data)
                } else {
                    setError(json.error || 'Failed to load report')
                }
            } catch (err) {
                setError('Failed to load report')
            } finally {
                setLoading(false)
            }
        }

        fetchReport()
    }, [reportId])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 container py-12">
                    <div className="max-w-4xl mx-auto animate-pulse">
                        <div className="h-10 w-64 bg-bg-elevated rounded mb-4" />
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 h-96 bg-bg-elevated rounded-xl" />
                            <div className="h-64 bg-bg-elevated rounded-xl" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 container py-12">
                    <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-border-primary">
                        <h3 className="text-xl font-bold text-text-secondary mb-2">Report Not Found</h3>
                        <p className="text-text-tertiary">
                            {error || 'The report you are looking for does not exist.'}
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
            <Header />

            <main className="flex-1 container py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header Report Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight">Report #{report.id}</h1>
                                <StatusBadge status={report.status as any} />
                            </div>
                            <div className="text-text-secondary flex gap-2 text-sm">
                                <span>Reported by <span className="text-accent-primary font-bold">User_{report.reporterId.slice(-6)}</span></span>
                                <span>•</span>
                                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-lg border text-sm font-bold ${report.severity === 'High' || report.severity === 'Critical' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : 'bg-gray-800 border-gray-700'
                                }`}>
                                {report.severity.toUpperCase()} SEVERITY
                            </span>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column: Details & Evidence */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="glass rounded-xl p-8 border border-border-primary">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-accent-primary rounded-full"></span>
                                    Incident Report
                                </h3>
                                <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                                    {report.description}
                                </p>

                                {report.tags && report.tags.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {report.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-bg-tertiary rounded text-xs text-text-tertiary border border-border-secondary">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Evidence */}
                            <div className="glass rounded-xl p-8 border border-border-primary">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-accent-primary rounded-full"></span>
                                    Evidence
                                </h3>
                                {report.evidenceUrl ? (
                                    <div className="rounded-lg overflow-hidden border border-border-secondary relative aspect-video">
                                        <Image
                                            src={report.evidenceUrl}
                                            alt="Evidence"
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center border border-border-secondary border-dashed">
                                        <span className="text-text-tertiary text-sm">No visual evidence provided</span>
                                    </div>
                                )}
                            </div>

                            {/* Comments Section */}
                            <CommentsSection reportId={reportId} />
                        </div>

                        {/* Right Column: Suspect Info */}
                        <div className="space-y-6">
                            <div className="glass rounded-xl p-6 border border-border-primary">
                                <h3 className="text-sm font-bold text-text-tertiary uppercase mb-4">Suspect Profile</h3>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-2xl">
                                        {report.grieferName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{report.grieferName}</div>
                                        <div className="text-xs text-text-tertiary">Game: {report.game}</div>
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-border-secondary">
                                        <span className="text-text-secondary">Game</span>
                                        <span className="text-white font-medium">{report.game}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border-secondary">
                                        <span className="text-text-secondary">Server</span>
                                        <span className="text-white font-medium">{report.server || 'Unknown'}</span>
                                    </div>
                                </div>

                                <Link href={`/griefer/${encodeURIComponent(report.grieferName)}`}>
                                    <button className="w-full mt-6 py-2 bg-bg-tertiary hover:bg-bg-secondary text-text-primary rounded-lg text-sm font-medium transition-colors border border-border-secondary">
                                        View Full Dossier
                                    </button>
                                </Link>
                            </div>

                            <div className="glass rounded-xl p-6 border border-border-primary bg-accent-primary/5">
                                <h3 className="text-sm font-bold text-accent-primary uppercase mb-2">Warning</h3>
                                <p className="text-xs text-text-secondary">
                                    Verify all reports before taking action. False reporting is a bannable offense.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
