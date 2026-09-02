-- =============================================================================
-- EARN2TRADE — corrections de donnees
-- =============================================================================
-- Lecture seule d'abord, ecritures ensuite. Rien ici n'est destructif :
-- l'historique des promotions est conserve, jamais supprime.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 0. Constat
-- -----------------------------------------------------------------------------
select slug, discount_code, discount_percent, discount_expires_at, min_price,
       scaling_max, max_allocation, logo_url
from prop_firms where slug = 'earn2trade';

select slug, account_size, price, payout_frequency_description
from prop_firm_challenges where firm_slug = 'earn2trade' order by price;


-- -----------------------------------------------------------------------------
-- 1. Colonnes de cycle de vie des promotions et de provenance
-- -----------------------------------------------------------------------------
-- Le code lit deja discount_expires_at. Les trois autres rendent l'etat d'une
-- offre explicite au lieu d'etre deduit, et donnent une date de verification
-- affichable. Idempotent.
alter table prop_firms add column if not exists discount_starts_at  timestamptz;
alter table prop_firms add column if not exists discount_status     text;
alter table prop_firms add column if not exists data_verified_at    timestamptz;
alter table prop_firms add column if not exists data_verified_by    text;
alter table prop_firms add column if not exists source_url          text;
alter table prop_firms add column if not exists rating_checked_at   timestamptz;

comment on column prop_firms.rating_checked_at is
  'Date de releve de trustpilot_rating / trustpilot_reviews. La note appartient a Trustpilot, elle n est pas collectee par PropFirmScanner.';


-- -----------------------------------------------------------------------------
-- 2. Marquer la promotion terminee, sans l effacer
-- -----------------------------------------------------------------------------
-- La page ne l affiche deja plus : resolvePromotion() compare expires_at a la
-- date du jour. Ce marquage rend l etat lisible en base.
update prop_firms
set discount_status = 'expired'
where discount_expires_at is not null
  and discount_expires_at < now()
  and coalesce(discount_status, '') <> 'expired';


-- -----------------------------------------------------------------------------
-- 3. Le signe dollar double
-- -----------------------------------------------------------------------------
-- Present dans le payload servi : scaling_max '$$400K', account_size '$$25K',
-- cost_timeline -> '$$140-156/month'. Le code n ajoute aucun signe : la donnee
-- est doublee a l import. L affichage est deja protege par cleanMoneyLabel(),
-- ceci corrige la source.
update prop_firms
set scaling_max    = regexp_replace(scaling_max,    '\$\$+', '$', 'g'),
    max_allocation = regexp_replace(max_allocation, '\$\$+', '$', 'g')
where scaling_max like '%$$%' or max_allocation like '%$$%';

update prop_firm_challenges
set account_size = regexp_replace(account_size, '\$\$+', '$', 'g')
where account_size like '%$$%';

-- Les colonnes JSONB : on reserialise en corrigeant le texte.
update prop_firms
set cost_timeline = replace(cost_timeline::text, '$$', '$')::jsonb
where cost_timeline::text like '%$$%';

-- Controle : doit renvoyer zero ligne.
select 'prop_firms' as t, slug from prop_firms
where scaling_max like '%$$%' or max_allocation like '%$$%' or cost_timeline::text like '%$$%'
union all
select 'challenges', slug from prop_firm_challenges where account_size like '%$$%';


-- -----------------------------------------------------------------------------
-- 4. Seuils de retrait par programme  — A REMPLIR APRES ARBITRAGE
-- -----------------------------------------------------------------------------
-- Le handbook Earn2Trade donne, par palier : sous le seuil 50 %, au-dela 80 %,
-- avec un plafond de retrait. TCP400 est en 60/40 fixe.
--   TCP 25  : 1 500 $ / max 1 750 $      GM 50  : 2 250 $ / max 5 000 $
--   TCP 50  : 2 250 $ / max 3 000 $      GM 100 : 3 000 $ / max 5 000 $
--   TCP 100 : 3 000 $ / max 6 000 $      GM 150 : 4 000 $ / max 5 000 $
--                                        GM 200 : 5 000 $ / max 5 000 $
--
-- NON APPLIQUE : le memo TCP50 du 4 aout 2026 indique 2 000 $ la ou le
-- handbook indique 2 250 $ pour le meme compte, et la base porte un
-- profit_split plat de 80 sur les sept lignes. Trois sources, trois valeurs.
-- A trancher avant ecriture — voir le rapport.
--
-- alter table prop_firm_challenges add column if not exists payout_split_threshold numeric;
-- alter table prop_firm_challenges add column if not exists payout_max_withdrawal  numeric;
-- alter table prop_firm_challenges add column if not exists payout_split_low       numeric;
-- alter table prop_firm_challenges add column if not exists payout_split_high      numeric;


-- =============================================================================
-- 5. Affirmations sans source, et logo
-- =============================================================================
-- Emplacements releves dans le payload servi le 1er septembre 2026.

-- 5a. Constat avant modification. Garder cette sortie.
select slug,
       description like '%highest of any%'                as claim_dans_description,
       proof_stats::text like '%traders funded in 2025%'  as claim_dans_proof_stats,
       pros::text       like '%traders funded in 2025%'   as claim_dans_pros,
       logo_url
from prop_firms where slug = 'earn2trade';

-- 5b. "the highest of any major futures prop firm"
-- Invérifiable : aucun jeu de comparaison defini, courant et reproductible ne
-- l'etaye. On retire l'affirmation, on garde la note elle-meme.
update prop_firms
set description = regexp_replace(description,
      ',?\s*the highest of any major futures prop firm', '', 'gi')
where slug = 'earn2trade' and description like '%highest of any%';

-- 5c. "6,400 traders funded in 2025"
-- Absent du handbook Earn2Trade comme du memo TCP50. Sans source, on retire —
-- y compris la version francaise dans translations.
update prop_firms
set proof_stats = (
      select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(proof_stats) e
      where e->>'label' not ilike '%traders funded in 2025%'
        and e->>'label' not ilike '%traders financ%s en 2025%'
    )
where slug = 'earn2trade' and proof_stats::text ilike '%2025%';

update prop_firms
set pros = (
      select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(pros) e
      where e::text not ilike '%traders funded in 2025%'
    )
where slug = 'earn2trade' and pros::text ilike '%traders funded in 2025%';

-- 5d. Logo officiel local
-- logo_url pointait sur https://www.google.com/s2/favicons?domain=earn2trade.com&sz=128
-- Le fichier fourni par le partenaire est desormais dans public/logos/earn2trade.png
update prop_firms set logo_url = '/logos/earn2trade.png' where slug = 'earn2trade';

-- 5e. Provenance affichable. La page n'affiche ces lignes que si la date existe.
update prop_firms set
  data_verified_at  = now(),
  data_verified_by  = 'PropFirmScanner',
  source_url        = 'https://help.earn2trade.com/',
  rating_checked_at = now()
where slug = 'earn2trade';

-- 5f. Controle : doit renvoyer false, false, false et le chemin local.
select slug,
       description like '%highest of any%'               as claim_description,
       proof_stats::text ilike '%traders funded in 2025%' as claim_proof,
       pros::text ilike '%traders funded in 2025%'        as claim_pros,
       logo_url, data_verified_at
from prop_firms where slug = 'earn2trade';
