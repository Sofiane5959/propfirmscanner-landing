import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client-side Supabase client (for use in client components)
export const createClient = () => createClientComponentClient();

// Database types (extend as needed)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          prop_firm_slug: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          prop_firm_slug: string;
        };
        Delete: {
          id: string;
        };
      };
      user_accounts: {
        Row: {
          id: string;
          user_id: string;
          prop_firm: string;
          account_size: number;
          account_type: string;
          start_date: string;
          status: 'active' | 'passed' | 'failed' | 'payout';
          current_balance: number;
          profit_target: number;
          max_daily_loss: number;
          max_total_loss: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          prop_firm: string;
          account_size: number;
          account_type: string;
          start_date?: string;
          status?: 'active' | 'passed' | 'failed' | 'payout';
          current_balance?: number;
          profit_target?: number;
          max_daily_loss?: number;
          max_total_loss?: number;
        };
        Update: {
          status?: 'active' | 'passed' | 'failed' | 'payout';
          current_balance?: number;
          updated_at?: string;
        };
      };
    };
  };
};
