// =============================================================================
// TESTS DES CAPACITES GENERIQUES  scripts/capability-tests.mjs
// =============================================================================
//   npm run test:capabilities
//
// Les huit capacites ajoutees apres le mode ombre, verifiees sur les donnees
// reelles des trois firmes : devise native, variante comme dimension de
// selection, identite commerciale, marches multiples, phases dynamiques,
// portee des promotions, offre absente, et non-regression de FuturesElite.
//
// FTMO et The5ers restent `legacy` : ces tests construisent leur modele, ils
// ne les activent pas.
// =============================================================================

import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { PACKS_V2 } from './program-packs-v2.mjs'
import {
  FUTURESELITE_PROGRAMS, FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION,
  FUTURESELITE_PLATFORMS, FUTURESELITE_RULES, FUTURESELITE_BUNDLES, FUTURESELITE_LIVE_TIERS,
} from './futureselite-programs.mjs'
import * as CONTENU from './firm-content.mjs'

const dir = mkdtempSync(join(tmpdir(), 'cap-'))
try {
  execSync(
    `npx tsc lib/firm-page-model.ts lib/validate-firm-page-model.ts --outDir "${dir}" ` +
    `--module esnext --target es2022 --skipLibCheck --noResolve`,
    { stdio: 'pipe' }
  )
} catch { /* alias @/ non resoluble, imports de type effaces */ }
for (const f of ['firm-page-model.js', 'validate-firm-page-model.js']) {
  if (!existsSync(join(dir, f))) { console.error('Compilation incomplete : ' + f); process.exit(1) }
}
const M = await import(pathToFileURL(join(dir, 'firm-page-model.js')).href)
const V = await import(pathToFileURL(join(dir, 'validate-firm-page-model.js')).href)
const { buildFirmPageModel, promotionForSelection, planId, parsePlanId } = M
const { validateFirmPageModel } = V

// -----------------------------------------------------------------------------
const NOW = Date.parse('2026-09-08T12:00:00Z')
const OPT = { now: NOW }
const PLAN0 = {
  variant_key: null, currency: 'USD', confidence: null,
  buffer: null, buffer_status: null, contract_scaling: null,
  news_trading_status: null, news_trading_note: null,
  scalping_status: null, scalping_note: null,
  source_url: null, verified_at: null, editorial_note: null,
  profit_target: null, maximum_loss_limit: null, daily_loss_limit: null,
  drawdown_type: null, max_contracts: null, minimum_trading_days: null,
  consistency_rule: null, profit_split: null, payout_cap: null,
  minimum_payout: null, days_between_payouts: null,
  reset_fee: null, activation_fee: null, regular_price: null,
}
const PROMO0 = {
  eligible_variants: null, eligible_markets: null, checkout_verified: null,
  affiliate_exclusive: null, stacking_rule: null, editorial_note: null,
  verified_at: null, source_url: null, is_public: true, status: 'active',
  program_slug: null, account_size: null, starts_at: null, expires_at: null,
  discount_type: 'percent', label: null, code: null,
}

const depuisPack = (pack) => ({
  programs: pack.programs.map((p) => ({
    slug: p.slug, name: p.name, market: p.market ?? 'cfd',
    program_family: p.program_family ?? null, status: p.status ?? 'active',
    kind: p.kind ?? 'evaluation', evaluation_steps: p.evaluation_steps ?? null,
    summary: p.summary ?? null, sort_order: p.sort_order ?? 0,
    max_funded_accounts: p.max_funded_accounts ?? null,
    max_funded_note: p.max_funded_note ?? null,
    source_url: p.source_url ?? null, verified_at: null,
    plans: (p.plans ?? []).map((pl) => ({ ...PLAN0, ...pl })),
  })),
  promotions: (pack.promotions ?? []).map((p) => ({ ...PROMO0, ...p })),
  bundles: pack.bundles ?? [], platforms: pack.platforms ?? [],
  rules: (pack.rules ?? []).map((r) => Array.isArray(r)
    ? { program_slug: r[0], scope: r[1], title: r[2], detail: r[3], severity: r[4], confidence: r[5], source_url: r[6] ?? null }
    : r),
  liveTiers: pack.liveTiers ?? [],
})

const dataFE = {
  programs: FUTURESELITE_PROGRAMS.map((p) => ({
    slug: p.slug, name: p.name, market: p.market, program_family: null,
    status: p.status, kind: p.kind, evaluation_steps: p.evaluation_steps ?? null,
    summary: p.summary ?? null, sort_order: p.sort_order ?? 0,
    max_funded_accounts: p.max_funded_accounts ?? null,
    max_funded_note: p.max_funded_note ?? null,
    source_url: p.source_url ?? null, verified_at: null,
    plans: p.plans.map((pl) => ({ ...PLAN0, ...pl })),
  })),
  promotions: [...FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION].map((p) => ({ ...PROMO0, ...p })),
  bundles: FUTURESELITE_BUNDLES, platforms: FUTURESELITE_PLATFORMS,
  rules: FUTURESELITE_RULES, liveTiers: FUTURESELITE_LIVE_TIERS,
}
const firmDe = (c, slug) => c
  ? { slug, data_verified_at: c.verified_at ?? null, ...c.scalars, ...(c.arrays ?? {}), ...(c.json ?? {}) }
  : { slug, name: slug }

const FE = buildFirmPageModel(firmDe(CONTENU.FUTURESELITE, 'futureselite'), dataFE, OPT)
const packFtmo = PACKS_V2.find((p) => p.firm_slug === 'ftmo')
const packT5 = PACKS_V2.find((p) => p.firm_slug === 'the5ers')
const FTMO = buildFirmPageModel(firmDe(CONTENU.FTMO, 'ftmo'), depuisPack(packFtmo), OPT)
const T5 = buildFirmPageModel(firmDe(CONTENU.THE5ERS, 'the5ers'), depuisPack(packT5), OPT)

let ok = 0, ko = 0
const cas = (nom, cond, detail = '') => {
  if (cond) { ok++; console.log('  ok    ' + nom) }
  else { ko++; console.log('  ECHEC ' + nom + (detail ? ' — ' + detail : '')) }
}
const titre = (t) => { console.log(''); console.log(t); console.log('-'.repeat(74)) }
const plans = (m) => m.programs.flatMap((p) => p.plans)

// -----------------------------------------------------------------------------
titre('1. LA DEVISE APPARTIENT AU PLAN')
{
  const devFtmo = new Set(plans(FTMO).map((p) => p.currency))
  const devFE = new Set(plans(FE).map((p) => p.currency))
  cas('FTMO reste en EUR', devFtmo.size === 1 && devFtmo.has('EUR'), Array.from(devFtmo).join(','))
  cas('FuturesElite reste en USD', devFE.size === 1 && devFE.has('USD'), Array.from(devFE).join(','))
  cas('aucun plan FTMO n est marque USD', !devFtmo.has('USD'))

  // Les fourchettes ne melangent pas les devises.
  cas('FTMO a une fourchette EUR et une seule',
    FTMO.priceRanges.length === 1 && FTMO.priceRanges[0].currency === 'EUR',
    JSON.stringify(FTMO.priceRanges))
  cas('chaque fourchette porte sa devise',
    [...FE.priceRanges, ...FTMO.priceRanges, ...T5.priceRanges].every((r) => typeof r.currency === 'string'))

  // Un modele artificiel a deux devises ne doit pas les agreger.
  const mixte = JSON.parse(JSON.stringify(dataFE))
  mixte.programs[1].plans.forEach((pl) => { pl.currency = 'EUR' })
  const mm = buildFirmPageModel(firmDe(CONTENU.FUTURESELITE, 'futureselite'), mixte, OPT)
  cas('deux devises donnent deux fourchettes distinctes', mm.priceRanges.length === 2,
    JSON.stringify(mm.priceRanges))
}

titre('2 et 3. VARIANTE ET IDENTITE COMMERCIALE')
{
  cas('la cle porte les quatre dimensions',
    planId('cfd', 'p', 'swing', 100000) === 'cfd|p|swing|100000')
  const p = parsePlanId('cfd|p|swing|100000')
  cas('la cle se relit', p && p.market === 'cfd' && p.variantKey === 'swing' && p.size === 100000)
  cas('une variante absente reste distincte d une variante nommee',
    planId('cfd', 'p', null, 100) !== planId('cfd', 'p', 'swing', 100))

  const ftmo2 = FTMO.programs.find((x) => x.slug === 'ftmo-cfd-2-step')
  const cent = ftmo2.plans.filter((pl) => pl.accountSize === 100000)
  cas('FTMO 2-Step 100K existe en deux variantes', cent.length === 2,
    cent.map((c) => c.variantKey).join(','))
  cas('les deux variantes ont des identites distinctes',
    new Set(cent.map((c) => c.id)).size === 2)
  cas('la variante porte une etiquette lisible',
    cent.every((c) => typeof c.variantLabel === 'string' && c.variantLabel.length > 0),
    cent.map((c) => c.variantLabel).join(','))

  const t5 = T5.programs.find((x) => x.slug === 't5-summer-cfd-2-step')
  const cent5 = t5.plans.filter((pl) => pl.accountSize === 100000)
  cas('The5ers Summer 100K existe en 8/5 et 10/5', cent5.length === 2,
    cent5.map((c) => c.variantLabel).join(','))
  cas('les deux ont des prix differents',
    new Set(cent5.map((c) => c.listPrice)).size === 2, cent5.map((c) => c.listPrice).join(','))
}

titre('4. FIRMES MULTI-MARCHES')
{
  cas('FuturesElite : Futures prop firm', FE.identity.firmType === 'Futures prop firm', String(FE.identity.firmType))
  cas('FTMO : CFD prop firm', FTMO.identity.firmType === 'CFD prop firm', String(FTMO.identity.firmType))
  cas('The5ers : CFD & Futures prop firm', T5.identity.firmType === 'CFD & Futures prop firm',
    String(T5.identity.firmType))

  cas('FuturesElite porte le fait « Futures only »',
    FE.firmFacts.some((f) => /futures only/i.test(f.label)))
  cas('The5ers ne porte AUCUN fait « only »',
    !T5.firmFacts.some((f) => /only/i.test(f.label)),
    T5.firmFacts.map((f) => f.label).join(', '))

  const vT5 = validateFirmPageModel(T5)
  cas('une firme multi-marches ne declenche pas MARKET_MISMATCH',
    !vT5.errors.some((e) => e.code === 'MARKET_MISMATCH'))
  cas('elle produit une note MULTI_MARKET',
    vT5.notices.some((n) => n.code === 'MULTI_MARKET'))

  // Un vrai desaccord doit, lui, bloquer.
  const menteuse = buildFirmPageModel(
    { ...firmDe(CONTENU.FTMO, 'ftmo'), is_futures: true }, depuisPack(packFtmo), OPT)
  cas('une metadonnee qui contredit les programmes bloque',
    validateFirmPageModel(menteuse).errors.some((e) => e.code === 'MARKET_MISMATCH'))
}

titre('5. STRUCTURES D EVALUATION DYNAMIQUES')
{
  const phasesDe = (m, slug) => {
    const p = m.programs.find((x) => x.slug === slug)
    return p ? Array.from(new Set(p.plans.flatMap((pl) => pl.phases.map((ph) => ph.phase)))) : []
  }
  const elite = phasesDe(FE, 'elite')
  cas('FuturesElite Elite : une evaluation puis un compte finance',
    elite.includes('evaluation') && elite.includes('sim_funded') && !elite.includes('evaluation_2'),
    elite.join(','))
  const instant = phasesDe(FE, 'instant')
  cas('FuturesElite Instant : aucune evaluation',
    !instant.includes('evaluation') && instant.includes('sim_funded'), instant.join(','))
  const f2 = phasesDe(FTMO, 'ftmo-cfd-2-step')
  cas('FTMO 2-Step : deux phases d evaluation',
    f2.includes('evaluation') && f2.includes('evaluation_2'), f2.join(','))
  const f1 = phasesDe(FTMO, 'ftmo-cfd-1-step')
  cas('FTMO 1-Step : une seule evaluation',
    f1.includes('evaluation') && !f1.includes('evaluation_2'), f1.join(','))
  const t2 = phasesDe(T5, 't5-summer-cfd-2-step')
  cas('The5ers 2-Step : deux phases d evaluation',
    t2.includes('evaluation') && t2.includes('evaluation_2'), t2.join(','))

  // L'ordre doit etre deterministe : evaluation, evaluation_2, sim_funded.
  const RANG = { evaluation: 0, evaluation_2: 1, sim_funded: 2 }
  const ordonne = [FE, FTMO, T5].every((m) => plans(m).every((pl) => {
    const rangs = pl.phases.map((ph) => RANG[ph.phase] ?? 9)
    return rangs.every((v, i) => i === 0 || rangs[i - 1] <= v)
  }))
  cas('les phases sont toujours dans le meme ordre', ordonne)
}

titre('6. PORTEE DES PROMOTIONS')
{
  const P = (o) => ({ ...PROMO0, ...o })
  const sel = { market: 'cfd', programSlug: 'ftmo-cfd-1-step', variantKey: 'standard', accountSize: 100000 }

  const large = P({ code: 'LARGE', discount_value: 0.1 })
  const etroite = P({ code: 'ETROITE', discount_value: 0.05, program_slug: 'ftmo-cfd-1-step', account_size: 100000 })
  cas('la portee la plus etroite l emporte',
    promotionForSelection(sel, [large, etroite], NOW).match?.promotion.code === 'ETROITE')

  const expiree = P({ code: 'EXPIREE', discount_value: 0.5, expires_at: '2026-01-01T00:00:00Z' })
  cas('une promotion expiree ne se resout jamais',
    promotionForSelection(sel, [expiree], NOW).match === null)
  const future = P({ code: 'FUTURE', discount_value: 0.5, starts_at: '2027-01-01T00:00:00Z' })
  cas('une promotion a venir ne se resout pas encore',
    promotionForSelection(sel, [future], NOW).match === null)
  const inactive = P({ code: 'OFF', discount_value: 0.5, status: 'expired' })
  cas('un statut inactif ne se resout pas',
    promotionForSelection(sel, [inactive], NOW).match === null)

  const standardOnly = P({ code: 'STD', discount_value: 0.2, eligible_variants: ['standard'] })
  cas('une promotion Standard ne s applique pas au Swing',
    promotionForSelection({ ...sel, variantKey: 'swing' }, [standardOnly], NOW).match === null)
  cas('elle s applique bien au Standard',
    promotionForSelection(sel, [standardOnly], NOW).match?.promotion.code === 'STD')

  const taille100 = P({ code: 'T100', discount_value: 0.2, account_size: 100000 })
  cas('une promotion 100K ne s applique pas au 200K',
    promotionForSelection({ ...sel, accountSize: 200000 }, [taille100], NOW).match === null)

  const a1 = P({ code: 'A', discount_value: 0.2, program_slug: 'ftmo-cfd-1-step' })
  const a2 = P({ code: 'B', discount_value: 0.3, program_slug: 'ftmo-cfd-1-step' })
  const amb = promotionForSelection(sel, [a1, a2], NOW)
  cas('deux promotions a egalite produisent une ambiguite',
    amb.match === null && amb.ambiguous.length === 2, JSON.stringify(amb.ambiguous.map((p) => p.code)))

  cas('aucune promotion applicable renvoie null',
    promotionForSelection(sel, [P({ code: 'X', discount_value: 0.2, program_slug: 'autre' })], NOW).match === null)

  // Aucune valeur heritee ne comble le vide.
  cas('FTMO n invente pas de code depuis les colonnes firme',
    FTMO.offer === null || Boolean(FTMO.offer.code), String(FTMO.offer?.code))
}

titre('7. OFFRE ABSENTE')
{
  for (const [nom, m] of [['FTMO', FTMO], ['The5ers', T5]]) {
    if (m.offer !== null) { cas(`${nom} : offre resolue`, true); continue }
    cas(`${nom} : aucune offre, aucun prix barre`,
      Object.keys(m.offer?.priceByPlanId ?? {}).length === 0)
  }
  cas('FuturesElite conserve son offre', FE.offer !== null && FE.offer.code === 'SCANNED')
}

titre('8. NON-REGRESSION DE FUTURESELITE')
{
  const nbPlans = plans(FE).length
  const nbPhases = plans(FE).reduce((n, pl) => n + pl.phases.length, 0)
  cas('4 programmes', FE.programs.length === 4, String(FE.programs.length))
  cas('15 selections commerciales', nbPlans === 15, String(nbPlans))
  cas('27 lignes de phase', nbPhases === 27, String(nbPhases))
  cas('SCANNED a 30 %',
    FE.offer?.code === 'SCANNED' && Object.values(FE.offer.percentByPlanId).every((v) => v === 30))
  cas('prix remise coherent sur chaque plan',
    Object.entries(FE.offer?.priceByPlanId ?? {}).every(([id, p]) => {
      const pct = FE.offer.percentByPlanId[id]
      return Math.abs(Math.round(p.list * (1 - pct / 100) * 100) / 100 - p.final) <= 0.01
    }))
  const v = validateFirmPageModel(FE)
  cas('zero erreur bloquante', v.errors.length === 0,
    v.errors.map((e) => `${e.code} @ ${e.field}`).join(' | '))
}

titre('9. LA SEULE PORTE EST LA VERSION IMMUABLE')
{
  // Ce bloc testait l'ancienne porte, `page_model_status === 'active'`. Il
  // passait, et il ne prouvait plus rien : la colonne est MUTABLE, donc la
  // mettre a `active` n'affirmait rien sur ce que la page servirait a la
  // requete suivante — le modele etait reconstruit a chaque fois depuis huit
  // tables vivantes. C'est exactement la regression que la couche de
  // publication supprime, et un test qui la valide serait pire qu'absent.
  const { readFileSync } = await import('node:fs')
  const page = readFileSync('app/[locale]/prop-firm/[slug]/page.tsx', 'utf8')

  cas('la fiche lit une version active, pas un statut',
    /readActiveFirmPage\(/.test(page))
  cas('page_model_status n autorise plus le rendu',
    !/page_model_status\s*===/.test(page))
  cas('le modele n est plus construit au rendu',
    !/buildFirmPageModel\(/.test(page))
  cas('sans version active, le rendu historique prend la main',
    /versionActive \?/.test(page) && /PropFirmPageClient/.test(page))

  // `select('*')` ne nomme aucune colonne : une colonne encore absente ne peut
  // pas faire echouer la requete. La lecon du 42703 sur `scope_confidence`.
  cas('la requete ne nomme aucune colonne optionnelle',
    !/select\([^)]*(page_model_status|active_page_version_id)/.test(page))
  cas('le CTA passe par /api/go', /buildAffiliateUrl\(/.test(page))

  // Le lecteur ne doit JAMAIS reconstruire : ce serait relire la donnee
  // vivante, et perdre la garantie en silence.
  const lecteur = readFileSync('lib/publication/read.ts', 'utf8')
  cas('le lecteur ne reconstruit aucun modele',
    !/buildFirmPageModel\(|summaryFromPageModel\(/.test(lecteur))
  cas('le lecteur part de active_page_version_id',
    /active_page_version_id/.test(lecteur))
  cas('un brouillon exige un client de service',
    /isServiceRole/.test(lecteur))

  // La transaction : l'activation est la DERNIERE etape, apres tout ce qui
  // peut echouer.
  const pub = readFileSync('lib/publication/publish.ts', 'utf8')
  cas('l activation est deleguee a une fonction atomique',
    /rpc\(\s*'activate_firm_version'/.test(pub))
  cas('la validation precede l ecriture',
    pub.indexOf('validateFirmPageModel(model)') < pub.indexOf("from('firm_page_versions')"))
  cas('l ecriture precede l activation',
    pub.indexOf("from('firm_page_versions')") < pub.indexOf("'activate_firm_version'"))
  // `acceptWarnings` ne doit porter QUE sur les avertissements. Le refus sur
  // erreur est teste ligne a ligne : aucune ligne ne peut mentionner les deux.
  cas('aucune derogation sur les erreurs bloquantes',
    pub.includes('if (!validation.publishable)') &&
    !pub.split('\n').some((l) => l.includes('publishable') && l.includes('acceptWarnings')))
  cas('la version est ecrite en validated, jamais en published',
    /status: 'validated'/.test(pub) && !/status: 'published'/.test(pub))
}

rmSync(dir, { recursive: true, force: true })
console.log('')
console.log('-'.repeat(74))
console.log(`${ok} reussis, ${ko} echoues`)
process.exit(ko === 0 ? 0 : 1)
