// Utility functions for formatting reviews and ratings
// Use these throughout the site for consistency

/**
 * Format review count for display
 * - 0 or null → "Not tracked"
 * - < 10 → "New" or "Few reviews"
 * - >= 10 → formatted number
 */
export function formatReviewCount(reviews: number | null | undefined): string {
  if (reviews === null || reviews === undefined || reviews === 0) {
    return 'Not tracked'
  }
  
  if (reviews < 10) {
    return 'Few reviews'
  }
  
  if (reviews >= 1000) {
    return `${(reviews / 1000).toFixed(1)}k`
  }
  
  return reviews.toLocaleString()
}

/**
 * Format rating for display
 * - null/undefined → "N/A"
 * - 0 → "N/A"
 * - otherwise → formatted with 1 decimal
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined || rating === 0) {
    return 'N/A'
  }
  
  return rating.toFixed(1)
}

/**
 * Get rating color class based on value
 */
export function getRatingColorClass(rating: number | null | undefined): string {
  if (rating === null || rating === undefined || rating === 0) {
    return 'text-gray-400'
  }
  
  if (rating >= 4.5) return 'text-emerald-400'
  if (rating >= 4.0) return 'text-green-400'
  if (rating >= 3.5) return 'text-yellow-400'
  if (rating >= 3.0) return 'text-orange-400'
  return 'text-red-400'
}

/**
 * Get rating background color class
 */
export function getRatingBgClass(rating: number | null | undefined): string {
  if (rating === null || rating === undefined || rating === 0) {
    return 'bg-gray-500/10'
  }
  
  if (rating >= 4.5) return 'bg-emerald-500/10'
  if (rating >= 4.0) return 'bg-green-500/10'
  if (rating >= 3.5) return 'bg-yellow-500/10'
  if (rating >= 3.0) return 'bg-orange-500/10'
  return 'bg-red-500/10'
}

/**
 * Check if we have enough data to display rating
 */
export function hasEnoughReviews(reviews: number | null | undefined, minReviews: number = 10): boolean {
  if (reviews === null || reviews === undefined) return false
  return reviews >= minReviews
}

/**
 * Format price for display
 * - null/undefined → "N/A"
 * - 0 → "Free"
 * - otherwise → $X,XXX
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return 'N/A'
  }
  
  if (price === 0) {
    return 'Free'
  }
  
  return `$${price.toLocaleString()}`
}

/**
 * Format profit split for display
 */
export function formatProfitSplit(split: number | null | undefined): string {
  if (split === null || split === undefined || split === 0) {
    return 'N/A'
  }
  
  return `${split}%`
}

/**
 * Format drawdown for display
 */
export function formatDrawdown(dd: number | null | undefined): string {
  if (dd === null || dd === undefined || dd === 0) {
    return 'N/A'
  }
  
  return `${dd}%`
}

/**
 * Get trust level based on rating and reviews
 */
export function getTrustLevel(
  rating: number | null | undefined,
  reviews: number | null | undefined
): 'high' | 'medium' | 'low' | 'unknown' {
  if (!rating || !reviews || reviews < 10) {
    return 'unknown'
  }
  
  if (rating >= 4.0 && reviews >= 100) {
    return 'high'
  }
  
  if (rating >= 3.5 && reviews >= 50) {
    return 'medium'
  }
  
  return 'low'
}

/**
 * Get trust level display text
 */
export function getTrustLevelText(level: 'high' | 'medium' | 'low' | 'unknown'): string {
  switch (level) {
    case 'high':
      return 'Highly Trusted'
    case 'medium':
      return 'Trusted'
    case 'low':
      return 'Limited Trust'
    case 'unknown':
      return 'Not enough data'
  }
}

/**
 * Get trust level color class
 */
export function getTrustLevelColorClass(level: 'high' | 'medium' | 'low' | 'unknown'): string {
  switch (level) {
    case 'high':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    case 'medium':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    case 'low':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    case 'unknown':
      return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
  }
}
