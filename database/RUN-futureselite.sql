-- =============================================================================
-- FUTURESELITE — TOUT EN UN
-- =============================================================================
-- Un seul copier-coller. Aucun prerequis. Toutes les commandes sont
-- idempotentes : rejouable sans casse.
--
-- OU LE COLLER : supabase.com -> ton projet -> SQL Editor -> New query
--                -> coller -> Run.
--
-- Ce fichier remplit AUSSI les colonnes editoriales JSONB (journey, key_rules,
-- program_guide, cost_timeline, verdict_card, pros, cons). Ce sont elles qui
-- donnent son epaisseur a la page : une section disparait quand sa colonne est
-- NULL. Sans elles, la page reste vide meme apres un import reussi.
-- =============================================================================


-- 1. SAUVEGARDE — lis cette sortie avant de continuer
select * from prop_firms where slug = 'futureselite';
select * from prop_firm_challenges where firm_slug = 'futureselite';


-- 2. Colonnes necessaires (sans effet si elles existent deja)
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


-- 3. La firme : identite, contenu editorial, listes
update prop_firms set
  name                 = 'FuturesElite',
  website_url          = 'https://futureselite.com',
  affiliate_url        = 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
  headquarters         = 'Corso G. Matteotti 61, Latina 04100, Italy',
  country              = 'Italy',
  price_currency       = 'USD',
  is_regulated         = false,
  regulation_details   = 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italy, no. 03095010595. No financial regulator licence. Demo accounts, hypothetical performance.',
  profit_split         = 90,
  max_profit_split     = 90,
  min_price            = 95,
  max_price            = 353,
  is_futures           = true,
  drawdown_type        = 'End of day',
  time_limit           = 'No time limit',
  payout_frequency     = 'on demand, daily once funded',
  source_url           = 'https://futureselite.com',
  platforms            = 'Tradovate, NinjaTrader, Quantower, ATAS, Volumetrica, DeepCharts, WealthCharts',
  assets               = '{"Futures"}'::text[],
  included_items       = '{"Trading journal and analytics dashboard","No activation fee on the funded account","Seven platforms to choose from"}'::text[],
  pros                 = '{"90% profit split on the Elite programme","End-of-day drawdown, with no daily loss limit at all","No consistency rule once funded","No activation fee to unlock the funded account","Payouts available every day once funded","Bundle discounts: the fifth account is free"}'::text[],
  cons                 = '{"No financial regulator licence","Demo accounts, hypothetical performance","3 minimum trading days in evaluation, 6 once funded","Per-request payout cap, from $1,000 to $3,000 by account size","The Nitro, Prime and Instant price lists are not public"}'::text[],
  special_features     = '{"90% profit split on the Elite programme","End-of-day drawdown, no daily loss limit","No consistency rule once funded","No activation fee on the funded account","Bundle discounts: the fifth account is free","Instant accounts available, with no evaluation"}'::text[],
  verdict_card         = '{"title":"Who it suits, and who it does not","body":"FuturesElite bets on generous terms once you are funded: a 90% split, no consistency rule, daily payouts. In exchange, the firm is young, unregulated, and publishes only one of its four price lists.","points":["A high split and frequent payouts, with no waiting period","An evaluation with no daily loss limit, which leaves room to breathe","A funded account that opens with no activation fee","The option to stack up to ten accounts in parallel"]}'::jsonb,
  program_guide        = '{"title":"The Elite programme","intro":"Elite is the only programme whose price list is public. Nitro, Prime and Instant exist at checkout, but their prices are not shown.","options":[{"name":"Elite","badge":"Public pricing","summary":"A one-step evaluation, an end-of-day drawdown, no daily loss limit, and a 90% split once funded.","points":["5% profit target","No daily loss limit","3 minimum trading days","No activation fee"]}]}'::jsonb,
  key_rules            = '{"title":"The rules that decide it","intro":"What genuinely sets FuturesElite apart from other futures firms.","rules":[{"title":"No daily loss limit","detail":"Neither during the evaluation nor once funded. Risk is bounded by the Maximum Loss Limit alone, recalculated at the end of each day. That is the firm’s headline argument, not a missing figure."},{"title":"End-of-day drawdown","detail":"The limit updates once a day on the closing balance, not continuously. A position sitting at a floating loss therefore does not trip the limit until the day closes."},{"title":"No consistency rule once funded","detail":"The rule applies during the evaluation and then disappears on the funded account. The sales page shows two figures side by side, 40% and 50%, without saying which applies: to be confirmed with the partner."},{"title":"No activation fee","detail":"Passing the evaluation is enough to open the funded account. Reset fees do exist: $79 to $229 by size."}],"more":["Payouts available every day once funded","6 minimum trading days before a payout","No profit buffer required","Seven platforms to choose from, including Tradovate and NinjaTrader","The fifth account in a bundle is free"]}'::jsonb,
  journey              = '{"title":"What happens after you pay","intro":"A single evaluation step, then the funded account opens immediately.","steps":[{"title":"Evaluation","detail":"Hit the profit target without breaching the Maximum Loss Limit, across at least 3 trading days. No time limit."},{"title":"Funded account","detail":"Opened as soon as you pass, with no activation fee. The consistency rule disappears at this stage."},{"title":"Payouts","detail":"Available every day, after 6 trading days, within the per-request cap: $1,000 on a 25K, up to $3,000 on a 150K."},{"title":"Stacking accounts","detail":"Elite caps at 5 funded accounts. By stacking a programme of the same size, up to 10 accounts in parallel."}]}'::jsonb,
  cost_timeline        = '{"title":"What you will pay","intro":"The costs do not all land at the same moment.","steps":[{"label":"At purchase","title":"One-off fee","detail":"From $95 for a 25K to $353 for a 150K, before discount. No subscription."},{"label":"On failure","title":"Optional reset","detail":"From $79 on a 25K to $229 on a 150K. Starting over is never compulsory."},{"label":"On passing","title":"No activation fee","detail":"The funded account opens with no further payment."},{"label":"At payout","title":"Per-request cap","detail":"From $1,000 to $3,000 by account size, with 90% for you."}]}'::jsonb,
  translations         = '{"fr":{"headquarters":"Corso G. Matteotti 61, Latina 04100, Italie","regulation_details":"Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italie, n° 03095010595. Aucune licence de régulateur financier. Comptes de démonstration, performances hypothétiques.","drawdown_type":"Fin de journée","time_limit":"Aucune limite de temps","payout_frequency":"sur demande, chaque jour une fois financé","assets":["Futures"],"included_items":["Journal de trading et tableau de bord analytique","Aucun frais d’activation du compte financé","Sept plateformes au choix"],"pros":["Partage des profits à 90 % sur le programme Elite","Drawdown de fin de journée, sans aucune limite de perte journalière","Aucune règle de régularité une fois financé","Aucun frais d’activation pour débloquer le compte financé","Retrait possible chaque jour une fois financé","Remises par lot : le cinquième compte est offert"],"cons":["Aucune licence de régulateur financier","Comptes de démonstration, performances hypothétiques","3 jours de trading minimum en évaluation, 6 une fois financé","Plafond de retrait par demande, de 1 000 à 3 000 $ selon la taille","Les grilles Nitro, Prime et Instant ne sont pas publiques"],"special_features":["Partage des profits à 90 % sur le programme Elite","Drawdown de fin de journée, aucune limite de perte journalière","Aucune règle de régularité une fois financé","Aucun frais d’activation du compte financé","Remises par lot : le cinquième compte est offert","Comptes Instant disponibles, sans évaluation"],"verdict_card":{"title":"Pour qui, et pour qui pas","body":"FuturesElite mise sur des conditions généreuses une fois financé : 90 % de partage, aucune règle de régularité, retrait quotidien. En échange, la firme est jeune, sans régulateur, et ne publie qu’une seule de ses quatre grilles.","points":["Un partage élevé et des retraits fréquents, sans attendre une échéance","Une évaluation sans limite de perte journalière, qui laisse respirer","Un compte financé qui s’ouvre sans frais d’activation","La possibilité d’empiler jusqu’à dix comptes en parallèle"]},"program_guide":{"title":"Le programme Elite","intro":"Elite est le seul programme dont la grille tarifaire est publique. Nitro, Prime et Instant existent à l’achat, mais leurs prix ne sont pas exposés.","options":[{"name":"Elite","badge":"Grille publique","summary":"Une évaluation en une étape, un drawdown de fin de journée, aucune perte journalière, et 90 % de partage une fois financé.","points":["Objectif de 5 % du capital","Aucune limite de perte journalière","3 jours de trading minimum","Aucun frais d’activation"]}]},"key_rules":{"title":"Les règles qui décident","intro":"Ce qui distingue vraiment FuturesElite des autres firmes futures.","rules":[{"title":"Aucune limite de perte journalière","detail":"Ni pendant l’évaluation, ni une fois financé. Le risque est encadré par la seule Maximum Loss Limit, recalculée en fin de journée. C’est l’argument principal de la firme, pas une donnée manquante."},{"title":"Drawdown de fin de journée","detail":"La limite se met à jour une fois par jour sur le solde de clôture, pas en continu. Une position en perte latente ne déclenche donc pas la limite tant que la journée n’est pas close."},{"title":"Aucune règle de régularité une fois financé","detail":"La règle s’applique pendant l’évaluation puis disparaît sur le compte financé. La page de vente affiche deux valeurs côte à côte, 40 % et 50 %, sans préciser laquelle s’applique : à confirmer auprès du partenaire."},{"title":"Aucun frais d’activation","detail":"Passer l’évaluation suffit à ouvrir le compte financé. Les frais de reset, eux, existent : de 79 à 229 $ selon la taille."}],"more":["Retrait possible chaque jour une fois financé","6 jours de trading minimum avant un retrait","Aucun buffer de profit exigé","Sept plateformes au choix, dont Tradovate et NinjaTrader","Le cinquième compte d’un lot est offert"]},"journey":{"title":"Ce qui se passe après le paiement","intro":"Une seule étape d’évaluation, puis le compte financé s’ouvre immédiatement.","steps":[{"title":"Évaluation","detail":"Atteindre l’objectif de profit sans franchir la Maximum Loss Limit, sur au moins 3 jours de trading. Aucune limite de temps."},{"title":"Compte financé","detail":"Ouvert dès la validation, sans frais d’activation. La règle de régularité disparaît à ce stade."},{"title":"Retraits","detail":"Possibles chaque jour, après 6 jours de trading, dans la limite du plafond par demande : 1 000 $ sur un 25K, jusqu’à 3 000 $ sur un 150K."},{"title":"Cumul de comptes","detail":"Elite plafonne à 5 comptes financés. En empilant un programme de même taille, jusqu’à 10 comptes en parallèle."}]},"cost_timeline":{"title":"Ce que vous paierez","intro":"Les coûts n’arrivent pas tous au même moment.","steps":[{"label":"À l’achat","title":"Frais unique","detail":"De 95 $ pour un 25K à 353 $ pour un 150K, hors remise. Aucun abonnement."},{"label":"En cas d’échec","title":"Reset optionnel","detail":"De 79 $ sur un 25K à 229 $ sur un 150K. Reprendre à zéro n’est jamais obligatoire."},{"label":"À la validation","title":"Aucun frais d’activation","detail":"Le compte financé s’ouvre sans paiement supplémentaire."},{"label":"Au retrait","title":"Plafond par demande","detail":"De 1 000 à 3 000 $ selon la taille du compte, avec 90 % pour vous."}]}}}'::jsonb,
  data_verified_at     = timestamptz '2026-09-03',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'futureselite';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
-- Pas de begin/commit : l editeur SQL de Supabase enveloppe deja le
-- script dans sa propre transaction. Un begin explicite a l interieur
-- peut faire echouer l ensemble sans message clair.

delete from prop_firm_challenges where firm_slug = 'futureselite';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'futureselite-elite-25k', 'Elite $25K', 'FuturesElite', 'futureselite', '$25K', '1 step', 1000, null, 1250, null, 'Fin de journée', 'Trailing', 90, 95, null, 'Once funded: 90% split, $1,000 payout cap, payouts available daily, 6 minimum trading days, no buffer. Reset $79.', 'Evaluation: 3 minimum trading days and a consistency rule. No consistency rule once funded. No daily loss limit. No activation fee.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-50k', 'Elite $50K', 'FuturesElite', 'futureselite', '$50K', '1 step', 2000, null, 3000, null, 'Fin de journée', 'Trailing', 90, 153, null, 'Once funded: 90% split, $2,000 payout cap, payouts available daily, 6 minimum trading days, no buffer. Reset $89.', 'Evaluation: 3 minimum trading days and a consistency rule. No consistency rule once funded. No daily loss limit. No activation fee.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-100k', 'Elite $100K', 'FuturesElite', 'futureselite', '$100K', '1 step', 3000, null, 6000, null, 'Fin de journée', 'Trailing', 90, 293, null, 'Once funded: 90% split, $2,500 payout cap, payouts available daily, 6 minimum trading days, no buffer. Reset $159.', 'Evaluation: 3 minimum trading days and a consistency rule. No consistency rule once funded. No daily loss limit. No activation fee.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-150k', 'Elite $150K', 'FuturesElite', 'futureselite', '$150K', '1 step', 4500, null, 9000, null, 'Fin de journée', 'Trailing', 90, 353, null, 'Once funded: 90% split, $3,000 payout cap, payouts available daily, 6 minimum trading days, no buffer. Reset $229.', 'Evaluation: 3 minimum trading days and a consistency rule. No consistency rule once funded. No daily loss limit. No activation fee.', true, true, true, 'one-time', 'usd');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       cardinality(pros) as nb_pros,
       ((translations -> 'fr') is not null) as a_une_traduction_fr
from prop_firms where slug = 'futureselite';

-- Attendu : 4 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'futureselite' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- LE CODE PROMO. SCANNED donne −20 %, confirmé par e-mail par
-- FuturesElite. Mais un coupon SUMMER s’active seul et donne −25 % : sur
-- l’Elite 25K, 71,25 $ contre 76,00 $. Annoncer le code ferait payer plus
-- cher. discount_code et discount_percent restent nuls, l’UPDATE est
-- préparé en commentaire.
--
-- NITRO, PRIME, INSTANT. Les trois programmes existent mais leur grille
-- est derrière une authentification. Ils ne figurent pas dans
-- program_guide : une option sans prix ni challenge donne un bouton mort
-- dans le configurateur. Nitro : paiements quotidiens, pas de perte
-- journalière. Prime : le moins cher, jusqu’à 10 comptes, 1,5 M$ cumulés.
-- Instant : aucune évaluation, 80 % de partage.
--
-- RÈGLE DE RÉGULARITÉ. La page affiche 40 % et 50 % côte à côte sans dire
-- laquelle s’applique. Décrite en toutes lettres, sans chiffre inventé.
--
-- LE LOGO. logo_url pointe encore sur une favicon Google. Leur équipe
-- indique de prendre le logo sur leur profil X. À télécharger dans
-- public/logos/futureselite.png puis mettre à jour logo_url.
--
-- TRUSTPILOT. Les compteurs de leur page d’accueil affichent tous zéro.
-- trustpilot_rating laissé tel quel plutôt que d’écrire un zéro trompeur.
--
-- PRÉSÉLECTION DU PLAN PAR URL. Leur application ne lit que aff, ref,
-- coupon et type. Aucun paramètre de taille. Le lien préremplit
-- l’affiliation et le coupon ; le visiteur choisit son plan sur place.
