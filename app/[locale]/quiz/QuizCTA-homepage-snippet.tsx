/**
 * HOMEPAGE QUIZ CTA SNIPPET
 * 
 * Ajoute ce bloc dans ta homepage (page.tsx ou un composant Hero/Section)
 * à l'endroit où tu veux afficher le CTA quiz.
 * 
 * Imports nécessaires :
 * import Link from 'next/link'
 * import { Sparkles, ChevronRight } from 'lucide-react'
 */

// =====================================================
// OPTION A — Bloc section standalone (recommandé)
// =====================================================
/*
<section className="py-16 px-4">
  <div className="max-w-4xl mx-auto">
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/30 border border-emerald-500/20 rounded-2xl p-8 sm:p-12 overflow-hidden text-center">
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Still undecided? We can help.
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Find your perfect prop firm
        </h2>
        <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          Answer 4 quick questions — experience, style, budget, goals — and get your personalized top 3 matches.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-8 text-sm">
          <div className="text-center">
            <p className="font-bold text-white text-xl">36</p>
            <p className="text-gray-500 text-xs mt-0.5">firms compared</p>
          </div>
          <div className="w-px h-8 bg-gray-700" />
          <div className="text-center">
            <p className="font-bold text-white text-xl">4</p>
            <p className="text-gray-500 text-xs mt-0.5">questions</p>
          </div>
          <div className="w-px h-8 bg-gray-700" />
          <div className="text-center">
            <p className="font-bold text-emerald-400 text-xl">~60s</p>
            <p className="text-gray-500 text-xs mt-0.5">time needed</p>
          </div>
        </div>

        <Link
          href="/quiz"   {/* ← adapte avec le locale si besoin : /${locale}/quiz */}
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
        >
          Find my match
          <ChevronRight className="w-5 h-5" />
        </Link>

        <p className="text-gray-600 text-xs mt-3">No signup required</p>
      </div>
    </div>
  </div>
</section>
*/


// =====================================================
// OPTION B — Petite card compacte (sidebar / entre sections)
// =====================================================
/*
<div className="bg-gray-900 border border-emerald-500/20 rounded-xl p-5 flex items-center gap-4">
  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
    <Sparkles className="w-6 h-6 text-emerald-400" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-white font-semibold text-sm">Still undecided?</p>
    <p className="text-gray-500 text-xs">Find your perfect prop firm in 60 seconds.</p>
  </div>
  <Link
    href="/quiz"
    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors flex-shrink-0"
  >
    Start <ChevronRight className="w-4 h-4" />
  </Link>
</div>
*/

export {}
