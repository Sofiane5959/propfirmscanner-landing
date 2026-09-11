'use client'

// =============================================================================
// PAGE UNIVERSELLE D'UNE PROP FIRM   components/prop-firm/UniversalFirmPage.tsx
// =============================================================================
// Reproduit le gabarit HTML « Universal Prop Firm Page » fourni par Sofiane,
// avec les ajustements qu'il a demandes :
//   - logo cliquable, par le tunnel d'affiliation (code promo pre-rempli) ;
//   - le nom seul en titre, sans etiquette de marche au-dessus ;
//   - le configurateur de compte construit comme celui de la fiche Earn2Trade
//     (ChallengeSelector) : etapes numerotees, cartes, selection a droite ;
//   - en fin de page : strengths and things to know, Ready to pick your
//     program?, Similar firms. Pas d'avertissement de risque.
//
// Le composant recoit la fiche de la firme (data/firms/<slug>.json) et, depuis
// la route, les liens sortants et les firmes similaires. Aucune logique propre
// a une firme.
// =============================================================================

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

import s from './UniversalFirmPage.module.css'
import {
  type FirmSheet,
  type SimilarFirm,
  PHASE_LABEL,
  discounted,
  faqItems,
  firmType,
  isEstimate,
  marketsLabel,
  money,
  offerApplies,
  orderedPhases,
  pct,
  programmeTagline,
  promoSelection,
  ruleRows,
  sizeLabel,
} from '@/lib/firm-sheet'
import { AFFILIATE_LINK_PROPS } from '@/lib/affiliate'

/** Affiche a la place d'une information que la fiche ne donne pas encore. */
const TIRET = '—'

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')
const unique = <T,>(valeurs: T[]): T[] => Array.from(new Set(valeurs))
const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? 's' : ''}`

function CopyButton({ code, label }: { code: string; label: string }) {
  const [texte, setTexte] = useState(label)
  return (
    <button
      type="button"
      className={cx(s.btn, s.secondary)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code)
          setTexte('Copied!')
          setTimeout(() => setTexte(label), 1300)
        } catch {
          setTexte('Select code')
        }
      }}
    >
      {texte}
    </button>
  )
}

interface Etape {
  titre: string
  compacte: boolean
  options: { key: string; label: string; accroche?: string; detail?: string }[]
  actif: string
  choisir: (key: string) => void
}

export default function UniversalFirmPage({
  sheet,
  ctaHref,
  logoHref,
  similarFirms = [],
}: {
  sheet: FirmSheet
  ctaHref: string
  logoHref: string
  similarFirms?: SimilarFirm[]
}) {
  const programmes = sheet.programmes.filter((p) => p.plans.length > 0)
  const promo = promoSelection(programmes)

  // La selection de depart est le plan « MOST POPULAR PLAN » quand il y en a un.
  const [marcheKey, setMarche] = useState(promo?.programme.marche ?? programmes[0]?.marche ?? '')
  const [programmeKey, setProgramme] = useState(promo?.programme.slug ?? '')
  const [varianteKey, setVariante] = useState(promo?.plan.variante ?? '')
  const [tailleKey, setTaille] = useState(promo ? String(promo.plan.taille) : '')
  const [phaseKey, setPhase] = useState('')

  // Chaque niveau retombe sur le premier choix valable quand le niveau du
  // dessus change : aucune combinaison impossible ne peut rester affichee.
  const marches = unique(programmes.map((p) => p.marche))
  const programmesDuMarche = programmes.filter((p) => p.marche === marcheKey)
  const programmesVisibles = programmesDuMarche.length > 0 ? programmesDuMarche : programmes
  const programme = programmesVisibles.find((p) => p.slug === programmeKey) ?? programmesVisibles[0] ?? null
  const variantes = programme ? unique(programme.plans.map((pl) => pl.variante ?? '')) : []
  const variante = variantes.includes(varianteKey) ? varianteKey : variantes[0] ?? ''
  const plansDeVariante = programme
    ? programme.plans.filter((pl) => (pl.variante ?? '') === variante).sort((a, b) => a.taille - b.taille)
    : []
  const plan = plansDeVariante.find((pl) => String(pl.taille) === tailleKey) ?? plansDeVariante[0] ?? null
  const phases = plan ? orderedPhases(plan.phases) : []
  const phase = phases.find((ph) => ph.phase === phaseKey) ?? phases[0] ?? null
  const devise = plan?.devise ?? 'USD'

  const offre = sheet.offre
  const offreAppliquee = Boolean(offre && programme && plan && offerApplies(offre, programme.slug, plan.taille))
  const prixRemise =
    offre && offreAppliquee && plan?.prix != null ? discounted(plan.prix, offre.remise) : null

  // --- Carte d'identite : les quatre cases restent, meme vides ---------------
  const faits: [string, string][] = [
    ['Founded', sheet.anneeCreation != null ? String(sheet.anneeCreation) : TIRET],
    ['Country', sheet.pays ?? TIRET],
    ['CEO / Founder', sheet.ceoFondateur ?? TIRET],
    ['Firm type', sheet.marches.length > 0 ? firmType(sheet.marches) : TIRET],
  ]
  // Une ligne vide dans la cellule du tableur separe deux paragraphes.
  const paragraphes = (sheet.presentation ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  // --- Bande : les quatre cartes restent, meme vides ---------------------------
  const bande: [string, string[]][] = [
    ['Tradable assets', sheet.actifs.length > 0 ? sheet.actifs : [TIRET]],
    ['Platforms', sheet.plateformes.length > 0 ? sheet.plateformes : [TIRET]],
    ['Payment methods', sheet.moyensPaiement.length > 0 ? sheet.moyensPaiement : [TIRET]],
    ['Trading profile', [`Leverage ${sheet.levier ?? TIRET}`, ...sheet.stylesTrading]],
  ]

  // --- Configurateur : une etape a un seul choix n'est pas affichee -------------
  const etapes: Etape[] = (
    [
      {
        titre: 'Choose your market',
        compacte: false,
        options: marches.map((m) => ({
          key: m,
          label: marketsLabel([m]),
          detail: pluriel(programmes.filter((p) => p.marche === m).length, 'programme'),
        })),
        actif: programme?.marche ?? '',
        choisir: setMarche,
      },
      {
        titre: 'How do you want to be funded?',
        compacte: false,
        options: programmesVisibles.map((p) => {
          const prix = p.plans.map((pl) => pl.prix).filter((x): x is number => x != null)
          const tailles = unique(p.plans.map((pl) => pl.taille)).length
          return {
            key: p.slug,
            label: p.nom,
            accroche: programmeTagline(p),
            detail:
              pluriel(tailles, 'size') +
              (prix.length > 0 ? ` · from ${money(Math.min(...prix), p.plans[0]?.devise ?? 'USD')}` : ''),
          }
        }),
        actif: programme?.slug ?? '',
        choisir: setProgramme,
      },
      {
        titre: 'Choose your variant',
        compacte: false,
        options: variantes.map((v) => ({
          key: v,
          label: v || 'Standard',
          detail: pluriel(programme?.plans.filter((pl) => (pl.variante ?? '') === v).length ?? 0, 'size'),
        })),
        actif: variante,
        choisir: setVariante,
      },
      {
        titre: 'Pick your account size',
        compacte: true,
        options: plansDeVariante.map((pl) => ({
          key: String(pl.taille),
          label: sizeLabel(pl.taille, pl.devise),
          detail: pl.prix != null ? money(pl.prix, pl.devise) : undefined,
        })),
        actif: plan ? String(plan.taille) : '',
        choisir: setTaille,
      },
    ] as Etape[]
  ).filter((e) => e.options.length > 1)

  // --- Lignes de la selection --------------------------------------------------
  const phaseEvaluation = plan?.phases.find((ph) => ph.phase === 'evaluation') ?? null
  const phaseFinancee = plan?.phases.find((ph) => ph.phase === 'funded') ?? null
  const premierePhase = phases[0] ?? null
  const lignesSelection = (
    [
      ['Profit target', phaseEvaluation?.objectifProfit != null ? money(phaseEvaluation.objectifProfit, devise) : null],
      ['Max drawdown', premierePhase?.perteMax != null ? money(premierePhase.perteMax, devise) : null],
      [
        'Daily loss',
        premierePhase?.perteJour == null
          ? null
          : premierePhase.perteJour === 'aucune'
            ? 'None'
            : money(premierePhase.perteJour, devise),
      ],
      ['Max contracts', premierePhase?.maxContrats != null ? String(premierePhase.maxContrats) : null],
      ['Profit split', phaseFinancee?.partage != null ? pct(phaseFinancee.partage) : null],
    ] as [string, string | null][]
  ).filter((l): l is [string, string] => Boolean(l[1]))

  const lignesRegles = phase ? ruleRows(phase, devise) : []

  const conditions = (
    [
      ['TRADING', 'Assets, leverage & permissions', sheet.conditions.trading],
      ['COMMISSION', 'Fees linked to trading', sheet.conditions.commission],
      ['PAYOUTS', 'Payout policy', sheet.conditions.retraits],
    ] as [string, string, string | null][]
  ).filter((c): c is [string, string, string] => Boolean(c[2]))

  const faq = faqItems(sheet)
  const { pointsForts, limites } = sheet.verdict

  return (
    <div className={s.root}>
      {/* ===================================================== CARTE D'IDENTITE */}
      <section className={s.section}>
        <div className={cx(s.wrap, s.grid2, offre ? s.heroGrid : s.single)}>
          <article className={cx(s.card, s.heroLeft)}>
            <div className={s.identity}>
              {/* Le logo passe par le tunnel d'affiliation : le visiteur arrive
                  chez la firme avec notre lien, et le code quand elle le prend
                  en parametre. */}
              <a
                href={logoHref}
                {...AFFILIATE_LINK_PROPS}
                className={s.logo}
                aria-label={offre ? `Visit ${sheet.nom} with code ${offre.code}` : `Visit ${sheet.nom}`}
              >
                {sheet.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sheet.logoUrl} alt="" />
                ) : (
                  sheet.nom.charAt(0)
                )}
              </a>
              <h1 className={s.h1}>{sheet.nom}</h1>
            </div>
            {paragraphes.map((texte, i) => (
              <p key={i} className={i === 0 ? s.lead : s.leadMore}>
                {texte}
              </p>
            ))}
            <div className={s.facts}>
              {faits.map(([label, valeur]) => (
                <div key={label} className={s.fact}>
                  <small>{label}</small>
                  <strong>{valeur}</strong>
                </div>
              ))}
            </div>
          </article>

          {offre && (
            <aside className={cx(s.card, s.deal)}>
              {promo && (
                <>
                  <span className={s.pill}>MOST POPULAR PLAN</span>
                  <h2>
                    {promo.programme.nom} · {sizeLabel(promo.plan.taille, promo.plan.devise)}
                  </h2>
                </>
              )}
              <div className={s.discount}>{pct(offre.remise)} OFF</div>
              <span className={s.label}>Exclusive code</span>
              <div className={s.codeRow}>
                <div className={s.code}>{offre.code}</div>
                <CopyButton code={offre.code} label="Copy code" />
              </div>
              <a href={ctaHref} {...AFFILIATE_LINK_PROPS} className={cx(s.btn, s.primary, s.full)}>
                Claim deal →
              </a>
            </aside>
          )}
        </div>
      </section>

      {/* ================================================================ BANDE */}
      <section className={cx(s.section, s.sectionTight)}>
        <div className={cx(s.wrap, s.strip)}>
          {bande.map(([label, chips]) => (
            <div key={label} className={s.card}>
              <span className={s.label}>{label}</span>
              <div className={s.chips}>
                {chips.map((chip, i) => (
                  <span key={`${chip}-${i}`} className={s.chip}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================ ACCOUNT CONFIGURATOR */}
      {programme && plan && (
        <section className={cx(s.section, s.anchor)} id="accounts">
          <div className={s.wrap}>
            <div className={s.head}>
              <div>
                <span className={s.eyebrow}>Account configurator</span>
                <h2>Find the program that fits you</h2>
                <p>Start with your goal. Price and rules update as you choose.</p>
              </div>
            </div>

            <div className={cx(s.configurator, etapes.length === 0 && s.single)}>
              {etapes.length > 0 && (
                <div className={s.steps}>
                  {etapes.map((etape, i) => (
                    <fieldset key={etape.titre} className={s.step}>
                      <legend className={s.legend}>
                        <span className={s.stepNum}>{i + 1}</span>
                        {etape.titre}
                      </legend>
                      <div className={cx(s.choices, etape.compacte && s.choicesCompact)}>
                        {etape.options.map((o) => (
                          <button
                            key={o.key}
                            type="button"
                            aria-pressed={o.key === etape.actif}
                            className={cx(
                              s.choice,
                              etape.compacte && s.choiceCompact,
                              o.key === etape.actif && s.choiceActive
                            )}
                            onClick={() => etape.choisir(o.key)}
                          >
                            {o.accroche && <span className={s.choiceTagline}>{o.accroche}</span>}
                            <span className={s.choiceName}>{o.label}</span>
                            {o.detail && <span className={s.choiceDetail}>{o.detail}</span>}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              )}

              <aside className={s.selection} aria-live="polite">
                <span className={s.eyebrow}>Your selection</span>
                <h3 className={s.selectionTitle}>
                  {programme.nom} {sizeLabel(plan.taille, plan.devise)}
                  {variante ? ` · ${variante}` : ''}
                </h3>

                {plan.prix != null && (
                  <div className={s.selectionPrice}>
                    {offre && prixRemise != null ? (
                      <>
                        <span className={s.price}>
                          {isEstimate(offre) ? '≈ ' : ''}
                          {money(prixRemise, devise)}
                        </span>
                        <span className={s.old}>{money(plan.prix, devise)}</span>
                        <div className={s.saving}>
                          {pct(offre.remise)} with {offre.code}
                        </div>
                      </>
                    ) : (
                      <span className={s.price}>{money(plan.prix, devise)}</span>
                    )}
                  </div>
                )}

                {lignesSelection.length > 0 && (
                  <dl className={s.rows}>
                    {lignesSelection.map(([label, valeur]) => (
                      <div key={label} className={s.rowItem}>
                        <dt>{label}</dt>
                        <dd>{valeur}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {offre && offreAppliquee && (
                  <div className={s.codeRow}>
                    <div className={s.code}>{offre.code}</div>
                    <CopyButton code={offre.code} label="Copy" />
                  </div>
                )}
                {/* Le bouton nomme le benefice quand un code s'applique — le meme
                    libelle que la carte promo — et la destination sinon. */}
                <a href={ctaHref} {...AFFILIATE_LINK_PROPS} className={cx(s.btn, s.primary, s.full)}>
                  {offre && offreAppliquee ? 'Claim deal' : `Continue to ${sheet.nom}`}
                  <ExternalLink className={s.icon} aria-hidden="true" />
                </a>
                {offre && !offreAppliquee && (
                  <p className={s.fine}>Code {offre.code} is not listed for this selection.</p>
                )}
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================= RULES BY PHASE */}
      {programme && phase && lignesRegles.length > 0 && (
        <section className={cx(s.section, s.anchor)} id="rules">
          <div className={s.wrap}>
            <div className={s.head}>
              <div>
                <span className={s.eyebrow}>Rules by phase</span>
                <h2>
                  {programme.nom}:{' '}
                  {phases.length > 1 ? 'evaluation vs funded' : `${PHASE_LABEL[phase.phase].toLowerCase()} rules`}
                </h2>
                <p>Only rules applicable to the current selection appear here.</p>
              </div>
            </div>
            <div className={s.card}>
              {phases.length > 1 && (
                <div className={s.tabs} role="tablist">
                  {phases.map((ph) => (
                    <button
                      key={ph.phase}
                      type="button"
                      role="tab"
                      aria-selected={ph.phase === phase.phase}
                      className={cx(s.tab, ph.phase === phase.phase && s.tabActive)}
                      onClick={() => setPhase(ph.phase)}
                    >
                      {PHASE_LABEL[ph.phase]}
                    </button>
                  ))}
                </div>
              )}
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Rule</th>
                      <th>{PHASE_LABEL[phase.phase]} value</th>
                      <th>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lignesRegles.map((ligne) => (
                      <tr key={ligne.label}>
                        <td>{ligne.label}</td>
                        <td>{ligne.value}</td>
                        <td>{ligne.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ TRADING AND PAYOUT CONDITIONS */}
      {conditions.length > 0 && (
        <section className={s.section}>
          <div className={s.wrap}>
            <div className={s.head}>
              <div>
                <span className={s.eyebrow}>More details</span>
                <h2>Trading and payout conditions</h2>
              </div>
            </div>
            <div className={s.rulesGrid}>
              {conditions.map(([pastille, titre, texte]) => (
                <article key={pastille} className={cx(s.card, s.rule)}>
                  <span className={s.pill}>{pastille}</span>
                  <h3>{titre}</h3>
                  <p>{texte}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== VERDICT */}
      {(sheet.verdict.texte || sheet.verdict.pourQui.length > 0 || sheet.verdict.pasPour.length > 0) && (
        <section className={cx(s.section, s.anchor)} id="verdict">
          <div className={s.wrap}>
            <div className={s.head}>
              <div>
                <span className={s.eyebrow}>PropFirmScanner verdict</span>
                <h2>Who we recommend {sheet.nom} for</h2>
              </div>
            </div>
            <div className={cx(s.verdict, sheet.verdict.pasPour.length === 0 && s.single)}>
              {(sheet.verdict.texte || sheet.verdict.pourQui.length > 0) && (
                <article className={s.card}>
                  <h3>Our verdict</h3>
                  {sheet.verdict.texte && <p className={s.lead}>{sheet.verdict.texte}</p>}
                  {sheet.verdict.pourQui.length > 0 && (
                    <ul className={s.list}>
                      {sheet.verdict.pourQui.map((raison) => (
                        <li key={raison}>{raison}</li>
                      ))}
                    </ul>
                  )}
                </article>
              )}
              {sheet.verdict.pasPour.length > 0 && (
                <article className={s.card}>
                  <h3>Consider another firm if…</h3>
                  <ul className={cx(s.list, s.no)}>
                    {sheet.verdict.pasPour.map((limite) => (
                      <li key={limite}>{limite}</li>
                    ))}
                  </ul>
                </article>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== FAQ */}
      {faq.length > 0 && (
        <section className={cx(s.section, s.anchor)} id="faq">
          <div className={s.wrap}>
            <div className={s.head}>
              <div>
                <span className={s.eyebrow}>FAQ</span>
                <h2>Frequently asked questions</h2>
              </div>
            </div>
            <div className={cx(s.card, s.faq)}>
              {faq.map((q, i) => (
                <details key={q.question} open={i === 0}>
                  <summary>{q.question}</summary>
                  <p>{q.reponse}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================= STRENGTHS AND THINGS TO KNOW */}
      {(pointsForts.length > 0 || limites.length > 0) && (
        <section className={cx(s.section, s.anchor)} id="strengths">
          <div className={s.wrap}>
            <div className={s.head}>
              <div>
                <span className={s.eyebrow}>Honest view</span>
                <h2>{sheet.nom}: strengths and things to know</h2>
                <p>Our independent analysis, based on verified official rules and documents.</p>
              </div>
            </div>
            <div className={cx(s.prosCons, (pointsForts.length === 0 || limites.length === 0) && s.single)}>
              {pointsForts.length > 0 && (
                <article className={cx(s.card, s.pros)}>
                  <h3>Strengths</h3>
                  <ul className={s.list}>
                    {pointsForts.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              )}
              {limites.length > 0 && (
                <article className={cx(s.card, s.cons)}>
                  <h3>Things to know</h3>
                  <ul className={cx(s.list, s.info)}>
                    {limites.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================== READY TO PICK YOUR PROGRAM? */}
      {programme && plan && (
        <section className={s.section}>
          <div className={s.wrap}>
            <div className={cx(s.card, s.ready)}>
              <h2>Ready to pick your program?</h2>
              <p>Configure your account and check the rules one last time before payment.</p>
              <div className={s.readyLine}>
                <span>
                  {programme.nom} · {sizeLabel(plan.taille, plan.devise)}
                </span>
                {plan.prix != null &&
                  (offre && prixRemise != null ? (
                    <span>
                      <span className={s.oldInline}>{money(plan.prix, devise)}</span>
                      {isEstimate(offre) ? '≈ ' : ''}
                      {money(prixRemise, devise)}
                    </span>
                  ) : (
                    <span>{money(plan.prix, devise)}</span>
                  ))}
              </div>
              <a href="#accounts" className={cx(s.btn, s.primary)}>
                Configure my account
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= SIMILAR FIRMS */}
      {similarFirms.length > 0 && (
        <section className={s.section}>
          <div className={s.wrap}>
            <div className={s.head}>
              <div>
                <h2>Similar firms</h2>
              </div>
            </div>
            <div className={s.similarGrid}>
              {similarFirms.map((f) => (
                <a key={f.id} href={f.href} className={cx(s.card, s.similarCard)}>
                  <div className={s.similarLogo}>
                    {f.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.logoUrl} alt="" />
                    ) : (
                      f.name.charAt(0)
                    )}
                  </div>
                  <div className={s.similarText}>
                    <div className={s.similarName}>{f.name}</div>
                    <div className={s.similarMeta}>
                      {[
                        f.rating != null && f.rating > 0 ? `★ ${f.rating.toFixed(1)}` : null,
                        f.minPrice ? `from $${f.minPrice}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </div>
                  <span className={s.chevron} aria-hidden="true">
                    ›
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
