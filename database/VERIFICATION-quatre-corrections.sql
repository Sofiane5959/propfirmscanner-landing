-- =============================================================================
-- VERIFICATION DES QUATRE CORRECTIONS — FUTURESELITE
-- =============================================================================
-- LECTURE SEULE. A passer APRES les deux migrations.
--
-- L'editeur Supabase n'affiche que le resultat de la DERNIERE requete :
-- execute les quatre blocs UN PAR UN.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. LE PLAFOND NITRO
-- -----------------------------------------------------------------------------
select title,
       detail,
       confidence
from   firm_rules
where  firm_slug = 'futureselite'
  and  (title ilike '%funded accounts%' or title ilike '%Nitro%')
order  by sort_order;

-- ATTENDU : 2 lignes.
--
--   « Active funded accounts » — confidence 'verified'
--     detail se termine par : « Nitro funded-account limit: not confirmed. »
--     et ne contient NULLE PART « maximum 3 Nitro ».
--
--   « Nitro funded accounts » — confidence 'needs_confirmation'
--     detail cite les deux sources : « caps Nitro at 3 funded accounts »
--     et « MAX 4 FUNDED ».
--
-- ECHEC si la premiere ligne contient encore « maximum 3 Nitro ».


-- -----------------------------------------------------------------------------
-- 2. LE VERDICT
-- -----------------------------------------------------------------------------
select jsonb_array_elements_text(verdict_card -> 'points') as points_du_verdict
from   prop_firms
where  slug = 'futureselite';

-- ATTENDU : la liste contient
--   « Elite or Nitro evaluations without a daily loss limit, which leaves room to breathe »
--
-- ECHEC si l'on y lit encore « An evaluation with no daily loss limit ».
--
-- Controle en une ligne :
--   select verdict_card::text like '%An evaluation with no daily loss limit%' as encore_perime
--   from prop_firms where slug = 'futureselite';
--   -- attendu : false


-- -----------------------------------------------------------------------------
-- 3. LE DRAWDOWN
-- -----------------------------------------------------------------------------
-- 3a. L'affirmation groupant plusieurs programmes a disparu des atouts.
select unnest(pros) as atouts
from   prop_firms
where  slug = 'futureselite';

-- ATTENDU : la liste contient
--   « Drawdown type differs by program and phase — see the rules table »
-- et NE CONTIENT PLUS
--   « End-of-day drawdown on Elite, Nitro and Instant »

-- 3b. La valeur par programme, seule source legitime.
select pr.slug        as programme,
       pl.phase,
       pl.drawdown_type,
       count(*)       as nb_tailles
from   firm_program_plans pl
join   firm_programs pr on pr.id = pl.program_id
where  pr.firm_slug = 'futureselite'
group  by 1, 2, 3
order  by 1, 2;

-- ATTENDU : 8 lignes. En particulier
--   instant | sim_funded | End of Day       | 3
--   nitro   | evaluation | End of Day       | 4
--   nitro   | sim_funded | Trailing Equity  | 4
--
-- Nitro prouve la regle : un drawdown se lit par programme ET par phase,
-- jamais deduit d'un autre programme.


-- -----------------------------------------------------------------------------
-- 4. LE PRESTATAIRE DE PAIEMENT
-- -----------------------------------------------------------------------------
select payout_methods,
       array_length(payout_methods, 1) as nb,
       payout_frequency
from   prop_firms
where  slug = 'futureselite';

-- ATTENDU : 1 ligne
--   payout_methods   = {Rise}
--   nb               = 1
--   payout_frequency = 'on demand, daily once funded'
--
-- La bande d'information affichera alors « Payment provider : Rise ».
-- Tant que `payout_methods` est NULL, l'entree est filtree et n'apparait pas.


-- -----------------------------------------------------------------------------
-- 5. CONTROLE DE PORTEE — a passer en dernier
-- -----------------------------------------------------------------------------
select count(*) as autres_firmes_modifiees_aujourdhui
from   prop_firms
where  updated_at::date = current_date
  and  slug <> 'futureselite';

-- ATTENDU : 0
