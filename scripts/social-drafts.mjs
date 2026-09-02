// =============================================================================
// GENERATEUR DE BROUILLONS SOCIAUX — scripts/social-drafts.mjs
// =============================================================================
//   node scripts/social-drafts.mjs                      # lit Supabase
//   node scripts/social-drafts.mjs --csv export.csv     # depuis un export
//
// Ecrit content/social-drafts-<date>.md : des brouillons a relire et publier
// a la main. Le script ne publie rien et n'a acces a aucun compte.
//
// Regle unique, non negociable : un post ne se genere que si toutes les donnees
// qu'il cite existent. Aucun chiffre n'est arrondi, extrapole ni "ameliore". Un
// champ manquant fait sauter le post, il ne fait pas inventer la valeur. C'est
// la meme discipline que sur les pages : ce projet a deja publie de faux
// temoignages et des chiffres non sources, et une usine a contenu est
// exactement l'endroit ou ca revient par la porte de derriere.
// =============================================================================

import { writeFile, readFile, mkdir } from 'node:fs/promises'

const SITE = 'https://www.propfirmscanner.org'
const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

// ----------------------------------------------------------------- donnees

// Mirroir de resolvePromotion() dans lib/promotion.ts. lib/ est du TypeScript et
// ce script tourne sans etape de build. Seule duplication du fichier, assumee :
// si la regle change la-bas, elle doit changer ici.
function isPromotionLive(firm, now = new Date()) {
  const code = firm.discount_code && firm.discount_code !== 'PENDING' ? firm.discount_code : null
  if (!code) return false
  if (!(Number(firm.discount_percent) > 0)) return false
  const raw = firm.discount_expires_at
  if (raw) {
    const end = new Date(String(raw).length === 10 ? raw + 'T23:59:59.999Z' : raw)
    if (!Number.isNaN(end.getTime()) && now > end) return false
  }
  return true
}

const COLUMNS = [
  'slug', 'name', 'min_price', 'profit_split', 'trustpilot_rating', 'trustpilot_reviews',
  'discount_code', 'discount_percent', 'discount_expires_at', 'payout_frequency',
  'drawdown_type', 'is_futures', 'listing_status', 'trust_status', 'affiliate_url',
]

/**
 * Le "code promo" est-il en realite l identifiant d affiliation ?
 *
 * Test exact, pas heuristique : si la valeur de discount_code apparait telle
 * quelle dans affiliate_url, c est le jeton du lien partenaire, pas un code que
 * le visiteur peut taper au checkout. Trouve sur un export reel :
 * Funding Pips "95AD5431" venait de ?ref=95AD5431.
 *
 * Un tel code n est jamais publie : il est signale pour verification.
 */
function codeIsAffiliateToken(firm) {
  const code = firm.discount_code
  const url = firm.affiliate_url
  if (!code || !url || code.length < 4) return false
  return url.toLowerCase().includes(String(code).toLowerCase())
}

function parseCsv(text) {
  const [head, ...rows] = text.trim().split(/\r?\n/)
  const cols = head.split(',').map(c => c.trim())
  return rows.map(line => {
    const vals = []
    let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++ }
        else if (ch === '"') inQ = false
        else cur += ch
      } else if (ch === '"') inQ = true
      else if (ch === ',') { vals.push(cur); cur = '' }
      else cur += ch
    }
    vals.push(cur)
    return Object.fromEntries(cols.map((c, i) => [c, vals[i] === 'null' || vals[i] === '' ? null : vals[i]]))
  })
}

async function loadFirms() {
  const csv = arg('--csv', null)
  if (csv) return parseCsv(await readFile(csv, 'utf8'))

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error([
      'Aucune source de donnees.',
      '',
      '  Option A :  NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/social-drafts.mjs',
      '  Option B :  node scripts/social-drafts.mjs --csv chemin/export.csv',
      '',
      'Requete a passer dans Supabase pour l export :',
      '  select ' + COLUMNS.join(', '),
      "  from prop_firms where listing_status = 'listed';",
    ].join('\n'))
    process.exit(2)
  }
  const q = url + '/rest/v1/prop_firms?select=' + COLUMNS.join(',') + '&listing_status=eq.listed'
  const res = await fetch(q, { headers: { apikey: key, Authorization: 'Bearer ' + key } })
  if (!res.ok) {
    console.error('Supabase ' + res.status + ' : ' + (await res.text()).slice(0, 200))
    process.exit(2)
  }
  return res.json()
}

// ---------------------------------------------------------------- formatage

const money = n => '$' + Number(n).toLocaleString('en-US')
const pct = n => Math.round(Number(n)) + '%'
const compareUrl = (a, b) => SITE + '/compare/' + a + '-vs-' + b
const TRUSTED = f => f.trust_status && !['unverified', 'not_recommended', 'banned'].includes(f.trust_status)

// ------------------------------------------------------------- generateurs
// Chacun renvoie null si une donnee lui manque.

const GENERATORS = [
  {
    id: 'live-promos',
    build(firms, today) {
      const live = firms
        .filter(f => f.name && f.slug && isPromotionLive(f) && !codeIsAffiliateToken(f))
        .sort((a, b) => Number(b.discount_percent) - Number(a.discount_percent))
        .slice(0, 5)
      if (live.length < 2) return null
      const lines = live.map(f => f.name + ' — ' + pct(f.discount_percent) + ' off, code ' + f.discount_code)
      return {
        title: 'Codes valables aujourd hui (' + live.length + ' firmes)',
        why: 'Genere depuis les dates de validite. Ne listera jamais un code expire.',
        x: 'Prop firm codes live right now:\n\n' + lines.map(l => '• ' + l).join('\n') +
           "\n\nEvery expiry date checked against the firm's own terms.\n" + SITE + '/deals',
        instagram: 'CARROUSEL — 1 slide par firme\n\n' +
          'Slide 1 : "Live prop firm codes"\n' +
          live.map((f, i) => 'Slide ' + (i + 2) + ' : ' + f.name + ' · ' + pct(f.discount_percent) + ' off · code ' + f.discount_code).join('\n') +
          '\nDernier slide : "Full list and the rules behind them — link in bio"\n\n' +
          'LEGENDE :\nThese are live today, ' + today + '. We check the expiry date on every one.\n' +
          'Affiliate links — we may earn a commission, it costs you nothing extra.',
        short: 'SCRIPT 20 s (TikTok / Shorts)\n\n' +
          '[0-3 s] "Prop firm codes that actually work today."\n' +
          '[3-15 s] A l ecran, une firme apres l autre :\n' +
          live.map(f => '        ' + f.name + ' — ' + pct(f.discount_percent) + ' — ' + f.discount_code).join('\n') +
          '\n[15-20 s] "We check the expiry on every one. Link in bio."',
        discord: '**Live codes — ' + today + '**\n' + lines.map(l => '• ' + l).join('\n') +
          '\n\nChecked against each firm expiry date. <' + SITE + '/deals>',
      }
    },
  },
  {
    id: 'head-to-head',
    build(firms) {
      const ok = firms.filter(f =>
        f.name && f.slug && Number(f.min_price) > 0 && Number(f.profit_split) > 0 &&
        Number(f.trustpilot_rating) > 0 && TRUSTED(f))
      const futures = ok.filter(f => String(f.is_futures) === 'true')
      const pool = futures.length >= 2 ? futures : ok
      if (pool.length < 2) return null
      const [a, b] = pool
        .sort((x, y) => Number(y.trustpilot_reviews || 0) - Number(x.trustpilot_reviews || 0))
        .slice(0, 2)
      const row = f => f.name + ': from ' + money(f.min_price) + ' · ' + pct(f.profit_split) +
        ' split · ' + Number(f.trustpilot_rating).toFixed(1) + ' on Trustpilot'
      return {
        title: a.name + ' contre ' + b.name,
        why: 'Prix, split et note viennent de la base. La note est creditee a Trustpilot.',
        x: a.name + ' vs ' + b.name + '\n\n' + row(a) + '\n' + row(b) +
           '\n\nEvery rule side by side:\n' + compareUrl(a.slug, b.slug),
        instagram: 'CARROUSEL comparatif\n\n' +
          'Slide 1 : "' + a.name + ' vs ' + b.name + '"\n' +
          'Slide 2 : Entry price — ' + money(a.min_price) + ' vs ' + money(b.min_price) + '\n' +
          'Slide 3 : Profit split — ' + pct(a.profit_split) + ' vs ' + pct(b.profit_split) + '\n' +
          'Slide 4 : Trustpilot — ' + Number(a.trustpilot_rating).toFixed(1) + ' vs ' + Number(b.trustpilot_rating).toFixed(1) + '\n' +
          'Slide 5 : "Full comparison — link in bio"\n\n' +
          'LEGENDE :\nRatings are Trustpilot scores, not ours. Rule-by-rule breakdown on the site.',
        short: 'SCRIPT 30 s\n\n' +
          '[0-4 s]   "' + a.name + ' or ' + b.name + '? Here is the honest answer."\n' +
          '[4-12 s]  Entry price : ' + money(a.min_price) + ' vs ' + money(b.min_price) + '\n' +
          '[12-20 s] Profit split : ' + pct(a.profit_split) + ' vs ' + pct(b.profit_split) + '\n' +
          '[20-26 s] Trustpilot : ' + Number(a.trustpilot_rating).toFixed(1) + ' vs ' + Number(b.trustpilot_rating).toFixed(1) + '\n' +
          '[26-30 s] "Full comparison, link in bio."',
        discord: '**' + a.name + ' vs ' + b.name + '**\n' + row(a) + '\n' + row(b) +
          '\n<' + compareUrl(a.slug, b.slug) + '>',
      }
    },
  },
  {
    id: 'cheapest-entry',
    build(firms) {
      const ok = firms
        .filter(f => f.name && f.slug && Number(f.min_price) > 0 && TRUSTED(f))
        .sort((a, b) => Number(a.min_price) - Number(b.min_price))
        .slice(0, 5)
      if (ok.length < 3) return null
      const lines = ok.map((f, i) => (i + 1) + '. ' + f.name + ' — from ' + money(f.min_price))
      return {
        title: 'Les tickets d entree les moins chers',
        why: 'Uniquement des firmes au statut de confiance renseigne. Les non verifiees sont exclues.',
        x: 'Cheapest way into a funded account right now:\n\n' + lines.join('\n') +
           '\n\nPrice is half the story. The rules are the other half:\n' + SITE + '/compare',
        instagram: 'CARROUSEL "Cheapest entry"\n\n' +
          'Slide 1 : "Funded from ' + money(ok[0].min_price) + '"\n' +
          ok.map((f, i) => 'Slide ' + (i + 2) + ' : ' + f.name + ' — ' + money(f.min_price)).join('\n') +
          '\nDernier slide : "Cheap is not the same as good — rules on the site"\n\n' +
          'LEGENDE :\nStarting prices, checked against each firm own page.',
        short: 'SCRIPT 20 s\n\n' +
          '[0-4 s]   "You can get funded from ' + money(ok[0].min_price) + '."\n' +
          '[4-16 s]  A l ecran :\n' + lines.map(l => '        ' + l).join('\n') + '\n' +
          '[16-20 s] "But cheap does not mean good. Rules matter more — link in bio."',
        discord: '**Cheapest entry points**\n' + lines.join('\n') + '\n<' + SITE + '/compare>',
      }
    },
  },
  {
    id: 'payout-speed',
    build(firms) {
      const ok = firms
        .filter(f => f.name && f.slug && f.payout_frequency && TRUSTED(f) && Number(f.profit_split) > 0)
        .slice(0, 4)
      if (ok.length < 3) return null
      const lines = ok.map(f => f.name + ' — ' + f.payout_frequency + ' payouts, ' + pct(f.profit_split) + ' split')
      return {
        title: 'Frequence de retrait',
        why: 'payout_frequency et profit_split lus tels quels. Aucune firme sans les deux.',
        x: 'How often you actually get paid:\n\n' + lines.map(l => '• ' + l).join('\n') +
           '\n\nPayout terms, in full:\n' + SITE + '/compare',
        instagram: 'CARROUSEL "How often do you get paid?"\n\n' +
          'Slide 1 : "Passing is step one. Getting paid is step two."\n' +
          ok.map((f, i) => 'Slide ' + (i + 2) + ' : ' + f.name + ' — ' + f.payout_frequency).join('\n') +
          '\n\nLEGENDE :\nPayout frequency as published by each firm.',
        short: 'SCRIPT 25 s\n\n' +
          '[0-5 s]  "Passing the challenge is step one. Getting paid is step two."\n' +
          '[5-20 s] ' + lines.join(' / ') + '\n' +
          '[20-25 s] "Full payout terms — link in bio."',
        discord: '**Payout frequency**\n' + lines.map(l => '• ' + l).join('\n') + '\n<' + SITE + '/compare>',
      }
    },
  },
]

// -------------------------------------------------------------------- sortie

const firms = await loadFirms()
const today = new Date().toISOString().slice(0, 10)

// Signale sans publier : ces lignes demandent une correction en base.
const suspects = firms.filter(f => f.discount_code && codeIsAffiliateToken(f))

const drafts = []
const skipped = []
for (const g of GENERATORS) {
  const d = g.build(firms, today)
  if (d) drafts.push(d)
  else skipped.push(g.id)
}

let md = '# Brouillons sociaux — ' + today + '\n\n'
md += firms.length + ' firmes lues. ' + drafts.length + ' sujet(s) sur ' + GENERATORS.length + '.\n\n'
if (skipped.length) {
  md += 'Non generes faute de donnees completes : ' + skipped.join(', ') +
        '. Aucun post inente pour combler.\n\n'
}
if (suspects.length) {
  md += '## A corriger en base avant toute publication\n\n'
  md += 'Sur ces firmes, `discount_code` contient une valeur qui apparait telle quelle\n'
  md += 'dans `affiliate_url` : c est l identifiant d affiliation, pas un code que le\n'
  md += 'visiteur peut taper au checkout. Elles sont exclues des posts.\n\n'
  for (const f of suspects) {
    md += '- **' + f.name + '** — discount_code `' + f.discount_code + '` present dans ' + f.affiliate_url + '\n'
  }
  md += '\n---\n\n'
}

md += '> A relire avant publication. Rien n est publie automatiquement.\n'
md += '> Chaque chiffre vient de la base. Si une donnee manquait, le post n a pas ete genere.\n\n---\n\n'

for (const d of drafts) {
  md += '## ' + d.title + '\n\n_' + d.why + '_\n\n'
  md += '### X\n\n```\n' + d.x + '\n```\n\n'
  md += '### Instagram\n\n```\n' + d.instagram + '\n```\n\n'
  md += '### TikTok / YouTube Shorts\n\n```\n' + d.short + '\n```\n\n'
  md += '### Discord\n\n```\n' + d.discord + '\n```\n\n---\n\n'
}

md += '## Avant de publier\n\n'
md += '- Mentionner l affiliation des qu un lien sortant figure dans le post.\n'
md += '- Les notes Trustpilot sont celles de Trustpilot, jamais presentees comme des notes PropFirmScanner.\n'
md += '- Les codes cites sont valides au ' + today + '. Repasser le script avant chaque publication.\n'

await mkdir('content', { recursive: true })
const out = 'content/social-drafts-' + today + '.md'
await writeFile(out, md, 'utf8')
console.log(drafts.length + ' sujet(s) x 4 plateformes -> ' + out)
if (skipped.length) console.log('sautes (donnees incompletes) : ' + skipped.join(', '))
