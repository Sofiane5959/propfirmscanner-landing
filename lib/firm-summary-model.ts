// =============================================================================
// MODELE RESUME  lib/firm-summary-model.ts
// =============================================================================
//
// Ce que /compare, /best-for, /deals, la recherche et l'accueil affichent :
// une carte, pas une fiche.
//
// POURQUOI IL N'EST PAS UN EXTRAIT DE `FirmPageModel`
//
// `buildFirmPageModel` interroge huit tables. `/compare` affiche jusqu'a
// quarante firmes : en deriver le resume ferait 320 requetes pour remplir des
// cartes de six lignes.
//
// Le resume AGREGE donc en SQL, en deux requetes pour l'ensemble des firmes
// demandees, la ou la fiche detaille une seule firme.
//
// CE QUI DOIT RESTER VRAI
//
// Les deux modeles resolvent depuis les MEMES sources canoniques et partagent
// les memes fonctions pures. Une carte et une fiche ne peuvent donc pas
// afficher deux prix differents — c'est exactement le defaut constate sur la
// fiche, ou le hero lisait `min_price` pendant que le configurateur lisait
// `regular_price`.
// =============================================================================

import type { Provenance } from '@/lib/firm-page-model'

export interface FirmSummaryModel {
  slug: string
  name: string
  logoUrl: string | null
  /** 'futures' | 'cfd' | 'stocks' — depuis firm_programs, jamais is_futures. */
  market: string | null
  priceRange: { min: number; max: number; currency: string } | null
  profitSplit: { min: number; max: number } | null
  offer: { code: string; percent: number } | null
  platformCount: number
  programCount: number
  rating: { value: number; count: number } | null
  /** Toujours /api/go/[slug] : jamais une URL partenaire brute. */
  ctaHref: string
  /** `true` quand la firme est servie par les tables normalisees. */
  canonical: boolean
  provenance: Record<string, Provenance>
}

/** Les lignes que la requete agregee doit ramener, une par firme. */
export interface SummaryRow {
  slug: string
  name: string
  logo_url: string | null
  trustpilot_rating: number | null
  trustpilot_reviews: number | null
  // Colonnes heritees, servant de repli tant que la firme n'est pas migree.
  legacy_min_price: number | null
  legacy_max_price: number | null
  legacy_profit_split: number | null
  legacy_max_profit_split: number | null
  legacy_platforms: string | null
  legacy_is_futures: boolean | null
  legacy_discount_code: string | null
  legacy_discount_percent: number | null
  // Agregats canoniques, calcules par la requete SQL sur les tables normalisees.
  canon_market: string | null
  canon_price_min: number | null
  canon_price_max: number | null
  canon_currency: string | null
  canon_split_min: number | null
  canon_split_max: number | null
  canon_platform_count: number | null
  canon_program_count: number | null
  canon_promo_code: string | null
  canon_promo_percent: number | null
}

/**
 * La requete d'agregation.
 *
 * Exportee comme constante plutot qu'executee ici : `lib/` ne doit pas
 * decider du client Supabase, et la garder visible permet de la relire sans
 * la reconstituer depuis du code.
 *
 * Une seule passe : les agregats par firme sont calcules en SQL, pas en
 * JavaScript apres coup.
 */
export const SUMMARY_QUERY = `
select
  f.slug, f.name, f.logo_url, f.trustpilot_rating, f.trustpilot_reviews,
  f.min_price        as legacy_min_price,
  f.max_price        as legacy_max_price,
  f.profit_split     as legacy_profit_split,
  f.max_profit_split as legacy_max_profit_split,
  f.platforms        as legacy_platforms,
  f.is_futures       as legacy_is_futures,
  f.discount_code    as legacy_discount_code,
  f.discount_percent as legacy_discount_percent,
  c.market           as canon_market,
  c.price_min        as canon_price_min,
  c.price_max        as canon_price_max,
  c.currency         as canon_currency,
  c.split_min        as canon_split_min,
  c.split_max        as canon_split_max,
  c.program_count    as canon_program_count,
  p.platform_count   as canon_platform_count,
  pr.code            as canon_promo_code,
  pr.percent         as canon_promo_percent
from prop_firms f
left join lateral (
  select min(pl.regular_price) as price_min,
         max(pl.regular_price) as price_max,
         min(pl.currency)      as currency,
         min(pl.profit_split)  as split_min,
         max(pl.profit_split)  as split_max,
         min(g.market)         as market,
         count(distinct g.id)  as program_count
  from firm_programs g
  join firm_program_plans pl on pl.program_id = g.id
  where g.firm_slug = f.slug and g.status in ('active', 'promotional')
) c on true
left join lateral (
  select count(*) as platform_count
  from firm_platforms fp
  where fp.firm_slug = f.slug and fp.configurator_status = 'selectable'
) p on true
left join lateral (
  select code, round(discount_value * 100) as percent
  from firm_promotions
  where firm_slug = f.slug and status = 'active' and is_public = false
  order by discount_value desc
  limit 1
) pr on true
where f.slug = any($1)
`

/**
 * Construit un resume a partir d'une ligne agregee.
 *
 * La precedence est la meme que celle de `FirmPageModel` : canonique d'abord,
 * herite ensuite, `null` en dernier. Une valeur heritee ne remplace jamais une
 * valeur canonique presente.
 */
export function buildFirmSummaryModel(row: SummaryRow, ctaHref: string): FirmSummaryModel {
  const canonical = (row.canon_program_count ?? 0) > 0
  const prov: Record<string, Provenance> = {}
  const note = (champ: string, table: string, column: string) => {
    prov[champ] = { table, column, verifiedAt: null }
  }

  note('market', canonical ? 'firm_programs' : 'prop_firms', canonical ? 'market' : 'is_futures')
  const market = canonical
    ? row.canon_market
    : row.legacy_is_futures === true
      ? 'futures'
      : row.legacy_is_futures === false
        ? 'cfd'
        : null

  note('priceRange', canonical ? 'firm_program_plans' : 'prop_firms', canonical ? 'regular_price' : 'min_price,max_price')
  const priceRange =
    canonical && row.canon_price_min != null && row.canon_price_max != null
      ? { min: row.canon_price_min, max: row.canon_price_max, currency: row.canon_currency ?? 'USD' }
      : row.legacy_min_price != null && row.legacy_max_price != null
        ? { min: row.legacy_min_price, max: row.legacy_max_price, currency: 'USD' }
        : null

  note('profitSplit', canonical ? 'firm_program_plans' : 'prop_firms', canonical ? 'profit_split' : 'profit_split,max_profit_split')
  const profitSplit =
    canonical && row.canon_split_min != null && row.canon_split_max != null
      ? { min: Math.round(row.canon_split_min * 100), max: Math.round(row.canon_split_max * 100) }
      : // CLAUDE.md : 119 firmes portent `max_profit_split` sans `profit_split`.
        // Lire la premiere seule ne listait que 24 firmes sur 132.
        (() => {
          const max = row.legacy_max_profit_split ?? row.legacy_profit_split
          const min = row.legacy_profit_split ?? row.legacy_max_profit_split
          return max != null && min != null ? { min, max } : null
        })()

  note('offer', canonical ? 'firm_promotions' : 'prop_firms', canonical ? 'code,discount_value' : 'discount_code,discount_percent')
  const offer =
    canonical && row.canon_promo_code && row.canon_promo_percent != null
      ? { code: row.canon_promo_code, percent: row.canon_promo_percent }
      : row.legacy_discount_code && row.legacy_discount_percent != null
        ? { code: row.legacy_discount_code, percent: row.legacy_discount_percent }
        : null

  note('platformCount', canonical ? 'firm_platforms' : 'prop_firms', canonical ? 'configurator_status' : 'platforms')
  const platformCount =
    canonical && row.canon_platform_count != null
      ? row.canon_platform_count
      : (row.legacy_platforms ?? '').split(/[,;]/).map((s) => s.trim()).filter(Boolean).length

  return {
    slug: row.slug,
    name: row.name,
    logoUrl: row.logo_url,
    market,
    priceRange,
    profitSplit,
    offer,
    platformCount,
    programCount: row.canon_program_count ?? 0,
    rating:
      row.trustpilot_rating && row.trustpilot_rating > 0
        ? { value: row.trustpilot_rating, count: row.trustpilot_reviews ?? 0 }
        : null,
    ctaHref,
    canonical,
    provenance: prov,
  }
}
