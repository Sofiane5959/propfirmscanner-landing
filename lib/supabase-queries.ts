import { supabase } from './supabase-client'
import type { PropFirm, Promotion } from '@/types'

// Fetch all prop firms
export async function getPropFirms() {
  const { data, error } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('is_active', true)
    .order('trustpilot_rating', { ascending: false })

  if (error) {
    console.error('Error fetching prop firms:', error)
    return []
  }

  return data as PropFirm[]
}

// Fetch featured prop firms
export async function getFeaturedPropFirms() {
  const { data, error } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('trustpilot_rating', { ascending: false })

  if (error) {
    console.error('Error fetching featured prop firms:', error)
    return []
  }

  return data as PropFirm[]
}

// Fetch single prop firm by slug
export async function getPropFirmBySlug(slug: string) {
  const { data, error } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching prop firm:', error)
    return null
  }

  return data as PropFirm
}

// Fetch all active promotions with prop firm info
export async function getPromotions() {
  const { data, error } = await supabase
    .from('promotions')
    .select(`
      *,
      prop_firms (
        id,
        name,
        slug,
        logo_url,
        website_url,
        min_price,
        trustpilot_rating
      )
    `)
    .eq('is_active', true)
    .gte('valid_until', new Date().toISOString())
    .order('discount_percent', { ascending: false })

  if (error) {
    console.error('Error fetching promotions:', error)
    return []
  }

  return data
}

// Fetch promotions for a specific prop firm
export async function getPromotionsByFirm(propFirmId: string) {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('prop_firm_id', propFirmId)
    .eq('is_active', true)
    .gte('valid_until', new Date().toISOString())

  if (error) {
    console.error('Error fetching promotions:', error)
    return []
  }

  return data as Promotion[]
}

// Filter prop firms
export async function filterPropFirms(filters: {
  maxPrice?: number
  challengeType?: string
  tradingStyle?: string
  platform?: string
  minProfitSplit?: number
}) {
  let query = supabase
    .from('prop_firms')
    .select('*')
    .eq('is_active', true)

  if (filters.maxPrice) {
    query = query.lte('min_price', filters.maxPrice)
  }

  if (filters.challengeType) {
    query = query.contains('challenge_types', [filters.challengeType])
  }

  if (filters.platform) {
    query = query.contains('platforms', [filters.platform])
  }

  if (filters.minProfitSplit) {
    query = query.gte('profit_split', filters.minProfitSplit)
  }

  // Trading style filters
  if (filters.tradingStyle === 'scalping') {
    query = query.eq('allows_scalping', true)
  } else if (filters.tradingStyle === 'swing') {
    query = query.eq('allows_weekend_holding', true)
  } else if (filters.tradingStyle === 'news') {
    query = query.eq('allows_news_trading', true)
  } else if (filters.tradingStyle === 'ea') {
    query = query.eq('allows_ea', true)
  }

  const { data, error } = await query.order('trustpilot_rating', { ascending: false })

  if (error) {
    console.error('Error filtering prop firms:', error)
    return []
  }

  return data as PropFirm[]
}

// Search prop firms
export async function searchPropFirms(searchTerm: string) {
  const { data, error } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('is_active', true)
    .ilike('name', `%${searchTerm}%`)
    .order('trustpilot_rating', { ascending: false })

  if (error) {
    console.error('Error searching prop firms:', error)
    return []
  }

  return data as PropFirm[]
}
