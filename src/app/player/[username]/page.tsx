'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/reports/StatusBadge'
import type { UserProfile } from '@/types/user'
import type { Report } from '@/types/report'
import Link from 'next/link'

type PublicProfile = Omit<UserProfile, 'email'>

function getRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    return 'just now'
}

function getAccountAge(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffYears > 0) {
        const remainingMonths = diffMonths - (diffYears * 12)
        return remainingMonths > 0
            ? `${diffYears}y ${remainingMonths}m`
            : `${diffYears} year${diffYears > 1 ? 's' : ''}`
    }
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`
}

export default function PlayerProfilePage() {
    const params = useParams()
    const { data: session } = useSession()
    const username = Array.isArray(params?.username)
        ? decodeURIComponent(params.username[0])
        : decodeURIComponent(params?.username || '')

    const [profile, setProfile] = useState<PublicProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reports, setReports] = useState<Report[]>([])
    const [reportsLoading, setReportsLoading] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const fetchProfile = useCallback(async () => {
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
    }, [username])

    useEffect(() => {
        if (username) {
            fetchProfile()
        }
    }, [username, fetchProfile])

    // Fetch user's reports once we have the profile
    useEffect(() => {
        async function fetchReports() {
            if (!profile?.id) return
            try {
                setReportsLoading(true)
                const res = await fetch(`/api/reports?reporterId=${encodeURIComponent(profile.id)}`)
                const data = await res.json()
                if (data.success) {
                    setReports(data.data || [])
                }
            } catch {
                // Non-critical, just leave empty
            } finally {
                setReportsLoading(false)
            }
        }
        fetchReports()
    }, [profile?.id])

    // Check if viewing own profile
    const isOwnProfile = session?.user?.name === username || session?.user?.email === username

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

    const pendingReports = Math.max(0, profile.totalReports - profile.verifiedReports)

    const displayReports = reports.slice(0, 10)
    const hasMoreReports = reports.length > 10

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

                    {/* Edit Profile Button - US-004 */}
                    {isOwnProfile && (
                        <div className="absolute top-4 right-40">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowEditModal(true)}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    )}

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

                        {/* Quick Stats */}
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

                {/* US-002: Detailed Stats Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-accent-primary font-mono text-sm">///</span>
                        Intelligence Summary
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="glass rounded-xl p-4 border border-border-primary text-center">
                            <div className="text-2xl font-bold text-white">{profile.totalReports}</div>
                            <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Total Reports</div>
                        </div>
                        <div className="glass rounded-xl p-4 border border-green-500/30 text-center">
                            <div className="text-2xl font-bold text-green-400">{profile.verifiedReports}</div>
                            <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Verified</div>
                        </div>
                        <div className="glass rounded-xl p-4 border border-yellow-500/30 text-center">
                            <div className="text-2xl font-bold text-yellow-400">{pendingReports}</div>
                            <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Pending</div>
                        </div>
                        <div className="glass rounded-xl p-4 border border-border-primary text-center">
                            <div className="text-2xl font-bold text-blue-400">{profile.totalComments}</div>
                            <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Comments</div>
                        </div>
                        <div className="glass rounded-xl p-4 border border-accent-primary/30 text-center">
                            <div className="text-2xl font-bold text-accent-primary">{profile.reputationScore}</div>
                            <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Rep Score</div>
                        </div>
                        <div className="glass rounded-xl p-4 border border-border-primary text-center">
                            <div className="text-2xl font-bold text-purple-400">{getAccountAge(createdAt)}</div>
                            <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Account Age</div>
                        </div>
                    </div>
                </div>

                {/* US-003: Recent Activity Feed */}
                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-accent-primary font-mono text-sm">///</span>
                        Recent Activity
                    </h2>
                    {reportsLoading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner size="md" />
                        </div>
                    ) : displayReports.length === 0 ? (
                        <div className="glass rounded-xl p-8 border border-border-primary text-center">
                            <p className="text-text-secondary">No reports yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayReports.map((report) => (
                                <Link
                                    key={report.id}
                                    href={`/report/${report.id}`}
                                    className="glass rounded-xl p-4 border border-border-primary hover:border-accent-primary/40 transition-colors flex items-center justify-between gap-4 block"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-medium text-white truncate">
                                                {report.grieferName}
                                            </span>
                                            <StatusBadge status={report.status} />
                                        </div>
                                        <p className="text-sm text-text-secondary truncate">
                                            {report.description}
                                        </p>
                                    </div>
                                    <div className="text-xs text-text-tertiary whitespace-nowrap">
                                        {getRelativeTime(new Date(report.createdAt))}
                                    </div>
                                </Link>
                            ))}
                            {hasMoreReports && (
                                <div className="text-center pt-2">
                                    <Link
                                        href={`/reports?reporter=${encodeURIComponent(username)}`}
                                        className="text-sm text-accent-primary hover:text-accent-secondary transition-colors"
                                    >
                                        View All Reports →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* US-004: Edit Profile Modal */}
            {showEditModal && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                    onSaved={() => {
                        setShowEditModal(false)
                        fetchProfile()
                    }}
                />
            )}

            <Footer />
        </div>
    )
}

// US-004: Edit Profile Modal Component
function EditProfileModal({
    profile,
    onClose,
    onSaved,
}: {
    profile: PublicProfile
    onClose: () => void
    onSaved: () => void
}) {
    const [bio, setBio] = useState(profile.bio || '')
    const [avatar, setAvatar] = useState(profile.avatar || '')
    const [website, setWebsite] = useState(profile.website || '')
    const [discord, setDiscord] = useState(profile.discord || '')
    const [steam, setSteam] = useState(profile.steam || '')
    const [saving, setSaving] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    const bioLength = bio.length

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrorMsg(null)
        setSuccessMsg(null)

        // Client-side validation
        if (bio.length > 500) {
            setErrorMsg('Bio must be 500 characters or less')
            return
        }
        if (avatar && !isValidUrl(avatar)) {
            setErrorMsg('Avatar must be a valid URL')
            return
        }
        if (website && !isValidUrl(website)) {
            setErrorMsg('Website must be a valid URL')
            return
        }

        try {
            setSaving(true)
            const res = await fetch('/api/users/me/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bio: bio || undefined,
                    avatar: avatar || '',
                    website: website || '',
                    discord: discord || undefined,
                    steam: steam || undefined,
                }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                setErrorMsg(data.message || data.error || 'Failed to update profile')
                return
            }

            setSuccessMsg('Profile updated successfully!')
            setTimeout(() => onSaved(), 1000)
        } catch {
            setErrorMsg('Failed to update profile. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    function isValidUrl(str: string): boolean {
        try {
            new URL(str)
            return true
        } catch {
            return false
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass rounded-2xl border border-border-primary w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Edit Profile</h2>
                        <button
                            onClick={onClose}
                            className="text-text-secondary hover:text-white transition-colors text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={500}
                                rows={3}
                                className="w-full bg-bg-tertiary border border-border-primary rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors resize-none"
                                placeholder="Tell us about yourself..."
                            />
                            <div className={`text-xs mt-1 ${bioLength > 450 ? 'text-yellow-400' : 'text-text-tertiary'}`}>
                                {bioLength}/500
                            </div>
                        </div>

                        {/* Avatar URL */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Avatar URL
                            </label>
                            <input
                                type="url"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                className="w-full bg-bg-tertiary border border-border-primary rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                placeholder="https://example.com/avatar.png"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Website
                            </label>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="w-full bg-bg-tertiary border border-border-primary rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                placeholder="https://yoursite.com"
                            />
                        </div>

                        {/* Discord */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Discord Username
                            </label>
                            <input
                                type="text"
                                value={discord}
                                onChange={(e) => setDiscord(e.target.value)}
                                className="w-full bg-bg-tertiary border border-border-primary rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                placeholder="username#1234"
                            />
                        </div>

                        {/* Steam */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Steam Profile URL
                            </label>
                            <input
                                type="text"
                                value={steam}
                                onChange={(e) => setSteam(e.target.value)}
                                className="w-full bg-bg-tertiary border border-border-primary rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                placeholder="https://steamcommunity.com/id/yourname"
                            />
                        </div>

                        {/* Error/Success Messages */}
                        {errorMsg && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                                {successMsg}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={saving}
                                className="flex-1"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
