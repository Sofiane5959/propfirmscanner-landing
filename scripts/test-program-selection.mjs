// =============================================================================
// TESTS DE SELECTION  scripts/test-program-selection.mjs
// =============================================================================
//   node scripts/test-program-selection.mjs
//
// Verifie sur les donnees reelles des packs qu'aucun programme n'affiche les
// regles d'un autre, que les variantes ne se melangent pas, et que les prix
// et devises suivent la selection.
//
// Sans base de donnees ni navigateur : ces tests portent sur la logique de
// selection et sur les donnees qui l'alimentent, ce qui est exactement ou les
// erreurs se sont produites jusqu'ici.
//
// Aucun lien d'affiliation n'est ouvert. Le CTA est construit et inspecte,
// jamais suivi.
// =============================================================================

import { PACKS_V2 } from './program-packs-v2.mjs'

let ok = 0
let ko = 0
const cas = (nom, condition, detail = '') => {
  if (condition) { ok++; console.log('  ok   ' + nom) }
  else { ko++; console.log('  ECHEC ' + nom + (detail ? ' — ' + detail : '')) }
}

const firme = (slug) => PACKS_V2.find((p) => p.firm_slug === slug)
const prog = (f, slug) => firme(f).programs.find((p) => p.slug === slug)
const plans = (f, slug, filtre) => prog(f, slug).plans.filter(filtre)

console.log('\n1. FTMO — le 1-Step et le 2-Step ne partagent aucune regle')
{
  const un = prog('ftmo', 'ftmo-cfd-1-step')
  const deux = prog('ftmo', 'ftmo-cfd-2-step')
  cas('le 1-Step porte une Best Day Rule',
    un.plans.some((p) => p.best_day_rule === 0.5))
  cas('le 2-Step n en porte aucune',
    deux.plans.every((p) => !p.best_day_rule))
  cas('le 1-Step n annonce aucun remboursement',
    un.plans.every((p) => !p.refund_note || p.refund_note.toLowerCase().includes('no refund')))
  cas('le 2-Step annonce un remboursement',
    deux.plans.some((p) => (p.refund_note || '').includes('100%')))
  cas('le scaling est absent du 1-Step',
    un.plans.every((p) => (p.scaling_note || '').toLowerCase().includes('does not apply')))
  cas('le 1-Step a 3 % de perte journaliere, le 2-Step 5 %',
    un.plans.every((p) => p.daily_loss_limit === null || p.daily_loss_limit === 0.03) &&
    deux.plans.every((p) => p.daily_loss_limit === null || p.daily_loss_limit === 0.05))
}

console.log('\n2. FTMO — Swing existe seulement sous le 2-Step')
{
  const un = prog('ftmo', 'ftmo-cfd-1-step')
  const deux = prog('ftmo', 'ftmo-cfd-2-step')
  cas('aucun Swing sous le 1-Step', un.plans.every((p) => p.variant_key !== 'swing'))
  cas('Swing present sous le 2-Step', deux.plans.some((p) => p.variant_key === 'swing'))
  const swingSizes = new Set(deux.plans.filter((p) => p.variant_key === 'swing').map((p) => p.account_size))
  cas('Swing ne propose pas de 200K', !swingSizes.has(200000), Array.from(swingSizes).join(','))
  const stdSizes = new Set(deux.plans.filter((p) => p.variant_key === 'standard').map((p) => p.account_size))
  cas('Standard propose bien le 200K', stdSizes.has(200000))
}

console.log('\n3. FTMO — devise et phases')
{
  const deux = prog('ftmo', 'ftmo-cfd-2-step')
  cas('tous les plans FTMO sont en EUR', deux.plans.every((p) => p.currency === 'EUR'))
  const p2 = deux.plans.filter((p) => p.phase === 'evaluation_2')
  cas('le 2-Step a une seconde phase', p2.length > 0)
  cas('la seconde phase vise 5 %', p2.every((p) => p.profit_target === 0.05))
  cas('la premiere phase vise 10 %',
    deux.plans.filter((p) => p.phase === 'evaluation').every((p) => p.profit_target === 0.10))
}

console.log('\n4. FTMO — la promotion 20 % ne deborde pas')
{
  const promo = firme('ftmo').promotions[0]
  cas('limitee au 1-Step', promo.program_slug === 'ftmo-cfd-1-step')
  cas('limitee au 100K', promo.account_size === 100000)
  cas('limitee a la variante Standard',
    Array.isArray(promo.eligible_variants) && promo.eligible_variants.join() === 'standard')
  cas('aucune expiration inventee', promo.expires_at === null)
  cas('checkout non verifie, donc rien de promis', promo.checkout_verified === false)
}

console.log('\n5. FTMO Futures — separe et sans regle CFD')
{
  const fut = prog('ftmo', 'ftmo-futures-beta')
  cas('marche futures', fut.market === 'futures')
  cas('statut beta', fut.status === 'beta')
  cas('aucun plan recopie du CFD', fut.plans.length === 0)
}

console.log('\n6. The5ers — les quatre variantes Summer 2-Step')
{
  const deux = prog('the5ers', 't5-summer-cfd-2-step')
  const cles = new Set(deux.plans.map((p) => `${p.account_size}|${p.variant_key}`))
  for (const attendu of ['100000|8-5', '100000|10-5', '200000|8-5', '200000|10-5']) {
    cas('variante presente : ' + attendu, cles.has(attendu))
  }
  const prix = (size, v) => deux.plans.find(
    (p) => p.account_size === size && p.variant_key === v && p.regular_price != null)?.regular_price
  cas('100K 8/5 a 179 $', prix(100000, '8-5') === 179)
  cas('100K 10/5 a 149 $', prix(100000, '10-5') === 149)
  cas('200K 8/5 a 279 $', prix(200000, '8-5') === 279)
  cas('200K 10/5 a 249 $', prix(200000, '10-5') === 249)
  cas('les deux variantes 100K ont des prix differents', prix(100000, '8-5') !== prix(100000, '10-5'))
}

console.log('\n7. The5ers — anomalie du 100 % non importee')
{
  const deux = prog('the5ers', 't5-summer-cfd-2-step')
  const funded200 = deux.plans.filter((p) => p.account_size === 200000 && p.phase === 'sim_funded')
  cas('aucun objectif funded a 100 %', funded200.every((p) => p.profit_target !== 1))
  cas('les lignes 200K sont marquees a confirmer',
    funded200.every((p) => p.confidence === 'needs_confirmation'))
}

console.log('\n8. The5ers — classiques conserves mais non publies')
{
  const classiques = firme('the5ers').programs.filter((p) => p.program_family === 'Classic')
  cas('cinq programmes classiques conserves', classiques.length === 5, String(classiques.length))
  cas('tous marques unverified', classiques.every((p) => p.status === 'unverified'))
  cas('aucun prix publie pour eux', classiques.every((p) => p.plans.length === 0))
}

console.log('\n9. Regles — aucune ne fuit vers un autre programme')
{
  for (const pack of PACKS_V2) {
    const slugs = new Set(pack.programs.map((p) => p.slug))
    const mauvaises = pack.rules.filter(([slug]) => slug !== null && !slugs.has(slug))
    cas(`${pack.firm_slug} : chaque regle vise un programme existant`, mauvaises.length === 0,
      mauvaises.map((r) => r[0]).join(','))
    for (const p of pack.programs) {
      const visibles = pack.rules.filter(([slug]) => slug === null || slug === p.slug)
      const etrangeres = visibles.filter(([slug]) => slug !== null && slug !== p.slug)
      cas(`${pack.firm_slug} / ${p.slug} : aucune regle etrangere`, etrangeres.length === 0)
    }
  }
}

console.log('\n10. Aucun zero utilise pour un inconnu')
{
  for (const pack of PACKS_V2) {
    for (const p of pack.programs) {
      for (const pl of p.plans) {
        for (const [k, v] of Object.entries(pl)) {
          if (v === 0 && !['activation_fee', 'reset_fee'].includes(k)) {
            ko++
            console.log(`  ECHEC ${pack.firm_slug}/${p.slug} ${k} = 0`)
          }
        }
      }
    }
  }
  cas('aucun zero suspect', true)
}

console.log('\n11. Architecture — aucun branchement sur un slug de firme')
{
  const { execSync } = await import('node:child_process')
  // Le brief et CLAUDE.md interdisent `if (firm.slug === 'x')` dans un
  // composant de presentation. La difference doit venir des donnees.
  let fautes = ''
  try {
    fautes = execSync(
      "grep -rn \"slug === '\" --include=*.tsx components 'app/[locale]/prop-firm' || true",
      { encoding: 'utf8', shell: 'bash' }
    ).trim()
  } catch {
    fautes = ''
  }
  cas('aucun composant ne branche sur un slug', fautes === '', fautes.slice(0, 160))
}

console.log('\n12. Architecture — aucun composant nomme d apres une firme')
{
  const { execSync } = await import('node:child_process')
  const fichiers = execSync('ls components components/prop-firm', { encoding: 'utf8', shell: 'bash' })
  const interdits = ['FuturesElitePage', 'FTMOPage', 'The5ersPage', 'Earn2TradePage']
  const trouves = interdits.filter((n) => fichiers.includes(n))
  cas('aucun fichier specifique a une firme', trouves.length === 0, trouves.join(','))
}

console.log('')
console.log('13. Un seul systeme de fiche, celui d Earn2Trade')
{
  const { readFileSync, existsSync } = await import('node:fs')
  const page = readFileSync('app/[locale]/prop-firm/[slug]/PropFirmPageClient.tsx', 'utf8')

  // Earn2Trade et FuturesElite passent par la MEME route et le meme composant.
  // Une version precedente avait ajoute un second configurateur qui recopiait
  // la mise en page a quelques pixels pres : toute correction ergonomique
  // devait etre faite deux fois, et la seconde etait oubliee.
  for (const mort of ['components/ProgramExplorer.tsx', 'components/prop-firm/PlanSections.tsx']) {
    cas('supprime : ' + mort, !existsSync(mort))
  }

  const nbSelecteurs = page.split('<ChallengeSelector').length - 1
  cas('un seul configurateur monte dans la page', nbSelecteurs === 1, String(nbSelecteurs))

  // Les sections du gabarit doivent etre rendues pour TOUTES les firmes. Les
  // eteindre pour celles a programmes normalises etait exactement le defaut
  // signale : la fiche perdait son parcours, ses couts et ses regles.
  cas('aucune porte n eteint les sections du gabarit',
    !page.includes('selectedDrivesPage'))
  for (const section of ['journey?.steps?.length', 'costTimeline?.steps?.length', 'keyRules?.rules?.length']) {
    cas('section rendue sur ses donnees seules : ' + section, page.includes('{' + section + ' ? ('))
  }

  // Le brief interdit un composant nomme d apres une firme ET un branchement
  // sur un slug. La seule section ajoutee est generique.
  cas('la section par phase existe', existsSync('components/prop-firm/EvaluationVsFunded.tsx'))
}

console.log('')
console.log('14. Basculement de programme et rendu conditionnel des phases')
{
  // L adaptateur est en TypeScript, donc non importable ici. On teste les
  // invariants sur les DONNEES qui l alimentent : c est la que les erreurs se
  // sont produites, et ce sont elles que l adaptateur traduit.
  const { FUTURESELITE_PROGRAMS } = await import('./futureselite-programs.mjs')

  const combinaisons = (p) => {
    const vues = new Set()
    for (const pl of p.plans) vues.add((pl.variant_key ?? '') + '|' + pl.account_size)
    return Array.from(vues)
  }

  for (const p of FUTURESELITE_PROGRAMS.filter((x) => x.plans.length > 0)) {
    const combos = combinaisons(p)
    cas(`${p.slug} : au moins une taille vendable`, combos.length > 0)

    // Chaque combinaison doit avoir un compte finance, sinon la section par
    // phase n a pas de second terme et disparait sans explication.
    const sansFinance = combos.filter((c) => {
      const [v, s] = c.split('|')
      return !p.plans.some((pl) => pl.phase === 'sim_funded' &&
        (pl.variant_key ?? '') === v && String(pl.account_size) === s)
    })
    cas(`${p.slug} : chaque taille a un compte finance`, sansFinance.length === 0, sansFinance.join(','))

    // Rendu conditionnel : un produit instantane ne doit porter AUCUNE ligne
    // d evaluation, sinon la page affiche un objectif a atteindre qui n existe
    // pas. C est le defaut « 20 % -> 20 % » vu sur la fiche.
    const aEvaluation = p.plans.some((pl) => pl.phase === 'evaluation')
    if (p.kind === 'instant') {
      cas(`${p.slug} : instantane, aucune phase d evaluation`, !aEvaluation)
    } else {
      cas(`${p.slug} : evaluation presente`, aEvaluation)
    }
  }

  // Basculer de programme doit changer ce que le visiteur lit. Deux programmes
  // dont toutes les regles coincident signaleraient une recopie.
  const parSlug = (s) => FUTURESELITE_PROGRAMS.find((p) => p.slug === s)
  const elite = parSlug('elite')
  const instant = FUTURESELITE_PROGRAMS.find((p) => p.kind === 'instant')
  if (elite && instant) {
    const f = (p) => p.plans.find((pl) => pl.phase === 'sim_funded' && pl.account_size === 25000)
    const a = f(elite)
    const b = f(instant)
    cas('Elite et Instant ne partagent pas leur drawdown au meme palier',
      !a || !b || a.drawdown_type !== b.drawdown_type || a.minimum_trading_days !== b.minimum_trading_days,
      `${a?.drawdown_type} / ${b?.drawdown_type}`)
  }

  // Une unite melangee ferait afficher « 1000 % » au lieu de « 1 000 $ ».
  // L adaptateur tranche sur < 1 ; encore faut-il que les donnees ne melangent
  // pas les deux dans un meme plan.
  for (const p of FUTURESELITE_PROGRAMS) {
    for (const pl of p.plans) {
      const vus = [pl.maximum_loss_limit, pl.daily_loss_limit].filter((v) => v !== null && v !== undefined)
      if (vus.length < 2) continue
      cas(`${p.slug} ${pl.account_size} : limites dans la meme unite`,
        vus.every((v) => v < 1) || vus.every((v) => v >= 1), vus.join('/'))
    }
  }
}


console.log('')
console.log('18. Chaque programme montre SES regles, jamais celles d un autre')
{
  const { FUTURESELITE_PROGRAMS, FUTURESELITE_PLATFORMS, FUTURESELITE_PARTNER_PROMOTION,
          FUTURESELITE_PROMOTIONS } = await import('./futureselite-programs.mjs')
  const { FUTURESELITE } = await import('./firm-content.mjs')
  const { readFileSync } = await import('node:fs')

  const p = (slug) => FUTURESELITE_PROGRAMS.find((x) => x.slug === slug)
  const finance = (slug) => p(slug).plans.filter((x) => x.phase === 'sim_funded')
  const evalue = (slug) => p(slug).plans.filter((x) => x.phase === 'evaluation')

  // Instant : 80 % et fin de journee. Les deux erreurs venaient du niveau
  // firme, qui annoncait 90 % et un drawdown unique pour les quatre programmes.
  cas('Instant n affiche jamais 90 %', finance('instant').every((x) => x.profit_split === 0.8))
  cas('Instant n affiche jamais Trailing Equity',
    finance('instant').every((x) => x.drawdown_type === 'End of Day'))
  cas('Instant demarre a 20 % de regularite',
    finance('instant').every((x) => x.consistency_rule === 0.2))

  // Prime : le seul programme avec une limite journaliere, dans les deux
  // phases, et le seul qui garde une regularite une fois finance.
  cas('Prime a une limite journaliere en evaluation',
    evalue('prime').every((x) => x.daily_loss_limit != null))
  cas('Prime a une limite journaliere une fois finance',
    finance('prime').every((x) => x.daily_loss_limit != null))
  cas('Prime garde 40 % de regularite finance',
    finance('prime').every((x) => x.consistency_rule === 0.4))

  // Nitro : bascule en trailing equity une fois finance.
  cas('Nitro finance est en Trailing Equity',
    finance('nitro').every((x) => x.drawdown_type === 'Trailing Equity'))
  cas('Nitro en evaluation reste en fin de journee',
    evalue('nitro').every((x) => x.drawdown_type === 'End of Day'))

  // Elite : ses 3 jours et ses 6 jours ne debordent pas sur les autres.
  cas('les jours d evaluation different entre programmes',
    new Set(['elite', 'nitro', 'prime'].map((s) => evalue(s)[0].minimum_trading_days)).size > 1)
  cas('les jours avant retrait different entre programmes',
    new Set(['elite', 'nitro', 'prime'].map((s) => finance(s)[0].minimum_trading_days)).size > 1)

  // Six plateformes selectionnables, pas sept.
  cas('six plateformes selectionnables exactement',
    FUTURESELITE_PLATFORMS.filter((x) => x.configurator_status === 'selectable').length === 6)

  // SCANNED a 30 %.
  cas('SCANNED affiche 30 %', FUTURESELITE_PARTNER_PROMOTION.discount_value === 0.30)

  // Seuls les trois Prime a 35 % portent l avertissement de prix.
  const avertis = FUTURESELITE_PROMOTIONS
    .filter((x) => x.is_public && x.discount_value > FUTURESELITE_PARTNER_PROMOTION.discount_value)
    .map((x) => `${x.program_slug}-${x.account_size}`)
  cas('trois plans avertis, tous Prime',
    avertis.length === 3 && avertis.every((x) => x.startsWith('prime')), avertis.join(', '))

  // Aucune promesse de preremplissage nulle part dans la fiche.
  const page = readFileSync('app/[locale]/prop-firm/[slug]/PropFirmPageClient.tsx', 'utf8')
  const config = readFileSync('app/[locale]/prop-firm/[slug]/ChallengeSelector.tsx', 'utf8')
  for (const [nom, texte] of [['la fiche', page], ['le configurateur', config]]) {
    cas(`${nom} ne promet aucun preremplissage`,
      // Sept ecritures : chercher « prefilled » en alphabet latin laissait passer
      // les six promesses arabes et hindi, qui disent exactement la meme chose.
      !/pre-?fill|prerempli|prérempli|vorausgef|precargad|pré-preenchid|مسبق|يُملأ|पहले से भरा/i.test(texte))
  }

  // Aucun fait propre a un programme dans la bande de faits de la firme.
  const bande = JSON.stringify(FUTURESELITE.arrays?.value_strip ?? [])
  const INTERDITS = ['No daily loss limit', 'No consistency rule once funded', 'Trailing Equity']
  for (const f of INTERDITS) {
    cas('la bande de faits ne generalise pas : ' + f, !bande.includes(f))
  }

  // Le partage de base n est plus 90 % : Instant paie 80 %.
  cas('le partage de base de la firme vaut 80 %', FUTURESELITE.scalars.profit_split === 80,
    String(FUTURESELITE.scalars.profit_split))
}

console.log('')
console.log('17. Aucun contenu editorial ne fuit d une firme a l autre')
{
  const { FTMO, FUTURESELITE, THE5ERS } = await import('./firm-content.mjs')

  // Quatre firmes partagent le titre « The rules that decide it ». Un
  // remplacement par recherche de texte, sans ancrage sur la firme, avait
  // recopie les regles de FuturesElite dans celles de FTMO — et le SQL
  // genere l aurait ecrit en base.
  const EMPREINTES = {
    futureselite: ['16:55 EST', 'Nitro', 'Maximum Loss Limit', 'Rise'],
    ftmo: ['FTMO', '1-Step', '2-Step'],
    the5ers: ['The5ers', 'Summer'],
  }
  const texte = (firme) => JSON.stringify(firme?.arrays ?? {}) + JSON.stringify(firme?.scalars ?? {})

  const cible = { ftmo: FTMO, futureselite: FUTURESELITE, the5ers: THE5ERS }
  for (const [slug, firme] of Object.entries(cible)) {
    if (!firme) continue
    const t = texte(firme)
    for (const [autre, marqueurs] of Object.entries(EMPREINTES)) {
      if (autre === slug) continue
      const fuites = marqueurs.filter((m) => t.includes(m))
      cas(`${slug} ne porte aucune empreinte de ${autre}`, fuites.length === 0, fuites.join(', '))
    }
  }
}

console.log('')
console.log('16. Donnees officielles du 7 septembre 2026')
{
  const { FUTURESELITE_PARTNER_PROMOTION, FUTURESELITE_PROMOTIONS, FUTURESELITE_PLATFORMS, FUTURESELITE_PROGRAMS }
    = await import('./futureselite-programs.mjs')

  // Le chiffre qui change le sens de la page : a 20 % notre code etait
  // toujours moins bon que l offre publique, a 30 % il ne l est que sur trois
  // plans Prime.
  cas('SCANNED vaut 30 %', FUTURESELITE_PARTNER_PROMOTION.discount_value === 0.30,
    String(FUTURESELITE_PARTNER_PROMOTION.discount_value))
  cas('SCANNED reste non public', FUTURESELITE_PARTNER_PROMOTION.is_public === false)

  // Formulations interdites par le releve officiel : l eligibilite par
  // programme et l expiration ne sont pas confirmees.
  const texte = [FUTURESELITE_PARTNER_PROMOTION.label, FUTURESELITE_PARTNER_PROMOTION.editorial_note].join(' ')
  for (const interdit of ['best deal', 'best verified price']) {
    const affirme = new RegExp('(?<!never label it [^.]{0,80})' + interdit, 'i').test(
      FUTURESELITE_PARTNER_PROMOTION.label)
    cas('le libelle ne dit pas « ' + interdit + ' »', !affirme)
  }
  cas('la reserve accompagne le chiffre', /pending confirmation/i.test(FUTURESELITE_PARTNER_PROMOTION.label))

  // Un code de comparateur concurrent ne doit jamais atterrir dans nos donnees.
  cas('aucun code MATCH', !texte.includes('MATCH') &&
    !FUTURESELITE_PROMOTIONS.some((p) => p.code === 'MATCH'))

  // Les deux listes de plateformes divergent : celles qu on peut choisir sont
  // celles du configurateur, les autres sont marquees.
  const selectables = FUTURESELITE_PLATFORMS.filter((p) => p.configurator_status === 'selectable')
  cas('six plateformes selectionnables', selectables.length === 6, String(selectables.length))
  cas('les plateformes marketing sont marquees',
    FUTURESELITE_PLATFORMS.some((p) => p.configurator_status === 'marketing_only'))

  // Deux sources officielles divergent sur le plafond Nitro : aucun chiffre.
  const nitro = FUTURESELITE_PROGRAMS.find((p) => p.slug === 'nitro')
  cas('aucun plafond Nitro chiffre', nitro.max_funded_accounts === null,
    String(nitro.max_funded_accounts))

  // La comparaison SCANNED / offre publique doit se faire PLAN PAR PLAN.
  // Une note unique au niveau firme serait fausse quatorze fois sur quinze.
  const partenaire = FUTURESELITE_PARTNER_PROMOTION.discount_value
  const moinsBons = FUTURESELITE_PROMOTIONS
    .filter((p) => p.is_public && p.discount_value > partenaire)
    .map((p) => `${p.program_slug} ${p.account_size}`)
  cas('exactement trois plans ou l offre publique fait mieux', moinsBons.length === 3,
    moinsBons.join(', '))
  cas('et ce sont les trois Prime',
    moinsBons.every((x) => x.startsWith('prime')), moinsBons.join(', '))
  cas('SCANNED fait mieux sur l Elite 25K',
    FUTURESELITE_PROMOTIONS.find((p) => p.program_slug === 'elite' && p.account_size === 25000)
      .discount_value < partenaire)

  // Les 3 jours d evaluation et les 6 jours profitables avant retrait sont
  // deux regles distinctes, jamais un conflit : elles portent sur deux phases.
  const { FUTURESELITE_RULES } = await import('./futureselite-programs.mjs')
  cas('aucun conflit invente sur les jours minimum',
    !FUTURESELITE_RULES.some((r) => /minimum trading days/i.test(r.title) &&
      r.confidence === 'needs_confirmation'))

  // Le desaccord Nitro ne s appuie que sur deux sources officielles : le
  // bundle de cinq comptes ne dit rien du nombre de comptes finances.
  const nitroRegle = FUTURESELITE_RULES.find((r) => /nitro funded accounts/i.test(r.title))
  cas('le desaccord Nitro n invoque pas le bundle',
    nitroRegle && !/bundle/i.test(nitroRegle.detail), nitroRegle?.detail?.slice(0, 60))

  // Instant : pas de 25K achetable, et 80 % de partage et non 90.
  const instant = FUTURESELITE_PROGRAMS.find((p) => p.kind === 'instant')
  cas('Instant ne vend pas de 25K', !instant.plans.some((p) => p.account_size === 25000))
  cas('Instant partage 80 %',
    instant.plans.filter((p) => p.phase === 'sim_funded').every((p) => p.profit_split === 0.8))
}

console.log('')
console.log('15. Gabarit generique — ordre, unicite et accessibilite')
{
  const { readFileSync } = await import('node:fs')
  const page = readFileSync('app/[locale]/prop-firm/[slug]/PropFirmPageClient.tsx', 'utf8')
  const route = readFileSync('app/[locale]/prop-firm/[slug]/page.tsx', 'utf8')

  // Un seul H1. Le nom de la firme est deja affiche comme etiquette d identite
  // au-dessus ; un second titre le repeterait.
  const nbH1 = page.split('<h1').length - 1
  cas('un seul H1 dans la fiche', nbH1 === 1, String(nbH1))

  // Les plateformes disqualifient une firme en deux secondes : elles doivent
  // etre lisibles avant le configurateur, pas repliees en bas de page.
  const posPlateformes = page.indexOf('id=\"platforms\"')
  const posConfig = page.indexOf('id=\"challenges\"')
  cas('les plateformes precedent le configurateur',
    posPlateformes > 0 && posPlateformes < posConfig, `${posPlateformes} / ${posConfig}`)

  // « About » doit etre une section a part entiere, et venir AVANT les forces
  // et avant les specifications completes : c est elle qui permet de decider
  // si la suite merite d etre lue. Elle etait repliee dans le pli, donc
  // invisible pour qui ne deroulait pas.
  const posAbout = page.indexOf('id=\"about\"')
  const posReference = page.indexOf('id=\"reference\"')
  const posForces = page.indexOf('11. STRENGTHS & LIMITS')
  cas('la section A propos existe', posAbout > 0)
  cas('A propos precede les forces', posAbout > 0 && posAbout < posForces, `${posAbout} / ${posForces}`)
  cas('A propos precede les specifications completes',
    posAbout > 0 && posAbout < posReference, `${posAbout} / ${posReference}`)

  // Un lecteur d ecran doit entendre le changement de selection.
  cas('region live polie sur la selection',
    page.includes('aria-live=\"polite\"') && page.includes('annonceSelection'))

  // La FAQ tenait sur une seule colonne : un ruban vertical avant le CTA.
  cas('FAQ sur deux colonnes des md', page.includes('grid md:grid-cols-2 gap-x-6 gap-y-3 items-start'))

  // Le brief interdit explicitement cette phrase sur la fiche.
  cas('phrase interdite absente',
    !page.includes('does not replace the complete trading agreement'))

  // « Configurateur en deux etapes » decrivait un produit, pas un outil, et
  // etait faux pour toute firme vendant une evaluation en une etape ou un
  // compte instantane. Ce libelle est partage par les 350 fiches.
  const config = readFileSync('app/[locale]/prop-firm/[slug]/ChallengeSelector.tsx', 'utf8')
  cas('le configurateur ne se dit plus « two-step »',
    !/two-step configurator/i.test(config))

  // Un seul mecanisme de selection : la comparaison sous le configurateur ne
  // doit plus porter de bouton « Select X ».
  cas('la comparaison ne propose plus de second choix',
    !config.includes('handleSelectProgram(opt.name, true)'))

  // Le CTA final doit lire la meme selection que le configurateur.
  cas('le CTA final porte la selection', page.includes('ligneChoisie'))

  // L impression ne doit plus reserver une feuille par section.
  const css = readFileSync('app/globals.css', 'utf8')
  cas('les hauteurs ecran sont neutralisees a l impression',
    css.includes('min-height: 0 !important'))

  // Aucune firme proposee en alternative sans lien actif ET code verifie actif.
  for (const exigence of ['f.affiliate_url', 'f.discount_code', 'discount_expires_at']) {
    cas('alternatives filtrees sur ' + exigence, route.includes(exigence))
  }

  // Tout lien sortant passe par le redirecteur interne : CLAUDE.md l impose et
  // le brief le repete. Une URL partenaire en dur contournerait le tracking.
  const enDur = page.match(/href=\"https?:\/\/(?!www\.propfirmscanner)/g) || []
  cas('aucune URL partenaire en dur dans la fiche', enDur.length === 0, String(enDur.length))
}


console.log('\n' + '-'.repeat(50))
console.log(`${ok} reussis, ${ko} echoues`)
process.exit(ko === 0 ? 0 : 1)
