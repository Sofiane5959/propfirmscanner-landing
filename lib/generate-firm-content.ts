// lib/generate-firm-content.ts

interface GeneratedContent {
  verdict: string
  pros: string[]
  cons: string[]
  bestFor: string[]
  avoidIf: string[]
  riskLevel: 'strict' | 'medium' | 'flexible'
  tradingStyle: string[]
  highlight: string
}

function getRiskLevel(firm: any): 'strict' | 'medium' | 'flexible' {
  const dailyDD = firm.max_daily_drawdown || 5
  const totalDD = firm.max_total_drawdown || 10
  const profitTarget = firm.profit_target_phase1 || 8
  
  let score = 0
  if (dailyDD <= 4) score += 2
  else if (dailyDD <= 5) score += 1
  if (totalDD <= 8) score += 2
  else if (totalDD <= 10) score += 1
  if (profitTarget >= 10) score += 2
  else if (profitTarget >= 8) score += 1
  if (!firm.allows_news_trading) score += 1
  if (!firm.allows_scalping) score += 1
  
  if (score >= 5) return 'strict'
  if (score >= 3) return 'medium'
  return 'flexible'
}

function getTradingStyles(firm: any): string[] {
  const styles: string[] = []
  if (firm.allows_scalping && (firm.max_daily_drawdown || 5) >= 5) styles.push('Scalpers')
  if (firm.allows_weekend_holding) styles.push('Swing Traders')
  if (firm.allows_news_trading) styles.push('News Traders')
  if (firm.allows_ea) styles.push('Algo Traders')
  if (styles.length === 0) styles.push('Day Traders')
  return styles
}

function getHighlight(firm: any): string {
  if ((firm.profit_split || 0) >= 90) return `its industry-leading ${firm.profit_split}% profit split`
  if ((firm.trustpilot_rating || 0) >= 4.7) return `its excellent ${firm.trustpilot_rating}/5 Trustpilot rating`
  if ((firm.min_price || 999) <= 50) return `its affordable entry price starting at just $${firm.min_price}`
  if (firm.account_sizes?.length > 0 && Math.max(...firm.account_sizes) >= 400000) return `its high max allocation`
  if (firm.allows_scalping && firm.allows_news_trading && firm.allows_ea) return 'its flexible trading rules'
  return 'competitive pricing and solid reputation'
}

function generatePros(firm: any): string[] {
  const pros: string[] = []
  if ((firm.profit_split || 0) >= 90) pros.push(`Excellent ${firm.profit_split}% profit split`)
  else if ((firm.profit_split || 0) >= 80) pros.push(`Good ${firm.profit_split}% profit split`)
  if ((firm.trustpilot_rating || 0) >= 4.5) pros.push(`Highly rated (${firm.trustpilot_rating}/5)`)
  if ((firm.min_price || 999) <= 50) pros.push(`Affordable ($${firm.min_price})`)
  else if ((firm.min_price || 999) <= 100) pros.push(`Reasonable price ($${firm.min_price})`)
  if ((firm.max_total_drawdown || 0) >= 10) pros.push(`${firm.max_total_drawdown}% max drawdown`)
  if ((firm.max_daily_drawdown || 0) >= 5) pros.push(`${firm.max_daily_drawdown}% daily limit`)
  if (firm.allows_scalping) pros.push('Scalping allowed')
  if (firm.allows_news_trading) pros.push('News trading allowed')
  if (firm.allows_ea) pros.push('EA/Bots allowed')
  if (firm.allows_weekend_holding) pros.push('Weekend holding allowed')
  if (firm.has_free_repeat) pros.push('Free retry available')
  return pros.slice(0, 8)
}

function generateCons(firm: any): string[] {
  const cons: string[] = []
  if ((firm.max_daily_drawdown || 5) <= 4) cons.push(`Strict ${firm.max_daily_drawdown}% daily limit`)
  if ((firm.max_total_drawdown || 10) <= 6) cons.push(`Tight ${firm.max_total_drawdown}% max drawdown`)
  if ((firm.profit_target_phase1 || 8) >= 10) cons.push(`High ${firm.profit_target_phase1}% profit target`)
  if ((firm.profit_split || 80) < 80) cons.push(`${firm.profit_split}% profit split`)
  if (!firm.allows_scalping) cons.push('No scalping')
  if (!firm.allows_news_trading) cons.push('News trading restricted')
  if (!firm.allows_ea) cons.push('No EA/Bots')
  if (!firm.allows_weekend_holding) cons.push('No weekend holding')
  if (cons.length === 0) cons.push('Standard rules apply')
  return cons.slice(0, 5)
}

function generateBestFor(firm: any): string[] {
  const bestFor: string[] = []
  if ((firm.min_price || 999) <= 100 && (firm.trustpilot_rating || 0) >= 4.0) bestFor.push('Beginners')
  if (firm.allows_scalping && (firm.max_daily_drawdown || 0) >= 5) bestFor.push('Scalpers')
  if (firm.allows_weekend_holding) bestFor.push('Swing traders')
  if (firm.allows_news_trading) bestFor.push('News traders')
  if (firm.allows_ea) bestFor.push('Algo traders')
  if ((firm.min_price || 999) <= 50) bestFor.push('Budget traders')
  return bestFor.slice(0, 4)
}

function generateAvoidIf(firm: any): string[] {
  const avoidIf: string[] = []
  if ((firm.max_daily_drawdown || 5) <= 4) avoidIf.push('Need more daily buffer')
  if (!firm.allows_scalping) avoidIf.push('Scalping is your strategy')
  if (!firm.allows_news_trading) avoidIf.push('Trade news events')
  if (!firm.allows_ea) avoidIf.push('Use automated systems')
  if (!firm.allows_weekend_holding) avoidIf.push('Hold over weekends')
  if ((firm.min_price || 0) >= 300) avoidIf.push('On tight budget')
  return avoidIf.slice(0, 4)
}

function generateVerdict(firm: any, riskLevel: string, tradingStyles: string[], highlight: string): string {
  const riskLabels: Record<string, string> = {
    'strict': 'a strict but reputable',
    'medium': 'a well-balanced',
    'flexible': 'a flexible and trader-friendly'
  }
  const riskLabel = riskLabels[riskLevel] || 'a solid'
  const stylesText = tradingStyles.slice(0, 2).join(' and ')
  
  let verdict = `${firm.name} is ${riskLabel} prop firm best suited for ${stylesText}. It stands out for ${highlight}.`
  if ((firm.trustpilot_rating || 0) >= 4.5) verdict += ` With a ${firm.trustpilot_rating}/5 rating, it's one of the most trusted firms.`
  return verdict
}

export function generateFirmContent(firm: any): GeneratedContent {
  const riskLevel = getRiskLevel(firm)
  const tradingStyles = getTradingStyles(firm)
  const highlight = getHighlight(firm)
  
  return {
    verdict: generateVerdict(firm, riskLevel, tradingStyles, highlight),
    pros: generatePros(firm),
    cons: generateCons(firm),
    bestFor: generateBestFor(firm),
    avoidIf: generateAvoidIf(firm),
    riskLevel,
    tradingStyle: tradingStyles,
    highlight
  }
}

export function findAlternatives(currentFirm: any, allFirms: any[]): any[] {
  const otherFirms = allFirms.filter(f => f.id !== currentFirm.id)
  const scored = otherFirms.map(firm => {
    let score = 0
    const priceDiff = Math.abs((firm.min_price || 100) - (currentFirm.min_price || 100))
    if (priceDiff <= 50) score += 3
    else if (priceDiff <= 100) score += 2
    if ((firm.trustpilot_rating || 0) > (currentFirm.trustpilot_rating || 0)) score += 2
    if ((firm.profit_split || 0) > (currentFirm.profit_split || 0)) score += 1
    if ((firm.trustpilot_rating || 0) >= 4.5) score += 2
    return { firm, score }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(s => s.firm)
}
