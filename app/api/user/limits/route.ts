import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering - fixes build error
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({
        tier: 'free',
        limits: {
          accounts: 3,
          alerts: 5,
          comparisons: 10,
        },
        usage: {
          accounts: 0,
          alerts: 0,
          comparisons: 0,
        }
      })
    }

    // Get user's subscription tier from profile or subscriptions table
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const tier = profile?.subscription_tier || 'free'

    // Define limits by tier
    const tierLimits = {
      free: { accounts: 3, alerts: 5, comparisons: 10 },
      pro: { accounts: 20, alerts: 50, comparisons: 100 },
      unlimited: { accounts: -1, alerts: -1, comparisons: -1 }, // -1 = unlimited
    }

    const limits = tierLimits[tier as keyof typeof tierLimits] || tierLimits.free

    // Get current usage (example - adjust table names as needed)
    const { count: accountsCount } = await supabase
      .from('user_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { count: alertsCount } = await supabase
      .from('price_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true)

    return NextResponse.json({
      tier,
      limits,
      usage: {
        accounts: accountsCount || 0,
        alerts: alertsCount || 0,
        comparisons: 0, // Could track this if needed
      }
    })
  } catch (error) {
    console.error('Limits API error:', error)
    return NextResponse.json({
      tier: 'free',
      limits: { accounts: 3, alerts: 5, comparisons: 10 },
      usage: { accounts: 0, alerts: 0, comparisons: 0 }
    })
  }
}
