export interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website_url: string | null
  affiliate_url: string | null
  min_price: number | null
  max_price: number | null
  challenge_types: string[] | null
  account_sizes: number[] | null
  profit_split: number | null
  profit_target_phase1: number | null
  profit_target_phase2: number | null
  max_daily_drawdown: number | null
  max_total_drawdown: number | null
  allows_scalping: boolean | null
  allows_news_trading: boolean | null
  allows_weekend_holding: boolean | null
  allows_hedging: boolean | null
  allows_ea: boolean | null
  min_trading_days: number | null
  max_trading_days: number | null
  platforms: string[] | null
  instruments: string[] | null
  trustpilot_rating: number | null
  trustpilot_reviews: number | null
  founded_year: number | null
  headquarters: string | null
  is_regulated: boolean | null
  regulation_details: string | null
  license_url: string | null
  payout_frequency: string | null
  payout_methods: string[] | null
  min_payout: number | null
  affiliate_commission: number | null
  description: string | null
  pros: string[] | null
  cons: string[] | null
  is_active: boolean | null
  is_featured: boolean | null
  current_promo_code: string | null
  current_promo_discount: number | null
  created_at: string
  updated_at: string
}

export interface Promotion {
  id: string
  prop_firm_id: string
  code: string
  discount_percent: number | null
  discount_amount: number | null
  description: string | null
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  created_at: string
  prop_firms?: PropFirm
}

export interface FilterOptions {
  maxPrice?: number
  challengeType?: string
  tradingStyle?: string
  platform?: string
  minProfitSplit?: number
  instruments?: string[]
  platforms?: string[]
  challengeTypes?: string[]
}

export interface UserFavorite {
  id: string
  user_id: string
  prop_firm_id: string
  created_at: string
  prop_firms?: PropFirm
}

export interface UserAlert {
  id: string
  user_id: string
  prop_firm_id: string
  alert_type: 'promo' | 'price_drop' | 'new_program'
  is_active: boolean
  created_at: string
  prop_firms?: PropFirm
}
