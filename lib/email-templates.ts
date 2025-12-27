// Email Templates for PropFirm Scanner
// Use these with your email service (SendGrid, Mailchimp, Resend, etc.)

// =====================================================
// BASE TEMPLATE
// =====================================================

export const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PropFirm Scanner</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #e5e7eb;
      background-color: #111827;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #10b981;
    }
    .content {
      background-color: #1f2937;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
    }
    h1 {
      color: #ffffff;
      font-size: 24px;
      margin-top: 0;
    }
    h2 {
      color: #ffffff;
      font-size: 20px;
    }
    p {
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 16px 0;
    }
    .button:hover {
      background-color: #059669;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .footer a {
      color: #10b981;
    }
    .divider {
      border-top: 1px solid #374151;
      margin: 24px 0;
    }
    .card {
      background-color: #111827;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }
    .highlight {
      color: #10b981;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PropFirm Scanner</div>
    </div>
    ${content}
    <div class="footer">
      <p>PropFirm Scanner - Compare 90+ Prop Trading Firms</p>
      <p>
        <a href="https://www.propfirmscanner.org">Website</a> • 
        <a href="https://www.propfirmscanner.org/unsubscribe">Unsubscribe</a>
      </p>
      <p>© ${new Date().getFullYear()} PropFirm Scanner. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

// =====================================================
// WELCOME EMAIL
// =====================================================

export interface WelcomeEmailProps {
  name?: string
}

export const welcomeEmail = ({ name }: WelcomeEmailProps = {}) => baseTemplate(`
  <div class="content">
    <h1>Welcome to PropFirm Scanner! 🎉</h1>
    <p>Hey${name ? ` ${name}` : ''},</p>
    <p>Thanks for subscribing! You're now part of a community of <span class="highlight">5,000+ traders</span> who are serious about finding the right prop firm.</p>
    
    <div class="divider"></div>
    
    <h2>Here's what you'll get:</h2>
    <div class="card">
      <p>✅ Weekly discount codes (save up to 80%)</p>
      <p>✅ New prop firm alerts</p>
      <p>✅ Price change notifications</p>
      <p>✅ Closure & issue warnings</p>
    </div>
    
    <div class="divider"></div>
    
    <h2>Get Started</h2>
    <p>Ready to find your perfect prop firm? Take our 30-second quiz:</p>
    <a href="https://www.propfirmscanner.org/quick-match" class="button">Find My Prop Firm →</a>
    
    <p>Or compare all 90+ firms:</p>
    <a href="https://www.propfirmscanner.org/compare" class="button" style="background-color: #374151;">Compare Firms</a>
  </div>
`)

// =====================================================
// WEEKLY DEALS EMAIL
// =====================================================

export interface Deal {
  firmName: string
  discount: string
  code: string
  expiresAt?: string
}

export interface WeeklyDealsEmailProps {
  deals: Deal[]
  weekNumber: number
}

export const weeklyDealsEmail = ({ deals, weekNumber }: WeeklyDealsEmailProps) => baseTemplate(`
  <div class="content">
    <h1>🔥 This Week's Best Deals (Week ${weekNumber})</h1>
    <p>Here are the hottest prop firm discounts this week:</p>
    
    ${deals.map(deal => `
      <div class="card">
        <h3 style="margin-top: 0; color: #ffffff;">${deal.firmName}</h3>
        <p style="font-size: 24px; color: #10b981; font-weight: bold; margin: 8px 0;">${deal.discount}</p>
        <p>Code: <code style="background: #374151; padding: 4px 8px; border-radius: 4px;">${deal.code}</code></p>
        ${deal.expiresAt ? `<p style="color: #f59e0b; font-size: 14px;">⏰ Expires: ${deal.expiresAt}</p>` : ''}
      </div>
    `).join('')}
    
    <a href="https://www.propfirmscanner.org/deals" class="button">View All Deals →</a>
  </div>
`)

// =====================================================
// NEW FIRM ALERT EMAIL
// =====================================================

export interface NewFirmEmailProps {
  firmName: string
  firmSlug: string
  highlights: string[]
}

export const newFirmEmail = ({ firmName, firmSlug, highlights }: NewFirmEmailProps) => baseTemplate(`
  <div class="content">
    <h1>🆕 New Prop Firm Added: ${firmName}</h1>
    <p>We've just added <span class="highlight">${firmName}</span> to our database. Here's what you need to know:</p>
    
    <div class="card">
      ${highlights.map(h => `<p>✓ ${h}</p>`).join('')}
    </div>
    
    <a href="https://www.propfirmscanner.org/prop-firm/${firmSlug}" class="button">View Full Details →</a>
    
    <div class="divider"></div>
    
    <p style="color: #6b7280; font-size: 14px;">
      We verify all data weekly. Last verified: ${new Date().toLocaleDateString()}
    </p>
  </div>
`)

// =====================================================
// STATUS ALERT EMAIL
// =====================================================

export interface StatusAlertEmailProps {
  firmName: string
  status: 'under-review' | 'warning' | 'closed'
  reason: string
  recommendation: string
}

export const statusAlertEmail = ({ firmName, status, reason, recommendation }: StatusAlertEmailProps) => {
  const statusColors = {
    'under-review': '#f59e0b',
    'warning': '#f97316',
    'closed': '#ef4444',
  }
  
  const statusLabels = {
    'under-review': 'Under Review',
    'warning': 'Warning',
    'closed': 'Closed',
  }

  return baseTemplate(`
    <div class="content">
      <h1 style="color: ${statusColors[status]};">⚠️ Status Alert: ${firmName}</h1>
      
      <div class="card" style="border-left: 4px solid ${statusColors[status]};">
        <p><strong>Status:</strong> <span style="color: ${statusColors[status]};">${statusLabels[status]}</span></p>
        <p><strong>Reason:</strong> ${reason}</p>
      </div>
      
      <h2>Our Recommendation</h2>
      <p>${recommendation}</p>
      
      <a href="https://www.propfirmscanner.org/status" class="button">View Status Page →</a>
      
      <div class="divider"></div>
      
      <p style="color: #6b7280; font-size: 14px;">
        This is an automated alert based on our monitoring. Always do your own research.
      </p>
    </div>
  `)
}

// =====================================================
// GUIDE DOWNLOAD EMAIL
// =====================================================

export interface GuideEmailProps {
  downloadUrl: string
}

export const guideEmail = ({ downloadUrl }: GuideEmailProps) => baseTemplate(`
  <div class="content">
    <h1>📚 Your Free Prop Firm Guide</h1>
    <p>Thanks for downloading our guide! Here's everything you need to know about prop trading firms.</p>
    
    <a href="${downloadUrl}" class="button">Download Guide (PDF) →</a>
    
    <div class="divider"></div>
    
    <h2>What's Inside:</h2>
    <div class="card">
      <p>📖 Complete guide to prop firm challenges</p>
      <p>💡 Tips to pass your evaluation</p>
      <p>⚠️ Common mistakes to avoid</p>
      <p>📊 Comparison of top firms</p>
      <p>🧮 Risk management strategies</p>
    </div>
    
    <div class="divider"></div>
    
    <h2>Next Steps</h2>
    <p>Ready to find your perfect prop firm?</p>
    <a href="https://www.propfirmscanner.org/quick-match" class="button" style="background-color: #374151;">Take the Quiz →</a>
  </div>
`)

// =====================================================
// HELPER: Generate plain text version
// =====================================================

export const stripHtml = (html: string): string => {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
