'use client'

import React from 'react'

export const LiveStats = () => {
    const stats = [
        { label: 'Reports (24h)', value: '1,248', trend: '+12%', color: 'text-accent-primary' },
        { label: 'Most Dangerous', value: 'Arc Raiders', trend: 'High Risk', color: 'text-orange-500' },
        { label: 'Active Griefers', value: '432', trend: 'Online', color: 'text-red-500' },
        { label: 'Global Bans', value: '89', trend: 'Today', color: 'text-status-resolved' },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {stats.map((stat, idx) => (
                <div key={idx} className="glass p-4 rounded-xl border-l-4 border-l-accent-primary/50 relative overflow-hidden group hover:bg-bg-elevated transition-colors">
                    {/* Background number for style */}
                    <div className="absolute -right-2 -bottom-4 text-6xl font-black text-bg-elevated opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
                        {idx + 1}
                    </div>

                    <div className="relative z-10">
                        <div className="text-xs uppercase tracking-wider text-text-tertiary font-semibold mb-1">
                            {stat.label}
                        </div>
                        <div className={`text-2xl font-black ${stat.color} mb-1 tracking-tight`}>
                            {stat.value}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-mono text-text-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                            {stat.trend}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
