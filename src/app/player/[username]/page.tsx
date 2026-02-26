'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useParams } from 'next/navigation'
import type { UserProfile } from '@/types/user'

interface ProfileData extends Omit<UserProfile, 'email' | 'createdAt'> {
    createdAt: string
}

function getRoleBadge(role: string) {
    switch (role) {
        case 'admin':
            return { label: 'ADMIN', className: 'bg-red-500/20 text-red-400 border-red-500/50' }
        case 'moderator':
            return { label: 'MOD', className: 'bg-blue-500/20 text-blue-400 border-blue-500/50' }
        default:
            return { label: 'MEMBER', className: 'bg-gray-500/20 text-gray-400 border-gray-500/50' }
    }
}

function getThreatLevel(reputationScore: number) {
    if (reputationScore >= 50) return { label: 'Trusted', className: 'bg-green-500/10 text-green-500 border-green-500/50' }
    if (reputationScore >= 20) return { label: 'Established', className: 'bg-blue-500/10 text-blue-500 border-blue-500/50' }
    if (reputationScore >= 1) return { label: 'New', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50' }
    return { label: 'Unknown', className: 'bg-gray-800 text-gray-400 border-gray-700' }
}

function formatJoinDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function PlayerProfilePage() {
    const params = useParams()
    const username = Array.isArray(params?.username)
        ? decodeURIComponent(params.username[0])
        : decodeURIComponent(params?.username || '')

    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!username) return

        async function fetchProfile() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`/api/users/${encodeURIComponent(username)}`)
                const json = await res.json()

                if (!res.ok || !json.success) {
                    setError(json.error || 'User not found')
                    return
                }

                setProfile(json.data)
            } catch {
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [username])

    // Loading state
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
                                <div className="h-12 w-40 bg-bg-elevated rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-20 w-24 bg-bg-elevated rounded-xl" />
                                <div className="h-20 w-24 bg-bg-elevated rounded-xl" />
                                <div className="h-20 w-24 bg-bg-elevated rounded-xl" />
                                <div className="h-20 w-24 bg-bg-elevated rounded-xl" />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // Error / not found state
    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
                <Header />
                <main className="flex-1 container py-12">
                    <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-border-primary">
                        <div className="text-6xl mb-4 opacity-20">?</div>
                        <h3 className="text-xl font-bold text-text-secondary mb-2">
                            {error === 'User not found' ? 'Player Not Found' : 'Error Loading Profile'}
                        </h3>
                        <p className="text-text-tertiary max-w-md mx-auto">
                            {error === 'User not found'
                                ? `No player with the username "${username}" exists in our database.`
                                : 'Something went wrong loading this profile. Please try again later.'}
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const roleBadge = getRoleBadge(profile.role)
    const threat = getThreatLevel(profile.reputationScore)
    const verificationRate = profile.totalReports > 0
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
                            PLAYER DOSSIER
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Avatar / Identity */}
                        <div className="flex-shrink-0 text-center">
                            <div className="w-32 h-32 rounded-full bg-bg-elevated border-2 border-accent-primary/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,68,68,0.2)]">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={profile.username}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-accent-primary">
                                        {profile.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-2">
                                <h1 className="text-4xl font-bold tracking-tight">{profile.username}</h1>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${roleBadge.className}`}>
                                    {roleBadge.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                                <div className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm border border-border-primary">
                                    <span className="text-text-secondary">Joined:</span>{' '}
                                    <span className="text-white font-medium">{formatJoinDate(profile.createdAt)}</span>
                                </div>
                            </div>

                            {/* Reputation Level */}
                            <div className="inline-block">
                                <div className="text-sm text-text-secondary mb-1">Reputation</div>
                                <div className={`text-2xl font-bold px-4 py-2 rounded-lg border ${threat.className}`}>
                                    {threat.label} ({profile.reputationScore} pts)
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
                                <div className="text-3xl font-bold text-green-500 mb-1">{profile.verifiedReports}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Verified</div>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary">
                                <div className="text-3xl font-bold text-blue-400 mb-1">{profile.totalComments}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Comments</div>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary">
                                <div className="text-3xl font-bold text-accent-primary mb-1">{verificationRate}%</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Veracity</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
