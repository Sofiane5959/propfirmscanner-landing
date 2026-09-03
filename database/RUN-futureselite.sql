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
alter table prop_firms add column if not exists restricted_countries text[];


-- 3. La firme : identite, contenu editorial, listes
update prop_firms set
  name                 = 'FuturesElite',
  website_url          = 'https://futureselite.com',
  affiliate_url        = 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
  headquarters         = 'Corso G. Matteotti 61, Latina 04100, Italie',
  country              = 'Italy',
  price_currency       = 'USD',
  is_regulated         = false,
  regulation_details   = 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italie, n° 03095010595. Aucune licence de régulateur financier. Comptes de démonstration, performances hypothétiques.',
  profit_split         = 90,
  max_profit_split     = 90,
  min_price            = 95,
  max_price            = 353,
  is_futures           = true,
  drawdown_type        = 'Fin de journée',
  time_limit           = 'Aucune limite de temps',
  payout_frequency     = 'on-demand',
  source_url           = 'https://futureselite.com',
  platforms            = '["Tradovate","NinjaTrader","Quantower","ATAS","Volumetrica","DeepCharts","WealthCharts"]',
  assets               = '{"Futures"}'::text[],
  included_items       = '{"Journal de trading et tableau de bord analytique","Aucun frais d’activation du compte financé","Sept plateformes au choix"}'::text[],
  pros                 = '{"Partage des profits à 90 % sur le programme Elite","Drawdown de fin de journée, sans aucune limite de perte journalière","Aucune règle de régularité une fois financé","Aucun frais d’activation pour débloquer le compte financé","Retrait possible chaque jour une fois financé","Remises par lot : le cinquième compte est offert"}'::text[],
  cons                 = '{"Aucune licence de régulateur financier","Comptes de démonstration, performances hypothétiques","3 jours de trading minimum en évaluation, 6 une fois financé","Plafond de retrait par demande, de 1 000 à 3 000 $ selon la taille","Les grilles Nitro, Prime et Instant ne sont pas publiques"}'::text[],
  special_features     = '{"Partage des profits à 90 % sur le programme Elite","Drawdown de fin de journée, aucune limite de perte journalière","Aucune règle de régularité une fois financé","Aucun frais d’activation du compte financé","Remises par lot : le cinquième compte est offert","Comptes Instant disponibles, sans évaluation"}'::text[],
  verdict_card         = '{"title":"Pour qui, et pour qui pas","body":"FuturesElite mise sur des conditions généreuses une fois financé : 90 % de partage, aucune règle de régularité, retrait quotidien. En échange, la firme est jeune, sans régulateur, et ne publie qu’une seule de ses quatre grilles.","points":["Un partage élevé et des retraits fréquents, sans attendre une échéance","Une évaluation sans limite de perte journalière, qui laisse respirer","Un compte financé qui s’ouvre sans frais d’activation","La possibilité d’empiler jusqu’à dix comptes en parallèle"]}'::jsonb,
  program_guide        = '{"title":"Le programme Elite","intro":"Elite est le seul programme dont la grille tarifaire est publique. Nitro, Prime et Instant existent à l’achat, mais leurs prix ne sont pas exposés.","options":[{"name":"Elite","badge":"Grille publique","summary":"Une évaluation en une étape, un drawdown de fin de journée, aucune perte journalière, et 90 % de partage une fois financé.","points":["Objectif de 5 % du capital","Aucune limite de perte journalière","3 jours de trading minimum","Aucun frais d’activation"]}]}'::jsonb,
  key_rules            = '{"title":"Les règles qui décident","intro":"Ce qui distingue vraiment FuturesElite des autres firmes futures.","rules":[{"title":"Aucune limite de perte journalière","detail":"Ni pendant l’évaluation, ni une fois financé. Le risque est encadré par la seule Maximum Loss Limit, recalculée en fin de journée. C’est l’argument principal de la firme, pas une donnée manquante."},{"title":"Drawdown de fin de journée","detail":"La limite se met à jour une fois par jour sur le solde de clôture, pas en continu. Une position en perte latente ne déclenche donc pas la limite tant que la journée n’est pas close."},{"title":"Aucune règle de régularité une fois financé","detail":"La règle s’applique pendant l’évaluation puis disparaît sur le compte financé. La page de vente affiche deux valeurs côte à côte, 40 % et 50 %, sans préciser laquelle s’applique : à confirmer auprès du partenaire."},{"title":"Aucun frais d’activation","detail":"Passer l’évaluation suffit à ouvrir le compte financé. Les frais de reset, eux, existent : de 79 à 229 $ selon la taille."}],"more":["Retrait possible chaque jour une fois financé","6 jours de trading minimum avant un retrait","Aucun buffer de profit exigé","Sept plateformes au choix, dont Tradovate et NinjaTrader","Le cinquième compte d’un lot est offert"]}'::jsonb,
  journey              = '{"title":"Ce qui se passe après le paiement","intro":"Une seule étape d’évaluation, puis le compte financé s’ouvre immédiatement.","steps":[{"title":"Évaluation","detail":"Atteindre l’objectif de profit sans franchir la Maximum Loss Limit, sur au moins 3 jours de trading. Aucune limite de temps."},{"title":"Compte financé","detail":"Ouvert dès la validation, sans frais d’activation. La règle de régularité disparaît à ce stade."},{"title":"Retraits","detail":"Possibles chaque jour, après 6 jours de trading, dans la limite du plafond par demande : 1 000 $ sur un 25K, jusqu’à 3 000 $ sur un 150K."},{"title":"Cumul de comptes","detail":"Elite plafonne à 5 comptes financés. En empilant un programme de même taille, jusqu’à 10 comptes en parallèle."}]}'::jsonb,
  cost_timeline        = '{"title":"Ce que vous paierez","intro":"Les coûts n’arrivent pas tous au même moment.","steps":[{"label":"À l’achat","title":"Frais unique","detail":"De 95 $ pour un 25K à 353 $ pour un 150K, hors remise. Aucun abonnement."},{"label":"En cas d’échec","title":"Reset optionnel","detail":"De 79 $ sur un 25K à 229 $ sur un 150K. Reprendre à zéro n’est jamais obligatoire."},{"label":"À la validation","title":"Aucun frais d’activation","detail":"Le compte financé s’ouvre sans paiement supplémentaire."},{"label":"Au retrait","title":"Plafond par demande","detail":"De 1 000 à 3 000 $ selon la taille du compte, avec 90 % pour vous."}]}'::jsonb,
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
  (gen_random_uuid(), 'futureselite-elite-25k', 'Elite $25K', 'FuturesElite', 'futureselite', '$25K', '1 step', 1000, null, 1250, null, 'Fin de journée', 'Trailing', 90, 95, null, 'Une fois financé : 90 % de partage, plafond de retrait 1 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 79 $.', 'Évaluation : 3 jours de trading minimum et une règle de régularité. Aucune règle de régularité une fois financé. Aucune limite de perte journalière. Aucun frais d’activation.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-50k', 'Elite $50K', 'FuturesElite', 'futureselite', '$50K', '1 step', 2000, null, 3000, null, 'Fin de journée', 'Trailing', 90, 153, null, 'Une fois financé : 90 % de partage, plafond de retrait 2 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 89 $.', 'Évaluation : 3 jours de trading minimum et une règle de régularité. Aucune règle de régularité une fois financé. Aucune limite de perte journalière. Aucun frais d’activation.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-100k', 'Elite $100K', 'FuturesElite', 'futureselite', '$100K', '1 step', 3000, null, 6000, null, 'Fin de journée', 'Trailing', 90, 293, null, 'Une fois financé : 90 % de partage, plafond de retrait 2 500 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 159 $.', 'Évaluation : 3 jours de trading minimum et une règle de régularité. Aucune règle de régularité une fois financé. Aucune limite de perte journalière. Aucun frais d’activation.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-150k', 'Elite $150K', 'FuturesElite', 'futureselite', '$150K', '1 step', 4500, null, 9000, null, 'Fin de journée', 'Trailing', 90, 353, null, 'Une fois financé : 90 % de partage, plafond de retrait 3 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 229 $.', 'Évaluation : 3 jours de trading minimum et une règle de régularité. Aucune règle de régularité une fois financé. Aucune limite de perte journalière. Aucun frais d’activation.', true, true, true, 'one-time', 'usd');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       cardinality(pros) as nb_pros
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
