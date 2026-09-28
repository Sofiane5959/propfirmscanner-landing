-- =============================================================================
-- EARN2TRADE — mise en avant pendant la campagne de fin septembre
-- =============================================================================
-- A EXECUTER LE 28 SEPTEMBRE 2026, apres le SQL genere qui porte la remise a
-- 60 % (database/generated/sync-prop-firms-earn2trade.sql).
--
-- Ce que ce fichier fait, et rien d'autre : il passe earn2trade en
-- priority_tier = 1. Sur /compare, les firmes se classent en trois groupes —
-- code promo en cours, lien d'affiliation, puis le reste — et a l'interieur de
-- chaque groupe, c'est priority_tier qui decide. Earn2Trade se retrouve donc en
-- tete des firmes a code promo, devant celles qui partagent le meme groupe.
--
-- RETOUR ARRIERE : RUN-earn2trade-retour-tier.sql, le 1er octobre. Le select
-- ci-dessous donne la valeur actuelle : notez-la, c'est elle qu'il faudra
-- remettre si elle n'etait pas nulle.
--
-- 1. D'ABORD, executer SEUL ce select et exporter le resultat.
-- =============================================================================

select slug, priority_tier, discount_code, discount_percent, discount_expires_at
from prop_firms
where slug in ('earn2trade', 'futureselite', 'the5ers', 'blueberry-funded', 'ftmo')
order by priority_tier nulls last, slug;


-- 2. Ensuite, executer le fichier entier.
begin;

do $ctrl$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'earn2trade';
  if r.slug is null then
    raise exception 'earn2trade introuvable, rien n''est modifie';
  end if;
  -- La mise en avant n'a de sens que si la remise de campagne est deja en base.
  if r.discount_code is distinct from 'SCANNED' or r.discount_percent is distinct from 60 then
    raise exception 'earn2trade : executer d''abord le SQL generE qui porte SCANNED a 60 %%';
  end if;
end
$ctrl$;

update prop_firms set
  priority_tier = 1,
  updated_at = now()
where slug = 'earn2trade';

do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'earn2trade';
  if r.priority_tier is distinct from 1 then
    raise exception 'Controle echoue : priority_tier n''est pas a 1';
  end if;
end
$verif$;

commit;


-- 3. Etat apres (lecture seule).
select slug, priority_tier, discount_code, discount_percent, discount_expires_at
from prop_firms
where slug in ('earn2trade', 'futureselite', 'the5ers', 'blueberry-funded', 'ftmo')
order by priority_tier nulls last, slug;
