'use client'

// =============================================================================
// PAGE FIRME PILOTE  components/prop-firm/FirmPage.tsx
// =============================================================================
//
// Composant GENERIQUE. Aucun branchement sur un slug ici : il rend ce que le
// modele contient, et ce que le modele ne contient pas disparait.
//
// Il ne requete rien, ne fusionne rien, n'arbitre rien. Toute la resolution
// des sources et des priorites a eu lieu dans `buildFirmPageModel`, cote
// serveur. C'est la difference avec l'ancienne page, qui lisait dix tables et
// tranchait a l'endroit du rendu — d'ou Nitro annoncant deux drawdowns
// contradictoires sur le meme ecran.
//
// PHASE PILOTE
//
// L'activation par firme est decidee dans `page.tsx`, pas ici. Le jour ou le
// pilote est valide, il suffit d'elargir la liste : aucun code de ce fichier
// ne change.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, ExternalLink, ChevronDown } from 'lucide-react'
import FirmLogo from '@/components/FirmLogo'
import { AFFILIATE_LINK_PROPS } from '@/lib/affiliate'
import { formatMoney } from '@/lib/format'
import type { FirmPageModel, PlanRow, PhaseRow } from '@/lib/firm-page-model'

interface Props {
  model: FirmPageModel
  /** URL de suivi deja construite cote serveur, jamais une URL partenaire brute. */
  ctaHref: string
  locale?: string
}

// -----------------------------------------------------------------------------
// PETITS BLOCS
// -----------------------------------------------------------------------------

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id?: string
  eyebrow?: string
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 print:scroll-mt-0">
      <div className="mb-5">
        {eyebrow && (
          <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">{eyebrow}</p>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        {intro && <p className="text-gray-400 mt-2 max-w-2xl">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

function CopyCode({ code }: { code: string }) {
  const [fait, setFait] = useState(false)
  useEffect(() => {
    if (!fait) return
    const t = setTimeout(() => setFait(false), 2000)
    return () => clearTimeout(t)
  }, [fait])
  return (
    <button
      type="button"
      onClick={() => {
        // Echoue en contexte non securise et sur certains navigateurs mobiles.
        // On avale l'erreur : le code reste selectionnable a la main.
        navigator.clipboard?.writeText(code).then(() => setFait(true)).catch(() => {})
      }}
      aria-label={`Copy code ${code}`}
      className="inline-flex items-center gap-2 min-h-[44px] px-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      {code}
      <span className="font-sans text-xs text-emerald-400/80 inline-flex items-center gap-1">
        {fait ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {fait ? 'Copied' : 'Copy code'}
      </span>
    </button>
  )
}

/** Une valeur absente s'ecrit, elle ne se devine pas. */
function Val({ v, unit }: { v: number | string | null | undefined; unit?: string }) {
  if (v === null || v === undefined) return <span className="text-gray-600">Not stated</span>
  return (
    <span className="text-gray-200">
      {typeof v === 'number' ? v.toLocaleString('en-US') : v}
      {unit ?? ''}
    </span>
  )
}

function pct(v: number | null): string | null {
  return v === null || v === undefined ? null : `${Math.round(v * 100)}%`
}

// -----------------------------------------------------------------------------
// COMPOSANT
// -----------------------------------------------------------------------------

export default function FirmPage({ model, ctaHref, locale = 'en' }: Props) {
  const { identity, firmFacts, catalogue, programs, offer, rules, bundles, liveTiers, narrative } = model

  const tousLesPlans = useMemo(() => programs.flatMap((p) => p.plans), [programs])
  // Le plan par defaut vient du modele : la selection existe donc des le rendu
  // serveur, et le bloc d'offre est present dans le HTML.
  const [planId, setPlanId] = useState<string>(model.defaultPlanId ?? tousLesPlans[0]?.id ?? '')
  const plan: PlanRow | null = tousLesPlans.find((p) => p.id === planId) ?? tousLesPlans[0] ?? null
  const programme = programs.find((p) => p.slug === plan?.programSlug) ?? null

  const prix = plan ? offer?.priceByPlanId[plan.id] ?? null : null
  const remise = plan ? offer?.percentByPlanId[plan.id] ?? null : null
  const avertissement = plan ? offer?.betterPublicOfferByPlanId[plan.id] ?? null : null
  const devise = plan?.currency ?? 'USD'
  const argent = (n: number) => formatMoney(n, locale, '', devise)

  const taille = (n: number) => (n >= 1000 ? `$${n / 1000}K` : `$${n}`)

  return (
    <div className="min-h-screen bg-gray-950 print:min-h-0">
      {/* ==================================================================== */}
      {/* 1. HERO — identite a gauche, offre a droite                          */}
      {/* ==================================================================== */}
      <section className="border-b border-gray-800 px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          <div className="min-w-0">
            {/* Logo et nom UNE fois. Le H1 porte la proposition de valeur. */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <FirmLogo src={identity.logoUrl} name={identity.name} size={48} padding="p-1.5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold leading-tight">{identity.name}</p>
                {identity.marketBadge && (
                  <p className="text-emerald-400 text-xs font-medium">{identity.marketBadge}</p>
                )}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
              {identity.headline}
            </h1>
            {identity.intro && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{identity.intro}</p>
            )}

            {/* Fondation, pays, type : trois faits d'etat civil, pas un bloc. */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400">
              {identity.foundedYear && <span>Founded {identity.foundedYear}</span>}
              {identity.country && <span>{identity.country}</span>}
              {identity.firmType && <span>{identity.firmType}</span>}
            </div>
            {identity.verifiedAt && (
              <p className="text-gray-600 text-xs mt-3">
                Firm information reviewed on {identity.verifiedAt.slice(0, 10)}
              </p>
            )}
          </div>

          {/* --- L'offre --- */}
          <aside className="bg-gray-900/70 border border-emerald-500/30 rounded-2xl p-5">
            {offer && offer.code && remise !== null ? (
              <>
                <p className="text-3xl font-bold text-emerald-400 leading-none mb-1">{remise}% OFF</p>
                <p className="text-gray-500 text-xs mb-4">with code</p>
                <div className="mb-4">
                  <CopyCode code={offer.code} />
                </div>

                {plan && programme && (
                  <p className="text-white text-sm font-medium mb-1">
                    {programme.name} {taille(plan.accountSize)}
                  </p>
                )}
                {prix && (
                  <p className="mb-4">
                    <s className="text-gray-600 text-sm mr-2">{argent(prix.list)}</s>
                    <span className="text-white text-xl font-semibold">{argent(prix.final)}</span>
                  </p>
                )}

                <a
                  href={ctaHref}
                  {...AFFILIATE_LINK_PROPS}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
                >
                  Claim deal
                  <ExternalLink className="w-4 h-4" />
                </a>

                {avertissement && (
                  <p className="text-amber-400/80 text-xs mt-2">{avertissement}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">{offer.disclosure}</p>
              </>
            ) : (
              <a
                href={ctaHref}
                {...AFFILIATE_LINK_PROPS}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
              >
                Visit {identity.name}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </aside>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. BANDE COMPACTE — ce qui disqualifie en deux secondes              */}
      {/* ==================================================================== */}
      <section className="border-b border-gray-800 px-4 py-5">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          {[
            { label: 'Tradable assets', values: catalogue.assets },
            {
              label: 'Platforms',
              // Seules celles qu'on peut choisir a l'achat. Les autres sont
              // signalees plus bas, jamais melangees a celles-ci.
              values: catalogue.platforms.filter((p) => p.selectable).map((p) => p.name),
            },
            { label: 'Payment methods', values: catalogue.paymentMethods },
            { label: 'Data feeds', values: catalogue.dataFeeds },
          ]
            .filter((g) => g.values.length > 0)
            .map((g) => (
              <div key={g.label}>
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                  {g.label}
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {g.values.map((v) => (
                    <li
                      key={v}
                      className="px-2.5 py-1 rounded-md bg-gray-900/60 border border-gray-800 text-gray-300 text-xs"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Les faits de firme, uniquement ceux vrais partout. Deux sur les
            quatre d'avant : la structure refuse les autres. */}
        {firmFacts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-5 pt-4 border-t border-gray-800 flex flex-wrap gap-x-6 gap-y-2">
            {firmFacts.map((f) => (
              <span key={f.label} className="text-sm">
                <Check className="w-3.5 h-3.5 text-emerald-400 inline mr-1.5 -mt-0.5" />
                <span className="text-white font-medium">{f.label}</span>
                {f.detail && <span className="text-gray-500"> — {f.detail}</span>}
              </span>
            ))}
          </div>
        )}
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* ================================================================== */}
        {/* 3. SELECTION DU COMPTE                                             */}
        {/* ================================================================== */}
        {programs.length > 0 && plan && (
          <Section
            id="challenges"
            eyebrow="Account configurator"
            title="Choose your program and account size"
            intro="Price and rules update with your selection."
          >
            {/* Un lecteur d'ecran doit entendre le changement de selection. */}
            <p className="sr-only" role="status" aria-live="polite">
              {programme ? `Selected: ${programme.name} ${taille(plan.accountSize)}` : ''}
            </p>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
              <div className="min-w-0 space-y-5">
                <div role="radiogroup" aria-label="Program" className="grid sm:grid-cols-2 gap-3">
                  {programs.map((p) => {
                    const actif = p.slug === programme?.slug
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        role="radio"
                        aria-checked={actif}
                        onClick={() => setPlanId(p.plans[0].id)}
                        className={`min-h-[44px] text-left p-4 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                          actif
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                        }`}
                      >
                        <span className="block text-white font-semibold">{p.name}</span>
                        <span className="block text-gray-400 text-xs mt-1">
                          {p.kind === 'instant'
                            ? 'Funded from purchase, no evaluation'
                            : `${p.evaluationSteps ?? 1}-step evaluation`}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {programme && (
                  <div role="radiogroup" aria-label="Account size" className="flex flex-wrap gap-2">
                    {programme.plans.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={p.id === plan.id}
                        onClick={() => setPlanId(p.id)}
                        className={`min-h-[44px] px-4 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                          p.id === plan.id
                            ? 'border-emerald-500 bg-emerald-500/10 text-white'
                            : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        {taille(p.accountSize)}
                      </button>
                    ))}
                  </div>
                )}

                {programme?.differentiator && (
                  <p className="text-gray-400 text-sm leading-relaxed">{programme.differentiator}</p>
                )}
              </div>

              {/* Resume : meme hauteur que la colonne de gauche, collant. */}
              <aside className="lg:sticky lg:top-20 bg-gray-900/70 border border-emerald-500/25 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">
                  Your selection
                </p>
                <p className="text-white font-semibold mb-3">
                  {programme?.name} {taille(plan.accountSize)}
                </p>

                {prix ? (
                  <p className="mb-3">
                    <s className="text-gray-600 text-sm mr-2">{argent(prix.list)}</s>
                    <span className="text-emerald-400 text-xl font-semibold">{argent(prix.final)}</span>
                    {remise !== null && (
                      <span className="text-gray-500 text-xs ml-2">−{remise}%</span>
                    )}
                  </p>
                ) : plan.listPrice != null ? (
                  <p className="text-white text-xl font-semibold mb-3">{argent(plan.listPrice)}</p>
                ) : null}

                {offer?.code && (
                  <div className="mb-3">
                    <CopyCode code={offer.code} />
                  </div>
                )}

                <dl className="space-y-1.5 mb-4 text-sm">
                  {plan.phases.map((ph) => (
                    <div key={ph.phase} className="flex justify-between gap-3">
                      <dt className="text-gray-500">
                        {ph.phase === 'sim_funded' ? 'Funded split' : 'Profit target'}
                      </dt>
                      <dd className="text-right">
                        {ph.phase === 'sim_funded' ? (
                          <Val v={pct(ph.profitSplit)} />
                        ) : (
                          <Val v={ph.profitTarget != null ? argent(ph.profitTarget) : null} />
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={ctaHref}
                  {...AFFILIATE_LINK_PROPS}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
                >
                  Claim deal
                  <ExternalLink className="w-4 h-4" />
                </a>
                {avertissement && <p className="text-amber-400/80 text-xs mt-2">{avertissement}</p>}
                {offer && <p className="text-gray-500 text-xs mt-2">{offer.disclosure}</p>}
              </aside>
            </div>
          </Section>
        )}

        {/* ================================================================== */}
        {/* 4. PLUS DE DETAILS                                                 */}
        {/* ================================================================== */}
        {plan && programme && (
          <Section
            id="rules"
            eyebrow="More details"
            title={`${programme.name}: rules by phase`}
            intro="Only the phases this program actually has."
          >
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Rule
                    </th>
                    {plan.phases.map((ph) => (
                      <th
                        key={ph.phase}
                        className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                      >
                        {ph.phase === 'evaluation'
                          ? 'Evaluation'
                          : ph.phase === 'evaluation_2'
                            ? 'Verification'
                            : 'Funded'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(
                    [
                      ['Profit target', (p: PhaseRow) => (p.profitTarget != null ? argent(p.profitTarget) : null)],
                      ['Maximum loss', (p: PhaseRow) => (p.maximumLoss != null ? argent(p.maximumLoss) : null)],
                      // « Aucune » et « non renseigne » sont deux reponses
                      // differentes : les confondre coute cher au lecteur.
                      ['Daily loss', (p: PhaseRow) => (p.dailyLoss != null ? argent(p.dailyLoss) : p.dailyLossStated ? 'None' : null)],
                      ['Drawdown', (p: PhaseRow) => p.drawdownType],
                      ['Consistency', (p: PhaseRow) => pct(p.consistencyRule)],
                      ['Max contracts', (p: PhaseRow) => p.maxContracts],
                      ['Minimum days', (p: PhaseRow) => p.minimumTradingDays],
                      ['Profit split', (p: PhaseRow) => pct(p.profitSplit)],
                      ['Payout cap', (p: PhaseRow) => (p.payoutCap != null ? argent(p.payoutCap) : null)],
                      ['Reset fee', (p: PhaseRow) => (p.resetFee != null ? argent(p.resetFee) : null)],
                    ] as [string, (p: PhaseRow) => number | string | null][]
                  ).map(([label, lire]) => (
                    <tr key={label}>
                      <td className="px-5 py-2.5 text-gray-400">{label}</td>
                      {plan.phases.map((ph) => (
                        <td key={ph.phase} className="px-5 py-2.5">
                          <Val v={lire(ph)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Regles critiques : trois categories, derivees de firm_rules. */}
            {rules.critical.length > 0 && (
              <div className="mt-6 space-y-5">
                {Array.from(
                  rules.critical.reduce((m, r) => {
                    m.set(r.category, [...(m.get(r.category) ?? []), r])
                    return m
                  }, new Map<string, typeof rules.critical>())
                ).map(([categorie, liste]) => (
                  <div key={categorie}>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
                      {categorie}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {liste.map((r) => (
                        <article
                          key={r.title}
                          className={`bg-gray-900/50 border rounded-xl p-4 ${
                            r.severity === 'hard_breach'
                              ? 'border-red-500/30'
                              : r.severity === 'payout_condition'
                                ? 'border-amber-500/25'
                                : 'border-gray-800'
                          }`}
                        >
                          <h3 className="text-white font-semibold text-sm mb-1">{r.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{r.detail}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Le detail exhaustif, replie. */}
            {rules.complete.length > 0 && (
              <details className="mt-6 group">
                <summary className="min-h-[44px] inline-flex items-center gap-2 px-4 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-300 text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                  See all {rules.complete.length} permissions and restrictions
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="mt-3 space-y-2">
                  {rules.complete.map((r) => (
                    <li key={r.title} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                      <p className="text-white text-sm font-medium">{r.title}</p>
                      {r.detail && <p className="text-gray-400 text-sm mt-0.5">{r.detail}</p>}
                      {r.confidence === 'needs_confirmation' && (
                        <p className="text-amber-400/80 text-xs mt-1">Not confirmed</p>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {/* Bundles et paliers live : enfin rendus. */}
            {(bundles.length > 0 || liveTiers.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {bundles.filter((b) => b.programSlug === programme.slug).length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
                      Bundle discounts
                    </p>
                    <ul className="space-y-1 text-sm">
                      {bundles
                        .filter((b) => b.programSlug === programme.slug)
                        .map((b) => (
                          <li key={b.accountNumber} className="flex justify-between gap-3">
                            <span className="text-gray-400">Account {b.accountNumber}</span>
                            <span className="text-gray-200">
                              {b.discountPercent != null ? `−${Math.round(b.discountPercent * 100)}%` : '—'}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                {liveTiers.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
                      Live account progression
                    </p>
                    <ul className="space-y-1 text-sm">
                      {liveTiers.map((t) => (
                        <li key={t.accountSize} className="flex justify-between gap-3">
                          <span className="text-gray-400">{taille(t.accountSize)}</span>
                          <span className="text-gray-200">
                            {t.lossFloor != null ? `${argent(t.lossFloor)} loss floor` : '—'}
                            {t.cushion != null ? ` · ${argent(t.cushion)} cushion` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Section>
        )}

        {/* ================================================================== */}
        {/* 5 et 6. VERDICT ET RECOMMANDATION                                  */}
        {/* ================================================================== */}
        {narrative.about.length > 0 && (
          <Section id="about" title={`About ${identity.name}`}>
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
              {narrative.about.map((p, i) => (
                <p key={i} className={`text-gray-300 text-sm leading-relaxed ${i > 0 ? 'mt-3' : ''}`}>
                  {p}
                </p>
              ))}
            </div>
          </Section>
        )}

        {(narrative.strengths.length > 0 || narrative.limits.length > 0) && (
          <Section title={`${identity.name}: strengths and things to know`}>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { titre: 'Strengths', items: narrative.strengths, couleur: 'text-emerald-400' },
                { titre: 'Things to know', items: narrative.limits, couleur: 'text-amber-400' },
              ]
                .filter((c) => c.items.length > 0)
                .map((c) => (
                  <div key={c.titre} className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
                    <p className="text-white font-semibold text-sm mb-3">{c.titre}</p>
                    <ul className="space-y-2">
                      {c.items.map((it, i) => (
                        <li key={i} className="text-gray-400 text-sm">
                          <span className={`${c.couleur} mr-1.5`}>·</span>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {narrative.verdict && (
          <Section id="verdict" eyebrow="PropFirmScanner verdict" title="Who we recommend it to">
            <p className="text-gray-300 leading-relaxed mb-5 max-w-3xl">{narrative.verdict.body}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {narrative.verdict.goodFit.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <p className="text-white font-semibold text-sm mb-3">A good fit if you want</p>
                  <ul className="space-y-2">
                    {narrative.verdict.goodFit.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {narrative.verdict.poorFit.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <p className="text-white font-semibold text-sm mb-3">Consider another firm if you…</p>
                  <ul className="space-y-2">
                    {narrative.verdict.poorFit.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                        <span className="text-amber-400 mt-0.5 flex-shrink-0">·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ================================================================== */}
        {/* 7. FAQ                                                             */}
        {/* ================================================================== */}
        {narrative.faq.length > 0 && (
          <Section id="faq" eyebrow="FAQ" title="Frequently asked questions">
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 items-start">
              {narrative.faq.map((f) => (
                <details
                  key={f.question}
                  className="group bg-gray-900/40 border border-gray-800 rounded-xl px-4"
                >
                  <summary className="min-h-[44px] flex items-center justify-between gap-3 text-white text-sm font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                    {f.question}
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-gray-400 text-sm leading-relaxed pb-4">{f.answer}</p>
                </details>
              ))}
            </div>
          </Section>
        )}

        {/* ================================================================== */}
        {/* 8. AVERTISSEMENT DE RISQUE                                         */}
        {/* ================================================================== */}
        {/* Court et discret, mais present : une fiche de produit financier
            sans avertissement est une decision, pas un oubli. Il ne depend
            d'aucune donnee, donc il ne peut pas disparaitre avec une colonne
            vide. */}
        <p className="text-gray-600 text-xs leading-relaxed border-t border-gray-800 pt-6">
          Trading involves substantial risk of loss. Prop firm evaluations are
          simulated environments and performance shown is hypothetical. Only
          trade with capital you can afford to lose, and read the firm&rsquo;s
          full rules before purchasing.
        </p>
      </div>
    </div>
  )
}
