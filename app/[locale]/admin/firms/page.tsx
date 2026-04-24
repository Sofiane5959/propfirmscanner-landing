'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  scanned: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  unverified: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  not_recommended: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function AdminFirmsPage() {
  const [firms, setFirms] = useState<PropFirm[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => { fetchFirms() }, [fetchFirms])

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
    const { error } = await supabase
      .from('prop_firms')
      .update(editData)
      .eq('slug', editingSlug)
    if (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` })
    } else {
      setMessage({ type: 'success', text: `✓ ${editData.name} saved!` })
      await fetchFirms()
      setEditingSlug(null)
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const quickToggle = async (slug: string, field: keyof PropFirm, value: boolean | string) => {
    const { error } = await supabase
      .from('prop_firms')
      .update({ [field]: value })
      .eq('slug', slug)
    if (!error) {
      setFirms(prev => prev.map(f => f.slug === slug ? { ...f, [field]: value } : f))
      setMessage({ type: 'success', text: '✓ Updated' })
      setTimeout(() => setMessage(null), 2000)
    }
  }

  const stats = {
    total: firms.length,
    listed: firms.filter(f => f.listing_status === 'listed').length,
    withAffiliate: firms.filter(f => f.affiliate_url).length,
    withLogo: firms.filter(f => f.logo_url).length,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">PropFirmScanner — Admin</h1>
            <p className="text-gray-400 text-sm">Manage & audit all prop firms</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-emerald-400 font-bold text-lg">{stats.listed}</div>
              <div className="text-gray-500">Listed</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-lg">{stats.withAffiliate}</div>
              <div className="text-gray-500">Affiliate</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold text-lg">{stats.withLogo}</div>
              <div className="text-gray-500">With Logo</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">{stats.total}</div>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
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
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 w-64 focus:outline-none focus:border-emerald-500"
          />
          {(['all', 'listed', 'unlisted', 'no_affiliate', 'no_logo'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {f === 'all' ? `All (${firms.length})` :
               f === 'listed' ? `Listed (${stats.listed})` :
               f === 'unlisted' ? `Unlisted (${firms.length - stats.listed})` :
               f === 'no_affiliate' ? `No Affiliate (${firms.filter(f => !f.affiliate_url).length})` :
               `No Logo (${firms.filter(f => !f.logo_url).length})`}
            </button>
          ))}
          <span className="ml-auto text-gray-500 text-sm self-center">{filtered.length} firms</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(firm => (
              <div key={firm.slug} className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${
                editingSlug === firm.slug ? 'border-emerald-500/50' : 'border-gray-800 hover:border-gray-700'
              }`}>
                {/* Firm row */}
                <div className="flex items-center gap-4 px-4 py-3">
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                    {firm.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={firm.logo_url} alt={firm.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-sm font-bold text-emerald-600">{firm.name.charAt(0)}</span>
                    )}
                  </div>

                  {/* Name + slug */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{firm.name}</div>
                    <div className="text-gray-500 text-xs">{firm.slug}</div>
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[firm.trust_status] || STATUS_COLORS.unverified}`}>
                      {firm.trust_status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                      firm.listing_status === 'listed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-gray-700 text-gray-400 border-gray-600'
                    }`}>
                      {firm.listing_status}
                    </span>
                  </div>

                  {/* Quick data */}
                  <div className="hidden lg:flex items-center gap-4 text-sm flex-shrink-0">
                    <span className="text-white">${firm.min_price || '—'}</span>
                    <span className="text-emerald-400">{firm.max_profit_split ? `${firm.max_profit_split}%` : '—'}</span>
                    <span className="text-yellow-400">{firm.trustpilot_rating?.toFixed(1) || '—'}</span>
                    <span className={`text-xs ${firm.affiliate_url ? 'text-emerald-400' : 'text-gray-600'}`}>
                      {firm.affiliate_url ? '🔗 aff' : '— aff'}
                    </span>
                  </div>

                  {/* Quick toggles */}
                  <div className="hidden xl:flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => quickToggle(firm.slug, 'listing_status', firm.listing_status === 'listed' ? 'unlisted' : 'listed')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        firm.listing_status === 'listed'
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-red-500/20 hover:text-red-400'
                          : 'bg-gray-700 text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400'
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
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
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
                      className="text-gray-500 hover:text-white text-xs flex-shrink-0"
                    >
                      ↗
                    </a>
                  )}
                </div>

                {/* Edit panel */}
                {editingSlug === firm.slug && (
                  <div className="border-t border-gray-800 bg-gray-950 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Basic Info */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Basic Info</h4>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Name</label>
                          <input value={editData.name || ''} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Website URL</label>
                          <input value={editData.website_url || ''} onChange={e => setEditData(p => ({ ...p, website_url: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Logo URL</label>
                          <input value={editData.logo_url || ''} onChange={e => setEditData(p => ({ ...p, logo_url: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Country</label>
                          <input value={editData.country || ''} onChange={e => setEditData(p => ({ ...p, country: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="AE, GB, US..." />
                        </div>
                      </div>

                      {/* Affiliate & Deals */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Affiliate & Deals</h4>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Affiliate URL 🔗</label>
                          <input value={editData.affiliate_url || ''} onChange={e => setEditData(p => ({ ...p, affiliate_url: e.target.value }))}
                            className="w-full bg-gray-800 border border-emerald-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Discount Code</label>
                          <input value={editData.discount_code || ''} onChange={e => setEditData(p => ({ ...p, discount_code: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="CODE20" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Discount %</label>
                          <input type="number" value={editData.discount_percent || ''} onChange={e => setEditData(p => ({ ...p, discount_percent: Number(e.target.value) }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="20" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Min Price $</label>
                            <input type="number" value={editData.min_price || ''} onChange={e => setEditData(p => ({ ...p, min_price: Number(e.target.value) }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Max Split %</label>
                            <input type="number" value={editData.max_profit_split || ''} onChange={e => setEditData(p => ({ ...p, max_profit_split: Number(e.target.value) }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                          </div>
                        </div>
                      </div>

                      {/* Status & Trading Rules */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status & Rules</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Trust Status</label>
                            <select value={editData.trust_status || ''} onChange={e => setEditData(p => ({ ...p, trust_status: e.target.value }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                              <option value="scanned">scanned</option>
                              <option value="unverified">unverified</option>
                              <option value="not_recommended">not_recommended</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Listing</label>
                            <select value={editData.listing_status || ''} onChange={e => setEditData(p => ({ ...p, listing_status: e.target.value }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                              <option value="listed">listed</option>
                              <option value="unlisted">unlisted</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">TP Rating</label>
                            <input type="number" step="0.1" max="5" value={editData.trustpilot_rating || ''} onChange={e => setEditData(p => ({ ...p, trustpilot_rating: Number(e.target.value) }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">TP Reviews</label>
                            <input type="number" value={editData.trustpilot_reviews || ''} onChange={e => setEditData(p => ({ ...p, trustpilot_reviews: Number(e.target.value) }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
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
                              <span className="text-xs text-gray-400">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Save button */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
                      <button onClick={cancelEdit} className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm hover:text-white transition-all">
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50"
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
