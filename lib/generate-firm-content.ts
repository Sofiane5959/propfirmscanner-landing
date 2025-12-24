// lib/generate-firm-content.ts
// Système de génération automatique de contenu basé sur les données

import type { PropFirm } from '@/types'

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

// Déterminer le niveau de risque
function getRiskLevel(firm: PropFirm): 'strict' | 'medium' | 'flexible' {
  const dailyDD = firm.max_daily_drawdown || 5
  const totalDD = firm.max_total_drawdown || 10
  const profitTarget = firm.profit_target_phase1 || 8
  
  // Score de difficulté (plus c'est haut, plus c'est strict)
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

// Déterminer les styles de trading compatibles
function getTradingStyles(firm: PropFirm): string[] {
  const styles: string[] = []
  
  if (firm.allows_scalping && (firm.max_daily_drawdown || 5) >= 5) {
    styles.push('Scalpers')
  }
  
  if (firm.allows_weekend_holding) {
    styles.push('Swing Traders')
  }
  
  if (firm.allows_news_trading) {
    styles.push('News Traders')
  }
  
  if (firm.allows_ea) {
    styles.push('Algo Traders')
  }
  
  // Default
  if (styles.length === 0) {
    styles.push('Day Traders')
  }
  
  return styles
}

// Déterminer le point fort principal
function getHighlight(firm: PropFirm): string {
  const highlights: { condition: boolean; text: string; priority: number }[] = [
    { 
      condition: (firm.profit_split || 0) >= 90, 
      text: `its industry-leading ${firm.profit_split}% profit split`,
      priority: 10
    },
    { 
      condition: (firm.trustpilot_rating || 0) >= 4.7, 
      text: `its excellent ${firm.trustpilot_rating}/5 Trustpilot rating`,
      priority: 9
    },
    { 
      condition: (firm.min_price || 999) <= 50, 
      text: `its affordable entry price starting at just $${firm.min_price}`,
      priority: 8
    },
    { 
      condition: firm.account_sizes && Math.max(...firm.account_sizes) >= 400000, 
      text: `its high max allocation up to $${(Math.max(...(firm.account_sizes || [0])) / 1000).toFixed(0)}K`,
      priority: 7
    },
    { 
      condition: firm.challenge_types?.some(t => t.toLowerCase().includes('instant')) || false, 
      text: 'its instant funding option for experienced traders',
      priority: 6
    },
    { 
      condition: firm.allows_scalping && firm.allows_news_trading && firm.allows_ea, 
      text: 'its flexible trading rules allowing most strategies',
      priority: 5
    },
    { 
      condition: (firm.platforms?.length || 0) >= 4, 
      text: `its wide platform support including ${firm.platforms?.slice(0, 3).join(', ')}`,
      priority: 4
    },
    { 
      condition: firm.has_free_repeat === true, 
      text: 'its free retry option if you fail the challenge',
      priority: 3
    },
  ]
  
  const validHighlights = highlights.filter(h => h.condition).sort((a, b) => b.priority - a.priority)
  
  return validHighlights.length > 0 
    ? validHighlights[0].text 
    : `competitive pricing and solid reputation`
}

// Générer les Pros
function generatePros(firm: PropFirm): string[] {
  const pros: string[] = []
  
  // Profit Split
  if ((firm.profit_split || 0) >= 90) {
    pros.push(`Excellent ${firm.profit_split}% profit split`)
  } else if ((firm.profit_split || 0) >= 80) {
    pros.push(`Good ${firm.profit_split}% profit split`)
  }
  
  // Rating
  if ((firm.trustpilot_rating || 0) >= 4.5) {
    pros.push(`Highly rated on Trustpilot (${firm.trustpilot_rating}/5)`)
  }
  
  // Price
  if ((firm.min_price || 999) <= 50) {
    pros.push(`Very affordable starting price ($${firm.min_price})`)
  } else if ((firm.min_price || 999) <= 100) {
    pros.push(`Reasonable entry price ($${firm.min_price})`)
  }
  
  // Max Allocation
  if (firm.account_sizes && Math.max(...firm.account_sizes) >= 400000) {
    pros.push(`High max allocation ($${(Math.max(...firm.account_sizes) / 1000).toFixed(0)}K)`)
  } else if (firm.account_sizes && Math.max(...firm.account_sizes) >= 200000) {
    pros.push(`Good max allocation ($${(Math.max(...firm.account_sizes) / 1000).toFixed(0)}K)`)
  }
  
  // Drawdown
  if ((firm.max_total_drawdown || 0) >= 12) {
    pros.push(`Generous ${firm.max_total_drawdown}% max drawdown`)
  } else if ((firm.max_total_drawdown || 0) >= 10) {
    pros.push(`Standard ${firm.max_total_drawdown}% max drawdown`)
  }
  
  // Daily Drawdown
  if ((firm.max_daily_drawdown || 0) >= 5) {
    pros.push(`Reasonable ${firm.max_daily_drawdown}% daily drawdown limit`)
  }
  
  // Trading Rules
  if (firm.allows_scalping) {
    pros.push('Scalping allowed')
  }
  if (firm.allows_news_trading) {
    pros.push('News trading allowed')
  }
  if (firm.allows_ea) {
    pros.push('EA/Bots allowed')
  }
  if (firm.allows_weekend_holding) {
    pros.push('Weekend holding allowed')
  }
  
  // Platforms
  if ((firm.platforms?.length || 0) >= 4) {
    pros.push(`Multiple platforms (${firm.platforms?.length} options)`)
  }
  
  // Free retry
  if (firm.has_free_repeat) {
    pros.push('Free retry on failed challenge')
  }
  
  // Instant funding
  if (firm.challenge_types?.some(t => t.toLowerCase().includes('instant'))) {
    pros.push('Instant funding option available')
  }
  
  // 1-step
  if (firm.challenge_types?.some(t => t.toLowerCase().includes('1-step'))) {
    pros.push('1-step evaluation available')
  }
  
  // Payout
  if (firm.payout_frequency?.toLowerCase().includes('daily') || firm.payout_frequency?.toLowerCase().includes('demand')) {
    pros.push(`Fast payouts (${firm.payout_frequency})`)
  } else if (firm.payout_frequency?.toLowerCase().includes('weekly')) {
    pros.push('Weekly payouts')
  }
  
  // Regulated
  if (firm.is_regulated) {
    pros.push('Regulated entity')
  }
  
  return pros.slice(0, 8) // Max 8 pros
}

// Générer les Cons
function generateCons(firm: PropFirm): string[] {
  const cons: string[] = []
  
  // Strict Daily Drawdown
  if ((firm.max_daily_drawdown || 5) <= 4) {
    cons.push(`Strict ${firm.max_daily_drawdown}% daily drawdown limit`)
  }
  
  // Strict Total Drawdown
  if ((firm.max_total_drawdown || 10) <= 6) {
    cons.push(`Tight ${firm.max_total_drawdown}% max drawdown`)
  }
  
  // High Profit Target
  if ((firm.profit_target_phase1 || 8) >= 10) {
    cons.push(`High ${firm.profit_target_phase1}% profit target`)
  }
  
  // Low Profit Split
  if ((firm.profit_split || 80) < 80) {
    cons.push(`Below average ${firm.profit_split}% profit split`)
  }
  
  // Trading Restrictions
  if (!firm.allows_scalping) {
    cons.push('No scalping allowed')
  }
  if (!firm.allows_news_trading) {
    cons.push('News trading restricted')
  }
  if (!firm.allows_ea) {
    cons.push('EA/Bots not allowed')
  }
  if (!firm.allows_weekend_holding) {
    cons.push('Must close positions before weekend')
  }
  
  // Expensive
  if ((firm.min_price || 0) >= 300) {
    cons.push(`Higher entry price ($${firm.min_price}+)`)
  }
  
  // Limited Platforms
  if ((firm.platforms?.length || 0) <= 2) {
    cons.push('Limited platform options')
  }
  
  // Min Trading Days
  if ((firm.min_trading_days || 0) >= 10) {
    cons.push(`Minimum ${firm.min_trading_days} trading days required`)
  }
  
  // Low Rating
  if ((firm.trustpilot_rating || 5) < 4.0) {
    cons.push(`Mixed reviews (${firm.trustpilot_rating}/5 on Trustpilot)`)
  }
  
  // Si pas de cons trouvés, ajouter un générique
  if (cons.length === 0) {
    cons.push('Standard industry rules apply')
  }
  
  return cons.slice(0, 5) // Max 5 cons
}

// Générer "Best For"
function generateBestFor(firm: PropFirm): string[] {
  const bestFor: string[] = []
  
  // Beginners
  if ((firm.min_price || 999) <= 100 && (firm.trustpilot_rating || 0) >= 4.0) {
    bestFor.push('Beginners looking for affordable entry')
  }
  
  // Scalpers
  if (firm.allows_scalping && (firm.max_daily_drawdown || 0) >= 5) {
    bestFor.push('Scalpers who need flexible rules')
  }
  
  // Swing traders
  if (firm.allows_weekend_holding) {
    bestFor.push('Swing traders holding positions overnight')
  }
  
  // News traders
  if (firm.allows_news_trading) {
    bestFor.push('News traders seeking volatility')
  }
  
  // Algo traders
  if (firm.allows_ea) {
    bestFor.push('Algo/EA traders running automated strategies')
  }
  
  // High capital seekers
  if (firm.account_sizes && Math.max(...firm.account_sizes) >= 300000) {
    bestFor.push('Traders seeking high capital allocation')
  }
  
  // Budget conscious
  if ((firm.min_price || 999) <= 50) {
    bestFor.push('Budget-conscious traders')
  }
  
  // Experienced traders (instant funding)
  if (firm.challenge_types?.some(t => t.toLowerCase().includes('instant'))) {
    bestFor.push('Experienced traders wanting instant funding')
  }
  
  // Futures traders
  if (firm.instruments?.some(i => i.toLowerCase().includes('futures') || i.toLowerCase().includes('indices'))) {
    bestFor.push('Futures and indices traders')
  }
  
  // Crypto traders
  if (firm.instruments?.some(i => i.toLowerCase().includes('crypto'))) {
    bestFor.push('Crypto traders')
  }
  
  return bestFor.slice(0, 4) // Max 4
}

// Générer "Avoid If"
function generateAvoidIf(firm: PropFirm): string[] {
  const avoidIf: string[] = []
  
  // Strict rules
  if ((firm.max_daily_drawdown || 5) <= 4) {
    avoidIf.push('You need more daily loss buffer')
  }
  
  if (!firm.allows_scalping) {
    avoidIf.push('Scalping is your primary strategy')
  }
  
  if (!firm.allows_news_trading) {
    avoidIf.push('You trade high-impact news events')
  }
  
  if (!firm.allows_ea) {
    avoidIf.push('You rely on automated trading systems')
  }
  
  if (!firm.allows_weekend_holding) {
    avoidIf.push('You hold positions over weekends')
  }
  
  if ((firm.profit_target_phase1 || 8) >= 10) {
    avoidIf.push('You prefer lower profit targets')
  }
  
  if ((firm.min_price || 0) >= 300) {
    avoidIf.push('You\'re on a tight budget')
  }
  
  if ((firm.min_trading_days || 0) >= 10) {
    avoidIf.push('You want to pass quickly')
  }
  
  return avoidIf.slice(0, 4) // Max 4
}

// Générer le verdict complet
function generateVerdict(firm: PropFirm, riskLevel: string, tradingStyles: string[], highlight: string): string {
  const riskLabels = {
    'strict': 'a strict but reputable',
    'medium': 'a well-balanced',
    'flexible': 'a flexible and trader-friendly'
  }
  
  const riskLabel = riskLabels[riskLevel as keyof typeof riskLabels] || 'a solid'
  const stylesText = tradingStyles.slice(0, 2).join(' and ')
  
  let verdict = `${firm.name} is ${riskLabel} prop firm best suited for ${stylesText}. `
  verdict += `It stands out for ${highlight}. `
  
  // Add rating mention if good
  if ((firm.trustpilot_rating || 0) >= 4.5) {
    verdict += `With a ${firm.trustpilot_rating}/5 Trustpilot rating, it's one of the most trusted firms in the industry.`
  } else if ((firm.trustpilot_rating || 0) >= 4.0) {
    verdict += `It maintains a solid ${firm.trustpilot_rating}/5 rating from traders.`
  }
  
  return verdict
}

// Fonction principale exportée
export function generateFirmContent(firm: PropFirm): GeneratedContent {
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

// Fonction pour trouver des alternatives
export function findAlternatives(currentFirm: PropFirm, allFirms: PropFirm[]): PropFirm[] {
  // Exclure la firm actuelle
  const otherFirms = allFirms.filter(f => f.id !== currentFirm.id)
  
  // Score de similarité
  const scored = otherFirms.map(firm => {
    let score = 0
    
    // Même gamme de prix
    const priceDiff = Math.abs((firm.min_price || 100) - (currentFirm.min_price || 100))
    if (priceDiff <= 50) score += 3
    else if (priceDiff <= 100) score += 2
    
    // Même type de marchés
    const commonMarkets = firm.instruments?.filter(i => currentFirm.instruments?.includes(i)) || []
    score += commonMarkets.length
    
    // Similaire mais meilleur rating = bonus
    if ((firm.trustpilot_rating || 0) > (currentFirm.trustpilot_rating || 0)) {
      score += 2
    }
    
    // Similaire mais meilleur profit split = bonus
    if ((firm.profit_split || 0) > (currentFirm.profit_split || 0)) {
      score += 1
    }
    
    // Bonus pour rating élevé en général
    if ((firm.trustpilot_rating || 0) >= 4.5) {
      score += 2
    }
    
    return { firm, score }
  })
  
  // Trier par score et prendre les 3 meilleurs
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.firm)
}
