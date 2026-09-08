// =============================================================================
// VALIDATEUR DE PUBLICATION  lib/validate-firm-page-model.ts
// =============================================================================
//
// POURQUOI CE FICHIER EXISTE
//
// Six regressions en une semaine, toutes de la meme famille : un chiffre
// recopie a la main dans un champ editorial, qui se perime pendant que la
// donnee structuree, elle, reste juste.
//
//   « All four settle at a 90% profit split »        Instant paie 80 %
//   « No daily loss limit » en fait de firme         Prime en a une
//   « seven platforms »                              six sont selectionnables
//   « maximum 3 Nitro »                              la valeur est disputee
//   « 3 minimum trading days, 6 once funded »        propre a Elite
//   « End-of-day drawdown on Elite, Nitro, Instant » Nitro finance : trailing
//
// Aucune n'a ete attrapee par une relecture. Elles l'auraient toutes ete par
// une comparaison mecanique entre le texte et le modele.
//
// CE QUE LE VALIDATEUR NE FAIT PAS
//
// Il ne juge pas la prose. Une phrase peut recommander, nuancer, comparer :
// c'est le role de l'editorial. Il n'intervient que lorsqu'un texte AFFIRME
// une valeur que la donnee canonique contredit, ou generalise une valeur
// propre a un programme.
//
// LE PIEGE A EVITER : LES FAUX POSITIFS
//
// « Corso G. Matteotti 61, Latina 04100 » contient deux nombres. « founded in
// 2021 » en contient un. Aucun n'est une regle de produit. L'extracteur est
// donc ancre sur des UNITES, jamais sur des chiffres nus, et ignore
// explicitement les millesimes et les numeros de voie.
// =============================================================================

import type { FirmPageModel } from '@/lib/firm-page-model'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type Severity = 'error' | 'warning' | 'notice'

export interface Issue {
  code: string
  field: string
  message: string
  evidence?: unknown
}

export interface ValidationResult {
  errors: Issue[]
  warnings: Issue[]
  notices: Issue[]
  /** `false` des qu'une erreur existe. */
  publishable: boolean
}

// -----------------------------------------------------------------------------
// EXTRACTION DES AFFIRMATIONS CHIFFREES
// -----------------------------------------------------------------------------

export interface Claim {
  kind: 'percent' | 'money' | 'days' | 'accounts' | 'platforms' | 'rule_term'
  value: number | string
  raw: string
}

/** Millesimes plausibles : jamais une regle de produit. */
const ANNEE = /^(19|20)\d{2}$/

/**
 * Motifs ancres sur une UNITE. Un nombre nu n'est jamais capte : c'est ce qui
 * evite de bloquer sur un numero de rue ou une annee de fondation.
 */
const MOTIFS: { kind: Claim['kind']; re: RegExp; lire: (m: RegExpMatchArray) => number | string }[] = [
  { kind: 'percent', re: /(\d+(?:[.,]\d+)?)\s?%/g, lire: (m) => parseFloat(m[1].replace(',', '.')) },
  { kind: 'money', re: /\$\s?(\d[\d,\s]*(?:\.\d+)?)/g, lire: (m) => parseFloat(m[1].replace(/[,\s]/g, '')) },
  { kind: 'money', re: /(\d[\d,\s]*(?:[.,]\d+)?)\s?\$/g, lire: (m) => parseFloat(m[1].replace(/[,\s]/g, '')) },
  { kind: 'days', re: /(\d+)\s+(?:minimum\s+)?(?:profitable\s+|qualifying\s+|trading\s+)?days?\b/gi, lire: (m) => parseInt(m[1], 10) },
  { kind: 'accounts', re: /(\d+)\s+(?:active\s+)?(?:funded\s+)?accounts?\b/gi, lire: (m) => parseInt(m[1], 10) },
  { kind: 'accounts', re: /maximum\s+(\d+)\s+\w+/gi, lire: (m) => parseInt(m[1], 10) },
  { kind: 'platforms', re: /\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+platforms?\b/gi, lire: (m) => motAChiffre(m[1]) },
  { kind: 'rule_term', re: /\b(end[- ]of[- ]day|trailing equity|daily loss limit|consistency rule)\b/gi, lire: (m) => m[1].toLowerCase() },
]

const MOTS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
}
function motAChiffre(x: string): number {
  return MOTS[x.toLowerCase()] ?? parseInt(x, 10)
}

export function extractClaims(texte: string): Claim[] {
  const out: Claim[] = []
  for (const { kind, re, lire } of MOTIFS) {
    // `matchAll` sur une regex globale : on la clone pour ne pas partager
    // `lastIndex` entre deux appels. `Array.from` plutot qu'une iteration
    // directe : `downlevelIteration` n'est pas active, piege documente dans
    // CLAUDE.md.
    for (const m of Array.from(texte.matchAll(new RegExp(re.source, re.flags)))) {
      const value = lire(m)
      if (typeof value === 'number') {
        if (!Number.isFinite(value)) continue
        // Une annee n'est pas une regle. Un numero de voie non plus : on ne
        // capte de toute facon que ce qui porte une unite.
        if (ANNEE.test(String(value)) && kind !== 'money') continue
      }
      out.push({ kind, value, raw: m[0].trim() })
    }
  }
  return out
}

// -----------------------------------------------------------------------------
// LES VALEURS QUE LE MODELE AUTORISE
// -----------------------------------------------------------------------------

interface Canon {
  percents: Set<number>
  monies: Set<number>
  days: Set<number>
  accounts: Set<number>
  platformCounts: Set<number>
  ruleTerms: Set<string>
  /** Vrai quand une valeur differe entre programmes : elle ne peut etre generalisee. */
  varieParProgramme: (kind: Claim['kind'], value: number | string) => boolean
}

function buildCanon(model: FirmPageModel): Canon {
  const percents = new Set<number>()
  const monies = new Set<number>()
  const days = new Set<number>()
  const accounts = new Set<number>()
  const ruleTerms = new Set<string>()
  // Les types de drawdown reellement presents, toutes phases confondues.
  const drawdownTypes = new Set<string>()
  // Par programme, pour savoir si une valeur est universelle ou non.
  const parProgramme = new Map<string, { percents: Set<number>; days: Set<number>; terms: Set<string> }>()

  for (const prog of model.programs) {
    const p = { percents: new Set<number>(), days: new Set<number>(), terms: new Set<string>() }
    parProgramme.set(prog.slug, p)
    if (prog.maxFundedAccounts != null) accounts.add(prog.maxFundedAccounts)

    for (const plan of prog.plans) {
      if (plan.listPrice != null) monies.add(plan.listPrice)
      for (const ph of plan.phases) {
        for (const [v, cible] of [
          [ph.profitSplit, percents], [ph.consistencyRule, percents],
        ] as [number | null, Set<number>][]) {
          if (v != null) { cible.add(Math.round(v * 100)); p.percents.add(Math.round(v * 100)) }
        }
        for (const v of [ph.profitTarget, ph.maximumLoss, ph.dailyLoss, ph.payoutCap, ph.minimumPayout, ph.resetFee]) {
          if (v != null) monies.add(v)
        }
        if (ph.minimumTradingDays != null) { days.add(ph.minimumTradingDays); p.days.add(ph.minimumTradingDays) }
        if (ph.maxContracts != null) accounts.add(ph.maxContracts)
        if (ph.drawdownType) {
          const t = ph.drawdownType.toLowerCase().replace(/\s+/g, ' ')
          ruleTerms.add(t); p.terms.add(t)
          drawdownTypes.add(t)
        }
        // Termes synthetiques : ils n'existent pas comme valeur, mais comme
        // PRESENCE d'une regle. « daily loss limit » n'est un terme du modele
        // que pour les programmes qui en portent une — sans quoi une phrase
        // affirmant qu'il n'y en a aucune passait sans controle.
        if (ph.dailyLoss != null) { ruleTerms.add('daily loss limit'); p.terms.add('daily loss limit') }
        if (ph.consistencyRule != null) { ruleTerms.add('consistency rule'); p.terms.add('consistency rule') }
      }
    }
  }

  // Les prix remises comptent aussi : le texte peut legitimement les citer.
  for (const v of Object.values(model.offer?.priceByPlanId ?? {})) {
    monies.add(v.list); monies.add(v.final)
  }
  for (const v of Object.values(model.offer?.percentByPlanId ?? {})) percents.add(v)

  const platformCounts = new Set<number>([
    model.catalogue.platforms.filter((p) => p.selectable).length,
    model.catalogue.platforms.length,
  ])

  const varieParProgramme = (kind: Claim['kind'], value: number | string): boolean => {
    const vus = Array.from(parProgramme.values())
    if (vus.length < 2) return false
    const terme = String(value).replace(/[- ]/g, ' ')

    // Cas particulier du drawdown : la presence par PROGRAMME ne suffit pas.
    // Nitro porte « end of day » en evaluation et « trailing equity » une fois
    // finance ; les quatre programmes contiennent donc « end of day », et une
    // phrase les groupant passait sans etre inquietee. Des que deux types de
    // drawdown coexistent, aucune affirmation globale n'est sure.
    if (kind === 'rule_term' && drawdownTypes.has(terme)) {
      return drawdownTypes.size > 1
    }

    const contient = (p: { percents: Set<number>; days: Set<number>; terms: Set<string> }) =>
      kind === 'percent' ? p.percents.has(value as number)
      : kind === 'days' ? p.days.has(value as number)
      : kind === 'rule_term' ? p.terms.has(terme)
      : true
    const avec = vus.filter(contient).length
    // Presente chez certains programmes mais pas tous : generaliser serait faux.
    return avec > 0 && avec < vus.length
  }

  return { percents, monies, days, accounts, platformCounts, ruleTerms, varieParProgramme }
}

/** Le texte nomme-t-il un programme ? Alors l'affirmation n'est pas generale. */
function nommeUnProgramme(texte: string, model: FirmPageModel): boolean {
  if (model.programs.some((p) => new RegExp(`\\b${p.name}\\b`, 'i').test(texte))) return true
  // Deuxieme facon legitime de se dispenser de l'universalite : dire
  // explicitement que la valeur depend du programme. « 80% to 90% depending on
  // the program » est exact et n'a aucun programme a nommer ; l'exiger
  // bloquait une phrase juste.
  return /\b(depending on|varies? (?:by|between)|per program|by program|selon le programme)\b/i.test(texte)
}

// -----------------------------------------------------------------------------
// VALIDATEUR
// -----------------------------------------------------------------------------

export function validateFirmPageModel(model: FirmPageModel): ValidationResult {
  const errors: Issue[] = []
  const warnings: Issue[] = []
  const notices: Issue[] = []
  const canon = buildCanon(model)

  // --- Identite -------------------------------------------------------------
  for (const [champ, v] of [
    ['name', model.identity.name], ['headline', model.identity.headline],
    ['intro', model.identity.intro], ['logoUrl', model.identity.logoUrl],
  ] as [string, unknown][]) {
    if (!v) errors.push({ code: 'IDENTITY_INCOMPLETE', field: `identity.${champ}`, message: `${champ} est vide.` })
  }

  // --- Classification de marche --------------------------------------------
  //
  // Vendre plusieurs marches n'est PAS une erreur : The5ers propose du CFD et
  // du futures, et c'est une offre produit deliberee. Le vrai defaut est le
  // desaccord entre les programmes et la metadonnee de firme — une fiche
  // marquee futures dont aucun programme ne l'est.
  if (model.identity.marketMetadataAgrees === false) {
    errors.push({
      code: 'MARKET_MISMATCH', field: 'identity.markets',
      message: 'prop_firms.is_futures contredit le marche des programmes.',
      evidence: model.identity.markets,
    })
  }
  if (model.identity.markets.length > 1) {
    notices.push({
      code: 'MULTI_MARKET', field: 'identity.markets',
      message: 'Firme multi-marches : aucun fait « X only » ne sera produit.',
      evidence: model.identity.markets,
    })
  }

  // --- Promotions ambigues --------------------------------------------------
  for (const a of model.promotionAmbiguities) {
    errors.push({
      code: 'PROMO_AMBIGUOUS', field: `offer.${a.planId}`,
      message: 'Deux promotions s appliquent a egalite sur cette selection.',
      evidence: a.codes,
    })
  }

  // --- Relations programme / plan ------------------------------------------
  for (const prog of model.programs) {
    if (prog.plans.length === 0) {
      errors.push({ code: 'ORPHAN_PLAN', field: `programs.${prog.slug}`, message: 'Programme sans plan publiable.' })
    }
    for (const plan of prog.plans) {
      if (plan.programSlug !== prog.slug) {
        errors.push({
          code: 'ORPHAN_PLAN', field: `plans.${plan.id}`,
          message: 'Plan rattache a un autre programme que celui qui le porte.',
        })
      }
      if (plan.phases.length === 0) {
        errors.push({ code: 'ORPHAN_PLAN', field: `plans.${plan.id}`, message: 'Plan sans phase.' })
      }
    }
  }

  // --- Promotion ------------------------------------------------------------
  if (model.offer) {
    for (const [id, prix] of Object.entries(model.offer.priceByPlanId)) {
      const pct = model.offer.percentByPlanId[id]
      if (pct == null) continue
      const attendu = Math.round(prix.list * (1 - pct / 100) * 100) / 100
      // Un cent d'ecart est un arrondi, dix cents une erreur de calcul.
      if (Math.abs(attendu - prix.final) > 0.01) {
        errors.push({
          code: 'PROMO_MATH', field: `offer.priceByPlanId.${id}`,
          message: `Prix remise incoherent : ${prix.final} au lieu de ${attendu}.`,
          evidence: { list: prix.list, percent: pct, final: prix.final },
        })
      }
    }
    if (!model.offer.code) {
      warnings.push({ code: 'PROMO_SCOPE_UNCONFIRMED', field: 'offer.code', message: 'Remise sans code identifiable.' })
    }
    // Une portee non etablie n'est pas une portee universelle. L'offre reste
    // affichable comme code RAPPORTE ; elle ne peut pas etre presentee comme
    // applicable a tout le catalogue.
    if (model.offer.scopeConfidence === 'unconfirmed') {
      warnings.push({
        code: 'PROMO_SCOPE_UNCONFIRMED', field: 'offer.scopeConfidence',
        message: 'Portee de la promotion non confirmee : ne pas revendiquer une applicabilite generale.',
        evidence: model.offer.code,
      })
    }
    if (model.offer.expiryUnknown) {
      warnings.push({
        code: 'PROMO_EXPIRY_UNKNOWN', field: 'offer.expiryUnknown',
        message: 'Aucune date de fin publiee : ne jamais presenter l offre comme permanente.',
      })
    }
    // Les formulations interdites tant que la portee n'est pas etablie.
    const texteOffre = `${model.offer.label ?? ''} ${model.offer.disclosure}`
    if (model.offer.scopeConfidence !== 'universal_verified' &&
        /applies to all|all programs|best deal|best price|lowest price/i.test(texteOffre)) {
      errors.push({
        code: 'UNKNOWN_AS_CONFIRMED', field: 'offer.label',
        message: 'L offre revendique une portee ou un rang que la donnee ne soutient pas.',
        evidence: texteOffre,
      })
    }
    if (/pre-?fill|automatic/i.test(model.offer.disclosure)) {
      errors.push({
        code: 'UNKNOWN_AS_CONFIRMED', field: 'offer.disclosure',
        message: 'La mention promet un preremplissage non garanti.',
      })
    }
  }

  // --- Faits de firme -------------------------------------------------------
  for (const fait of model.firmFacts) {
    const claims = extractClaims(`${fait.label} ${fait.detail ?? ''}`)
    for (const c of claims) {
      if (canon.varieParProgramme(c.kind, c.value)) {
        errors.push({
          code: 'FACT_NOT_UNIVERSAL', field: 'firmFacts',
          message: `« ${fait.label} » enonce une valeur qui differe selon le programme.`,
          evidence: c,
        })
      }
    }
  }

  // --- Valeurs disputees presentees comme etablies --------------------------
  //
  // Le marquage visible est un travail de RENDU, pas de prose : le composant
  // affiche deja « Not confirmed » sur chaque regle detaillee dont la
  // `confidence` le demande. Exiger en plus un mot-cle dans le texte bloquait
  // des regles correctement redigees — « not currently purchasable » ou « the
  // configurator states one day » disent l'incertitude sans employer le
  // vocabulaire attendu.
  //
  // Le risque reel est ailleurs : une regle non confirmee PROMUE en regle
  // critique. Les cartes critiques ne portent pas de badge de confiance, donc
  // la valeur s'y lit comme etablie.
  const titresNonConfirmes = new Set(
    model.rules.complete.filter((r) => r.confidence === 'needs_confirmation').map((r) => r.title)
  )
  for (const r of model.rules.critical) {
    if (!titresNonConfirmes.has(r.title)) continue
    const marquee = /unresolved|not confirmed|needs confirmation|disputed|conflict/i.test(
      `${r.title} ${r.detail}`
    )
    if (!marquee) {
      errors.push({
        code: 'UNKNOWN_AS_CONFIRMED', field: `rules.critical.${r.title}`,
        message: 'Regle non confirmee promue en regle critique, sans mention qui la signale.',
      })
    }
  }
  for (const titre of Array.from(titresNonConfirmes)) {
    warnings.push({
      code: 'SOURCE_CONFLICT_OPEN', field: `rules.complete.${titre}`,
      message: 'Conflit de sources officielles encore ouvert.',
    })
  }

  // --- Editorial contre donnee canonique ------------------------------------
  const CHAMPS_EDITORIAUX: [string, string][] = [
    ...model.narrative.about.map((t, i) => [`narrative.about[${i}]`, t] as [string, string]),
    ...model.narrative.strengths.map((t, i) => [`narrative.strengths[${i}]`, t] as [string, string]),
    ...model.narrative.limits.map((t, i) => [`narrative.limits[${i}]`, t] as [string, string]),
    ...(model.narrative.verdict
      ? [
          ['narrative.verdict.body', model.narrative.verdict.body] as [string, string],
          ...model.narrative.verdict.goodFit.map((t, i) => [`narrative.verdict.goodFit[${i}]`, t] as [string, string]),
          ...model.narrative.verdict.poorFit.map((t, i) => [`narrative.verdict.poorFit[${i}]`, t] as [string, string]),
        ]
      : []),
    ...model.narrative.faq.map((f, i) => [`narrative.faq[${i}]`, `${f.question} ${f.answer}`] as [string, string]),
  ]

  for (const [champ, texte] of CHAMPS_EDITORIAUX) {
    const nomme = nommeUnProgramme(texte, model)
    for (const c of extractClaims(texte)) {
      const connu =
        c.kind === 'percent' ? canon.percents.has(c.value as number)
        : c.kind === 'money' ? canon.monies.has(c.value as number)
        : c.kind === 'days' ? canon.days.has(c.value as number)
        : c.kind === 'accounts' ? canon.accounts.has(c.value as number)
        : c.kind === 'platforms' ? canon.platformCounts.has(c.value as number)
        : canon.ruleTerms.has(String(c.value).replace(/[- ]/g, ' '))

      if (!connu) {
        // Le modele ne connait pas cette valeur : soit elle est fausse, soit
        // elle vient d'une source qu'on ne structure pas encore. On avertit
        // plutot que de bloquer, sauf si une valeur du meme type existe et
        // la contredit.
        const memeType =
          c.kind === 'percent' ? canon.percents.size > 0
          : c.kind === 'days' ? canon.days.size > 0
          : c.kind === 'platforms' ? canon.platformCounts.size > 0
          : c.kind === 'accounts' ? canon.accounts.size > 0
          : false
        if (memeType) {
          errors.push({
            code: 'EDITORIAL_CONTRADICTS_DATA', field: champ,
            message: `« ${c.raw} » ne correspond a aucune valeur canonique.`,
            evidence: c,
          })
        } else {
          warnings.push({
            code: 'EDITORIAL_UNVERIFIABLE', field: champ,
            message: `« ${c.raw} » n'est pas verifiable contre le modele.`,
            evidence: c,
          })
        }
        continue
      }

      // La valeur existe, mais seulement pour certains programmes : le texte
      // doit alors nommer lequel.
      if (!nomme && canon.varieParProgramme(c.kind, c.value)) {
        errors.push({
          code: 'FACT_NOT_UNIVERSAL_IN_TEXT', field: champ,
          message: `« ${c.raw} » est propre a un programme et le texte n'en nomme aucun.`,
          evidence: c,
        })
      }
    }
  }

  // --- Editorial incomplet --------------------------------------------------
  if (model.narrative.about.length === 0) {
    warnings.push({ code: 'EDITORIAL_INCOMPLETE', field: 'narrative.about', message: 'Aucune presentation.' })
  }
  if (model.catalogue.paymentMethods.length === 0) {
    warnings.push({ code: 'PAYMENT_DETAILS_MISSING', field: 'catalogue.paymentMethods', message: 'Aucun moyen de paiement.' })
  }

  // --- Faits ecartes : informatif ------------------------------------------
  for (const r of model.firmFactsRejected) {
    notices.push({ code: 'FACT_REJECTED', field: 'firmFacts', message: `« ${r.label} » ecarte : ${r.raison}` })
  }

  return { errors, warnings, notices, publishable: errors.length === 0 }
}

/**
 * Le CTA passe-t-il par la route de suivi ?
 *
 * Hors du modele : l'URL est construite par la page. Le controle vit donc a
 * cote, et la page l'appelle avant de rendre.
 */
export function validateCta(href: string): Issue | null {
  if (/^\/api\/go\//.test(href)) return null
  return {
    code: 'UNTRACKED_CTA', field: 'ctaHref',
    message: 'Le CTA ne passe pas par /api/go/.', evidence: href,
  }
}
