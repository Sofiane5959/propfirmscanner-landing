-- =============================================================================
-- FUTURESELITE — PROGRAMMES, PRIX, PROMOTIONS ET REGLES
-- =============================================================================
-- Prerequis : avoir passe database/RUN-program-schema.sql.
--
-- Source : classeur du 2026-09-04, releve sur le configurateur et la FAQ officiels.
-- L onglet Account Plans etait desaligne (valeurs tassees vers la gauche) ;
-- l affectation utilisee ici a ete reconstruite puis validee, et elle est
-- documentee dans scripts/futureselite-programs.mjs.
--
-- Idempotent : les lignes sont effacees puis reinserees.
-- =============================================================================


-- 1. Table rase pour cette firme uniquement
delete from firm_program_plans where program_id in (select id from firm_programs where firm_slug = 'futureselite');
delete from firm_programs where firm_slug = 'futureselite';
delete from firm_promotions where firm_slug = 'futureselite';
delete from firm_program_bundles where firm_slug = 'futureselite';
delete from firm_platforms where firm_slug = 'futureselite';
delete from firm_rules where firm_slug = 'futureselite';
delete from firm_live_tiers where firm_slug = 'futureselite';


-- 2. Les quatre programmes
insert into firm_programs (firm_slug, slug, name, kind, evaluation_steps, summary, sort_order, max_funded_accounts, max_funded_note, source_url, verified_at) values
  ('futureselite', 'elite', 'Elite', 'evaluation', 1, 'One-step evaluation, end-of-day drawdown and no daily loss limit. The only programme whose payout amount rule is documented in detail.', 1, 5, 'Compté dans le plafond commun de 5 comptes financés Elite + Custom + Instant + Nitro.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'nitro', 'Nitro', 'evaluation', 1, 'One-step evaluation with the lowest minimum trading days. Once funded it switches to a trailing-equity drawdown with a buffer.', 2, 3, 'CONFLIT : le bundle en vend jusqu’à 5, la FAQ officielle n’en autorise que 3 actifs financés. La FAQ fait foi.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 'Prime', 'evaluation', 1, 'The only programme with a daily loss limit in both phases. It also carries the longest bundle ladder, up to ten accounts.', 3, 10, 'Plafond propre à Prime : 10 comptes financés actifs.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'instant', 'Instant', 'instant', null, 'No evaluation: the account is live from purchase. Payout eligibility still requires 10 trading days and a 20% consistency rule.', 4, 5, 'Compté dans le plafond commun de 5 comptes financés Elite + Custom + Instant + Nitro.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04');


-- 3. Les plans, une ligne par programme x phase x taille
--    L evaluation et le compte finance sont des lignes distinctes : ils ne
--    peuvent plus se melanger a l affichage.
insert into firm_program_plans (program_id, phase, account_size, regular_price,
  profit_target, maximum_loss_limit, daily_loss_limit, drawdown_type, buffer,
  buffer_status, max_contracts, contract_scaling, minimum_trading_days,
  consistency_rule, profit_split, payout_cap, minimum_payout, days_between_payouts,
  reset_fee, activation_fee, news_trading_status, news_trading_note,
  scalping_status, scalping_note, source_url, verified_at, confidence) values
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'evaluation', 25000, 95, 1250, 1000, null, 'End of Day', null, 'not_stated', 2, false, 3, 0.4, null, null, null, null, 79, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'evaluation', 50000, 153, 3000, 2000, null, 'End of Day', null, 'not_stated', 4, false, 3, 0.4, null, null, null, null, 89, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'evaluation', 100000, 293, 6000, 3000, null, 'End of Day', null, 'not_stated', 8, false, 3, 0.4, null, null, null, null, 159, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'evaluation', 150000, 353, 9000, 4500, null, 'End of Day', null, 'not_stated', 12, false, 3, 0.4, null, null, null, null, 229, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'sim_funded', 25000, null, null, 1000, null, 'End of Day', null, 'none', 2, true, 6, null, 0.9, 1000, 500, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'sim_funded', 50000, null, null, 2000, null, 'End of Day', null, 'none', 4, true, 6, null, 0.9, 2000, 500, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'sim_funded', 100000, null, null, 3000, null, 'End of Day', null, 'none', 8, true, 6, null, 0.9, 2500, 500, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'elite'), 'sim_funded', 150000, null, null, 4500, null, 'End of Day', null, 'none', 12, true, 6, null, 0.9, 3000, 500, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'evaluation', 25000, 129, 1250, 1000, null, 'End of Day', null, 'not_stated', 2, false, 2, 0.5, null, null, null, null, 89, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'evaluation', 50000, 138, 3000, 2000, null, 'End of Day', null, 'not_stated', 5, false, 2, 0.5, null, null, null, null, 99, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'evaluation', 100000, 218, 6000, 3000, null, 'End of Day', null, 'not_stated', 8, false, 2, 0.5, null, null, null, null, 149, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'evaluation', 150000, 298, 9000, 4500, null, 'End of Day', null, 'not_stated', 10, false, 2, 0.5, null, null, null, null, 219, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'sim_funded', 25000, null, null, 1000, null, 'Trailing Equity', 1100, 'amount', 2, false, 1, null, 0.9, 1000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'sim_funded', 50000, null, null, 2000, null, 'Trailing Equity', 2100, 'amount', 5, false, 1, null, 0.9, 2000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'sim_funded', 100000, null, null, 3000, null, 'Trailing Equity', 3100, 'amount', 8, false, 1, null, 0.9, 2500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'nitro'), 'sim_funded', 150000, null, null, 4500, null, 'Trailing Equity', 4600, 'amount', 10, false, 1, null, 0.9, 2800, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'evaluation', 25000, 96, 1250, 1000, 600, 'End of Day', null, 'not_stated', 2, false, 1, null, null, null, null, null, 89, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'evaluation', 50000, 179, 3000, 2000, 1200, 'End of Day', null, 'not_stated', 4, false, 1, null, null, null, null, null, 109, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'evaluation', 100000, 279, 6000, 3000, 1800, 'End of Day', null, 'not_stated', 6, false, 1, null, null, null, null, null, 159, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'evaluation', 150000, 369, 9000, 4500, 2700, 'End of Day', null, 'not_stated', 10, false, 1, null, null, null, null, null, 209, 0, 'allowed', null, 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'sim_funded', 25000, null, null, 1000, 600, 'End of Day', 1100, 'amount', 2, false, 3, 0.4, 0.9, 1000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'sim_funded', 50000, null, null, 2000, 1200, 'End of Day', 2100, 'amount', 4, false, 3, 0.4, 0.9, 2000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'sim_funded', 100000, null, null, 3000, 1800, 'End of Day', 3100, 'amount', 6, false, 3, 0.4, 0.9, 2500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'prime'), 'sim_funded', 150000, null, null, 4500, 2700, 'End of Day', 4600, 'amount', 10, false, 3, 0.4, 0.9, 3000, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'instant'), 'sim_funded', 50000, 349, null, 1800, null, 'End of Day', null, 'none', 4, false, 10, 0.2, 0.8, 1500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'instant'), 'sim_funded', 100000, 469, null, 3000, null, 'End of Day', null, 'none', 8, false, 10, 0.2, 0.8, 2500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified'),
  ((select id from firm_programs where firm_slug = 'futureselite' and slug = 'instant'), 'sim_funded', 150000, 569, null, 4500, null, 'End of Day', null, 'none', 12, false, 10, 0.2, 0.8, 3500, null, 1, null, 0, 'needs_confirmation', 'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.', 'needs_confirmation', 'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 'verified');


-- 4. Promotions
--    SUMMER varie de 25 a 35 % selon le programme ET la taille : une remise
--    au niveau firme ne pouvait pas l exprimer.
--    SCANNED donne 20 %, donc MOINS que l offre publique partout. is_public
--    a false permet au rendu de ne jamais l annoncer comme le meilleur prix.
insert into firm_promotions (firm_slug, program_slug, account_size, code, label,
  discount_type, discount_value, starts_at, expires_at, verified_at, source_url,
  status, is_public, editorial_note) values
  ('futureselite', 'elite', 25000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.25, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'elite', 50000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'elite', 100000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'elite', 150000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'nitro', 25000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'nitro', 50000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'nitro', 100000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'nitro', 150000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'prime', 25000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'prime', 50000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.35, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'prime', 100000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.35, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'prime', 150000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.35, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'instant', 50000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'instant', 100000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', 'instant', 150000, 'SUMMER', 'Public SUMMER offer', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', true, 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.'),
  ('futureselite', null, null, 'SCANNED', 'PropFirmScanner partner code', 'percent', 0.2, null, null, timestamptz '2026-09-04', 'https://futureselite.com/#pricing', 'active', false, 'Gives 20%, below the public SUMMER offer (25-35%) on every programme as of 2026-09-04. Must never be labelled best price, exclusive or save more while that holds. Realignment requested from the firm.');


-- 5. Bundle & Save — capacite d ACHAT, distincte du plafond FINANCE
insert into firm_program_bundles (firm_slug, program_slug, account_number, discount_percent, status, note, source_url, verified_at) values
  ('futureselite', 'elite', 1, 0.3, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'elite', 2, 0.35, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'elite', 3, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'elite', 4, 0.5, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'elite', 5, 1, 'free', 'Fifth account displayed as free', 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'nitro', 1, 0.3, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'nitro', 2, 0.35, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'nitro', 3, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'nitro', 4, 0.45, 'paid', 'Beyond the official limit of 3 active funded Nitro accounts', 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'nitro', 5, 1, 'free', 'Beyond the official limit of 3 active funded Nitro accounts', 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 1, 0.35, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 2, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 3, 0.42, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 4, 0.45, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 5, 1, 'free', 'Fifth account displayed as free', 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 6, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 7, 0.45, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 8, 0.5, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 9, 0.53, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'prime', 10, 1, 'free', 'Tenth account displayed as free', 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'instant', 1, 0.3, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'instant', 2, 0.35, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'instant', 3, 0.4, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'instant', 4, 0.45, 'paid', null, 'https://futureselite.com/#pricing', timestamptz '2026-09-04'),
  ('futureselite', 'instant', 5, 1, 'free', 'Fifth account displayed as free', 'https://futureselite.com/#pricing', timestamptz '2026-09-04');


-- 6. Plateformes
insert into firm_platforms (firm_slug, name, configurator_status, checkout_surcharge, note, sort_order) values
  ('futureselite', 'Tradovate', 'selectable', 'not_displayed', 'Evaluation and funded availability should be reconfirmed per account', 1),
  ('futureselite', 'NinjaTrader', 'selectable', 'not_displayed', 'Potential external licence cost in live trading', 2),
  ('futureselite', 'WealthCharts', 'selectable', 'not_displayed', null, 3),
  ('futureselite', 'DeepChart', 'selectable', 'not_displayed', 'Dashboard provides credentials and a Dxfeed agreement flow', 4),
  ('futureselite', 'Quantower', 'selectable', 'not_displayed', null, 5),
  ('futureselite', 'ATAS', 'selectable', 'not_displayed', null, 6);


-- 7. Regles
insert into firm_rules (firm_slug, scope, title, detail, severity, confidence, source_url, verified_at, sort_order) values
  ('futureselite', 'session', 'Trading hours', '18:00 EST to 16:55 EST the following day. All positions must close before 16:55 EST.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/11949421-futures-trading-hours-and-guidelines', timestamptz '2026-09-04', 1),
  ('futureselite', 'session', 'Overnight holding', 'Not allowed. Automatic liquidation may occur.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949421-futures-trading-hours-and-guidelines', timestamptz '2026-09-04', 2),
  ('futureselite', 'session', 'Weekend', 'Market closed Friday 16:55 EST to Sunday 18:00 EST. Holiday closures may differ.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/11949421-futures-trading-hours-and-guidelines', timestamptz '2026-09-04', 3),
  ('futureselite', 'conduct', 'Automated trading', 'Fully automated AI or bots are not permitted.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices', timestamptz '2026-09-04', 4),
  ('futureselite', 'conduct', 'Order fills', 'Multiple limit orders at the same price to manipulate fills are prohibited.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices', timestamptz '2026-09-04', 5),
  ('futureselite', 'conduct', 'Market gaps', 'Exploiting isolated fills in gapped or illiquid markets is prohibited.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices', timestamptz '2026-09-04', 6),
  ('futureselite', 'conduct', 'Account flipping', 'Payout, breach and repeat patterns are prohibited.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices', timestamptz '2026-09-04', 7),
  ('futureselite', 'conduct', 'Scalping', 'The configurator displays "No" on every current plan, with no definition or duration threshold.', 'needs_confirmation', 'needs_confirmation', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 8),
  ('futureselite', 'conduct', 'News trading, evaluation', 'The configurator displays "Yes".', 'allowed', 'verified', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 9),
  ('futureselite', 'conduct', 'News trading, funded', 'The configurator displays "With restrictions" without stating the event window.', 'needs_confirmation', 'needs_confirmation', 'https://futureselite.com/#pricing', timestamptz '2026-09-04', 10),
  ('futureselite', 'account', 'KYC', 'Veriff. Buyer, KYC holder and account operator must be the same person. Reviewed at upgrades.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/11948842-know-your-customer-kyc-policy', timestamptz '2026-09-04', 11),
  ('futureselite', 'account', 'Inactivity', '30 consecutive days without trades may permanently close a live account.', 'hard_breach', 'verified', 'https://faq.futureselite.com/en/articles/12291084-trader-rules-responsibilities', timestamptz '2026-09-04', 12),
  ('futureselite', 'account', 'Protective stops', 'A stop order is required on every open position on a live account.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/12291084-trader-rules-responsibilities', timestamptz '2026-09-04', 13),
  ('futureselite', 'account', 'Evaluation duration', 'No deadline to pass. One-time fee, no recurring monthly fee.', 'allowed', 'verified', 'https://faq.futureselite.com/en/articles/16778908-is-the-challenge-fee-is-one-time', timestamptz '2026-09-04', 14),
  ('futureselite', 'limits', 'Active funded accounts', 'Maximum 10 funded accounts overall; maximum 10 Prime; maximum 3 Nitro; maximum 5 combined across Elite, Custom, Instant and Nitro.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/11949051-how-many-accounts-can-i-have-with-futureselite', timestamptz '2026-09-04', 15),
  ('futureselite', 'payout', 'Payout review', 'Average under 24 hours. Manual review may take longer.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/11949982-what-is-the-payout-process-like-on-futures-elite', timestamptz '2026-09-04', 16),
  ('futureselite', 'payout', 'Payment provider', 'Rise. The first payout requires a Rise account and KYC.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed', timestamptz '2026-09-04', 17),
  ('futureselite', 'payout', 'Bank transfer', '1 to 3 days after approval.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed', timestamptz '2026-09-04', 18),
  ('futureselite', 'payout', 'Direct crypto', 'Maximum $500 per request. Above that, standard Rise methods apply.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed', timestamptz '2026-09-04', 19),
  ('futureselite', 'payout', 'Elite maximum request', 'Elite accounts bought from 2026-06-25 15:00 CET: 50% of total profit remaining, capped by account size. Older Elite accounts use 50% of current-cycle profit. Documented for Elite only.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/16387630-how-much-can-i-request', timestamptz '2026-09-04', 20),
  ('futureselite', 'live', 'Transition to live', 'A risk-team decision. The fifth payout is a ceiling, not an automatic entitlement.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/15899069-live-trading-program', timestamptz '2026-09-04', 21),
  ('futureselite', 'live', 'Live starting balance', 'Starts at $0 with a loss floor based on account size. 50K example: $2,000 loss floor and $1,000 cushion.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/15899069-live-trading-program', timestamptz '2026-09-04', 22),
  ('futureselite', 'live', 'Live cushion unlock', '15 profitable days meeting the size-specific daily minimum. Days need not be consecutive.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/15899069-live-trading-program', timestamptz '2026-09-04', 23),
  ('futureselite', 'live', 'Live payout', 'Daily, $200 minimum, on profits above the cushion or unlocked reserve.', 'payout_condition', 'verified', 'https://faq.futureselite.com/en/articles/15899069-live-trading-program', timestamptz '2026-09-04', 24),
  ('futureselite', 'live', 'Market data', 'Exchange market data is the trader’s responsibility on a live account. Amount not specified.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/12291073-market-data-costs', timestamptz '2026-09-04', 25),
  ('futureselite', 'live', 'Commissions', 'Commissions and exchange fees are charged per instrument on each executed trade. The official FAQ still labels some exchange fees as 2024 rates.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/12291021-what-are-the-costs-fees', timestamptz '2026-09-04', 26),
  ('futureselite', 'live', 'Platform licence', 'A paid platform licence may apply depending on the selected platform.', 'restriction', 'verified', 'https://faq.futureselite.com/en/articles/12291021-what-are-the-costs-fees', timestamptz '2026-09-04', 27),
  ('futureselite', 'live', 'Maintenance fee', 'No hidden administrative maintenance fee is stated: $0.', 'allowed', 'verified', 'https://faq.futureselite.com/en/articles/12291021-what-are-the-costs-fees', timestamptz '2026-09-04', 28);


-- 8. Bareme du compte live
insert into firm_live_tiers (firm_slug, account_size, conversion_cap, loss_floor, cushion, daily_minimum, max_mini, max_micro) values
  ('futureselite', 25000, 6000, 1000, 500, 75, 1, 10),
  ('futureselite', 50000, 12000, 2000, 1000, 150, 2, 20),
  ('futureselite', 75000, 14000, 2500, 1250, 225, 3, 30),
  ('futureselite', 100000, 16000, 3000, 1500, 300, 4, 40),
  ('futureselite', 150000, 20000, 4500, 2250, 450, 5, 50);


-- 9. CONTROLE
-- Attendu : 4 programmes, 27 plans, 16 promotions,
--           25 paliers de bundle, 6 plateformes,
--           28 regles, 5 paliers live.
select p.name, pl.phase, pl.account_size, pl.regular_price, pl.profit_target,
       pl.maximum_loss_limit, pl.daily_loss_limit, pl.drawdown_type, pl.buffer_status,
       pl.max_contracts, pl.minimum_trading_days, pl.consistency_rule,
       pl.profit_split, pl.payout_cap, pl.reset_fee
from firm_program_plans pl join firm_programs p on p.id = pl.program_id
where p.firm_slug = 'futureselite'
order by p.sort_order, pl.phase desc, pl.account_size;
