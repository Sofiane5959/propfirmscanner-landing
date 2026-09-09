-- =============================================================================
-- CORRECTIF FUTURESELITE — VERSION 6
-- =============================================================================
-- GENERE PAR scripts/build-correctif-futureselite.mjs. NE PAS EDITER A LA MAIN.
--
-- COMMENT IDENTIFIER CE FICHIER
--
--   version         6
--   empreinte       5e939ccd86c51403fc9fd8eae3edd26129dc429955b7d82292e5371ca7beed9f
--
-- L empreinte couvre le CORPS — de `begin;` jusqu a la fin —, pas l en-tete,
-- qui la contient et ne peut donc pas se hacher lui-meme. La verifier :
--
--   sed -n '/^begin;/,$p' RUN-06-correctif-futureselite.sql | sha256sum
--
-- Une empreinte differente de celle ci-dessus signifie un fichier different.
-- Ne pas l executer sans avoir demande lequel fait autorite.
--
-- Un seul fichier a passer. Il assemble, dans cet ordre :
--   database/RUN-futureselite-programs.sql   les programmes et leurs plans
--   database/RUN-futureselite.sql            les colonnes editoriales
--
-- Ces deux fichiers restent la source ; ce correctif n en est que le montage.
-- Corriger un prix se fait dans les fixtures, puis `npm run build:correctif`.
--
-- CE QU IL CORRIGE, ET POURQUOI
--
-- Le diagnostic du 9 septembre 2026 a montre un etat a moitie migre :
--
--   market = cfd sur les 4 programmes  -> une version anterieure du fichier
--                                         omettait la colonne, le defaut de
--                                         schema s appliquait
--   « seven platforms »                -> RUN-futureselite.sql jamais passe
--   « all four settle at a 90 »           dans sa version courante
--   « price lists are not public »
--   data_verified_at = 2026-09-03      -> attendu 2026-09-07
--
-- Une deuxieme passe a montre que les tables NORMALISEES n etaient pas les
-- seules en cause : les projections HERITEES reinjectaient leurs propres
-- contradictions, corrigees a la source depuis :
--
--   max_price = 353          -> 569. 353 etait le plus cher des quatre plans
--                               ELITE ; la gamme va jusqu a l Instant 150K
--   Elite a profit_split 80  -> 90. Le 13e element de la ligne manquait, donc
--                               le taux de la FIRME s appliquait a un
--                               programme qui paie 90 %
--   End of day + Trailing    -> les deux colonnes refletent desormais la meme
--                               donnee normalisee ; Elite est End of Day aux
--                               deux phases, Nitro finance est Trailing Equity
--   EA/scalping/news a true  -> false, null, null. Les trois etaient faux,
--                               mais de trois manieres differentes : les bots
--                               sont interdits sans reserve, le scalping n est
--                               pas defini, le news depend de la phase. Mettre
--                               `false` partout serait le mensonge symetrique
--                               de `true` partout. La precision vit dans le
--                               texte de consistency
--   program_guide, journey   -> null. Le premier annoncait quatre programmes
--                               et n en decrivait qu un ; le second affirmait
--                               un parcours evaluation -> finance, faux pour
--                               Instant, et la disparition de la regle de
--                               regularite, faux pour Prime
--   translations             -> vide. Les six bundles datent d avant les
--                               corrections et affirmaient encore sept
--                               plateformes et 90 % pour les quatre, dans
--                               cinq langues. Chaque locale retombe sur
--                               l anglais corrige
--
-- Le `market = cfd` n est pas visible sur la page actuelle — le rendu
-- historique lit `is_futures` — mais il aurait bloque la publication :
-- `marketMetadataAgrees` serait faux, donc l erreur MARKET_MISMATCH.
--
-- TRANSACTIONNEL
--
-- `BEGIN;` ouvre la transaction, `COMMIT;` ne vient qu APRES le controle
-- final. Le controle leve deliberement si le resultat n est pas exactement
-- l attendu : le COMMIT n est alors jamais atteint. Soit la migration est
-- entierement correcte, soit rien n a change.
--
-- L editeur SQL Supabase enveloppe deja le script dans sa propre
-- transaction, donc le `BEGIN;` explicite y produit un AVERTISSEMENT
-- « there is already a transaction in progress ». C est un avertissement,
-- pas une erreur, et le fichier reste correct sous psql ou tout autre
-- client qui, lui, ne suppose rien.
--
-- CE QU IL NE FAIT PAS
--
-- Aucune version n est creee ni publiee. `firm_page_versions` et
-- `active_page_version_id` ne sont pas touches : la fiche continue d etre
-- servie par le rendu historique jusqu a une publication explicite.
-- FTMO et The5ers ne sont pas touches : chaque instruction est filtree sur
-- `futureselite`.
-- =============================================================================


begin;


-- -----------------------------------------------------------------------------
-- CONTROLE AVANT — refuse de tourner si l etat ne s y prete pas
-- -----------------------------------------------------------------------------
do $ctrl$
declare
  v_actif uuid;
  n integer;
  r record;
begin
  if not exists (select 1 from prop_firms where slug = 'futureselite') then
    raise exception 'ARRET : la firme futureselite n''existe pas.';
  end if;

  if to_regclass('public.firm_programs') is null then
    raise exception 'ARRET : RUN-program-schema.sql n''a pas ete passe.';
  end if;

  if not exists (select 1 from information_schema.columns
                  where table_name = 'firm_programs' and column_name = 'market') then
    raise exception 'ARRET : RUN-program-schema-v2.sql n''a pas ete passe.';
  end if;

  -- LES TROIS COLONNES D AUTORISATION DOIVENT POUVOIR PORTER NULL.
  --
  -- `allows_scalping` et `allows_news_trading` sont ecrites a NULL, parce que
  -- la donnee est respectivement non definie et dependante de la phase. Un
  -- booleen ne sait dire ni l un ni l autre, et `false` mentirait autant que
  -- `true` : « news trading interdit » est faux, il est autorise en evaluation.
  --
  -- Si ces colonnes n acceptent pas NULL, le script s ARRETE. Retomber sur
  -- `false` serait choisir une valeur fausse pour eviter une erreur — ce qui
  -- est precisement le mecanisme dont on sort.
  select count(*) into n from information_schema.columns
   where table_schema = 'public' and table_name = 'prop_firm_challenges'
     and column_name in ('allows_ea', 'allows_scalping', 'allows_news_trading');
  if n <> 3 then
    raise exception 'ARRET : prop_firm_challenges ne porte pas les trois colonnes d''autorisation (%/3).', n;
  end if;

  for r in
    select column_name, is_nullable from information_schema.columns
     where table_schema = 'public' and table_name = 'prop_firm_challenges'
       and column_name in ('allows_scalping', 'allows_news_trading')
  loop
    if r.is_nullable = 'NO' then
      -- Le format de `raise` doit etre un LITTERAL : plpgsql refuse une
      -- concatenation par `||` a cet endroit, avec un 42601 peu parlant.
      raise exception
        'ARRET : prop_firm_challenges.% est NOT NULL, or cette colonne doit porter NULL. Le scalping n''est pas defini et le news trading depend de la phase : aucune valeur booleenne n''est vraie. Rendre la colonne nullable, puis rejouer.',
        r.column_name;
    end if;
  end loop;

  -- LE CONTROLE QUI COMPTE.
  --
  -- Corriger la donnee canonique sous une version PUBLIEE ne casserait rien
  -- immediatement — la fiche sert un instantane fige, pas ces tables. Mais
  -- l'instantane cesserait de correspondre a ses sources, et la prochaine
  -- republication changerait la page sans que personne ne sache pourquoi.
  --
  -- Si une version est active, la retirer est une DECISION, pas un effet de
  -- bord de cette migration.
  -- `to_jsonb` : si RUN-05 n'a pas ete passe la cle est absente et rend NULL,
  -- au lieu de faire echouer le bloc sur une colonne inconnue.
  select (to_jsonb(f) ->> 'active_page_version_id')::uuid into v_actif
    from prop_firms f where f.slug = 'futureselite';
  if v_actif is not null then
    raise exception
      'ARRET : une version est active (%). Retire-la d''abord par '' select deactivate_firm_version(''futureselite'') ''.',
      v_actif;
  end if;

  select count(*) into n from firm_programs where firm_slug = 'futureselite';
  raise notice 'Avant : % programme(s), marche = %', n,
    coalesce((select string_agg(distinct market, ', ') from firm_programs
               where firm_slug = 'futureselite'), 'aucun');
end $ctrl$;


-- -----------------------------------------------------------------------------
-- LES PROGRAMMES, LES PLANS, LES PROMOTIONS, LES REGLES
-- Assemble depuis database/RUN-futureselite-programs.sql (15 instructions).
-- -----------------------------------------------------------------------------

alter table firm_promotions add column if not exists scope_confidence text not null default 'unconfirmed';
delete from firm_program_plans where program_id in (select id from firm_programs where firm_slug = 'futureselite');
delete from firm_programs where firm_slug = 'futureselite';
delete from firm_promotions where firm_slug = 'futureselite';
delete from firm_program_bundles where firm_slug = 'futureselite';
delete from firm_platforms where firm_slug = 'futureselite';
delete from firm_rules where firm_slug = 'futureselite';
delete from firm_live_tiers where firm_slug = 'futureselite';
insert into firm_programs (firm_slug, slug, name, market, status, kind, evaluation_steps, summary, sort_order, max_funded_accounts, max_funded_note, source_url, verified_at) values
  ('futureselite', 'elite', 'Elite', 'futures', 'active', 'evaluation', 1, 'One-step evaluation, end-of-day drawdown and no daily loss limit. The only programme whose payout amount rule is documented in detail.', 1, 5, 'Counts towards the shared cap of 5 funded accounts across Elite, Custom, Instant and Nitro.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'nitro', 'Nitro', 'futures', 'active', 'evaluation', 1, 'One-step evaluation with the lowest minimum trading days. Once funded it switches to a trailing-equity drawdown with a buffer.', 2, null, 'Unresolved: the official FAQ states 3 active funded Nitro accounts, while configurator cross-sell copy displayed MAX 4 FUNDED. Confirm with the firm before relying on either figure.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 'Prime', 'futures', 'active', 'evaluation', 1, 'The only programme with a daily loss limit in both phases. It also carries the longest bundle ladder, up to ten accounts.', 3, 10, 'Prime has its own cap: 10 active funded accounts.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'instant', 'Instant', 'futures', 'active', 'instant', null, 'No evaluation: the account is live from purchase. Payout eligibility still requires 10 trading days and a 20% consistency rule.', 4, 5, 'Counts towards the shared cap of 5 funded accounts across Elite, Custom, Instant and Nitro.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07');
insert into firm_program_plans (program_id, currency, phase, account_size, regular_price,
  profit_target, maximum_loss_limit, daily_loss_limit, drawdown_type, buffer,
  buffer_status, max_contracts, contract_scaling, minimum_trading_days,
  consistency_rule, profit_split, payout_cap, minimum_payout, days_between_payouts,
  reset_fee, activation_fee, news_trading_status, news_trading_note,
  scalping_status, scalping_note, source_url, verified_at, confidence) values
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'USD', 'evaluation', 25000, 95, 1250, 1000, null, 'End of Day', null, 'not_stated', 2, false, 3, 0.4, null, null, null, null, 79, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'USD', 'evaluation', 50000, 153, 3000, 2000, null, 'End of Day', null, 'not_stated', 4, false, 3, 0.4, null, null, null, null, 89, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'USD', 'evaluation', 100000, 293, 6000, 3000, null, 'End of Day', null, 'not_stated', 8, false, 3, 0.4, null, null, null, null, 159, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'USD', 'evaluation', 150000, 353, 9000, 4500, null, 'End of Day', null, 'not_stated', 12, false, 3, 0.4, null, null, null, null, 229, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'USD', 'sim_funded', 25000, null, null, 1000, null, 'End of Day', null, 'none', 2, true, 6, null, 0.9, 1000, 500, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'USD', 'sim_funded', 50000, null, null, 2000, null, 'End of Day', null, 'none', 4, true, 6, null, 0.9, 2000, 500, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'USD', 'sim_funded', 100000, null, null, 3000, null, 'End of Day', null, 'none', 8, true, 6, null, 0.9, 2500, 500, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'USD', 'sim_funded', 150000, null, null, 4500, null, 'End of Day', null, 'none', 12, true, 6, null, 0.9, 3000, 500, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'USD', 'evaluation', 25000, 129, 1250, 1000, null, 'End of Day', null, 'not_stated', 2, false, 2, 0.5, null, null, null, null, 89, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'USD', 'evaluation', 50000, 138, 3000, 2000, null, 'End of Day', null, 'not_stated', 5, false, 2, 0.5, null, null, null, null, 99, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'USD', 'evaluation', 100000, 218, 6000, 3000, null, 'End of Day', null, 'not_stated', 8, false, 2, 0.5, null, null, null, null, 149, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'USD', 'evaluation', 150000, 298, 9000, 4500, null, 'End of Day', null, 'not_stated', 10, false, 2, 0.5, null, null, null, null, 219, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'USD', 'sim_funded', 25000, null, null, 1000, null, 'Trailing Equity', 1100, 'amount', 2, false, 1, null, 0.9, 1000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'USD', 'sim_funded', 50000, null, null, 2000, null, 'Trailing Equity', 2100, 'amount', 5, false, 1, null, 0.9, 2000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'USD', 'sim_funded', 100000, null, null, 3000, null, 'Trailing Equity', 3100, 'amount', 8, false, 1, null, 0.9, 2500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'USD', 'sim_funded', 150000, null, null, 4500, null, 'Trailing Equity', 4600, 'amount', 10, false, 1, null, 0.9, 2800, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'USD', 'evaluation', 25000, 96, 1250, 1000, 600, 'End of Day', null, 'not_stated', 2, false, 1, null, null, null, null, null, 89, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'USD', 'evaluation', 50000, 179, 3000, 2000, 1200, 'End of Day', null, 'not_stated', 4, false, 1, null, null, null, null, null, 109, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'USD', 'evaluation', 100000, 279, 6000, 3000, 1800, 'End of Day', null, 'not_stated', 6, false, 1, null, null, null, null, null, 159, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'USD', 'evaluation', 150000, 369, 9000, 4500, 2700, 'End of Day', null, 'not_stated', 10, false, 1, null, null, null, null, null, 209, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'USD', 'sim_funded', 25000, null, null, 1000, 600, 'End of Day', 1100, 'amount', 2, false, 3, 0.4, 0.9, 1000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'USD', 'sim_funded', 50000, null, null, 2000, 1200, 'End of Day', 2100, 'amount', 4, false, 3, 0.4, 0.9, 2000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'USD', 'sim_funded', 100000, null, null, 3000, 1800, 'End of Day', 3100, 'amount', 6, false, 3, 0.4, 0.9, 2500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'USD', 'sim_funded', 150000, null, null, 4500, 2700, 'End of Day', 4600, 'amount', 10, false, 3, 0.4, 0.9, 3000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'instant'), 'USD', 'sim_funded', 50000, 349, null, 1800, null, 'End of Day', null, 'none', 4, false, 10, 0.2, 0.8, 1500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'instant'), 'USD', 'sim_funded', 100000, 469, null, 3000, null, 'End of Day', null, 'none', 8, false, 10, 0.2, 0.8, 2500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'instant'), 'USD', 'sim_funded', 150000, 569, null, 4500, null, 'End of Day', null, 'none', 12, false, 10, 0.2, 0.8, 3500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 'verified');
insert into firm_promotions (firm_slug, program_slug, account_size, code, label,
  discount_type, discount_value, starts_at, expires_at, verified_at, source_url,
  status, is_public, scope_confidence, editorial_note) values
  ('futureselite', 'elite', 25000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.25, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'elite', 50000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'elite', 100000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'elite', 150000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'nitro', 25000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'nitro', 50000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'nitro', 100000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'nitro', 150000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'prime', 25000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'prime', 50000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.35, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'prime', 100000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.35, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'prime', 150000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.35, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'instant', 50000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'instant', 100000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'instant', 150000, 'SUMMER', 'Current public offer — expiry not published', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', true, 'restricted', 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', null, null, 'SCANNED', '30% with code SCANNED — eligibility and best-price status pending confirmation', 'percent', 0.3, null, null, timestamptz '2026-09-07', 'https://futureselite.com/#pricing', 'active', false, 'unconfirmed', 'Verified at 30% on 2026-09-07. Beats the public SUMMER offer on Elite 25K (25%), matches it on eleven plans (30%), and is below it on Prime 50K/100K/150K (35%). Never label it best deal, best verified price, applicable to all programs, or without expiry: per-program eligibility and expiry are both unconfirmed.');
insert into firm_program_bundles (firm_slug, program_slug, account_number, discount_percent, status, note, source_url, verified_at) values
  ('futureselite', 'elite', 1, 0.3, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'elite', 2, 0.35, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'elite', 3, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'elite', 4, 0.5, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'elite', 5, 1, 'free', 'Fifth account displayed as free', 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'nitro', 1, 0.3, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'nitro', 2, 0.35, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'nitro', 3, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'nitro', 4, 0.45, 'paid', 'Beyond the official limit of 3 active funded Nitro accounts', 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'nitro', 5, 1, 'free', 'Beyond the official limit of 3 active funded Nitro accounts', 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 1, 0.35, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 2, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 3, 0.42, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 4, 0.45, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 5, 1, 'free', 'Fifth account displayed as free', 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 6, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 7, 0.45, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 8, 0.5, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 9, 0.53, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'prime', 10, 1, 'free', 'Tenth account displayed as free', 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'instant', 1, 0.3, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'instant', 2, 0.35, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'instant', 3, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'instant', 4, 0.45, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-07'),
  ('futureselite', 'instant', 5, 1, 'free', 'Fifth account displayed as free', 'https://futureselite.com/#pricing', timestamptz '2026-09-07');
insert into firm_platforms (firm_slug, name, configurator_status, checkout_surcharge, note, sort_order) values
  ('futureselite', 'Tradovate', 'selectable', 'not_displayed', null, 1),
  ('futureselite', 'NinjaTrader', 'selectable', 'not_displayed', 'Potential external licence cost in live trading', 2),
  ('futureselite', 'Quantower', 'selectable', 'not_displayed', null, 3),
  ('futureselite', 'ATAS', 'selectable', 'not_displayed', null, 4),
  ('futureselite', 'WealthCharts', 'selectable', 'not_displayed', null, 5),
  ('futureselite', 'DeepChart', 'selectable', 'not_displayed', 'Dashboard provides credentials and a Dxfeed agreement flow', 6),
  ('futureselite', 'Volumetrica', 'marketing_only', 'not_displayed', 'Listed on the official homepage but not exposed in the purchase configurator', 7),
  ('futureselite', 'DeepCharts', 'marketing_only', 'not_displayed', 'Listed on the official homepage but not exposed in the purchase configurator', 8);
insert into firm_rules (firm_slug, scope, title, detail, severity, confidence, source_url, verified_at, sort_order) values
  ('futureselite', 'session', 'Trading hours', '18:00 EST to 16:55 EST the following day. All positions must close before 16:55 EST.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/11949421-futures-trading-hours-and-guidelines', timestamptz '2026-09-07', 1),
  ('futureselite', 'session', 'Overnight holding', 'Not allowed. Automatic liquidation may occur.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949421-futures-trading-hours-and-guidelines', timestamptz '2026-09-07', 2),
  ('futureselite', 'session', 'Weekend', 'Market closed Friday 16:55 EST to Sunday 18:00 EST. Holiday closures may differ.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/11949421-futures-trading-hours-and-guidelines', timestamptz '2026-09-07', 3),
  ('futureselite', 'conduct', 'Automated trading', 'Fully automated AI or bots are not permitted.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices', timestamptz '2026-09-07', 4),
  ('futureselite', 'conduct', 'Order fills', 'Multiple limit orders at the same price to manipulate fills are prohibited.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices', timestamptz '2026-09-07', 5),
  ('futureselite', 'conduct', 'Market gaps', 'Exploiting isolated fills in gapped or illiquid markets is prohibited.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices', timestamptz '2026-09-07', 6),
  ('futureselite', 'conduct', 'Account flipping', 'Payout, breach and repeat patterns are prohibited.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices', timestamptz '2026-09-07', 7),
  ('futureselite', 'conduct', 'Scalping', 'The configurator displays "No" on every current plan, with no definition or duration threshold.', 'needs_confirmation', 'needs_confirmation', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 8),
  ('futureselite', 'conduct', 'News trading, evaluation', 'The configurator displays "Yes".', 'allowed', 'verified', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 9),
  ('futureselite', 'conduct', 'News trading, funded', 'The configurator displays "With restrictions" without stating the event window.', 'needs_confirmation', 'needs_confirmation', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 10),
  ('futureselite', 'account', 'KYC', 'Veriff. Buyer, KYC holder and account operator must be the same person. Reviewed at upgrades.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/11948842-know-your-customer-kyc-policy', timestamptz '2026-09-07', 11),
  ('futureselite', 'account', 'Inactivity', '30 consecutive days without trades may permanently close a live account.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/12291084-trader-rules-responsibilities', timestamptz '2026-09-07', 12),
  ('futureselite', 'account', 'Protective stops', 'A stop order is required on every open position on a live account.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/12291084-trader-rules-responsibilities', timestamptz '2026-09-07', 13),
  ('futureselite', 'account', 'Evaluation duration', 'No deadline to pass. One-time fee, no recurring monthly fee.', 'allowed', 'verified', 'https://faq.futureselite.com/en/articles/16778908-is-the-challenge-fee-is-one-time', timestamptz '2026-09-07', 14),
  ('futureselite', 'limits', 'Active funded accounts', 'Maximum 10 funded accounts overall; maximum 10 Prime; maximum 5 combined across Elite, Custom, Instant and Nitro. Nitro funded-account limit: not confirmed.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/11949051-how-many-accounts-can-i-have-with-futureselite', timestamptz '2026-09-07', 15),
  ('futureselite', 'payout', 'Payout review', 'Average under 24 hours. Manual review may take longer.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/11949982-what-is-the-payout-process-like-on-futures-elite', timestamptz '2026-09-07', 16),
  ('futureselite', 'payout', 'Payment provider', 'Rise. The first payout requires a Rise account and KYC.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed', timestamptz '2026-09-07', 17),
  ('futureselite', 'payout', 'Bank transfer', '1 to 3 days after approval.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed', timestamptz '2026-09-07', 18),
  ('futureselite', 'payout', 'Direct crypto', 'Maximum $500 per request. Above that, standard Rise methods apply.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed', timestamptz '2026-09-07', 19),
  ('futureselite', 'payout', 'Elite maximum request', 'Elite accounts bought from 2026-06-25 15:00 CET: 50% of total profit remaining, capped by account size. Older Elite accounts use 50% of current-cycle profit. Documented for Elite only.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/16387630-how-much-can-i-request', timestamptz '2026-09-07', 20),
  ('futureselite', 'payout', 'What counts as a profitable day', 'Elite requires 6 profitable days per payout, and a day only qualifies above a size-specific minimum: $100 on a 25K, $150 on a 50K, $250 on a 100K, $350 on a 150K.', 'payout_condition', 'verified', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 21),
  ('futureselite', 'account', 'Prime 150K maximum loss', 'Unresolved: the Prime overview and the live configurator show $4,500, while a detailed official MLL article has shown $4,000. The configurator value is used here.', 'hard_breach', 'needs_confirmation', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 22),
  ('futureselite', 'account', 'Instant 25K availability', 'Documented in the official Instant FAQ but not currently purchasable: the live configurator exposes only 50K, 100K and 150K.', 'restriction', 'needs_confirmation', 'https://faq.futureselite.com/en/articles/12901358-how-do-payout-works-on-the-new-instant-challenges', timestamptz '2026-09-07', 23),
  ('futureselite', 'limits', 'Nitro funded accounts', 'Unresolved: the FAQ caps Nitro at 3 funded accounts while configurator cross-sell copy displayed MAX 4 FUNDED. No exact figure is published here until the firm confirms one.', 'restriction', 'needs_confirmation', 'https://faq.futureselite.com/en/articles/11949051-how-many-accounts-can-i-have-with-futureselite', timestamptz '2026-09-07', 24),
  ('futureselite', 'account', 'Prime evaluation length', 'Can be passed in one trading day. A separate FAQ article describes no minimum; the configurator states one day.', 'allowed', 'needs_confirmation', 'https://futureselite.com/#pricing', timestamptz '2026-09-07', 25),
  ('futureselite', 'live', 'Transition to live', 'A risk-team decision. The fifth payout is a ceiling, not an automatic entitlement.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/15899069-live-trading-program', timestamptz '2026-09-07', 26),
  ('futureselite', 'live', 'Live starting balance', 'Starts at $0 with a loss floor based on account size. 50K example: $2,000 loss floor and $1,000 cushion.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/15899069-live-trading-program', timestamptz '2026-09-07', 27),
  ('futureselite', 'live', 'Live cushion unlock', '15 profitable days meeting the size-specific daily minimum. Days need not be consecutive.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/15899069-live-trading-program', timestamptz '2026-09-07', 28),
  ('futureselite', 'live', 'Live payout', 'Daily, $200 minimum, on profits above the cushion or unlocked reserve.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/15899069-live-trading-program', timestamptz '2026-09-07', 29),
  ('futureselite', 'live', 'Market data', 'Exchange market data is the trader’s responsibility on a live account. Amount not specified.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/12291073-market-data-costs', timestamptz '2026-09-07', 30),
  ('futureselite', 'live', 'Commissions', 'Commissions and exchange fees are charged per instrument on each executed trade. The official FAQ still labels some exchange fees as 2024 rates.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/12291021-what-are-the-costs-fees', timestamptz '2026-09-07', 31),
  ('futureselite', 'live', 'Platform licence', 'A paid platform licence may apply depending on the selected platform.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/12291021-what-are-the-costs-fees', timestamptz '2026-09-07', 32),
  ('futureselite', 'live', 'Maintenance fee', 'No hidden administrative maintenance fee is stated: $0.', 'allowed', 'verified', 'https://faq.futureselite.com/en/articles/12291021-what-are-the-costs-fees', timestamptz '2026-09-07', 33);
insert into firm_live_tiers (firm_slug, account_size, conversion_cap, loss_floor, cushion, daily_minimum, max_mini, max_micro) values
  ('futureselite', 25000, 6000, 1000, 500, 75, 1, 10),
  ('futureselite', 50000, 12000, 2000, 1000, 150, 2, 20),
  ('futureselite', 75000, 14000, 2500, 1250, 225, 3, 30),
  ('futureselite', 100000, 16000, 3000, 1500, 300, 4, 40),
  ('futureselite', 150000, 20000, 4500, 2250, 450, 5, 50);


-- -----------------------------------------------------------------------------
-- LES COLONNES EDITORIALES ET LA DATE DE VERIFICATION
-- Assemble depuis database/RUN-futureselite.sql (13 instructions).
-- -----------------------------------------------------------------------------

alter table prop_firms add column if not exists price_currency text default 'USD';
alter table prop_firms add column if not exists data_verified_at timestamptz;
alter table prop_firms add column if not exists data_verified_by text;
alter table prop_firms add column if not exists source_url text;
alter table prop_firms add column if not exists rating_checked_at timestamptz;
alter table prop_firms add column if not exists discount_status text;
alter table prop_firms add column if not exists discount_starts_at timestamptz;
alter table prop_firms add column if not exists max_profit_split integer;
alter table prop_firms add column if not exists translations jsonb;
alter table prop_firms add column if not exists restricted_countries text[];
update prop_firms set
  name                 = 'FuturesElite',
  category_badge       = 'Futures only',
  headline             = 'Four routes to a funded futures account, evaluation or instant',
  verdict              = 'A futures prop firm built around choice: Elite and Prime run classic evaluations, Nitro targets faster payouts, and Instant funds you the day you buy. Each program carries its own loss limits, consistency rule and payout conditions, so the right one depends less on price than on how you actually trade.',
  description          = 'FuturesElite sells simulated futures accounts across four programs. Elite and Prime are evaluation routes with a one-time fee and no deadline to pass. Nitro and Instant shorten or remove the evaluation entirely, Instant funding you from purchase with no objective to reach. Elite, Nitro and Prime settle at a 90% profit split; Instant pays 80%. Payouts can be requested daily once an account is funded, subject to each program’s own minimum days.

It suits futures traders who already have a method and want to choose the rule set that fits it, rather than accept one. Loss limits are dollar amounts rather than percentages, drawdown is calculated at the end of the day on the evaluation programs, and six platforms are selectable at purchase, including Tradovate, NinjaTrader and Quantower.

The caveat matters more than the pricing. Quantum SRL holds no financial regulator licence, and every account is simulated: performance is hypothetical throughout. The live trading program exists but is a risk-team decision, not an entitlement earned at a fixed number of payouts.',
  website_url          = 'https://futureselite.com',
  affiliate_url        = 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
  headquarters         = 'Corso G. Matteotti 61, Latina 04100, Italy',
  country              = 'Italy',
  price_currency       = 'USD',
  is_regulated         = false,
  regulation_details   = 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italy, no. 03095010595. No financial regulator licence. Demo accounts, hypothetical performance.',
  profit_split         = 80,
  max_profit_split     = 90,
  min_price            = 95,
  max_price            = 569,
  is_futures           = true,
  leverage_forex       = null,
  drawdown_type        = 'End of day',
  time_limit           = 'No time limit',
  payout_frequency     = 'on demand, daily once funded',
  source_url           = 'https://futureselite.com',
  logo_url             = 'https://www.google.com/s2/favicons?domain=futureselite.com&sz=128',
  platforms            = 'Tradovate, NinjaTrader, Quantower, ATAS, WealthCharts, DeepChart',
  assets               = '{"Futures"}'::text[],
  payout_methods       = '{"Rise"}'::text[],
  included_items       = '{"Trading journal and analytics dashboard","No activation fee on the funded account","Six platforms to choose from in the configurator"}'::text[],
  pros                 = '{"90% profit split on Elite, Nitro and Prime; 80% on Instant","Drawdown type differs by program and phase — see the rules table","No daily loss limit on Elite, Nitro and Instant — Prime has one in both phases","No funded consistency rule on Elite and Nitro","No activation fee to unlock the funded account","Payouts available every day once funded","Bundle discounts: the fifth account is free"}'::text[],
  cons                 = '{"No financial regulator licence","Demo accounts, hypothetical performance","Minimum days differ by program; Elite needs 6 profitable days above a size-based threshold before a payout","Per-request payout cap, from $1,000 to $3,000 by account size"}'::text[],
  special_features     = '{"Profit split up to 90% — 80% on Instant","Drawdown type is stated per program and per phase","Prime carries a daily loss limit and a 40% funded consistency rule","No activation fee on the funded account","Bundle discounts: the fifth account is free","Instant accounts available, with no evaluation"}'::text[],
  verdict_card         = '{"title":"Who it suits, and who it does not","body":"FuturesElite bets on generous terms once you are funded: up to a 90% split, daily payouts, and no funded consistency rule on Elite and Nitro. In exchange, the firm is young and is a proprietary trading company rather than a regulated broker.","points":["A high split and frequent payouts, with no waiting period","Elite or Nitro evaluations without a daily loss limit, which leaves room to breathe","A funded account that opens with no activation fee","The option to stack up to ten accounts in parallel"],"counterPoints":["You want a regulated broker: Quantum SRL holds no financial regulator licence.","You want real capital: every account is simulated, and performance stays hypothetical.","You run fully automated systems: AI and bots are prohibited.","You want to withdraw a whole balance at once: each request is capped by account size.","You need a guaranteed route to live trading: it is a risk-team decision, not an entitlement."]}'::jsonb,
  program_guide        = null,
  value_strip          = '[{"title":"Futures only","sub":"Simulated accounts, one-time fee, no monthly subscription"},{"title":"No activation fee","sub":"True on all four programs; reset is optional"},{"title":"No time limit to pass","sub":"No deadline on any evaluation program"},{"title":"Daily payout requests","sub":"Once the program’s own minimum days are met"}]'::jsonb,
  key_rules            = '{"title":"The rules that decide it","intro":"Grouped by what they cost you: losing the account, blocking a payout, or limiting how you trade.","rules":[{"category":"Account-failure rules","title":"Maximum Loss Limit","detail":"Breaching it ends the account. It is the only hard risk boundary on Elite, Nitro and Instant, which carry no daily loss limit; Prime adds one in both phases. Elite and Instant recalculate it once a day on the closing balance, so a floating loss does not trip it until the day closes, while Nitro switches to a trailing-equity calculation once funded.","severity":"hard_breach"},{"category":"Account-failure rules","title":"Positions must close before 16:55 EST","detail":"Overnight holding is not allowed and automatic liquidation may occur. The session runs 18:00 EST to 16:55 EST the following day.","severity":"hard_breach"},{"category":"Account-failure rules","title":"30 days without a trade closes a live account","detail":"Inactivity on a live account is permanent closure, not a suspension.","severity":"hard_breach"},{"category":"Passing or payout blockers","title":"Minimum trading days","detail":"Two counts, not one figure: three trading days to complete the Elite evaluation, then six profitable days before a payout can be requested. They apply to different phases and both hold.","severity":"payout_condition"},{"category":"Passing or payout blockers","title":"Consistency rules differ by program","detail":"Elite and Nitro drop it once funded. Prime keeps a 40% rule on the funded account, and Instant starts at 20%. The Elite sales page shows 40% and 50% side by side without saying which applies.","severity":"payout_condition"},{"category":"Passing or payout blockers","title":"Per-request payout cap","detail":"From $1,000 on a 25K up to $3,000 on a 150K, with a $500 minimum on Elite. Payouts can be requested daily once eligible, through Rise, after KYC.","severity":"payout_condition"},{"category":"Trading restrictions","title":"No fully automated trading","detail":"AI systems and bots are not permitted. Semi-automated assistance is not defined by the firm.","severity":"restriction"},{"category":"Trading restrictions","title":"A stop order is required on every live position","detail":"Applies to live accounts. Protective stops are a stated trader responsibility, not a recommendation.","severity":"restriction"},{"category":"Trading restrictions","title":"How many accounts you can hold at once","detail":"Ten funded accounts overall and five combined across Elite, Custom, Instant and Nitro. The Nitro-only cap is disputed between official sources, so no figure is published here. Buying a bundle does not raise the overall limits.","severity":"restriction"}],"more":["No activation fee on the funded account; reset fees run $79 to $229 by size","No profit buffer required","No time limit to pass, and a one-time fee rather than a subscription","Six platforms selectable at purchase, including Tradovate and NinjaTrader","The fifth account in a bundle is free","Exchange market data and commissions are the trader’s cost on a live account"]}'::jsonb,
  journey              = null,
  cost_timeline        = null,
  translations         = null,
  data_verified_at     = timestamptz '2026-09-07',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'futureselite';
delete from prop_firm_challenges where firm_slug = 'futureselite';
insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'futureselite-elite-25k', 'Elite $25K', 'FuturesElite', 'futureselite', '$25K', '1 step', 1000, null, 1250, null, 'End of Day', 'End of Day', 90, 95, null, 'Once funded: 90% split, $1,000 payout cap, payouts available daily, 6 profitable days above $100, no buffer. Reset $79.', 'Minimum trading days, consistency rule, daily loss limit and funded consistency all differ by program. Select a program above to see the rules that apply to it. Fully automated trading and bots are not permitted. The configurator lists scalping as not allowed, without defining it. News trading is allowed during the evaluation and restricted once funded, without a stated event window.', false, null, null, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-50k', 'Elite $50K', 'FuturesElite', 'futureselite', '$50K', '1 step', 2000, null, 3000, null, 'End of Day', 'End of Day', 90, 153, null, 'Once funded: 90% split, $2,000 payout cap, payouts available daily, 6 profitable days above $150, no buffer. Reset $89.', 'Minimum trading days, consistency rule, daily loss limit and funded consistency all differ by program. Select a program above to see the rules that apply to it. Fully automated trading and bots are not permitted. The configurator lists scalping as not allowed, without defining it. News trading is allowed during the evaluation and restricted once funded, without a stated event window.', false, null, null, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-100k', 'Elite $100K', 'FuturesElite', 'futureselite', '$100K', '1 step', 3000, null, 6000, null, 'End of Day', 'End of Day', 90, 293, null, 'Once funded: 90% split, $2,500 payout cap, payouts available daily, 6 profitable days above $250, no buffer. Reset $159.', 'Minimum trading days, consistency rule, daily loss limit and funded consistency all differ by program. Select a program above to see the rules that apply to it. Fully automated trading and bots are not permitted. The configurator lists scalping as not allowed, without defining it. News trading is allowed during the evaluation and restricted once funded, without a stated event window.', false, null, null, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-150k', 'Elite $150K', 'FuturesElite', 'futureselite', '$150K', '1 step', 4500, null, 9000, null, 'End of Day', 'End of Day', 90, 353, null, 'Once funded: 90% split, $3,000 payout cap, payouts available daily, 6 profitable days above $350, no buffer. Reset $229.', 'Minimum trading days, consistency rule, daily loss limit and funded consistency all differ by program. Select a program above to see the rules that apply to it. Fully automated trading and bots are not permitted. The configurator lists scalping as not allowed, without defining it. News trading is allowed during the evaluation and restricted once funded, without a stated event window.', false, null, null, 'one-time', 'usd');


-- -----------------------------------------------------------------------------
-- CONTROLE APRES — leve si le resultat n est pas exactement l attendu
-- -----------------------------------------------------------------------------
-- Une exception ici annule TOUTE la transaction, y compris les ecritures
-- ci-dessus. C est voulu : une migration a moitie appliquee est precisement
-- l'etat qu'on vient de passer une semaine a demeler.
do $verif$
declare
  ecarts text[] := array[]::text[];
  n integer;
  txt text;
begin
  select count(*) into n from firm_programs where firm_slug = 'futureselite';
  if n <> 4 then ecarts := ecarts || format('programmes = %s au lieu de 4', n); end if;

  select string_agg(distinct market, ', ') into txt
    from firm_programs where firm_slug = 'futureselite';
  if txt is distinct from 'futures' then
    ecarts := ecarts || format('marche = %s au lieu de futures', coalesce(txt, 'aucun'));
  end if;

  select count(*) into n from firm_program_plans pl
    join firm_programs pr on pr.id = pl.program_id
   where pr.firm_slug = 'futureselite';
  if n <> 27 then ecarts := ecarts || format('lignes de phase = %s au lieu de 27', n); end if;

  -- Une SELECTION COMMERCIALE = programme + variante + taille. Les phases en
  -- sont les enfants : 27 lignes pour 15 selections, et jamais 27 cartes.
  select count(*) into n from (
    select distinct pr.slug, coalesce(pl.variant_key, ''), pl.account_size
      from firm_program_plans pl
      join firm_programs pr on pr.id = pl.program_id
     where pr.firm_slug = 'futureselite') s;
  if n <> 15 then ecarts := ecarts || format('selections = %s au lieu de 15', n); end if;

  select count(*) into n from firm_platforms
   where firm_slug = 'futureselite' and configurator_status = 'selectable';
  if n <> 6 then ecarts := ecarts || format('plateformes = %s au lieu de 6', n); end if;

  select (data_verified_at)::date::text into txt
    from prop_firms where slug = 'futureselite';
  if txt is distinct from '2026-09-07' then
    ecarts := ecarts || format('date de verification = %s au lieu de 2026-09-07', coalesce(txt, 'nulle'));
  end if;

  -- Les trois textes perimes. La recherche porte sur la LIGNE serialisee :
  -- `pros` et `cons` sont des tableaux, `description` du texte, et un seul
  -- cast ne peut pas convenir aux deux.
  for txt in select unnest(array[
        'seven platforms', 'all four settle at a 90', 'price lists are not public'])
  loop
    if exists (select 1 from prop_firms f
               where f.slug = 'futureselite' and to_jsonb(f)::text ilike '%' || txt || '%') then
      ecarts := ecarts || format('texte perime encore present : %s', txt);
    end if;
  end loop;

  -- LE PARTAGE PAR PROGRAMME, dans les tables normalisees.
  --
  -- « Elite a 90 » etait deja controle sur la projection heritee, mais rien
  -- ne verifiait Instant. Or c'est precisement l'ecart que la page affirmait
  -- a tort : « all four settle at a 90 % » alors qu Instant paie 80. Le
  -- controle porte donc sur les deux, et sur la phase financee seule.
  select count(*) into n from firm_program_plans pl
    join firm_programs pr on pr.id = pl.program_id
   where pr.firm_slug = 'futureselite' and pr.slug = 'instant'
     and pl.phase = 'sim_funded' and pl.profit_split = 0.8;
  if n <> 3 then ecarts := ecarts || format('Instant a 80 %% : %s phase(s) financee(s) sur 3', n); end if;

  select count(*) into n from firm_program_plans pl
    join firm_programs pr on pr.id = pl.program_id
   where pr.firm_slug = 'futureselite' and pr.slug in ('elite', 'nitro', 'prime')
     and pl.phase = 'sim_funded' and pl.profit_split is distinct from 0.9;
  if n <> 0 then ecarts := ecarts || format('%s phase(s) financee(s) Elite/Nitro/Prime hors 90 %%', n); end if;

  -- LES PROJECTIONS HERITEES. Corriger les tables normalisees ne suffisait
  -- pas : ces colonnes-ci alimentent /compare, les cartes et le
  -- configurateur historique, et elles portaient leurs propres
  -- contradictions.
  select min_price into n from prop_firms where slug = 'futureselite';
  if n is distinct from 95 then ecarts := ecarts || format('min_price = %s au lieu de 95', n); end if;

  select max_price into n from prop_firms where slug = 'futureselite';
  if n is distinct from 569 then ecarts := ecarts || format('max_price = %s au lieu de 569', n); end if;

  -- Les traductions sont mises de cote : chaque locale doit retomber sur
  -- l'anglais corrige plutot que servir des chiffres d'avant le 7 septembre.
  if exists (select 1 from prop_firms where slug = 'futureselite'
               and translations is not null and translations::text <> '{}') then
    ecarts := ecarts || 'translations non vide : des traductions perimees seraient servies';
  end if;

  -- Aucun Elite a 80 %. Les quatre phases sim_funded d Elite portent 0,9, et
  -- le texte de payout le dit deja : la colonne ne peut pas dire l inverse.
  select count(*) into n from prop_firm_challenges
   where firm_slug = 'futureselite' and name ilike 'Elite%' and profit_split is distinct from 90;
  if n <> 0 then ecarts := ecarts || format('%s ligne(s) Elite hors 90 %%', n); end if;

  -- Aucune contradiction fin-de-journee / trailing sur une meme ligne.
  select count(*) into n from prop_firm_challenges
   where firm_slug = 'futureselite'
     and ((drawdown_type ilike '%end of day%' and max_loss_type ilike '%trailing%')
       or (drawdown_type ilike '%trailing%' and max_loss_type ilike '%end of day%'));
  if n <> 0 then ecarts := ecarts || format('%s ligne(s) End of Day/Trailing contradictoires', n); end if;

  -- LES VALEURS EXACTES, et pas seulement l absence de `true`.
  --
  -- Verifier « aucun true » laisserait passer `false` partout, qui est le
  -- mensonge symetrique. Chaque colonne est donc controlee pour ce qu elle
  -- doit dire :
  --   allows_ea            false  interdiction etablie, sans reserve
  --   allows_scalping      NULL   terme non defini, conflit de sources ouvert
  --   allows_news_trading  NULL   depend de la phase, la colonne n en a pas
  select count(*) into n from prop_firm_challenges
   where firm_slug = 'futureselite' and allows_ea is distinct from false;
  if n <> 0 then ecarts := ecarts || format('%s ligne(s) ou allows_ea n''est pas false', n); end if;

  select count(*) into n from prop_firm_challenges
   where firm_slug = 'futureselite' and allows_scalping is not null;
  if n <> 0 then ecarts := ecarts || format('%s ligne(s) ou allows_scalping n''est pas NULL', n); end if;

  select count(*) into n from prop_firm_challenges
   where firm_slug = 'futureselite' and allows_news_trading is not null;
  if n <> 0 then ecarts := ecarts || format('%s ligne(s) ou allows_news_trading n''est pas NULL', n); end if;

  -- LES BLOCS EDITORIAUX RETIRES.
  --
  -- `is null` et non `= 'null'::jsonb` : un JSON null n est pas un NULL SQL,
  -- et le generateur ecrivait le premier en croyant ecrire le second. La
  -- section aurait disparu du rendu tout en restant en base, invisible a
  -- tout controle.
  if exists (select 1 from prop_firms where slug = 'futureselite'
               and program_guide is not null) then
    ecarts := ecarts || 'program_guide non nul : le bloc ne decrit qu Elite sur quatre programmes';
  end if;

  if exists (select 1 from prop_firms where slug = 'futureselite'
               and journey is not null) then
    ecarts := ecarts || 'journey non nul : le parcours affirme une evaluation que Instant n a pas';
  end if;

  -- SCANNED : 30 %, portee non confirmee. C est ce qui fait marquer les
  -- quinze prix comme des estimations plutot que comme des prix fermes.
  select count(*) into n from firm_promotions
   where firm_slug = 'futureselite' and code = 'SCANNED'
     and is_public = false and discount_value = 0.30
     and coalesce(to_jsonb(firm_promotions) ->> 'scope_confidence', 'unconfirmed') = 'unconfirmed';
  if n < 1 then
    ecarts := ecarts || 'SCANNED absent, ou pas a 0.30, ou portee confirmee a tort';
  end if;

  -- Aucune version creee : cette migration ne publie rien.
  if to_regclass('public.firm_page_versions') is not null then
    execute $q$ select count(*) from firm_page_versions where firm_slug = 'futureselite' $q$
      into n;
    if n <> 0 then ecarts := ecarts || format('%s version(s) creee(s) : ce fichier ne doit en creer aucune', n); end if;

    execute $q$ select count(*) from prop_firms
                 where slug = 'futureselite' and active_page_version_id is not null $q$ into n;
    if n <> 0 then ecarts := ecarts || 'un pointeur actif a ete pose : ce fichier ne doit rien publier'; end if;
  end if;

  if array_length(ecarts, 1) > 0 then
    raise exception
      'CORRECTIF ANNULE — % ecart(s) : %. Aucune modification n''a ete conservee.',
      array_length(ecarts, 1), array_to_string(ecarts, ' | ');
  end if;

  raise notice 'Correctif applique : 4 programmes futures, 15 selections, 27 phases, 6 plateformes.';
end $verif$;


-- -----------------------------------------------------------------------------
-- COMMIT — jamais atteint si le controle ci-dessus a leve
-- -----------------------------------------------------------------------------
commit;


-- -----------------------------------------------------------------------------
-- RAPPORT FINAL — lit l etat COMMIS
-- -----------------------------------------------------------------------------
select
  (select count(*) from firm_programs where firm_slug = 'futureselite')            as programmes,
  (select string_agg(distinct market, ', ') from firm_programs
    where firm_slug = 'futureselite')                                              as marche,
  (select count(*) from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id
    where pr.firm_slug = 'futureselite')                                           as lignes_de_phase,
  (select count(*) from (select distinct pr.slug, coalesce(pl.variant_key, ''), pl.account_size
                           from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id
                          where pr.firm_slug = 'futureselite') s)                   as selections,
  (select count(*) from firm_platforms
    where firm_slug = 'futureselite' and configurator_status = 'selectable')       as plateformes,
  (select (data_verified_at)::date from prop_firms where slug = 'futureselite')    as verifie_le,
  (select discount_value from firm_promotions
    where firm_slug = 'futureselite' and code = 'SCANNED' limit 1)                 as remise_scanned,
  (select to_jsonb(p) ->> 'scope_confidence' from firm_promotions p
    where p.firm_slug = 'futureselite' and p.code = 'SCANNED' limit 1)             as portee_scanned,
  (select min_price || '-' || max_price from prop_firms
    where slug = 'futureselite')                                                   as fourchette_heritee,
  (select count(*) from prop_firm_challenges
    where firm_slug = 'futureselite' and profit_split = 90)                        as elite_a_90,
  (select count(*) from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id
    where pr.firm_slug = 'futureselite' and pr.slug = 'instant'
      and pl.phase = 'sim_funded' and pl.profit_split = 0.8)                       as instant_a_80,
  (select case when translations is null then 'vide' else 'PRESENTE' end
     from prop_firms where slug = 'futureselite')                                  as traductions,
  (select distinct allows_ea::text || ' / '
          || coalesce(allows_scalping::text, 'NULL') || ' / '
          || coalesce(allows_news_trading::text, 'NULL')
     from prop_firm_challenges where firm_slug = 'futureselite')                   as ea_scalping_news,
  (select case when program_guide is null and journey is null then 'nuls'
               else 'PRESENTS' end
     from prop_firms where slug = 'futureselite')                                  as guide_et_parcours,
  (select coalesce(active_page_version_id::text, 'NULL')
     from prop_firms where slug = 'futureselite')                                  as version_active;

-- ATTENDU :
--   programmes            4
--   marche                futures
--   lignes_de_phase      27
--   selections           15
--   plateformes           6
--   verifie_le           2026-09-07
--   remise_scanned       0.30
--   portee_scanned       unconfirmed
--   fourchette_heritee   95-569
--   elite_a_90            4
--   instant_a_80          3
--   traductions          vide
--   ea_scalping_news     false / NULL / NULL
--   guide_et_parcours    nuls
--   version_active       NULL

-- La derniere colonne DOIT rester NULL : ce correctif ne publie rien.
