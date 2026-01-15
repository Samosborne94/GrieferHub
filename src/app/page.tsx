import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PlayerSearch } from '@/components/search/PlayerSearch'

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col arc-theme-bg">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-bg-primary/90" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,68,68,0.05),transparent_60%)]" />

                    <div className="container relative z-10">
                        <div className="py-20 md:py-32 text-center">
                            {/* Arc Raiders Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-down border border-accent-primary/30 shadow-[0_0_15px_rgba(255,68,68,0.2)]">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
                                </span>
                                <span className="text-sm font-medium text-accent-primary tracking-wide uppercase">Arc Raiders Intelligence</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in-up tracking-tighter uppercase">
                                <span className="text-text-primary drop-shadow-lg">Trust</span>
                                <span className="text-accent-primary drop-shadow-[0_0_10px_rgba(255,68,68,0.8)] mx-4">No</span>
                                <span className="text-text-primary drop-shadow-lg">One</span>
                            </h1>

                            {/* Subheading */}
                            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '0.1s' }}>
                                Verify every "Friendly" encounter. Track known betrayers.
                                <br />
                                <span className="text-accent-primary font-medium">Survive the extraction.</span>
                            </p>

                            {/* Search Component */}
                            <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <PlayerSearch />
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <Link href="/submit">
                                    <button className="group relative px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white font-bold tracking-wide uppercase rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,68,68,0.6)] hover:scale-105 w-full sm:w-auto">
                                        <span className="relative z-10">Report Betrayal</span>
                                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </button>
                                </Link>
                                <Link href="/intel">
                                    <button className="px-8 py-4 glass-hover rounded-xl font-semibold text-text-primary border border-border-primary hover:border-accent-primary transition-all duration-300 w-full sm:w-auto uppercase tracking-wide">
                                        View Intel Board
                                    </button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mt-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="glass rounded-xl p-6">
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">1K+</div>
                                    <div className="text-sm text-text-tertiary">Active Reports</div>
                                </div>
                                <div className="glass rounded-xl p-6">
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">500+</div>
                                    <div className="text-sm text-text-tertiary">Community Members</div>
                                </div>
                                <div className="glass rounded-xl p-6">
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">50+</div>
                                    <div className="text-sm text-text-tertiary">Supported Games</div>
                                </div>
                                <div className="glass rounded-xl p-6">
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">99%</div>
                                    <div className="text-sm text-text-tertiary">Verification Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="section-spacing bg-bg-secondary/50">
                    <div className="container">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                                How It Works
                            </h2>
                            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                                Three simple steps to help build a safer gaming community
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 stagger-animation">
                            {/* Feature 1 */}
                            <div className="glass-hover rounded-2xl p-8 group">
                                <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                                    Create an Account
                                </h3>
                                <p className="text-text-secondary leading-relaxed">
                                    Quick and easy registration. Join our community of gamers working together to create safer gaming environments.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="glass-hover rounded-2xl p-8 group">
                                <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                                    Browse Intel Board
                                </h3>
                                <p className="text-text-secondary leading-relaxed">
                                    Search verified reports across multiple games. Advanced filtering helps you find exactly what you need.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="glass-hover rounded-2xl p-8 group">
                                <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                                    Submit Reports
                                </h3>
                                <p className="text-text-secondary leading-relaxed">
                                    Upload evidence and submit detailed reports. Our moderation team ensures accuracy and fairness.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Section */}
                <section className="section-spacing">
                    <div className="container">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                                    Why Choose <span className="text-gradient">GrieferHub?</span>
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-status-verified/20 flex items-center justify-center mt-1">
                                            <svg className="w-4 h-4 text-status-verified" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary mb-2">Verified Reports Only</h3>
                                            <p className="text-text-secondary">Every report is reviewed by experienced moderators to ensure accuracy and prevent false accusations.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center mt-1">
                                            <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary mb-2">Cross-Platform Tracking</h3>
                                            <p className="text-text-secondary">Track griefers across multiple games and platforms with our comprehensive database.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-status-resolved/20 flex items-center justify-center mt-1">
                                            <svg className="w-4 h-4 text-status-resolved" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary mb-2">Community-Driven</h3>
                                            <p className="text-text-secondary">Built by gamers for gamers. Your feedback shapes our platform's future.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass rounded-2xl p-8">
                                <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/10 rounded-xl flex items-center justify-center border border-border-primary">
                                    <svg className="w-24 h-24 text-accent-primary/30" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                    </svg>
                                </div>
                                <p className="text-center text-text-tertiary mt-4 text-sm">Evidence-based reporting with screenshot and video support</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="section-spacing bg-bg-secondary/30">
                    <div className="container">
                        <div className="glass-hover rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent opacity-50" />
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                                    Ready to Get Started?
                                </h2>
                                <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                                    Join thousands of gamers making their communities safer, one report at a time.
                                </p>
                                <Link href="/register">
                                    <button className="group relative px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-glow-lg hover:scale-105">
                                        <span className="relative z-10">Create Free Account</span>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
