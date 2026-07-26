'use client'

import React, { useEffect, useState } from 'react'
import type { Report } from '@/types/report'

interface Stats {
    total: number
    verified: number
    games: number
}

export const LiveStats: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const fetchStats = async () => {
            try {
                const [allResponse, verifiedResponse] = await Promise.all([
                    fetch('/api/reports?limit=100'),
                    fetch('/api/reports?status=Verified&limit=1'),
                ])
                const [allData, verifiedData] = await Promise.all([
                    allResponse.json(),
                    verifiedResponse.json(),
                ])

                if (cancelled) return

                if (allData.success && verifiedData.success) {
                    const reports: Report[] = allData.data || []
                    setStats({
                        total: allData.pagination?.total ?? reports.length,
                        verified: verifiedData.pagination?.total ?? 0,
                        games: new Set(reports.map((report) => report.game)).size,
                    })
                }
            } catch (err) {
                console.error('Error fetching live stats:', err)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchStats()
        return () => {
            cancelled = true
        }
    }, [])

    const items = [
        { label: 'reports', value: stats?.total, color: 'text-text-primary' },
        { label: 'verified', value: stats?.verified, color: 'text-status-verified' },
        { label: 'games covered', value: stats?.games, color: 'text-text-primary' },
    ]

    return (
        <div className="flex justify-center gap-9 text-sm text-text-tertiary">
            {items.map((item) => (
                <span key={item.label}>
                    {loading ? (
                        <span className="block h-7 w-14 mx-auto mb-1 rounded-md bg-bg-elevated animate-pulse" />
                    ) : (
                        <b className={`block text-2xl font-extrabold tracking-tight ${item.color}`}>
                            {item.value !== undefined ? item.value.toLocaleString('en-US') : '—'}
                        </b>
                    )}
                    {item.label}
                </span>
            ))}
        </div>
    )
}
