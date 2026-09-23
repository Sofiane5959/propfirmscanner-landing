-- =============================================================================
-- EARN2TRADE — la note francaise de l'offre SCANNED (23 septembre 2026)
-- =============================================================================
-- Pourquoi : RUN-earn2trade-offre-scanned.sql a corrige la note anglaise
-- (« Applies to every monthly billing. »), mais la traduction francaise parle
-- encore des quatre premieres mensualites. Sur /fr, c'est elle qui s'affiche,
-- donc le visiteur francais lit toujours l'ancienne condition.
--
-- Releve du 23/09/2026, envoye par Sofiane :
--   fr → discount_note = « Sur les 4 premieres facturations mensuelles, puis »
--   fr → cost_timeline, premiere etape : deja correcte, elle ne parle pas des
--        quatre mensualites. Ce fichier n'y touche pas.
--
-- Ne touche qu'une cle : translations->'fr'->'discount_note' de la ligne
-- earn2trade. Le reste du JSON est conserve. Tout ou rien : si le controle
-- final echoue, rien n'est modifie.
--
-- 1. D'ABORD, executer SEUL ce select et exporter le resultat (retour arriere).
--    L'editeur Supabase n'affiche que le resultat de la derniere requete.
-- =============================================================================

select slug,
       discount_note,
       translations->'fr'->>'discount_note' as note_fr,
       translations
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
  -- Le premier fichier doit avoir ete execute : sans lui, l'anglais parlerait
  -- encore des quatre mensualites et corriger le francais seul creerait une
  -- contradiction entre les deux langues.
  if r.discount_note is distinct from 'Applies to every monthly billing.'
     or r.discount_expires_at is not null then
    raise exception 'earn2trade : executer d''abord RUN-earn2trade-offre-scanned.sql';
  end if;
  if r.translations->'fr'->>'discount_note' is null then
    raise exception 'earn2trade : aucune note francaise a corriger, rien n''est modifie';
  end if;
end
$ctrl$;

update prop_firms set
  translations = jsonb_set(
    translations,
    '{fr,discount_note}',
    to_jsonb('Valable sur chaque mensualité.'::text),
    false),
  updated_at = now()
where slug = 'earn2trade';

do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'earn2trade';
  if r.translations->'fr'->>'discount_note' is distinct from 'Valable sur chaque mensualité.' then
    raise exception 'Controle echoue : la note francaise n''a pas ete remplacee';
  end if;
  -- Les autres langues ne doivent pas avoir bouge.
  if r.translations->'fr'->'cost_timeline' is null
     and (select count(*) from jsonb_each(coalesce(r.translations, '{}'::jsonb))) = 0 then
    raise exception 'Controle echoue : les traductions ont ete videes';
  end if;
end
$verif$;

commit;


-- 3. Etat apres (lecture seule) : toutes les langues, note et premiere etape.
select t.key as langue,
       t.value->>'discount_note' as note_traduite,
       t.value->'cost_timeline'->'steps'->0->>'detail' as premiere_etape_traduite
from prop_firms, jsonb_each(coalesce(translations, '{}'::jsonb)) t
where slug = 'earn2trade'
order by 1;
