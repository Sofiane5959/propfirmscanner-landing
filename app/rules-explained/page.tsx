'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, ChevronRight, FileText, Lock, Search,
  CheckCircle2, AlertTriangle, Shield, BookOpen,
  Clock, Download, Play, HelpCircle, Star,
  ArrowRight, Zap, Users, Award
} from 'lucide-react';

// =============================================================================
// PROP FIRMS DATA
// =============================================================================

const propFirms = [
  { id: 'ftmo', name: 'FTMO', logo: '🏆', rulesCount: 28, difficulty: 'Medium', popular: true },
  { id: 'fundednext', name: 'FundedNext', logo: '🚀', rulesCount: 24, difficulty: 'Easy', popular: true },
  { id: 'the5ers', name: 'The5ers', logo: '⭐', rulesCount: 22, difficulty: 'Medium', popular: true },
  { id: 'myfundedfx', name: 'MyFundedFX', logo: '💰', rulesCount: 20, difficulty: 'Easy', popular: false },
  { id: 'e8-funding', name: 'E8 Funding', logo: '🎯', rulesCount: 26, difficulty: 'Medium', popular: false },
  { id: 'alpha-capital', name: 'Alpha Capital', logo: '🔷', rulesCount: 18, difficulty: 'Easy', popular: false },
  { id: 'funded-trading-plus', name: 'Funded Trading Plus', logo: '➕', rulesCount: 21, difficulty: 'Medium', popular: false },
  { id: 'fxify', name: 'FXIFY', logo: '🌐', rulesCount: 19, difficulty: 'Easy', popular: false },
  { id: 'topstep', name: 'Topstep', logo: '📈', rulesCount: 30, difficulty: 'Hard', popular: true },
  { id: 'goat-funded', name: 'Goat Funded Trader', logo: '🐐', rulesCount: 23, difficulty: 'Medium', popular: false },
  { id: 'blue-guardian', name: 'Blue Guardian', logo: '🛡️', rulesCount: 25, difficulty: 'Medium', popular: false },
  { id: 'true-forex-funds', name: 'True Forex Funds', logo: '💎', rulesCount: 22, difficulty: 'Medium', popular: false },
];

const whatYouGet = [
  {
    icon: FileText,
    title: 'Complete Rule Breakdown',
    description: 'Every single rule explained in plain English, no confusing jargon.',
  },
  {
    icon: AlertTriangle,
    title: 'Common Pitfalls',
    description: 'Learn what mistakes cause most traders to fail with this firm.',
  },
  {
    icon: CheckCircle2,
    title: 'Compliance Checklist',
    description: 'A simple checklist to verify you\'re following all rules.',
  },
  {
    icon: Play,
    title: 'Video Walkthrough',
    description: 'Watch a video explanation of the most complex rules.',
  },
  {
    icon: Download,
    title: 'PDF Download',
    description: 'Download the guide to reference offline anytime.',
  },
  {
    icon: HelpCircle,
    title: 'Q&A Section',
    description: 'Answers to the most frequently asked questions.',
  },
];

const testimonials = [
  {
    quote: 'Finally understood why I kept failing FTMO challenges. The drawdown explanation was a game changer.',
    name: 'Mark S.',
    result: 'Passed after reading',
  },
  {
    quote: 'Worth every penny. Saved me from making costly mistakes with the consistency rule.',
    name: 'Lisa R.',
    result: 'Currently funded',
  },
  {
    quote: 'The checklist alone is worth $4.99. I check it before every trade now.',
    name: 'James T.',
    result: '3 funded accounts',
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
      <Link href="/" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
        <Home className="w-4 h-4" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-white">Rules Explained</span>
    </nav>
  );
}

function PropFirmCard({ firm }: { firm: typeof propFirms[0] }) {
  return (
    <div className="relative bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-emerald-500/30 transition-all group">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-full text-white font-semibold text-sm">
            <Lock className="w-4 h-4" />
            Coming Soon
          </div>
        </div>
      </div>
      
      {/* Popular badge */}
      {firm.popular && (
        <div className="absolute -top-2 -right-2 z-20">
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full">
            <Star className="w-3 h-3 fill-current" />
            Popular
          </span>
        </div>
      )}
      
      {/* Content */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{firm.logo}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{firm.name}</h3>
          <p className="text-gray-500 text-sm">{firm.rulesCount} rules explained</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          firm.difficulty === 'Easy' 
            ? 'bg-emerald-500/20 text-emerald-400'
            : firm.difficulty === 'Medium'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {firm.difficulty} Rules
        </span>
        <span className="text-white font-bold">$4.99</span>
      </div>
      
      <button 
        disabled
        className="w-full py-2.5 bg-gray-800 text-gray-400 font-medium rounded-lg cursor-not-allowed"
      >
        Get Guide
      </button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function RulesExplainedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFirms = propFirms.filter(firm => 
    firm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 pb-16">
          <Breadcrumb />
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Stop Failing Due to Rule Violations
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prop Firm Rules <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Explained</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Don&apos;t lose your challenge because of a rule you didn&apos;t understand. Get a complete breakdown of every rule for just <span className="text-emerald-400 font-semibold">$4.99</span> per firm.
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prop firm..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-emerald-500/10 border-b border-emerald-500/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">70+</div>
              <div className="text-gray-400 text-sm">Prop Firms Covered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-gray-400 text-sm">Rules Explained</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">2,400+</div>
              <div className="text-gray-400 text-sm">Guides Sold</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4.9★</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What&apos;s Included in Each Guide</h2>
          <p className="text-gray-400">Everything you need to understand and follow the rules</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatYouGet.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex gap-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                <div className="p-2 bg-emerald-500/10 rounded-lg h-fit">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prop Firms Grid */}
      <section className="bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Prop Firm</h2>
            <p className="text-gray-400">Select the firm you want to understand. Each guide is $4.99.</p>
          </div>
          
          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-xl p-4 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
              <Lock className="w-5 h-5" />
              All guides launching soon - Join waitlist for early access!
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFirms.map((firm) => (
              <PropFirmCard key={firm.id} firm={firm} />
            ))}
          </div>
          
          {filteredFirms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No prop firms found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </section>

      {/* Bundle Offer */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="relative bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 p-8 overflow-hidden">
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-lg mb-3 animate-pulse">
                <Lock className="w-5 h-5" />
                Coming Soon
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Best Value
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">All-Access Bundle</h3>
              <p className="text-gray-400 mb-4">
                Get access to ALL prop firm rule guides for one low price. Save over 80%!
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">$49.99</span>
                <span className="text-gray-500 line-through">$350+</span>
                <span className="text-purple-400 text-sm">Save 85%</span>
              </div>
            </div>
            <button 
              disabled
              className="px-8 py-4 bg-gray-700 text-gray-400 font-semibold rounded-xl cursor-not-allowed whitespace-nowrap"
            >
              Get All Guides
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Traders Love Our Guides</h2>
            <p className="text-gray-400">Real results from real traders</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{testimonial.name}</span>
                  <span className="text-emerald-400 text-sm">{testimonial.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don&apos;t Risk Your Challenge</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Most traders fail due to rule violations they didn&apos;t fully understand. For less than the cost of a coffee, protect your investment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button disabled className="px-8 py-3 bg-gray-700 text-gray-400 font-semibold rounded-xl cursor-not-allowed">
              <span className="flex items-center gap-2 justify-center">
                <Lock className="w-4 h-4" />
                Coming Soon
              </span>
            </button>
            <Link 
              href="/blog"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 justify-center"
            >
              Read Free Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
