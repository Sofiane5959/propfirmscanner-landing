'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Zap, ChevronRight, ChevronLeft, RotateCcw,
  TrendingUp, DollarSign, Clock, Target, Star,
  CheckCircle, ArrowRight, Sparkles
} from 'lucide-react'

// Types
interface Question {
  id: string
  question: string
  icon: typeof TrendingUp
  options: {
    value: string
    label: string
    description?: string
  }[]
}

interface PropFirmMatch {
  name: string
  slug: string
  score: number
  reasons: string[]
  rating: number
  price: string
  profitSplit: string
}

// Questions
const QUESTIONS: Question[] = [
  {
    id: 'market',
    question: 'What do you want to trade?',
    icon: TrendingUp,
    options: [
      { value: 'forex', label: 'Forex', description: 'Currency pairs' },
      { value: 'futures', label: 'Futures', description: 'CME, indices' },
      { value: 'crypto', label: 'Crypto', description: 'Bitcoin, altcoins' },
      { value: 'all', label: 'Everything', description: 'Maximum flexibility' },
    ],
  },
  {
    id: 'budget',
    question: 'What\'s your budget for a challenge?',
    icon: DollarSign,
    options: [
      { value: 'low', label: 'Under $200', description: 'Starting small' },
      { value: 'medium', label: '$200 - $500', description: 'Most popular' },
      { value: 'high', label: '$500+', description: 'Bigger accounts' },
      { value: 'any', label: 'Any budget', description: 'Show me all' },
    ],
  },
  {
    id: 'style',
    question: 'What\'s your trading style?',
    icon: Target,
    options: [
      { value: 'scalping', label: 'Scalping', description: 'Quick in & out' },
      { value: 'day', label: 'Day Trading', description: 'Close before end of day' },
      { value: 'swing', label: 'Swing Trading', description: 'Hold for days' },
      { value: 'news', label: 'News Trading', description: 'Trade the news' },
    ],
  },
]

// Matching logic - simplified for demo
const PROP_FIRMS_DATA: Record<string, PropFirmMatch> = {
  'ftmo': {
    name: 'FTMO',
    slug: 'ftmo',
    score: 0,
    reasons: [],
    rating: 4.9,
    price: 'From $155',
    profitSplit: '80-90%',
  },
  'fundednext': {
    name: 'FundedNext',
    slug: 'fundednext',
    score: 0,
    reasons: [],
    rating: 4.6,
    price: 'From $32',
    profitSplit: '80-95%',
  },
  'the5ers': {
    name: 'The5ers',
    slug: 'the5ers',
    score: 0,
    reasons: [],
    rating: 4.7,
    price: 'From $95',
    profitSplit: '80-100%',
  },
  'apex': {
    name: 'Apex Trader Funding',
    slug: 'apex-trader-funding',
    score: 0,
    reasons: [],
    rating: 4.8,
    price: 'From $147',
    profitSplit: '100%',
  },
  'topstep': {
    name: 'Topstep',
    slug: 'topstep',
    score: 0,
    reasons: [],
    rating: 4.5,
    price: 'From $165',
    profitSplit: '90-100%',
  },
  'myfundedfx': {
    name: 'MyFundedFX',
    slug: 'myfundedfx',
    score: 0,
    reasons: [],
    rating: 4.4,
    price: 'From $49',
    profitSplit: '80-85%',
  },
  'fxify': {
    name: 'FXIFY',
    slug: 'fxify',
    score: 0,
    reasons: [],
    rating: 4.5,
    price: 'From $59',
    profitSplit: '80-90%',
  },
  'blueguardian': {
    name: 'Blue Guardian',
    slug: 'blue-guardian',
    score: 0,
    reasons: [],
    rating: 4.3,
    price: 'From $87',
    profitSplit: '85%',
  },
}

function calculateMatches(answers: Record<string, string>): PropFirmMatch[] {
  const firms = JSON.parse(JSON.stringify(PROP_FIRMS_DATA)) as Record<string, PropFirmMatch>
  
  // Market matching
  if (answers.market === 'forex' || answers.market === 'all') {
    firms['ftmo'].score += 30
    firms['ftmo'].reasons.push('Excellent for Forex')
    firms['fundednext'].score += 30
    firms['fundednext'].reasons.push('Great Forex conditions')
    firms['the5ers'].score += 25
    firms['the5ers'].reasons.push('Forex specialist')
    firms['myfundedfx'].score += 25
    firms['myfundedfx'].reasons.push('Good Forex offering')
    firms['fxify'].score += 25
    firms['fxify'].reasons.push('Forex focused')
    firms['blueguardian'].score += 20
    firms['blueguardian'].reasons.push('Supports Forex')
  }
  
  if (answers.market === 'futures' || answers.market === 'all') {
    firms['apex'].score += 35
    firms['apex'].reasons.push('Best for Futures')
    firms['topstep'].score += 35
    firms['topstep'].reasons.push('Futures specialist')
  }
  
  if (answers.market === 'crypto' || answers.market === 'all') {
    firms['ftmo'].score += 15
    firms['ftmo'].reasons.push('Crypto available')
    firms['fundednext'].score += 20
    firms['fundednext'].reasons.push('Good crypto selection')
  }
  
  // Budget matching
  if (answers.budget === 'low') {
    firms['fundednext'].score += 25
    firms['fundednext'].reasons.push('Very affordable')
    firms['myfundedfx'].score += 25
    firms['myfundedfx'].reasons.push('Budget-friendly')
    firms['fxify'].score += 20
    firms['fxify'].reasons.push('Low entry cost')
  } else if (answers.budget === 'medium') {
    firms['ftmo'].score += 20
    firms['ftmo'].reasons.push('Good value')
    firms['the5ers'].score += 20
    firms['the5ers'].reasons.push('Fair pricing')
    firms['apex'].score += 20
    firms['apex'].reasons.push('Competitive price')
  } else if (answers.budget === 'high') {
    firms['ftmo'].score += 25
    firms['ftmo'].reasons.push('Premium experience')
    firms['topstep'].score += 20
    firms['topstep'].reasons.push('Professional grade')
  }
  
  // Style matching
  if (answers.style === 'scalping') {
    firms['ftmo'].score += 20
    firms['ftmo'].reasons.push('Scalping allowed')
    firms['fundednext'].score += 20
    firms['fundednext'].reasons.push('Scalper-friendly')
    firms['apex'].score += 15
    firms['apex'].reasons.push('Good for scalpers')
  } else if (answers.style === 'swing') {
    firms['the5ers'].score += 25
    firms['the5ers'].reasons.push('Perfect for swing trading')
    firms['ftmo'].score += 20
    firms['ftmo'].reasons.push('Swing trading allowed')
    firms['fundednext'].score += 15
    firms['fundednext'].reasons.push('No time limits')
  } else if (answers.style === 'news') {
    firms['the5ers'].score += 25
    firms['the5ers'].reasons.push('News trading allowed')
    firms['fundednext'].score += 20
    firms['fundednext'].reasons.push('News trading permitted')
  } else if (answers.style === 'day') {
    firms['ftmo'].score += 20
    firms['ftmo'].reasons.push('Great for day traders')
    firms['topstep'].score += 20
    firms['topstep'].reasons.push('Day trading focused')
  }
  
  // Sort by score and return top 5
  return Object.values(firms)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

export default function QuickMatchClient() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<PropFirmMatch[] | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const currentQuestion = QUESTIONS[currentStep]
  const isLastQuestion = currentStep === QUESTIONS.length - 1
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    
    if (isLastQuestion) {
      setIsCalculating(true)
      // Simulate calculation
      setTimeout(() => {
        setResults(calculateMatches(newAnswers))
        setIsCalculating(false)
      }, 1500)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setAnswers({})
    setResults(null)
  }

  // Results screen
  if (results) {
    return (
      <div className="min-h-screen bg-gray-900 py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Top Matches!</h1>
            <p className="text-gray-400">Based on your preferences, here are the best prop firms for you</p>
          </div>

          <div className="space-y-4 mb-8">
            {results.map((firm, index) => (
              <div
                key={firm.slug}
                className={`bg-gray-800/50 border rounded-xl p-6 ${
                  index === 0 ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{firm.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>{firm.rating}</span>
                        <span>•</span>
                        <span>{firm.price}</span>
                        <span>•</span>
                        <span>{firm.profitSplit} split</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{firm.score}%</div>
                    <div className="text-xs text-gray-500">match</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {firm.reasons.map((reason, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {reason}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/prop-firm/${firm.slug}`}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    index === 0
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  View {firm.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
            <Link
              href="/compare"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-2"
            >
              Compare All Firms
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculating screen
  if (isCalculating) {
    return (
      <div className="min-h-screen bg-gray-900 py-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Zap className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Finding Your Perfect Match...</h2>
          <p className="text-gray-400">Analyzing 90+ prop firms</p>
          <div className="mt-6 w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-[loading_1.5s_ease-in-out]" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
            <Zap className="w-4 h-4" />
            Quick Match
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Prop Firm</h1>
          <p className="text-gray-400">Answer 3 questions and get personalized recommendations</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <currentQuestion.icon className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">{currentQuestion.question}</h2>
          </div>

          <div className="grid gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-gray-400 text-sm">{option.description}</div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              currentStep === 0
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            onClick={handleRestart}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}
