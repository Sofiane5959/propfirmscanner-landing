// =============================================================================
// ADAPTATEUR  programmes normalises  ->  Challenge[]
// =============================================================================
//
// POURQUOI UN ADAPTATEUR PLUTOT QU'UN SECOND CONFIGURATEUR
//
// La fiche Earn2Trade et la fiche FuturesElite passent par la meme route et le
// meme composant : `ChallengeSelector`. Ce composant parle une seule langue, le
// `Challenge` plat, et il porte deja tout ce que le brief demande — la grille
// deux colonnes, la carte « Your selection » collante, les pastilles de
// programme, le code promo a cote du prix.
//
// Une version precedente lui avait oppose un second configurateur,
// `ProgramExplorer`, qui recopiait cette mise en page a quelques pixels pres
// (`_320px` au lieu de `_340px`, `top-24` au lieu de `top-20`). Deux systemes
// de design pour une seule page : toute correction ergonomique devait etre
// faite deux fois, et la seconde etait oubliee.
//
// On traduit donc les donnees, pas la presentation. Les firmes a programmes
// normalises entrent dans le composant existant par la porte existante.
//
// CE QUE L'ADAPTATEUR NE FAIT PAS
//
// Il n'aplatit pas la distinction evaluation / compte finance : elle est le
// sujet d'une section a part, qui lit `programData` directement. Ici on ne
// remonte que ce qu'une carte de configurateur doit montrer pour choisir.
// =============================================================================

import type { Challenge, ProgramGuide } from '@/app/[locale]/prop-firm/[slug]/ChallengeSelector'
import type { FirmProgramData, Program, ProgramPlan } from '@/lib/firm-programs'

/** Identifiant stable d'une ligne : le composant le renvoie, la page le resout. */
export function planKey(programSlug: string, variantKey: string | null, size: number): string {
  return `${programSlug}|${variantKey ?? ''}|${size}`
}

/** Decoupe une cle rendue par le configurateur. */
export function parsePlanKey(key: string): { programSlug: string; variantKey: string | null; size: number } | null {
  const parts = key.split('|')
  if (parts.length !== 3) return null
  const size = Number(parts[2])
  if (!Number.isFinite(size)) return null
  return { programSlug: parts[0], variantKey: parts[1] || null, size }
}

/** « $25K », « $1M ». Le configurateur regroupe sur le premier chiffre du nom. */
function sizeLabel(n: number): string {
  if (n >= 1_000_000) return `$${n / 1_000_000}M`
  if (n >= 1_000) return `$${n / 1_000}K`
  return `$${n}`
}

/**
 * Un meme champ porte un pourcentage chez les firmes CFD et un montant chez
 * les firmes futures : FTMO ecrit 0.05 pour 5 %, FuturesElite ecrit 1000 pour
 * 1 000 $. Afficher 1000 comme « 1000 % » n'est pas une faute de mise en forme,
 * c'est une autre affirmation.
 *
 * La separation est nette dans les donnees reelles et le restera : une limite
 * exprimee en fraction est toujours < 1, un montant est toujours >= 1. Aucune
 * firme ne vend un compte dont la perte maximale vaut 0,50 $.
 */
function riskUnitOf(values: (number | null | undefined)[]): 'percent' | 'usd' {
  const known = values.filter((v): v is number => v !== null && v !== undefined)
  if (known.length === 0) return 'usd'
  return known.every((v) => v < 1) ? 'percent' : 'usd'
}

/** Une fraction devient un pourcentage ; un montant reste tel quel. */
function riskValue(v: number | null | undefined, unit: 'percent' | 'usd'): number | null {
  if (v === null || v === undefined) return null
  return unit === 'percent' ? Math.round(v * 1000) / 10 : v
}

function phaseOf(plans: ProgramPlan[], phase: string, variantKey: string | null, size: number) {
  return plans.find(
    (p) => p.phase === phase && (p.variant_key ?? null) === variantKey && p.account_size === size
  )
}

/** Les couples (variante, taille) reellement vendus par ce programme. */
function combinationsOf(program: Program): { variantKey: string | null; size: number }[] {
  const seen = new Set<string>()
  const out: { variantKey: string | null; size: number }[] = []
  for (const p of program.plans) {
    const variantKey = p.variant_key ?? null
    const key = `${variantKey ?? ''}|${p.account_size}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ variantKey, size: p.account_size })
  }
  return out.sort((a, b) => a.size - b.size)
}

/** « 8-5 » -> « 8/5 ». La cle de variante est technique, pas editoriale. */
function variantLabel(variantKey: string | null): string {
  if (!variantKey) return ''
  return variantKey.replace(/-/g, '/').replace(/\b\w/g, (c) => c.toUpperCase())
}

export interface AdaptedPrograms {
  challenges: Challenge[]
  guide: ProgramGuide
  /** Devise dominante des plans, quand elle ne vient pas de la colonne firme. */
  currency: string | null
}

/**
 * Traduit les programmes normalises d'une firme en lignes que
 * `ChallengeSelector` sait afficher.
 *
 * Renvoie `null` quand la firme n'a pas de programmes normalises : les ~349
 * autres fiches continuent alors de lire `prop_firm_challenges`, sans
 * changement d'aucune sorte.
 */
export function programsToChallenges(
  data: FirmProgramData | null,
  firmSlug: string,
  firmName: string
): AdaptedPrograms | null {
  if (!data || data.programs.length === 0) return null

  // Un programme sans plan n'a ni prix ni regle : l'afficher donnerait une
  // carte cliquable qui ne mene nulle part. On le laisse aux sections
  // narratives, qui savent dire « en cours de verification ».
  const vendables = data.programs.filter((p) => p.plans.length > 0)
  if (vendables.length === 0) return null

  const challenges: Challenge[] = []
  const devises = new Set<string>()

  for (const program of vendables) {
    for (const { variantKey, size } of combinationsOf(program)) {
      const evaluation = phaseOf(program.plans, 'evaluation', variantKey, size)
      const evaluation2 = phaseOf(program.plans, 'evaluation_2', variantKey, size)
      const funded = phaseOf(program.plans, 'sim_funded', variantKey, size)
      // Ce que le visiteur affronte en premier : l'evaluation s'il y en a une,
      // sinon directement le compte finance.
      const premiere = evaluation ?? funded
      if (!premiere) continue

      if (premiere.currency) devises.add(premiere.currency)

      const unit = riskUnitOf([
        premiere.maximum_loss_limit,
        premiere.daily_loss_limit,
        evaluation?.profit_target,
      ])

      const etiquetteVariante = variantLabel(variantKey)
      const nomProgramme = etiquetteVariante ? `${program.name} ${etiquetteVariante}` : program.name

      challenges.push({
        // La cle sert de pont : le composant la renvoie, la page retrouve le
        // programme, la variante et la taille exacts.
        id: planKey(program.slug, variantKey, size),
        slug: program.slug,
        // Le nom doit contenir la taille : `extractProgram` regroupe les
        // lignes en coupant au premier chiffre.
        name: `${nomProgramme} ${sizeLabel(size)}`,
        firm_name: firmName,
        firm_slug: firmSlug,
        account_size: sizeLabel(size),
        steps:
          program.kind === 'instant'
            ? 'Instant'
            : program.evaluation_steps === 1
              ? '1 step'
              : program.evaluation_steps
                ? `${program.evaluation_steps} steps`
                : null,
        max_drawdown: riskValue(premiere.maximum_loss_limit, unit),
        max_daily_loss: riskValue(premiere.daily_loss_limit, unit),
        phase1_profit_target: riskValue(evaluation?.profit_target, unit),
        phase2_profit_target: riskValue(evaluation2?.profit_target, unit),
        phase3_profit_target: null,
        drawdown_type: premiere.drawdown_type,
        max_loss_type: premiere.drawdown_type,
        profit_split: funded?.profit_split != null ? Math.round(funded.profit_split * 100) : null,
        price: premiere.regular_price ?? funded?.regular_price ?? null,
        // La remise vient du niveau firme, le composant l'applique lui-meme.
        discounted_price: null,
        payout_frequency_description:
          funded?.days_between_payouts === 1
            ? 'Daily once funded'
            : funded?.days_between_payouts != null
              ? `Every ${funded.days_between_payouts} days once funded`
              : null,
        // La regle de regularite peut differer entre evaluation et compte
        // finance. La carte montre celle de la phase que l'on achete ; la
        // section de comparaison montre les deux.
        consistency_rule:
          premiere.consistency_rule != null
            ? `${Math.round(premiere.consistency_rule * 100)}%`
            : null,
        profit_target_sum: null,
        allows_ea: null,
        allows_scalping: null,
        allows_news_trading: null,
        billing_period: 'one-time',
        risk_unit: unit,
        affiliate_url: null,
        max_contracts: premiere.max_contracts,
      })
    }
  }

  if (challenges.length === 0) return null

  // Chaque carte doit dire ce que le programme change pour l'acheteur, pas
  // seulement son nom et un nombre de tailles. `summary` porte cette phrase ;
  // sans elle on l'annonce absente plutot que d'en inventer une.
  const guide: ProgramGuide = {
    options: vendables.map((p) => {
      const etiquette = combinationsOf(p)[0]?.variantKey
      const nom = etiquette ? `${p.name} ${variantLabel(etiquette)}` : p.name
      return {
        name: nom,
        badge:
          p.kind === 'instant'
            ? 'No evaluation'
            : p.evaluation_steps === 1
              ? '1 step'
              : p.evaluation_steps
                ? `${p.evaluation_steps} steps`
                : undefined,
        summary: p.summary || undefined,
      }
    }),
  }

  return {
    challenges,
    guide,
    currency: devises.size === 1 ? Array.from(devises)[0] : null,
  }
}
