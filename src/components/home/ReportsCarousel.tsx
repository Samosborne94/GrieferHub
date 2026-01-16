'use client'

import React, { useEffect, useState } from 'react'
import { StatusBadge } from '@/components/reports/StatusBadge'

// Mock Data
const MOCK_REPORTS = [
    { id: 1, user: 'TacticalBrad', game: 'Arc Raiders', type: 'Betrayal', time: '2m ago' },
    { id: 2, user: 'LootGoblin_99', game: 'Rust', type: 'Griefing', time: '5m ago' },
    { id: 3, user: 'FriendlyFire', game: 'Tarkov', type: 'Team Killing', time: '12m ago' },
    { id: 4, user: 'NoMicSolo', game: 'DayZ', type: 'Baiting', time: '15m ago' },
    { id: 5, user: 'ExtractCamper', game: 'Arc Raiders', type: 'Camping', time: '22m ago' },
]

export const ReportsCarousel = () => {
    return (
        <div className="w-full bg-bg-secondary/50 border-y border-border-primary overflow-hidden py-3 backdrop-blur-sm">
            <div className="flex animate-scroll whitespace-nowrap gap-8 items-center">
                {/* Duplicate the list for seamless scrolling effect */}
                {[...MOCK_REPORTS, ...MOCK_REPORTS, ...MOCK_REPORTS].map((report, idx) => (
                    <div key={`${report.id}-${idx}`} className="flex items-center gap-3 px-4 py-1 rounded-full bg-bg-tertiary/40 border border-border-secondary min-w-[280px]">
                        <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
                        <span className="font-mono text-xs text-accent-primary/80">LIVE REPORT</span>
                        <div className="h-4 w-px bg-border-primary"></div>
                        <span className="text-sm font-bold text-text-primary">{report.game}</span>
                        <span className="text-xs text-text-secondary">reported <span className="text-white font-medium">{report.user}</span></span>
                        <span className="text-xs px-2 py-0.5 rounded bg-bg-elevated text-text-tertiary border border-border-secondary">{report.type}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                /* Pause on hover */
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}
