import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
    title: {
        default: 'GrieferHub - Community Griefer Tracking Platform',
        template: '%s | GrieferHub',
    },
    description:
        'Track, report, and share information about griefers across gaming communities. Community-driven platform with verified reports, evidence tracking, and moderation tools.',
    keywords: [
        'griefer',
        'griefing',
        'gaming',
        'tracking',
        'community',
        'reporting',
        'game moderation',
        'player reports',
        'toxic players',
        'minecraft griefers',
        'gta griefers',
        'rust griefers',
    ],
    authors: [{ name: 'GrieferHub Team' }],
    creator: 'GrieferHub',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://grieferhub.com',
        title: 'GrieferHub - Community Griefer Tracking Platform',
        description:
            'Track and report griefers across gaming communities with verified reports and evidence.',
        siteName: 'GrieferHub',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'GrieferHub - Community Griefer Tracking',
        description:
            'Track and report griefers across gaming communities with verified reports and evidence.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // Add your verification codes here when ready
        // google: 'your-google-verification-code',
        // yandex: 'your-yandex-verification-code',
    },
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
                <SpeedInsights />
            </body>
        </html>
    )
}
