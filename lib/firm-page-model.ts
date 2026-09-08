// =============================================================================
// MODELE DE PAGE FIRME  lib/firm-page-model.ts
// =============================================================================
//
// POURQUOI CE FICHIER EXISTE
//
// La fiche lisait dix tables et arbitrait entre elles a l'endroit du rendu :
// le type de drawdown venait de `prop_firms.drawdown_type` dans un bloc et de
// `firm_program_plans.drawdown_type` dans un autre, les deux s'affichaient, et
// rien ne disait lequel faisait autorite. Nitro finance pouvait donc annoncer
// « Trailing Equity » a un endroit et « End of day » vingt lignes plus bas.
//
// Pire : quatre des sept tables normalisees etaient chargees a chaque requete
// puis jetees. Les 33 regles de `firm_rules` n'atteignaient jamais l'ecran, et
// `firm_platforms` — seule source distinguant les plateformes achetables des
// plateformes purement marketing — non plus.
//
// Ce fichier resout tout cela UNE fois, cote serveur, et rend un objet unique.
// Le composant de page ne requete plus rien et n'arbitre plus rien.
//
// LA REGLE DE PRECEDENCE, ECRITE UNE SEULE FOIS
//
//   1. la donnee du plan et de la phase selectionnes ;
//   2. a defaut, la donnee du programme ;
//   3. a defaut, la donnee de firme — SEULEMENT si elle est universelle ;
//   4. a defaut, `null`.
//
// Une valeur de firme ne remplace JAMAIS une valeur de programme ou de phase.
// C'est l'inverse qui se produisait : « 90 % de partage » au niveau firme
// ecrasait les 80 % d'Instant.
//
// LA SEPARATION QUI REND L'ERREUR IMPOSSIBLE
//
// `firmFacts` ne peut contenir qu'un fait partage par TOUS les programmes, et
// `universalFact()` le verifie sur les donnees plutot que sur une intention.
// Un fait propre a un programme n'a aucun chemin vers `firmFacts` : il vit
// sous `programs[].plans[].phases[]`.
// =============================================================================

import type { FirmProgramData, Program, ProgramPlan, Promotion } from '@/lib/firm-programs'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

/** D'ou vient une valeur affichee. Rend le tracage automatique. */
export interface Provenance {
  table: string
  column: string
  verifiedAt: string | null
}

export interface PhaseRow {
  /** evaluation | evaluation_2 | sim_funded */
  phase: string
  profitTarget: number | null
  maximumLoss: number | null
  dailyLoss: number | null
  /** `true` quand la source dit « aucune », `false` quand elle se tait. */
  dailyLossStated: boolean
  drawdownType: string | null
  consistencyRule: number | null
  maxContracts: number | null
  minimumTradingDays: number | null
  profitSplit: number | null
  payoutCap: number | null
  minimumPayout: number | null
  daysBetweenPayouts: number | null
  buffer: number | null
  bufferStatus: string | null
  resetFee: number | null
  activationFee: number | null
  currency: string
  confidence: string | null
}

export interface PlanRow {
  id: string
  programSlug: string
  variantKey: string | null
  accountSize: number
  currency: string
  listPrice: number | null
  phases: PhaseRow[]
}

export interface ProgramRow {
  slug: string
  name: string
  kind: string
  market: string
  evaluationSteps: number | null
  differentiator: string | null
  status: string
  maxFundedAccounts: number | null
  maxFundedNote: string | null
  plans: PlanRow[]
}

export interface OfferRow {
  code: string | null
  label: string | null
  trackingPlacement: string
  /** Ce que le visiteur doit faire. Jamais une promesse de preremplissage. */
  disclosure: string
  percentByPlanId: Record<string, number>
  priceByPlanId: Record<string, { list: number; final: number }>
  betterPublicOfferByPlanId: Record<string, string>
}

export interface FirmPageModel {
  identity: {
    slug: string
    name: string
    headline: string
    intro: string | null
    marketBadge: string | null
    logoUrl: string | null
    websiteUrl: string | null
    verifiedAt: string | null
    rating: { value: number; count: number } | null
    foundedYear: string | null
    country: string | null
    /** « Futures prop firm », « CFD prop firm »… derive du marche. */
    firmType: string | null
    /**
     * « Simulated » quand toutes les phases financees sont simulees.
     *
     * Derive du nom de phase (`sim_funded`), donc d'une donnee structuree :
     * le deduire d'une absence de licence aurait ete une inference.
     */
    accountModel: string | null
    /** Frequence de retrait au niveau firme, quand elle est renseignee. */
    payoutFrequency: string | null
  }
  /** Faits vrais pour TOUS les programmes achetables. Voir `universalFact`. */
  firmFacts: { label: string; detail: string | null }[]
  /** Faits ecartes, avec la raison. Rend la bande courte explicable. */
  firmFactsRejected: { label: string; raison: string }[]
  catalogue: {
    platforms: { name: string; selectable: boolean; note: string | null }[]
    assets: string[]
    dataFeeds: string[]
    paymentMethods: string[]
  }
  programs: ProgramRow[]
  defaultPlanId: string | null
  offer: OfferRow | null
  rules: {
    critical: { category: string; title: string; detail: string; severity: string }[]
    complete: {
      scope: string
      title: string
      detail: string | null
      severity: string | null
      confidence: string | null
      sourceUrl: string | null
    }[]
  }
  bundles: { programSlug: string; accountNumber: number; discountPercent: number | null; note: string | null }[]
  liveTiers: { accountSize: number; conversionCap: number | null; lossFloor: number | null; cushion: number | null }[]
  narrative: {
    about: string[]
    strengths: string[]
    limits: string[]
    verdict: { body: string; goodFit: string[]; poorFit: string[] } | null
    journey: { title: string; detail: string }[]
    faq: { question: string; answer: string }[]
  }
  provenance: Record<string, Provenance>
}

// -----------------------------------------------------------------------------
// OUTILS
// -----------------------------------------------------------------------------

export function planId(programSlug: string, variantKey: string | null, size: number): string {
  return `${programSlug}|${variantKey ?? ''}|${size}`
}

/**
 * Un fait n'entre dans `firmFacts` que s'il est vrai pour CHAQUE programme
 * achetable, avec une valeur EXPLICITE partout.
 *
 * Une donnee absente n'est pas une confirmation. « Aucun frais d'activation »
 * exige que chaque plan porte explicitement zero ; un `null` signifie « non
 * renseigne », et l'afficher comme un avantage serait une invention.
 *
 * C'est ici que se joue la classe d'erreur signalee trois fois : « aucune
 * limite journaliere » etait faux pour Prime, « 90 % de partage » faux pour
 * Instant, « aucune regularite une fois finance » faux pour les deux. Chacune
 * avait ete ecrite a la main dans une colonne au niveau firme.
 *
 * La fonction ne fait pas confiance a l'intention : elle interroge les plans.
 */
function universalFact<T>(
  programs: Program[],
  lecteur: (p: ProgramPlan) => T,
  filtre: (p: ProgramPlan) => boolean = () => true
): { partage: true; valeur: T } | { partage: false; raison: string } {
  // Seuls les programmes ACHETABLES comptent. Un programme retire de la vente
  // ou en cours de verification ne peut ni confirmer ni infirmer un fait.
  const eligibles = programs.filter(
    (p) => p.plans.length > 0 && (p.status === 'active' || p.status === 'promotional')
  )
  if (eligibles.length === 0) return { partage: false, raison: 'aucun programme achetable' }

  const valeurs = new Set<string>()
  let derniere: T | undefined

  for (const prog of eligibles) {
    const concernes = prog.plans.filter(filtre)
    // Un programme sans ligne concernee ne dit rien. L'ignorer reviendrait a
    // le compter comme d'accord : c'est exactement l'erreur a eviter.
    if (concernes.length === 0) {
      return { partage: false, raison: `${prog.slug} n'a aucune ligne concernee` }
    }
    for (const plan of concernes) {
      // Une ligne non confirmee ne peut pas fonder une affirmation de firme.
      if (plan.confidence === 'needs_confirmation' || plan.confidence === 'unknown') {
        return { partage: false, raison: `${prog.slug} porte une ligne a confirmer` }
      }
      const v = lecteur(plan)
      if (v === null || v === undefined) {
        return { partage: false, raison: `${prog.slug} n'a pas de valeur explicite` }
      }
      derniere = v
      valeurs.add(JSON.stringify(v))
    }
  }

  if (valeurs.size !== 1 || derniere === undefined) {
    return { partage: false, raison: `valeurs divergentes : ${Array.from(valeurs).join(', ')}` }
  }
  return { partage: true, valeur: derniere }
}

function phaseDe(plan: ProgramPlan): PhaseRow {
  return {
    phase: plan.phase,
    profitTarget: plan.profit_target,
    maximumLoss: plan.maximum_loss_limit,
    dailyLoss: plan.daily_loss_limit,
    // `null` explicite en base signifie « aucune limite », pas « inconnu » :
    // les deux se rendent differemment et les confondre coute cher au lecteur.
    dailyLossStated: plan.daily_loss_limit === null,
    drawdownType: plan.drawdown_type,
    consistencyRule: plan.consistency_rule,
    maxContracts: plan.max_contracts,
    minimumTradingDays: plan.minimum_trading_days,
    profitSplit: plan.profit_split,
    payoutCap: plan.payout_cap,
    minimumPayout: plan.minimum_payout,
    daysBetweenPayouts: plan.days_between_payouts,
    buffer: plan.buffer,
    bufferStatus: plan.buffer_status,
    resetFee: plan.reset_fee,
    activationFee: plan.activation_fee,
    currency: plan.currency || 'USD',
    confidence: plan.confidence,
  }
}

/** La promotion applicable a un plan, partenaire et publique separees. */
function promotionsFor(
  promotions: Promotion[],
  programSlug: string,
  variantKey: string | null,
  size: number,
  maintenant: number
): { partenaire: Promotion | null; publique: Promotion | null } {
  const applicable = (p: Promotion) => {
    if (p.status !== 'active') return false
    if (p.program_slug !== null && p.program_slug !== programSlug) return false
    if (p.account_size !== null && p.account_size !== size) return false
    if (p.eligible_variants && !p.eligible_variants.includes(variantKey ?? 'standard')) return false
    if (p.starts_at && new Date(p.starts_at).getTime() > maintenant) return false
    // Une date absente vaut « sans echeance publiee », jamais « expiree ».
    if (p.expires_at && new Date(p.expires_at).getTime() <= maintenant) return false
    return true
  }
  const meilleure = (liste: Promotion[]) =>
    liste.reduce<Promotion | null>((b, p) => (!b || p.discount_value > b.discount_value ? p : b), null)
  const retenues = promotions.filter(applicable)
  return {
    partenaire: meilleure(retenues.filter((p) => !p.is_public)),
    publique: meilleure(retenues.filter((p) => p.is_public)),
  }
}

// -----------------------------------------------------------------------------
// CONSTRUCTEUR
// -----------------------------------------------------------------------------

/** Ce que le constructeur attend de `prop_firms`. Volontairement etroit. */
export interface FirmRecord {
  slug: string
  name: string
  headline?: string | null
  verdict?: string | null
  description?: string | null
  category_badge?: string | null
  logo_url?: string | null
  website_url?: string | null
  data_verified_at?: string | null
  trustpilot_rating?: number | null
  trustpilot_reviews?: number | null
  is_futures?: boolean | null
  founded?: string | null
  founded_year?: number | null
  year_founded?: number | null
  country?: string | null
  payout_methods?: string[] | string | null
  payout_frequency?: string | null
  min_payout?: number | null
  assets?: string[] | string | null
  platforms?: string[] | string | null
  checkout_options?: { options?: { name: string }[] } | null
  pros?: string[] | null
  cons?: string[] | null
  key_rules?: { rules?: { category?: string; title?: string; detail?: string; severity?: string }[] } | null
  verdict_card?: { body?: string; points?: string[]; counterPoints?: string[] } | null
  journey?: { steps?: { title?: string; detail?: string }[] } | null
  price_currency?: string | null
}

function toList(v: string[] | string | null | undefined): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  return v.split(/[,;]/).map((x) => x.trim()).filter(Boolean)
}

/**
 * Assemble le modele complet d'une fiche.
 *
 * `programData` a `null` = firme sans structure normalisee : le modele se
 * remplit alors depuis `prop_firms` seul, et `programs` reste vide. Les ~349
 * fiches historiques passent par ce chemin sans changement.
 */
export function buildFirmPageModel(
  firm: FirmRecord,
  programData: FirmProgramData | null,
  options: { now?: number } = {}
): FirmPageModel {
  const maintenant = options.now ?? Date.now()
  const prov: Record<string, Provenance> = {}
  const note = (champ: string, table: string, column: string, verifiedAt: string | null = null) => {
    prov[champ] = { table, column, verifiedAt }
  }

  // --- Identite ------------------------------------------------------------
  note('identity.name', 'prop_firms', 'name')
  note('identity.headline', 'prop_firms', 'headline')
  note('identity.intro', 'prop_firms', 'verdict')
  note('identity.verifiedAt', 'prop_firms', 'data_verified_at')
  const identity = {
    slug: firm.slug,
    name: firm.name,
    // `headline` absent laissait le H1 repeter le nom affiche juste au-dessus.
    headline: firm.headline || firm.name,
    intro: firm.verdict ?? null,
    marketBadge: firm.category_badge ?? null,
    logoUrl: firm.logo_url ?? null,
    websiteUrl: firm.website_url ?? null,
    verifiedAt: firm.data_verified_at ?? null,
    rating:
      firm.trustpilot_rating && firm.trustpilot_rating > 0
        ? { value: firm.trustpilot_rating, count: firm.trustpilot_reviews ?? 0 }
        : null,
    foundedYear:
      firm.founded ?? (firm.founded_year || firm.year_founded ? String(firm.founded_year || firm.year_founded) : null),
    country: firm.country ?? null,
    // Derive du marche des programmes, pas d'une colonne libre : c'est la
    // meme source que le fait de firme, donc les deux ne peuvent pas diverger.
    firmType: null as string | null,
    accountModel: null as string | null,
    payoutFrequency: firm.payout_frequency ?? null,
  }

  // --- Programmes, plans, phases -------------------------------------------
  note('programs', 'firm_programs', 'slug,name,kind,market,evaluation_steps,summary')
  note('programs[].plans[].phases[]', 'firm_program_plans', '*')
  const programmes: ProgramRow[] = (programData?.programs ?? [])
    .filter((p) => p.plans.length > 0)
    .map((p) => {
      const combos = new Map<string, ProgramPlan[]>()
      for (const plan of p.plans) {
        const cle = planId(p.slug, plan.variant_key ?? null, plan.account_size)
        combos.set(cle, [...(combos.get(cle) ?? []), plan])
      }
      const plans: PlanRow[] = Array.from(combos.entries())
        .map(([id, lignes]) => {
          const premiere =
            lignes.find((l) => l.phase === 'evaluation') ??
            lignes.find((l) => l.phase === 'sim_funded') ??
            lignes[0]
          return {
            id,
            programSlug: p.slug,
            variantKey: premiere.variant_key ?? null,
            accountSize: premiere.account_size,
            currency: premiere.currency || firm.price_currency || 'USD',
            listPrice:
              premiere.regular_price ??
              lignes.find((l) => l.regular_price != null)?.regular_price ??
              null,
            // Ordre de lecture : evaluation, seconde evaluation, compte finance.
            phases: lignes
              .slice()
              .sort((a, b) => {
                const rang = (x: string) =>
                  x === 'evaluation' ? 0 : x === 'evaluation_2' ? 1 : 2
                return rang(a.phase) - rang(b.phase)
              })
              .map(phaseDe),
          }
        })
        .sort((a, b) => a.accountSize - b.accountSize)

      return {
        slug: p.slug,
        name: p.name,
        kind: p.kind,
        market: p.market,
        evaluationSteps: p.evaluation_steps,
        differentiator: p.summary,
        status: p.status,
        maxFundedAccounts: p.max_funded_accounts,
        maxFundedNote: p.max_funded_note,
        plans,
      }
    })

  // Un libelle par marche, ecrit une fois. La version precedente capitalisait
  // « futures » a la main et laissait passer « cfd prop firm » en minuscules
  // pour tout autre marche : le defaut de la colonne devenait du texte visible.
  // Un marche inconnu ne produit AUCUN libelle plutot qu'un mot brut.
  const LIBELLE_MARCHE: Record<string, string> = {
    futures: 'Futures prop firm',
    cfd: 'CFD prop firm',
    stocks: 'Stock prop firm',
  }
  const marchesProgrammes = new Set(programmes.map((p) => p.market))
  identity.firmType =
    marchesProgrammes.size === 1 ? LIBELLE_MARCHE[Array.from(marchesProgrammes)[0]] ?? null : null

  // « Simulated » n'est affirme que si TOUTES les phases financees le sont.
  const phasesFinancees = programmes.flatMap((p) =>
    p.plans.flatMap((pl) => pl.phases.filter((ph) => ph.phase.startsWith('sim_') || ph.phase === 'funded'))
  )
  identity.accountModel =
    phasesFinancees.length > 0 && phasesFinancees.every((ph) => ph.phase === 'sim_funded')
      ? 'Simulated'
      : null

  const tousLesPlans = programmes.flatMap((p) => p.plans)
  const defaultPlanId = tousLesPlans[0]?.id ?? null

  // --- Faits de firme : uniquement ce qui vaut pour TOUS les programmes ----
  note('firmFacts', 'firm_program_plans', 'derive par universalFact')
  const programmesBruts = (programData?.programs ?? []).filter((p) => p.plans.length > 0)
  const firmFacts: { label: string; detail: string | null }[] = []

  // Chaque fait rejete garde sa raison : sans elle, une bande vide ressemble a
  // un bug alors qu'elle est souvent la bonne reponse.
  const firmFactsRejected: { label: string; raison: string }[] = []

  if (programmesBruts.length > 0) {
    // Zero EXPLICITE, pas une absence. `null` veut dire « non renseigne », et
    // l'annoncer comme un avantage serait une invention.
    const activation = universalFact(programmesBruts, (p) => p.activation_fee)
    if (activation.partage && activation.valeur === 0) {
      firmFacts.push({ label: 'No activation fee', detail: 'Explicitly zero on every purchasable plan' })
    } else {
      firmFactsRejected.push({
        label: 'No activation fee',
        raison: activation.partage ? `valeur ${activation.valeur}` : activation.raison,
      })
    }

    const split = universalFact(
      programmesBruts,
      (p) => p.profit_split,
      (p) => p.phase === 'sim_funded'
    )
    if (split.partage && split.valeur != null) {
      firmFacts.push({
        label: `${Math.round(split.valeur * 100)}% profit split`,
        detail: 'Same on every program',
      })
    } else if (!split.partage) {
      firmFactsRejected.push({ label: 'profit split', raison: split.raison })
    }

    const drawdown = universalFact(programmesBruts, (p) => p.drawdown_type)
    if (drawdown.partage && drawdown.valeur) {
      firmFacts.push({ label: `${drawdown.valeur} drawdown`, detail: 'Same on every program and phase' })
    } else if (!drawdown.partage) {
      firmFactsRejected.push({ label: 'drawdown', raison: drawdown.raison })
    }

    // `daily_loss_limit === null` signifie ici « aucune limite », un fait
    // positif. On le lit donc comme un booleen explicite, jamais comme une
    // absence de donnee : les deux se distinguent par le champ lui-meme.
    const journaliere = universalFact(programmesBruts, (p) => p.daily_loss_limit === null)
    if (journaliere.partage && journaliere.valeur === true) {
      firmFacts.push({ label: 'No daily loss limit', detail: 'On every program; maximum loss still applies' })
    } else if (!journaliere.partage) {
      firmFactsRejected.push({ label: 'No daily loss limit', raison: journaliere.raison })
    }

    // Le marche doit etre confirme DEUX fois : par tous les programmes, et par
    // la fiche elle-meme. Un seul des deux serait une deduction.
    const marches = new Set(
      programmesBruts
        .filter((p) => p.status === 'active' || p.status === 'promotional')
        .map((p) => p.market)
    )
    const marcheUnique = marches.size === 1 ? Array.from(marches)[0] : null
    const accordFirme =
      marcheUnique === null
        ? false
        : firm.is_futures === true
          ? marcheUnique === 'futures'
          : firm.is_futures === false
            ? marcheUnique !== 'futures'
            : false
    if (marcheUnique && accordFirme) {
      firmFacts.push({
        label: `${marcheUnique === 'futures' ? 'Futures' : marcheUnique} only`,
        detail: 'Confirmed by every program and by the firm record',
      })
    } else {
      firmFactsRejected.push({
        label: 'market',
        raison: !marcheUnique
          ? `marches divergents : ${Array.from(marches).join(', ')}`
          : 'prop_firms.is_futures ne confirme pas les programmes',
      })
    }
  }

  // --- Catalogue ------------------------------------------------------------
  // `firm_platforms` fait autorite : elle seule distingue ce qu'on peut
  // acheter de ce qui n'existe que sur la page marketing. La colonne TEXT de
  // `prop_firms` ne sert que faute de mieux.
  note(
    'catalogue.platforms',
    programData && programData.platforms.length > 0 ? 'firm_platforms' : 'prop_firms',
    programData && programData.platforms.length > 0 ? 'name,configurator_status,note' : 'platforms'
  )
  const platforms =
    programData && programData.platforms.length > 0
      ? programData.platforms.map((p) => ({
          name: p.name,
          selectable: p.configurator_status === 'selectable',
          note: p.note,
        }))
      : toList(firm.platforms).map((name) => ({ name, selectable: true, note: null }))

  note('catalogue.assets', 'prop_firms', 'assets')
  note('catalogue.paymentMethods', 'prop_firms', 'payout_methods')
  note('identity.foundedYear', 'prop_firms', 'founded,founded_year,year_founded')
  note('identity.country', 'prop_firms', 'country')
  note('identity.firmType', 'firm_programs', 'market (derive)')
  note('identity.accountModel', 'firm_program_plans', 'phase (derive)')
  note('identity.payoutFrequency', 'prop_firms', 'payout_frequency')
  note('catalogue.dataFeeds', 'prop_firms', 'checkout_options')

  // --- Offre, resolue PAR PLAN ---------------------------------------------
  note('offer', 'firm_promotions', 'code,discount_value,is_public,status,starts_at,expires_at')
  let offer: OfferRow | null = null
  if (programData && programData.promotions.length > 0 && tousLesPlans.length > 0) {
    const percentByPlanId: Record<string, number> = {}
    const priceByPlanId: Record<string, { list: number; final: number }> = {}
    const betterPublicOfferByPlanId: Record<string, string> = {}
    const codes = new Set<string>()
    let label: string | null = null

    for (const plan of tousLesPlans) {
      const { partenaire, publique } = promotionsFor(
        programData.promotions,
        plan.programSlug,
        plan.variantKey,
        plan.accountSize,
        maintenant
      )
      if (!partenaire) continue
      if (partenaire.code) codes.add(partenaire.code)
      label = label ?? partenaire.label
      percentByPlanId[plan.id] = Math.round(partenaire.discount_value * 100)
      if (plan.listPrice != null) {
        priceByPlanId[plan.id] = {
          list: plan.listPrice,
          final: Math.round(plan.listPrice * (1 - partenaire.discount_value) * 100) / 100,
        }
      }
      // Nomme le plan concerne. Un avertissement global serait faux partout
      // ou notre code egale ou depasse l'offre publique.
      if (publique && publique.discount_value > partenaire.discount_value) {
        betterPublicOfferByPlanId[plan.id] =
          `The firm currently advertises ${Math.round(publique.discount_value * 100)}% publicly on ` +
          `this plan, above this code. Check the checkout total before paying.`
      }
    }

    if (Object.keys(percentByPlanId).length > 0) {
      const code = codes.size === 1 ? Array.from(codes)[0] : null
      offer = {
        code,
        label,
        trackingPlacement: 'hero',
        // Aucune promesse de preremplissage : le lien atterrit sur l'entree de
        // l'application, la persistance du coupon n'est pas verifiee.
        disclosure: code
          ? `Check the selected plan and enter ${code} at checkout.`
          : 'Check the selected plan before paying.',
        percentByPlanId,
        priceByPlanId,
        betterPublicOfferByPlanId,
      }
    }
  }

  // --- Regles ---------------------------------------------------------------
  // `firm_rules` fait autorite. `prop_firms.key_rules` reste un repli pour les
  // ~349 fiches sans lignes normalisees, mais n'est plus la source canonique
  // de FuturesElite : deux sources parallelles finissaient toujours par
  // diverger, et c'est la version firme qui se perimait.
  const regleNormalisee = (programData?.rules ?? []).length > 0
  note(
    'rules.critical',
    regleNormalisee ? 'firm_rules' : 'prop_firms',
    regleNormalisee ? 'severity,scope,sort_order (derive)' : 'key_rules (repli)'
  )
  note('rules.complete', 'firm_rules', 'scope,title,detail,severity,confidence,source_url')

  // La categorie se derive de la severite, qui est structuree. La deduire du
  // libelle aurait rendu le classement dependant de la redaction.
  const CATEGORIE_PAR_SEVERITE: Record<string, string> = {
    hard_breach: 'Account-failure rules',
    payout_condition: 'Passing or payout blockers',
    restriction: 'Trading restrictions',
  }
  // Ordre d'affichage : ce qui fait perdre le compte, puis ce qui bloque un
  // retrait, puis ce qui contraint la facon de trader.
  const RANG_SEVERITE: Record<string, number> = {
    hard_breach: 0,
    payout_condition: 1,
    restriction: 2,
  }
  /** Trois par categorie au maximum : au-dela, ce n'est plus un resume. */
  const PAR_CATEGORIE = 3

  const critiquesNormalisees = (programData?.rules ?? [])
    .filter((r) => r.severity != null && r.severity in CATEGORIE_PAR_SEVERITE)
    .map((r, i) => ({
      category: CATEGORIE_PAR_SEVERITE[r.severity as string],
      title: r.title,
      detail: r.detail ?? '',
      severity: r.severity as string,
      // Une regle non confirmee ne peut pas ouvrir la liste : elle passe apres
      // les regles etablies de meme severite.
      displayPriority:
        (RANG_SEVERITE[r.severity as string] ?? 9) * 1000 +
        (r.confidence === 'needs_confirmation' ? 500 : 0) +
        i,
    }))
    .sort((a, b) => a.displayPriority - b.displayPriority)

  const retenues: typeof critiquesNormalisees = []
  const parCategorie = new Map<string, number>()
  for (const r of critiquesNormalisees) {
    const n = parCategorie.get(r.category) ?? 0
    if (n >= PAR_CATEGORIE) continue
    parCategorie.set(r.category, n + 1)
    retenues.push(r)
  }

  const rules = {
    critical: regleNormalisee
      ? retenues.map(({ category, title, detail, severity }) => ({ category, title, detail, severity }))
      : (firm.key_rules?.rules ?? [])
          .filter((r) => r.title)
          .map((r) => ({
            category: r.category || 'Other',
            title: r.title as string,
            detail: r.detail ?? '',
            severity: r.severity || 'restriction',
          })),
    // Enfin rendue : elle etait chargee puis jetee.
    complete: (programData?.rules ?? []).map((r) => ({
      scope: r.scope,
      title: r.title,
      detail: r.detail,
      severity: r.severity,
      confidence: r.confidence,
      sourceUrl: r.source_url,
    })),
  }

  // --- Bundles et paliers live : charges, donc rendus ----------------------
  note('bundles', 'firm_program_bundles', 'program_slug,account_number,discount_percent,note')
  note('liveTiers', 'firm_live_tiers', 'account_size,conversion_cap,loss_floor,cushion')
  const bundles = (programData?.bundles ?? []).map((b) => ({
    programSlug: b.program_slug,
    accountNumber: b.account_number,
    discountPercent: b.discount_percent,
    note: b.note,
  }))
  const liveTiers = (programData?.liveTiers ?? []).map((t) => ({
    accountSize: t.account_size,
    conversionCap: t.conversion_cap,
    lossFloor: t.loss_floor,
    cushion: t.cushion,
  }))

  // --- Recit ----------------------------------------------------------------
  note('narrative.about', 'prop_firms', 'description')
  note('narrative.strengths', 'prop_firms', 'pros')
  note('narrative.limits', 'prop_firms', 'cons')
  note('narrative.verdict', 'prop_firms', 'verdict_card')
  note('narrative.journey', 'prop_firms', 'journey')
  const narrative = {
    about: (firm.description ?? '').split('\n\n').map((p) => p.trim()).filter(Boolean),
    strengths: firm.pros ?? [],
    limits: firm.cons ?? [],
    verdict: firm.verdict_card?.body
      ? {
          body: firm.verdict_card.body,
          goodFit: firm.verdict_card.points ?? [],
          poorFit: firm.verdict_card.counterPoints ?? [],
        }
      : null,
    journey: (firm.journey?.steps ?? [])
      .filter((s) => s.title)
      .map((s) => ({ title: s.title as string, detail: s.detail ?? '' })),
    // Derivee du modele deja construit, jamais d'une source parallele : une
    // FAQ qui repondrait « 90 % » pendant que le tableau affiche 80 % serait
    // le meme defaut que celui qu'on vient de corriger.
    faq: [] as { question: string; answer: string }[],
  }

  // Chaque question ne s'ajoute que si sa reponse existe reellement.
  const splits = Array.from(
    new Set(
      programmes.flatMap((p) =>
        p.plans.flatMap((pl) =>
          pl.phases.filter((ph) => ph.phase === 'sim_funded').map((ph) => ph.profitSplit)
        )
      )
    )
  ).filter((v): v is number => v != null)
  if (splits.length > 0) {
    const min = Math.round(Math.min(...splits) * 100)
    const max = Math.round(Math.max(...splits) * 100)
    narrative.faq.push({
      question: `What profit split does ${firm.name} pay?`,
      answer:
        min === max
          ? `${max}% on every program.`
          : `${min}% to ${max}% depending on the program. Select one above to see its exact split.`,
    })
  }

  const prix = tousLesPlans.map((p) => p.listPrice).filter((v): v is number => v != null)
  if (prix.length > 0) {
    narrative.faq.push({
      question: `How much does a ${firm.name} account cost?`,
      answer: `List prices run from ${Math.min(...prix)} to ${Math.max(...prix)} ${
        tousLesPlans[0]?.currency ?? 'USD'
      }, one-time.${offer?.code ? ` Code ${offer.code} reduces that at checkout.` : ''}`,
    })
  }

  const selectionnables = platforms.filter((p) => p.selectable).map((p) => p.name)
  if (selectionnables.length > 0) {
    narrative.faq.push({
      question: 'Which platforms can I choose at purchase?',
      answer: `${selectionnables.length}: ${selectionnables.join(', ')}.`,
    })
  }

  const instant = programmes.find((p) => p.kind === 'instant')
  if (instant) {
    narrative.faq.push({
      question: 'Is there a program without an evaluation?',
      answer: `Yes. ${instant.name} funds you from purchase, with no profit objective to reach.`,
    })
  }

  return {
    identity,
    firmFacts,
    firmFactsRejected,
    catalogue: {
      platforms,
      assets: toList(firm.assets),
      dataFeeds: (firm.checkout_options?.options ?? []).map((o) => o.name).filter(Boolean),
      paymentMethods: toList(firm.payout_methods),
    },
    programs: programmes,
    defaultPlanId,
    offer,
    rules,
    bundles,
    liveTiers,
    narrative,
    provenance: prov,
  }
}
