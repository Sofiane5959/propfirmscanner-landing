-- =============================================================================
-- CONFIANCE DANS LA PORTEE D'UNE PROMOTION
-- =============================================================================
-- ADDITIF. Une colonne, un check, un index partiel. Aucune ligne existante
-- n'est supprimee ni deplacee.
--
-- POURQUOI CETTE COLONNE
--
-- `firm_promotions` sait dire QUELLE est la portee d'une promotion :
-- `program_slug`, `account_size`, `eligible_variants`, `eligible_markets`.
-- Un champ nul y signifie « aucune restriction sur cette dimension ».
--
-- Elle ne sait pas dire si cette absence a ete VERIFIEE.
--
-- Les colonnes voisines ne repondent pas non plus :
--   `verified_at`       quand la ligne a ete relevee, pas ce qui a ete etabli
--   `checkout_verified` si le tunnel de paiement a ete teste, autre question
--
-- Or les deux cas se rendent differemment. SCANNED est un exemple direct : le
-- releve officiel du 7 septembre dit que le code fonctionne, mais que
-- « exact_program_and_size_eligibility_confirmed » est FAUX. Le modele
-- l'appliquait pourtant aux quinze selections comme s'il etait universel.
--
-- Une absence de restriction n'est pas une preuve d'universalite.
-- =============================================================================

alter table firm_promotions
  add column if not exists scope_confidence text not null default 'unconfirmed';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'firm_promotions_scope_confidence_check'
  ) then
    alter table firm_promotions add constraint firm_promotions_scope_confidence_check
      check (scope_confidence in ('universal_verified', 'restricted', 'unconfirmed'));
  end if;
end $$;

comment on column firm_promotions.scope_confidence is
  'universal_verified : l''absence de restriction est confirmee par la source. restricted : la portee est explicitement bornee par program_slug, account_size, eligible_variants ou eligible_markets. unconfirmed : la portee n''est pas etablie — defaut, et le modele ne revendique alors aucune applicabilite confirmee.';

-- Le defaut est `unconfirmed` DELIBEREMENT : une ligne deja en base ne doit pas
-- se mettre a revendiquer une universalite que personne n'a verifiee.

create index if not exists firm_promotions_scope_idx
  on firm_promotions (firm_slug, scope_confidence)
  where status = 'active';


-- -----------------------------------------------------------------------------
-- Classement des lignes existantes
-- -----------------------------------------------------------------------------
-- Une promotion qui porte au moins une restriction explicite est `restricted` :
-- cela se lit dans les donnees, sans rien supposer.

update firm_promotions
set    scope_confidence = 'restricted'
where  scope_confidence = 'unconfirmed'
  and  (program_slug is not null
     or account_size is not null
     or (eligible_variants is not null and cardinality(eligible_variants) > 0)
     or (eligible_markets  is not null and cardinality(eligible_markets)  > 0));

-- Les autres restent `unconfirmed`. Aucune n'est promue en
-- `universal_verified` par ce script : cette valeur demande une source, et une
-- source se lit, elle ne se deduit pas.


-- -----------------------------------------------------------------------------
-- Verification
-- -----------------------------------------------------------------------------
select firm_slug, code, is_public, scope_confidence,
       program_slug, account_size, eligible_variants, expires_at
from   firm_promotions
where  firm_slug = 'futureselite'
order  by is_public, code, account_size nulls first;

-- ATTENDU pour FuturesElite : 16 lignes.
--   SCANNED  is_public=false  scope_confidence = 'unconfirmed'
--     -> aucune restriction ecrite, et le releve officiel du 7 septembre dit
--        l'eligibilite par programme et par taille NON confirmee.
--   SUMMER   is_public=true   scope_confidence = 'restricted'  (x15)
--     -> chacune porte un program_slug et un account_size.


-- -----------------------------------------------------------------------------
-- RETOUR EN ARRIERE
-- -----------------------------------------------------------------------------
-- alter table firm_promotions drop constraint if exists firm_promotions_scope_confidence_check;
-- drop index if exists firm_promotions_scope_idx;
-- alter table firm_promotions drop column if exists scope_confidence;
--
-- Le code retombe alors sur `unconfirmed` par defaut : la fiche presente la
-- promotion comme rapportee, jamais comme confirmee. Aucune page ne casse.
