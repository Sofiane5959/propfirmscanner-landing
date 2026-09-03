// =============================================================================
// GENERATEUR DE CONTENU EDITORIAL — scripts/build-firm-content.mjs
// =============================================================================
//   node scripts/build-firm-content.mjs
//
// Ecrit database/RUN-<slug>.sql pour chaque firme decrite ici.
//
// Pourquoi ce script existe : la page firme tire sa substance de colonnes JSONB
// (journey, key_rules, program_guide, cost_timeline, verdict_card, pros, cons,
// education, checkout_options). Une section disparait quand sa colonne est
// NULL. Remplir seulement les colonnes scalaires laisse donc une page vide,
// meme apres un import reussi. Les structures ci-dessous reprennent exactement
// celles relevees sur la page Earn2Trade.
//
// Regle : rien n est ecrit qui ne soit sourcable. Les sources sont citees en
// commentaire dans le SQL genere, et ce qui reste incertain est laisse dehors,
// liste en fin de fichier.
// =============================================================================

import { writeFile } from 'node:fs/promises'

const J = (o) => "'" + JSON.stringify(o).replace(/'/g, "''") + "'"
const S = (s) => s === null || s === undefined ? 'null' : "'" + String(s).replace(/'/g, "''") + "'"
const N = (n) => n === null || n === undefined ? 'null' : String(n)

// -----------------------------------------------------------------------------
// FTMO — source : dossier_ftmo_the5ers.md (ftmo.com), releve du 3 septembre 2026
// -----------------------------------------------------------------------------
const FTMO = {
  slug: 'ftmo',
  scalars: {
    name: 'FTMO', founded_year: 2015,
    headquarters: 'Bureaux Quadrio, Purkynova 2121/3, 110 00 Prague, Republique tcheque',
    country: 'Czech Republic', price_currency: 'EUR', is_regulated: false,
    regulation_details: null, trustpilot_rating: 4.8, min_price: 79, max_price: 599,
    max_allocation: '$200,000', is_futures: false,
    drawdown_type: 'Varie selon le produit : glissant (1-Step) ou fixe (2-Step)',
    time_limit: 'Aucune limite de temps, sur les deux produits',
    payout_frequency: null,
    source_url: 'https://ftmo.com/fr/trading-objectives/',
  },
  arrays: {
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
    assets: ['Forex CFD', 'Metals', 'Indices', 'Energy', 'Crypto', 'Commodities', 'Stocks'],
    payout_methods: ['Bank transfer', 'Crypto', 'Skrill', 'Mastercard', 'Visa Direct'],
    included_items: ['MetaTrader 4, MetaTrader 5 and cTrader', 'FTMO trading platform and metrics dashboard', 'Free retry after a failed Verification phase'],
    pros: [
      'Operating since 2015, one of the longest records in the sector',
      'No time limit on either the 1-Step or the 2-Step',
      'The 1-Step has no minimum trading days',
      'Best-day rule on the 1-Step is a condition to meet, not a breach',
      'Swing account removes news and weekend restrictions once funded',
      'Prices in euros, from 79 EUR',
    ],
    cons: [
      'Maximum funded capital is 200,000 USD, low against futures specialists',
      'The 2-Step requires 4 trading days in each phase',
      'Standard funded account restricts news trading and overnight holding',
      'Swing is not available on the 1-Step',
      'Profit split and scaling terms are not confirmed on the pages consulted',
    ],
    special_features: [
      'Two distinct products with genuinely different rules',
      '1-Step: 3% daily loss and an end-of-day trailing drawdown',
      '2-Step: 5% daily loss and a fixed drawdown',
      'The best-day rule applies to the 1-Step only',
      'No news, overnight or weekend restrictions during the evaluation',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body: "FTMO vend deux produits qu'il faut distinguer avant d'acheter. Le 1-Step est plus souple sur le calendrier mais plus strict au quotidien ; le 2-Step est l'inverse.",
      points: [
        'Le 1-Step convient si vous ne pouvez pas trader regulierement : aucun jour minimum',
        "Le 2-Step convient si vous supportez mal une limite journaliere serree : 5 % contre 3 %",
        'Evitez le 1-Step si un drawdown qui monte et ne redescend jamais vous gene',
        'Evitez FTMO si vous visez plus de 200 000 $ de capital',
      ],
    },
    program_guide: {
      title: 'Deux produits, deux logiques',
      intro: "Les deux menent a un compte finance. La difference tient au calendrier et a la tolerance quotidienne.",
      options: [
        {
          name: '1-Step', badge: 'Une seule phase',
          summary: 'Un objectif de 10 %, aucun jour minimum, mais une limite journaliere de 3 % et un drawdown qui suit vos plus hauts.',
          points: ['Objectif 10 %', 'Perte journaliere 3 %', 'Drawdown glissant en fin de journee', 'Meilleur jour <= 50 % du profit des jours positifs'],
        },
        {
          name: '2-Step', badge: 'Deux phases',
          summary: 'Objectif de 10 % puis 5 %, une limite journaliere plus large a 5 % et un drawdown fixe, contre 4 jours de trading minimum par phase.',
          points: ['Objectif 10 % puis 5 %', 'Perte journaliere 5 %', 'Drawdown fixe', '4 jours de trading minimum dans chaque phase'],
        },
      ],
    },
    key_rules: {
      title: 'Les regles qui decident',
      intro: 'Trois points que la plupart des comparateurs rapportent mal.',
      rules: [
        { title: 'La perte journaliere differe selon le produit', detail: "3 % sur le 1-Step, 5 % sur le 2-Step. Plusieurs sites annoncent 5 % pour les deux : c'est faux." },
        { title: 'Le drawdown aussi', detail: "Le 1-Step utilise un drawdown glissant recalcule chaque jour a minuit : il monte avec votre plus haut solde de cloture et ne redescend jamais. Le 2-Step est en drawdown fixe." },
        { title: "Depasser la regle du meilleur jour n'est pas une infraction", detail: "Sur le 1-Step, votre meilleure journee doit rester sous 50 % du profit des jours positifs. Au-dessus, vous continuez simplement a trader jusqu a repasser dessous. C'est une condition de validation, pas un couperet." },
        { title: 'Standard et Swing ne se distinguent que sur le compte finance', detail: "Pendant l'evaluation, aucune restriction sur les annonces macro ni sur les positions overnight ou week-end. Sur le compte finance, le Standard restreint les deux ; le Swing ne restreint rien. Swing n'existe pas sur le 1-Step." },
      ],
      more: [
        'Aucune limite de temps sur les deux produits',
        'Aucun jour minimum sur le 1-Step',
        '4 jours de trading minimum par phase sur le 2-Step',
        'Plateformes MT4, MT5 et cTrader',
        'Prix affiches en euros',
      ],
    },
    journey: {
      title: 'Ce qui se passe apres le paiement',
      intro: 'Le parcours differe selon le produit choisi.',
      steps: [
        { title: 'Evaluation', detail: "Une phase sur le 1-Step, deux sur le 2-Step. Aucune restriction sur les annonces, l'overnight ou le week-end a ce stade." },
        { title: 'Verification', detail: 'Uniquement sur le 2-Step : un second objectif de 5 %, avec les memes limites de risque.' },
        { title: 'FTMO Account', detail: "Le compte finance. C'est ici que le type Standard ou Swing change quelque chose : le Standard restreint les annonces et les positions de nuit, le Swing non." },
        { title: 'Retraits et scaling', detail: "Un plan de croissance existe, mais ses conditions exactes ne sont pas confirmees sur les pages consultees. A verifier avant de s'engager dessus." },
      ],
    },
  },
  challenges: [
    ['ftmo-1-step-10k', 'FTMO 1-Step 10K', '$10K', '1 step', 10, 3, 10, null, 'Glissant en fin de journee', 'Trailing', 79, null],
    ['ftmo-1-step-25k', 'FTMO 1-Step 25K', '$25K', '1 step', 10, 3, 10, null, 'Glissant en fin de journee', 'Trailing', 199, null],
    ['ftmo-1-step-50k', 'FTMO 1-Step 50K', '$50K', '1 step', 10, 3, 10, null, 'Glissant en fin de journee', 'Trailing', 319, null],
    ['ftmo-1-step-100k', 'FTMO 1-Step 100K', '$100K', '1 step', 10, 3, 10, null, 'Glissant en fin de journee', 'Trailing', 499, 399.20],
    ['ftmo-2-step-standard-25k', 'FTMO 2-Step Standard 25K', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 250, null],
    ['ftmo-2-step-swing-10k', 'FTMO 2-Step Swing 10K', '$10K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 99, null],
    ['ftmo-2-step-swing-25k', 'FTMO 2-Step Swing 25K', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 279, null],
    ['ftmo-2-step-swing-50k', 'FTMO 2-Step Swing 50K', '$50K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 379, null],
    ['ftmo-2-step-swing-100k', 'FTMO 2-Step Swing 100K', '$100K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 599, null],
  ],
  consistency: {
    '1 step': 'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation : il faut continuer jusqu a repasser dessous.',
    '2 steps': 'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.',
  },
  riskUnit: 'percent',
  notes: [
    'PARTAGE DES PROFITS. 80 % de base, 90 % via scaling selon les sources, certaines annoncant 90 % d emblee sur le 1-Step. Non confirme sur les pages officielles consultees. profit_split reste null : mieux vaut une case vide qu un chiffre faux.',
    'LEVIER, COMMISSIONS, CEO, ACQUISITION D OANDA. Source PropFirmMatch, un concurrent. Non ecrit.',
    'CHIFFRES DECLARATIFS. 4,5 M de clients, 650 M$ de recompenses, 140 pays, 300 employes. Declarations de la firme sur elle-meme, publiables uniquement avec la mention "selon FTMO".',
    'FREQUENCE DES RETRAITS, FRAIS DE RESET, REMBOURSEMENT, ENTITE JURIDIQUE. Non trouves.',
    'FTMO FUTURES existe en beta avec ses propres regles. Ne pas melanger aux lignes ci-dessus.',
  ],
}

// -----------------------------------------------------------------------------
// FUTURESELITE — source : futureselite.com et app.futureselite.com, 3 sept. 2026
// -----------------------------------------------------------------------------
const FUTURESELITE = {
  slug: 'futureselite',
  scalars: {
    name: 'FuturesElite',
    website_url: 'https://futureselite.com',
    affiliate_url: 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
    headquarters: 'Corso G. Matteotti 61, Latina 04100, Italie',
    country: 'Italy', price_currency: 'USD', is_regulated: false,
    regulation_details: 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italie, n 03095010595. Aucune licence de regulateur financier. Comptes de demonstration, performances hypothetiques.',
    profit_split: 90, min_price: 95, max_price: 353, is_futures: true,
    drawdown_type: 'End of Day', time_limit: 'Aucune limite de temps',
    payout_frequency: 'on-demand',
    source_url: 'https://futureselite.com',
  },
  arrays: {
    platforms: ['Tradovate', 'NinjaTrader', 'Quantower', 'ATAS', 'Volumetrica', 'DeepCharts', 'WealthCharts'],
    assets: ['Futures'],
    included_items: ['Journal et tableau de bord analytique inclus', 'Aucun frais d activation', 'Sept plateformes au choix'],
    pros: [
      'Partage des profits a 90 % sur le programme Elite',
      'Drawdown de fin de journee, aucune limite de perte journaliere',
      'Aucune regle de regularite une fois finance',
      'Aucun frais d activation pour debloquer le compte finance',
      'Retrait possible chaque jour une fois finance',
      'Remises par lot : le cinquieme compte est offert',
    ],
    cons: [
      'Aucune licence de regulateur financier',
      'Comptes de demonstration, performances hypothetiques',
      '3 jours de trading minimum en evaluation, 6 une fois finance',
      'Plafond de retrait par demande, de 1 000 a 3 000 $ selon la taille',
      'Les grilles NITRO, PRIME et INSTANT ne sont pas publiques',
    ],
    special_features: [
      '90% profit split on the Elite programme',
      'End-of-day drawdown, no daily loss limit',
      'No consistency rule once funded',
      'No activation fee to unlock the funded account',
      'Bundle discounts: the fifth account is free',
      'Instant accounts available with no evaluation',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body: "FuturesElite mise sur des conditions genereuses une fois finance : 90 % de partage, pas de regle de regularite, retrait quotidien. En echange, la firme est jeune et sans regulateur.",
      points: [
        'Convient si vous voulez un partage eleve et des retraits frequents',
        "Convient si l'absence de limite de perte journaliere vous laisse respirer",
        'Evitez si vous tenez a une firme regulee ou a un historique long',
        'Evitez si vous avez besoin de connaitre toutes les grilles avant d acheter',
      ],
    },
    program_guide: {
      title: 'Quatre programmes',
      intro: "Seul Elite a une grille publique. Les trois autres sont visibles a l'achat mais leurs prix ne sont pas exposes.",
      options: [
        {
          name: 'ELITE', badge: 'Grille publique',
          summary: 'Une evaluation en une etape, drawdown de fin de journee, aucune perte journaliere, 90 % de partage une fois finance.',
          points: ['Objectif de 5 % du capital', 'Aucune limite de perte journaliere', '3 jours de trading minimum', 'Aucun frais d activation'],
        },
        {
          name: 'PRIME', badge: 'Le moins cher',
          summary: "Presente comme la voie d'entree la moins chere, avec jusqu a 10 comptes groupes et 1,5 M$ de capital cumule.",
          points: ['Jusqu a 10 comptes groupes', 'Validation possible en un jour', 'Grille tarifaire non publique'],
        },
      ],
    },
    key_rules: {
      title: 'Les regles qui decident',
      intro: 'Ce qui distingue vraiment FuturesElite des autres firmes futures.',
      rules: [
        { title: 'Aucune limite de perte journaliere', detail: "Ni en evaluation ni une fois finance. Le risque est encadre par la seule Maximum Loss Limit, recalculee en fin de journee." },
        { title: 'Drawdown de fin de journee', detail: "La limite se met a jour une fois par jour sur le solde de cloture, pas en continu. Une position en perte latente ne declenche pas la limite tant que la journee n est pas close." },
        { title: 'Aucune regle de regularite une fois finance', detail: "La regle s applique pendant l evaluation, puis disparait sur le compte finance. La page affiche deux valeurs cote a cote, 40 % et 50 %, sans preciser laquelle s applique : a confirmer aupres du partenaire." },
        { title: 'Aucun frais d activation', detail: "Passer l evaluation suffit a ouvrir le compte finance. Les frais de reset, eux, existent : de 79 a 229 $ selon la taille." },
      ],
      more: [
        'Retrait possible chaque jour une fois finance',
        '6 jours de trading minimum avant un retrait',
        'Aucun buffer de profit',
        'Sept plateformes au choix',
        'Le cinquieme compte d un lot est offert',
      ],
    },
    journey: {
      title: 'Ce qui se passe apres le paiement',
      intro: "Une seule etape d'evaluation, puis le compte finance s'ouvre immediatement.",
      steps: [
        { title: 'Evaluation', detail: "Atteindre l'objectif de profit sans franchir la Maximum Loss Limit, sur au moins 3 jours de trading. Aucune limite de temps." },
        { title: 'Compte finance', detail: "Ouvert des la validation, sans frais d'activation. La regle de regularite disparait a ce stade." },
        { title: 'Retraits', detail: "Possibles chaque jour, apres 6 jours de trading, dans la limite du plafond par demande : 1 000 $ sur un 25K, jusqu a 3 000 $ sur un 150K." },
        { title: 'Cumul de comptes', detail: "Elite plafonne a 5 comptes finances. En empilant un programme de meme taille, jusqu a 10 comptes en parallele." },
      ],
    },
    cost_timeline: {
      title: 'Ce que vous paierez',
      intro: 'Les couts n arrivent pas tous au meme moment.',
      steps: [
        { label: 'A l achat', title: 'Frais unique', detail: "De 95 $ pour un 25K a 353 $ pour un 150K, hors remise. Aucun abonnement." },
        { label: 'En cas d echec', title: 'Reset optionnel', detail: "De 79 $ sur un 25K a 229 $ sur un 150K. Reprendre a zero n est jamais obligatoire." },
        { label: 'A la validation', title: 'Aucun frais d activation', detail: "Le compte finance s ouvre sans paiement supplementaire." },
        { label: 'Au retrait', title: 'Plafond par demande', detail: "De 1 000 a 3 000 $ selon la taille du compte, avec 90 % pour vous." },
      ],
    },
  },
  challenges: [
    ['futureselite-elite-25k', 'Elite $25K', '$25K', '1 step', 1000, null, 1250, null, 'End of Day', 'Trailing', 95, null],
    ['futureselite-elite-50k', 'Elite $50K', '$50K', '1 step', 2000, null, 3000, null, 'End of Day', 'Trailing', 153, null],
    ['futureselite-elite-100k', 'Elite $100K', '$100K', '1 step', 3000, null, 6000, null, 'End of Day', 'Trailing', 293, null],
    ['futureselite-elite-150k', 'Elite $150K', '$150K', '1 step', 4500, null, 9000, null, 'End of Day', 'Trailing', 353, null],
  ],
  consistency: {
    '1 step': 'Evaluation : 3 jours de trading minimum et une regle de regularite. Aucune regle de regularite une fois finance. Aucun frais d activation.',
  },
  payout: {
    'futureselite-elite-25k': 'Une fois finance : 90 % de partage, plafond de retrait 1 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 79 $.',
    'futureselite-elite-50k': 'Une fois finance : 90 % de partage, plafond de retrait 2 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 89 $.',
    'futureselite-elite-100k': 'Une fois finance : 90 % de partage, plafond de retrait 2 500 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 159 $.',
    'futureselite-elite-150k': 'Une fois finance : 90 % de partage, plafond de retrait 3 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 229 $.',
  },
  riskUnit: 'usd',
  notes: [
    'LE CODE PROMO. SCANNED donne -20 %, confirme par email par FuturesElite. Mais un coupon SUMMER s active seul et donne -25 % : sur l Elite 25K, 71,25 $ contre 76,00 $. Annoncer le code ferait payer plus cher. discount_code et discount_percent restent nuls, l UPDATE est prepare en commentaire.',
    'NITRO, PRIME, INSTANT. Les trois programmes existent mais leur grille est derriere une authentification. NITRO : paiements quotidiens, pas de perte journaliere. PRIME : le moins cher, jusqu a 10 comptes, 1,5 M$ cumules. INSTANT : aucune evaluation, 80 % de partage.',
    'REGLE DE REGULARITE. La page affiche 40 % et 50 % cote a cote sans dire laquelle s applique. Decrite en toutes lettres, sans chiffre invente.',
    'LE LOGO. logo_url pointe encore sur une favicon Google. Leur equipe indique de prendre le logo sur leur profil X. A telecharger dans public/logos/futureselite.png puis mettre a jour logo_url.',
    'TRUSTPILOT. Les compteurs de leur page d accueil affichent tous zero. trustpilot_rating laisse tel quel plutot que d ecrire un zero trompeur.',
    'PRESELECTION DU PLAN PAR URL. Leur application ne lit que aff, ref, coupon et type. Aucun parametre de taille. Le lien preremplit l affiliation et le coupon ; le visiteur choisit son plan sur place.',
  ],
}

// -----------------------------------------------------------------------------
// THE5ERS — source : mentions legales officielles et Summer Plan, 3 sept. 2026
// -----------------------------------------------------------------------------
const THE5ERS = {
  slug: 'the5ers',
  scalars: {
    name: 'The5ers', founded_year: 2016,
    headquarters: 'Enstar House, 168 Praed Street, Londres W2 1RH, Royaume-Uni',
    country: 'United Kingdom', price_currency: 'USD', is_regulated: false,
    regulation_details: 'FIVE PERCENT ONLINE LTD, societe britannique n 12553363. Aucune licence de regulateur financier. Environnement de trading entierement simule, les fonds d evaluation sont fictifs.',
    trustpilot_rating: 4.7, min_price: 249, max_allocation: '$4,000,000',
    is_futures: false, drawdown_type: 'Varie selon le programme',
    time_limit: 'Aucune limite de temps',
    source_url: 'https://the5ers.com/faqs/',
  },
  arrays: {
    platforms: ['MetaTrader 5', 'cTrader'],
    pros: [
      'En activite depuis 2016',
      'Capital finance maximum de 4 000 000 $, parmi les plus eleves',
      'Entite britannique identifiee : FIVE PERCENT ONLINE LTD, n 12553363',
      'Duree illimitee sur le plan documente',
    ],
    cons: [
      'Les traders americains ne sont pas acceptes',
      '31 territoires exclus, dont les Etats-Unis et Israel',
      'Aucune licence de regulateur financier',
      'Environnement entierement simule : les fonds ne sont pas du capital reel',
      'Un seul programme sur quatre a des parametres publies officiellement',
    ],
    special_features: [
      'US traders are not accepted',
      'Simulated trading environment: evaluation funds are not real capital',
      'Part of the 5% Group, alongside Trade The Pool, Trade Delicious, TSG Brokers and The5ers Futures',
      'Maximum funded capital $4,000,000',
      '31 restricted territories, including the United States and Israel',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body: "The5ers affiche le plus haut plafond de capital du comparatif, mais ferme le marche americain et ne publie les parametres complets que d'un seul de ses quatre programmes.",
      points: [
        'Convient si vous visez un capital eleve a terme',
        'Convient si vous etes hors des 31 territoires exclus',
        'Evitez si vous tradez depuis les Etats-Unis : la firme ne vous acceptera pas',
        'Evitez si vous voulez comparer toutes les grilles avant d acheter',
      ],
    },
    key_rules: {
      title: 'Les regles qui decident',
      intro: 'Ce qui est etabli, et ce qui ne l est pas.',
      rules: [
        { title: 'Les traders americains ne sont pas acceptes', detail: "La liste officielle compte 31 territoires exclus, dont les Etats-Unis et Israel, alors meme qu une partie de l equipe y est basee." },
        { title: 'Environnement entierement simule', detail: "Les mentions legales sont explicites : les fonds d evaluation sont fictifs. Une analyse concurrente affirme l inverse ; c est l officiel qui fait foi." },
        { title: 'Le partage n est pas de 100 %', detail: "Sur le plan documente officiellement, la repartition est de 75 % pour le trader. Le 100 % annonce par la communication generale est un plafond atteignable, pas un taux de depart." },
        { title: 'Aucun regulateur', detail: "FIVE PERCENT ONLINE LTD est une societe britannique enregistree, mais sans licence de regulateur financier. La firme se decrit elle-meme hors du champ des autorites." },
      ],
      more: [
        'Duree illimitee sur le plan documente',
        'Perte maximale 6 %, perte journaliere 3 %',
        'Retrait minimum 250 $, plafond 2 000 $',
        'Remboursement des frais a partir du 3e retrait',
        'Deux comptes actifs maximum',
      ],
    },
  },
  challenges: [
    ['the5ers-summer-plan-1-step-100k', 'The5ers Summer Plan 1 Step 100K', '$100K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 249, null],
  ],
  consistency: {
    '1 step': 'Regularite 50 % par jour. Duree illimitee. 2 comptes actifs maximum.',
  },
  payout: {
    'the5ers-summer-plan-1-step-100k': 'Retrait minimum 250 $, plafond 2 000 $. Remboursement des frais a partir du 3e retrait. Bonus 10 %. Partage 75 %.',
  },
  profitSplitPerChallenge: 75,
  riskUnit: 'percent',
  notes: [
    'TROIS PROGRAMMES SUR QUATRE NON PUBLIES. Growth / Hyper Growth, High Stakes Classic et Bootcamp : leurs regles et prix viennent de TheTrustedProp, une analyse concurrente, explicitement non confirmee sur le site officiel. Non ecrits.',
    'min_price = 249. C est le seul prix officiellement source. Les entrees a 22 $ et 39 $ viennent de TheTrustedProp. Consequence : The5ers apparait plus chere qu elle ne l est. Verifier sur the5ers.com/high-stakes/ et /bootcamp/ puis completer.',
    'COMMISSIONS. TheTrustedProp donne forex et metaux 4 $/lot, indices 2 $/lot, crypto gratuit. PropFirmMatch dit l inverse : crypto 0,06 %/lot, indices gratuit. Incompatibles, rien n est ecrit.',
    'RETRAIT MINIMUM. 150 $ selon TheTrustedProp, 250 $ sur le plan officiel. Seul le 250 $ est ecrit.',
    'CHIFFRES DECLARATIFS. 262 000 traders finances, 171 employes, 80 M$ verses. Declarations de la firme, publiables uniquement avec la mention "selon The5ers".',
    'DEGRADATION DES RETRAITS. TheTrustedProp documente des delais de 10 a 15 jours ouvres en 2026 contre 2 a 4 annonces. Observation datee d un tiers, pas une propriete permanente : a attribuer et dater si publiee.',
    'discount_code GDSWCVRTE7 deja en base, origine inconnue, absent du dossier. A confirmer contre le panneau partenaire ou retirer.',
  ],
}

// -----------------------------------------------------------------------------
// Generation
// -----------------------------------------------------------------------------
const COLS = ['id', 'slug', 'name', 'firm_name', 'firm_slug', 'account_size', 'steps',
  'max_drawdown', 'max_daily_loss', 'phase1_profit_target', 'phase2_profit_target',
  'drawdown_type', 'max_loss_type', 'profit_split', 'price', 'discounted_price',
  'payout_frequency_description', 'consistency_rule', 'allows_ea', 'allows_scalping',
  'allows_news_trading', 'billing_period', 'risk_unit']

function build(firm) {
  const L = []
  L.push('-- =============================================================================')
  L.push(`-- ${firm.scalars.name.toUpperCase()} — TOUT EN UN`)
  L.push('-- =============================================================================')
  L.push('-- Un seul copier-coller. Aucun prerequis. Toutes les commandes sont')
  L.push('-- idempotentes : rejouable sans casse.')
  L.push('--')
  L.push('-- OU LE COLLER : supabase.com -> ton projet -> SQL Editor -> New query')
  L.push('--                -> coller -> Run.')
  L.push('--')
  L.push('-- Ce fichier remplit AUSSI les colonnes editoriales JSONB (journey, key_rules,')
  L.push('-- program_guide, cost_timeline, verdict_card, pros, cons). Ce sont elles qui')
  L.push('-- donnent son epaisseur a la page : une section disparait quand sa colonne est')
  L.push('-- NULL. Sans elles, la page reste vide meme apres un import reussi.')
  L.push('-- =============================================================================')
  L.push('')
  L.push('')
  L.push('-- 1. SAUVEGARDE — lis cette sortie avant de continuer')
  L.push(`select * from prop_firms where slug = ${S(firm.slug)};`)
  L.push(`select * from prop_firm_challenges where firm_slug = ${S(firm.slug)};`)
  L.push('')
  L.push('')
  L.push('-- 2. Colonnes necessaires (sans effet si elles existent deja)')
  for (const c of ['price_currency text default \'USD\'', 'data_verified_at timestamptz',
    'data_verified_by text', 'source_url text', 'rating_checked_at timestamptz',
    'discount_status text', 'discount_starts_at timestamptz']) {
    L.push(`alter table prop_firms add column if not exists ${c};`)
  }
  L.push('')
  L.push('')
  L.push('-- 3. La firme : identite, contenu editorial, listes')
  L.push('update prop_firms set')
  const sets = []
  for (const [k, v] of Object.entries(firm.scalars)) {
    sets.push(`  ${k.padEnd(20)} = ${typeof v === 'number' ? N(v) : typeof v === 'boolean' ? String(v) : S(v)}`)
  }
  for (const [k, v] of Object.entries(firm.arrays)) sets.push(`  ${k.padEnd(20)} = ${J(v)}`)
  for (const [k, v] of Object.entries(firm.json)) sets.push(`  ${k.padEnd(20)} = ${J(v)}`)
  sets.push(`  ${'data_verified_at'.padEnd(20)} = timestamptz '2026-09-03'`)
  sets.push(`  ${'data_verified_by'.padEnd(20)} = 'PropFirmScanner'`)
  sets.push(`  ${'updated_at'.padEnd(20)} = now()`)
  L.push(sets.join(',\n'))
  L.push(`where slug = ${S(firm.slug)};`)
  L.push('')
  L.push('')
  L.push('-- 4. Les programmes — c est ce qui fait apparaitre le configurateur')
  L.push('begin;')
  L.push('')
  L.push(`delete from prop_firm_challenges where firm_slug = ${S(firm.slug)};`)
  L.push('')
  L.push(`insert into prop_firm_challenges (${COLS.join(', ')}) values`)
  const rows = firm.challenges.map(c => {
    const [slug, name, size, steps, maxDd, dailyDd, t1, t2, ddType, lossType, price, disc] = c
    const split = firm.profitSplitPerChallenge ?? (firm.scalars.profit_split ?? null)
    const payout = firm.payout?.[slug] ?? null
    return '  (' + [
      'gen_random_uuid()', S(slug), S(name), S(firm.scalars.name), S(firm.slug), S(size), S(steps),
      N(maxDd), N(dailyDd), N(t1), N(t2), S(ddType), S(lossType), N(split), N(price), N(disc),
      S(payout), S(firm.consistency[steps] ?? null), 'true', 'true', 'true', "'one-time'", S(firm.riskUnit),
    ].join(', ') + ')'
  })
  L.push(rows.join(',\n') + ';')
  L.push('')
  L.push('commit;')
  L.push('')
  L.push('')
  L.push('-- 5. CONTROLE — ces requetes disent si ca a marche')
  L.push('select slug, name, min_price, price_currency, profit_split, is_futures,')
  L.push('       (verdict_card is not null) as a_un_verdict,')
  L.push('       (key_rules is not null) as a_des_regles,')
  L.push('       (journey is not null) as a_un_parcours,')
  L.push('       jsonb_array_length(pros) as nb_pros')
  L.push(`from prop_firms where slug = ${S(firm.slug)};`)
  L.push('')
  L.push(`-- Attendu : ${firm.challenges.length} ligne(s).`)
  L.push('select name, account_size, price, max_drawdown, phase1_profit_target, profit_split')
  L.push(`from prop_firm_challenges where firm_slug = ${S(firm.slug)} order by price;`)
  L.push('')
  L.push('')
  L.push('-- =============================================================================')
  L.push('-- NON ECRIT — et pourquoi')
  L.push('-- =============================================================================')
  for (const n of firm.notes) {
    L.push('--')
    for (const line of n.match(/.{1,72}(\s|$)/g)) L.push('-- ' + line.trim())
  }
  return L.join('\n') + '\n'
}

for (const firm of [FTMO, THE5ERS, FUTURESELITE]) {
  const out = `database/RUN-${firm.slug}.sql`
  await writeFile(out, build(firm), 'utf8')
  const cols = Object.keys(firm.scalars).length + Object.keys(firm.arrays).length + Object.keys(firm.json).length
  console.log(`${out.padEnd(38)} ${String(cols).padStart(2)} colonnes · ${firm.challenges.length} challenge(s) · ${Object.keys(firm.json).length} bloc(s) editoriaux`)
}
