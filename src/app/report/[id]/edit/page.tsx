'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import type { Report, ReportSeverity } from '@/types/report'

interface EditReportPageProps {
    params: {
        id: string
    }
}

export default function EditReportPage({ params }: EditReportPageProps) {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [report, setReport] = useState<Report | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [grieferName, setGrieferName] = useState('')
    const [game, setGame] = useState('')
    const [description, setDescription] = useState('')
    const [evidenceUrl, setEvidenceUrl] = useState('')
    const [severity, setSeverity] = useState<ReportSeverity>('Medium')
    const [server, setServer] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push(`/login?redirect=/report/${params.id}/edit`)
        }
    }, [status, router, params.id])

    // Fetch report
    useEffect(() => {
        if (status === 'authenticated') {
            fetchReport()
        }
    }, [status, params.id])

    const fetchReport = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/reports/${params.id}`)
            const data = await response.json()

            if (data.success) {
                const fetchedReport = data.data
                setReport(fetchedReport)

                // Check if user is owner
                if (fetchedReport.reporterId !== session?.user?.id) {
                    setError('You can only edit your own reports')
                    return
                }

                // Populate form
                setGrieferName(fetchedReport.grieferName)
                setGame(fetchedReport.game)
                setDescription(fetchedReport.description)
                setEvidenceUrl(fetchedReport.evidenceUrl)
                setSeverity(fetchedReport.severity)
                setServer(fetchedReport.server || '')
                setTags(fetchedReport.tags || [])
                setError(null)
            } else {
                setError(data.error || 'Failed to fetch report')
            }
        } catch (err) {
            setError('Failed to fetch report')
            console.error('Error fetching report:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!grieferName || !game || !description || !evidenceUrl) {
            alert('Please fill in all required fields')
            return
        }

        try {
            setSubmitting(true)

            const response = await fetch(`/api/reports/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    grieferName,
                    game,
                    description,
                    evidenceUrl,
                    severity,
                    server: server || undefined,
                    tags: tags.length > 0 ? tags : undefined,
                }),
            })

            const data = await response.json()

            if (data.success) {
                router.push(`/report/${params.id}`)
            } else {
                alert(data.message || 'Failed to update report')
            }
        } catch (err) {
            console.error('Error updating report:', err)
            alert('Failed to update report')
        } finally {
            setSubmitting(false)
        }
    }

    if (status === 'loading' || (status === 'authenticated' && loading)) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </main>
                <Footer />
            </div>
        )
    }

    if (status === 'unauthenticated') {
        return null // Will redirect
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container py-8">
                    <div className="glass rounded-lg p-8 text-center max-w-2xl mx-auto">
                        <p className="text-red-500 mb-2">Error</p>
                        <p className="text-text-tertiary text-sm mb-6">{error}</p>
                        <Button onClick={() => router.push('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                            Edit Report
                        </h1>
                        <p className="text-text-secondary">
                            Update information about this griefer report
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="glass rounded-lg p-8 space-y-6">
                        {/* Griefer Name */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Griefer Name / Username *
                            </label>
                            <Input
                                type="text"
                                value={grieferName}
                                onChange={(e) => setGrieferName(e.target.value)}
                                placeholder="Enter the griefer's username or in-game name"
                                required
                                maxLength={100}
                            />
                        </div>

                        {/* Game */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Game *
                            </label>
                            <Input
                                type="text"
                                value={game}
                                onChange={(e) => setGame(e.target.value)}
                                placeholder="e.g., Minecraft, GTA Online, Rust"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Description *
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what happened in detail..."
                                required
                                minLength={10}
                                maxLength={5000}
                                rows={6}
                                className="w-full px-4 py-3 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all resize-none"
                            />
                            <p className="text-xs text-text-tertiary mt-1">
                                {description.length} / 5000 characters
                            </p>
                        </div>

                        {/* Evidence URL */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Evidence URL *
                            </label>
                            <Input
                                type="url"
                                value={evidenceUrl}
                                onChange={(e) => setEvidenceUrl(e.target.value)}
                                placeholder="https://..."
                                required
                            />
                            <p className="text-xs text-text-tertiary mt-1">
                                Link to video or image evidence (YouTube, Imgur, Cloudinary, etc.)
                            </p>
                        </div>

                        {/* Severity */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Severity Level *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {(['Low', 'Medium', 'High', 'Critical'] as ReportSeverity[]).map(
                                    (level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setSeverity(level)}
                                            className={`px-4 py-3 rounded-lg border transition-all ${
                                                severity === level
                                                    ? 'bg-accent-primary border-accent-primary text-white'
                                                    : 'bg-bg-tertiary border-gray-700 text-text-primary hover:border-accent-primary'
                                            }`}
                                        >
                                            {level}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Server (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Server / Region (Optional)
                            </label>
                            <Input
                                type="text"
                                value={server}
                                onChange={(e) => setServer(e.target.value)}
                                placeholder="e.g., US West, EU Central, Server #123"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Tags (Optional)
                            </label>
                            <div className="flex gap-2 mb-3">
                                <Input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddTag()
                                        }
                                    }}
                                    placeholder="Add a tag..."
                                    className="flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-4 py-2 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary hover:border-accent-primary transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            {tags.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 rounded-full text-sm bg-accent-primary/20 text-accent-primary border border-accent-primary flex items-center gap-2"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-red-500 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={submitting} className="flex-1">
                                {submitting ? 'Updating...' : 'Update Report'}
                            </Button>
                            <button
                                type="button"
                                onClick={() => router.push(`/report/${params.id}`)}
                                disabled={submitting}
                                className="px-6 py-3 rounded-lg bg-bg-tertiary border border-gray-700 text-text-primary hover:border-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}
