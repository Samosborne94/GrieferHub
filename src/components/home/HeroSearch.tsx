'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export const HeroSearch: React.FC = () => {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState('')

    // Press "/" anywhere on the page to focus the search input
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return

            const target = event.target as HTMLElement | null
            if (
                target &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable)
            ) {
                return
            }

            event.preventDefault()
            inputRef.current?.focus()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = query.trim()
        router.push(trimmed ? `/intel?search=${encodeURIComponent(trimmed)}` : '/intel')
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2.5 rounded-xl p-1.5 pl-4 bg-bg-tertiary/80 backdrop-blur-md border border-border-primary shadow-elevation-xl transition-all duration-300 focus-within:border-accent-primary/50 focus-within:shadow-[0_0_0_3px_rgba(255,68,68,0.12),0_20px_25px_-5px_rgba(0,0,0,0.6)]"
            >
                <svg
                    className="w-5 h-5 text-text-muted flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by player name, server, or game..."
                    aria-label="Search the Intel Board"
                    className="flex-1 min-w-0 bg-transparent border-0 p-0 py-2 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-0"
                />
                <button
                    type="submit"
                    className="flex-shrink-0 px-5 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold text-sm transition-colors duration-200"
                >
                    Search Intel
                </button>
            </form>
            <p className="mt-3.5 text-xs text-text-muted">
                Searches the Intel Board by name, server or game — or press{' '}
                <kbd className="px-1.5 py-0.5 rounded border border-border-primary bg-bg-elevated text-text-tertiary font-mono text-2xs">/</kbd>{' '}
                to focus
            </p>
        </div>
    )
}
