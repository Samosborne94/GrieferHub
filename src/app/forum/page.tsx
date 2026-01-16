'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'

const CATEGORIES = [
    {
        id: 'general',
        title: 'General Intel',
        description: 'General discussion about griefing tactics, game updates, and community news.',
        icon: '📢',
        topics: 156,
        latest: 'New anti-cheat update in Rust...'
    },
    {
        id: 'squads',
        title: 'Squad Finding',
        description: 'Find trusted players to team up with. Verify their reputation here first.',
        icon: '🤝',
        topics: 89,
        latest: 'Looking for duo - Arc Raiders [EU]'
    },
    {
        id: 'meta',
        title: 'Meta Discussion',
        description: 'Discuss the current "Griefing Meta" and how to counter it.',
        icon: '🛡️',
        topics: 42,
        latest: 'Extraction camping spots on day 1...'
    },
    {
        id: 'appeals',
        title: 'Report Appeals',
        description: 'Believe you were falsely reported? Submit an appeal here.',
        icon: '⚖️',
        topics: 12,
        latest: 'Appeal for Report #8821'
    }
]

export default function ForumPage() {
    return (
        <div className="min-h-screen flex flex-col arc-theme-bg text-text-primary">
            <Header />

            <main className="flex-1 container py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 tracking-tight uppercase">Community <span className="text-accent-primary">Comms</span></h1>
                        <p className="text-text-secondary">Official channels for verified intel sharing.</p>
                    </div>
                    <Button variant="primary">New Topic +</Button>
                </div>

                {/* Categories Grid */}
                <div className="grid gap-6">
                    {CATEGORIES.map((category) => (
                        <div key={category.id} className="glass-hover rounded-xl p-6 border border-border-primary hover:border-accent-primary/30 transition-all group cursor-pointer">
                            <div className="flex items-start md:items-center gap-6">
                                <div className="w-16 h-16 rounded-xl bg-bg-elevated flex items-center justify-center text-3xl shadow-inner">
                                    {category.icon}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                                        {category.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm mb-4 md:mb-0">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 md:items-center min-w-[300px]">
                                    <div className="text-center md:text-right">
                                        <div className="text-xl font-bold text-white">{category.topics}</div>
                                        <div className="text-xs text-text-tertiary uppercase">Topics</div>
                                    </div>

                                    <div className="flex-1 bg-bg-tertiary/50 p-3 rounded-lg border border-border-secondary text-sm">
                                        <div className="text-xs text-accent-primary font-bold mb-1 uppercase">Latest Activity</div>
                                        <div className="text-text-primary truncate">{category.latest}</div>
                                        <div className="text-xs text-text-tertiary mt-1">2 hours ago by <span className="text-white">Anon</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Ticker or smaller section could go here */}
            </main>

            <Footer />
        </div>
    )
}
