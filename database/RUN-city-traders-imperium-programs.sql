-- =============================================================================
-- CITY-TRADERS-IMPERIUM — PROGRAMMES, PRIX, PROMOTIONS ET REGLES
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
delete from firm_program_plans where program_id in (select id from firm_programs where firm_slug = 'city-traders-imperium');
delete from firm_programs where firm_slug = 'city-traders-imperium';
delete from firm_promotions where firm_slug = 'city-traders-imperium';
delete from firm_program_bundles where firm_slug = 'city-traders-imperium';
delete from firm_platforms where firm_slug = 'city-traders-imperium';
delete from firm_rules where firm_slug = 'city-traders-imperium';
delete from firm_live_tiers where firm_slug = 'city-traders-imperium';


-- 2. Les 4 programmes
insert into firm_programs (firm_slug, slug, name, kind, evaluation_steps, summary, sort_order, max_funded_accounts, max_funded_note, source_url, verified_at) values
  ('city-traders-imperium', 'cti-1-step', '1-Step Challenge', 'evaluation', 1, 'One phase, an 8% target and a 5% maximum loss. The live card shows no daily drawdown.', 1, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04'),
  ('city-traders-imperium', 'cti-2-step', '2-Step Challenge', 'evaluation', 2, 'Two phases, 10% then 5%, with a 5% daily limit and a 10% maximum loss.', 2, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04'),
  ('city-traders-imperium', 'cti-instant', 'Instant Funding', 'instant', null, 'Funded from purchase, but the account STARTS at half the displayed size and scales to it after a 5% target.', 3, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04'),
  ('city-traders-imperium', 'cti-direct', 'Direct Funding', 'instant', null, 'Starts fully funded, with a 6% maximum loss and a 10% target to scale.', 4, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04');


-- 3. Les 23 plans, une ligne par programme x phase x taille
insert into firm_program_plans (program_id, phase, account_size, regular_price,
  profit_target, maximum_loss_limit, daily_loss_limit, drawdown_type, buffer,
  buffer_status, max_contracts, contract_scaling, minimum_trading_days,
  consistency_rule, profit_split, payout_cap, minimum_payout, days_between_payouts,
  reset_fee, activation_fee, news_trading_status, news_trading_note,
  scalping_status, scalping_note, source_url, verified_at, confidence, editorial_note) values
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-1-step'), 'evaluation', 2500, 29, 0.08, 0.05, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'The live card displays no daily drawdown. That means it is not shown, not that no daily rule exists.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-1-step'), 'evaluation', 5000, 49, 0.08, 0.05, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'The live card displays no daily drawdown. That means it is not shown, not that no daily rule exists.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-1-step'), 'evaluation', 10000, 79, 0.08, 0.05, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'The live card displays no daily drawdown. That means it is not shown, not that no daily rule exists.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-1-step'), 'evaluation', 25000, 159, 0.08, 0.05, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'The live card displays no daily drawdown. That means it is not shown, not that no daily rule exists.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-1-step'), 'evaluation', 50000, 299, 0.08, 0.05, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'The live card displays no daily drawdown. That means it is not shown, not that no daily rule exists.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-1-step'), 'evaluation', 100000, 449, 0.08, 0.05, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'The live card displays no daily drawdown. That means it is not shown, not that no daily rule exists.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-2-step'), 'evaluation', 2500, 39, 0.1, 0.1, 0.05, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-2-step'), 'evaluation', 5000, 59, 0.1, 0.1, 0.05, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-2-step'), 'evaluation', 10000, 99, 0.1, 0.1, 0.05, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-2-step'), 'evaluation', 25000, 199, 0.1, 0.1, 0.05, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-2-step'), 'evaluation', 50000, 329, 0.1, 0.1, 0.05, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-2-step'), 'evaluation', 100000, 549, 0.1, 0.1, 0.05, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Phase 2 target is 5%.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-instant'), 'sim_funded', 2500, 79, 0.05, 0.03, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Starting balance is 50% of the displayed size. Reaching the 5% target doubles it to the full size. Not to be confused with Direct Funding, which starts fully funded.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-instant'), 'sim_funded', 5000, 139, 0.05, 0.03, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Starting balance is 50% of the displayed size. Reaching the 5% target doubles it to the full size. Not to be confused with Direct Funding, which starts fully funded.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-instant'), 'sim_funded', 10000, 259, 0.05, 0.03, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Starting balance is 50% of the displayed size. Reaching the 5% target doubles it to the full size. Not to be confused with Direct Funding, which starts fully funded.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-instant'), 'sim_funded', 20000, 449, 0.05, 0.03, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Starting balance is 50% of the displayed size. Reaching the 5% target doubles it to the full size. Not to be confused with Direct Funding, which starts fully funded.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-instant'), 'sim_funded', 40000, 849, 0.05, 0.03, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Starting balance is 50% of the displayed size. Reaching the 5% target doubles it to the full size. Not to be confused with Direct Funding, which starts fully funded.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-instant'), 'sim_funded', 80000, 1599, 0.05, 0.03, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Starting balance is 50% of the displayed size. Reaching the 5% target doubles it to the full size. Not to be confused with Direct Funding, which starts fully funded.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-direct'), 'sim_funded', 5000, 229, 0.1, 0.06, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'verified', 'Starts fully funded, unlike Instant Funding.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-direct'), 'sim_funded', 10000, null, 0.1, 0.06, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'needs_confirmation', 'Price not verified: only the entry price was reliably visible in the checkout. Left blank rather than inferred.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-direct'), 'sim_funded', 20000, null, 0.1, 0.06, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'needs_confirmation', 'Price not verified: only the entry price was reliably visible in the checkout. Left blank rather than inferred.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-direct'), 'sim_funded', 40000, null, 0.1, 0.06, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'needs_confirmation', 'Price not verified: only the entry price was reliably visible in the checkout. Left blank rather than inferred.'),
  ((select id from firm_programs where firm_slug = 'city-traders-imperium' and slug = 'cti-direct'), 'sim_funded', 80000, null, 0.1, 0.06, null, null, null, 'not_stated', null, null, null, null, null, null, null, null, null, null, 'allowed', null, null, null, 'https://citytradersimperium.com/', timestamptz '2026-09-04', 'needs_confirmation', 'Price not verified: only the entry price was reliably visible in the checkout. Left blank rather than inferred.');


-- 5. Plateformes
insert into firm_platforms (firm_slug, name, configurator_status, checkout_surcharge, note, sort_order) values
  ('city-traders-imperium', 'MetaTrader 5', 'selectable', 'not_displayed', null, 1),
  ('city-traders-imperium', 'Match-Trader', 'selectable', 'not_displayed', null, 2);


-- 6. 12 regles, avec leur niveau de gravite
insert into firm_rules (firm_slug, scope, title, detail, severity, confidence, source_url, verified_at, sort_order) values
  ('city-traders-imperium', 'payout', 'Profit share', 'Advertised up to 100%, which is the maximum VIP tier and not the rate every account starts on.', 'payout_condition', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 1),
  ('city-traders-imperium', 'payout', 'First withdrawal on 1-Step and 2-Step', '7 days.', 'payout_condition', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 2),
  ('city-traders-imperium', 'payout', 'First withdrawal on Instant and Direct', '5 days.', 'payout_condition', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 3),
  ('city-traders-imperium', 'payout', 'Profitable days', '3 profitable days are required on the 1-Step and 2-Step challenges.', 'payout_condition', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 4),
  ('city-traders-imperium', 'payout', 'Anytime payout', 'From VIP Silver, on demand, any day, with no fixed schedule and no minimum trading days.', 'payout_condition', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 5),
  ('city-traders-imperium', 'payout', 'Average payout time', 'An 8-hour average is advertised. Firm marketing statistic, not an independent measurement.', 'payout_condition', 'needs_confirmation', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 6),
  ('city-traders-imperium', 'scaling', 'Instant Funding scaling', 'The starting balance doubles to the displayed full size once the 5% target is reached.', 'restriction', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 7),
  ('city-traders-imperium', 'daily', '1-Step daily drawdown', 'No daily drawdown is displayed on the live card. That is not the same as confirming no daily rule exists.', 'needs_confirmation', 'needs_confirmation', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 8),
  ('city-traders-imperium', 'news', 'News trading', 'Marked allowed on all four live cards.', 'allowed', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 9),
  ('city-traders-imperium', 'conduct', 'Overnight, weekend and expert advisers', 'The exact official wording has not been confirmed.', 'needs_confirmation', 'needs_confirmation', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 10),
  ('city-traders-imperium', 'included', 'CTI Academy', 'Included with every funding program.', 'allowed', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 11),
  ('city-traders-imperium', 'included', 'VIP tools', 'Metrics, journal, calculators, calendar, wallet, direct payouts and an affiliate portal are advertised for funded traders.', 'allowed', 'verified', 'https://citytradersimperium.com/', timestamptz '2026-09-04', 12);


-- 7. CONTROLE
-- Attendu : 4 programmes, 23 plans, 0 promotion(s), 12 regles.
select p.name, pl.phase, pl.account_size, pl.regular_price, pl.profit_target,
       pl.maximum_loss_limit, pl.daily_loss_limit, pl.profit_split, pl.confidence
from firm_program_plans pl join firm_programs p on p.id = pl.program_id
where p.firm_slug = 'city-traders-imperium'
order by p.sort_order, pl.account_size;
