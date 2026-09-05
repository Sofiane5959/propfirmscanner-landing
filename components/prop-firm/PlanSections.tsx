'use client'

// =============================================================================
// SECTIONS PILOTEES PAR LA SELECTION — components/prop-firm/PlanSections.tsx
// =============================================================================
// Chaque section reçoit le MEME objet `SelectedPlan`. Aucune ne lit une colonne
// au niveau de la firme, et aucune ne teste un slug : c'est ce qui garantit
// qu'un changement de programme les met toutes à jour.
//
// PORTEE LINGUISTIQUE
//
// Ces sections sont volontairement en anglais seulement, comme le demande le
// brief. Les clés à traduire plus tard sont exportées dans `PENDING_KEYS` en
// fin de fichier, pour qu'elles ne se perdent pas.
// =============================================================================

import { useState } from 'react'
import type { SelectedPlan, CriticalRule, CriticalSeverity } from '@/lib/selected-plan'
import { criticalRules, suitabilityFor, formatAmount, asAmountOrPercent } from '@/lib/selected-plan'
import type { FirmCapabilities } from '@/lib/firm-capabilities'
import { ChevronDown } from 'lucide-react'

// Jamais la même coche verte pour tous les types de règle : la conséquence
// décide de la couleur et du symbole.
const SEV: Record<CriticalSeverity, { badge: string; mark: string; label: string }> = {
  breach: { badge: 'bg-red-500/10 text-red-300 border-red-500/30', mark: '×', label: 'Can breach the account' },
  payout_condition: { badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30', mark: '§', label: 'Payout condition' },
  restriction: { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30', mark: '!', label: 'Restriction' },
  allowed: { badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', mark: '✓', label: 'Allowed' },
  needs_confirmation: { badge: 'bg-gray-500/10 text-gray-300 border-gray-600/30', mark: '?', label: 'Needs confirmation' },
}

function Section({ id, title, intro, children }: {
  id: string; title: string; intro?: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 mb-10">
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      {intro ? <p className="text-gray-400 text-sm mb-4">{intro}</p> : <div className="mb-4" />}
      {children}
    </section>
  )
}

function Line({ label, value, note }: { label: string; value: string | null; note?: string | null }) {
  if (!value) return null
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

// -----------------------------------------------------------------------------
// 1. Resume du plan choisi — colle au scroll sur ordinateur
// -----------------------------------------------------------------------------
export function SelectedPlanSummary({ sel, ctaHref, ctaLabel }: {
  sel: SelectedPlan; ctaHref: string; ctaLabel: string
}) {
  const f = sel.funded
  const e = sel.entry
  const money = (v: number | null | undefined) =>
    v === null || v === undefined ? null : formatAmount(Number(v), sel.currency)

  return (
    // aria-live : le lecteur d'écran annonce le changement de sélection sans
    // que l'utilisateur ait à retrouver la zone.
    <aside
      aria-live="polite"
      aria-label="Selected plan"
      className="lg:sticky lg:top-24 bg-gray-900/70 border border-gray-800 rounded-xl p-5"
    >
      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">Your selection</p>
      <p className="text-white font-semibold">
        {sel.program.name}
        {sel.variantLabel ? <span className="text-gray-400 font-normal"> · {sel.variantLabel}</span> : null}
      </p>
      <p className="text-gray-400 text-sm mb-4">
        {sel.accountSize ? '$' + (sel.accountSize / 1000).toLocaleString('en-US') + 'K' : '—'}
      </p>

      {!sel.pending && (
        <>
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span className="text-3xl font-bold text-white">{money(sel.price.final) ?? '—'}</span>
            {sel.price.promotion && sel.price.regular !== sel.price.final && (
              <span className="text-gray-500 line-through text-sm">{money(sel.price.regular)}</span>
            )}
          </div>
          <p className="text-gray-500 text-xs mb-4">Amount payable today</p>

          <Line
            label="Profit target"
            value={
              sel.evaluationPhases.length === 0
                ? 'No evaluation — funded rules apply immediately'
                : asAmountOrPercent(e?.profit_target ?? null, sel.currency)
            }
          />
          <Line label="Maximum loss" value={asAmountOrPercent(e?.maximum_loss_limit ?? null, sel.currency)} />
          <Line label="Daily loss" value={e?.daily_loss_limit != null ? asAmountOrPercent(e.daily_loss_limit, sel.currency) : null} />
          {/* Sans phase d'evaluation, une transition « 20% -> 20% » n'a aucun
              sens : les deux valeurs sont la meme regle vue deux fois. On
              affiche alors la seule regle qui existe, celle du compte finance. */}
          <Line
            label="Consistency"
            value={
              sel.evaluationPhases.length === 0
                ? (f?.consistency_rule != null ? Math.round(f.consistency_rule * 100) + '% funded' : null)
                : e?.consistency_rule != null || f?.consistency_rule != null
                  ? `${e?.consistency_rule != null ? Math.round(e.consistency_rule * 100) + '%' : 'none'} → ${f?.consistency_rule != null ? Math.round(f.consistency_rule * 100) + '%' : 'none'}`
                  : null
            }
            note={sel.evaluationPhases.length === 0 ? null : 'Evaluation → funded'}
          />
          {/* « Minimum trading days » est ambigu sur un produit instantane :
              il ne s'agit pas d'achever une evaluation mais de devenir
              eligible au retrait. */}
          <Line
            label={
              sel.evaluationPhases.length === 0
                ? 'Minimum qualifying trading days before payout'
                : 'First payout'
            }
            value={
              f?.minimum_trading_days != null
                ? sel.evaluationPhases.length === 0
                  ? String(f.minimum_trading_days)
                  : `after ${f.minimum_trading_days} trading days`
                : null
            }
          />
          <Line label="Profit split" value={f?.profit_split != null ? Math.round(f.profit_split * 100) + '%' : null} />

          <a
            href={ctaHref}
            rel="sponsored nofollow noopener"
            target="_blank"
            className="mt-4 flex items-center justify-center min-h-[44px] px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            {ctaLabel}
          </a>
          <p className="text-gray-500 text-[11px] mt-2 leading-snug">
            Affiliate link. We may earn a commission at no cost to you. It does not affect our rating or whether a firm is listed.
          </p>
        </>
      )}
    </aside>
  )
}

// -----------------------------------------------------------------------------
// 2. Cinq regles critiques
// -----------------------------------------------------------------------------
export function CriticalRules({ sel }: { sel: SelectedPlan }) {
  const rules = criticalRules(sel)
  if (rules.length === 0) return null
  return (
    <Section
      id="critical-rules"
      title="Five rules that decide this account"
      intro="The rules most likely to breach the account or block a payout for this exact configuration."
    >
      <ul className="space-y-2">
        {rules.map((r: CriticalRule) => {
          const s = SEV[r.severity]
          return (
            <li key={r.label} className="flex flex-wrap gap-3 items-start bg-gray-900/50 border border-gray-800 rounded-lg p-3">
              <span className={`shrink-0 px-2 py-0.5 rounded-md border text-[11px] font-medium ${s.badge}`}>
                <span aria-hidden="true" className="mr-1">{s.mark}</span>
                {s.label}
              </span>
              <span className="text-sm min-w-0">
                <span className="text-white font-medium">{r.label} — {r.value}</span>
                {r.note ? <span className="block text-gray-400 mt-0.5">{r.note}</span> : null}
              </span>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

// -----------------------------------------------------------------------------
// 3. Ce qui se passe apres le paiement
// -----------------------------------------------------------------------------
export function FundingTimeline({ sel }: { sel: SelectedPlan }) {
  if (sel.pending) return null
  // Le parcours se deduit du nombre de phases : aucun n'est code en dur.
  const etapes: { title: string; detail: string }[] = [{ title: 'Purchase', detail: 'One-time payment for the selected plan.' }]
  sel.evaluationPhases.forEach((p, i) => {
    etapes.push({
      title: sel.evaluationPhases.length > 1 ? `Phase ${i + 1}` : 'Evaluation',
      detail: `Reach ${asAmountOrPercent(p.profit_target, sel.currency)} without breaching ${asAmountOrPercent(p.maximum_loss_limit, sel.currency)}.`,
    })
  })
  if (sel.evaluationPhases.length === 0) {
    etapes.push({ title: 'Funded access', detail: 'No evaluation — funded rules apply immediately.' })
  } else if (sel.funded) {
    etapes.push({ title: 'Simulated funded', detail: 'Funded rules replace the evaluation rules.' })
  }
  if (sel.funded) {
    etapes.push({
      title: 'First payout',
      detail: sel.funded.minimum_trading_days != null
        ? `After ${sel.funded.minimum_trading_days} trading days, subject to the payout conditions below.`
        : 'Subject to the payout conditions below.',
    })
  }

  return (
    <Section id="timeline" title="What happens after payment" intro="This sequence follows the plan you selected.">
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {etapes.map((e, i) => (
          <li key={e.title} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <span className="text-emerald-400 text-xs font-semibold">{i + 1}</span>
            <p className="text-white font-medium mt-1">{e.title}</p>
            <p className="text-gray-400 text-sm mt-1">{e.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

// -----------------------------------------------------------------------------
// 4. Cout reel
// -----------------------------------------------------------------------------
export function TrueCost({ sel, caps }: { sel: SelectedPlan; caps: FirmCapabilities }) {
  if (sel.pending) return null
  const e = sel.entry
  const money = (v: number | null | undefined) =>
    v === null || v === undefined ? null : formatAmount(Number(v), sel.currency)

  const moments: { label: string; value: string | null; note?: string | null }[] = [
    { label: 'Pay today', value: money(sel.price.final), note: sel.price.promotion?.code ? `Code ${sel.price.promotion.code}` : null },
    { label: 'Standard price', value: sel.price.regular !== sel.price.final ? money(sel.price.regular) : null },
    { label: 'Reset after a failure', value: e?.reset_fee != null ? money(e.reset_fee) : caps.hasResetFee ? null : 'No reset sold' },
    { label: 'Activation once you pass', value: e?.activation_fee != null ? (Number(e.activation_fee) === 0 ? 'None' : money(e.activation_fee)) : null },
    { label: 'Due after passing', value: e?.post_pass_fee != null ? money(e.post_pass_fee) : null },
    { label: 'Refund', value: e?.refund_note ?? null },
  ]

  return (
    <Section id="true-cost" title="True cost" intro="Every moment money changes hands, separated.">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        {moments.map((m) => <Line key={m.label} label={m.label} value={m.value} note={m.note} />)}
      </div>
      {sel.promotion && !sel.promotion.expires_at && (
        <p className="text-gray-500 text-xs mt-2">No expiry date is published for this offer.</p>
      )}
      {sel.price.betterPublic && (
        <p className="mt-3 text-amber-300 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          A public offer currently gives {Math.round(Number(sel.price.betterPublic.discount_value) * 100)}% — more than our
          partner code. We show it rather than hide it.
        </p>
      )}
    </Section>
  )
}

// -----------------------------------------------------------------------------
// 5. Conditions de retrait
// -----------------------------------------------------------------------------
export function PayoutConditions({ sel }: { sel: SelectedPlan }) {
  const f = sel.funded
  if (!f) return null
  const money = (v: number | null | undefined) =>
    v === null || v === undefined ? null : formatAmount(Number(v), sel.currency)

  return (
    <Section
      id="payouts"
      title="Payout conditions"
      intro="Eligibility, schedule and processing are three different things, shown separately."
    >
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        <Line label="Profit split" value={f.profit_split != null ? Math.round(f.profit_split * 100) + '%' : null} />
        <Line label="Minimum request" value={money(f.minimum_payout)} />
        <Line label="Payout cap per request" value={money(f.payout_cap)} />
        <Line label="Days between requests" value={f.days_between_payouts != null ? String(f.days_between_payouts) : null} />
        <Line label="Minimum trading days" value={f.minimum_trading_days != null ? String(f.minimum_trading_days) : null} />
        <Line label="Minimum profitable days" value={f.minimum_profitable_days != null ? String(f.minimum_profitable_days) : null} />
        <Line label="Consistency once funded" value={f.consistency_rule != null ? Math.round(f.consistency_rule * 100) + '%' : 'None'} />
        <Line
          label="Buffer"
          value={f.buffer_status === 'amount' ? money(f.buffer) : f.buffer_status === 'none' ? 'None' : 'Not stated'}
        />
        <Line label="Scaling" value={f.scaling_note} />
      </div>
    </Section>
  )
}

// -----------------------------------------------------------------------------
// 6. Verdict de compatibilite
// -----------------------------------------------------------------------------
export function SuitabilityVerdict({ sel }: { sel: SelectedPlan }) {
  const { goodFit, considerElse } = suitabilityFor(sel)
  if (goodFit.length === 0 && considerElse.length === 0) return null
  return (
    <Section
      id="suitability"
      title={`Is ${sel.program.name} right for you?`}
      intro="Derived from the plan you selected, not from a generic firm verdict."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
          <p className="text-emerald-300 font-semibold mb-2">Good fit if you…</p>
          <ul className="space-y-1.5">
            {goodFit.map((g) => <li key={g} className="text-gray-300 text-sm">· {g}</li>)}
          </ul>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
          <p className="text-amber-300 font-semibold mb-2">Consider another plan if…</p>
          <ul className="space-y-1.5">
            {considerElse.map((c) => <li key={c} className="text-gray-300 text-sm">· {c}</li>)}
          </ul>
        </div>
      </div>
    </Section>
  )
}

// -----------------------------------------------------------------------------
// 7. Journal des sources
// -----------------------------------------------------------------------------
export function EvidenceLog({ sel }: { sel: SelectedPlan }) {
  const [open, setOpen] = useState(false)
  const aConfirmer = sel.rules.filter((r) => r.confidence === 'needs_confirmation')
  const planDouteux = [...sel.evaluationPhases, sel.funded].filter(
    (p): p is NonNullable<typeof p> => Boolean(p) && p!.confidence === 'needs_confirmation'
  )
  const sources = Array.from(new Set(
    [sel.program.source_url, ...sel.rules.map((r) => r.source_url)].filter((u): u is string => Boolean(u))
  ))
  if (sources.length === 0 && aConfirmer.length === 0) return null

  return (
    <Section id="evidence" title="Evidence and verification">
      {(aConfirmer.length > 0 || planDouteux.length > 0) && (
        <p className="mb-3 text-amber-300 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          {aConfirmer.length + planDouteux.length} fact(s) on this plan are not confirmed. They are shown as unconfirmed
          rather than presented as verified.
        </p>
      )}
      {planDouteux.map((p) => p.editorial_note ? (
        <p key={p.phase} className="text-gray-400 text-sm mb-2">· {p.editorial_note}</p>
      ) : null)}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="min-h-[44px] px-4 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-300 text-sm hover:border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        {open ? 'Hide sources' : `Show the ${sources.length} sources used`}
      </button>
      {open && (
        <ul className="mt-3 space-y-1.5">
          {sources.map((u) => (
            <li key={u} className="text-sm">
              <a href={u} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline break-all">{u}</a>
            </li>
          ))}
        </ul>
      )}
      {sel.program.verified_at && (
        <p className="text-gray-500 text-xs mt-3">
          Checked on {String(sel.program.verified_at).slice(0, 10)}.
        </p>
      )}
    </Section>
  )
}

// -----------------------------------------------------------------------------
// 8. Specifications completes, repliees
// -----------------------------------------------------------------------------
/**
 * Ordre d'affichage des categories de regles.
 *
 * Fixe deliberement : groupe par ordre d'insertion des donnees, la page se
 * reorganisait des qu'une regle etait ajoutee. L'ordre suit ici la question
 * que le lecteur se pose, de la plus frequente a la plus tardive : quand
 * puis-je trader, comment, avec quel compte, combien de comptes, comment
 * suis-je paye, et que se passe-t-il en live.
 *
 * `other` est un vrai filet : une portee ajoutee en base sans passer par ce
 * fichier reste visible au lieu d'etre silencieusement omise.
 */
const CATEGORIES_REGLES: { scope: string; label: string }[] = [
  { scope: 'session', label: 'Trading hours and sessions' },
  { scope: 'conduct', label: 'Trading conduct' },
  { scope: 'account', label: 'Account and identity' },
  { scope: 'limits', label: 'How many accounts you can hold' },
  { scope: 'payout', label: 'Payouts' },
  { scope: 'live', label: 'Live account' },
  { scope: 'other', label: 'Other' },
]

export function CompleteSpecifications({ sel }: { sel: SelectedPlan }) {
  // Un ensemble, pas un booleen : chaque categorie s'ouvre sans fermer les
  // autres. Comparer deux categories est le cas d'usage courant.
  const [ouvertes, setOuvertes] = useState<string[]>([])
  const bascule = (scope: string) =>
    setOuvertes((v) => (v.includes(scope) ? v.filter((x) => x !== scope) : [...v, scope]))

  const connues = new Set(CATEGORIES_REGLES.map((c) => c.scope))
  const groupes = new Map<string, typeof sel.rules>()
  for (const r of sel.rules) {
    const cle = connues.has(r.scope) && r.scope !== 'other' ? r.scope : 'other'
    const g = groupes.get(cle) || []
    g.push(r)
    groupes.set(cle, g)
  }
  if (groupes.size === 0) return null

  const visibles = CATEGORIES_REGLES.filter((c) => (groupes.get(c.scope) || []).length > 0)

  return (
    <Section
      id="specifications"
      title="Complete rules and permissions"
      intro="Below the decision blocks, on purpose. Open only the category you need."
    >
      <div className="space-y-2">
        {visibles.map(({ scope, label }) => {
          const rules = groupes.get(scope) || []
          const ouverte = ouvertes.includes(scope)
          const aConfirmer = rules.filter((r) => r.confidence === 'needs_confirmation').length
          return (
            <div key={scope} className="border border-gray-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => bascule(scope)}
                aria-expanded={ouverte}
                aria-controls={`regles-${scope}`}
                className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between gap-3 text-left bg-gray-900/50 hover:bg-gray-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span className="text-white text-sm font-medium">{label}</span>
                <span className="flex items-center gap-2 flex-shrink-0">
                  {/* Le compte des regles non confirmees est visible categorie
                      fermee : sinon il faut tout ouvrir pour savoir ou regarder. */}
                  {aConfirmer > 0 && (
                    <span className="text-amber-400/80 text-xs">{aConfirmer} unconfirmed</span>
                  )}
                  <span className="text-gray-500 text-xs tabular-nums">{rules.length}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform motion-reduce:transition-none ${ouverte ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </span>
              </button>
              {ouverte && (
                <ul id={`regles-${scope}`} className="p-3 space-y-2 border-t border-gray-800">
                  {rules.map((r) => (
                    <li key={r.title} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                      <p className="text-white text-sm font-medium">{r.title}</p>
                      {r.detail ? <p className="text-gray-400 text-sm mt-0.5">{r.detail}</p> : null}
                      {r.confidence === 'needs_confirmation' ? (
                        <p className="text-amber-400/80 text-xs mt-1">Not confirmed</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}

// =============================================================================
// A TRADUIRE PLUS TARD
// =============================================================================
// Ces sections sont en anglais seulement, comme le brief le demande. La liste
// sert de point de depart a la tache de localisation.
export const PENDING_KEYS = [
  'Your selection', 'Amount payable today', 'Profit target', 'Maximum loss', 'Daily loss',
  'Consistency', 'Evaluation → funded', 'First payout', 'Profit split',
  'Five rules that decide this account', 'Can breach the account', 'Payout condition',
  'Restriction', 'Allowed', 'Needs confirmation',
  'What happens after payment', 'Purchase', 'Evaluation', 'Funded access',
  'Simulated funded', 'True cost', 'Pay today', 'Standard price',
  'Reset after a failure', 'Activation once you pass', 'Due after passing', 'Refund',
  'Payout conditions', 'Minimum request', 'Payout cap per request',
  'Days between requests', 'Minimum trading days', 'Minimum profitable days',
  'Consistency once funded', 'Buffer', 'Scaling',
  'Good fit if you…', 'Consider another plan if…',
  'Evidence and verification', 'Show the sources used', 'Hide sources',
  'Complete rules and permissions', 'Show the full rules', 'Hide the full rules',
  'Not confirmed', 'Affiliate disclosure sentence',
]
