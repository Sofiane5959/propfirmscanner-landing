-- =============================================================================
-- EARN2TRADE — donnees propres a cette firme
-- =============================================================================
-- Uniquement ce qui concerne Earn2Trade. Le schema et le nettoyage global ont
-- ete sortis dans shared-01-schema-provenance.sql et
-- shared-02-cleanup-all-firms.sql : ils portaient sur toute la table et le nom
-- de ce fichier laissait croire le contraire.
--
-- Depend de shared-01-schema-provenance.sql.
-- =============================================================================


-- Constat avant modification.
select slug, discount_code, discount_percent, discount_expires_at, min_price,
       scaling_max, max_allocation, logo_url
from prop_firms where slug = 'earn2trade';

select slug, account_size, price, payout_frequency_description
from prop_firm_challenges where firm_slug = 'earn2trade' order by price;


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
