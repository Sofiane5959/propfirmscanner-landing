-- =============================================================================
-- CORRECTIF CIBLE — QUATRE VALEURS, FUTURESELITE UNIQUEMENT
-- =============================================================================
-- A coller dans supabase.com -> SQL Editor -> New query -> Run.
--
-- PORTEE : `futureselite` seulement. Chaque commande porte son filtre.
-- Aucune autre firme, aucun `ALTER`, aucun changement de schema.
--
-- IDEMPOTENT : chaque correction est ecrite en remplacement de valeur, pas en
-- accumulation. Le rejouer redonne exactement le meme etat.
--
-- TRANSACTION : le fichier s'ouvre par BEGIN et se ferme par COMMIT. Si une
-- commande echoue, rien n'est applique. (L'editeur Supabase enveloppe deja les
-- scripts, mais l'ecrire explicitement rend le fichier sur quand il est joue
-- ailleurs — psql, migration CI, client tiers.)
--
-- CE QU'IL NE FAIT PAS : il ne rejoue pas les migrations completes. Recreer
-- les programmes changerait leurs `id` et entrainerait la suppression des
-- 27 plans. Pour quatre valeurs, c'est disproportionne.
-- =============================================================================

begin;


-- -----------------------------------------------------------------------------
-- 0. SAUVEGARDE — uniquement ce que ce fichier touche
-- -----------------------------------------------------------------------------
-- Trois valeurs de `prop_firms` et une de `firm_rules`. La sauvegarde complete
-- `fe_sauv_20260908_*` reste valable pour un retour en arriere large ; celle-ci
-- permet d'annuler CE correctif seul, sans toucher au reste.
--
-- Rejouable : la table est supprimee puis recreee. Attention, la rejouer APRES
-- le correctif sauvegarderait l'etat corrige — a ne faire qu'une fois.

drop table if exists fe_sauv_correctif4;
create table fe_sauv_correctif4 as
select f.slug,
       f.pros,
       f.verdict_card,
       f.payout_methods,
       (select r.detail
          from firm_rules r
         where r.firm_slug = 'futureselite'
           and r.title = 'Active funded accounts'
         limit 1)                       as regle_active_funded_accounts,
       now()                            as sauve_le
from   prop_firms f
where  f.slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 1. LE PLAFOND NITRO — `firm_rules.detail`
-- -----------------------------------------------------------------------------
-- « maximum 3 Nitro » etait affirme comme un fait. La FAQ dit 3, la copie du
-- configurateur a affiche MAX 4 : deux sources officielles, deux reponses.
-- Trancher serait un choix editorial deguise en fait.
--
-- Le detail du conflit vit dans la regle « Nitro funded accounts », conservee
-- telle quelle et verifiee au bloc 5.

update firm_rules
set    detail = 'Maximum 10 funded accounts overall; maximum 10 Prime; maximum 5 combined across Elite, Custom, Instant and Nitro. Nitro funded-account limit: not confirmed.'
where  firm_slug = 'futureselite'
  and  title     = 'Active funded accounts';


-- -----------------------------------------------------------------------------
-- 2. LE DRAWDOWN — `prop_firms.pros`
-- -----------------------------------------------------------------------------
-- ATTENTION, LECTURE A CONTRE-COURANT DE LA DEMANDE.
--
-- La consigne etait : retirer Instant « sauf si son drawdown de fin de journee
-- est explicitement verifie ». Il l'est, par DEUX sources independantes :
--
--   firm_program_plans        instant / sim_funded -> 'End of Day' (3 tailles)
--   releve officiel 2026-09-07 instant / funded    -> 'end_of_day_trailing'
--
-- Le programme qui rend la phrase fausse n'est pas Instant, c'est NITRO :
-- fin de journee en evaluation, mais trailing equity une fois finance.
-- Et Prime, absent de la phrase, y aurait sa place : fin de journee dans les
-- deux phases.
--
--   elite     eval End of Day   |  funded End of Day
--   prime     eval End of Day   |  funded End of Day
--   instant   —                 |  funded End of Day
--   nitro     eval End of Day   |  funded Trailing Equity
--
-- La phrase ecrite ici dit donc ce que les donnees soutiennent, sans retirer
-- un programme qui satisfait la condition posee.

update prop_firms
set    pros = array_replace(
         pros,
         'End-of-day drawdown on Elite, Nitro and Instant',
         'End-of-day drawdown on Elite, Prime and Instant; Nitro switches to trailing equity once funded'
       )
where  slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 3. LE VERDICT — `prop_firms.verdict_card -> points`
-- -----------------------------------------------------------------------------
-- « An evaluation with no daily loss limit » est faux pour Prime, qui en porte
-- une dans les deux phases. La formulation nomme donc les deux programmes
-- concernes.
--
-- On reecrit le tableau `points` element par element : remplacer le bloc
-- entier ecraserait les autres points.

update prop_firms
set    verdict_card = jsonb_set(
         verdict_card,
         '{points}',
         (
           select coalesce(jsonb_agg(
                    case when p = 'An evaluation with no daily loss limit, which leaves room to breathe'
                         then to_jsonb('Elite or Nitro evaluations without a daily loss limit, which leaves room to breathe'::text)
                         else to_jsonb(p) end
                    order by ord
                  ), '[]'::jsonb)
           from jsonb_array_elements_text(verdict_card -> 'points') with ordinality as t(p, ord)
         )
       )
where  slug = 'futureselite'
  and  verdict_card ? 'points';


-- -----------------------------------------------------------------------------
-- 4. LE PRESTATAIRE DE PAIEMENT — `prop_firms.payout_methods`
-- -----------------------------------------------------------------------------
-- COLONNE CONFIRMEE. La bande d'information lit
-- `model.catalogue.paymentMethods`, alimente par :
--
--   lib/firm-page-model.ts:800   paymentMethods: toList(firm.payout_methods)
--   lib/firm-page-model.ts:562   note(..., 'prop_firms', 'payout_methods')
--   FirmPage.tsx:271             ['Payment provider', catalogue.paymentMethods…]
--
-- La colonne est de type `text[]` : elle figure dans la liste blanche
-- TEXT_ARRAY du generateur, et FTMO, The5ers et Hantec Trader l'ecrivent deja
-- sous cette forme. Tant qu'elle est NULL, l'entree est filtree et n'apparait
-- pas dans la bande.
--
-- Rise est verifie : la FAQ paiements le documente comme prestataire, avec
-- KYC obligatoire au premier retrait.

update prop_firms
set    payout_methods = array['Rise']::text[]
where  slug = 'futureselite';


commit;


-- =============================================================================
-- VERIFICATIONS — LECTURE SEULE
-- =============================================================================
-- A passer APRES le commit. L'editeur Supabase n'affiche que le dernier
-- resultat : execute les blocs un par un.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 5. Les deux regles Nitro
-- -----------------------------------------------------------------------------
select title, confidence, detail
from   firm_rules
where  firm_slug = 'futureselite'
  and  (title = 'Active funded accounts' or title = 'Nitro funded accounts')
order  by title;

-- ATTENDU : 2 lignes.
--
--   Active funded accounts | verified | « … maximum 5 combined across Elite,
--     Custom, Instant and Nitro. Nitro funded-account limit: not confirmed. »
--     -> ne contient PLUS « maximum 3 Nitro »
--
--   Nitro funded accounts  | needs_confirmation | cite les deux sources :
--     « caps Nitro at 3 funded accounts » et « MAX 4 FUNDED »
--
-- Si la seconde ligne est absente, la regle de conflit n'a jamais ete inseree :
-- il faut alors passer RUN-futureselite-programs.sql.


-- -----------------------------------------------------------------------------
-- 6. Le drawdown dans les atouts
-- -----------------------------------------------------------------------------
select unnest(pros) as atout
from   prop_firms
where  slug = 'futureselite';

-- ATTENDU : la liste contient
--   « End-of-day drawdown on Elite, Prime and Instant; Nitro switches to
--     trailing equity once funded »
-- et NE CONTIENT PLUS
--   « End-of-day drawdown on Elite, Nitro and Instant »


-- -----------------------------------------------------------------------------
-- 7. Le verdict
-- -----------------------------------------------------------------------------
select jsonb_array_elements_text(verdict_card -> 'points') as point
from   prop_firms
where  slug = 'futureselite';

-- ATTENDU : la liste contient
--   « Elite or Nitro evaluations without a daily loss limit, which leaves room
--     to breathe »
-- et plus aucun « An evaluation with no daily loss limit ».
--
-- Les autres points sont inchanges, et leur ordre est conserve.


-- -----------------------------------------------------------------------------
-- 8. Le prestataire de paiement
-- -----------------------------------------------------------------------------
select payout_methods,
       array_length(payout_methods, 1) as nb
from   prop_firms
where  slug = 'futureselite';

-- ATTENDU : {Rise} | 1
-- La bande affichera alors « Payment provider : Rise ».


-- -----------------------------------------------------------------------------
-- 9. Portee — a passer en dernier
-- -----------------------------------------------------------------------------
select count(*) as autres_firmes_modifiees
from   prop_firms
where  updated_at::date = current_date
  and  slug <> 'futureselite';

-- ATTENDU : 0
-- Ce correctif ne met pas `updated_at` a jour : si une autre firme apparait,
-- elle a ete modifiee par autre chose.


-- =============================================================================
-- RETOUR EN ARRIERE DE CE SEUL CORRECTIF
-- =============================================================================
-- A decommenter et passer si l'une des verifications echoue.
-- Exige que `fe_sauv_correctif4` existe et n'ait pas ete recreee entre-temps.
--
-- begin;
--
-- update prop_firms f
-- set    pros           = s.pros,
--        verdict_card   = s.verdict_card,
--        payout_methods = s.payout_methods
-- from   fe_sauv_correctif4 s
-- where  f.slug = 'futureselite' and s.slug = 'futureselite';
--
-- update firm_rules r
-- set    detail = s.regle_active_funded_accounts
-- from   fe_sauv_correctif4 s
-- where  r.firm_slug = 'futureselite'
--   and  r.title     = 'Active funded accounts'
--   and  s.regle_active_funded_accounts is not null;
--
-- commit;
--
-- Puis rejouer les blocs 5 a 8 : ils doivent redonner les anciennes valeurs.
