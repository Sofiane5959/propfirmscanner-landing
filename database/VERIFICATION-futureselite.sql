-- =============================================================================
-- VERIFICATION APRES MIGRATION — FUTURESELITE
-- =============================================================================
-- LECTURE SEULE. Aucun insert, update ou delete.
--
-- L'editeur Supabase n'affiche que le resultat de la DERNIERE requete :
-- execute les blocs UN PAR UN, ou garde-les separes.
--
-- Les resultats attendus sont ecrits sous chaque bloc. Un ecart, meme sur une
-- seule ligne, justifie ROLLBACK-futureselite.sql.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. La remise partenaire
-- -----------------------------------------------------------------------------
select code, discount_value, is_public, status
from   firm_promotions
where  firm_slug = 'futureselite' and is_public = false;

-- ATTENDU : 1 ligne
--   code = 'SCANNED', discount_value = 0.30, is_public = false, status = 'active'
-- Si discount_value vaut 0.20, le fichier 1 n'est pas passe.


-- -----------------------------------------------------------------------------
-- 2. Les plateformes
-- -----------------------------------------------------------------------------
select configurator_status, count(*) as n
from   firm_platforms
where  firm_slug = 'futureselite'
group  by 1 order by 1;

-- ATTENDU : 2 lignes
--   marketing_only  2      (Volumetrica, DeepCharts)
--   selectable      6      (Tradovate, NinjaTrader, Quantower, ATAS,
--                           WealthCharts, DeepChart)


-- -----------------------------------------------------------------------------
-- 3. Instant : 80 %, fin de journee, 20 % de regularite, 10 jours
-- -----------------------------------------------------------------------------
select pl.account_size, pl.profit_split, pl.drawdown_type,
       pl.consistency_rule, pl.minimum_trading_days
from   firm_program_plans pl
join   firm_programs pr on pr.id = pl.program_id
where  pr.firm_slug = 'futureselite' and pr.slug = 'instant'
  and  pl.phase = 'sim_funded'
order  by pl.account_size;

-- ATTENDU : 3 lignes, aucune taille 25000
--    50000 | 0.8 | End of Day | 0.2 | 10
--   100000 | 0.8 | End of Day | 0.2 | 10
--   150000 | 0.8 | End of Day | 0.2 | 10
-- Un 0.9 ou un « Trailing Equity » ici = migration incorrecte.


-- -----------------------------------------------------------------------------
-- 4. Prime : limite journaliere dans les DEUX phases, 40 % une fois finance
-- -----------------------------------------------------------------------------
select pl.phase, pl.account_size, pl.daily_loss_limit, pl.consistency_rule
from   firm_program_plans pl
join   firm_programs pr on pr.id = pl.program_id
where  pr.firm_slug = 'futureselite' and pr.slug = 'prime'
order  by pl.phase, pl.account_size;

-- ATTENDU : 8 lignes, daily_loss_limit JAMAIS nul
--   evaluation   25000 |  600 | null
--   evaluation   50000 | 1200 | null
--   evaluation  100000 | 1800 | null
--   evaluation  150000 | 2700 | null
--   sim_funded   25000 |  600 | 0.4
--   sim_funded   50000 | 1200 | 0.4
--   sim_funded  100000 | 1800 | 0.4
--   sim_funded  150000 | 2700 | 0.4


-- -----------------------------------------------------------------------------
-- 5. Nitro : trailing equity une fois finance, aucun plafond chiffre
-- -----------------------------------------------------------------------------
select distinct pl.drawdown_type, pr.max_funded_accounts
from   firm_program_plans pl
join   firm_programs pr on pr.id = pl.program_id
where  pr.firm_slug = 'futureselite' and pr.slug = 'nitro'
  and  pl.phase = 'sim_funded';

-- ATTENDU : 1 ligne
--   'Trailing Equity' | null
-- Un chiffre dans max_funded_accounts = l'ancienne version est encore en base.


-- -----------------------------------------------------------------------------
-- 6. Les colonnes de firme
-- -----------------------------------------------------------------------------
select profit_split, max_profit_split, leverage_forex,
       (cost_timeline is null) as couts_retires,
       (value_strip is not null) as bande_presente,
       data_verified_at::date  as verifie_le,
       platforms
from   prop_firms
where  slug = 'futureselite';

-- ATTENDU : 1 ligne
--   profit_split      = 80
--   max_profit_split  = 90
--   leverage_forex    = null
--   couts_retires     = true
--   bande_presente    = true
--   verifie_le        = 2026-09-07
--   platforms         = 'Tradovate, NinjaTrader, Quantower, ATAS, WealthCharts, DeepChart'


-- -----------------------------------------------------------------------------
-- 7. Recapitulatif des volumes
-- -----------------------------------------------------------------------------
select
  (select count(*) from firm_programs        where firm_slug = 'futureselite') as programmes,
  (select count(*) from firm_program_plans pl
     join firm_programs pr on pr.id = pl.program_id
     where pr.firm_slug = 'futureselite')                                      as plans,
  (select count(*) from firm_promotions      where firm_slug = 'futureselite') as promotions,
  (select count(*) from firm_program_bundles where firm_slug = 'futureselite') as bundles,
  (select count(*) from firm_platforms       where firm_slug = 'futureselite') as plateformes,
  (select count(*) from firm_rules           where firm_slug = 'futureselite') as regles,
  (select count(*) from firm_live_tiers      where firm_slug = 'futureselite') as paliers_live,
  (select count(*) from prop_firm_challenges where firm_slug = 'futureselite') as challenges;

-- ATTENDU : 4 | 27 | 16 | 25 | 8 | 33 | 5 | 4


-- -----------------------------------------------------------------------------
-- 8. Aucune autre firme n'a bouge
-- -----------------------------------------------------------------------------
select count(*) as firmes_touchees_aujourdhui
from   prop_firms
where  updated_at::date = current_date and slug <> 'futureselite';

-- ATTENDU : 0
-- Toute autre valeur signifie qu'une migration a deborde de son perimetre.
