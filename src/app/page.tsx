'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PlayerSearch } from '@/components/search/PlayerSearch'
import { ReportsCarousel } from '@/components/home/ReportsCarousel'
import { LiveStats } from '@/components/home/LiveStats'
import { Button } from '@/components/common/Button'

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col arc-theme-bg">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden min-h-[90vh] flex items-center">
                    {/* Background layers */}
                    <div className="absolute inset-0 bg-bg-primary" />
                    <div className="absolute inset-0 mesh-background opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
                    
                    {/* Animated glow effects */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

                    <div className="container relative z-10">
                        <div className="py-20 md:py-32 text-center">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-12 animate-fade-in-down border border-accent-primary/30 shadow-glow">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
                                </span>
                                <span className="text-xs font-bold text-accent-primary tracking-[0.2em] uppercase">Arc Raiders Intelligence</span>
                            </div>

                            {/* Main Heading - High Contrast / Tactical */}
                            <div className="mb-8 relative">
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
                                    <span className="block text-text-primary">Trust</span>
                                    <span className="block text-transparent stroke-accent" style={{ WebkitTextStroke: '2px var(--accent-primary)' }}>No One</span>
                                    <span className="block text-text-primary">Survive</span>
                                </h1>
                                <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-accent-primary/50 hidden md:block" />
                                <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-accent-primary/50 hidden md:block" />
                            </div>

                            {/* Subheading */}
                            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up font-light tracking-wide">
                                The community-driven blacklist for extraction shooters. 
                                <br className="hidden md:block" />
                                <span className="text-text-primary font-medium">Identify betrayers before they pull the trigger.</span>
                            </p>

                            {/* Search Component - Integrated into glass container */}
                            <div className="max-w-3xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <div className="p-2 glass-card rounded-2xl shadow-2xl">
                                    <PlayerSearch />
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <Link href="/submit" className="w-full sm:w-auto">
                                    <Button variant="tactical" size="xl" fullWidth className="sm:w-auto">
                                        Report Betrayal
                                    </Button>
                                </Link>
                                <Link href="/intel" className="w-full sm:w-auto">
                                    <Button variant="glass" size="xl" fullWidth className="sm:w-auto">
                                        Browse Database
                                    </Button>
                                </Link>
                            </div>

                            {/* Platform indicators */}
                            <div className="mt-20 flex justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="text-xs font-black tracking-[0.3em] uppercase">PC / STEAM</div>
                                <div className="text-xs font-black tracking-[0.3em] uppercase">PLAYSTATION 5</div>
                                <div className="text-xs font-black tracking-[0.3em] uppercase">XBOX SERIES X</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom fade for transition to next section */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
                </section>

                {/* Data Feed Section */}
                <section className="py-10 relative z-20">
                    <div className="container">
                        <div className="glass-card rounded-2xl p-8 border-accent-primary/20">
                            <div className="flex flex-col lg:flex-row gap-8 items-center">
                                <div className="lg:w-1/4">
                                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Live Intel</h3>
                                    <p className="text-sm text-text-tertiary">Real-time reports from the extraction zone.</p>
                                </div>
                                <div className="lg:w-3/4 w-full">
                                    <ReportsCarousel />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12">
                    <div className="container">
                        <LiveStats />
                    </div>
                </section>

                {/* Bento Grid Features Section */}
                <section className="section-spacing bg-bg-secondary/30 relative">
                    <div className="container">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-xl">
                                <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-4 tracking-tighter uppercase leading-none">
                                    Tactical <span className="text-accent-primary">Superiority</span>
                                </h2>
                                <p className="text-lg text-text-secondary font-light">
                                    Tools designed for the modern extraction raider. Knowledge is the difference between extraction and elimination.
                                </p>
                            </div>
                            <div className="text-xs font-mono text-accent-primary px-3 py-1 border border-accent-primary/30 rounded">
                                SYSTEM_STATUS: OPERATIONAL
                            </div>
                        </div>

                        <div className="grid md:grid-cols-12 gap-6 auto-rows-[240px]">
                            {/* Feature 1 - Large Bento Box */}
                            <div className="md:col-span-8 md:row-span-2 glass-card rounded-3xl p-10 group relative overflow-hidden flex flex-col justify-end">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-64 h-64 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-accent-primary/20 flex items-center justify-center mb-6 border border-accent-primary/30">
                                        <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-black text-text-primary mb-4 uppercase tracking-tighter">Verified Intelligence</h3>
                                    <p className="text-text-secondary text-lg max-w-lg leading-relaxed">
                                        Our moderation team rigorously verifies every report. No false accusations, no spam—just high-fidelity intel you can trust during your most critical extractions.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 - Small Bento Box */}
                            <div className="md:col-span-4 md:row-span-1 glass-card rounded-3xl p-8 group hover:border-accent-primary/30 transition-all duration-500">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/30">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-text-primary mb-2 uppercase tracking-tighter">Global Search</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Instant lookups for any IGN. Check a player&apos;s history while you&apos;re still in the lobby.
                                </p>
                            </div>

                            {/* Feature 3 - Small Bento Box */}
                            <div className="md:col-span-4 md:row-span-1 glass-card rounded-3xl p-8 group hover:border-status-verified/30 transition-all duration-500">
                                <div className="w-12 h-12 rounded-xl bg-status-verified/10 flex items-center justify-center mb-4 border border-status-verified/30">
                                    <svg className="w-6 h-6 text-status-verified" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-text-primary mb-2 uppercase tracking-tighter">Real-Time Alerts</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Get notified the moment a known griefer is spotted on your server or region.
                                </p>
                            </div>

                            {/* Feature 4 - Medium Bento Box */}
                            <div className="md:col-span-6 md:row-span-1 glass-card rounded-3xl p-8 flex items-center gap-6 group">
                                <div className="w-20 h-20 rounded-2xl bg-bg-elevated flex-shrink-0 flex items-center justify-center border border-white/5 group-hover:border-accent-primary/20 transition-all">
                                    <svg className="w-10 h-10 text-text-tertiary group-hover:text-accent-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-text-primary mb-1 uppercase tracking-tighter">Community Driven</h3>
                                    <p className="text-sm text-text-secondary">Join our Discord for manual verification and community discussions.</p>
                                </div>
                            </div>

                            {/* Feature 5 - Medium Bento Box */}
                            <div className="md:col-span-6 md:row-span-1 glass-card rounded-3xl p-8 flex items-center gap-6 group">
                                <div className="w-20 h-20 rounded-2xl bg-bg-elevated flex-shrink-0 flex items-center justify-center border border-white/5 group-hover:border-accent-primary/20 transition-all">
                                    <svg className="w-10 h-10 text-text-tertiary group-hover:text-accent-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-text-primary mb-1 uppercase tracking-tighter">Open Source</h3>
                                    <p className="text-sm text-text-secondary">Fully transparent architecture. Built by the community, for the community.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Section - Modernized */}
                <section className="section-spacing">
                    <div className="container">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-5xl md:text-7xl font-black text-text-primary mb-10 tracking-tighter uppercase leading-[0.9]">
                                    Uncompromising <br /><span className="text-gradient">Integrity</span>
                                </h2>
                                <div className="space-y-10">
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                                            <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-text-primary mb-2 uppercase tracking-tight">Zero-Trust Framework</h3>
                                            <p className="text-text-secondary leading-relaxed font-light">Every report is reviewed by multiple moderators before being marked as &quot;Verified&quot;. We maintain the highest standard of evidence for every entry.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                                            <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-text-primary mb-2 uppercase tracking-tight">Secure Evidence Vault</h3>
                                            <p className="text-text-secondary leading-relaxed font-light">All evidence is stored securely and linked to the suspect&apos;s digital fingerprint, creating an immutable record of their betrayal.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                                            <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-text-primary mb-2 uppercase tracking-tight">Raider Network</h3>
                                            <p className="text-text-secondary leading-relaxed font-light">Built by veteran extraction shooter fans who understand that a single betrayer can ruin hours of progress.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-accent-primary/20 blur-[100px] rounded-full animate-pulse" />
                                <div className="glass-card rounded-[2.5rem] p-4 relative border border-white/10 shadow-2xl">
                                    <div className="aspect-[4/5] bg-bg-secondary rounded-[2rem] overflow-hidden border border-white/5 relative">
                                        {/* Abstract UI representation */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent" />
                                        <div className="p-8 space-y-6">
                                            <div className="h-4 w-1/3 bg-accent-primary/30 rounded" />
                                            <div className="h-12 w-full bg-white/5 rounded-xl border border-white/10" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
                                                <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
                                            </div>
                                            <div className="h-48 w-full bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-bg-secondary to-transparent">
                                            <div className="px-4 py-2 bg-accent-primary rounded-full text-[10px] font-black tracking-widest uppercase inline-block text-white">Verified Evidence</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section - Minimalist / Impactful */}
                <section className="section-spacing relative overflow-hidden">
                    <div className="container relative z-10">
                        <div className="glass-card rounded-[3rem] p-16 md:p-24 text-center border-accent-primary/20 shadow-glow-lg">
                            <h2 className="text-5xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter uppercase leading-none">
                                Cleanse the <br /><span className="text-accent-primary">Zone</span>
                            </h2>
                            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                                Join 5,000+ raiders already using GrieferHub to secure their extractions. 
                                <br className="hidden md:block" />
                                It only takes 30 seconds to contribute to the network.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link href="/register">
                                    <Button variant="custom" size="xl" className="bg-text-primary text-bg-primary hover:bg-white shadow-glow">
                                        Join the Network
                                    </Button>
                                </Link>
                                <Link href="/submit">
                                    <Button variant="glass" size="xl">
                                        Report Griefer
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Background glow for CTA */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-[160px] pointer-events-none" />
                </section>
            </main>

            <Footer />
        </div>
    )
}
