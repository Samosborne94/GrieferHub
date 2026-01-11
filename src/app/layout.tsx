import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'

export const metadata: Metadata = {
    title: 'GrieferHub - Community Griefer Tracking',
    description: 'A community-driven platform for tracking and reporting griefers in gaming communities',
    keywords: ['griefer', 'gaming', 'tracking', 'community', 'reporting'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    )
}
