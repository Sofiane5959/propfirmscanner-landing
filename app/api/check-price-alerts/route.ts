import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint should be called by a CRON job (e.g., Vercel Cron, GitHub Actions)
// Recommended: Run every 6 hours

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Simple email sending via Resend (recommended) or other provider
// You'll need to set up RESEND_API_KEY in your environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY

interface PriceAlert {
  id: string
  email: string
  prop_firm_id: string
  target_price: number
  current_price_at_creation: number
  prop_firms: {
    name: string
    slug: string
    min_price: number
    affiliate_url: string
    website_url: string
    discount_code: string
    discount_percent: number
  }
}

async function sendAlertEmail(alert: PriceAlert) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set, skipping email for:', alert.email)
    return false
  }

  const firm = alert.prop_firms
  const savings = alert.current_price_at_creation - firm.min_price
  const firmUrl = firm.affiliate_url || firm.website_url

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #111827; margin: 0; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #1f2937; border-radius: 16px; overflow: hidden; border: 1px solid #374151;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Price Alert Triggered!</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
          <p style="color: #9ca3af; margin: 0 0 20px;">Great news! The price you were waiting for is here.</p>
          
          <!-- Firm Card -->
          <div style="background-color: #374151; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: white; margin: 0 0 10px; font-size: 20px;">${firm.name}</h2>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <div>
                <p style="color: #6b7280; font-size: 12px; margin: 0;">Your target</p>
                <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 5px 0;">$${alert.target_price}</p>
              </div>
              <div style="text-align: right;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">Current price</p>
                <p style="color: white; font-size: 24px; font-weight: bold; margin: 5px 0;">$${firm.min_price}</p>
              </div>
            </div>
            
            ${savings > 0 ? `
            <div style="background-color: #10b981; background: linear-gradient(135deg, #10b981, #059669); border-radius: 8px; padding: 10px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 14px;">You're saving <strong>$${savings}</strong> from when you set this alert!</p>
            </div>
            ` : ''}
          </div>
          
          ${firm.discount_code ? `
          <!-- Promo Code -->
          <div style="background-color: #fbbf24; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; padding: 15px; margin-bottom: 20px; text-align: center;">
            <p style="color: white; margin: 0 0 5px; font-size: 12px;">EXTRA ${firm.discount_percent}% OFF WITH CODE</p>
            <p style="color: white; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 2px;">${firm.discount_code}</p>
          </div>
          ` : ''}
          
          <!-- CTA Button -->
          <a href="${firmUrl}" style="display: block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 16px 24px; border-radius: 12px; text-align: center; font-weight: 600; font-size: 16px;">
            Claim This Deal →
          </a>
          
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
            This alert has been automatically deactivated. You can create new alerts anytime on PropFirmScanner.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #111827; padding: 20px; text-align: center; border-top: 1px solid #374151;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            <a href="https://www.propfirmscanner.org" style="color: #10b981; text-decoration: none;">PropFirmScanner</a> - Compare 80+ Prop Trading Firms
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PropFirmScanner <alerts@propfirmscanner.org>',
        to: alert.email,
        subject: `🔔 ${firm.name} just hit your target price of $${alert.target_price}!`,
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function GET(request: Request) {
  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Get all active alerts with firm data
    const { data: alerts, error: alertsError } = await supabase
      .from('price_alerts')
      .select(`
        id,
        email,
        prop_firm_id,
        target_price,
        current_price_at_creation,
        prop_firms (
          name,
          slug,
          min_price,
          affiliate_url,
          website_url,
          discount_code,
          discount_percent
        )
      `)
      .eq('is_active', true)
      .eq('is_triggered', false)

    if (alertsError) {
      throw alertsError
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ 
        message: 'No active alerts to check',
        checked: 0,
        triggered: 0 
      })
    }

    let triggeredCount = 0
    const triggeredIds: string[] = []

    // Check each alert
    for (const alert of alerts as unknown as PriceAlert[]) {
      const currentPrice = alert.prop_firms?.min_price

      // If current price is at or below target, trigger the alert
      if (currentPrice && currentPrice <= alert.target_price) {
        // Send email notification
        const emailSent = await sendAlertEmail(alert)

        if (emailSent) {
          triggeredIds.push(alert.id)
          triggeredCount++
        }
      }
    }

    // Mark triggered alerts as triggered
    if (triggeredIds.length > 0) {
      const { error: updateError } = await supabase
        .from('price_alerts')
        .update({
          is_triggered: true,
          is_active: false,
          triggered_at: new Date().toISOString(),
        })
        .in('id', triggeredIds)

      if (updateError) {
        console.error('Error updating alerts:', updateError)
      }
    }

    return NextResponse.json({
      message: 'Price alerts checked successfully',
      checked: alerts.length,
      triggered: triggeredCount,
      triggeredIds,
    })

  } catch (error) {
    console.error('Error checking price alerts:', error)
    return NextResponse.json(
      { error: 'Failed to check price alerts' },
      { status: 500 }
    )
  }
}

// Also allow POST for manual triggers
export async function POST(request: Request) {
  return GET(request)
}
