-- =============================================================================
-- EARN2TRADE — quelle version de page est servie ? (lecture seule)
-- =============================================================================
-- STRICTEMENT EN LECTURE. Aucun update, aucune transaction : ce fichier ne
-- peut rien casser.
--
-- Pourquoi : la page Earn2Trade peut etre rendue de deux facons.
--   - Par une VERSION PUBLIEE, figee dans firm_page_versions et designee par
--     prop_firms.active_page_version_id. C'est un contrat : elle rend ce
--     qu'elle rendait le jour de sa publication.
--   - Par les DONNEES VIVANTES de prop_firms, quand aucun identifiant actif
--     n'est pose. Le contenu suit alors la base, y compris ses brouillons.
-- Si une version publiee existe mais que active_page_version_id est vide, le
-- site sert le brouillon sans le dire : c'est ce que ces trois requetes
-- permettent de trancher.
--
-- Executer les requetes UNE PAR UNE : l'editeur Supabase n'affiche que le
-- resultat de la derniere.
-- =============================================================================

-- 1. Ce que la firme designe aujourd'hui.
select slug,
       page_model_status,
       active_page_version_id,
       updated_at
from prop_firms
where slug = 'earn2trade';


-- 2. Toutes les versions enregistrees pour cette firme, la plus recente d'abord.
--    « active » dit laquelle est servie en ce moment.
select v.id,
       v.version_number,
       v.status,
       v.published_at,
       v.model_schema_version,
       v.source_hash,
       (v.id = f.active_page_version_id) as active
from firm_page_versions v
join prop_firms f on f.slug = v.firm_slug
where v.firm_slug = 'earn2trade'
order by v.version_number desc;


-- 3. Le contenu editorial actuellement dans les donnees vivantes, pour le
--    comparer de visu avec ce que vous aviez ecrit.
select headline,
       verdict,
       discount_note,
       translations->'fr'->>'discount_note' as note_fr,
       jsonb_pretty(cost_timeline) as cost_timeline
from prop_firms
where slug = 'earn2trade';
