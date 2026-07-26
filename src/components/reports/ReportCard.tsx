'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Report } from '@/types/report'
import { StatusBadge } from './StatusBadge'

interface ReportCardProps {
    report: Report
}

type EvidenceKind = 'video' | 'image' | 'link' | 'none'

const VIDEO_PATTERNS = [
    /youtube\.com\//i,
    /youtu\.be\//i,
    /twitch\.tv\//i,
    /medal\.tv\//i,
    /streamable\.com\//i,
    /\.mp4(\?|#|$)/i,
    /\.webm(\?|#|$)/i,
    /\.mov(\?|#|$)/i,
]

const IMAGE_PATTERNS = [
    /\.png(\?|#|$)/i,
    /\.jpe?g(\?|#|$)/i,
    /\.gif(\?|#|$)/i,
    /\.webp(\?|#|$)/i,
    /i\.imgur\.com\//i,
]

const getEvidenceKind = (url?: string): EvidenceKind => {
    if (!url || !url.trim()) return 'none'
    if (VIDEO_PATTERNS.some((pattern) => pattern.test(url))) return 'video'
    if (IMAGE_PATTERNS.some((pattern) => pattern.test(url))) return 'image'
    return 'link'
}

const getYouTubeThumbnail = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
    const [thumbnailFailed, setThumbnailFailed] = useState(false)

    const severityConfig = {
        Low: {
            color: 'text-severity-low',
            hex: '#6b7280',
            percent: 25,
        },
        Medium: {
            color: 'text-severity-medium',
            hex: '#f59e0b',
            percent: 50,
        },
        High: {
            color: 'text-severity-high',
            hex: '#f97316',
            percent: 75,
        },
        Critical: {
            color: 'text-severity-critical',
            hex: '#dc2626',
            percent: 95,
        },
    }

    const config = severityConfig[report.severity]
    const evidenceKind = getEvidenceKind(report.evidenceUrl)

    const thumbnailUrl =
        evidenceKind === 'image'
            ? report.evidenceUrl
            : evidenceKind === 'video'
                ? getYouTubeThumbnail(report.evidenceUrl)
                : null

    const evidenceLabel = {
        video: 'Video evidence',
        image: 'Screenshot',
        link: 'Evidence link',
        none: 'No evidence attached',
    }[evidenceKind]

    return (
        <Link href={`/report/${report.id}`} className="block h-full">
            <article className="glass-hover h-full rounded-xl cursor-pointer group relative overflow-hidden bg-bg-secondary border border-border-primary">
                {/* Evidence thumbnail area */}
                <div className="relative h-36 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                    {thumbnailUrl && !thumbnailFailed && (
                        <Image
                            src={thumbnailUrl}
                            alt={`Evidence for report on ${report.grieferName}`}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
                            onError={() => setThumbnailFailed(true)}
                        />
                    )}

                    {/* Threat gauge badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 py-1 pl-1 pr-2.5 rounded-full bg-bg-primary/75 backdrop-blur-sm">
                        <span
                            className="w-[26px] h-[26px] rounded-full flex items-center justify-center"
                            style={{ background: `conic-gradient(${config.hex} 0 ${config.percent}%, #2a2a2a ${config.percent}% 100%)` }}
                        >
                            <span className={`w-[18px] h-[18px] rounded-full bg-bg-secondary text-2xs font-extrabold flex items-center justify-center ${config.color}`}>
                                {config.percent}
                            </span>
                        </span>
                        <span className={`text-xs font-bold tracking-wider uppercase ${config.color}`}>
                            {report.severity}
                        </span>
                    </div>

                    {/* Center affordance */}
                    {evidenceKind === 'video' ? (
                        <span className="relative z-10 w-12 h-12 rounded-full bg-bg-primary/70 backdrop-blur-sm border border-border-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-primary/85">
                            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </span>
                    ) : evidenceKind === 'image' && !thumbnailFailed ? null : (
                        <span className="relative z-10 w-12 h-12 rounded-full bg-bg-primary/50 backdrop-blur-sm border border-border-secondary flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                            {evidenceKind === 'none' ? (
                                <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            )}
                        </span>
                    )}

                    {/* Evidence type chip */}
                    <span className="absolute bottom-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-md bg-bg-primary/75 backdrop-blur-sm text-2xs text-text-secondary">
                        {evidenceLabel}
                    </span>
                </div>

                {/* Body */}
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary-hover transition-colors duration-200 truncate">
                                {report.grieferName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-text-tertiary">{report.game}</span>
                                {report.server && (
                                    <>
                                        <span className="text-text-muted">•</span>
                                        <span className="text-sm text-text-tertiary truncate">
                                            {report.server}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <StatusBadge status={report.status} />
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 group-hover:text-text-primary transition-colors duration-200">
                        {report.description}
                    </p>

                    {/* Tags */}
                    {report.tags && report.tags.length > 0 && (
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {report.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full text-xs bg-bg-elevated text-text-tertiary border border-border-secondary group-hover:border-border-primary transition-colors duration-200"
                                >
                                    {tag}
                                </span>
                            ))}
                            {report.tags.length > 3 && (
                                <span className="px-3 py-1 rounded-full text-xs text-text-muted">
                                    +{report.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border-secondary">
                        <div className="flex items-center gap-2 text-xs text-text-tertiary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={new Date(report.createdAt).toISOString()}>
                                {new Date(report.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </time>
                        </div>

                        {/* Hover arrow indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                            <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    )
}
