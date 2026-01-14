'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Check,
  Minus,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trophy,
  Copy,
  CheckCircle2,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface PropFirm {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  website_url: string;
  affiliate_url?: string;
  trustpilot_rating: number;
  trustpilot_reviews: number;
  min_price: number;
  profit_split: number;
  max_profit_split: number;
  max_daily_drawdown: number;
  max_total_drawdown: number;
  profit_target_phase1: number;
  profit_target_phase2: number;
  min_trading_days: number;
  drawdown_type: string;
  payout_frequency: string;
  allows_scalping: boolean;
  allows_news_trading: boolean;
  allows_ea: boolean;
  allows_weekend_holding: boolean;
  has_instant_funding: boolean;
  fee_refund: boolean;
  platforms: string[];
  discount_code?: string;
  discount_percent?: number;
}

interface CompareModalProps {
  firms: PropFirm[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

// =============================================================================
// COMPARISON CATEGORIES
// =============================================================================

const COMPARISON_SECTIONS = [
  {
    title: 'Pricing & Payouts',
    rows: [
      { key: 'min_price', label: 'Starting Price', format: (v: number) => v ? `$${v}` : '—', better: 'lower' },
      { key: 'profit_split', label: 'Profit Split', format: (v: number) => v ? `${v}%` : '—', better: 'higher' },
      { key: 'max_profit_split', label: 'Max Profit Split', format: (v: number) => v ? `${v}%` : '—', better: 'higher' },
      { key: 'payout_frequency', label: 'Payout Frequency', format: (v: string) => v || '—' },
      { key: 'fee_refund', label: 'Fee Refundable', format: (v: boolean) => v, type: 'boolean' },
    ],
  },
  {
    title: 'Challenge Rules',
    rows: [
      { key: 'profit_target_phase1', label: 'Phase 1 Target', format: (v: number) => v ? `${v}%` : '—', better: 'lower' },
      { key: 'profit_target_phase2', label: 'Phase 2 Target', format: (v: number) => v ? `${v}%` : '—', better: 'lower' },
      { key: 'max_daily_drawdown', label: 'Daily Drawdown', format: (v: number) => v ? `${v}%` : '—', better: 'higher' },
      { key: 'max_total_drawdown', label: 'Total Drawdown', format: (v: number) => v ? `${v}%` : '—', better: 'higher' },
      { key: 'drawdown_type', label: 'Drawdown Type', format: (v: string) => v || '—' },
      { key: 'min_trading_days', label: 'Min Trading Days', format: (v: number) => v ? `${v} days` : 'None', better: 'lower' },
    ],
  },
  {
    title: 'Trading Permissions',
    rows: [
      { key: 'allows_scalping', label: 'Scalping', format: (v: boolean) => v, type: 'boolean' },
      { key: 'allows_news_trading', label: 'News Trading', format: (v: boolean) => v, type: 'boolean' },
      { key: 'allows_ea', label: 'EAs/Bots', format: (v: boolean) => v, type: 'boolean' },
      { key: 'allows_weekend_holding', label: 'Weekend Holding', format: (v: boolean) => v, type: 'boolean' },
      { key: 'has_instant_funding', label: 'Instant Funding', format: (v: boolean) => v, type: 'boolean' },
    ],
  },
  {
    title: 'Platforms',
    rows: [
      { key: 'platforms', label: 'Trading Platforms', format: (v: string[]) => v?.join(', ') || '—' },
    ],
  },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function BooleanValue({ value }: { value: boolean }) {
  return value ? (
    <span className="flex items-center gap-1 text-emerald-400">
      <Check className="w-4 h-4" /> Yes
    </span>
  ) : (
    <span className="flex items-center gap-1 text-red-400">
      <X className="w-4 h-4" /> No
    </span>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-mono rounded transition-colors"
    >
      {copied ? (
        <>
          <CheckCircle2 className="w-3 h-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          {code}
        </>
      )}
    </button>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CompareModal({ firms, onClose, onRemove }: CompareModalProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    COMPARISON_SECTIONS.map(s => s.title)
  );

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  // Find best value for each comparable metric
  const getBestValue = (key: string, better: 'higher' | 'lower' | undefined) => {
    if (!better) return null;
    const values = firms.map(f => (f as any)[key]).filter(v => v !== null && v !== undefined);
    if (values.length === 0) return null;
    return better === 'higher' ? Math.max(...values) : Math.min(...values);
  };

  // Determine winner for a row
  const isWinner = (firm: PropFirm, key: string, better: 'higher' | 'lower' | undefined) => {
    if (!better) return false;
    const value = (firm as any)[key];
    if (value === null || value === undefined) return false;
    const best = getBestValue(key, better);
    return value === best;
  };

  if (firms.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative h-full flex flex-col max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Compare Prop Firms
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {firms.length} firms selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-950 p-4">
          {/* Firms Header Row */}
          <div className="sticky top-0 z-10 bg-gray-950 pb-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${firms.length}, 1fr)` }}>
              <div /> {/* Empty cell for labels */}
              {firms.map(firm => (
                <div key={firm.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <button
                    onClick={() => onRemove(firm.id)}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  {/* Logo & Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {firm.logo_url ? (
                        <Image
                          src={firm.logo_url}
                          alt={firm.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600">
                          {firm.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{firm.name}</h3>
                      {firm.trustpilot_rating > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-white">{firm.trustpilot_rating.toFixed(1)}</span>
                          <span className="text-gray-500">({firm.trustpilot_reviews})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Discount Code */}
                  {firm.discount_code && (
                    <div className="mb-3">
                      <CopyButton code={firm.discount_code} />
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href={firm.affiliate_url || firm.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Visit Site
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Sections */}
          <div className="space-y-4">
            {COMPARISON_SECTIONS.map(section => (
              <div key={section.title} className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
                >
                  <h3 className="font-semibold text-white">{section.title}</h3>
                  {expandedSections.includes(section.title) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Section Content */}
                {expandedSections.includes(section.title) && (
                  <div className="border-t border-gray-800">
                    {section.rows.map((row, idx) => (
                      <div
                        key={row.key}
                        className={`grid gap-4 p-4 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''}`}
                        style={{ gridTemplateColumns: `200px repeat(${firms.length}, 1fr)` }}
                      >
                        {/* Label */}
                        <div className="text-sm text-gray-400 font-medium">
                          {row.label}
                        </div>

                        {/* Values */}
                        {firms.map(firm => {
                          const value = (firm as any)[row.key];
                          const winner = isWinner(firm, row.key, (row as any).better);

                          return (
                            <div
                              key={firm.id}
                              className={`text-sm ${winner ? 'text-emerald-400 font-semibold' : 'text-white'}`}
                            >
                              {(row as any).type === 'boolean' ? (
                                <BooleanValue value={value} />
                              ) : (
                                <span className="flex items-center gap-1">
                                  {winner && <Trophy className="w-3.5 h-3.5 text-yellow-400" />}
                                  {row.format(value)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
