'use client'

// 7.  Modules optionnels — parcours ; puis « What else is included? ».
// 8.  Trading and payout conditions — trois cartes structurees, filtrees par
//     la selection (programme, taille, phase) : aucune prose repetee.
// 9.  PropFirmScanner verdict — un seul bloc : conclusion, Best for, Things to know.
// 10. FAQ.  11. CTA final.  12. Similar firms.
// Chaque section disparait quand la fiche n'a rien a y mettre.

import { AlertTriangle, Check, ChevronDown, GraduationCap, Info, ListChecks, Receipt, Wallet } from 'lucide-react'

import { type FirmSheet, type SimilarFirm, etapeLabel, sizeLabel } from '@/lib/firm-sheet'
import { faqProfil, fraisDeSelection, libellePhase, reglesDeCarte } from '@/lib/firm-profile'
import { prixSelection } from './AccountConfigurator'
import { COPY } from './copy'
import type { FirmSelection } from './useFirmSelection'
import {
  BTN_SECONDARY,
  CARD,
  CARD_ACCENT,
  CHIP,
  EYEBROW,
  LABEL,
  PromoGroup,
  Section,
  SectionHeading,
  StatusBadge,
  cx,
} from './ui'

const COLONNES: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

// --- 7. Modules optionnels ---------------------------------------------------
export function OptionalModules({ sheet }: { sheet: FirmSheet }) {
  const { parcours, formation, comptesApresReussite: comptes } = sheet
  // 22/09 : les comptes proposes apres la reussite suivent le parcours, dans
  // la meme section ; la formation a sa propre section.
  const carteCompte = (c: (typeof comptes)[number], dansEtape: boolean) => (
    <article key={c.nom} className={cx(CARD, 'flex flex-col p-4', dansEtape && 'bg-bg-base')}>
      {!dansEtape && <p className={EYEBROW}>{COPY.modules.accounts}</p>}
      <h3 className={cx('font-semibold', !dansEtape && 'mt-1')}>{c.nom}</h3>
      {c.description && <p className="mt-1 text-sm text-text-muted">{c.description}</p>}
      {c.lignes.length > 0 && (
        <dl className="mt-auto divide-y divide-border pt-2 text-sm">
          {c.lignes.map((l) => (
            <div key={l.libelle} className="flex justify-between gap-3 py-1.5">
              <dt className="text-text-muted">{l.libelle}</dt>
              <dd className="text-right font-semibold">{l.valeur}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
  const cartesComptes = comptes.map((c) => carteCompte(c, false))
  const comptesDansParcours = parcours.length > 0
  // 23/09 : la formation s'ouvre a l'achat de l'evaluation ; elle tient en une
  // ligne dans l'etape « evaluation » du parcours. Sans cette etape, elle garde
  // sa propre section.
  const aFormation = !!formation && (formation.elements.length > 0 || !!formation.intro)
  const iEvaluation = aFormation ? parcours.findIndex((e) => e.etape === 'evaluation') : -1
  const modules = comptesDansParcours ? [] : cartesComptes

  return (
    <>
      {parcours.length > 0 && (
        <Section labelledBy="journey-title">
          <SectionHeading
            id="journey-title"
            eyebrow={COPY.modules.journeyEyebrow}
            title={COPY.modules.journeyTitle}
            intro={COPY.modules.journeyIntro}
          />
          {/* Frise verticale (22/09, « ergonomic and smooth ») : une etape par ligne,
              reliees par un trait ; les comptes a choisir s'ouvrent dans l'etape
              « funded ». Sans cette etape, ils suivent la frise. */}
          {(() => {
            const iFunded = comptes.length > 0 ? parcours.findIndex((e) => e.etape === 'funded') : -1
            return (
              <div className={cx(CARD, 'p-4 sm:p-6')}>
                <ol>
                  {parcours.map((etape, i) => {
                    const libelle = etapeLabel(etape.etape)
                    // Le libelle se tait quand il repete le titre (« Payout » / « Payouts »).
                    const doublon = etape.titre.toLowerCase().startsWith(libelle.toLowerCase())
                    const derniere = i === parcours.length - 1
                    return (
                      <li key={etape.titre} className={cx('relative flex gap-4', !derniere && 'pb-6')}>
                        {!derniere && <span aria-hidden="true" className="absolute bottom-0 left-4 top-9 w-px -translate-x-1/2 bg-border" />}
                        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent-border bg-accent/15 text-sm font-bold text-accent">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1 pt-1">
                          {!doublon && <p className={LABEL}>{libelle}</p>}
                          <h3 className="font-semibold">{etape.titre}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-text-muted">{etape.texte}</p>
                          {i === iEvaluation && formation && (
                            <p className="mt-2 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-accent-border bg-accent/5 px-3 py-1.5 text-sm">
                              <GraduationCap className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                              <span className="font-semibold text-text-primary">{formation.titre ?? COPY.modules.training}</span>
                              {formation.elements.length > 0 && <span className="text-text-muted">{formation.elements.join(' · ')}</span>}
                            </p>
                          )}
                          {i === iFunded && (
                            <div className={cx('mt-3 grid items-stretch gap-3', comptes.length > 1 && 'sm:grid-cols-2')}>
                              {comptes.map((c) => carteCompte(c, true))}
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
                {iFunded < 0 && cartesComptes.length > 0 && (
                  <div className={cx('mt-4 grid items-stretch gap-3', COLONNES[Math.min(cartesComptes.length, 3)])}>{cartesComptes}</div>
                )}
              </div>
            )
          })()}
        </Section>
      )}
      {aFormation && iEvaluation < 0 && formation && (
        <Section labelledBy="training-title">
          <SectionHeading
            id="training-title"
            eyebrow={COPY.modules.trainingEyebrow}
            title={formation.titre ?? COPY.modules.training}
            intro={formation.intro ?? undefined}
          />
          {formation.elements.length > 0 && (
            <ul className={cx('grid items-stretch gap-3', COLONNES[Math.min(formation.elements.length, 4)])}>
              {formation.elements.map((el) => (
                <li key={el} className={cx(CARD, 'flex items-center gap-3 p-4')}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                    <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-text-primary">{el}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}
      {modules.length > 0 && (
        <Section labelledBy="included-title">
          <SectionHeading id="included-title" eyebrow={COPY.modules.includedEyebrow} title={COPY.modules.includedTitle} />
          {/* Meme hauteur pour toutes les cartes (commentaire du 22/09) ; leurs listes se calent en bas. */}
          <div className={cx('grid items-stretch gap-3', COLONNES[Math.min(modules.length, 3)])}>{modules}</div>
        </Section>
      )}
    </>
  )
}

// --- 8. Trading and payout conditions -----------------------------------------
// Trois cartes, sans repeter ce qui est deja ailleurs : le partage, le plafond
// et le minimum de retrait sont dans le configurateur et les regles ; le prix
// dans le configurateur. Chaque regle tient sur une ligne de titre et une
// phrase ; les bloquantes et les reserves passent en tete.
// Le tableur designe les regles essentielles (quatre par carte au plus) : elles
// s'affichent toutes. Sans selection dans le tableur, on s'arrete a quatre.
const REGLES_VISIBLES = 4

// Une regle courte (« Not allowed. ») se lit comme une ligne de tableau :
// libelle a gauche, valeur a droite. Les phrases gardent leur paragraphe.
const REGLE_COURTE = 40

function LigneRegle({ r, phase, sansBadge = false }: { r: FirmSheet['regles'][number]; phase: string | null; sansBadge?: boolean }) {
  if (r.texte.length <= REGLE_COURTE && r.statut === 'confirmed') {
    return (
      <li className="flex items-baseline justify-between gap-3 py-2.5">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-text-primary">{r.regle}</span>
          {phase && <span className={CHIP}>{phase}</span>}
          {r.bloquante && !sansBadge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger-subtle px-2 py-0.5 text-[11px] font-medium text-danger">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              {COPY.conditions.breach}
            </span>
          )}
        </span>
        <span className="shrink-0 text-right text-sm font-semibold text-text-primary">{r.texte.replace(/\.$/, '')}</span>
      </li>
    )
  }
  return (
    <li className="py-2.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-sm font-semibold text-text-primary">{r.regle}</span>
        {phase && <span className={CHIP}>{phase}</span>}
        {r.bloquante && !sansBadge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-danger-subtle px-2 py-0.5 text-[11px] font-medium text-danger">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {COPY.conditions.breach}
          </span>
        )}
        {r.statut !== 'confirmed' && <StatusBadge statut={r.statut} />}
      </div>
      <p className="mt-0.5 text-[13px] leading-relaxed text-text-muted">{r.texte}</p>
    </li>
  )
}

function ListeRegles({
  regles,
  nomPhase,
  visibles = REGLES_VISIBLES,
}: {
  regles: FirmSheet['regles']
  nomPhase: (cle: string | null) => string | null
  visibles?: number
}) {
  if (regles.length === 0) return null
  // L'etiquette de phase n'informe que si la carte melange plusieurs phases ;
  // « Funded » sur chaque ligne des retraits n'etait que du bruit (22/09).
  const phaseUtile = new Set(regles.map((r) => r.phase ?? '')).size > 1
  const phaseDe = (cle: string | null) => (phaseUtile ? nomPhase(cle) : null)
  // 22/09 : les regles qui font perdre le compte passent en tete, dans un
  // encadre a part, au lieu d'un badge perdu au milieu de la liste.
  const bloquantes = regles.filter((r) => r.bloquante)
  const autres = regles.filter((r) => !r.bloquante)
  const reste = autres.slice(visibles)
  return (
    <div className="flex flex-col gap-3">
      {bloquantes.length > 0 && (
        <div className="rounded-lg border border-danger/30 bg-danger-subtle px-3">
          <p className="flex items-center gap-1.5 pt-2.5 text-xs font-bold uppercase tracking-wider text-danger">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {COPY.conditions.hardRules}
          </p>
          <ul className="divide-y divide-danger/20">
            {bloquantes.map((r) => (
              <LigneRegle key={`${r.regle}-${r.phase}`} r={r} phase={phaseDe(r.phase)} sansBadge />
            ))}
          </ul>
        </div>
      )}
      {autres.length > 0 && (
        <ul className="divide-y divide-border">
          {autres.slice(0, visibles).map((r) => (
            <LigneRegle key={`${r.regle}-${r.phase}`} r={r} phase={phaseDe(r.phase)} />
          ))}
        </ul>
      )}
      {reste.length > 0 && (
        <details className="group border-t border-border">
          <summary className="cursor-pointer list-none py-2.5 text-sm font-semibold text-accent marker:hidden">
            <span className="group-open:hidden">{COPY.conditions.showMore(reste.length)}</span>
            <span className="hidden group-open:inline">{COPY.conditions.showLess}</span>
          </summary>
          <ul className="divide-y divide-border">
            {reste.map((r) => (
              <LigneRegle key={`${r.regle}-${r.phase}`} r={r} phase={phaseDe(r.phase)} />
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

/** Un titre par carte, avec son icone : plus de sur-titre + sous-titre (22/09). */
function EnteteCarte({ icone: Icone, titre }: { icone: typeof Wallet; titre: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 border-b border-border pb-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
        <Icone className="h-4 w-4" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold">{titre}</h3>
    </div>
  )
}

export function ConditionsSection({ sheet, sel }: { sheet: FirmSheet; sel: FirmSelection }) {
  const { programme, plan } = sel
  if (!programme || !plan) return null
  const nomPhase = (cle: string | null) => {
    const ph = cle ? plan.phases.find((p) => p.phase === cle) : null
    return ph ? libellePhase(ph, plan, programme) : null
  }

  const trading = reglesDeCarte(sheet, 'trading', programme, plan)
  const frais = fraisDeSelection(sheet, programme, plan)
  const retraits = reglesDeCarte(sheet, 'payouts', programme, plan)
  const live = reglesDeCarte(sheet, 'live', programme, plan)
  const payoutsVide = retraits.length === 0 && live.length === 0 && !sheet.prestataireRetrait && sheet.methodesRetrait.length === 0
  const essentielles = sheet.regles.some((r) => r.essentielle)

  const carteTrading = trading.length > 0 && (
    <article key="trading" className={cx(CARD, 'flex flex-col p-4 sm:p-5')}>
      <EnteteCarte icone={ListChecks} titre={COPY.conditions.trading} />
      <ListeRegles regles={trading} nomPhase={nomPhase} visibles={essentielles ? trading.length : REGLES_VISIBLES} />
    </article>
  )
  const cartePayouts = !payoutsVide && (
    <article key="payouts" className={cx(CARD, 'flex flex-col p-4 sm:p-5')}>
      <EnteteCarte icone={Wallet} titre={COPY.conditions.payouts} />
      {(sheet.prestataireRetrait || sheet.methodesRetrait.length > 0) && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {sheet.prestataireRetrait && (
            <span className="text-sm">
              <span className="text-text-muted">{COPY.conditions.provider}: </span>
              <span className="font-semibold">{sheet.prestataireRetrait}</span>
            </span>
          )}
          {sheet.methodesRetrait.map((m) => (
            <span key={m} className={CHIP}>
              {m}
            </span>
          ))}
        </div>
      )}
      <ListeRegles
        regles={[...retraits, ...live]}
        nomPhase={nomPhase}
        visibles={essentielles ? retraits.length + live.length : REGLES_VISIBLES}
      />
    </article>
  )
  // Les frais en tuiles sur toute la largeur : un montant se lit d'un coup d'oeil.
  const carteFrais = frais.length > 0 && (
    <article key="fees" className={cx(CARD, 'p-4 sm:p-5')}>
      <EnteteCarte icone={Receipt} titre={COPY.conditions.fees} />
      <dl className={cx('grid gap-3', COLONNES[Math.min(frais.length, 3)])}>
        {frais.map((f) => (
          <div key={f.libelle} className="flex flex-col rounded-lg border border-border bg-bg-base p-4">
            <dt className={LABEL}>{f.libelle}</dt>
            <dd className="mt-1 font-display text-xl font-bold tabular-nums text-text-primary">{f.valeur}</dd>
            {f.note && <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{f.note}</p>}
          </div>
        ))}
      </dl>
    </article>
  )

  const colonnes = [carteTrading, cartePayouts].filter(Boolean)
  if (colonnes.length === 0 && !carteFrais) return null
  // Regles de trading et retraits cote a cote, de meme hauteur ; les frais dessous.
  return (
    <Section labelledBy="conditions-title">
      <SectionHeading id="conditions-title" eyebrow={COPY.conditions.eyebrow} title={COPY.conditions.title} intro={COPY.conditions.intro} />
      {colonnes.length > 0 && (
        <div className={cx('grid items-stretch gap-3', colonnes.length === 2 && 'lg:grid-cols-2')}>{colonnes}</div>
      )}
      {carteFrais && <div className={cx(colonnes.length > 0 && 'mt-3')}>{carteFrais}</div>}
    </Section>
  )
}

// --- 9. PropFirmScanner verdict -----------------------------------------------------
// Meme en-tete que les autres sections ; la conclusion en tete, puis deux
// colonnes jumelles : Best for (vert) et Things to know (ambre).
export function VerdictSection({ sheet }: { sheet: FirmSheet }) {
  const { texte, pourQui, limites } = sheet.verdict
  if (!texte && pourQui.length === 0 && limites.length === 0) return null

  const colonne = (titre: string, items: string[], ton: 'pour' | 'contre') => (
    <div className={cx('rounded-lg border p-4', ton === 'pour' ? 'border-accent-border bg-accent/5' : 'border-warning/30 bg-warning-subtle')}>
      <p className={cx('flex items-center gap-2 text-sm font-bold uppercase tracking-wider', ton === 'pour' ? 'text-accent' : 'text-warning')}>
        {ton === 'pour' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Info className="h-4 w-4" aria-hidden="true" />}
        {titre}
      </p>
      <ul className="mt-2 divide-y divide-border text-sm">
        {items.map((p) => (
          <li key={p} className="py-2 text-text-secondary">
            {p}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <Section id="verdict" labelledBy="verdict-title">
      <SectionHeading id="verdict-title" eyebrow={COPY.verdict.eyebrow} title={COPY.verdict.title} />
      <article className={cx(CARD, 'p-4 sm:p-5')}>
        {texte && <p className="max-w-4xl text-base leading-relaxed text-text-primary">{texte}</p>}
        {(pourQui.length > 0 || limites.length > 0) && (
          <div className={cx('grid gap-3', texte && 'mt-4', pourQui.length > 0 && limites.length > 0 && 'md:grid-cols-2')}>
            {pourQui.length > 0 && colonne(COPY.verdict.bestFor, pourQui, 'pour')}
            {limites.length > 0 && colonne(COPY.verdict.thingsToKnow, limites, 'contre')}
          </div>
        )}
      </article>
    </Section>
  )
}

// --- 10. FAQ -----------------------------------------------------------------------
export function FaqSection({ sheet }: { sheet: FirmSheet }) {
  const faq = faqProfil(sheet)
  if (faq.length === 0) return null
  return (
    <Section id="faq" labelledBy="faq-title">
      <SectionHeading id="faq-title" eyebrow={COPY.faq.eyebrow} title={COPY.faq.title} intro={COPY.faq.intro(sheet.nom)} />
      <div className="grid gap-2">
        {faq.map((q, i) => (
          <details key={q.question} open={i === 0} className={cx(CARD, 'group px-4 sm:px-5')}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-base font-semibold marker:hidden">
              {q.question}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform group-open:rotate-180">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </span>
            </summary>
            <p className="-mt-1 pb-4 text-sm leading-relaxed text-text-secondary">{q.reponse}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

// --- 11. CTA final -------------------------------------------------------------------
export function FinalCta({
  sheet,
  sel,
  claimHref,
  continueHref,
}: {
  sheet: FirmSheet
  sel: FirmSelection
  claimHref: string
  continueHref: string
}) {
  const { programme, plan } = sel
  if (!programme || !plan) return null
  const prix = prixSelection(sheet, sel)
  const offre = sheet.offre
  return (
    <Section>
      <div
        data-check="final-cta"
        className={cx(CARD_ACCENT, 'grid items-center gap-5 bg-gradient-to-r from-accent/10 to-bg-elevated p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]')}
      >
        <div>
          <p className={EYEBROW}>{COPY.final.eyebrow}</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{COPY.final.title(sheet.nom)}</h2>
          <p className="mt-1 text-sm text-text-muted tabular-nums">
            {programme.nom} · {sizeLabel(plan.taille, plan.devise)}
            {prix ? ` · ${prix}` : ''}
          </p>
        </div>
        <div className="rounded-lg border border-accent-border bg-bg-base p-3">
          <PromoGroup
            code={offre && sel.offreAppliquee ? offre.code : null}
            claimHref={offre && sel.offreAppliquee ? claimHref : null}
            continueHref={continueHref}
            continueLabel={COPY.commercial.continueTo(sheet.nom)}
          />
        </div>
      </div>
    </Section>
  )
}

// --- 12. Similar firms ---------------------------------------------------------------
export function SimilarFirms({ nom, firms }: { nom: string; firms: SimilarFirm[] }) {
  if (firms.length === 0) return null
  return (
    <Section labelledBy="similar-title">
      <SectionHeading id="similar-title" title={COPY.similar.title} />
      <div className={cx('grid gap-3', COLONNES[Math.min(firms.length, 3)])}>
        {firms.map((f) => (
          // Toute la carte est le lien (21/09) : on clique ou l'on veut, pas seulement sur le bouton.
          <a
            key={f.id}
            href={f.href}
            className={cx(
              CARD,
              'group flex flex-col p-4 transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-1 font-bold text-bg-base">
                {f.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.logoUrl} alt="" className="h-full w-full object-contain" />
                ) : (
                  f.name.charAt(0)
                )}
              </div>
              {f.remise != null && <span className={EYEBROW}>{COPY.similar.off(f.remise)}</span>}
            </div>
            <h3 className="mt-3 font-semibold">{f.name}</h3>
            {f.code && (
              <span className="mb-3 mt-2 inline-flex self-start rounded-md border border-accent-border px-2 py-1 font-mono text-sm font-bold tracking-wider text-accent">
                {f.code}
              </span>
            )}
            <span className={cx(BTN_SECONDARY, 'mt-auto w-full group-hover:border-border-hover')}>{COPY.similar.view}</span>
          </a>
        ))}
      </div>
    </Section>
  )
}
