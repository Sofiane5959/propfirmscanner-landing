// PropFirm type matching Supabase schema
export interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website_url: string | null
  min_price: number | null
  max_price: number | null
  challenge_types: string[]
  account_sizes: number[]
  profit_split: number | null
  profit_target_phase1: number | null
  profit_target_phase2: number | null
  max_daily_drawdown: number | null
  max_total_drawdown: number | null
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_weekend_holding: boolean
  allows_hedging: boolean
  allows_ea: boolean
  min_trading_days: number
  max_trading_days: number | null
  platforms: string[]
  instruments: string[]
  trustpilot_rating: number | null
  trustpilot_reviews: number | null
  founded_year: number | null
  headquarters: string | null
  is_regulated: boolean
  regulation_details: string | null
  payout_frequency: string | null
  payout_methods: string[]
  min_payout: number
  affiliate_url: string | null
  affiliate_commission: number | null
  description: string | null
  pros: string[]
  cons: string[]
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

// Promotion type matching Supabase schema
export interface Promotion {
  id: string
  prop_firm_id: string
  code: string
  discount_percent: number | null
  discount_amount: number | null
  description: string | null
  valid_from: string
  valid_until: string | null
  is_active: boolean
  created_at: string
  // Joined data
  prop_firms?: {
    id: string
    name: string
    slug: string
    logo_url: string | null
    website_url: string | null
    min_price: number | null
    trustpilot_rating: number | null
  }
}

// User Favorite type
export interface UserFavorite {
  id: string
  user_id: string
  prop_firm_id: string
  created_at: string
}

// User Alert type
export interface UserAlert {
  id: string
  user_id: string
  prop_firm_id: string
  alert_type: 'promo' | 'price_drop' | 'new_program'
  is_active: boolean
  created_at: string
}

// Filter options for the compare page
export interface FilterOptions {
  maxPrice?: number
  challengeType?: string
  tradingStyle?: string
  platform?: string
  minProfitSplit?: number
  sortBy?: 'rating' | 'price' | 'profit_split' | 'founded'
}
