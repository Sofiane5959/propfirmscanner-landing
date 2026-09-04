-- =============================================================================
-- THE5ERS — TOUT EN UN
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
select * from prop_firms where slug = 'the5ers';
select * from prop_firm_challenges where firm_slug = 'the5ers';


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
  name                 = 'The5ers',
  founded_year         = 2016,
  headquarters         = 'Enstar House, 168 Praed Street, London W2 1RH, United Kingdom',
  country              = 'United Kingdom',
  price_currency       = 'USD',
  is_regulated         = false,
  regulation_details   = 'Five Percent Online Ltd, England & Wales no. 12553363 and Israel no. 515864007. A proprietary-trading evaluation company: not a broker, custodian, exchange or regulated financial institution. Fully simulated trading environment.',
  trustpilot_rating    = 4.7,
  min_price            = 22,
  max_price            = 850,
  profit_split         = 80,
  max_profit_split     = 100,
  max_allocation       = 'Up to $500,000 on High Stakes and Pro Growth, up to $4,000,000 on Hyper Growth and Bootcamp',
  is_futures           = false,
  drawdown_type        = 'Static overall loss on all four programmes: 10% on High Stakes, 6% on Hyper Growth and Pro Growth, 5% in evaluation and 4% once funded on Bootcamp.',
  time_limit           = 'No time limit, but an account left 30 days without a trade expires',
  payout_frequency     = 'every 14 days, after approval',
  source_url           = 'https://the5ers.com/challenge-programs-bootcamp-high-stakes-hyper-growth-explained/',
  platforms            = 'MetaTrader 5',
  assets               = '{"Forex CFDs","Indices","Metals","Commodities","Crypto"}'::text[],
  payout_methods       = '{"Methods shown in The5ers Hub, varying by account"}'::text[],
  restricted_countries = '{"Afghanistan","Belarus","Bosnia and Herzegovina","Burundi","Central African Republic","Congo (Brazzaville)","Congo (Kinshasa)","Crimea","Cuba","Eritrea","Guinea","Guinea-Bissau","Iran","Iraq","Israel","Laos","Lebanon","Liberia","Libya","Myanmar","North Korea","Palestinian Territory","Papua New Guinea","Russia","Somalia","South Sudan","Sudan","Syria","Vanuatu","Venezuela","Yemen"}'::text[],
  included_items       = '{"MetaTrader 5 in Hedge mode, on desktop, web and mobile","Four programmes, from one to three phases","Account growth up to a 100% split"}'::text[],
  pros                 = '{"Trading since 2016","Entry from $22, one of the lowest on the market","The split can reach 100%, a rare ceiling","The growth plan can lead to $4,000,000 on Hyper Growth and Bootcamp","Four genuinely different programmes, from one to three phases","No consistency rule on any of the four programmes","Overnight and weekend holding allowed throughout","Two identified legal entities, in the UK and Israel"}'::text[],
  cons                 = '{"The split starts at 50% on Hyper Growth and Bootcamp","A single platform: MetaTrader 5","31 excluded territories, including Russia, Iran and Israel","No financial regulator licence","Fully simulated environment: the funds are not real capital","An account left 30 days without a trade expires","No publicly advertised reset: you buy a new evaluation","Large payouts can be split into weekly instalments of $10,000"}'::text[],
  special_features     = '{"Split varies by programme: 80% High Stakes, 75% Pro Growth, 50% Hyper Growth and Bootcamp","All four programmes climb to 100% through account growth","MetaTrader 5 in Hedge mode, on desktop, web and mobile","Forex commission of $4 per round-turn lot, varying by asset","Leverage up to 1:100 on High Stakes, 1:30 on the other three","Indices and metals up to 1:25, crypto 1:2 on High Stakes","An account left 30 days without a trade expires","Part of the 5% Group, alongside Trade The Pool, Trade Delicious and TSG Brokers"}'::text[],
  verdict_card         = '{"title":"Who it suits, and who it does not","body":"The5ers sells four programmes whose starting split ranges from 50% to 80%. All climb to 100% as the account grows, but where you start changes the maths of your first months completely.","points":["Starting for almost nothing: $22 on Bootcamp or High Stakes 2.5K","The best entry split of the range: 80% on High Stakes","Aiming very large: Hyper Growth and Bootcamp lead to $4,000,000","A 100% split ceiling, which few firms offer","No consistency rule, on any of the four programmes"]}'::jsonb,
  program_guide        = '{"title":"Four programmes, four trade-offs","intro":"The choice turns on three dials: the starting split, the number of phases, and the price.","options":[{"name":"High Stakes","badge":"Two phases","summary":"The most balanced programme: 80% split from the start, 10% then 5% targets, and the widest daily limit of the range.","points":["10% then 5% target, 80% split","5% daily loss, 10% overall loss","3 minimum winning days per phase","Leverage up to 1:100, the highest of the range","From $22 (2.5K) to $545 (100K)"]},{"name":"Pro Growth","badge":"Single phase","summary":"A single 10% phase and a 75% starting split, at a contained price. Overall loss drops to 6%.","points":["10% target in one phase, 75% split","3% daily loss, 6% overall loss","Gradual growth up to $500,000","From $52 (5K) to $329 (50K)"]},{"name":"Hyper Growth","badge":"Single phase, high ceiling","summary":"The account doubles at each 10% step, up to $4,000,000. In exchange, the split starts at 50% and the entry price is the highest of the range.","points":["10% target in one phase, 50% starting split","The account doubles at each target reached","6% overall loss, 3% daily pause threshold","From $260 (5K) to $850 (20K)"]},{"name":"Bootcamp","badge":"Three phases","summary":"Three 6% steps, with no daily limit during the evaluation, and fees paid in two parts: a low entry, the balance on success.","points":["Three 6% targets, 50% starting split","No daily limit during the evaluation","5% overall loss, tightened to 4% once funded","Entry from $22 (20K) to $225 (250K), balance due after success"]}]}'::jsonb,
  key_rules            = '{"title":"The rules that decide it","intro":"Five points comparison sites get wrong or stay silent about.","rules":[{"title":"The starting split ranges from 50% to 80% by programme","detail":"High Stakes starts at 80%, Pro Growth at 75%, Hyper Growth and Bootcamp at 50%. All four climb to 100% as the account grows, but advertising \"up to 100%\" without saying where you start hides half the information."},{"title":"The Hyper Growth daily threshold is a pause, not a failure","detail":"On Hyper Growth, going past 3% in a day suspends trading until the next day instead of closing the account. On Pro Growth it is a genuine 3% daily loss. On Bootcamp there is no daily limit during the evaluation; the 3% pause only arrives once funded."},{"title":"An account inactive for 30 days expires","detail":"There is no deadline to pass an evaluation, but going 30 days without placing a trade closes the account. It is the only calendar constraint here, and it is rarely mentioned elsewhere."},{"title":"News can be held through, not traded","detail":"On High Stakes, holding a position through a high-impact release is allowed; opening or closing within the 2 minutes around it is not. The other three programmes forbid news-exploitation strategies without imposing that window."},{"title":"Large payouts can be split","detail":"Payouts go out every 14 days from your first trade on a funded account, after approval. A large amount may be paid in weekly instalments capped at $10,000. Worth factoring in if you are aiming at a big account."}],"more":["No consistency rule on any of the four programmes","Overnight and weekend holding allowed; indices carry high swaps","Forex commission of $4 per round-turn lot, varying by asset","Leverage up to 1:100 on High Stakes, 1:30 on the other three","Indices and metals up to 1:25; crypto 1:2 on High Stakes","No mandatory stop-loss","MetaTrader 5 in Hedge mode only"]}'::jsonb,
  journey              = '{"title":"What happens after you pay","intro":"The route depends on how many phases your programme has.","steps":[{"title":"Evaluation","detail":"One phase on Hyper Growth and Pro Growth, two on High Stakes, three on Bootcamp. No deadline, but an account without a trade for 30 days expires."},{"title":"Funded account","detail":"The split starts at the programme rate — 80%, 75% or 50% — and climbs towards 100% as the account grows."},{"title":"Growth","detail":"High Stakes advances at each 10% step, Hyper Growth doubles the account at each step, Pro Growth grows gradually, Bootcamp at each 5% step. The ceiling is $500,000 on High Stakes and Pro Growth, $4,000,000 on the other two."},{"title":"Payouts","detail":"Every 14 days from your first trade on a funded account, subject to approval. A large amount may be split into weekly instalments of up to $10,000."}]}'::jsonb,
  cost_timeline        = '{"title":"What you will pay","intro":"Three of the four programmes are paid once. Bootcamp is not.","steps":[{"label":"At purchase","title":"One-off fee, except Bootcamp","detail":"From $22 for a High Stakes 2.5K to $850 for a Hyper Growth 20K. Bootcamp asks only a reduced entry: $22 for a 20K, $225 for a 250K."},{"label":"On success","title":"Bootcamp balance","detail":"Bootcamp claims the rest of the fee once the evaluation is passed — $50 on the 20K. The other three ask for nothing further."},{"label":"On failure","title":"No advertised reset","detail":"The5ers publishes no reset price: starting over means buying a full evaluation."},{"label":"At payout","title":"Instalments possible","detail":"Payouts every 14 days after approval. Large amounts may be paid in weekly instalments of $10,000."}]}'::jsonb,
  translations         = '{"fr":{"regulation_details":"Five Percent Online Ltd, société britannique n° 12553363 et société israélienne n° 515864007. Société d’évaluation de trading propriétaire : ni courtier, ni dépositaire, ni bourse, ni établissement financier régulé. Environnement de trading entièrement simulé.","max_allocation":"Jusqu’à 500 000 $ sur High Stakes et Pro Growth, jusqu’à 4 000 000 $ sur Hyper Growth et Bootcamp","drawdown_type":"Perte globale statique sur les quatre programmes : 10 % sur High Stakes, 6 % sur Hyper Growth et Pro Growth, 5 % en évaluation et 4 % une fois financé sur Bootcamp.","time_limit":"Aucune limite de temps, mais un compte resté 30 jours sans trade expire","payout_frequency":"tous les 14 jours, après validation","assets":["CFD sur forex","Indices","Métaux","Matières premières","Crypto"],"payout_methods":["Moyens affichés dans le Hub The5ers, variables selon le compte"],"restricted_countries":["Afghanistan","Biélorussie","Bosnie-Herzégovine","Burundi","Congo (Brazzaville)","Congo (Kinshasa)","Corée du Nord","Crimée","Cuba","Érythrée","Guinée","Guinée-Bissau","Irak","Iran","Israël","Laos","Liban","Liberia","Libye","Myanmar","Papouasie-Nouvelle-Guinée","République centrafricaine","Russie","Somalie","Soudan","Soudan du Sud","Syrie","Territoires palestiniens","Vanuatu","Venezuela","Yémen"],"included_items":["MetaTrader 5 en mode Hedge, sur desktop, web et mobile","Quatre programmes, d’une à trois phases","Croissance du compte jusqu’à 100 % de partage"],"pros":["En activité depuis 2016","Entrée à partir de 22 $, l’une des plus basses du marché","Le partage peut monter jusqu’à 100 %, un plafond rare","Le plan de croissance peut mener jusqu’à 4 000 000 $ sur Hyper Growth et Bootcamp","Quatre programmes réellement différents, d’une à trois phases","Aucune règle de régularité sur aucun des quatre programmes","Positions de nuit et de week-end autorisées partout","Deux entités juridiques identifiées, au Royaume-Uni et en Israël"],"cons":["Le partage démarre à 50 % sur Hyper Growth et Bootcamp","Une seule plateforme : MetaTrader 5","31 territoires exclus, dont la Russie, l’Iran et Israël","Aucune licence de régulateur financier","Environnement entièrement simulé : les fonds ne sont pas du capital réel","Un compte resté 30 jours sans trade expire","Aucun reset annoncé publiquement : il faut racheter une évaluation","Les gros retraits peuvent être fractionnés en versements hebdomadaires de 10 000 $"],"special_features":["Partage variable selon le programme : 80 % High Stakes, 75 % Pro Growth, 50 % Hyper Growth et Bootcamp","Les quatre programmes montent jusqu’à 100 % via la croissance du compte","MetaTrader 5 en mode Hedge, sur desktop, web et mobile","Commission forex de 4 $ par lot aller-retour, variable selon l’actif","Levier jusqu’à 1:100 sur High Stakes, 1:30 sur les trois autres","Indices et métaux jusqu’à 1:25, crypto 1:2 sur High Stakes","Un compte resté 30 jours sans trade expire","Membre du 5% Group, avec Trade The Pool, Trade Delicious et TSG Brokers"],"verdict_card":{"title":"Pour qui, et pour qui pas","body":"The5ers vend quatre programmes dont le partage de départ va du simple au double : 80 % sur High Stakes, 50 % sur Hyper Growth et Bootcamp. Tous montent à 100 % en faisant croître le compte, mais le point de départ change complètement le calcul des premiers mois.","points":["Commencer pour presque rien : 22 $ en Bootcamp ou en High Stakes 2,5K","Le meilleur partage d’entrée de la gamme : 80 % sur High Stakes","Viser très gros : Hyper Growth et Bootcamp mènent jusqu’à 4 000 000 $","Un plafond de partage à 100 %, que peu de firmes proposent","Aucune règle de régularité, sur aucun des quatre programmes"]},"program_guide":{"title":"Quatre programmes, quatre compromis","intro":"Le choix se joue sur trois curseurs : le partage de départ, le nombre de phases et le prix.","options":[{"name":"High Stakes","badge":"Deux phases","summary":"Le programme le plus équilibré : 80 % de partage dès le départ, 10 % puis 5 % d’objectif, et la limite journalière la plus large de la gamme.","points":["Objectif 10 % puis 5 %, partage de 80 %","Perte journalière de 5 %, perte globale de 10 %","3 jours rentables minimum par phase","Levier jusqu’à 1:100, le plus élevé de la gamme","De 22 $ (2,5K) à 545 $ (100K)"]},{"name":"Pro Growth","badge":"Une phase","summary":"Une seule phase à 10 % et 75 % de partage au départ, pour un prix contenu. La perte globale tombe à 6 %.","points":["Objectif de 10 % en une phase, partage de 75 %","Perte journalière de 3 %, perte globale de 6 %","Croissance progressive jusqu’à 500 000 $","De 52 $ (5K) à 329 $ (50K)"]},{"name":"Hyper Growth","badge":"Une phase, gros plafond","summary":"Le compte double à chaque palier de 10 %, jusqu’à 4 000 000 $. En échange, le partage démarre à 50 % et le prix d’entrée est le plus élevé de la gamme.","points":["Objectif de 10 % en une phase, partage de départ de 50 %","Le compte double à chaque objectif atteint","Perte globale de 6 %, seuil de pause journalière à 3 %","De 260 $ (5K) à 850 $ (20K)"]},{"name":"Bootcamp","badge":"Trois phases","summary":"Trois paliers à 6 %, sans limite journalière pendant l’évaluation, avec des frais payés en deux temps : une entrée réduite, le solde à la réussite.","points":["Trois objectifs de 6 %, partage de départ de 50 %","Aucune limite journalière pendant l’évaluation","Perte globale de 5 %, ramenée à 4 % une fois financé","Entrée de 22 $ (20K) à 225 $ (250K), solde dû après la réussite"]}]},"key_rules":{"title":"Les règles qui décident","intro":"Cinq points sur lesquels les comparateurs se trompent ou restent muets.","rules":[{"title":"Le partage de départ va de 50 % à 80 % selon le programme","detail":"High Stakes démarre à 80 %, Pro Growth à 75 %, Hyper Growth et Bootcamp à 50 %. Les quatre montent jusqu’à 100 % en faisant croître le compte, mais annoncer « jusqu’à 100 % » sans dire d’où l’on part revient à masquer la moitié de l’information."},{"title":"Le seuil journalier de Hyper Growth est une pause, pas un échec","detail":"Sur Hyper Growth, dépasser 3 % dans la journée suspend le trading jusqu’au lendemain au lieu de clôturer le compte. Sur Pro Growth c’est une véritable perte journalière de 3 %. Sur Bootcamp, aucune limite journalière pendant l’évaluation ; la pause de 3 % n’arrive qu’une fois financé."},{"title":"Un compte inactif 30 jours expire","detail":"Il n’y a pas de limite de durée pour réussir une évaluation, mais rester 30 jours sans passer un trade ferme le compte. C’est la seule contrainte de calendrier de la maison, et elle est rarement mentionnée ailleurs."},{"title":"Les annonces se tiennent, mais ne se tradent pas","detail":"Sur High Stakes, garder une position ouverte à travers une annonce à fort impact est autorisé ; ouvrir ou fermer dans les 2 minutes qui l’entourent ne l’est pas. Les trois autres programmes interdisent les stratégies d’exploitation d’annonces sans imposer cette fenêtre."},{"title":"Les gros retraits peuvent être fractionnés","detail":"Les retraits partent tous les 14 jours à partir du premier trade sur compte financé, après validation. Un montant important peut être versé par tranches hebdomadaires plafonnées à 10 000 $. À intégrer au calcul si vous visez un gros compte."}],"more":["Aucune règle de régularité sur aucun des quatre programmes","Positions de nuit et de week-end autorisées ; les indices portent des swaps élevés","Commission forex de 4 $ par lot aller-retour, variable selon l’actif","Levier jusqu’à 1:100 sur High Stakes, 1:30 sur les trois autres","Indices et métaux jusqu’à 1:25 ; crypto 1:2 sur High Stakes","Aucun stop-loss obligatoire","MetaTrader 5 en mode Hedge uniquement"]},"journey":{"title":"Ce qui se passe après le paiement","intro":"Le parcours dépend du nombre de phases du programme choisi.","steps":[{"title":"Évaluation","detail":"Une phase sur Hyper Growth et Pro Growth, deux sur High Stakes, trois sur Bootcamp. Aucune limite de durée, mais un compte sans trade pendant 30 jours expire."},{"title":"Compte financé","detail":"Le partage démarre au taux du programme — 80 %, 75 % ou 50 % — et monte vers 100 % au fil de la croissance du compte."},{"title":"Croissance","detail":"High Stakes progresse à chaque palier de 10 %, Hyper Growth double le compte à chaque palier, Pro Growth avance progressivement, Bootcamp à chaque palier de 5 %. Le plafond est de 500 000 $ sur High Stakes et Pro Growth, 4 000 000 $ sur les deux autres."},{"title":"Retraits","detail":"Tous les 14 jours à partir du premier trade sur compte financé, sous réserve de validation. Un gros montant peut être fractionné en versements hebdomadaires de 10 000 $ maximum."}]},"cost_timeline":{"title":"Ce que vous paierez","intro":"Trois des quatre programmes se paient en une fois. Le Bootcamp, non.","steps":[{"label":"À l’achat","title":"Frais unique, sauf Bootcamp","detail":"De 22 $ pour un High Stakes 2,5K à 850 $ pour un Hyper Growth 20K. Le Bootcamp ne demande qu’une entrée réduite : 22 $ pour un 20K, 225 $ pour un 250K."},{"label":"À la réussite","title":"Solde du Bootcamp","detail":"Le Bootcamp réclame le reste des frais une fois l’évaluation réussie — 50 $ sur le 20K. Les trois autres programmes ne demandent rien de plus."},{"label":"En cas d’échec","title":"Aucun reset annoncé","detail":"The5ers ne publie pas de tarif de reset : recommencer signifie racheter une évaluation complète."},{"label":"Au retrait","title":"Fractionnement possible","detail":"Retraits tous les 14 jours après validation. Les gros montants peuvent être versés par tranches hebdomadaires de 10 000 $."}]}}}'::jsonb,
  data_verified_at     = timestamptz '2026-09-03',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'the5ers';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
-- Pas de begin/commit : l editeur SQL de Supabase enveloppe deja le
-- script dans sa propre transaction. Un begin explicite a l interieur
-- peut faire echouer l ensemble sans message clair.

delete from prop_firm_challenges where firm_slug = 'the5ers';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'the5ers-high-stakes-2-5k', 'High Stakes $2.5K', 'The5ers', 'the5ers', '$2.5K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 80, 22, null, null, '3 minimum winning days per phase, with no consistency rule. No order executed within 2 minutes before or after a high-impact release; holding a position through it is allowed.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-5k', 'High Stakes $5K', 'The5ers', 'the5ers', '$5K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 80, 39, null, null, '3 minimum winning days per phase, with no consistency rule. No order executed within 2 minutes before or after a high-impact release; holding a position through it is allowed.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-10k', 'High Stakes $10K', 'The5ers', 'the5ers', '$10K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 80, 78, null, null, '3 minimum winning days per phase, with no consistency rule. No order executed within 2 minutes before or after a high-impact release; holding a position through it is allowed.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-25k', 'High Stakes $25K', 'The5ers', 'the5ers', '$25K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 80, 195, null, null, '3 minimum winning days per phase, with no consistency rule. No order executed within 2 minutes before or after a high-impact release; holding a position through it is allowed.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-50k', 'High Stakes $50K', 'The5ers', 'the5ers', '$50K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 80, 309, null, null, '3 minimum winning days per phase, with no consistency rule. No order executed within 2 minutes before or after a high-impact release; holding a position through it is allowed.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-100k', 'High Stakes $100K', 'The5ers', 'the5ers', '$100K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 80, 545, null, null, '3 minimum winning days per phase, with no consistency rule. No order executed within 2 minutes before or after a high-impact release; holding a position through it is allowed.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-5k', 'Pro Growth $5K', 'The5ers', 'the5ers', '$5K', '1 step', 6, 3, 10, null, 'Static', 'Static', 75, 52, null, null, 'No consistency rule. The official page contradicts itself on winning days: its table says 3, its specifications require none. An account left 30 days without a trade expires. On Hyper Growth, going past 3% in a day pauses the account rather than closing it.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-10k', 'Pro Growth $10K', 'The5ers', 'the5ers', '$10K', '1 step', 6, 3, 10, null, 'Static', 'Static', 75, 98, null, null, 'No consistency rule. The official page contradicts itself on winning days: its table says 3, its specifications require none. An account left 30 days without a trade expires. On Hyper Growth, going past 3% in a day pauses the account rather than closing it.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-20k', 'Pro Growth $20K', 'The5ers', 'the5ers', '$20K', '1 step', 6, 3, 10, null, 'Static', 'Static', 75, 189, null, null, 'No consistency rule. The official page contradicts itself on winning days: its table says 3, its specifications require none. An account left 30 days without a trade expires. On Hyper Growth, going past 3% in a day pauses the account rather than closing it.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-50k', 'Pro Growth $50K', 'The5ers', 'the5ers', '$50K', '1 step', 6, 3, 10, null, 'Static', 'Static', 75, 329, null, null, 'No consistency rule. The official page contradicts itself on winning days: its table says 3, its specifications require none. An account left 30 days without a trade expires. On Hyper Growth, going past 3% in a day pauses the account rather than closing it.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-5k', 'Hyper Growth $5K', 'The5ers', 'the5ers', '$5K', '1 step', 6, 3, 10, null, 'Static', 'Static', 50, 260, null, null, 'No consistency rule. The official page contradicts itself on winning days: its table says 3, its specifications require none. An account left 30 days without a trade expires. On Hyper Growth, going past 3% in a day pauses the account rather than closing it.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-10k', 'Hyper Growth $10K', 'The5ers', 'the5ers', '$10K', '1 step', 6, 3, 10, null, 'Static', 'Static', 50, 450, null, null, 'No consistency rule. The official page contradicts itself on winning days: its table says 3, its specifications require none. An account left 30 days without a trade expires. On Hyper Growth, going past 3% in a day pauses the account rather than closing it.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-20k', 'Hyper Growth $20K', 'The5ers', 'the5ers', '$20K', '1 step', 6, 3, 10, null, 'Static', 'Static', 50, 850, null, null, 'No consistency rule. The official page contradicts itself on winning days: its table says 3, its specifications require none. An account left 30 days without a trade expires. On Hyper Growth, going past 3% in a day pauses the account rather than closing it.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-20k', 'Bootcamp $20K', 'The5ers', 'the5ers', '$20K', '3 steps', 5, null, 6, 6, 'Static', 'Static', 50, 22, null, null, 'No minimum days stated, no consistency rule. No daily limit during the evaluation; a 3% daily pause applies once funded. Fees paid in two parts: a reduced entry, the balance due on success.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-100k', 'Bootcamp $100K', 'The5ers', 'the5ers', '$100K', '3 steps', 5, null, 6, 6, 'Static', 'Static', 50, 95, null, null, 'No minimum days stated, no consistency rule. No daily limit during the evaluation; a 3% daily pause applies once funded. Fees paid in two parts: a reduced entry, the balance due on success.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-250k', 'Bootcamp $250K', 'The5ers', 'the5ers', '$250K', '3 steps', 5, null, 6, 6, 'Static', 'Static', 50, 225, null, null, 'No minimum days stated, no consistency rule. No daily limit during the evaluation; a 3% daily pause applies once funded. Fees paid in two parts: a reduced entry, the balance due on success.', true, true, true, 'one-time', 'percent');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       cardinality(pros) as nb_pros,
       ((translations -> 'fr') is not null) as a_une_traduction_fr
from prop_firms where slug = 'the5ers';

-- Attendu : 16 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'the5ers' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- LANGUE. Colonnes de base en anglais, français dans translations.fr. La
-- version précédente écrivait le français en base et la page anglaise
-- servait donc du français.
--
-- PARTAGE DES PROFITS — RÉSOLU. profit_split restait NULL faute de source.
-- La fiche remplie du 3 septembre 2026 donne le détail par programme : 80
-- % High Stakes, 75 % Pro Growth, 50 % Hyper Growth, 50 % Bootcamp, les
-- quatre montant jusqu’à 100 % via la croissance. La colonne firme porte
-- 80 avec max_profit_split à 100.
--
-- GRILLE DE PRIX MAL ALIGNÉE. L’onglet Pricing pose plusieurs montants
-- dans la colonne du programme voisin : 850 $ sous High Stakes alors que
-- High Stakes ne vend pas de 20K, 95 $ et 329 $ sous Hyper Growth alors
-- que Hyper Growth s’arrête à 20K. L’affectation retenue est la seule
-- compatible avec la ligne « Account sizes offered » du même classeur. À
-- faire confirmer par The5ers.
--
-- ÉTATS-UNIS — CORRECTION. La version précédente affirmait « Les traders
-- américains ne sont pas acceptés ». La liste officielle ne les contient
-- pas. Retiré. Israël y figure bien, malgré l’entité israélienne du
-- groupe.
--
-- SUMMER PLAN retiré. Le challenge à 249 $ ne figure dans aucun des quatre
-- programmes de la fiche du 3 septembre 2026.
--
-- PLATEFORMES. cTrader retiré : la fiche ne liste que MetaTrader 5 en mode
-- Hedge.
--
-- OBJECTIF HIGH STAKES — CORRECTION. La version précédente donnait 8 % en
-- première phase. La fiche donne 10 %, puis 5 %.
--
-- COMMISSIONS — RÉSOLU. Les deux sources tierces se contredisaient. La
-- fiche donne 4 $ par lot aller-retour sur le forex.
--
-- REMISES. Une offre publique de 10 % circule chez un concurrent affilié.
-- Aucun prix barré n’est écrit : ce n’est pas un code PropFirmScanner.
--
-- discount_code GDSWCVRTE7 est en base, d’origine inconnue. À confirmer
-- contre le panneau partenaire ou à retirer.
--
-- RETRAITS. Rise est cité comme moyen de retrait par des comparateurs, pas
-- par la firme : payout_methods renvoie au Hub.
--
-- AFFILIATION. Taux, durée du cookie et calendrier de paiement non
-- publiés.
--
-- CHIFFRES DÉCLARATIFS. 262 000 traders financés, 171 employés, 80 M$
-- versés. Déclarations de la firme, non écrites.
--
-- PROVENANCE. Classeur rempli à partir des pages officielles The5ers, non
-- renvoyé et validé par la firme. La page peut dire « vérifié contre la
-- documentation de The5ers », jamais « confirmé par The5ers ».
