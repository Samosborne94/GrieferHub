'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Badge, SeverityBadge } from '@/components/common/Badge'
import type { BadgeProps } from '@/components/common/Badge'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import type { UserProfile } from '@/types/user'
import type { Report } from '@/types/report'
import type { Comment } from '@/types/comment'

interface ProfileData extends Omit<UserProfile, 'email' | 'createdAt'> {
    createdAt: string
}

interface ActivityComment extends Omit<Comment, 'createdAt' | 'updatedAt'> {
    createdAt: string
    updatedAt: string
}

interface ActivityReport extends Omit<Report, 'createdAt' | 'updatedAt'> {
    createdAt: string
    updatedAt: string
}

function getRoleBadgeVariant(role: string): BadgeProps['variant'] {
    switch (role) {
        case 'admin':
            return 'error'
        case 'moderator':
            return 'primary'
        default:
            return 'default'
    }
}

function getThreatLevelVariant(reputationScore: number) {
    if (reputationScore >= 50) return { label: 'Trusted', variant: 'verified' as const }
    if (reputationScore >= 20) return { label: 'Established', variant: 'info' as const }
    if (reputationScore >= 1) return { label: 'New', variant: 'warning' as const }
    return { label: 'Unknown', variant: 'default' as const }
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

function formatJoinDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const profileSchema = z.object({
    bio: z.string().max(500, 'Bio must be 500 characters or less').optional().or(z.literal('')),
    location: z.string().max(100, 'Location must be 100 characters or less').optional().or(z.literal('')),
    website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    discord: z.string().max(50, 'Discord username must be 50 characters or less').optional().or(z.literal('')),
    steam: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

interface EditFormData {
    bio: string
    location: string
    website: string
    discord: string
    steam: string
}

interface EditFormErrors {
    bio?: string
    location?: string
    website?: string
    discord?: string
    steam?: string
}

export default function PlayerProfilePage() {
    const params = useParams()
    const username = Array.isArray(params?.username)
        ? decodeURIComponent(params.username[0])
        : decodeURIComponent(params?.username || '')

    const { data: session } = useSession()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [formData, setFormData] = useState<EditFormData>({ bio: '', location: '', website: '', discord: '', steam: '' })
    const [formErrors, setFormErrors] = useState<EditFormErrors>({})

    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [recentReports, setRecentReports] = useState<ActivityReport[]>([])
    const [recentComments, setRecentComments] = useState<ActivityComment[]>([])

    const isOwnProfile = session?.user?.name === username

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setSaveMessage({ type: 'error', text: 'Invalid file type. Accepted: JPG, PNG, WebP' })
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            setSaveMessage({ type: 'error', text: 'File too large. Maximum size is 2MB' })
            return
        }

        setUploadingAvatar(true)
        setSaveMessage(null)
        try {
            const fd = new FormData()
            fd.append('avatar', file)
            const res = await fetch('/api/users/me/avatar', { method: 'POST', body: fd })
            const json = await res.json()

            if (!res.ok || !json.success) {
                setSaveMessage({ type: 'error', text: json.error || 'Failed to upload avatar' })
                return
            }

            setProfile(prev => prev ? { ...prev, avatar: json.data.url } : prev)
            setSaveMessage({ type: 'success', text: 'Avatar updated!' })
        } catch {
            setSaveMessage({ type: 'error', text: 'Failed to upload avatar' })
        } finally {
            setUploadingAvatar(false)
            e.target.value = ''
        }
    }

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

                // Fetch recent activity
                try {
                    const actRes = await fetch(`/api/users/${encodeURIComponent(username)}/activity`)
                    const actJson = await actRes.json()
                    if (actRes.ok && actJson.success) {
                        setRecentReports(actJson.data.reports || [])
                        setRecentComments(actJson.data.comments || [])
                    }
                } catch {
                    // Activity fetch is non-critical, silently ignore
                }
            } catch {
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [username])

    function openEditForm() {
        if (!profile) return
        setFormData({
            bio: profile.bio || '',
            location: profile.location || '',
            website: profile.website || '',
            discord: profile.discord || '',
            steam: profile.steam || '',
        })
        setFormErrors({})
        setSaveMessage(null)
        setEditing(true)
    }

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault()
        setFormErrors({})
        setSaveMessage(null)

        const result = profileSchema.safeParse(formData)
        if (!result.success) {
            const errors: EditFormErrors = {}
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof EditFormErrors
                errors[field] = issue.message
            }
            setFormErrors(errors)
            return
        }

        setSaving(true)
        try {
            const res = await fetch('/api/users/me/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const json = await res.json()

            if (!res.ok || !json.success) {
                setSaveMessage({ type: 'error', text: json.message || json.error || 'Failed to save' })
                return
            }

            setProfile(json.data)
            setEditing(false)
            setSaveMessage({ type: 'success', text: 'Profile updated successfully' })
        } catch {
            setSaveMessage({ type: 'error', text: 'Failed to save profile' })
        } finally {
            setSaving(false)
        }
    }

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

    const threat = getThreatLevelVariant(profile.reputationScore)
    const verificationRate = profile.totalReports > 0
        ? Math.round((profile.verifiedReports / profile.totalReports) * 100)
        : 0

    return (
        <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
            <Header />

            <main className="flex-1 container py-12 fade-in-up">
                {/* Dossier Header */}
                <div className="glass rounded-2xl p-8 mb-8 border border-accent-primary/20 relative overflow-hidden card-elevated">
                    <div className="absolute top-0 right-0 p-4 flex items-center gap-3">
                        <div className="text-xs font-mono text-accent-primary border border-accent-primary px-2 py-1 rounded opacity-50">
                            PLAYER DOSSIER
                        </div>
                        {isOwnProfile && !editing && (
                            <Button variant="secondary" size="sm" onClick={openEditForm}>
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Avatar / Identity */}
                        <div className="flex-shrink-0 text-center">
                            <div className="w-32 h-32 rounded-full bg-bg-elevated border-2 border-accent-primary/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,68,68,0.2)] overflow-hidden relative">
                                {profile.avatar ? (
                                    <Image
                                        src={profile.avatar}
                                        alt={profile.username}
                                        fill
                                        className="object-cover"
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
                                <Badge variant={getRoleBadgeVariant(profile.role)} size="sm">
                                    {profile.role.toUpperCase()}
                                </Badge>
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
                                <Badge variant={threat.variant} size="lg" dot className="font-bold">
                                    {threat.label} ({profile.reputationScore} pts)
                                </Badge>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary card-elevated">
                                <div className="text-3xl font-bold text-white mb-1">{profile.totalReports}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Reports</div>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary card-elevated">
                                <div className="text-3xl font-bold text-green-500 mb-1">{profile.verifiedReports}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Verified</div>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary card-elevated">
                                <div className="text-3xl font-bold text-blue-400 mb-1">{profile.totalComments}</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Comments</div>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-primary card-elevated">
                                <div className="text-3xl font-bold text-accent-primary mb-1">{verificationRate}%</div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Veracity</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save message */}
                {saveMessage && (
                    <div className={`rounded-lg p-4 mb-8 border fade-in ${saveMessage.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                        {saveMessage.text}
                    </div>
                )}

                {/* Edit Profile Form */}
                {editing && (
                    <form onSubmit={handleSaveProfile} className="glass rounded-2xl p-8 mb-8 border border-accent-primary/30 card-elevated scale-in">
                        <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
                        <div className="space-y-4">
                            {/* Avatar Upload */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Avatar</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-bg-elevated border-2 border-border-primary flex items-center justify-center overflow-hidden relative">
                                        {profile.avatar ? (
                                            <Image src={profile.avatar} alt="Avatar" fill className="object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold text-accent-primary">
                                                {profile.username.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer">
                                        <span className="px-3 py-1.5 text-sm font-medium rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary hover:bg-bg-secondary transition-all duration-200">
                                            {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleAvatarUpload}
                                            disabled={uploadingAvatar}
                                            className="hidden"
                                        />
                                    </label>
                                    <span className="text-xs text-text-tertiary">JPG, PNG, or WebP. Max 2MB.</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Bio <span className="text-text-tertiary">({formData.bio.length}/500)</span>
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    maxLength={500}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all duration-200"
                                    placeholder="Tell the community about yourself..."
                                />
                                {formErrors.bio && <p className="mt-1 text-sm text-red-500">{formErrors.bio}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Location"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="e.g. Sydney, Australia"
                                    error={formErrors.location}
                                />
                                <Input
                                    label="Website"
                                    value={formData.website}
                                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                    placeholder="https://example.com"
                                    error={formErrors.website}
                                />
                                <Input
                                    label="Discord"
                                    value={formData.discord}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discord: e.target.value }))}
                                    placeholder="username#1234"
                                    error={formErrors.discord}
                                />
                                <Input
                                    label="Steam Profile URL"
                                    value={formData.steam}
                                    onChange={(e) => setFormData(prev => ({ ...prev, steam: e.target.value }))}
                                    placeholder="https://steamcommunity.com/id/..."
                                    error={formErrors.steam}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button type="submit" isLoading={saving}>
                                Save Changes
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                {/* Bio & Social Links */}
                {(profile.bio || profile.location || profile.website || profile.discord || profile.steam) && (
                    <div className="glass rounded-2xl p-8 mb-8 border border-border-primary card-elevated">
                        {profile.bio && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">About</h3>
                                <p className="text-text-primary leading-relaxed">{profile.bio}</p>
                            </div>
                        )}

                        {(profile.location || profile.website || profile.discord || profile.steam) && (
                            <div>
                                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Links & Info</h3>
                                <div className="flex flex-wrap gap-3">
                                    {profile.location && (
                                        <div className="px-3 py-2 bg-bg-tertiary rounded-lg text-sm border border-border-primary flex items-center gap-2">
                                            <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-text-primary">{profile.location}</span>
                                        </div>
                                    )}
                                    {profile.website && (
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 bg-bg-tertiary rounded-lg text-sm border border-border-primary flex items-center gap-2 hover:border-accent-primary/50 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-accent-primary">{new URL(profile.website).hostname}</span>
                                        </a>
                                    )}
                                    {profile.discord && (
                                        <div className="px-3 py-2 bg-bg-tertiary rounded-lg text-sm border border-border-primary flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                                            </svg>
                                            <span className="text-text-primary">{profile.discord}</span>
                                        </div>
                                    )}
                                    {profile.steam && (
                                        <a
                                            href={profile.steam}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 bg-bg-tertiary rounded-lg text-sm border border-border-primary flex items-center gap-2 hover:border-accent-primary/50 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-text-tertiary" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z" />
                                            </svg>
                                            <span className="text-accent-primary">Steam Profile</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Reports */}
                <div className="mb-12 stagger-animation">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-accent-primary rounded-full"></span>
                        Recent Reports
                    </h2>
                    {recentReports.length > 0 ? (
                        <div className="space-y-3">
                            {recentReports.map((report) => (
                                <Link
                                    key={report.id}
                                    href={`/report/${report.id}`}
                                    className="block glass rounded-xl p-4 border border-border-primary hover:border-accent-primary/30 transition-all card-elevated"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-text-primary font-bold">{report.grieferName}</span>
                                            <Badge variant="default" size="sm" outline>
                                                {report.game}
                                            </Badge>
                                            <SeverityBadge severity={report.severity as any} />
                                            <Badge variant={
                                                report.status === 'Verified' ? 'verified' :
                                                report.status === 'Rejected' ? 'rejected' :
                                                report.status === 'Resolved' ? 'info' :
                                                'warning'
                                            } size="sm" dot>
                                                {report.status}
                                            </Badge>
                                        </div>
                                        <span className="text-xs text-text-tertiary font-mono">{timeAgo(report.createdAt)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass rounded-2xl border border-dashed border-border-primary">
                            <p className="text-text-tertiary">No reports submitted yet.</p>
                        </div>
                    )}
                </div>

                {/* Recent Comments */}
                <div className="mb-8 stagger-animation">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                        Recent Comments
                    </h2>
                    {recentComments.length > 0 ? (
                        <div className="space-y-3">
                            {recentComments.map((comment) => (
                                <Link
                                    key={comment.id}
                                    href={`/report/${comment.reportId}`}
                                    className="block glass rounded-xl p-4 border border-border-primary hover:border-blue-500/30 transition-all card-elevated"
                                >
                                    <p className="text-text-primary text-sm mb-3 line-clamp-2 leading-relaxed">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            on report {comment.reportId}
                                        </span>
                                        <span className="text-xs text-text-tertiary font-mono">{timeAgo(comment.createdAt)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass rounded-2xl border border-dashed border-border-primary">
                            <p className="text-text-tertiary">No comments yet.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}


