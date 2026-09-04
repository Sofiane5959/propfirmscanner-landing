// =============================================================================
// GENERATEUR DE CONTENU EDITORIAL — scripts/build-firm-content.mjs
// =============================================================================
//   node scripts/build-firm-content.mjs
//
// Ecrit database/RUN-<slug>.sql pour chaque firme decrite ici.
//
// Pourquoi ce script existe : la page firme tire sa substance de colonnes JSONB
// (journey, key_rules, program_guide, cost_timeline, verdict_card, pros, cons,
// education, checkout_options). Une section disparait quand sa colonne est
// NULL. Remplir seulement les colonnes scalaires laisse donc une page vide,
// meme apres un import reussi. Les structures ci-dessous reprennent exactement
// celles relevees sur la page Earn2Trade.
//
// Regle : rien n est ecrit qui ne soit sourcable. Les sources sont citees en
// commentaire dans le SQL genere, et ce qui reste incertain est laisse dehors,
// liste en fin de fichier.
// =============================================================================

import { writeFile } from 'node:fs/promises'
import { ALL_FIRMS } from './firm-content.mjs'
import { BUNDLES } from './firm-translations/index.mjs'

const J = (o) => "'" + JSON.stringify(o).replace(/'/g, "''") + "'"
const S = (s) => s === null || s === undefined ? 'null' : "'" + String(s).replace(/'/g, "''") + "'"
const N = (n) => n === null || n === undefined ? 'null' : String(n)


// Types reels des colonnes, releves dans information_schema.columns.
// Ils ne sont pas homogenes et c est le piege : assets, pros, cons,
// included_items, payout_methods et special_features sont de vrais tableaux
// Postgres (text[]) ; platforms est du text simple que toArray() reparse cote
// code ; les blocs editoriaux sont du jsonb.
const TEXT_ARRAY = new Set(['assets', 'pros', 'cons', 'included_items', 'payout_methods', 'special_features', 'restricted_countries'])
const JSONB = new Set(['verdict_card', 'program_guide', 'key_rules', 'journey', 'cost_timeline', 'checkout_options', 'proof_stats', 'value_strip', 'education', 'translations'])

/**
 * Litteral de tableau Postgres : {"a","b"}
 *
 * JSON.stringify produit exactement la forme attendue pour un element de
 * text[] : entre guillemets doubles, avec les guillemets et antislashs internes
 * echappes. Les apostrophes sont ensuite doublees par J()/S() au niveau du
 * litteral SQL.
 */
const pgArray = (v) =>
  "'{" + v.map(x => JSON.stringify(String(x))).join(',').replace(/'/g, "''") + "}'::text[]"

function listLiteral(col, v) {
  if (TEXT_ARRAY.has(col)) return pgArray(v)
  if (JSONB.has(col)) return J(v) + '::jsonb'
  // Colonne TEXT simple (platforms, challenge_types). On y ecrit une liste
  // separee par des virgules, PAS du JSON.
  //
  // La version precedente y ecrivait du JSON. lib/to-array.ts sait desormais
  // le relire, mais avant le 3 septembre 2026 il ne savait que decouper sur
  // les virgules : les puces affichaient « MetaTrader 4" » et « ["MetaTrader 4 »
  // sur FTMO, The5ers et Hantec Trader, guillemets et crochets compris.
  // Une virgule dans un nom de plateforme casserait ce format ; aucun n en
  // contient, et l alternative (du JSON) a deja coute une panne.
  return S(v.join(', '))
}

// -----------------------------------------------------------------------------
// Generation
// -----------------------------------------------------------------------------
const COLS = ['id', 'slug', 'name', 'firm_name', 'firm_slug', 'account_size', 'steps',
  'max_drawdown', 'max_daily_loss', 'phase1_profit_target', 'phase2_profit_target',
  'drawdown_type', 'max_loss_type', 'profit_split', 'price', 'discounted_price',
  'payout_frequency_description', 'consistency_rule', 'allows_ea', 'allows_scalping',
  'allows_news_trading', 'billing_period', 'risk_unit']

function build(firm) {
  const L = []
  L.push('-- =============================================================================')
  L.push(`-- ${firm.scalars.name.toUpperCase()} — TOUT EN UN`)
  L.push('-- =============================================================================')
  L.push('-- Un seul copier-coller. Aucun prerequis. Toutes les commandes sont')
  L.push('-- idempotentes : rejouable sans casse.')
  L.push('--')
  L.push('-- OU LE COLLER : supabase.com -> ton projet -> SQL Editor -> New query')
  L.push('--                -> coller -> Run.')
  L.push('--')
  L.push('-- Ce fichier remplit AUSSI les colonnes editoriales JSONB (journey, key_rules,')
  L.push('-- program_guide, cost_timeline, verdict_card, pros, cons). Ce sont elles qui')
  L.push('-- donnent son epaisseur a la page : une section disparait quand sa colonne est')
  L.push('-- NULL. Sans elles, la page reste vide meme apres un import reussi.')
  L.push('-- =============================================================================')
  L.push('')
  L.push('')
  L.push('-- 1. SAUVEGARDE — lis cette sortie avant de continuer')
  L.push(`select * from prop_firms where slug = ${S(firm.slug)};`)
  L.push(`select * from prop_firm_challenges where firm_slug = ${S(firm.slug)};`)
  L.push('')
  L.push('')
  L.push('-- 2. Colonnes necessaires (sans effet si elles existent deja)')
  for (const c of ['price_currency text default \'USD\'', 'data_verified_at timestamptz',
    'data_verified_by text', 'source_url text', 'rating_checked_at timestamptz',
    'discount_status text', 'discount_starts_at timestamptz', 'max_profit_split integer',
    'translations jsonb',
    'restricted_countries text[]']) {
    L.push(`alter table prop_firms add column if not exists ${c};`)
  }
  L.push('')
  L.push('')
  L.push('-- 3. La firme : identite, contenu editorial, listes')
  L.push('update prop_firms set')
  const sets = []
  for (const [k, v] of Object.entries(firm.scalars)) {
    sets.push(`  ${k.padEnd(20)} = ${typeof v === 'number' ? N(v) : typeof v === 'boolean' ? String(v) : S(v)}`)
  }
  for (const [k, v] of Object.entries(firm.arrays)) sets.push(`  ${k.padEnd(20)} = ${listLiteral(k, v)}`)
  for (const [k, v] of Object.entries(firm.json)) sets.push(`  ${k.padEnd(20)} = ${J(v)}::jsonb`)
  // translations : les colonnes de base portent l ANGLAIS, et translations.<locale>
  // vient se superposer par-dessus (PropFirmPageClient fusionne le bundle en une
  // fois). Ecrire du francais dans les colonnes de base, comme la version
  // precedente le faisait, servait du francais sur la page anglaise.
  // Un bundle par locale traduite. Les colonnes de base portent l ANGLAIS ;
  // PropFirmPageClient superpose translations[locale] par-dessus.
  // Le francais vit dans firm-content.mjs (bloc `fr`), les autres langues
  // dans scripts/firm-translations/<locale>.mjs — un fichier par langue, pour
  // qu ajouter une langue soit un fichier et non une refonte.
  const bundles = {}
  if (firm.fr) bundles.fr = firm.fr
  for (const [loc, parSlug] of Object.entries(BUNDLES)) {
    if (parSlug[firm.slug]) bundles[loc] = parSlug[firm.slug]
  }
  if (Object.keys(bundles).length) {
    sets.push(`  ${'translations'.padEnd(20)} = ${J(bundles)}::jsonb`)
  }
  sets.push(`  ${'data_verified_at'.padEnd(20)} = timestamptz '2026-09-03'`)
  sets.push(`  ${'data_verified_by'.padEnd(20)} = 'PropFirmScanner'`)
  sets.push(`  ${'updated_at'.padEnd(20)} = now()`)
  L.push(sets.join(',\n'))
  L.push(`where slug = ${S(firm.slug)};`)
  L.push('')
  if (firm.clearPromo) {
    L.push('')
    L.push('-- 3b. Effacer le code promo existant')
    for (const line of firm.clearPromo) L.push('-- ' + line)
    L.push('update prop_firms set')
    L.push('  discount_code    = null,')
    L.push('  discount_percent = null,')
    L.push("  discount_status  = 'none'")
    L.push(`where slug = ${S(firm.slug)};`)
    L.push('')
  }
  if (firm.promo) {
    L.push('')
    L.push('-- 3b. Code promo')
    for (const line of firm.promo.why) L.push('-- ' + line)
    L.push('update prop_firms set')
    L.push(`  discount_code    = ${S(firm.promo.code)},`)
    L.push(`  discount_percent = ${N(firm.promo.percent)},`)
    L.push(`  discount_note    = ${S(firm.promo.note)},`)
    L.push("  discount_status  = 'active'")
    L.push(`where slug = ${S(firm.slug)};`)
    L.push('')
  }
  L.push('')
  L.push('-- 4. Les programmes — c est ce qui fait apparaitre le configurateur')
  L.push('-- Pas de begin/commit : l editeur SQL de Supabase enveloppe deja le')
  L.push('-- script dans sa propre transaction. Un begin explicite a l interieur')
  L.push('-- peut faire echouer l ensemble sans message clair.')
  L.push('')
  L.push(`delete from prop_firm_challenges where firm_slug = ${S(firm.slug)};`)
  L.push('')
  L.push(`insert into prop_firm_challenges (${COLS.join(', ')}) values`)
  const rows = firm.challenges.map(c => {
    const [slug, name, size, steps, maxDd, dailyDd, t1, t2, ddType, lossType, price, disc, rowSplit] = c
    // Le partage varie par programme chez plusieurs firmes : FTMO donne 90 %
    // sur le 1-Step et 80 % sur le 2-Step, The5ers va de 50 % a 80 % selon le
    // programme. Un 13e element facultatif porte cette valeur ; sinon on
    // retombe sur le taux unique de la firme.
    const split = rowSplit ?? firm.profitSplitPerChallenge ?? (firm.scalars.profit_split ?? null)
    const payout = firm.payout?.[slug] ?? null
    return '  (' + [
      'gen_random_uuid()', S(slug), S(name), S(firm.scalars.name), S(firm.slug), S(size), S(steps),
      N(maxDd), N(dailyDd), N(t1), N(t2), S(ddType), S(lossType), N(split), N(price), N(disc),
      S(payout), S(firm.consistency[steps] ?? null), 'true', 'true', 'true', "'one-time'", S(firm.riskUnit),
    ].join(', ') + ')'
  })
  L.push(rows.join(',\n') + ';')
  L.push('')
  L.push('')
  L.push('')
  L.push('-- 5. CONTROLE — ces requetes disent si ca a marche')
  L.push('select slug, name, min_price, price_currency, profit_split, is_futures,')
  L.push('       (verdict_card is not null) as a_un_verdict,')
  L.push('       (key_rules is not null) as a_des_regles,')
  L.push('       (journey is not null) as a_un_parcours,')
  L.push('       cardinality(pros) as nb_pros,')
  L.push("       ((translations -> 'fr') is not null) as a_une_traduction_fr")
  L.push(`from prop_firms where slug = ${S(firm.slug)};`)
  L.push('')
  L.push(`-- Attendu : ${firm.challenges.length} ligne(s).`)
  L.push('select name, account_size, price, max_drawdown, phase1_profit_target, profit_split')
  L.push(`from prop_firm_challenges where firm_slug = ${S(firm.slug)} order by price;`)
  L.push('')
  L.push('')
  L.push('-- =============================================================================')
  L.push('-- NON ECRIT — et pourquoi')
  L.push('-- =============================================================================')
  for (const n of firm.notes) {
    L.push('--')
    for (const line of n.match(/.{1,72}(\s|$)/g)) L.push('-- ' + line.trim())
  }
  return L.join('\n') + '\n'
}

for (const firm of ALL_FIRMS) {
  const out = `database/RUN-${firm.slug}.sql`
  await writeFile(out, build(firm), 'utf8')
  const cols = Object.keys(firm.scalars).length + Object.keys(firm.arrays).length + Object.keys(firm.json).length + (firm.fr ? 1 : 0)
  console.log(`${out.padEnd(38)} ${String(cols).padStart(2)} colonnes · ${firm.challenges.length} challenge(s) · ${Object.keys(firm.json).length} bloc(s) editoriaux`)
}
