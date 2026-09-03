-- =============================================================================
-- FTMO — TOUT EN UN
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
select * from prop_firms where slug = 'ftmo';
select * from prop_firm_challenges where firm_slug = 'ftmo';


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
  name                 = 'FTMO',
  founded_year         = 2015,
  headquarters         = 'Bureaux Quadrio, Purkyňova 2121/3, 110 00 Prague, République tchèque',
  country              = 'Czech Republic',
  price_currency       = 'EUR',
  is_regulated         = false,
  regulation_details   = 'FTMO Evaluation Global s.r.o. ; l’entité contractante peut varier selon la région. Ni courtier ni entreprise d’investissement : le service repose sur des comptes simulés et n’accepte aucun dépôt de client.',
  trustpilot_rating    = 4.8,
  min_price            = 79,
  max_price            = 1080,
  profit_split         = 80,
  max_profit_split     = 90,
  max_allocation       = 'Jusqu’à 400 000 $ d’allocation initiale, et jusqu’à 2 000 000 $ via le plan de scaling',
  is_futures           = false,
  drawdown_type        = 'Perte journalière calculée sur l’equity et remise à zéro à minuit CE(S)T. Drawdown global glissant en fin de journée sur le 1-Step, verrouillé une fois arrivé au solde de départ ; fixe sur le 2-Step.',
  time_limit           = 'Aucune limite de temps, sur les deux produits',
  payout_frequency     = 'sur demande, au plus tôt 14 jours après le premier trade',
  source_url           = 'https://ftmo.com/en/trading-objectives/',
  platforms            = 'MetaTrader 4, MetaTrader 5, cTrader, TradingView',
  assets               = '{"CFD sur forex","Métaux","Indices","Énergie","Crypto","Matières premières","CFD sur actions"}'::text[],
  payout_methods       = '{"Virement bancaire","Autres moyens affichés dans l’espace client, selon disponibilité"}'::text[],
  included_items       = '{"MetaTrader 4, MetaTrader 5, cTrader et TradingView","Tableau de bord FTMO et métriques de performance","Aucun frais d’activation du compte financé"}'::text[],
  pros                 = '{"En activité depuis 2015, l’un des plus longs historiques du secteur","Partage de 90 % sur le 1-Step, le plus élevé des deux produits","Aucune limite de temps, ni sur le 1-Step ni sur le 2-Step","Le 1-Step n’impose aucun jour de trading minimum fixe","Sur le 2-Step, les frais sont remboursés à 100 % avec la première récompense","Le compte Swing lève les restrictions d’actualités, de nuit et de week-end","Allocation jusqu’à 400 000 $, et jusqu’à 2 000 000 $ via le plan de scaling","Prix en euros, à partir de 79 €"}'::text[],
  cons                 = '{"Aucun reset : après un échec, il faut racheter un challenge entier","Le remboursement des frais n’est pas annoncé sur le 1-Step","Le 1-Step serre la limite journalière à 3 % et utilise un drawdown glissant","Le 2-Step exige 4 jours de trading dans chaque phase","Le compte financé Standard restreint les annonces, la nuit et le week-end","Swing n’existe pas sur le 1-Step et plafonne le levier à 1:30","Le Swing ne propose pas de compte 200K"}'::text[],
  special_features     = '{"Deux produits aux règles réellement différentes","1-Step : perte journalière de 3 %, drawdown glissant verrouillé au solde de départ","2-Step : perte journalière de 5 %, drawdown fixe","La règle du meilleur jour ne s’applique qu’au 1-Step","Levier jusqu’à 1:100 en Standard, 1:30 en Swing","Plan de scaling : +25 % de solde tous les 4 mois, sur le 2-Step uniquement","Aucune obligation de stop-loss","Paiement par carte, virement, PayPal, Skrill, crypto et Revolut Pay ; Apple Pay et Google Pay selon disponibilité"}'::text[],
  verdict_card         = '{"title":"Pour qui, et pour qui pas","body":"FTMO vend deux produits qu’il faut distinguer avant d’acheter. Le 1-Step paie mieux — 90 % — et n’impose pas de calendrier, mais serre la vis au quotidien. Le 2-Step paie 80 %, laisse plus de marge chaque jour, et rembourse les frais à la première récompense.","points":["Le meilleur partage sans condition : 90 % dès la première récompense sur le 1-Step","Récupérer le prix du challenge : le 2-Step le rembourse à 100 % avec la première récompense","Une limite journalière confortable : 5 % sur le 2-Step, contre 3 % sur le 1-Step","La liberté de garder vos positions la nuit et le week-end, avec le compte Swing","Une allocation qui monte à 2 000 000 $ via le plan de scaling"]}'::jsonb,
  program_guide        = '{"title":"Trois parcours, trois compromis","intro":"Les trois mènent à un compte financé. Le choix se joue sur le partage, le calendrier et la liberté de tenir vos positions.","options":[{"name":"1-Step","badge":"Une seule phase","summary":"Le partage le plus élevé, 90 %, et aucun jour minimum. En échange, une limite journalière de 3 % et un drawdown qui suit vos plus hauts.","points":["Objectif de 10 %, partage de 90 %","Perte journalière de 3 %","Drawdown glissant, verrouillé au solde de départ","Meilleur jour ≤ 50 % du profit des jours positifs","De 79 € (10K) à 999 € (200K)"]},{"name":"2-Step Standard","badge":"Deux phases","summary":"Objectif de 10 % puis 5 %, une limite journalière plus large à 5 % et un drawdown fixe. Les frais sont remboursés avec la première récompense.","points":["Objectif de 10 % puis 5 %, partage de 80 %","Perte journalière de 5 %, drawdown fixe","4 jours de trading minimum par phase","Frais remboursés à 100 % à la première récompense","De 89 € (10K) à 1 080 € (200K)"]},{"name":"2-Step Swing","badge":"Positions tenues","summary":"Les règles du 2-Step, sans aucune restriction d’actualités, de nuit ni de week-end, y compris une fois financé. Le levier tombe à 1:30 et le 200K n’existe pas.","points":["Mêmes objectifs et mêmes limites que le 2-Step Standard","Annonces, nuit et week-end libres, même sur le compte financé","Levier plafonné à 1:30","De 99 € (10K) à 599 € (100K)"]}]}'::jsonb,
  key_rules            = '{"title":"Les règles qui décident","intro":"Cinq points que la plupart des comparateurs rapportent mal.","rules":[{"title":"Le partage dépend du produit","detail":"90 % sur le 1-Step, sans condition. 80 % sur le 2-Step, porté à 90 % via le plan de scaling. Les pages qui annoncent « jusqu’à 90 % » pour toute la gamme masquent le fait que le 1-Step y arrive d’emblée."},{"title":"Les frais ne sont remboursés que sur le 2-Step","detail":"Le 2-Step rembourse 100 % du prix du challenge avec la première récompense. Sur le 1-Step, FTMO n’annonce pas de remboursement. À prix affiché plus bas, le 1-Step revient donc plus cher une fois financé."},{"title":"La perte journalière diffère, et se calcule sur l’equity","detail":"3 % sur le 1-Step, 5 % sur le 2-Step. Elle porte sur l’equity — donc pertes latentes, commissions et swaps compris — et se remet à zéro à minuit CE(S)T, pas à l’heure de votre fuseau."},{"title":"Le drawdown du 1-Step glisse, puis se verrouille","detail":"Il monte avec votre plus haut solde de clôture, puis s’arrête définitivement une fois arrivé au solde de départ. Le 2-Step est en drawdown fixe dès le premier trade."},{"title":"Il n’existe aucun reset","detail":"Un challenge échoué ne se relance pas à prix réduit : il faut en racheter un entier. C’est une différence de coût réel importante avec les firmes qui facturent 50 % pour un reset."}],"more":["Aucune limite de temps sur les trois parcours","Aucun jour minimum fixe sur le 1-Step ; 4 jours par phase sur le 2-Step","Aucun frais d’activation du compte financé","Aucune obligation de stop-loss","Levier jusqu’à 1:100 en Standard, 1:30 en Swing","Plan de scaling : +25 % de solde tous les 4 mois, sur le 2-Step","Plateformes MT4, MT5, cTrader et TradingView"]}'::jsonb,
  journey              = '{"title":"Ce qui se passe après le paiement","intro":"Le parcours diffère selon le produit choisi.","steps":[{"title":"Évaluation","detail":"Une phase sur le 1-Step, deux sur le 2-Step. Aucune restriction sur les annonces, les positions de nuit ou de week-end à ce stade, quel que soit le produit."},{"title":"Vérification","detail":"Uniquement sur le 2-Step : un second objectif de 5 %, avec les mêmes limites de risque que la première phase."},{"title":"Compte FTMO","detail":"Le Standard restreint les annonces et impose de fermer avant les coupures de marché de plus de 2 heures et avant le week-end. Le Swing ne restreint rien. Swing n’existe pas sur le 1-Step."},{"title":"Récompenses","detail":"La première ne peut pas être demandée avant 14 jours ; ensuite vous choisissez votre jour de récompense. Sur le 2-Step, cette première récompense rembourse aussi le prix du challenge."}]}'::jsonb,
  cost_timeline        = '{"title":"Ce que vous paierez","intro":"Les coûts n’arrivent pas tous au même moment — et une partie revient.","steps":[{"label":"À l’achat","title":"Frais unique","detail":"De 79 € pour un 10K en 1-Step à 1 080 € pour un 200K en 2-Step. Aucun abonnement."},{"label":"En cas d’échec","title":"Aucun reset possible","detail":"FTMO ne vend pas de reset à prix réduit : recommencer signifie racheter un challenge entier."},{"label":"À la validation","title":"Aucun frais d’activation","detail":"Le compte financé s’ouvre sans paiement supplémentaire."},{"label":"À la première récompense","title":"Remboursement sur le 2-Step","detail":"Le 2-Step rend 100 % du prix du challenge avec la première récompense. Le 1-Step n’annonce pas de remboursement."}]}'::jsonb,
  data_verified_at     = timestamptz '2026-09-03',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'ftmo';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
-- Pas de begin/commit : l editeur SQL de Supabase enveloppe deja le
-- script dans sa propre transaction. Un begin explicite a l interieur
-- peut faire echouer l ensemble sans message clair.

delete from prop_firm_challenges where firm_slug = 'ftmo';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'ftmo-1-step-10k', 'FTMO 1-Step 10K', 'FTMO', 'ftmo', '$10K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 90, 79, null, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum fixe, mais la règle en impose en pratique au moins deux rentables.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-25k', 'FTMO 1-Step 25K', 'FTMO', 'ftmo', '$25K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 90, 199, null, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum fixe, mais la règle en impose en pratique au moins deux rentables.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-50k', 'FTMO 1-Step 50K', 'FTMO', 'ftmo', '$50K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 90, 319, null, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum fixe, mais la règle en impose en pratique au moins deux rentables.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-100k', 'FTMO 1-Step 100K', 'FTMO', 'ftmo', '$100K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 90, 499, null, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum fixe, mais la règle en impose en pratique au moins deux rentables.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-200k', 'FTMO 1-Step 200K', 'FTMO', 'ftmo', '$200K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 90, 999, null, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum fixe, mais la règle en impose en pratique au moins deux rentables.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-standard-10k', 'FTMO 2-Step Standard 10K', 'FTMO', 'ftmo', '$10K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 89, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-standard-25k', 'FTMO 2-Step Standard 25K', 'FTMO', 'ftmo', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 250, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-standard-50k', 'FTMO 2-Step Standard 50K', 'FTMO', 'ftmo', '$50K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 345, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-standard-100k', 'FTMO 2-Step Standard 100K', 'FTMO', 'ftmo', '$100K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 540, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-standard-200k', 'FTMO 2-Step Standard 200K', 'FTMO', 'ftmo', '$200K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 1080, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-10k', 'FTMO 2-Step Swing 10K', 'FTMO', 'ftmo', '$10K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 99, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-25k', 'FTMO 2-Step Swing 25K', 'FTMO', 'ftmo', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 279, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-50k', 'FTMO 2-Step Swing 50K', 'FTMO', 'ftmo', '$50K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 379, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-100k', 'FTMO 2-Step Swing 100K', 'FTMO', 'ftmo', '$100K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 80, 599, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.', true, true, true, 'one-time', 'percent');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       cardinality(pros) as nb_pros
from prop_firms where slug = 'ftmo';

-- Attendu : 14 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'ftmo' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- PARTAGE DES PROFITS. Enfin tranché par la fiche remplie du 3 septembre
-- 2026 : 90 % sur le 1-Step, 80 % sur le 2-Step avec 90 % atteignable via
-- le plan de scaling. La version précédente laissait profit_split à NULL
-- faute de source. La colonne firme porte 80 avec max_profit_split à 90 ;
-- le détail par programme vit dans prop_firm_challenges.
--
-- ALLOCATION. Corrigée. La fiche précédente plafonnait à 200 000 $, qui
-- était le plus gros compte achetable et non l’allocation maximale. La
-- fiche remplie donne 400 000 $ d’allocation initiale et 2 000 000 $ via
-- le scaling.
--
-- REMISES. FTMO affichait le 3 septembre 2026 une offre publique : 399,20
-- € au lieu de 499 € sur le 1-Step 100K (-20 %), et 439 € au lieu de 540 €
-- sur le 2-Step Standard 100K. Aucun prix barré n’est écrit : ce sont les
-- remises publiques de la firme, pas un code PropFirmScanner. Les publier
-- reviendrait à promettre une réduction qui ne passe pas par notre lien et
-- qui peut disparaître sans préavis.
--
-- TRADINGVIEW. Conflit résolu : la fiche remplie la liste parmi les
-- plateformes disponibles. Ajoutée.
--
-- NOUVEL ESSAI GRATUIT après un échec en phase de vérification : retiré.
-- La fiche remplie indique « No reset; a new Challenge is required », ce
-- qui contredit la formulation précédente sans la réfuter formellement. À
-- faire confirmer par FTMO avant de la remettre.
--
-- PAYS RESTREINTS. La fiche renvoie à la page officielle plutôt qu’à une
-- liste figée, en précisant qu’elle bouge avec les sanctions et que les
-- États-Unis et l’Australie passent par des offres régionales. Aucune
-- liste écrite : restricted_countries reste vide, ce qui vaut mieux qu’une
-- liste périmée.
--
-- FTMO US passe par OANDA ; aucun courtier d’exécution mondial n’est
-- publiquement nommé. Non écrit en base faute de colonne, mais utile si
-- une page « FTMO pour les traders américains » est écrite un jour.
--
-- AFFILIATION. 8 % de base, paliers jusqu’à 20 %. Durée du cookie non
-- publiée. Demandes de retrait traitées sous 2 à 3 jours ouvrés.
--
-- CHIFFRES DÉCLARATIFS. 4,5 M de clients, 650 M$ de récompenses, 140 pays,
-- 300 employés. Déclarations de la firme sur elle-même, publiables
-- uniquement avec la mention « selon FTMO ». Non écrits.
--
-- FTMO FUTURES (Growth/Pro) est sorti de bêta le 3 septembre 2026 avec ses
-- propres règles. Exclu de cette fiche, qui ne couvre que les CFD. Mérite
-- sa propre entrée si le produit se confirme.
--
-- PROVENANCE. Cette fiche vient d’un classeur rempli le 3 septembre 2026 à
-- partir des pages officielles FTMO listées dans son onglet « Sources &
-- Notes ». Elle n’a PAS été renvoyée et validée par FTMO, contrairement à
-- la fiche Hantec Trader qui vient d’un e-mail de la firme. La page peut
-- donc dire « vérifié contre la documentation de FTMO », jamais « confirmé
-- par FTMO ».
