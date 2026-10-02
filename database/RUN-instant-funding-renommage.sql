-- =============================================================================
-- INSTANT FUNDING — nouveaux noms, et le nouveau produit (2 octobre 2026)
-- =============================================================================
-- Source : courriel de Jan, Instant Funding Affiliate Manager, du 2 octobre
-- 2026. Il annonce cinq renommages, un produit de plus, et precise qu'IF Evolve
-- garde son nom.
--
-- Ce fichier fait exactement ce que ce courriel demande, et rien de plus. Les
-- familles qu'il ne nomme pas restent intactes : voir la liste en fin de
-- fichier, elles demandent une reponse de Jan avant d'etre touchees.
--
-- Les noms en base portent la taille du compte (« Instant Funding $10,000 »),
-- donc chaque renommage remplace le debut du libelle et garde le reste.
--
-- 1. D'ABORD, executer SEUL ce select et exporter le resultat (retour arriere).
-- =============================================================================

select slug, name, account_size, price
from prop_firm_challenges
where firm_slug = 'instant-funding'
order by name, price;


-- 2. Ensuite, executer le fichier entier.
begin;

-- --- Les cinq renommages annonces -------------------------------------------
-- L'ordre compte : « Instant Funding GO » doit passer AVANT « Instant Funding »,
-- sinon le second capturerait le premier et donnerait « Instant Funding Pro GO ».
update prop_firm_challenges set name = replace(name, 'Instant Funding GO ', 'Instant Funding Lite ')
where firm_slug = 'instant-funding' and name like 'Instant Funding GO %';

update prop_firm_challenges set name = replace(name, 'Instant Funding $', 'Instant Funding Pro $')
where firm_slug = 'instant-funding' and name like 'Instant Funding $%';

update prop_firm_challenges set name = replace(name, 'IF Micro $', 'IF Micro Pro $')
where firm_slug = 'instant-funding' and name like 'IF Micro $%';

update prop_firm_challenges set name = replace(name, 'One-Phase Challenge ', 'One Phase Pro ')
where firm_slug = 'instant-funding' and name like 'One-Phase Challenge %';

update prop_firm_challenges set name = replace(name, 'One-Phase Clarity ', 'One Phase Lite ')
where firm_slug = 'instant-funding' and name like 'One-Phase Clarity %';

-- --- Le nouveau produit : IF Micro Lite --------------------------------------
-- Seuls les champs donnes par le courriel sont renseignes. Les regles de ce
-- produit (drawdown, split, objectifs) n'y figurent pas : les colonnes restent
-- vides plutot que de recopier celles d'IF Micro Pro, qui est un autre produit.
-- prop_firm_challenges.id n'a pas de valeur par defaut : gen_random_uuid().
insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, price, steps)
values
  (gen_random_uuid(), 'if-micro-lite-5k',   'IF Micro Lite $5,000',   'Instant Funding', 'instant-funding', '$5,000',    59, 'Instant funding'),
  (gen_random_uuid(), 'if-micro-lite-10k',  'IF Micro Lite $10,000',  'Instant Funding', 'instant-funding', '$10,000',   99, 'Instant funding'),
  (gen_random_uuid(), 'if-micro-lite-25k',  'IF Micro Lite $25,000',  'Instant Funding', 'instant-funding', '$25,000',  193, 'Instant funding'),
  (gen_random_uuid(), 'if-micro-lite-50k',  'IF Micro Lite $50,000',  'Instant Funding', 'instant-funding', '$50,000',  341, 'Instant funding'),
  (gen_random_uuid(), 'if-micro-lite-100k', 'IF Micro Lite $100,000', 'Instant Funding', 'instant-funding', '$100,000', 671, 'Instant funding')
on conflict (slug) do nothing;

-- --- Controle : tout ou rien --------------------------------------------------
do $verif$
declare restants int; nouveaux int;
begin
  select count(*) into restants from prop_firm_challenges
   where firm_slug = 'instant-funding'
     and (name like 'Instant Funding $%' or name like 'Instant Funding GO %'
          or name like 'IF Micro $%' or name like 'One-Phase Challenge %'
          or name like 'One-Phase Clarity %');
  if restants > 0 then
    raise exception 'Instant Funding : % ligne(s) portent encore un ancien nom, annulation', restants;
  end if;

  select count(*) into nouveaux from prop_firm_challenges
   where firm_slug = 'instant-funding' and name like 'IF Micro Lite %';
  if nouveaux <> 5 then
    raise exception 'Instant Funding : % plan(s) IF Micro Lite au lieu de 5, annulation', nouveaux;
  end if;
end
$verif$;

commit;


-- 3. Controle final : les nouveaux noms, et les cinq nouvelles lignes.
select name, account_size, price
from prop_firm_challenges
where firm_slug = 'instant-funding'
order by name, price;


-- =============================================================================
-- CE QUE CE FICHIER NE TOUCHE PAS, ET POURQUOI
-- =============================================================================
-- Quatre familles existent en base et ne figurent pas dans le courriel de Jan :
--
--   Instant Funding Clarity   9 plans   $625 a $120,000
--   IF Micro Clarity          6 plans   $5,000 a $200,000
--   One-Phase Micro           4 plans   $10,000 a $100,000
--   IF1 (24-Hour Account)     6 plans   $2,000 a $100,000
--
-- « One Phase Clarity » devient « One Phase Lite » d'apres le courriel. En
-- deduire que les autres « Clarity » deviennent « Lite » serait une analogie,
-- et deux familles porteraient alors le meme nom : « Instant Funding GO » est
-- deja annonce comme devenant « Instant Funding Lite ».
--
-- De meme, « One-Phase Challenge » a ete traite comme le « One Phase Original »
-- du courriel : c'est la seule famille One-Phase sans qualificatif, mais la
-- correspondance n'est pas ecrite noir sur blanc. A confirmer avec Jan.
--
-- Enfin, les regles d'IF Micro Lite restent a renseigner : drawdown, objectif,
-- partage, frequence de retrait. Le PDF joint au courriel est encode avec des
-- polices non standard et ne se lit pas de maniere fiable.
-- =============================================================================
