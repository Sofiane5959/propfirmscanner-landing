-- =============================================================================
-- CORRECTIF CIBLE — LE MARCHE DES PROGRAMMES FUTURESELITE
-- =============================================================================
-- A passer APRES les deux migrations deja executees.
--
-- CE QUI S'EST PASSE
--
-- `RUN-futureselite-programs.sql` inserait les programmes SANS la colonne
-- `market`. Elle a donc pris son defaut de schema :
--
--     alter table firm_programs add column ... market text not null default 'cfd'
--
-- Consequences sur la fiche :
--   1. le hero annonce « Italy · cfd prop firm » ;
--   2. le fait de firme « Futures only » disparait — sa construction exige que
--      les programmes ET la colonne `prop_firms.is_futures` soient d'accord
--      sur le marche, et ils ne l'etaient plus.
--
-- Un defaut de colonne n'est pas une valeur verifiee. Le generateur ecrit
-- desormais `market` et `status` explicitement ; ce fichier repare la base
-- deja migree sans rejouer la totalite.
--
-- POURQUOI UN UPDATE PLUTOT QU'UN REJEU
--
-- Rejouer `RUN-futureselite-programs.sql` recree les programmes, donc de
-- nouveaux `id`, donc la suppression et la reinsertion des 27 plans. Pour
-- corriger deux colonnes, c'est disproportionne. Cet UPDATE ne touche que ce
-- qui est faux.
--
-- Idempotent, et sans effet sur les autres firmes.
-- =============================================================================

update firm_programs
set    market = 'futures',
       status = coalesce(nullif(status, ''), 'active')
where  firm_slug = 'futureselite';

-- Controle : les quatre programmes en futures, tous actifs.
select slug, name, market, status
from   firm_programs
where  firm_slug = 'futureselite'
order  by sort_order;

-- ATTENDU : 4 lignes
--   elite   | Elite   | futures | active
--   nitro   | Nitro   | futures | active
--   prime   | Prime   | futures | active
--   instant | Instant | futures | active
--
-- Apres ce correctif, la fiche doit afficher « Italy · Futures prop firm » et
-- retrouver le fait de firme « Futures only ». Recharge deux fois : le premier
-- appel sert une copie perimee.


-- -----------------------------------------------------------------------------
-- A VERIFIER SUR LES AUTRES FIRMES — hors perimetre du pilote
-- -----------------------------------------------------------------------------
-- Le meme oubli existe peut-etre pour FTMO et The5ers, dont les packs sont
-- generes par un autre script. Cette requete est en LECTURE SEULE : elle
-- signale les programmes dont le marche contredit la fiche.
--
-- Je ne corrige rien ici : tu as demande de ne pas toucher a ces firmes.

select pr.firm_slug, pr.slug, pr.market, f.is_futures
from   firm_programs pr
join   prop_firms f on f.slug = pr.firm_slug
where  (f.is_futures = true  and pr.market <> 'futures')
   or  (f.is_futures = false and pr.market =  'futures')
order  by pr.firm_slug, pr.sort_order;

-- ATTENDU apres le correctif ci-dessus : aucune ligne pour futureselite.
-- Toute ligne restante designe une firme a corriger de la meme facon.
