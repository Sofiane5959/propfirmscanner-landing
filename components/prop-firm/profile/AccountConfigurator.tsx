'use client'

// 4. Account configurator — deux colonnes de meme hauteur (contrat visuel) :
//    a gauche les choix (une etape a un seul choix n'apparait pas), a droite
//    le resume : selection complete, phases, prix, remise, chiffres, code,
//    Copy code et Continue to [Firm].
// 5. Program comparison — une carte par programme ; la choisir pilote le
//    configurateur.

import { type FirmSheet, type SheetPhase, type SheetProgramme, marketsLabel, pct, sizeLabel } from '@/lib/firm-sheet'
import { cellule, lignesSelection, parcoursPhases } from '@/lib/firm-profile'
import { COPY } from './copy'
import { prixPlan, prixRemise } from './format'
import type { FirmSelection } from './useFirmSelection'
import {
  CARD,
  CARD_ACCENT,
  CHOICE,
  CHOICE_ACTIVE,
  CHOICE_IDLE,
  EYEBROW,
  LABEL,
  PromoGroup,
  Section,
  SectionHeading,
  StatusBadge,
  Valeur,
  cx,
} from './ui'

interface Choix {
  key: string
  label: string
  detail?: string
}

interface Etape {
  titre: string
  choix: Choix[]
  actif: string
  choisir: (key: string) => void
}

export function AccountConfigurator({
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
  const { programme, plan, offreAppliquee, prixRemise: remise, phases } = sel
  if (!programme || !plan) return null
  const offre = sheet.offre

  const etapes: Etape[] = [
    {
      titre: COPY.configurator.market,
      choix: sel.marches.map((m) => ({
        key: m,
        label: marketsLabel([m]),
        detail: COPY.configurator.programs(sel.programmes.filter((p) => p.marche === m).length),
      })),
      actif: sel.marche,
      choisir: sel.setMarche,
    },
    {
      titre: COPY.configurator.program,
      choix: sel.programmesVisibles.map((p) => {
        const moinsCher = p.plans.filter((pl) => pl.prix != null).sort((a, b) => (a.prix ?? 0) - (b.prix ?? 0))[0]
        return {
          key: p.slug,
          label: p.nom,
          detail:
            (p.accroche ?? (p.type === 'instant' ? COPY.configurator.noEvaluation : COPY.configurator.evaluation)) +
            (moinsCher?.prix != null ? ` · ${COPY.configurator.fromPrice(prixPlan(moinsCher.prix, moinsCher))}` : ''),
        }
      }),
      actif: programme.slug,
      choisir: sel.setProgramme,
    },
    {
      titre: COPY.configurator.variant,
      choix: sel.variantes.map((v) => ({ key: v, label: v || COPY.configurator.standard })),
      actif: sel.variante,
      choisir: sel.setVariante,
    },
    {
      titre: COPY.configurator.size,
      choix: sel.plansDeVariante.map((pl) => ({
        key: String(pl.taille),
        label: sizeLabel(pl.taille, pl.deviseCompte),
        detail: pl.prix != null ? prixPlan(pl.prix, pl) : undefined,
      })),
      actif: String(plan.taille),
      choisir: sel.setTaille,
    },
    ...sel.groupesOptions.map((g) => ({
      titre: COPY.configurator[g.type],
      choix: g.options.map((o) => ({ key: o.nom, label: o.nom, detail: o.detail ?? undefined })),
      actif: g.actif.nom,
      choisir: g.choisir,
    })),
  ].filter((e) => e.choix.length > 1)

  const lignes = lignesSelection(plan)

  return (
    <Section id="accounts" labelledBy="accounts-title">
      <SectionHeading id="accounts-title" eyebrow={COPY.configurator.eyebrow} title={COPY.configurator.title(sheet.nom)} intro={COPY.configurator.intro} />

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        {/* Les etapes se partagent la hauteur du resume : pas de vide sous la derniere. */}
        <div className={cx(CARD, 'flex flex-col gap-2.5 p-4')}>
          {etapes.map((etape, i) => (
            <fieldset key={etape.titre} className="flex min-w-0 flex-1 flex-col rounded-lg border border-border p-3">
              <legend className="sr-only">{etape.titre}</legend>
              <p aria-hidden="true" className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-bg-base">{i + 1}</span>
                {etape.titre}
              </p>
              <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                {etape.choix.map((c) => {
                  const actif = c.key === etape.actif
                  return (
                    <button
                      key={c.key}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => etape.choisir(c.key)}
                      className={cx(CHOICE, actif ? CHOICE_ACTIVE : CHOICE_IDLE)}
                    >
                      <span className={cx('text-sm font-semibold', actif && 'text-accent')}>{c.label}</span>
                      {c.detail && <span className="text-xs text-text-muted tabular-nums">{c.detail}</span>}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <aside data-check="selection" aria-live="polite" className={cx(CARD_ACCENT, 'flex flex-col p-4 sm:p-5')}>
          <p className={EYEBROW}>{COPY.configurator.selection}</p>
          <h3 className="mt-1 font-display text-xl font-bold">
            {programme.nom} · {sizeLabel(plan.taille, plan.deviseCompte)}
            {sel.variante ? ` · ${sel.variante}` : ''}
          </h3>
          {phases.length > 0 && (
            <p className="mt-0.5 text-xs text-text-muted">
              {COPY.configurator.phases}: {parcoursPhases(plan, programme, phases)}
            </p>
          )}

          {plan.prix != null && (
            <div className="mt-3">
              {offre && remise != null ? (
                <>
                  <p className="font-display text-[38px] font-bold leading-none tabular-nums">
                    {prixRemise(remise, plan, offre)}
                    <span className="ml-2 align-middle text-base font-normal text-text-muted line-through">{prixPlan(plan.prix, plan)}</span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-accent">{COPY.configurator.withCode(pct(offre.remise), offre.code)}</p>
                </>
              ) : (
                <p className="font-display text-[38px] font-bold leading-none tabular-nums">{prixPlan(plan.prix, plan)}</p>
              )}
            </div>
          )}

          {lignes.length > 0 && (
            <dl className="my-3 grid flex-1 auto-rows-[minmax(60px,1fr)] grid-cols-2 gap-2">
              {lignes.map((l) => (
                <div key={l.libelle} className="flex flex-col justify-center rounded-lg border border-border bg-bg-base px-3 py-2">
                  <dt className={LABEL}>{l.libelle}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">
                    <Valeur cellule={l.valeur} />
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <PromoGroup
            code={offre && offreAppliquee ? offre.code : null}
            claimHref={offre && offreAppliquee ? claimHref : null}
            continueHref={continueHref}
            continueLabel={COPY.commercial.continueTo(sheet.nom)}
          />
          {offre && !offreAppliquee && (
            <p className="mt-2 text-center text-xs text-text-muted">{COPY.configurator.notListed(offre.code)}</p>
          )}
        </aside>
      </div>
    </Section>
  )
}

// 20 septembre : ces cartes ne se choisissent pas. Le programme se choisit a
// l'etape 1 ; ici on lit les quatre cote a cote.
/**
 * Les chiffres qui distinguent un programme d'un autre, tires de la fiche :
 * prix de depart, tailles, phases d'evaluation, partage. Les cartes n'etaient
 * qu'un nom et une phrase (commentaire du 22/09 : « too empty »).
 */
function chiffresProgramme(p: SheetProgramme): { libelle: string; valeur: string }[] {
  const plans = p.plans.filter((pl) => pl.prix != null)
  const moinsCher = [...plans].sort((a, b) => (a.prix ?? 0) - (b.prix ?? 0))[0]
  const tailles = Array.from(new Set(p.plans.map((pl) => pl.taille))).sort((a, b) => a - b)
  const devise = p.plans[0]?.deviseCompte ?? 'USD'
  const evaluations = p.type === 'instant' ? 0 : Math.max(0, ...p.plans.map((pl) => pl.phases.filter((ph) => ph.phase !== 'funded').length))
  const taux = p.plans
    .flatMap((pl) => pl.phases)
    .filter((ph) => ph.phase === 'funded' && ph.partage != null)
    .flatMap((ph) => (ph.partageBas != null ? [ph.partageBas, ph.partage as number] : [ph.partage as number]))
  const min = Math.min(...taux)
  const max = Math.max(...taux)
  // 23/09 : les chiffres ci-dessus se ressemblent d'un programme a l'autre.
  // Ces trois-la ne dependent pas de la taille du compte et separent vraiment
  // les routes : type de perte maximale, jours minimum, regle de regularite.
  const commun = <T,>(lire: (ph: SheetPhase) => T | null | undefined): T | null => {
    const valeurs = p.plans
      .map((pl) => pl.phases.find((ph) => ph.phase !== 'funded'))
      .filter((ph): ph is SheetPhase => !!ph)
      .map(lire)
    if (valeurs.length === 0 || valeurs.some((v) => v == null || v !== valeurs[0])) return null
    return valeurs[0] as T
  }
  const typePerte = commun((ph) => ph.typePerteMax)
  const joursMin = commun((ph) => ph.joursMin)
  const regularite = commun((ph) => ph.regularite)
  const lignes: ({ libelle: string; valeur: string } | null)[] = [
    moinsCher?.prix != null ? { libelle: COPY.comparison.from, valeur: prixPlan(moinsCher.prix, moinsCher) } : null,
    tailles.length > 0
      ? {
          libelle: COPY.comparison.sizes,
          valeur: tailles.length === 1
            ? sizeLabel(tailles[0], devise)
            : `${sizeLabel(tailles[0], devise)} – ${sizeLabel(tailles[tailles.length - 1], devise)}`,
        }
      : null,
    { libelle: COPY.comparison.evaluation, valeur: evaluations === 0 ? COPY.comparison.noEvaluation : COPY.comparison.phases(evaluations) },
    typePerte ? { libelle: COPY.comparison.lossType, valeur: typePerte } : null,
    joursMin != null ? { libelle: COPY.comparison.minDays, valeur: joursMin === 0 ? COPY.comparison.none : String(joursMin) } : null,
    regularite != null
      ? { libelle: COPY.comparison.consistency, valeur: regularite === 'aucune' ? COPY.comparison.none : pct(regularite as number) }
      : null,
    taux.length > 0 ? { libelle: COPY.comparison.split, valeur: min === max ? pct(min) : `${pct(min)} – ${pct(max)}` } : null,
  ]
  return lignes.filter((x): x is { libelle: string; valeur: string } => x != null)
}

export function ProgramComparison({ sel }: { sel: FirmSelection }) {
  if (sel.programmesVisibles.length < 2 || !sel.programme) return null
  const n = sel.programmesVisibles.length
  // Aider a choisir (commentaire du 22/09) : les chiffres qui different
  // restent dans les cartes, ceux que tous les programmes partagent passent
  // sur une ligne commune sous la grille.
  const parProgramme = sel.programmesVisibles.map((p) => chiffresProgramme(p))
  const libelles = Array.from(new Set(parProgramme.flat().map((c) => c.libelle)))
  // Une carte sans « Max funded accounts » garde la ligne, vide : les chiffres
  // restent alignes d'une carte a l'autre.
  const ligneComptes = sel.programmesVisibles.some((p) => cellule(p.maxComptes == null ? null : String(p.maxComptes), p.maxComptesStatut))
  const communs = libelles.filter((l) => {
    const valeurs = parProgramme.map((cs) => cs.find((c) => c.libelle === l)?.valeur)
    return valeurs.every((v) => v != null && v === valeurs[0])
  })
  return (
    <Section labelledBy="comparison-title">
      <SectionHeading id="comparison-title" eyebrow={COPY.comparison.eyebrow} title={COPY.comparison.title(n)} intro={COPY.comparison.intro} />
      {/* Autant de colonnes que de programmes (2, 3 ou 4) : pas de case vide. */}
      <div className={cx('grid gap-3 sm:grid-cols-2', n === 3 && 'lg:grid-cols-3', n >= 4 && 'lg:grid-cols-4')}>
        {sel.programmesVisibles.map((p) => {
          const comptes = cellule(p.maxComptes == null ? null : String(p.maxComptes), p.maxComptesStatut)
          const chiffres = chiffresProgramme(p).filter((c) => !communs.includes(c.libelle))
          return (
            <article key={p.slug} className={cx(CARD, 'flex flex-col gap-1.5 p-4')}>
              {p.accroche && <span className={EYEBROW}>{p.accroche}</span>}
              {/* Nom du programme plus present (commentaire du 22/09). */}
              <h3 className="border-l-4 border-accent pl-2.5 font-display text-[22px] font-bold leading-tight text-text-primary">{p.nom}</h3>
              {p.resume && <span className="text-sm leading-relaxed text-text-muted">{p.resume}</span>}
              {/* Pied de carte : chiffres et comptes max, cales en bas pour s'aligner d'une carte a l'autre. */}
              <div className="mt-auto pt-2">
                {chiffres.length > 0 && (
                  <dl className="grid grid-cols-2 gap-2">
                    {chiffres.map((c) => (
                      <div key={c.libelle} className="rounded-lg border border-accent-border bg-accent/5 px-3 py-2">
                        <dt className={LABEL}>{c.libelle}</dt>
                        <dd className="mt-0.5 font-display text-base font-bold tabular-nums text-text-primary">{c.valeur}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {comptes && (
                  <span className="mt-2 block text-xs text-text-muted">
                    {COPY.comparison.maxAccounts}{' '}
                    <span className="font-semibold text-text-primary">
                      {comptes.statut ? <StatusBadge statut={comptes.statut} /> : comptes.texte}
                    </span>
                    {comptes.statut && p.maxComptesNote && <span className="mt-1 block leading-relaxed">{p.maxComptesNote}</span>}
                  </span>
                )}
                {!comptes && ligneComptes && (
                  <span aria-hidden="true" className="mt-2 block text-xs">
                    &nbsp;
                  </span>
                )}
              </div>
            </article>
          )
        })}
      </div>
      {communs.length > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm">
          <span className={LABEL}>{COPY.comparison.same(n)}</span>
          {communs.map((l) => (
            <span key={l} className="text-text-secondary">
              {l} <span className="font-semibold text-text-primary">{parProgramme[0].find((c) => c.libelle === l)?.valeur}</span>
            </span>
          ))}
        </p>
      )}
    </Section>
  )
}

/** Montant pour les resumes en une ligne (CTA final). */
export function prixSelection(sheet: FirmSheet, sel: FirmSelection): string | null {
  const { plan, prixRemise: remise } = sel
  if (!plan || plan.prix == null) return null
  return sheet.offre && remise != null ? prixRemise(remise, plan, sheet.offre) : prixPlan(plan.prix, plan)
}
