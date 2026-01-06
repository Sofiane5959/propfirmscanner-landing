'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Copy, CheckCircle2, BadgeCheck, Tag, ExternalLink, ShieldCheck } from 'lucide-react'

// =====================================================
// TYPES
// =====================================================
interface PromoDeal {
  id: string
  name: string
  slug: string
  logo_url?: string
  discount_percent: number
  discount_code: string
  affiliate_url?: string
  website_url?: string
  trust_status?: string
}

interface PromoTickerProps {
  deals?: PromoDeal[]
}

// =====================================================
// VERIFIED DEALS - MANUALLY CURATED (Update when promos change)
// Last updated: January 2026
// =====================================================
const VERIFIED_DEALS: PromoDeal[] = [
  // ✅ VERIFIED: Earn2Trade - 50% OFF with code SCANNER-40
  { 
    id: 'earn2trade', 
    name: 'Earn2Trade', 
    slug: 'earn2trade', 
    discount_percent: 50, 
    discount_code: 'SCANNER-40', 
    trust_status: 'verified' 
  },
  // ✅ VERIFIED: Top One Futures - 40% OFF with code pfs (was 55%, now 40%)
  { 
    id: 'top-one-futures', 
    name: 'Top One Futures', 
    slug: 'top-one-futures', 
    discount_percent: 40, 
    discount_code: 'pfs', 
    trust_status: 'verified' 
  },
  // ✅ VERIFIED: FORFX - 10% OFF with code SCANNER10
  { 
    id: 'forfx', 
    name: 'FORFX', 
    slug: 'forfx', 
    discount_percent: 10, 
    discount_code: 'SCANNER10', 
    trust_status: 'verified' 
  },
  // Add more verified deals here...
]

// =====================================================
// COPY BUTTON COMPONENT
// =====================================================
const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      title={copied ? 'Copied!' : `Copy code: ${code}`}
      aria-label={copied ? 'Code copied' : `Copy promo code ${code}`}
    >
      {copied ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
      )}
    </button>
  )
}

// =====================================================
// DEAL PILL COMPONENT
// =====================================================
const DealPill = ({ deal }: { deal: PromoDeal }) => {
  const url = deal.affiliate_url || deal.website_url || `/prop-firm/${deal.slug}`
  
  return (
    <Link
      href={url}
      target={deal.affiliate_url || deal.website_url ? '_blank' : undefined}
      rel={deal.affiliate_url || deal.website_url ? 'noopener noreferrer' : undefined}
      className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 hover:border-emerald-500/30 rounded-full transition-all group"
    >
      {/* Logo */}
      {deal.logo_url ? (
        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5">
          <Image src={deal.logo_url} alt={deal.name} width={20} height={20} className="object-contain" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <span className="text-[10px] font-bold text-emerald-400">{deal.name.charAt(0)}</span>
        </div>
      )}
      
      {/* Name */}
      <span className="text-xs font-medium text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
        {deal.name}
      </span>
      
      {/* Verified Badge */}
      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
      
      {/* Discount Badge */}
      <span className="px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded">
        {deal.discount_percent}% OFF
      </span>
      
      {/* Code */}
      <code className="px-1.5 py-0.5 bg-gray-900 text-emerald-400 text-[10px] font-mono rounded">
        {deal.discount_code}
      </code>
      
      {/* Copy Button */}
      <CopyButton code={deal.discount_code} />
    </Link>
  )
}

// =====================================================
// MAIN PROMO TICKER COMPONENT
// =====================================================
export default function PromoTicker({ deals }: PromoTickerProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Use provided deals or verified fallback
  const activeDeals = deals && deals.length > 0 ? deals : VERIFIED_DEALS
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }
  
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsPaused(false)
  }
  
  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return
    const x = e.touches[0].pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }
  
  // Hide ticker if no deals
  if (activeDeals.length === 0) return null
  
  // Double the deals for seamless loop
  const duplicatedDeals = [...activeDeals, ...activeDeals]
  
  return (
    <div className="w-full bg-gray-900/95 border-b border-gray-800 backdrop-blur-sm sticky top-16 z-40">
      <div className="max-w-[100vw] overflow-hidden">
        <div className="flex items-center">
          {/* Trust Label */}
          <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-transparent border-r border-gray-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Verified Deals</span>
              <span className="text-[9px] text-gray-500 hidden sm:block">Scanned & Trusted</span>
            </div>
          </div>
          
          {/* Ticker Container */}
          <div
            ref={containerRef}
            className={`flex-1 overflow-hidden ${prefersReducedMotion ? 'overflow-x-auto' : ''}`}
            onMouseEnter={() => !prefersReducedMotion && setIsPaused(true)}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div
              className={`flex items-center gap-3 py-2 px-4 ${
                prefersReducedMotion ? '' : 'animate-ticker'
              }`}
              style={{
                animationPlayState: isPaused || prefersReducedMotion ? 'paused' : 'running',
              }}
            >
              {duplicatedDeals.map((deal, index) => (
                <DealPill key={`${deal.id}-${index}`} deal={deal} />
              ))}
            </div>
          </div>
          
          {/* View All Link */}
          <Link
            href="/compare?hasDiscount=true"
            className="flex-shrink-0 flex items-center gap-1 px-4 py-2 text-xs text-gray-400 hover:text-emerald-400 transition-colors border-l border-gray-800"
          >
            <span className="hidden sm:inline">All Deals</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker 25s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

// =====================================================
// SSR DATA FETCHER (use in layout.tsx)
// =====================================================
export async function getPromoDeals(supabase: any): Promise<PromoDeal[]> {
  try {
    const { data, error } = await supabase
      .from('prop_firms')
      .select('id, name, slug, logo_url, discount_percent, discount_code, affiliate_url, website_url, trust_status')
      .gt('discount_percent', 0)
      .not('discount_code', 'is', null)
      .eq('trust_status', 'verified') // Only show verified firms
      .order('discount_percent', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching promo deals:', err)
    return []
  }
}
