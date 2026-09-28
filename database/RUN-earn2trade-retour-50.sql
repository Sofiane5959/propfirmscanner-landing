-- =============================================================================
-- EARN2TRADE — retour a l'offre permanente : SCANNED a 50 %
-- =============================================================================
-- A EXECUTER LE 1er OCTOBRE 2026.
--
-- TROIS GESTES LE MEME JOUR, dans cet ordre :
--   1. ce fichier, pour la base ;
--   2. RUN-earn2trade-retour-tier.sql, pour retirer la mise en avant ;
--   3. demander a Claude de remettre le tableur a 50 % sans date de fin, et de
--      pousser — sinon la fiche affichera encore 60 % jusqu'a l'expiration,
--      puis plus rien du tout. Ce fichier n'est pas optionnel : la
-- promotion de fin septembre porte une date de fin, donc sans lui la remise
-- disparait de /compare et de /deals au lieu de revenir a 50 %.
--
-- Il remet exactement l'etat d'avant la promotion :
--   discount_percent      60 -> 50
--   discount_expires_at   -> null (aucune date de fin connue)
--   discount_note         -> « Applies to every monthly billing. »
--   translations->fr      -> « Valable sur chaque mensualité. »
--   cost_timeline         -> la phrase des mensualites a 50 %
--
-- 1. D'ABORD, executer SEUL ce select et exporter le resultat.
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
  if r.discount_code is distinct from 'SCANNED' then
    raise exception 'earn2trade : le code n''est plus SCANNED, verifier avant de relancer';
  end if;
end
$ctrl$;

update prop_firms set
  discount_percent = 50,
  discount_expires_at = null,
  discount_note = 'Applies to every monthly billing.',
  translations = case
    when translations ? 'fr'
      then jsonb_set(translations, '{fr,discount_note}',
                     to_jsonb('Valable sur chaque mensualité.'::text), false)
    else translations
  end,
  cost_timeline = case
    when cost_timeline::text like '%takes 60%% off the first three billings%'
      then replace(cost_timeline::text,
                   'Until 30 September, code SCANNED takes 60% off the first three billings; after that, 50% off every billing.',
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
     or coalesce(r.cost_timeline::text, '') like '%60%% off the first three billings%' then
    raise exception 'Controle echoue : earn2trade n''est pas revenue a l''offre permanente';
  end if;
end
$verif$;

commit;


-- 3. Etat apres (lecture seule).
select slug, discount_code, discount_percent, discount_expires_at, discount_note,
       translations->'fr'->>'discount_note' as note_fr,
       cost_timeline->'steps'->0->>'detail' as premiere_etape_des_couts
from prop_firms where slug = 'earn2trade';
