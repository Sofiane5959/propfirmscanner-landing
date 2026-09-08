# Matrice de dependances des colonnes `prop_firms`

Genere par `node scripts/column-dependency-audit.mjs`. Ne pas editer a la main.

`STATUT` : **BLOQUE** = au moins une surface de production la lit encore.
`LIBRE` = plus aucun lecteur de production ; la depreciation peut etre planifiee.

| Colonne | Lecteurs | Ecrivains | Remplacement canonique | Statut |
|---|---|---|---|---|
| `profit_split` | script / seed (67), SQL (36), /compare (15), fiche firme (15), lib (12), composant partage (10), autre (4), /best-for (2) | SQL (17), script / seed (3) | firm_program_plans.profit_split | **BLOQUE** |
| `max_profit_split` | /compare (20), SQL (16), autre (9), script / seed (9), fiche firme (7), composant partage (6), dashboard (4), /deals (4), admin (2), /best-for (2) | SQL (4), admin (1) | firm_program_plans.profit_split (max) | **BLOQUE** |
| `min_price` | /compare (25), fiche firme (19), script / seed (18), composant partage (15), lib (9), autre (8), SQL (6), dashboard (4), /deals (4), /best-for (3), admin (2) | SQL (5), admin (1) | firm_program_plans.regular_price (min) | **BLOQUE** |
| `max_price` | script / seed (6), fiche firme (4), SQL (1), autre (1) | SQL (4) | firm_program_plans.regular_price (max) | **BLOQUE** |
| `account_sizes` | script / seed (2), fiche firme (1), lib (1), autre (1) | — | firm_program_plans.account_size | **BLOQUE** |
| `drawdown_type` | script / seed (96), SQL (12), composant partage (6), lib (6), fiche firme (4), /compare (3) | SQL (15) | firm_program_plans.drawdown_type | **BLOQUE** |
| `consistency_rule` | script / seed (57), SQL (12), lib (12), fiche firme (3), composant partage (3), /compare (1), dashboard (1) | SQL (7) | firm_program_plans.consistency_rule | **BLOQUE** |
| `min_trading_days` | composant partage (38), /compare (5), SQL (5), lib (3), script / seed (2), fiche firme (1), autre (1) | SQL (6) | firm_program_plans.minimum_trading_days | **BLOQUE** |
| `max_trading_days` | script / seed (2), SQL (1), autre (1) | — | firm_program_plans.minimum_trading_days | LIBRE |
| `profit_target_phase1` | /compare (4), composant partage (3), lib (2), script / seed (2), SQL (1), autre (1) | SQL (2) | firm_program_plans.profit_target (evaluation) | **BLOQUE** |
| `profit_target_phase2` | /compare (4), composant partage (2), script / seed (2), SQL (1), autre (1) | SQL (2) | firm_program_plans.profit_target (evaluation_2) | **BLOQUE** |
| `max_daily_drawdown` | /compare (7), lib (6), composant partage (5), script / seed (2), autre (1) | — | firm_program_plans.daily_loss_limit | **BLOQUE** |
| `max_total_drawdown` | composant partage (9), /compare (5), lib (3), script / seed (2), autre (1) | — | firm_program_plans.maximum_loss_limit | **BLOQUE** |
| `reset_fee` | script / seed (25), SQL (6), lib (3), fiche firme (2) | SQL (2) | firm_program_plans.reset_fee | **BLOQUE** |
| `scaling_max` | fiche firme (5), SQL (4), /compare (3), script / seed (2) | SQL (1) | firm_live_tiers | **BLOQUE** |
| `progression_tiers` | fiche firme (2), script / seed (2) | — | firm_live_tiers | **BLOQUE** |
| `max_allocation` | script / seed (16), fiche firme (4), SQL (3) | SQL (6) | firm_live_tiers.conversion_cap | **BLOQUE** |
| `min_payout` | fiche firme (4), script / seed (2), SQL (1), lib (1), autre (1) | SQL (1) | firm_program_plans.minimum_payout | **BLOQUE** |
| `payout_speed_days` | fiche firme (2), script / seed (2) | — | firm_rules (scope payout) | **BLOQUE** |
| `payout_speed_label` | fiche firme (2), script / seed (2) | — | firm_rules (scope payout) | **BLOQUE** |
| `time_limit` | script / seed (41), fiche firme (2), lib (2), /compare (1), SQL (1) | SQL (11) | firm_rules (scope account) | **BLOQUE** |
| `commissions` | autre (8), script / seed (5), fiche firme (2), composant partage (2), dashboard (1) | SQL (4) | firm_rules (scope live) | **BLOQUE** |
| `refund_policy` | fiche firme (4), script / seed (2) | SQL (1) | firm_rules (scope account) | **BLOQUE** |
| `fee_refund` | /compare (7), autre (5), admin (2), script / seed (2) | — | firm_rules (scope account) | **BLOQUE** |
| `swap_free` | fiche firme (2), script / seed (2) | — | firm_rules (scope conduct) | **BLOQUE** |
| `leverage_forex` | fiche firme (3), SQL (3), script / seed (3) | SQL (1) | sans objet sur une firme futures | **BLOQUE** |
| `instruments` | /best-for (3), autre (3), /compare (2), script / seed (2) | — | prop_firms.assets | **BLOQUE** |
| `challenge_types` | /compare (5), dashboard (3), autre (3), script / seed (2), /best-for (1), lib (1) | — | firm_programs.kind | **BLOQUE** |
| `platforms_list` | /compare (3), fiche firme (3), script / seed (2) | — | firm_platforms | **BLOQUE** |
| `special_features` | script / seed (31), /compare (1) | SQL (8) | prop_firms.pros (editorial) | **BLOQUE** |
| `highlights` | lib (3), script / seed (2) | — | prop_firms.pros (editorial) | LIBRE |
| `education` | autre (15), composant partage (11), fiche firme (6), route API (3), script / seed (3), dashboard (2), lib (1) | — | firm_rules ou editorial | **BLOQUE** |
| `cost_timeline` | script / seed (25), SQL (8), fiche firme (2) | SQL (6) | firm_program_plans (frais) | **BLOQUE** |
| `program_guide` | script / seed (33), fiche firme (3), SQL (1) | SQL (8) | firm_programs.summary | **BLOQUE** |
| `proof_stats` | SQL (5), script / seed (3), fiche firme (2) | — | editorial, a re-sourcer | **BLOQUE** |
| `value_strip` | script / seed (4), fiche firme (2), SQL (2) | SQL (1), script / seed (1) | derive par universalFact() | **BLOQUE** |
| `included_items` | script / seed (31), fiche firme (2) | SQL (8) | firm_platforms + firm_rules | **BLOQUE** |
| `discount_code` | script / seed (18), /deals (16), SQL (14), composant partage (8), /compare (5), fiche firme (5), route API (2), autre (2), lib (2), admin (1) | SQL (3), admin (1), script / seed (1) | firm_promotions.code | **BLOQUE** |
| `discount_percent` | /deals (20), script / seed (15), SQL (14), composant partage (13), /compare (12), lib (7), fiche firme (6), autre (6), admin (1) | SQL (4), script / seed (2), admin (1) | firm_promotions.discount_value | **BLOQUE** |
| `discount_note` | fiche firme (3), script / seed (3), lib (2) | — | firm_promotions.editorial_note | **BLOQUE** |
| `discount_expires_at` | SQL (7), fiche firme (6), script / seed (5), /deals (2), lib (2) | — | firm_promotions.expires_at | **BLOQUE** |
| `platforms` | /compare (26), script / seed (24), fiche firme (20), composant partage (19), lib (19), autre (8), SQL (8), /best-for (1) | SQL (6) | firm_platforms | **BLOQUE** |
| `payout_methods` | script / seed (26), SQL (9), lib (3), fiche firme (2), autre (1) | SQL (8) | firm_payment_methods (flow=payout) | **BLOQUE** |
| `payout_frequency` | script / seed (35), fiche firme (5), /compare (3), lib (3), composant partage (2), SQL (2), autre (1) | SQL (9) | firm_program_plans.days_between_payouts | **BLOQUE** |
| `key_rules` | script / seed (35), SQL (8), lib (3), fiche firme (2) | SQL (8) | firm_rules (severite) | **BLOQUE** |
| `journey` | script / seed (34), fiche firme (9), SQL (7), autre (6), lib (4), /best-for (1), dashboard (1) | SQL (8) | firm_program_plans.phase (derive) | **BLOQUE** |
| `founded` | fiche firme (17), lib (5), script / seed (4), composant partage (1) | — | prop_firms.founded (a unifier) | **BLOQUE** |
| `founded_year` | script / seed (5), fiche firme (3), lib (3), SQL (1), autre (1) | SQL (5) | prop_firms.founded (a unifier) | **BLOQUE** |
| `year_founded` | fiche firme (4), lib (3), script / seed (2), /compare (1) | — | prop_firms.founded (a unifier) | **BLOQUE** |
| `has_mt4` | fiche firme (2), script / seed (1) | — | firm_platforms | **BLOQUE** |
| `has_mt5` | fiche firme (2), script / seed (1) | — | firm_platforms | **BLOQUE** |
| `has_ctrader` | fiche firme (2), script / seed (1) | — | firm_platforms | **BLOQUE** |
| `has_tradingview` | fiche firme (2), script / seed (1) | — | firm_platforms | **BLOQUE** |
| `has_match_trader` | fiche firme (2), script / seed (1) | — | firm_platforms | **BLOQUE** |
| `has_dxtrade` | fiche firme (2), script / seed (1) | — | firm_platforms | **BLOQUE** |
| `has_tradelocker` | fiche firme (2), script / seed (1) | — | firm_platforms | **BLOQUE** |
| `has_instant_funding` | /compare (10), autre (5), composant partage (5), admin (2), script / seed (2) | — | firm_programs.kind | **BLOQUE** |
| `has_consistency_rule` | script / seed (2), SQL (1) | SQL (2) | firm_program_plans.consistency_rule | LIBRE |
| `has_scaling` | script / seed (2), SQL (1) | — | firm_live_tiers | LIBRE |
| `allows_scalping` | /compare (12), lib (9), autre (6), composant partage (6), fiche firme (4), admin (2), script / seed (2), /best-for (1), SQL (1) | SQL (4) | firm_rules (scope conduct) | **BLOQUE** |
| `allows_news_trading` | /compare (11), lib (9), composant partage (6), autre (5), fiche firme (3), admin (2), script / seed (2), /best-for (1), SQL (1) | SQL (4) | firm_rules (scope conduct) | **BLOQUE** |
| `allows_weekend_holding` | /compare (6), lib (6), autre (4), composant partage (4), /best-for (1), fiche firme (1), script / seed (1) | — | firm_rules (scope conduct) | **BLOQUE** |
| `allows_hedging` | /compare (1), script / seed (1), autre (1) | — | firm_rules (scope conduct) | **BLOQUE** |
| `allows_ea` | /compare (11), lib (8), composant partage (6), autre (5), fiche firme (3), admin (2), SQL (2), script / seed (2), /best-for (1) | SQL (4) | firm_rules (scope conduct) | **BLOQUE** |
| `current_promo_code` | script / seed (2), autre (1) | — | firm_promotions.code | LIBRE |
| `current_promo_discount` | script / seed (2), autre (1) | — | firm_promotions.discount_value | LIBRE |
| `discount_is_automatic` | script / seed (2) | — | firm_promotions.is_public | LIBRE |
| `discount_status` | SQL (7), script / seed (5) | SQL (1) | firm_promotions.status | LIBRE |
| `discount_starts_at` | SQL (5), script / seed (3), lib (2) | — | firm_promotions.starts_at | LIBRE |

**60 colonnes bloquees, 9 libres** sur 69 auditees.

Une colonne LIBRE n'est pas supprimable pour autant : elle peut etre lue
par du code non couvert par cet audit (SQL ad hoc, tableaux de bord externes,
exports). Elle est seulement candidate a l'arret d'ecriture.
