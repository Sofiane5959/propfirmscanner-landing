// app/[locale]/admin/analytics/AnalyticsClient.tsx
//
// CLIENT COMPONENT — interactive analytics dashboard.
// Authorization is already enforced by the parent server component
// (page.tsx) before this ever loads, so we do not re-check here.
//
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TrendingUp, ExternalLink, RefreshCw, ArrowLeft } from 'lucide-react'

// ============================================================
// AUTH NOTE
// ============================================================
// Server-side auth is enforced by middleware.ts at the project root.
// Non-admin requests are redirected before this page even loads,
// so we don't repeat the check here. Supabase RLS on affiliate_clicks
// is the second line of defense — even if a malicious user reached
// this page, the query would return zero rows.

// ============================================================
// TYPES
// ============================================================
interface ClickRow {
  firm_slug: string
  firm_name: string | null
  total_clicks: number
  clicks_24h: number
  clicks_7d: number
  clicks_30d: number
  affiliate_clicks: number
  website_clicks: number
  last_click_at: string | null
}

interface RecentClick {
  id: string
  firm_slug: string
  firm_name: string | null
  destination_type: string
  source: string | null
  locale: string | null
  country: string | null
  is_bot: boolean
  created_at: string
}

interface SourceRow {
  source: string
  count: number
}

// ============================================================
// HELPERS
// ============================================================
const formatRelative = (iso: string | null): string => {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

const flagFor = (country: string | null): string => {
  if (!country || country.length !== 2) return '🌐'
  const codePoints = country
    .toUpperCase()
    .split('')
    .map(c => 0x1f1a5 + c.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AnalyticsPage() {
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [byFirm, setByFirm] = useState<ClickRow[]>([])
  const [recent, setRecent] = useState<RecentClick[]>([])
  const [bySource, setBySource] = useState<SourceRow[]>([])
  const [includeBots, setIncludeBots] = useState(false)
  const [sortKey, setSortKey] = useState<keyof ClickRow>('clicks_30d')

  const fetchData = async () => {
    setRefreshing(true)

    const { data: clicksData, error: clicksError } = await supabase
      .from('affiliate_clicks')
      .select('firm_slug, firm_name, destination_type, is_bot, created_at')
      .order('created_at', { ascending: false })
      .limit(10000)

    if (clicksError) {
      console.error('Failed to load clicks:', clicksError)
      setLoading(false)
      setRefreshing(false)
      return
    }

    const filtered = (clicksData || []).filter(c => includeBots || !c.is_bot)

    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    const aggMap = new Map<string, ClickRow>()

    for (const c of filtered) {
      const key = c.firm_slug
      const existing = aggMap.get(key) || {
        firm_slug: key,
        firm_name: c.firm_name,
        total_clicks: 0,
        clicks_24h: 0,
        clicks_7d: 0,
        clicks_30d: 0,
        affiliate_clicks: 0,
        website_clicks: 0,
        last_click_at: null as string | null,
      }

      const ageMs = now - new Date(c.created_at).getTime()
      existing.total_clicks++
      if (ageMs <= day) existing.clicks_24h++
      if (ageMs <= 7 * day) existing.clicks_7d++
      if (ageMs <= 30 * day) existing.clicks_30d++
      if (c.destination_type === 'affiliate') existing.affiliate_clicks++
      else if (c.destination_type === 'website') existing.website_clicks++
      if (!existing.last_click_at || c.created_at > existing.last_click_at) {
        existing.last_click_at = c.created_at
      }

      aggMap.set(key, existing)
    }

    setByFirm(Array.from(aggMap.values()))

    const { data: recentData } = await supabase
      .from('affiliate_clicks')
      .select('id, firm_slug, firm_name, destination_type, source, locale, country, is_bot, created_at')
      .order('created_at', { ascending: false })
      .limit(30)
    setRecent(recentData || [])

    const { data: sourceData } = await supabase
      .from('affiliate_clicks')
      .select('source, is_bot')
      .gte('created_at', new Date(now - 30 * day).toISOString())
    if (sourceData) {
      const map = new Map<string, number>()
      for (const r of sourceData) {
        if (!includeBots && r.is_bot) continue
        const k = r.source || 'unknown'
        map.set(k, (map.get(k) || 0) + 1)
      }
      setBySource(
        Array.from(map.entries())
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count)
      )
    }

    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeBots])

  const sortedRows = useMemo(() => {
    return [...byFirm].sort((a, b) => {
      const av = a[sortKey] as number | string | null
      const bv = b[sortKey] as number | string | null
      if (av === null) return 1
      if (bv === null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return bv - av
      return String(bv).localeCompare(String(av))
    })
  }, [byFirm, sortKey])

  const totalClicks = byFirm.reduce((s, r) => s + r.total_clicks, 0)
  const totalAffiliate = byFirm.reduce((s, r) => s + r.affiliate_clicks, 0)
  const totalWebsite = byFirm.reduce((s, r) => s + r.website_clicks, 0)
  const total24h = byFirm.reduce((s, r) => s + r.clicks_24h, 0)
  const total7d = byFirm.reduce((s, r) => s + r.clicks_7d, 0)

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/en/admin/firms" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to admin
            </Link>
            <h1 className="text-2xl font-bold text-white">Affiliate Analytics</h1>
            <p className="text-sm text-gray-500">Click tracking on every affiliate / website link</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBots}
                onChange={e => setIncludeBots(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800"
              />
              Include bots
            </label>
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard label="Total clicks" value={totalClicks} />
          <StatCard label="Last 24h" value={total24h} highlight={total24h > 0} />
          <StatCard label="Last 7d" value={total7d} />
          <StatCard label="Affiliate clicks" value={totalAffiliate} sub={`${totalClicks > 0 ? Math.round((totalAffiliate / totalClicks) * 100) : 0}%`} />
          <StatCard label="Website clicks" value={totalWebsite} sub={`${totalClicks > 0 ? Math.round((totalWebsite / totalClicks) * 100) : 0}%`} />
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading analytics…</div>
        ) : byFirm.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 border border-gray-700/50 rounded-xl">
            <TrendingUp className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-1">No clicks tracked yet</p>
            <p className="text-gray-500 text-sm">
              Once visitors click on affiliate links, data will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Clicks by firm</h2>
                <span className="text-xs text-gray-500">{byFirm.length} firms tracked</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-700/50">
                      <th className="text-left px-4 py-2 font-medium">Firm</th>
                      <Th label="24h" sortKey="clicks_24h" current={sortKey} onClick={setSortKey} />
                      <Th label="7d" sortKey="clicks_7d" current={sortKey} onClick={setSortKey} />
                      <Th label="30d" sortKey="clicks_30d" current={sortKey} onClick={setSortKey} />
                      <Th label="Total" sortKey="total_clicks" current={sortKey} onClick={setSortKey} />
                      <Th label="Affiliate" sortKey="affiliate_clicks" current={sortKey} onClick={setSortKey} />
                      <Th label="Website" sortKey="website_clicks" current={sortKey} onClick={setSortKey} />
                      <th className="text-left px-4 py-2 font-medium">Last click</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map(row => (
                      <tr key={row.firm_slug} className="border-b border-gray-700/30 hover:bg-gray-800/30">
                        <td className="px-4 py-2.5">
                          <Link href={`/en/prop-firm/${row.firm_slug}`} className="text-white hover:text-emerald-400 inline-flex items-center gap-1">
                            {row.firm_name || row.firm_slug}
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          <span className={row.clicks_24h > 0 ? 'text-emerald-400 font-medium' : 'text-gray-600'}>
                            {row.clicks_24h}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-gray-300">{row.clicks_7d}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-gray-300">{row.clicks_30d}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-white font-medium">{row.total_clicks}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-emerald-400">{row.affiliate_clicks}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-gray-400">{row.website_clicks}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs">{formatRelative(row.last_click_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700/50">
                  <h2 className="text-sm font-semibold text-white">Clicks by source (last 30d)</h2>
                </div>
                <div className="p-2">
                  {bySource.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-6">No data</p>
                  ) : (
                    bySource.map(s => {
                      const max = Math.max(...bySource.map(b => b.count))
                      const pct = max > 0 ? (s.count / max) * 100 : 0
                      return (
                        <div key={s.source} className="px-2 py-1.5">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-300 font-mono">{s.source}</span>
                            <span className="text-gray-400 tabular-nums">{s.count}</span>
                          </div>
                          <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/70" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700/50">
                  <h2 className="text-sm font-semibold text-white">Recent activity</h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recent.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-6">No clicks yet</p>
                  ) : (
                    recent.map(r => (
                      <div key={r.id} className="px-4 py-2 border-b border-gray-700/30 text-xs flex items-center gap-2">
                        <span title={r.country || ''}>{flagFor(r.country)}</span>
                        <span className="text-gray-300 font-medium flex-1 truncate">
                          {r.firm_name || r.firm_slug}
                        </span>
                        <span className="text-gray-500">{r.source || '—'}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.destination_type === 'affiliate' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                          {r.destination_type}
                        </span>
                        {r.is_bot && <span className="px-1 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[10px]">bot</span>}
                        <span className="text-gray-500 text-[10px]">{formatRelative(r.created_at)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, highlight }: { label: string; value: number; sub?: string; highlight?: boolean }) {
  return (
    <div className={`bg-gray-800/50 border ${highlight ? 'border-emerald-500/40' : 'border-gray-700/50'} rounded-xl p-4`}>
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold tabular-nums ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
        {sub && <span className="text-xs text-gray-500">{sub}</span>}
      </div>
    </div>
  )
}

function Th({ label, sortKey, current, onClick }: { label: string; sortKey: keyof ClickRow; current: keyof ClickRow; onClick: (k: keyof ClickRow) => void }) {
  const active = current === sortKey
  return (
    <th
      onClick={() => onClick(sortKey)}
      className={`text-right px-4 py-2 font-medium cursor-pointer select-none ${active ? 'text-emerald-400' : 'hover:text-white'}`}
    >
      {label}{active && ' ↓'}
    </th>
  )
}
