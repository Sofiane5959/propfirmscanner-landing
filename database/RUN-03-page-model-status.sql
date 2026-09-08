-- =============================================================================
-- ETAT DE MIGRATION DE LA FICHE — `page_model_status`
-- =============================================================================
-- ADDITIF. `listing_status` n'est ni lue, ni ecrite, ni modifiee par ce script.
--
-- POURQUOI UNE COLONNE DISTINCTE
--
-- `listing_status` vaut 'listed' / 'unlisted' et a deux consommateurs :
--   app/sitemap.ts:87                        filtre SEO
--   app/[locale]/admin/firms/FirmsClient.tsx bascule de visibilite
--
-- Sa semantique est la VISIBILITE PUBLIQUE. Y ajouter un sens « migre vers le
-- nouveau rendu » rendrait les deux indistinguables : le jour ou ils
-- divergeraient, personne ne saurait laquelle fait autorite.
--
-- Les deux axes sont orthogonaux et le restent :
--
--                 listed                    unlisted
--   active        publique, nouveau rendu   masquee, nouveau rendu pret
--   legacy        publique, ancien rendu    masquee, ancien rendu
--
-- CE QUE CETTE COLONNE APPORTE
--
-- La bascule d'une fiche se decide EN BASE, sans deploiement. `PILOTE_MODELE`,
-- la liste de slugs codee en dur, disparait du code.
--
-- Idempotent.
-- =============================================================================

-- 1. La colonne. Defaut `legacy` : aucune fiche ne change de rendu par accident.
alter table prop_firms
  add column if not exists page_model_status text not null default 'legacy';

-- 2. Les cinq etats. `do $$` plutot qu'un `add constraint` sec : rejouable.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'prop_firms_page_model_status_check'
  ) then
    alter table prop_firms add constraint prop_firms_page_model_status_check
      check (page_model_status in ('legacy', 'draft', 'needs_review', 'validated', 'active'));
  end if;
end $$;

comment on column prop_firms.page_model_status is
  'Etat de migration vers FirmPageModel. Distinct de listing_status, qui porte la visibilite publique. Seul « active » fait rendre la fiche par le nouveau composant.';

-- 3. Index : la page lit cette colonne a chaque requete de fiche.
create index if not exists prop_firms_page_model_status_idx
  on prop_firms (page_model_status)
  where page_model_status <> 'legacy';

-- 4. FuturesElite, seule fiche validee a ce jour.
--    Les 349 autres restent `legacy` par le defaut de colonne.
update prop_firms
set    page_model_status = 'active'
where  slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- Verification
-- -----------------------------------------------------------------------------
select page_model_status, count(*) as nb
from   prop_firms
group  by 1
order  by 2 desc;

-- ATTENDU : 2 lignes
--   legacy | 349 (ou le nombre exact de firmes moins une)
--   active | 1

select slug, listing_status, page_model_status
from   prop_firms
where  slug = 'futureselite';

-- ATTENDU : futureselite | listed | active
-- `listing_status` doit valoir exactement ce qu'elle valait avant ce script.


-- -----------------------------------------------------------------------------
-- RETOUR EN ARRIERE
-- -----------------------------------------------------------------------------
-- Le plus rapide, sans deploiement, une fiche a la fois :
--
--   update prop_firms set page_model_status = 'legacy' where slug = 'futureselite';
--
-- Retirer la colonne entierement (le code doit alors etre redeploye) :
--
--   alter table prop_firms drop constraint if exists prop_firms_page_model_status_check;
--   drop index if exists prop_firms_page_model_status_idx;
--   alter table prop_firms drop column if exists page_model_status;
