'use client'

// =============================================================================
// EXPLORATEUR DE PROGRAMMES — components/ProgramExplorer.tsx
// =============================================================================
// Rend la structure normalisée de `lib/firm-programs.ts` : un programme, une
// taille, puis l'évaluation et le compte financé côte à côte.
//
// Générique et piloté par les données : rien ici ne nomme FuturesElite. Toute
// firme ayant des lignes dans `firm_programs` obtient cette section, et
// `CLAUDE.md` reste tenu — une seule page sert les 350 fiches.
//
// Deux règles du brief sont câblées dans le rendu, pas laissées à la rédaction :
//   - jamais de coche verte sur « With restrictions » ni sur un statut à
//     confirmer : la sévérité décide de la couleur et du symbole ;
//   - jamais « meilleur prix » sur un code partenaire battu par l'offre
//     publique : `betterPublic` déclenche un avertissement neutre.
// =============================================================================

import { useMemo, useState } from 'react'
import {
  type FirmProgramData, type Phase, type ProgramPlan, type Severity,
  priceFor, planFor, regularPriceFor, sizesOf,
} from '@/lib/firm-programs'

const COPY = {
  en: {
    eyebrow: 'Programs, rules and prices',
    intro: 'Pick a program and a size. Evaluation and funded rules stay separate.',
    step1: 'Choose your program',
    step2: 'Choose your account size',
    evaluation: 'Evaluation',
    funded: 'Funded account',
    noEvaluation: 'No evaluation — the account is funded from purchase.',
    priceToday: 'Price today',
    regular: 'Regular price',
    publicBetter: (code: string, pct: string) =>
      `A public offer (${code}) currently gives ${pct} — more than our partner code. We show it rather than hide it.`,
    noExpiry: 'No expiry date is published for this offer.',
    profitTarget: 'Profit target',
    maxLoss: 'Maximum loss',
    dailyLoss: 'Daily loss limit',
    drawdown: 'Drawdown',
    buffer: 'Buffer',
    noBuffer: 'None',
    bufferUnknown: 'Not stated',
    contracts: 'Max contracts',
    scaling: 'Contract scaling',
    minDays: 'Minimum trading days',
    consistency: 'Consistency rule',
    split: 'Profit split',
    payoutCap: 'Payout cap',
    minPayout: 'Minimum payout',
    betweenPayouts: 'Days between payouts',
    resetFee: 'Reset fee',
    activationFee: 'Activation fee',
    none: 'None',
    notApplicable: 'Not applicable',
    bundle: 'Bundle & Save',
    bundleIntro: 'How many accounts you may BUY. Not how many may be funded at once.',
    fundedLimit: (n: number) => `Official limit: ${n} active funded accounts`,
    account: 'Account',
    free: 'Free',
    rules: 'Rules that can breach or restrict the account',
    platforms: 'Platforms',
    noSurcharge:
      'No surcharge is displayed at checkout. Market data, commissions and platform licences may still be yours to pay.',
    severity: {
      hard_breach: 'Hard breach',
      restriction: 'Restriction',
      payout_condition: 'Payout condition',
      allowed: 'Allowed',
      needs_confirmation: 'Needs confirmation',
    } as Record<Severity, string>,
  },
  fr: {
    eyebrow: 'Programmes, règles et prix',
    intro: 'Choisissez un programme et une taille. L’évaluation et le compte financé restent séparés.',
    step1: 'Choisissez votre programme',
    step2: 'Choisissez votre taille de compte',
    evaluation: 'Évaluation',
    funded: 'Compte financé',
    noEvaluation: 'Aucune évaluation — le compte est financé dès l’achat.',
    priceToday: 'Prix aujourd’hui',
    regular: 'Prix régulier',
    publicBetter: (code: string, pct: string) =>
      `Une offre publique (${code}) donne actuellement ${pct} — davantage que notre code partenaire. Nous l’affichons plutôt que de la taire.`,
    noExpiry: 'Aucune date d’expiration n’est publiée pour cette offre.',
    profitTarget: 'Objectif de profit',
    maxLoss: 'Perte maximale',
    dailyLoss: 'Perte journalière',
    drawdown: 'Drawdown',
    buffer: 'Buffer',
    noBuffer: 'Aucun',
    bufferUnknown: 'Non précisé',
    contracts: 'Contrats maximum',
    scaling: 'Progression des contrats',
    minDays: 'Jours de trading minimum',
    consistency: 'Règle de régularité',
    split: 'Partage des profits',
    payoutCap: 'Plafond de retrait',
    minPayout: 'Retrait minimum',
    betweenPayouts: 'Jours entre deux retraits',
    resetFee: 'Frais de reset',
    activationFee: 'Frais d’activation',
    none: 'Aucun',
    notApplicable: 'Sans objet',
    bundle: 'Bundle & Save',
    bundleIntro:
      'Le nombre de comptes que vous pouvez ACHETER. Pas le nombre qui peut être financé en même temps.',
    fundedLimit: (n: number) => `Limite officielle : ${n} comptes financés actifs`,
    account: 'Compte',
    free: 'Offert',
    rules: 'Règles pouvant clôturer ou restreindre le compte',
    platforms: 'Plateformes',
    noSurcharge:
      'Aucun supplément n’est affiché au paiement. Données de marché, commissions et licences logicielles peuvent rester à votre charge.',
    severity: {
      hard_breach: 'Clôture immédiate',
      restriction: 'Restriction',
      payout_condition: 'Condition de retrait',
      allowed: 'Autorisé',
      needs_confirmation: 'À confirmer',
    } as Record<Severity, string>,
  },
}

// Le brief interdit la coche verte sur « With restrictions » et sur un statut à
// confirmer. La couleur et le symbole découlent donc de la sévérité, jamais
// d'un booléen.
const SEVERITY_STYLE: Record<Severity, { badge: string; mark: string }> = {
  hard_breach: { badge: 'bg-red-500/10 text-red-300 border-red-500/30', mark: '×' },
  restriction: { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30', mark: '!' },
  payout_condition: { badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30', mark: '§' },
  allowed: { badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', mark: '✓' },
  needs_confirmation: { badge: 'bg-gray-500/10 text-gray-300 border-gray-500/30', mark: '?' },
}

const money = (v: number | null | undefined) =>
  v === null || v === undefined ? null : '$' + Number(v).toLocaleString('en-US')
const pct = (v: number | null | undefined) =>
  v === null || v === undefined ? null : Math.round(Number(v) * 100) + '%'

function Row({ label, value, note }: { label: string; value: string | null; note?: string | null }) {
  if (value === null) return null
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-800 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium text-right">
        {value}
        {note ? <span className="block text-gray-500 text-xs font-normal mt-0.5">{note}</span> : null}
      </span>
    </div>
  )
}

function PhaseCard({ title, plan, t }: { title: string; plan: ProgramPlan | null; t: typeof COPY.en }) {
  if (!plan) return null
  const buffer =
    plan.buffer_status === 'none' ? t.noBuffer
      : plan.buffer_status === 'amount' ? money(plan.buffer)
      : t.bufferUnknown
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <h4 className="text-white font-semibold mb-3">{title}</h4>
      <Row label={t.profitTarget} value={money(plan.profit_target)} />
      <Row label={t.maxLoss} value={money(plan.maximum_loss_limit)} />
      <Row label={t.dailyLoss} value={money(plan.daily_loss_limit)} />
      <Row label={t.drawdown} value={plan.drawdown_type} />
      <Row label={t.buffer} value={buffer} />
      <Row label={t.contracts} value={plan.max_contracts === null ? null : String(plan.max_contracts)} />
      <Row label={t.scaling} value={plan.contract_scaling === null ? null : plan.contract_scaling ? '✓' : '—'} />
      <Row label={t.minDays} value={plan.minimum_trading_days === null ? null : String(plan.minimum_trading_days)} />
      <Row label={t.consistency} value={plan.consistency_rule === null ? t.none : pct(plan.consistency_rule)} />
      <Row label={t.split} value={pct(plan.profit_split)} />
      <Row label={t.payoutCap} value={money(plan.payout_cap)} />
      <Row label={t.minPayout} value={money(plan.minimum_payout)} />
      <Row label={t.betweenPayouts} value={plan.days_between_payouts === null ? null : String(plan.days_between_payouts)} />
      <Row label={t.resetFee} value={plan.reset_fee === null ? t.notApplicable : money(plan.reset_fee)} />
      <Row label={t.activationFee} value={plan.activation_fee === null ? null : money(plan.activation_fee)} />
    </div>
  )
}

export default function ProgramExplorer({
  data,
  locale = 'en',
  ctaHref,
  ctaLabel,
}: {
  data: FirmProgramData
  locale?: string
  ctaHref: string
  ctaLabel: string
}) {
  const t = locale === 'fr' ? COPY.fr : COPY.en
  const [programSlug, setProgramSlug] = useState(data.programs[0]?.slug ?? '')

  const program = data.programs.find((p) => p.slug === programSlug) ?? data.programs[0]
  const sizes = useMemo(() => (program ? sizesOf(program) : []), [program])
  const [size, setSize] = useState<number | null>(null)
  // Changer de programme peut rendre la taille choisie indisponible : on
  // retombe sur la plus petite du nouveau programme plutôt que d'afficher un
  // plan vide.
  const activeSize = size !== null && sizes.includes(size) ? size : sizes[0]

  if (!program || activeSize === undefined) return null

  const regular = regularPriceFor(program, activeSize)
  const price = priceFor(data.promotions, program.slug, activeSize, regular)
  const evaluation = planFor(program, 'evaluation', activeSize)
  const funded = planFor(program, 'sim_funded', activeSize)
  const bundle = data.bundles.filter((b) => b.program_slug === program.slug)

  return (
    <section id="programs" className="scroll-mt-28">
      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">{t.eyebrow}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{t.step1}</h2>
      <p className="text-gray-400 mb-5">{t.intro}</p>

      {/* Étape 1 — programme */}
      <div role="radiogroup" aria-label={t.step1} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {data.programs.map((p) => {
          const on = p.slug === program.slug
          return (
            <button
              key={p.slug}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setProgramSlug(p.slug)}
              className={`min-h-[44px] text-left p-4 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                on ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }`}
            >
              <span className="block text-white font-semibold">{p.name}</span>
              <span className="block text-gray-400 text-xs mt-1">
                {p.kind === 'instant' ? t.noEvaluation : `${sizesOf(p).length} sizes`}
              </span>
            </button>
          )
        })}
      </div>

      {/* Étape 2 — taille */}
      <h3 className="text-white font-semibold mb-2">{t.step2}</h3>
      <div role="radiogroup" aria-label={t.step2} className="flex flex-wrap gap-2 mb-6">
        {sizes.map((s) => {
          const on = s === activeSize
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSize(s)}
              className={`min-h-[44px] px-4 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                on ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-gray-800 bg-gray-900/50 text-gray-300 hover:border-gray-700'
              }`}
            >
              ${(s / 1000).toLocaleString('en-US')}K
            </button>
          )
        })}
      </div>

      {/* Prix */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-gray-400 text-sm">{t.priceToday}</span>
          <span className="text-3xl font-bold text-white">{money(price.final) ?? '—'}</span>
          {price.promotion && price.regular !== price.final && (
            <span className="text-gray-500 line-through">{money(price.regular)}</span>
          )}
          {price.promotion?.code && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/30">
              {price.promotion.code}
            </span>
          )}
        </div>
        {/* Jamais « meilleur prix » sur un code battu par l'offre publique. */}
        {price.betterPublic && (
          <p className="mt-3 text-amber-300 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            {t.publicBetter(price.betterPublic.code ?? '—', pct(price.betterPublic.discount_value) ?? '')}
          </p>
        )}
        {price.promotion && !price.promotion.expires_at && (
          <p className="mt-2 text-gray-500 text-xs">{t.noExpiry}</p>
        )}
        <a
          href={ctaHref}
          rel="sponsored nofollow noopener"
          target="_blank"
          className="mt-4 inline-flex items-center justify-center min-h-[44px] px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          {ctaLabel}
        </a>
      </div>

      {/* Évaluation et financé, jamais mélangés */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {evaluation ? (
          <PhaseCard title={t.evaluation} plan={evaluation} t={t} />
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 text-gray-400 text-sm">
            {t.noEvaluation}
          </div>
        )}
        <PhaseCard title={t.funded} plan={funded} t={t} />
      </div>

      {/* Bundle : capacité d'achat, distincte du plafond financé */}
      {bundle.length > 0 && (
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-1">{t.bundle}</h3>
          <p className="text-gray-400 text-sm mb-3">{t.bundleIntro}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {bundle.map((b) => (
              <div
                key={b.account_number}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  b.status === 'free'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-gray-800 bg-gray-900/50 text-gray-300'
                }`}
              >
                <span className="block text-xs text-gray-500">{t.account} {b.account_number}</span>
                {b.status === 'free' ? t.free : '−' + pct(b.discount_percent)}
              </div>
            ))}
          </div>
          {program.max_funded_accounts !== null && (
            <p className="text-amber-300 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              {t.fundedLimit(program.max_funded_accounts)}
              {program.max_funded_note ? <span className="block text-amber-200/80 text-xs mt-1">{program.max_funded_note}</span> : null}
            </p>
          )}
        </div>
      )}

      {/* Règles, avec le niveau de gravité en toutes lettres */}
      {data.rules.length > 0 && (
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-3">{t.rules}</h3>
          <ul className="space-y-2">
            {data.rules.map((r) => {
              const sev = (r.severity ?? 'needs_confirmation') as Severity
              const style = SEVERITY_STYLE[sev]
              return (
                <li key={r.scope + r.title} className="flex gap-3 items-start bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                  <span className={`shrink-0 px-2 py-0.5 rounded-md border text-[11px] font-medium ${style.badge}`}>
                    <span aria-hidden="true" className="mr-1">{style.mark}</span>
                    {t.severity[sev]}
                  </span>
                  <span className="text-sm">
                    <span className="text-white font-medium">{r.title}</span>
                    {r.detail ? <span className="block text-gray-400 mt-0.5">{r.detail}</span> : null}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Plateformes */}
      {data.platforms.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-2">{t.platforms}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.platforms.map((p) => (
              <span key={p.name} className="px-3 py-1.5 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-300 text-sm">
                {p.name}
              </span>
            ))}
          </div>
          {/* Le brief interdit d'affirmer qu'elles sont toutes gratuites. */}
          <p className="text-gray-500 text-xs">{t.noSurcharge}</p>
        </div>
      )}
    </section>
  )
}
