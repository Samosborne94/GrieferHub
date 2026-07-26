#!/usr/bin/env node
/**
 * Seed the Reports table with Steam accounts that have confirmed bans.
 *
 * Steam does not expose "all players banned in game X" — bans can only be
 * verified per-SteamID via ISteamUser/GetPlayerBans, and a game ban is not
 * attributable to a specific title through the API. Candidates therefore come
 * from a CSV you curate (community cheater lists, your own reports), and only
 * accounts whose ban the Steam API confirms are imported. The source URL is
 * kept on every record so the claim stays auditable.
 *
 * Usage:
 *   STEAM_API_KEY=... AIRTABLE_API_KEY=... AIRTABLE_BASE_ID=... \
 *   node scripts/import-steam-bans.mjs --file scripts/steam-seeds/arc-raiders.csv [options]
 *
 * CSV columns: steamid64,source_url,notes   (header row required)
 * steamid64 may also be a vanity name — it will be resolved via the API.
 *
 * Options:
 *   --file <path>       candidate CSV (required)
 *   --game <name>       game name for the report (default: "ARC Raiders")
 *   --status <status>   Verified | Under Review  (default: Verified)
 *   --severity <sev>    Low | Medium | High | Critical (default: High)
 *   --include-vac       also import VAC-only bans (default: game bans only)
 *   --dry-run           resolve and verify, print what would be created
 */

const STEAM_API = 'https://api.steampowered.com'
const args = process.argv.slice(2)

function flag(name) {
    return args.includes(`--${name}`)
}
function opt(name, fallback) {
    const i = args.indexOf(`--${name}`)
    return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const FILE = opt('file')
const GAME = opt('game', 'ARC Raiders')
const STATUS = opt('status', 'Verified')
const SEVERITY = opt('severity', 'High')
const INCLUDE_VAC = flag('include-vac')
const DRY_RUN = flag('dry-run')

const { STEAM_API_KEY, AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env

if (!FILE) fail('Missing --file <path to candidate csv>')
if (!STEAM_API_KEY) fail('STEAM_API_KEY is not set (get one at https://steamcommunity.com/dev/apikey)')
if (!DRY_RUN && (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID)) {
    fail('AIRTABLE_API_KEY / AIRTABLE_BASE_ID are not set')
}

function fail(msg) {
    console.error(`✗ ${msg}`)
    process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getJson(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url.replace(STEAM_API_KEY, '***')}`)
    return res.json()
}

async function readCandidates(path) {
    const { readFile } = await import('node:fs/promises')
    const text = await readFile(path, 'utf8')
    const [header, ...lines] = text.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#'))
    const cols = header.split(',').map((c) => c.trim().toLowerCase())
    const idCol = cols.indexOf('steamid64')
    if (idCol === -1) fail(`CSV header must contain a "steamid64" column (got: ${header})`)
    return lines.map((line) => {
        const parts = line.split(',')
        return {
            id: (parts[idCol] || '').trim(),
            sourceUrl: (parts[cols.indexOf('source_url')] || '').trim(),
            notes: (parts[cols.indexOf('notes')] || '').trim(),
        }
    }).filter((c) => c.id)
}

async function resolveVanity(name) {
    const data = await getJson(
        `${STEAM_API}/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${encodeURIComponent(name)}`
    )
    return data.response?.success === 1 ? data.response.steamid : null
}

function chunk(arr, size) {
    const out = []
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
    return out
}

async function main() {
    const candidates = await readCandidates(FILE)
    console.log(`Read ${candidates.length} candidate(s) from ${FILE}`)

    // Resolve vanity names → steamid64
    for (const c of candidates) {
        if (!/^\d{17}$/.test(c.id)) {
            const resolved = await resolveVanity(c.id)
            if (!resolved) {
                console.warn(`  ! could not resolve vanity name "${c.id}" — skipping`)
                c.skip = true
            } else {
                console.log(`  resolved ${c.id} → ${resolved}`)
                c.id = resolved
            }
            await sleep(250)
        }
    }
    const resolved = candidates.filter((c) => !c.skip)
    const byId = new Map(resolved.map((c) => [c.id, c]))

    // Verify bans + fetch display names, 100 ids per call
    const banned = []
    for (const ids of chunk([...byId.keys()], 100)) {
        const idParam = ids.join(',')
        const [bans, summaries] = await Promise.all([
            getJson(`${STEAM_API}/ISteamUser/GetPlayerBans/v1/?key=${STEAM_API_KEY}&steamids=${idParam}`),
            getJson(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${idParam}`),
        ])
        const names = new Map((summaries.response?.players || []).map((p) => [p.steamid, p.personaname]))
        for (const p of bans.players || []) {
            const hasGameBan = p.NumberOfGameBans > 0
            const qualifies = hasGameBan || (INCLUDE_VAC && p.VACBanned)
            if (!qualifies) continue
            banned.push({
                ...byId.get(p.SteamId),
                steamId: p.SteamId,
                name: names.get(p.SteamId) || p.SteamId,
                gameBans: p.NumberOfGameBans,
                vacBanned: p.VACBanned,
                daysSinceLastBan: p.DaysSinceLastBan,
            })
        }
        await sleep(500)
    }

    console.log(`\n${banned.length} of ${resolved.length} candidate(s) have a confirmed ban on record`)
    if (!banned.length) return

    const records = banned.map((b) => ({
        fields: {
            griefer_name: b.name,
            game: GAME,
            description: [
                `Steam-confirmed ban. SteamID64: ${b.steamId}.`,
                `Game bans on record: ${b.gameBans}. VAC banned: ${b.vacBanned ? 'yes' : 'no'}.`,
                `Days since last ban: ${b.daysSinceLastBan}.`,
                'Note: Steam does not attribute game bans to a specific title; game attribution is based on the community source below.',
                b.sourceUrl ? `Source: ${b.sourceUrl}` : null,
                b.notes ? `Notes: ${b.notes}` : null,
            ].filter(Boolean).join(' '),
            evidence_url: `https://steamcommunity.com/profiles/${b.steamId}`,
            severity: SEVERITY,
            status: STATUS,
            tags: ['steam-ban', 'auto-import'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    }))

    if (DRY_RUN) {
        console.log('\n--dry-run: records that would be created:\n')
        for (const r of records) console.log(`  • ${r.fields.griefer_name} — ${r.fields.evidence_url}`)
        return
    }

    // Dedupe against existing imports (SteamID64 is stamped into description)
    const existing = new Set()
    let offset = ''
    do {
        const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Reports`)
        url.searchParams.set('filterByFormula', `FIND('SteamID64:', {description})`)
        url.searchParams.set('fields[]', 'description')
        if (offset) url.searchParams.set('offset', offset)
        const res = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } })
        if (!res.ok) fail(`Airtable query failed: ${res.status} ${await res.text()}`)
        const data = await res.json()
        for (const rec of data.records || []) {
            const m = /SteamID64: (\d{17})/.exec(rec.fields?.description || '')
            if (m) existing.add(m[1])
        }
        offset = data.offset || ''
    } while (offset)

    const fresh = records.filter((r) => !existing.has(/SteamID64: (\d{17})/.exec(r.fields.description)[1]))
    console.log(`${records.length - fresh.length} already imported, creating ${fresh.length} new record(s)`)

    for (const batch of chunk(fresh, 10)) {
        const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Reports`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ records: batch, typecast: true }),
        })
        if (!res.ok) fail(`Airtable create failed: ${res.status} ${await res.text()}`)
        const data = await res.json()
        console.log(`  ✓ created ${data.records.length} record(s)`)
        await sleep(300)
    }

    console.log('\nDone.')
}

main().catch((err) => fail(err.message))
