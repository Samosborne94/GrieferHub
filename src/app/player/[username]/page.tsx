'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/common/Badge'
import type { UserProfile } from '@/types/user'

type PublicProfile = Omit<UserProfile, 'email'>

export default function PlayerProfilePage() {
    const params = useParams()
    const username = Array.isArray(params?.username)
        ? decodeURIComponent(params.username[0])
        : decodeURIComponent(params?.username || '')

    const [profile, setProfile] = useState<PublicProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true)
                const res = await fetch(`/api/users/${encodeURIComponent(username)}`)
                const data = await res.json()

                if (!res.ok || !data.success) {
                    if (res.status === 404) {
                        setNotFound(true)
                    } else {
                        setError(data.error || 'Failed to load profile')
                    }
                    return
                }

                setProfile(data.data)
            } catch {
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        if (username) {
            fetchProfile()
        }
    }, [username])

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </main>
                <Footer />
            </div>
        )
    }

    // 404 state
    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 container py-12">
                    <EmptyState
                        variant="search"
                        title="Player Not Found"
                        description={`No player found with the username "${username}". Check the spelling and try again.`}
                        action={{ label: 'Browse Reports', href: '/reports' }}
                    />
                </main>
                <Footer />
            </div>
        )
    }

    // Error state
    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 container py-12">
                    <EmptyState
                        variant="error"
                        title="Something Went Wrong"
                        description={error || 'Failed to load profile data.'}
                    />
                </main>
                <Footer />
            </div>
        )
    }

    // Format creation date
    const createdAt = new Date(profile.createdAt)
    const formattedDate = createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    // Role badge variant mapping
    const roleBadgeVariant = {
        admin: 'error' as const,
        moderator: 'warning' as const,
        user: 'default' as const,
    }

    // Reputation display
    const getReputationLabel = (score: number) => {
        if (score >= 50) return 'Critical Risk'
        if (score >= 20) return 'High Risk'
        if (score >= 10) return 'Moderate Risk'
        if (score > 0) return 'Low Risk'
        return 'Unknown'
    }

    const getReputationStyle = (score: number) => {
        if (score >= 50) return 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        if (score >= 20) return 'bg-orange-500/10 text-orange-500 border-orange-500/50'
        if (score >= 10) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50'
        if (score > 0) return 'bg-blue-500/10 text-blue-500 border-blue-500/50'
        return 'bg-gray-800 text-gray-400 border-gray-700'
    }

    const veracity = profile.totalReports > 0
        ? Math.round((profile.verifiedReports / profile.totalReports) * 100)
        : 0

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
                                    {profile.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="text-xs text-text-tertiary font-mono">ID: {profile.id.slice(0, 9).toUpperCase()}</div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                <h1 className="text-4xl font-bold tracking-tight">{profile.username}</h1>
                                <Badge variant={roleBadgeVariant[profile.role]} size="sm">
                                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                                <div className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm border border-border-primary">
                                    <span className="text-text-secondary">Member Since:</span> <span className="text-white font-medium">{formattedDate}</span>
                                </div>
                                {profile.location && (
                                    <div className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm border border-border-primary">
                                        <span className="text-text-secondary">Location:</span> <span className="text-white font-medium">{profile.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <p className="text-text-secondary text-sm mb-6 max-w-lg">{profile.bio}</p>
                            )}

                            {/* Threat Level */}
                            <div className="inline-block">
                                <div className="text-sm text-text-secondary mb-1">Threat Assessment</div>
                                <div className={`text-2xl font-bold px-4 py-2 rounded-lg border ${getReputationStyle(profile.reputationScore)}`}>
                                    {getReputationLabel(profile.reputationScore)}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary">
                                <div className="text-3xl font-bold text-white mb-1">{profile.totalReports}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Reports</div>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary">
                                <div className="text-3xl font-bold text-accent-primary mb-1">{veracity}%</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Veracity</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section - Placeholder for US-002 */}
                <div className="mb-8">
                    {/* Stats will be added in US-002 */}
                </div>

                {/* Recent Activity - Placeholder for US-003 */}
                <div>
                    {/* Activity feed will be added in US-003 */}
                </div>
            </main>

            <Footer />
        </div>
    )
}
