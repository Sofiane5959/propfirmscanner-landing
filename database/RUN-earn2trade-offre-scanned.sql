-- =============================================================================
-- EARN2TRADE — offre SCANNED remise en ligne (21 septembre 2026)
-- =============================================================================
-- Pourquoi : discount_expires_at valait 2026-08-31. Depuis le 1er septembre, la
-- fiche Earn2Trade considere l'offre comme expiree et masque le code et le prix
-- barre, alors que /deals (qui ne lit pas la date) l'affiche encore.
--
-- Confirme par Sofiane le 21/09/2026 : SCANNED donne toujours 50 %, sur toutes
-- les mensualites (plus seulement les 4 premieres), sans date de fin connue.
--
-- Ne touche que la ligne earn2trade de prop_firms :
--   - discount_expires_at -> null (aucune date de fin connue) ;
--   - discount_note       -> « Applies to every monthly billing. » ;
--   - cost_timeline       -> la phrase sur les 4 premieres mensualites est
--                            remplacee.
-- Code et pourcentage ne changent pas (SCANNED, 50) : le controle final le
-- verifie. Tout ou rien : si le controle echoue, rien n'est modifie.
--
-- 1. D'ABORD, executer SEUL ce select et exporter le resultat (retour arriere).
--    L'editeur Supabase n'affiche que le resultat de la derniere requete.
-- =============================================================================

select slug, discount_code, discount_percent, discount_expires_at, discount_note,
       cost_timeline
from prop_firms where slug = 'earn2trade';


-- 2. Ensuite, executer le fichier entier.
begin;

do $ctrl$
begin
  if not exists (select 1 from prop_firms where slug = 'earn2trade'
                 and discount_code = 'SCANNED' and discount_percent = 50) then
    raise exception 'earn2trade : code SCANNED a 50 %% introuvable, rien n''est modifie';
  end if;
end
$ctrl$;

update prop_firms set
  discount_expires_at = null,
  discount_note = 'Applies to every monthly billing.',
  cost_timeline = case
    when cost_timeline::text like '%the first four billings are halved%'
      then replace(cost_timeline::text,
                   'With the current 50% discount the first four billings are halved.',
                   'With code SCANNED, every monthly billing is 50% off.')::jsonb
    else cost_timeline
  end,
  updated_at = now()
where slug = 'earn2trade';

do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'earn2trade';
  if r.discount_code is distinct from 'SCANNED'
     or r.discount_percent is distinct from 50
     or r.discount_expires_at is not null
     or r.discount_note is distinct from 'Applies to every monthly billing.'
     or coalesce(r.cost_timeline::text, '') like '%first four billings%' then
    raise exception 'Controle echoue : earn2trade ne porte pas les valeurs attendues';
  end if;
end
$verif$;

commit;


-- 3. Etat apres (lecture seule).
select slug, discount_code, discount_percent, discount_expires_at, discount_note,
       cost_timeline->'steps'->0->>'detail' as premiere_etape_des_couts
from prop_firms where slug = 'earn2trade';


-- 4. Autres langues (lecture seule) : leurs traductions de la note et de la
--    premiere etape des couts remplacent l'anglais sur /fr, /de… Envoyer ce
--    resultat a Claude : une traduction qui parle encore des 4 premieres
--    mensualites sera corrigee dans un second fichier.
select t.key as langue,
       t.value->>'discount_note' as note_traduite,
       t.value->'cost_timeline'->'steps'->0->>'detail' as premiere_etape_traduite
from prop_firms, jsonb_each(coalesce(translations, '{}'::jsonb)) t
where slug = 'earn2trade'
order by 1;
