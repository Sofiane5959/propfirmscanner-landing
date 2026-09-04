-- =============================================================================
-- BRIGHTFUNDED — PROGRAMMES, PRIX, PROMOTIONS ET REGLES
-- =============================================================================
-- Prerequis : database/RUN-program-schema.sql doit avoir ete passe une fois.
--
-- Source : classeur du 2026-09-04. Les classeurs tassent leurs valeurs vers la
-- gauche quand un champ est vide ; les valeurs ont donc ete recopiees apres
-- controle semantique, et tout champ au placement ambigu porte
-- confidence = 'needs_confirmation' plutot qu une affirmation.
--
-- Idempotent : les lignes de cette firme sont effacees puis reinserees.
-- Aucune autre firme n est touchee.
-- =============================================================================


-- 1. Table rase pour cette firme uniquement
delete from firm_program_plans where program_id in (select id from firm_programs where firm_slug = 'brightfunded');
delete from firm_programs where firm_slug = 'brightfunded';
delete from firm_promotions where firm_slug = 'brightfunded';
delete from firm_program_bundles where firm_slug = 'brightfunded';
delete from firm_platforms where firm_slug = 'brightfunded';
delete from firm_rules where firm_slug = 'brightfunded';
delete from firm_live_tiers where firm_slug = 'brightfunded';


-- 2. Les 4 programmes
insert into firm_programs (firm_slug, slug, name, kind, evaluation_steps, summary, sort_order, max_funded_accounts, max_funded_note, source_url, verified_at) values
  ('brightfunded', 'bf-2-step-bright', '2-Step Bright', 'evaluation', 2, 'Two phases, 8% then 5%, with a 4% daily limit and an 8% maximum loss. Priced in euros.', 1, null, null, 'https://brightfunded.com/', timestamptz '2026-09-04'),
  ('brightfunded', 'bf-1-step', '1-Step', 'evaluation', 1, 'One phase with a 10% target. Sizes run from 5K to 200K; the live prices still need reading from the dynamic selector.', 2, null, null, 'https://brightfunded.com/', timestamptz '2026-09-04'),
  ('brightfunded', 'bf-2-step-classic', '2-Step Classic', 'evaluation', 2, 'The traditional two-phase model. Sizes run from 5K to 200K; exact values still to be read from the live selector.', 3, null, null, 'https://brightfunded.com/', timestamptz '2026-09-04'),
  ('brightfunded', 'bf-free-1k', 'Free $1K Challenge', 'evaluation', 1, 'A free entry on a $1,000 account, with its own separate rules.', 4, null, null, 'https://brightfunded.com/', timestamptz '2026-09-04');


-- 3. Les 9 plans, une ligne par programme x phase x taille
insert into firm_program_plans (program_id, phase, account_size, regular_price,
  profit_target, maximum_loss_limit, daily_loss_limit, drawdown_type, buffer,
  buffer_status, max_contracts, contract_scaling, minimum_trading_days,
  consistency_rule, profit_split, payout_cap, minimum_payout, days_between_payouts,
  reset_fee, activation_fee, news_trading_status, news_trading_note,
  scalping_status, scalping_note, source_url, verified_at, confidence, editorial_note) values
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-2-step-bright'), 'evaluation', 5000, 47, 0.08, 0.08, 0.04, null, null, 'not_stated', null, null, 5, null, 0.9, null, null, null, null, null, 'restricted', 'A 5-minute restriction is shown on the card. The exact window still needs defining.', null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%. Prices are in EUR.'),
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-2-step-bright'), 'evaluation', 10000, 87, 0.08, 0.08, 0.04, null, null, 'not_stated', null, null, 5, null, 0.9, null, null, null, null, null, 'restricted', 'A 5-minute restriction is shown on the card. The exact window still needs defining.', null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%. Prices are in EUR.'),
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-2-step-bright'), 'evaluation', 25000, 187, 0.08, 0.08, 0.04, null, null, 'not_stated', null, null, 5, null, 0.9, null, null, null, null, null, 'restricted', 'A 5-minute restriction is shown on the card. The exact window still needs defining.', null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%. Prices are in EUR.'),
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-2-step-bright'), 'evaluation', 50000, 277, 0.08, 0.08, 0.04, null, null, 'not_stated', null, null, 5, null, 0.9, null, null, null, null, null, 'restricted', 'A 5-minute restriction is shown on the card. The exact window still needs defining.', null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%. Prices are in EUR.'),
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-2-step-bright'), 'evaluation', 100000, 477, 0.08, 0.08, 0.04, null, null, 'not_stated', null, null, 5, null, 0.9, null, null, null, null, null, 'restricted', 'A 5-minute restriction is shown on the card. The exact window still needs defining.', null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%. Prices are in EUR.'),
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-2-step-bright'), 'evaluation', 200000, 947, 0.08, 0.08, 0.04, null, null, 'not_stated', null, null, 5, null, 0.9, null, null, null, null, null, 'restricted', 'A 5-minute restriction is shown on the card. The exact window still needs defining.', null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%. Prices are in EUR.'),
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-1-step'), 'evaluation', 0, null, 0.1, null, null, null, null, 'not_stated', null, null, null, null, 0.9, null, null, null, null, null, null, null, null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'needs_confirmation', 'Sizes 5K to 200K. Exact live prices were not readable in the dynamic selector and are deliberately absent rather than guessed.'),
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-2-step-classic'), 'evaluation', 0, null, null, null, null, null, null, 'not_stated', null, null, null, null, 0.9, null, null, null, null, null, null, null, null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'needs_confirmation', 'Sizes 5K to 200K. Targets and limits were not readable and are left empty rather than copied from another program.'),
  ((select id from firm_programs where firm_slug = 'brightfunded' and slug = 'bf-free-1k'), 'evaluation', 1000, 0, 0.05, null, null, null, null, 'not_stated', null, null, null, null, 0.8, null, null, null, null, null, null, null, null, null, 'https://brightfunded.com/', timestamptz '2026-09-04', 'needs_confirmation', 'Free entry, with separate rules. The 0 price is a genuine verified zero, not a dynamic placeholder.');


-- 4. 3 promotion(s), datees et jamais qualifiees de permanentes
insert into firm_promotions (firm_slug, program_slug, account_size, code, label,
  discount_type, discount_value, starts_at, expires_at, verified_at, source_url,
  status, is_public, editorial_note) values
  ('brightfunded', 'bf-1-step', null, 'RALLY30', 'Autumn public promotion', 'percent', 0.3, null, null, timestamptz '2026-09-04', 'https://brightfunded.com/', 'active', true, 'Time-sensitive public promotion, not a permanent base price. No expiry date is published: stored as unknown.'),
  ('brightfunded', 'bf-2-step-bright', null, 'RALLY25', 'Autumn public promotion', 'percent', 0.25, null, null, timestamptz '2026-09-04', 'https://brightfunded.com/', 'active', true, 'Time-sensitive public promotion, not a permanent base price. No expiry date is published: stored as unknown.'),
  ('brightfunded', 'bf-2-step-classic', null, 'RALLY15', 'Autumn public promotion', 'percent', 0.15, null, null, timestamptz '2026-09-04', 'https://brightfunded.com/', 'active', true, 'Time-sensitive public promotion, not a permanent base price. No expiry date is published: stored as unknown.');


-- 5. Plateformes
insert into firm_platforms (firm_slug, name, configurator_status, checkout_surcharge, note, sort_order) values
  ('brightfunded', 'MetaTrader 5', 'selectable', 'not_displayed', 'Not intended for residents or citizens of the US, the UAE and other restricted countries', 1),
  ('brightfunded', 'cTrader', 'selectable', 'not_displayed', null, 2),
  ('brightfunded', 'DXtrade', 'selectable', 'not_displayed', null, 3);


-- 6. 11 regles, avec leur niveau de gravite
insert into firm_rules (firm_slug, scope, title, detail, severity, confidence, source_url, verified_at, sort_order) values
  ('brightfunded', 'structure', 'Trading period', 'Unlimited on every paid program.', 'allowed', 'verified', 'https://brightfunded.com/', timestamptz '2026-09-04', 1),
  ('brightfunded', 'consistency', 'Consistency rule', 'None advertised on any paid plan.', 'allowed', 'verified', 'https://brightfunded.com/', timestamptz '2026-09-04', 2),
  ('brightfunded', 'structure', 'Minimum trading days', '5 trading days on 2-Step Bright.', 'restriction', 'verified', 'https://brightfunded.com/', timestamptz '2026-09-04', 3),
  ('brightfunded', 'news', 'News trading on 2-Step Bright', 'A 5-minute restriction is shown on the card. The exact window is not defined.', 'needs_confirmation', 'needs_confirmation', 'https://brightfunded.com/', timestamptz '2026-09-04', 4),
  ('brightfunded', 'payout', 'Profit split', 'Up to 90%, depending on the program and the options bought.', 'payout_condition', 'verified', 'https://brightfunded.com/', timestamptz '2026-09-04', 5),
  ('brightfunded', 'payout', 'Processing guarantee', 'A 24-hour payout guarantee is advertised. Detailed conditions still to be rechecked.', 'payout_condition', 'needs_confirmation', 'https://brightfunded.com/', timestamptz '2026-09-04', 6),
  ('brightfunded', 'payout', 'Evaluation reward', '15% of the evaluation profit is added after qualifying growth. The trigger per program still needs verifying.', 'needs_confirmation', 'needs_confirmation', 'https://brightfunded.com/', timestamptz '2026-09-04', 7),
  ('brightfunded', 'structure', 'Account cap', 'Up to $400K of simulated capital under management.', 'restriction', 'verified', 'https://brightfunded.com/', timestamptz '2026-09-04', 8),
  ('brightfunded', 'addons', 'Paid add-ons', 'Swap-Free, Weekly Payouts, 100% fee refund, No Minimum Trading Days and a 90% payout ratio. Availability and price vary.', 'restriction', 'needs_confirmation', 'https://brightfunded.com/', timestamptz '2026-09-04', 9),
  ('brightfunded', 'restrictions', 'Prohibited countries', 'The service is unavailable in Cuba, Iran, North Korea, Syria and Vietnam.', 'hard_breach', 'verified', 'https://brightfunded.com/terms-and-conditions', timestamptz '2026-09-04', 10),
  ('brightfunded', 'restrictions', 'MT5 residency', 'MetaTrader 5 is not intended for residents or citizens of the US, the UAE and other restricted countries.', 'restriction', 'verified', 'https://brightfunded.com/', timestamptz '2026-09-04', 11);


-- 7. CONTROLE
-- Attendu : 4 programmes, 9 plans, 3 promotion(s), 11 regles.
select p.name, pl.phase, pl.account_size, pl.regular_price, pl.profit_target,
       pl.maximum_loss_limit, pl.daily_loss_limit, pl.profit_split, pl.confidence
from firm_program_plans pl join firm_programs p on p.id = pl.program_id
where p.firm_slug = 'brightfunded'
order by p.sort_order, pl.account_size;
