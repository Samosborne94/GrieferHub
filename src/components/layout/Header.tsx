'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '../common/Button'

export const Header = () => {
    const { data: session, status } = useSession()

    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-800">
            <div className="container">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-accent-primary">
                        GrieferHub
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/intel"
                            className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                            Intel Board
                        </Link>
                        {session && (
                            <>
                                <Link
                                    href="/submit"
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Submit Report
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {status === 'loading' ? (
                            <div className="w-20 h-9 bg-bg-tertiary animate-pulse rounded-lg" />
                        ) : session ? (
                            <>
                                <span className="text-sm text-text-secondary hidden sm:block">
                                    {session.user?.name || session.user?.email}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
