'use client'

// =============================================================================
// EVALUATION vs COMPTE FINANCE
// =============================================================================
//
// La seule section que le gabarit Earn2Trade ne portait pas.
//
// POURQUOI ELLE EXISTE
//
// Une firme futures ne change pas seulement de taille de compte entre
// l'evaluation et le compte finance : elle change de regles. FuturesElite passe
// d'un drawdown « End of Day » a un « Trailing Equity » selon le programme,
// abandonne sa regle de regularite une fois finance, et n'applique un nombre
// minimum de jours qu'a la sortie. Presenter une seule colonne de regles
// obligeait a choisir laquelle mentir.
//
// CE QU'ELLE N'EST PAS
//
// Pas une seconde page, pas un mur de regles. Douze lignes comparables au
// maximum, dans le style de carte de la fiche. Le detail exhaustif reste dans
// la section repliable qui existe deja plus bas.
//
// TROIS ETATS, JAMAIS DEUX
//
//   valeur        — la source la donne ;
//   Not applicable— la source dit que la regle n'existe pas pour cette phase ;
//   Needs confirmation — les sources se contredisent ou se taisent.
//
// Une case vide laisserait le lecteur conclure « pas de limite », ce qui est la
// conclusion la plus couteuse possible sur un compte finance.
// =============================================================================

import { useState } from 'react'
import type { FirmProgramData, ProgramPlan } from '@/lib/firm-programs'

interface Props {
  data: FirmProgramData
  selection: { programSlug: string; variantKey: string | null; size: number }
  locale?: string
  currency?: string | null
}

type Cellule = { texte: string; etat: 'valeur' | 'absent' | 'inconnu' }

const ABSENT: Cellule = { texte: 'Not applicable', etat: 'absent' }
const INCONNU: Cellule = { texte: 'Needs confirmation', etat: 'inconnu' }

/** Une fraction est un pourcentage, un entier est un montant. Voir l'adaptateur. */
function montantOuPourcent(v: number | null | undefined, devise: string): Cellule {
  if (v === null || v === undefined) return INCONNU
  if (v < 1) return { texte: `${Math.round(v * 1000) / 10}%`, etat: 'valeur' }
  return {
    texte: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: devise,
      maximumFractionDigits: 0,
    }).format(v),
    etat: 'valeur',
  }
}

function texte(v: string | null | undefined): Cellule {
  return v ? { texte: v, etat: 'valeur' } : INCONNU
}

function nombre(v: number | null | undefined, suffixe = ''): Cellule {
  return v === null || v === undefined ? INCONNU : { texte: `${v}${suffixe}`, etat: 'valeur' }
}

function pourcent(v: number | null | undefined): Cellule {
  return v === null || v === undefined ? INCONNU : { texte: `${Math.round(v * 100)}%`, etat: 'valeur' }
}

/**
 * Les lignes comparables, dans l'ordre ou un acheteur se les pose : ce qu'il
 * faut atteindre, ce qui le fait echouer, ce qui le fait payer.
 */
function lignes(
  evaluation: ProgramPlan | undefined,
  finance: ProgramPlan | undefined,
  devise: string
): { label: string; eva: Cellule; fin: Cellule }[] {
  const sansEvaluation = !evaluation
  return [
    {
      label: 'Profit objective',
      // Un compte finance n'a pas d'objectif : rien a atteindre, seulement des
      // limites a ne pas franchir. « Not applicable » le dit ; un tiret non.
      eva: sansEvaluation ? ABSENT : montantOuPourcent(evaluation?.profit_target, devise),
      fin: ABSENT,
    },
    {
      label: 'Maximum loss',
      eva: sansEvaluation ? ABSENT : montantOuPourcent(evaluation?.maximum_loss_limit, devise),
      fin: montantOuPourcent(finance?.maximum_loss_limit, devise),
    },
    {
      label: 'Daily loss',
      eva: sansEvaluation
        ? ABSENT
        : evaluation?.daily_loss_limit === null
          ? { texte: 'None', etat: 'valeur' }
          : montantOuPourcent(evaluation?.daily_loss_limit, devise),
      fin:
        finance?.daily_loss_limit === null
          ? { texte: 'None', etat: 'valeur' }
          : montantOuPourcent(finance?.daily_loss_limit, devise),
    },
    {
      label: 'Drawdown type',
      eva: sansEvaluation ? ABSENT : texte(evaluation?.drawdown_type),
      fin: texte(finance?.drawdown_type),
    },
    {
      label: 'Consistency rule',
      eva: sansEvaluation
        ? ABSENT
        : evaluation?.consistency_rule === null
          ? ABSENT
          : pourcent(evaluation?.consistency_rule),
      fin: finance?.consistency_rule === null ? ABSENT : pourcent(finance?.consistency_rule),
    },
    {
      label: 'Maximum contracts',
      eva: sansEvaluation ? ABSENT : nombre(evaluation?.max_contracts),
      fin: nombre(finance?.max_contracts),
    },
    {
      // Le meme champ repond a deux questions differentes selon la phase.
      // Les confondre sous « minimum trading days » a deja fait lire « 3 jours
      // pour etre paye » la ou la source disait « 3 jours pour reussir ».
      label: 'Minimum trading days',
      eva: sansEvaluation ? ABSENT : nombre(evaluation?.minimum_trading_days, ' to pass'),
      fin: nombre(finance?.minimum_trading_days, ' before payout'),
    },
    {
      label: 'Profit split',
      eva: ABSENT,
      fin: pourcent(finance?.profit_split),
    },
    {
      label: 'Payout cap',
      eva: ABSENT,
      fin: montantOuPourcent(finance?.payout_cap, devise),
    },
    {
      label: 'Payout frequency',
      eva: ABSENT,
      fin:
        finance?.days_between_payouts === 1
          ? { texte: 'Daily', etat: 'valeur' }
          : nombre(finance?.days_between_payouts, ' days between payouts'),
    },
    {
      label: 'News trading',
      eva: sansEvaluation ? ABSENT : texte(evaluation?.news_trading_status),
      fin: texte(finance?.news_trading_status),
    },
    {
      label: 'Scalping',
      eva: sansEvaluation ? ABSENT : texte(evaluation?.scalping_status),
      fin: texte(finance?.scalping_status),
    },
  ]
}

function Valeur({ c }: { c: Cellule }) {
  const couleur =
    c.etat === 'valeur' ? 'text-white' : c.etat === 'absent' ? 'text-gray-500' : 'text-amber-400/90'
  return <span className={`text-sm ${couleur}`}>{c.texte}</span>
}

export default function EvaluationVsFunded({ data, selection, currency }: Props) {
  // Sur mobile les deux colonnes deviennent illisibles : on bascule en
  // onglets. `aria-selected` porte l'etat, pas seulement la couleur.
  const [onglet, setOnglet] = useState<'evaluation' | 'funded'>('evaluation')

  const programme = data.programs.find((p) => p.slug === selection.programSlug)
  if (!programme) return null

  const pour = (phase: string) =>
    programme.plans.find(
      (p) =>
        p.phase === phase &&
        (p.variant_key ?? null) === selection.variantKey &&
        p.account_size === selection.size
    )

  const evaluation = pour('evaluation')
  const finance = pour('sim_funded')
  // Sans compte finance connu, la comparaison n'a pas de second terme.
  if (!finance) return null

  const devise = finance.currency || evaluation?.currency || currency || 'USD'
  const rangs = lignes(evaluation, finance, devise)
  const sansEvaluation = !evaluation

  return (
    <section id="phases" className="scroll-mt-28 print:scroll-mt-0">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
          Rules by phase
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {sansEvaluation
            ? `${programme.name}: the rules that apply from day one`
            : `${programme.name}: evaluation versus funded`}
        </h2>
        <p className="text-gray-400 mt-2 max-w-2xl">
          {sansEvaluation
            ? 'This program funds you at purchase, so there is no evaluation stage and no objective to reach. Only the funded column applies.'
            : 'The rules change once you pass. These are the ones that differ, for the program and size you selected.'}
        </p>
      </div>

      {/* Onglets sous md, deux colonnes au-dessus. */}
      {!sansEvaluation && (
        <div role="tablist" aria-label="Phase" className="flex gap-2 mb-4 md:hidden">
          {(['evaluation', 'funded'] as const).map((cle) => (
            <button
              key={cle}
              role="tab"
              type="button"
              aria-selected={onglet === cle}
              onClick={() => setOnglet(cle)}
              className={`min-h-[44px] px-4 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                onglet === cle
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : 'border-gray-800 bg-gray-900/50 text-gray-400'
              }`}
            >
              {cle === 'evaluation' ? 'Evaluation' : 'Funded'}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
        {/* En-tete des colonnes, sur md et au-dessus seulement. */}
        {!sansEvaluation && (
          <div className="hidden md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-5 py-3 border-b border-gray-800">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Rule</span>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Evaluation</span>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Funded</span>
          </div>
        )}

        <div className="divide-y divide-gray-800">
          {rangs.map((r) => (
            <div
              key={r.label}
              className={
                sansEvaluation
                  ? 'grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4 px-5 py-3'
                  : 'grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-5 py-3'
              }
            >
              <span className="text-gray-400 text-sm">{r.label}</span>
              {sansEvaluation ? (
                <Valeur c={r.fin} />
              ) : (
                <>
                  {/* Sous md, une seule colonne suit l'onglet actif. */}
                  <span className={onglet === 'funded' ? 'md:block hidden' : ''}>
                    <Valeur c={r.eva} />
                  </span>
                  <span className={onglet === 'evaluation' ? 'md:block hidden' : ''}>
                    <Valeur c={r.fin} />
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-3">
        <span className="text-gray-500">Not applicable</span> means the source states the rule does
        not exist for that phase. <span className="text-amber-400/90">Needs confirmation</span> means
        the official pages disagree or stay silent — never that the rule is absent.
      </p>
    </section>
  )
}
