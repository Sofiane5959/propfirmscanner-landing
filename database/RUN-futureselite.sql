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


-- 3. La firme : identite, contenu editorial, listes
update prop_firms set
  name                 = 'FuturesElite',
  website_url          = 'https://futureselite.com',
  affiliate_url        = 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
  headquarters         = 'Corso G. Matteotti 61, Latina 04100, Italie',
  country              = 'Italy',
  price_currency       = 'USD',
  is_regulated         = false,
  regulation_details   = 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italie, n 03095010595. Aucune licence de regulateur financier. Comptes de demonstration, performances hypothetiques.',
  profit_split         = 90,
  min_price            = 95,
  max_price            = 353,
  is_futures           = true,
  drawdown_type        = 'End of Day',
  time_limit           = 'Aucune limite de temps',
  payout_frequency     = 'on-demand',
  source_url           = 'https://futureselite.com',
  platforms            = '["Tradovate","NinjaTrader","Quantower","ATAS","Volumetrica","DeepCharts","WealthCharts"]',
  assets               = '["Futures"]',
  included_items       = '["Journal et tableau de bord analytique inclus","Aucun frais d activation","Sept plateformes au choix"]',
  pros                 = '["Partage des profits a 90 % sur le programme Elite","Drawdown de fin de journee, aucune limite de perte journaliere","Aucune regle de regularite une fois finance","Aucun frais d activation pour debloquer le compte finance","Retrait possible chaque jour une fois finance","Remises par lot : le cinquieme compte est offert"]',
  cons                 = '["Aucune licence de regulateur financier","Comptes de demonstration, performances hypothetiques","3 jours de trading minimum en evaluation, 6 une fois finance","Plafond de retrait par demande, de 1 000 a 3 000 $ selon la taille","Les grilles NITRO, PRIME et INSTANT ne sont pas publiques"]',
  special_features     = '["90% profit split on the Elite programme","End-of-day drawdown, no daily loss limit","No consistency rule once funded","No activation fee to unlock the funded account","Bundle discounts: the fifth account is free","Instant accounts available with no evaluation"]',
  verdict_card         = '{"title":"Pour qui, et pour qui pas","body":"FuturesElite mise sur des conditions genereuses une fois finance : 90 % de partage, pas de regle de regularite, retrait quotidien. En echange, la firme est jeune et sans regulateur.","points":["Convient si vous voulez un partage eleve et des retraits frequents","Convient si l''absence de limite de perte journaliere vous laisse respirer","Evitez si vous tenez a une firme regulee ou a un historique long","Evitez si vous avez besoin de connaitre toutes les grilles avant d acheter"]}',
  program_guide        = '{"title":"Quatre programmes","intro":"Seul Elite a une grille publique. Les trois autres sont visibles a l''achat mais leurs prix ne sont pas exposes.","options":[{"name":"ELITE","badge":"Grille publique","summary":"Une evaluation en une etape, drawdown de fin de journee, aucune perte journaliere, 90 % de partage une fois finance.","points":["Objectif de 5 % du capital","Aucune limite de perte journaliere","3 jours de trading minimum","Aucun frais d activation"]},{"name":"PRIME","badge":"Le moins cher","summary":"Presente comme la voie d''entree la moins chere, avec jusqu a 10 comptes groupes et 1,5 M$ de capital cumule.","points":["Jusqu a 10 comptes groupes","Validation possible en un jour","Grille tarifaire non publique"]}]}',
  key_rules            = '{"title":"Les regles qui decident","intro":"Ce qui distingue vraiment FuturesElite des autres firmes futures.","rules":[{"title":"Aucune limite de perte journaliere","detail":"Ni en evaluation ni une fois finance. Le risque est encadre par la seule Maximum Loss Limit, recalculee en fin de journee."},{"title":"Drawdown de fin de journee","detail":"La limite se met a jour une fois par jour sur le solde de cloture, pas en continu. Une position en perte latente ne declenche pas la limite tant que la journee n est pas close."},{"title":"Aucune regle de regularite une fois finance","detail":"La regle s applique pendant l evaluation, puis disparait sur le compte finance. La page affiche deux valeurs cote a cote, 40 % et 50 %, sans preciser laquelle s applique : a confirmer aupres du partenaire."},{"title":"Aucun frais d activation","detail":"Passer l evaluation suffit a ouvrir le compte finance. Les frais de reset, eux, existent : de 79 a 229 $ selon la taille."}],"more":["Retrait possible chaque jour une fois finance","6 jours de trading minimum avant un retrait","Aucun buffer de profit","Sept plateformes au choix","Le cinquieme compte d un lot est offert"]}',
  journey              = '{"title":"Ce qui se passe apres le paiement","intro":"Une seule etape d''evaluation, puis le compte finance s''ouvre immediatement.","steps":[{"title":"Evaluation","detail":"Atteindre l''objectif de profit sans franchir la Maximum Loss Limit, sur au moins 3 jours de trading. Aucune limite de temps."},{"title":"Compte finance","detail":"Ouvert des la validation, sans frais d''activation. La regle de regularite disparait a ce stade."},{"title":"Retraits","detail":"Possibles chaque jour, apres 6 jours de trading, dans la limite du plafond par demande : 1 000 $ sur un 25K, jusqu a 3 000 $ sur un 150K."},{"title":"Cumul de comptes","detail":"Elite plafonne a 5 comptes finances. En empilant un programme de meme taille, jusqu a 10 comptes en parallele."}]}',
  cost_timeline        = '{"title":"Ce que vous paierez","intro":"Les couts n arrivent pas tous au meme moment.","steps":[{"label":"A l achat","title":"Frais unique","detail":"De 95 $ pour un 25K a 353 $ pour un 150K, hors remise. Aucun abonnement."},{"label":"En cas d echec","title":"Reset optionnel","detail":"De 79 $ sur un 25K a 229 $ sur un 150K. Reprendre a zero n est jamais obligatoire."},{"label":"A la validation","title":"Aucun frais d activation","detail":"Le compte finance s ouvre sans paiement supplementaire."},{"label":"Au retrait","title":"Plafond par demande","detail":"De 1 000 a 3 000 $ selon la taille du compte, avec 90 % pour vous."}]}',
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
  (gen_random_uuid(), 'futureselite-elite-25k', 'Elite $25K', 'FuturesElite', 'futureselite', '$25K', '1 step', 1000, null, 1250, null, 'End of Day', 'Trailing', 90, 95, null, 'Une fois finance : 90 % de partage, plafond de retrait 1 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 79 $.', 'Evaluation : 3 jours de trading minimum et une regle de regularite. Aucune regle de regularite une fois finance. Aucun frais d activation.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-50k', 'Elite $50K', 'FuturesElite', 'futureselite', '$50K', '1 step', 2000, null, 3000, null, 'End of Day', 'Trailing', 90, 153, null, 'Une fois finance : 90 % de partage, plafond de retrait 2 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 89 $.', 'Evaluation : 3 jours de trading minimum et une regle de regularite. Aucune regle de regularite une fois finance. Aucun frais d activation.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-100k', 'Elite $100K', 'FuturesElite', 'futureselite', '$100K', '1 step', 3000, null, 6000, null, 'End of Day', 'Trailing', 90, 293, null, 'Une fois finance : 90 % de partage, plafond de retrait 2 500 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 159 $.', 'Evaluation : 3 jours de trading minimum et une regle de regularite. Aucune regle de regularite une fois finance. Aucun frais d activation.', true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-150k', 'Elite $150K', 'FuturesElite', 'futureselite', '$150K', '1 step', 4500, null, 9000, null, 'End of Day', 'Trailing', 90, 353, null, 'Une fois finance : 90 % de partage, plafond de retrait 3 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 229 $.', 'Evaluation : 3 jours de trading minimum et une regle de regularite. Aucune regle de regularite une fois finance. Aucun frais d activation.', true, true, true, 'one-time', 'usd');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       jsonb_array_length(pros) as nb_pros
from prop_firms where slug = 'futureselite';

-- Attendu : 4 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'futureselite' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- LE CODE PROMO. SCANNED donne -20 %, confirme par email par FuturesElite.
-- Mais un coupon SUMMER s active seul et donne -25 % : sur l Elite 25K,
-- 71,25 $ contre 76,00 $. Annoncer le code ferait payer plus cher.
-- discount_code et discount_percent restent nuls, l UPDATE est prepare en
-- commentaire.
--
-- NITRO, PRIME, INSTANT. Les trois programmes existent mais leur grille
-- est derriere une authentification. NITRO : paiements quotidiens, pas de
-- perte journaliere. PRIME : le moins cher, jusqu a 10 comptes, 1,5 M$
-- cumules. INSTANT : aucune evaluation, 80 % de partage.
--
-- REGLE DE REGULARITE. La page affiche 40 % et 50 % cote a cote sans dire
-- laquelle s applique. Decrite en toutes lettres, sans chiffre invente.
--
-- LE LOGO. logo_url pointe encore sur une favicon Google. Leur equipe
-- indique de prendre le logo sur leur profil X. A telecharger dans
-- public/logos/futureselite.png puis mettre a jour logo_url.
--
-- TRUSTPILOT. Les compteurs de leur page d accueil affichent tous zero.
-- trustpilot_rating laisse tel quel plutot que d ecrire un zero trompeur.
--
-- PRESELECTION DU PLAN PAR URL. Leur application ne lit que aff, ref,
-- coupon et type. Aucun parametre de taille. Le lien preremplit l
-- affiliation et le coupon ; le visiteur choisit son plan sur place.
