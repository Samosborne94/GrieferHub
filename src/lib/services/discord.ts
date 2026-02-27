import type { Report } from '@/types/report'

const severityColors: Record<string, number> = {
    Critical: 0xff0000,  // Red
    High: 0xff8800,      // Orange
    Medium: 0xffcc00,    // Yellow
    Low: 0x888888,       // Gray
}

/**
 * Send a Discord webhook notification for a verified report.
 * Silently skips if DISCORD_WEBHOOK_URL is not configured.
 */
export async function sendDiscordWebhook(report: Report, appBaseUrl?: string): Promise<void> {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) return

    const baseUrl = appBaseUrl || process.env.NEXTAUTH_URL || 'https://grieferhub.com'
    const reportUrl = `${baseUrl}/report/${report.id}`

    const embed = {
        title: `New Verified Report: ${report.grieferName}`,
        description: report.description.length > 200
            ? report.description.slice(0, 200) + '...'
            : report.description,
        color: severityColors[report.severity] || 0x888888,
        fields: [
            { name: 'Game', value: report.game, inline: true },
            { name: 'Severity', value: report.severity, inline: true },
            ...(report.server ? [{ name: 'Server', value: report.server, inline: true }] : []),
        ],
        url: reportUrl,
        timestamp: new Date().toISOString(),
        footer: {
            text: 'GrieferHub',
        },
    }

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'GrieferHub',
                embeds: [embed],
            }),
        })

        if (!res.ok) {
            console.error(`Discord webhook failed: ${res.status} ${res.statusText}`)
        }
    } catch (error) {
        console.error('Discord webhook delivery error:', error)
    }
}
