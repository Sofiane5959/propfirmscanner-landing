-- =============================================================================
-- EARN2TRADE — promotion de fin septembre : SCANNED passe a 60 %
-- =============================================================================
-- A EXECUTER LE 28 SEPTEMBRE 2026, PAS AVANT.
-- Et seulement apres qu'Eva (affiliation Earn2Trade) ait confirme que le code
-- SCANNED donne bien les 60 % : le mail du 25/09 annonce la remise sans nommer
-- le code. Sans cette confirmation, ne rien lancer.
--
-- Annonce Earn2Trade du 25/09/2026 :
--   - 60 % au lieu de 50 % sur tous les abonnements ;
--   - valable sur les 3 PREMIERS MOIS (l'offre actuelle, elle, valait sur
--     toutes les mensualites) ;
--   - pendant les 3 derniers jours de septembre, fin de journee heure du
--     Centre : la fin tombe donc le 01/10/2026 a 05:00 UTC (CDT = UTC-5) ;
--   - resets moins chers sur 3 mois : TCP25 55 $, TCP50 65 $, GAU50 60 $.
--     Ces prix vivent dans data/firms/earn2trade.xlsx, pas dans prop_firms :
--     ce fichier n'y touche pas.
--
-- Ce fichier ne change que la ligne earn2trade de prop_firms :
--   discount_percent      50 -> 60
--   discount_expires_at   null -> 2026-10-01 05:00 UTC
--   discount_note         -> la condition des 3 mois et la date de fin
--   translations->fr      -> la meme phrase en francais
--   cost_timeline         -> la phrase sur les mensualites a 50 %
-- Le code (SCANNED) ne change pas.
--
-- RETOUR ARRIERE OBLIGATOIRE : lancer RUN-earn2trade-retour-50.sql le
-- 1er octobre. Sans lui, la remise disparait au lieu de revenir a 50 %.
--
-- 1. D'ABORD, executer SEUL ce select et exporter le resultat.
--    L'editeur Supabase n'affiche que le resultat de la derniere requete.
-- =============================================================================

select slug, discount_code, discount_percent, discount_expires_at, discount_note,
       translations->'fr'->>'discount_note' as note_fr,
       cost_timeline->'steps'->0->>'detail' as premiere_etape_des_couts
from prop_firms where slug = 'earn2trade';


-- 2. Ensuite, executer le fichier entier.
begin;

do $ctrl$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'earn2trade';
  if r.slug is null then
    raise exception 'earn2trade introuvable, rien n''est modifie';
  end if;
  -- On part de l'offre permanente : SCANNED a 50 %, sans date de fin.
  if r.discount_code is distinct from 'SCANNED' or r.discount_percent is distinct from 50 then
    raise exception 'earn2trade : l''etat de depart attendu est SCANNED a 50 %%, rien n''est modifie';
  end if;
  if r.discount_expires_at is not null then
    raise exception 'earn2trade : une date de fin existe deja, verifier avant de relancer';
  end if;
end
$ctrl$;

update prop_firms set
  discount_percent = 60,
  discount_expires_at = timestamptz '2026-10-01 05:00:00+00',
  discount_note = 'Ends 30 September: 60% off the first three months, then 50%.',
  translations = case
    when translations ? 'fr'
      then jsonb_set(translations, '{fr,discount_note}',
                     to_jsonb('Jusqu''au 30 septembre : 60 % sur les 3 premiers mois, puis 50 %.'::text), false)
    else translations
  end,
  cost_timeline = case
    when cost_timeline::text like '%every monthly billing is 50%% off%'
      then replace(cost_timeline::text,
                   'With code SCANNED, every monthly billing is 50% off.',
                   'Until 30 September, code SCANNED takes 60% off the first three billings; after that, 50% off every billing.')::jsonb
    else cost_timeline
  end,
  updated_at = now()
where slug = 'earn2trade';

do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'earn2trade';
  if r.discount_code is distinct from 'SCANNED'
     or r.discount_percent is distinct from 60
     -- Compare en date : la colonne peut etre un date ou un timestamptz, et un
     -- date tronque l'heure a l'affectation.
     or r.discount_expires_at::date is distinct from date '2026-10-01'
     or r.discount_note not like 'Ends 30 September%' then
    raise exception 'Controle echoue : earn2trade ne porte pas la promotion attendue';
  end if;
end
$verif$;

commit;


-- 3. Etat apres (lecture seule).
select slug, discount_code, discount_percent, discount_expires_at, discount_note,
       translations->'fr'->>'discount_note' as note_fr,
       cost_timeline->'steps'->0->>'detail' as premiere_etape_des_couts
from prop_firms where slug = 'earn2trade';
