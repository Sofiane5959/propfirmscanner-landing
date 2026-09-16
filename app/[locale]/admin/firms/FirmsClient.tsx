// app/[locale]/admin/firms/FirmsClient.tsx
//
// CLIENT COMPONENT — interactive admin UI for editing prop firms.
// Authorization is enforced by the parent server component (page.tsx)
// before this ever renders, so we don't re-check here.

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const ADMIN_USER_ID = '6d573ff4-b6ac-481e-b024-d54e7977f96f'

const supabase = createClientComponentClient()

interface PropFirm {
  slug: string
  name: string
  logo_url: string | null
  website_url: string | null
  affiliate_url: string | null
  discount_code: string | null
  discount_percent: number | null
  min_price: number | null
  max_profit_split: number | null
  trustpilot_rating: number | null
  trustpilot_reviews: number | null
  trust_status: string
  listing_status: string
  allows_scalping: boolean | null
  allows_news_trading: boolean | null
  allows_ea: boolean | null
  has_instant_funding: boolean | null
  fee_refund: boolean | null
  is_futures: boolean | null
  country: string | null
}

const STATUS_COLORS: Record<string, string> = {
  scanned: 'bg-accent/10 text-accent border-accent/30',
  unverified: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  not_recommended: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function AdminFirmsPage() {
  const [firms, setFirms] = useState<PropFirm[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'listed' | 'unlisted' | 'no_affiliate' | 'no_logo'>('all')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<PropFirm>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchFirms = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('prop_firms')
      .select('*')
      .order('name')
    setFirms(data || [])
    setLoading(false)
  }, [])

  // Check auth first
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id === ADMIN_USER_ID) {
        setAuthorized(true)
        fetchFirms()
      }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [fetchFirms])

  const filtered = firms.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.slug.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (filter === 'listed') return f.listing_status === 'listed'
    if (filter === 'unlisted') return f.listing_status !== 'listed'
    if (filter === 'no_affiliate') return !f.affiliate_url
    if (filter === 'no_logo') return !f.logo_url
    return true
  })

  const startEdit = (firm: PropFirm) => {
    setEditingSlug(firm.slug)
    setEditData({ ...firm })
  }

  const cancelEdit = () => {
    setEditingSlug(null)
    setEditData({})
  }

  const saveEdit = async () => {
    if (!editingSlug) return
    setSaving(true)

    // Strip fields we never want to update:
    // - slug (PK, must stay stable — used by URLs and foreign keys)
    // Any other field is fine to pass through.
    const { slug: _droppedSlug, ...updatePayload } = editData

    const { data, error } = await supabase
      .from('prop_firms')
      .update(updatePayload)
      .eq('slug', editingSlug)
      .select() // CRITICAL: forces Supabase to return affected rows.
                // Without this, RLS blocks silently and no error is raised.

    if (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` })
    } else if (!data || data.length === 0) {
      // RLS policy blocked the write silently — 0 rows affected, no error.
      // This usually means: missing UPDATE policy, or user is not logged in
      // as the admin account.
      setMessage({
        type: 'error',
        text: '⚠ Nothing was saved — RLS blocked the update. Check you are logged in as admin.',
      })
    } else {
      setMessage({ type: 'success', text: `✓ ${editData.name} saved!` })
      await fetchFirms()
      setEditingSlug(null)
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 4000)
  }

  const quickToggle = async (slug: string, field: keyof PropFirm, value: boolean | string) => {
    const { data, error } = await supabase
      .from('prop_firms')
      .update({ [field]: value })
      .eq('slug', slug)
      .select() // CRITICAL: same reason as saveEdit — detect silent RLS blocks.

    if (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` })
      setTimeout(() => setMessage(null), 4000)
      return
    }
    if (!data || data.length === 0) {
      setMessage({
        type: 'error',
        text: '⚠ Update blocked by RLS — no rows changed.',
      })
      setTimeout(() => setMessage(null), 4000)
      return
    }
    setFirms(prev => prev.map(f => f.slug === slug ? { ...f, [field]: value } : f))
    setMessage({ type: 'success', text: '✓ Updated' })
    setTimeout(() => setMessage(null), 2000)
  }

  const stats = {
    total: firms.length,
    listed: firms.filter(f => f.listing_status === 'listed').length,
    withAffiliate: firms.filter(f => f.affiliate_url).length,
    withLogo: firms.filter(f => f.logo_url).length,
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-text-muted text-sm">Checking access...</div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-white font-bold text-xl mb-2">Access Denied</h1>
          <p className="text-text-muted text-sm">You must be signed in as an admin to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base text-white">
      {/* Header */}
      <div className="border-b border-border bg-bg-elevated px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">PropFirmScanner — Admin</h1>
            <p className="text-text-secondary text-sm">Manage & audit all prop firms</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-accent font-bold text-lg">{stats.listed}</div>
              <div className="text-text-muted">Listed</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-lg">{stats.withAffiliate}</div>
              <div className="text-text-muted">Affiliate</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold text-lg">{stats.withLogo}</div>
              <div className="text-text-muted">With Logo</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">{stats.total}</div>
              <div className="text-text-muted">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-accent-hover text-white' : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search firms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-dark-700 border border-border rounded-lg px-4 py-2 text-sm text-white placeholder-text-muted w-64 focus:outline-none focus:border-accent"
          />
          {(['all', 'listed', 'unlisted', 'no_affiliate', 'no_logo'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-accent-hover text-white'
                  : 'bg-dark-700 text-text-secondary hover:text-white border border-border'
              }`}
            >
              {f === 'all' ? `All (${firms.length})` :
               f === 'listed' ? `Listed (${stats.listed})` :
               f === 'unlisted' ? `Unlisted (${firms.length - stats.listed})` :
               f === 'no_affiliate' ? `No Affiliate (${firms.filter(f => !f.affiliate_url).length})` :
               `No Logo (${firms.filter(f => !f.logo_url).length})`}
            </button>
          ))}
          <span className="ml-auto text-text-muted text-sm self-center">{filtered.length} firms</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-text-muted">Loading...</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(firm => (
              <div key={firm.slug} className={`bg-bg-elevated border rounded-xl overflow-hidden transition-all ${
                editingSlug === firm.slug ? 'border-accent/50' : 'border-border hover:border-border-hover'
              }`}>
                {/* Firm row */}
                <div className="flex items-center gap-4 px-4 py-3">
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                    {firm.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={firm.logo_url} alt={firm.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-sm font-bold text-accent">{firm.name.charAt(0)}</span>
                    )}
                  </div>

                  {/* Name + slug */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{firm.name}</div>
                    <div className="text-text-muted text-xs">{firm.slug}</div>
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[firm.trust_status] || STATUS_COLORS.unverified}`}>
                      {firm.trust_status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                      firm.listing_status === 'listed'
                        ? 'bg-accent/10 text-accent border-accent/30'
                        : 'bg-dark-600 text-text-secondary border-border-hover'
                    }`}>
                      {firm.listing_status}
                    </span>
                  </div>

                  {/* Quick data */}
                  <div className="hidden lg:flex items-center gap-4 text-sm flex-shrink-0">
                    <span className="text-white">${firm.min_price || '—'}</span>
                    <span className="text-accent">{firm.max_profit_split ? `${firm.max_profit_split}%` : '—'}</span>
                    <span className="text-yellow-400">{firm.trustpilot_rating?.toFixed(1) || '—'}</span>
                    <span className={`text-xs ${firm.affiliate_url ? 'text-accent' : 'text-text-muted'}`}>
                      {firm.affiliate_url ? '🔗 aff' : '— aff'}
                    </span>
                  </div>

                  {/* Quick toggles */}
                  <div className="hidden xl:flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => quickToggle(firm.slug, 'listing_status', firm.listing_status === 'listed' ? 'unlisted' : 'listed')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        firm.listing_status === 'listed'
                          ? 'bg-accent/10 text-accent hover:bg-red-500/20 hover:text-red-400'
                          : 'bg-dark-600 text-text-secondary hover:bg-accent/20 hover:text-accent'
                      }`}
                    >
                      {firm.listing_status === 'listed' ? 'Unlist' : 'List'}
                    </button>
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => editingSlug === firm.slug ? cancelEdit() : startEdit(firm)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                      editingSlug === firm.slug
                        ? 'bg-dark-600 text-text-secondary'
                        : 'bg-dark-700 text-text-secondary hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    {editingSlug === firm.slug ? '✕ Cancel' : '✎ Edit'}
                  </button>

                  {/* Visit link */}
                  {firm.website_url && (
                    <a
                      href={firm.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-white text-xs flex-shrink-0"
                    >
                      ↗
                    </a>
                  )}
                </div>

                {/* Edit panel */}
                {editingSlug === firm.slug && (
                  <div className="border-t border-border bg-bg-base p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Basic Info */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Basic Info</h4>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">Name</label>
                          <input value={editData.name || ''} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
                            className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">Website URL</label>
                          <input value={editData.website_url || ''} onChange={e => setEditData(p => ({ ...p, website_url: e.target.value }))}
                            className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">Logo URL</label>
                          <input value={editData.logo_url || ''} onChange={e => setEditData(p => ({ ...p, logo_url: e.target.value }))}
                            className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">Country</label>
                          <input value={editData.country || ''} onChange={e => setEditData(p => ({ ...p, country: e.target.value }))}
                            className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" placeholder="AE, GB, US..." />
                        </div>
                      </div>

                      {/* Affiliate & Deals */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Affiliate & Deals</h4>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">Affiliate URL 🔗</label>
                          <input value={editData.affiliate_url || ''} onChange={e => setEditData(p => ({ ...p, affiliate_url: e.target.value }))}
                            className="w-full bg-dark-700 border border-emerald-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">Discount Code</label>
                          <input value={editData.discount_code || ''} onChange={e => setEditData(p => ({ ...p, discount_code: e.target.value }))}
                            className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" placeholder="CODE20" />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">Discount %</label>
                          <input type="number" value={editData.discount_percent || ''} onChange={e => setEditData(p => ({ ...p, discount_percent: Number(e.target.value) }))}
                            className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" placeholder="20" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-text-muted mb-1 block">Min Price $</label>
                            <input type="number" value={editData.min_price || ''} onChange={e => setEditData(p => ({ ...p, min_price: Number(e.target.value) }))}
                              className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                          </div>
                          <div>
                            <label className="text-xs text-text-muted mb-1 block">Max Split %</label>
                            <input type="number" value={editData.max_profit_split || ''} onChange={e => setEditData(p => ({ ...p, max_profit_split: Number(e.target.value) }))}
                              className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                          </div>
                        </div>
                      </div>

                      {/* Status & Trading Rules */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Status & Rules</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-text-muted mb-1 block">Trust Status</label>
                            <select value={editData.trust_status || ''} onChange={e => setEditData(p => ({ ...p, trust_status: e.target.value }))}
                              className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent">
                              <option value="scanned">scanned</option>
                              <option value="unverified">unverified</option>
                              <option value="not_recommended">not_recommended</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-text-muted mb-1 block">Listing</label>
                            <select value={editData.listing_status || ''} onChange={e => setEditData(p => ({ ...p, listing_status: e.target.value }))}
                              className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent">
                              <option value="listed">listed</option>
                              <option value="unlisted">unlisted</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-text-muted mb-1 block">TP Rating</label>
                            <input type="number" step="0.1" max="5" value={editData.trustpilot_rating || ''} onChange={e => setEditData(p => ({ ...p, trustpilot_rating: Number(e.target.value) }))}
                              className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                          </div>
                          <div>
                            <label className="text-xs text-text-muted mb-1 block">TP Reviews</label>
                            <input type="number" value={editData.trustpilot_reviews || ''} onChange={e => setEditData(p => ({ ...p, trustpilot_reviews: Number(e.target.value) }))}
                              className="w-full bg-dark-700 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {([
                            ['allows_scalping', 'Scalping'],
                            ['allows_news_trading', 'News Trading'],
                            ['allows_ea', 'EAs'],
                            ['has_instant_funding', 'Instant Funding'],
                            ['fee_refund', 'Fee Refund'],
                            ['is_futures', 'Futures'],
                          ] as [keyof PropFirm, string][]).map(([field, label]) => (
                            <label key={field} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!editData[field]}
                                onChange={e => setEditData(p => ({ ...p, [field]: e.target.checked }))}
                                className="w-4 h-4 rounded accent-emerald-500"
                              />
                              <span className="text-xs text-text-secondary">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Save button */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                      <button onClick={cancelEdit} className="px-4 py-2 bg-dark-700 text-text-secondary rounded-lg text-sm hover:text-white transition-all">
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="px-6 py-2 bg-accent-hover hover:brightness-110 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : '✓ Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
