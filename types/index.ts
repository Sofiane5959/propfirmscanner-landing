export interface PropFirm {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  website_url: string;
  
  // Pricing
  min_price: number;
  max_price: number;
  
  // Programs
  challenge_types: ('1-step' | '2-step' | 'instant-funding')[];
  account_sizes: number[];
  
  // Profit & Rules
  profit_split: number;
  profit_target_phase1: number;
  profit_target_phase2: number | null;
  max_daily_drawdown: number;
  max_total_drawdown: number;
  
  // Trading Rules
  allows_scalping: boolean;
  allows_news_trading: boolean;
  allows_weekend_holding: boolean;
  allows_hedging: boolean;
  min_trading_days: number;
  
  // Platforms
  platforms: string[];
  
  // Trust & Reviews
  trustpilot_score: number | null;
  trustpilot_reviews: number | null;
  year_founded: number;
  is_regulated: boolean;
  regulation_info: string | null;
  
  // Payout
  payout_methods: string[];
  min_payout: number;
  payout_frequency: string;
  
  // Affiliate
  affiliate_link: string;
  affiliate_commission: number | null;
  
  // Meta
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  prop_firm_id: string;
  code: string;
  discount_percent: number | null;
  discount_amount: number | null;
  description: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface UserAlert {
  id: string;
  user_id: string;
  prop_firm_id: string;
  alert_type: 'promo' | 'price_drop' | 'new_program';
  created_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  prop_firm_id: string;
  created_at: string;
}

export interface FilterState {
  priceRange: [number, number];
  challengeTypes: string[];
  tradingStyles: string[];
  platforms: string[];
  minProfitSplit: number;
  maxDrawdown: number;
  sortBy: 'price' | 'profit_split' | 'rating' | 'popularity';
  sortOrder: 'asc' | 'desc';
}
