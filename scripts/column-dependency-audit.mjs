// =============================================================================
// AUDIT DE DEPENDANCES DES COLONNES  scripts/column-dependency-audit.mjs
// =============================================================================
//   node scripts/column-dependency-audit.mjs
//
// Pour chaque colonne candidate a la depreciation, liste QUI LA LIT et QUI
// L'ECRIT, dans tout le depot. Sans cette carte, cesser d'ecrire une colonne
// revient a parier : `profit_split` a deja vide `/best-for/high-profit-split`
// (24 firmes affichees sur 132) parce qu'un consommateur n'avait pas ete vu.
//
// La classification lecteur / ecrivain est heuristique et volontairement
// PRUDENTE : dans le doute, une occurrence est comptee comme lecteur, ce qui
// bloque la depreciation plutot que de l'autoriser a tort.
// =============================================================================

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const RACINE = process.cwd()
const IGNORE = new Set(['node_modules', '.next', '.git', 'dist', 'build', '.vercel'])
const EXT = new Set(['.ts', '.tsx', '.mjs', '.js', '.sql', '.json'])

// Les 41 colonnes classees `candidate_deprecated`, plus les 8 replis et les
// 20 supprimables : on les audite toutes, la carte servira aux trois groupes.
const COLONNES = `
profit_split max_profit_split min_price max_price account_sizes drawdown_type
consistency_rule min_trading_days max_trading_days profit_target_phase1
profit_target_phase2 max_daily_drawdown max_total_drawdown reset_fee scaling_max
progression_tiers max_allocation min_payout payout_speed_days payout_speed_label
time_limit commissions refund_policy fee_refund swap_free leverage_forex
instruments challenge_types platforms_list special_features highlights education
cost_timeline program_guide proof_stats value_strip included_items discount_code
discount_percent discount_note discount_expires_at
platforms payout_methods payout_frequency key_rules journey founded founded_year
year_founded
has_mt4 has_mt5 has_ctrader has_tradingview has_match_trader has_dxtrade
has_tradelocker has_instant_funding has_consistency_rule has_scaling
allows_scalping allows_news_trading allows_weekend_holding allows_hedging
allows_ea current_promo_code current_promo_discount discount_is_automatic
discount_status discount_starts_at
`.trim().split(/\s+/)

// -----------------------------------------------------------------------------
// Surfaces : a quoi sert le fichier qui touche la colonne
// -----------------------------------------------------------------------------
const SURFACES = [
  [/app[\\/]\[locale\][\\/]prop-firm[\\/]/, 'fiche firme'],
  [/app[\\/]\[locale\][\\/]compare/, '/compare'],
  [/app[\\/]\[locale\][\\/]best-for/, '/best-for'],
  [/app[\\/]\[locale\][\\/]deals/, '/deals'],
  [/app[\\/]\[locale\][\\/]admin/, 'admin'],
  [/app[\\/]\[locale\][\\/]dashboard/, 'dashboard'],
  [/app[\\/]api[\\/]/, 'route API'],
  [/sitemap|robots|seo/i, 'SEO / sitemap'],
  [/app[\\/]\[locale\][\\/]page\.tsx$/, 'accueil'],
  [/components[\\/]Home/, 'accueil'],
  [/components[\\/](Deals|PromoTicker)/, '/deals'],
  [/components[\\/]compare/, '/compare'],
  [/components[\\/]/, 'composant partage'],
  [/^lib[\\/]/, 'lib'],
  [/^scripts[\\/]/, 'script / seed'],
  [/^database[\\/]/, 'SQL'],
  [/\.test\.|test-/, 'tests'],
]

function surfaceDe(chemin) {
  for (const [motif, nom] of SURFACES) if (motif.test(chemin)) return nom
  return 'autre'
}

/**
 * Ecrivain ou lecteur ?
 *
 * On ne se fie pas au nom du fichier : un script peut lire une colonne pour la
 * recopier ailleurs. On regarde la LIGNE.
 */
function roleDe(ligne, chemin) {
  const l = ligne.trim()
  if (/^--/.test(l) || /^\/\//.test(l) || /^\*/.test(l)) return null // commentaire
  const ecrit =
    /\b(insert\s+into|update)\b/i.test(l) ||
    /^\s*[a-z_]+\s*=\s*/i.test(l) && /\.sql$/.test(chemin) ||
    /\.(update|upsert|insert)\s*\(/.test(l) ||
    /setEditData|editData\[|sets\.push|scalars|arrays\b/.test(l)
  return ecrit ? 'ecrit' : 'lit'
}

// -----------------------------------------------------------------------------
// Parcours
// -----------------------------------------------------------------------------
function* fichiers(dir) {
  for (const e of readdirSync(dir)) {
    if (IGNORE.has(e)) continue
    const p = join(dir, e)
    const st = statSync(p)
    if (st.isDirectory()) yield* fichiers(p)
    else if (EXT.has(e.slice(e.lastIndexOf('.')))) yield p
  }
}

const carte = new Map(COLONNES.map((c) => [c, { lit: new Map(), ecrit: new Map() }]))

for (const abs of fichiers(RACINE)) {
  const chemin = relative(RACINE, abs).split(sep).join('/')
  let contenu
  try { contenu = readFileSync(abs, 'utf8') } catch { continue }
  const lignes = contenu.split('\n')
  for (const col of COLONNES) {
    // Frontiere de mot des deux cotes : `min_price` ne doit pas matcher
    // `admin_price`, ni `price` matcher `min_price`.
    const re = new RegExp(`(^|[^a-z_])${col}([^a-z_]|$)`)
    for (const ligne of lignes) {
      if (!re.test(ligne)) continue
      const role = roleDe(ligne, chemin)
      if (!role) continue
      const s = surfaceDe(chemin)
      const cible = carte.get(col)[role]
      cible.set(s, (cible.get(s) ?? 0) + 1)
    }
  }
}

// -----------------------------------------------------------------------------
// Remplacement canonique
// -----------------------------------------------------------------------------
const CANONIQUE = {
  profit_split: 'firm_program_plans.profit_split',
  max_profit_split: 'firm_program_plans.profit_split (max)',
  min_price: 'firm_program_plans.regular_price (min)',
  max_price: 'firm_program_plans.regular_price (max)',
  account_sizes: 'firm_program_plans.account_size',
  drawdown_type: 'firm_program_plans.drawdown_type',
  consistency_rule: 'firm_program_plans.consistency_rule',
  min_trading_days: 'firm_program_plans.minimum_trading_days',
  max_trading_days: 'firm_program_plans.minimum_trading_days',
  profit_target_phase1: 'firm_program_plans.profit_target (evaluation)',
  profit_target_phase2: 'firm_program_plans.profit_target (evaluation_2)',
  max_daily_drawdown: 'firm_program_plans.daily_loss_limit',
  max_total_drawdown: 'firm_program_plans.maximum_loss_limit',
  reset_fee: 'firm_program_plans.reset_fee',
  scaling_max: 'firm_live_tiers',
  progression_tiers: 'firm_live_tiers',
  max_allocation: 'firm_live_tiers.conversion_cap',
  min_payout: 'firm_program_plans.minimum_payout',
  payout_speed_days: 'firm_rules (scope payout)',
  payout_speed_label: 'firm_rules (scope payout)',
  time_limit: 'firm_rules (scope account)',
  commissions: 'firm_rules (scope live)',
  refund_policy: 'firm_rules (scope account)',
  fee_refund: 'firm_rules (scope account)',
  swap_free: 'firm_rules (scope conduct)',
  leverage_forex: 'sans objet sur une firme futures',
  instruments: 'prop_firms.assets',
  challenge_types: 'firm_programs.kind',
  platforms_list: 'firm_platforms',
  platforms: 'firm_platforms',
  special_features: 'prop_firms.pros (editorial)',
  highlights: 'prop_firms.pros (editorial)',
  education: 'firm_rules ou editorial',
  cost_timeline: 'firm_program_plans (frais)',
  program_guide: 'firm_programs.summary',
  proof_stats: 'editorial, a re-sourcer',
  value_strip: 'derive par universalFact()',
  included_items: 'firm_platforms + firm_rules',
  discount_code: 'firm_promotions.code',
  discount_percent: 'firm_promotions.discount_value',
  discount_note: 'firm_promotions.editorial_note',
  discount_expires_at: 'firm_promotions.expires_at',
  discount_is_automatic: 'firm_promotions.is_public',
  discount_status: 'firm_promotions.status',
  discount_starts_at: 'firm_promotions.starts_at',
  current_promo_code: 'firm_promotions.code',
  current_promo_discount: 'firm_promotions.discount_value',
  payout_methods: 'firm_payment_methods (flow=payout)',
  payout_frequency: 'firm_program_plans.days_between_payouts',
  key_rules: 'firm_rules (severite)',
  journey: 'firm_program_plans.phase (derive)',
  founded: 'prop_firms.founded (a unifier)',
  founded_year: 'prop_firms.founded (a unifier)',
  year_founded: 'prop_firms.founded (a unifier)',
  has_instant_funding: 'firm_programs.kind',
  has_consistency_rule: 'firm_program_plans.consistency_rule',
  has_scaling: 'firm_live_tiers',
}
for (const p of ['mt4', 'mt5', 'ctrader', 'tradingview', 'match_trader', 'dxtrade', 'tradelocker']) {
  CANONIQUE['has_' + p] = 'firm_platforms'
}
for (const p of ['scalping', 'news_trading', 'weekend_holding', 'hedging', 'ea']) {
  CANONIQUE['allows_' + p] = 'firm_rules (scope conduct)'
}

// -----------------------------------------------------------------------------
// Sortie
// -----------------------------------------------------------------------------
const PRODUCTION = new Set([
  'fiche firme', '/compare', '/best-for', '/deals', 'accueil',
  'SEO / sitemap', 'route API', 'dashboard', 'composant partage',
])

const lignes = []
lignes.push('# Matrice de dependances des colonnes `prop_firms`')
lignes.push('')
lignes.push('Genere par `node scripts/column-dependency-audit.mjs`. Ne pas editer a la main.')
lignes.push('')
lignes.push('`STATUT` : **BLOQUE** = au moins une surface de production la lit encore.')
lignes.push('`LIBRE` = plus aucun lecteur de production ; la depreciation peut etre planifiee.')
lignes.push('')
lignes.push('| Colonne | Lecteurs | Ecrivains | Remplacement canonique | Statut |')
lignes.push('|---|---|---|---|---|')

let bloques = 0
let libres = 0
for (const col of COLONNES) {
  const { lit, ecrit } = carte.get(col)
  const lecteurs = Array.from(lit.entries()).sort((a, b) => b[1] - a[1])
  const ecrivains = Array.from(ecrit.entries()).sort((a, b) => b[1] - a[1])
  const enProd = lecteurs.filter(([s]) => PRODUCTION.has(s))
  const statut = enProd.length > 0 ? '**BLOQUE**' : 'LIBRE'
  if (enProd.length > 0) bloques++
  else libres++
  const fmt = (arr) => (arr.length === 0 ? '—' : arr.map(([s, n]) => `${s} (${n})`).join(', '))
  lignes.push(`| \`${col}\` | ${fmt(lecteurs)} | ${fmt(ecrivains)} | ${CANONIQUE[col] ?? '—'} | ${statut} |`)
}

lignes.push('')
lignes.push(`**${bloques} colonnes bloquees, ${libres} libres** sur ${COLONNES.length} auditees.`)
lignes.push('')
lignes.push('Une colonne LIBRE n\'est pas supprimable pour autant : elle peut etre lue')
lignes.push('par du code non couvert par cet audit (SQL ad hoc, tableaux de bord externes,')
lignes.push('exports). Elle est seulement candidate a l\'arret d\'ecriture.')

writeFileSync('MATRICE-dependances.md', lignes.join('\n') + '\n', 'utf8')
console.log(`${COLONNES.length} colonnes auditees — ${bloques} bloquees, ${libres} libres`)
console.log('MATRICE-dependances.md ecrit')
