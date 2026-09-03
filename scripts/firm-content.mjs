// =============================================================================
// CONTENU ÉDITORIAL DES FICHES FIRMES — scripts/firm-content.mjs
// =============================================================================
// Séparé du générateur pour une raison précise : le contenu est du français
// destiné à être lu. Une première version avait été écrite sans accents pour
// contourner des soucis d'échappement dans les scripts, et la page rendait
// « regularite », « journaliere », « d activation ». Illisible.
//
// Ce fichier est édité directement, jamais généré, et l'échappement SQL est
// géré en aval par le générateur.
//
// Règle inchangée : rien n'est écrit qui ne soit sourçable. Les sources sont
// citées dans le SQL produit, et ce qui reste incertain part dans `notes`.
// =============================================================================

// -----------------------------------------------------------------------------
// FTMO — source : dossier_ftmo_the5ers.md (ftmo.com), relevé du 3 septembre 2026
// -----------------------------------------------------------------------------
export const FTMO = {
  slug: 'ftmo',
  scalars: {
    name: 'FTMO',
    founded_year: 2015,
    headquarters: 'Bureaux Quadrio, Purkyňova 2121/3, 110 00 Prague, République tchèque',
    country: 'Czech Republic',
    price_currency: 'EUR',
    is_regulated: false,
    regulation_details: null,
    trustpilot_rating: 4.8,
    min_price: 79,
    max_price: 599,
    max_allocation: '200 000 $',
    is_futures: false,
    drawdown_type: 'Variable selon le produit : glissant (1-Step) ou fixe (2-Step)',
    time_limit: 'Aucune limite de temps, sur les deux produits',
    payout_frequency: null,
    source_url: 'https://ftmo.com/fr/trading-objectives/',
  },
  arrays: {
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
    assets: ['CFD sur forex', 'Métaux', 'Indices', 'Énergie', 'Crypto', 'Matières premières', 'Actions'],
    payout_methods: ['Virement bancaire', 'Crypto', 'Skrill', 'Mastercard', 'Visa Direct'],
    included_items: [
      'MetaTrader 4, MetaTrader 5 et cTrader',
      'Tableau de bord FTMO et métriques de performance',
      'Nouvel essai gratuit après un échec en phase de vérification',
    ],
    pros: [
      'En activité depuis 2015, l’un des plus longs historiques du secteur',
      'Aucune limite de temps, ni sur le 1-Step ni sur le 2-Step',
      'Le 1-Step n’impose aucun jour de trading minimum',
      'Dépasser la règle du meilleur jour ne fait pas échouer l’évaluation',
      'Le compte Swing lève les restrictions d’actualités et de week-end une fois financé',
      'Prix en euros, à partir de 79 €',
    ],
    cons: [
      'Capital financé plafonné à 200 000 $, faible face aux spécialistes des futures',
      'Le 2-Step exige 4 jours de trading dans chaque phase',
      'Le compte financé Standard restreint les annonces et les positions de nuit',
      'Swing n’existe pas sur le 1-Step',
      'Partage des profits et conditions de scaling non confirmés sur les pages consultées',
    ],
    special_features: [
      'Deux produits aux règles réellement différentes',
      '1-Step : perte journalière de 3 % et drawdown glissant en fin de journée',
      '2-Step : perte journalière de 5 % et drawdown fixe',
      'La règle du meilleur jour ne s’applique qu’au 1-Step',
      'Aucune restriction d’actualités, de nuit ou de week-end pendant l’évaluation',
      'Paiement par carte, Apple Pay, Google Pay, PayPal, Revolut Pay, Skrill, virement ou crypto',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body:
        'FTMO vend deux produits qu’il faut distinguer avant d’acheter. Le 1-Step est plus souple sur le calendrier mais plus strict au quotidien ; le 2-Step fait l’inverse. Le capital plafonne à 200 000 $.',
      // Uniquement des raisons de choisir : la page les affiche sous
      // « Bon choix si vous recherchez ». Les réserves vivent dans `cons`.
      points: [
        'Un parcours sans contrainte de calendrier : le 1-Step n’impose aucun jour minimum',
        'Une limite journalière confortable : 5 % sur le 2-Step, contre 3 % sur le 1-Step',
        'La liberté de garder vos positions la nuit et le week-end, avec le compte Swing',
        'Un opérateur installé depuis 2015, avec MT4, MT5 et cTrader',
      ],
    },
    program_guide: {
      title: 'Deux produits, deux logiques',
      intro:
        'Les deux mènent à un compte financé. La différence tient au calendrier et à la tolérance quotidienne.',
      options: [
        {
          name: '1-Step',
          badge: 'Une seule phase',
          summary:
            'Un objectif de 10 %, aucun jour minimum, mais une limite journalière de 3 % et un drawdown qui suit vos plus hauts.',
          points: [
            'Objectif de 10 %',
            'Perte journalière de 3 %',
            'Drawdown glissant en fin de journée',
            'Meilleur jour ≤ 50 % du profit des jours positifs',
          ],
        },
        {
          name: '2-Step',
          badge: 'Deux phases',
          summary:
            'Objectif de 10 % puis 5 %, une limite journalière plus large à 5 % et un drawdown fixe, contre 4 jours de trading minimum par phase.',
          points: [
            'Objectif de 10 % puis 5 %',
            'Perte journalière de 5 %',
            'Drawdown fixe',
            '4 jours de trading minimum dans chaque phase',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Les règles qui décident',
      intro: 'Quatre points que la plupart des comparateurs rapportent mal.',
      rules: [
        {
          title: 'La perte journalière diffère selon le produit',
          detail:
            '3 % sur le 1-Step, 5 % sur le 2-Step. Plusieurs sites annoncent 5 % pour les deux : c’est faux.',
        },
        {
          title: 'Le drawdown aussi',
          detail:
            'Le 1-Step utilise un drawdown glissant recalculé chaque jour à minuit : il monte avec votre plus haut solde de clôture et ne redescend jamais. Le 2-Step est en drawdown fixe.',
        },
        {
          title: 'Dépasser la règle du meilleur jour n’est pas une infraction',
          detail:
            'Sur le 1-Step, votre meilleure journée doit rester sous 50 % du profit des jours positifs. Au-dessus, vous continuez simplement à trader jusqu’à repasser dessous. C’est une condition de validation, pas un couperet.',
        },
        {
          title: 'Standard et Swing ne se distinguent que sur le compte financé',
          detail:
            'Pendant l’évaluation, aucune restriction sur les annonces macro ni sur les positions de nuit ou de week-end. Sur le compte financé, le Standard restreint les deux ; le Swing ne restreint rien. Swing n’existe pas sur le 1-Step.',
        },
      ],
      more: [
        'Aucune limite de temps sur les deux produits',
        'Aucun jour minimum sur le 1-Step',
        '4 jours de trading minimum par phase sur le 2-Step',
        'Plateformes MT4, MT5 et cTrader',
        'Prix affichés en euros',
      ],
    },
    journey: {
      title: 'Ce qui se passe après le paiement',
      intro: 'Le parcours diffère selon le produit choisi.',
      steps: [
        {
          title: 'Évaluation',
          detail:
            'Une phase sur le 1-Step, deux sur le 2-Step. Aucune restriction sur les annonces, les positions de nuit ou de week-end à ce stade.',
        },
        {
          title: 'Vérification',
          detail:
            'Uniquement sur le 2-Step : un second objectif de 5 %, avec les mêmes limites de risque.',
        },
        {
          title: 'Compte FTMO',
          detail:
            'Le compte financé. C’est ici que le type Standard ou Swing change quelque chose : le Standard restreint les annonces et les positions de nuit, le Swing non.',
        },
        {
          title: 'Retraits et scaling',
          detail:
            'Un plan de croissance existe, mais ses conditions exactes ne sont pas confirmées sur les pages consultées. À vérifier avant de s’engager dessus.',
        },
      ],
    },
  },
  challenges: [
    ['ftmo-1-step-10k', 'FTMO 1-Step 10K', '$10K', '1 step', 10, 3, 10, null, 'Glissant en fin de journée', 'Trailing', 79, null],
    ['ftmo-1-step-25k', 'FTMO 1-Step 25K', '$25K', '1 step', 10, 3, 10, null, 'Glissant en fin de journée', 'Trailing', 199, null],
    ['ftmo-1-step-50k', 'FTMO 1-Step 50K', '$50K', '1 step', 10, 3, 10, null, 'Glissant en fin de journée', 'Trailing', 319, null],
    ['ftmo-1-step-100k', 'FTMO 1-Step 100K', '$100K', '1 step', 10, 3, 10, null, 'Glissant en fin de journée', 'Trailing', 499, 399.2],
    ['ftmo-2-step-standard-25k', 'FTMO 2-Step Standard 25K', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 250, null],
    ['ftmo-2-step-swing-10k', 'FTMO 2-Step Swing 10K', '$10K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 99, null],
    ['ftmo-2-step-swing-25k', 'FTMO 2-Step Swing 25K', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 279, null],
    ['ftmo-2-step-swing-50k', 'FTMO 2-Step Swing 50K', '$50K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 379, null],
    ['ftmo-2-step-swing-100k', 'FTMO 2-Step Swing 100K', '$100K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 599, null],
  ],
  consistency: {
    '1 step':
      'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum.',
    '2 steps':
      'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase.',
  },
  riskUnit: 'percent',
  notes: [
    'PARTAGE DES PROFITS. 80 % de base, 90 % via le scaling selon les sources, certaines annonçant 90 % d’emblée sur le 1-Step. Non confirmé sur les pages officielles consultées. profit_split reste null : mieux vaut une case vide qu’un chiffre faux.',
    'LEVIER, COMMISSIONS, CEO, ACQUISITION D’OANDA. Source PropFirmMatch, un concurrent. Non écrits.',
    'CHIFFRES DÉCLARATIFS. 4,5 M de clients, 650 M$ de récompenses, 140 pays, 300 employés. Déclarations de la firme sur elle-même, publiables uniquement avec la mention « selon FTMO ».',
    'FICHE D’INTAKE. PropFirmScanner_FTMO_PREFILLED.xlsx porte 37 mentions TO VERIFY : profit split, objectifs, pertes, jours minimum, règle de régularité, frais de reset, remboursement, entité juridique, taux d’affiliation. Elle est préremplie depuis les mêmes sources que le dossier, pas confirmée par FTMO. À leur envoyer telle quelle.',
    'TRADINGVIEW. La fiche d’intake le liste comme plateforme disponible, le dossier le donne « en cours d’intégration » en août 2026. Conflit non résolu : non écrit dans platforms.',
    'FTMO FUTURES existe en bêta avec ses propres règles. Ne pas mélanger aux lignes ci-dessus.',
  ],
}

// -----------------------------------------------------------------------------
// FUTURESELITE — source : futureselite.com et app.futureselite.com, 3 sept. 2026
// -----------------------------------------------------------------------------
export const FUTURESELITE = {
  slug: 'futureselite',
  scalars: {
    name: 'FuturesElite',
    website_url: 'https://futureselite.com',
    affiliate_url:
      'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
    headquarters: 'Corso G. Matteotti 61, Latina 04100, Italie',
    country: 'Italy',
    price_currency: 'USD',
    is_regulated: false,
    regulation_details:
      'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italie, n° 03095010595. Aucune licence de régulateur financier. Comptes de démonstration, performances hypothétiques.',
    profit_split: 90,
    min_price: 95,
    max_price: 353,
    is_futures: true,
    drawdown_type: 'Fin de journée',
    time_limit: 'Aucune limite de temps',
    payout_frequency: 'on-demand',
    source_url: 'https://futureselite.com',
  },
  arrays: {
    platforms: ['Tradovate', 'NinjaTrader', 'Quantower', 'ATAS', 'Volumetrica', 'DeepCharts', 'WealthCharts'],
    assets: ['Futures'],
    included_items: [
      'Journal de trading et tableau de bord analytique',
      'Aucun frais d’activation du compte financé',
      'Sept plateformes au choix',
    ],
    pros: [
      'Partage des profits à 90 % sur le programme Elite',
      'Drawdown de fin de journée, sans aucune limite de perte journalière',
      'Aucune règle de régularité une fois financé',
      'Aucun frais d’activation pour débloquer le compte financé',
      'Retrait possible chaque jour une fois financé',
      'Remises par lot : le cinquième compte est offert',
    ],
    cons: [
      'Aucune licence de régulateur financier',
      'Comptes de démonstration, performances hypothétiques',
      '3 jours de trading minimum en évaluation, 6 une fois financé',
      'Plafond de retrait par demande, de 1 000 à 3 000 $ selon la taille',
      'Les grilles Nitro, Prime et Instant ne sont pas publiques',
    ],
    special_features: [
      'Partage des profits à 90 % sur le programme Elite',
      'Drawdown de fin de journée, aucune limite de perte journalière',
      'Aucune règle de régularité une fois financé',
      'Aucun frais d’activation du compte financé',
      'Remises par lot : le cinquième compte est offert',
      'Comptes Instant disponibles, sans évaluation',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body:
        'FuturesElite mise sur des conditions généreuses une fois financé : 90 % de partage, aucune règle de régularité, retrait quotidien. En échange, la firme est jeune, sans régulateur, et ne publie qu’une seule de ses quatre grilles.',
      points: [
        'Un partage élevé et des retraits fréquents, sans attendre une échéance',
        'Une évaluation sans limite de perte journalière, qui laisse respirer',
        'Un compte financé qui s’ouvre sans frais d’activation',
        'La possibilité d’empiler jusqu’à dix comptes en parallèle',
      ],
    },
    program_guide: {
      title: 'Le programme Elite',
      intro:
        'Elite est le seul programme dont la grille tarifaire est publique. Nitro, Prime et Instant existent à l’achat, mais leurs prix ne sont pas exposés.',
      options: [
        {
          name: 'Elite',
          badge: 'Grille publique',
          summary:
            'Une évaluation en une étape, un drawdown de fin de journée, aucune perte journalière, et 90 % de partage une fois financé.',
          points: [
            'Objectif de 5 % du capital',
            'Aucune limite de perte journalière',
            '3 jours de trading minimum',
            'Aucun frais d’activation',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Les règles qui décident',
      intro: 'Ce qui distingue vraiment FuturesElite des autres firmes futures.',
      rules: [
        {
          title: 'Aucune limite de perte journalière',
          detail:
            'Ni pendant l’évaluation, ni une fois financé. Le risque est encadré par la seule Maximum Loss Limit, recalculée en fin de journée. C’est l’argument principal de la firme, pas une donnée manquante.',
        },
        {
          title: 'Drawdown de fin de journée',
          detail:
            'La limite se met à jour une fois par jour sur le solde de clôture, pas en continu. Une position en perte latente ne déclenche donc pas la limite tant que la journée n’est pas close.',
        },
        {
          title: 'Aucune règle de régularité une fois financé',
          detail:
            'La règle s’applique pendant l’évaluation puis disparaît sur le compte financé. La page de vente affiche deux valeurs côte à côte, 40 % et 50 %, sans préciser laquelle s’applique : à confirmer auprès du partenaire.',
        },
        {
          title: 'Aucun frais d’activation',
          detail:
            'Passer l’évaluation suffit à ouvrir le compte financé. Les frais de reset, eux, existent : de 79 à 229 $ selon la taille.',
        },
      ],
      more: [
        'Retrait possible chaque jour une fois financé',
        '6 jours de trading minimum avant un retrait',
        'Aucun buffer de profit exigé',
        'Sept plateformes au choix, dont Tradovate et NinjaTrader',
        'Le cinquième compte d’un lot est offert',
      ],
    },
    journey: {
      title: 'Ce qui se passe après le paiement',
      intro: 'Une seule étape d’évaluation, puis le compte financé s’ouvre immédiatement.',
      steps: [
        {
          title: 'Évaluation',
          detail:
            'Atteindre l’objectif de profit sans franchir la Maximum Loss Limit, sur au moins 3 jours de trading. Aucune limite de temps.',
        },
        {
          title: 'Compte financé',
          detail:
            'Ouvert dès la validation, sans frais d’activation. La règle de régularité disparaît à ce stade.',
        },
        {
          title: 'Retraits',
          detail:
            'Possibles chaque jour, après 6 jours de trading, dans la limite du plafond par demande : 1 000 $ sur un 25K, jusqu’à 3 000 $ sur un 150K.',
        },
        {
          title: 'Cumul de comptes',
          detail:
            'Elite plafonne à 5 comptes financés. En empilant un programme de même taille, jusqu’à 10 comptes en parallèle.',
        },
      ],
    },
    cost_timeline: {
      title: 'Ce que vous paierez',
      intro: 'Les coûts n’arrivent pas tous au même moment.',
      steps: [
        {
          label: 'À l’achat',
          title: 'Frais unique',
          detail: 'De 95 $ pour un 25K à 353 $ pour un 150K, hors remise. Aucun abonnement.',
        },
        {
          label: 'En cas d’échec',
          title: 'Reset optionnel',
          detail: 'De 79 $ sur un 25K à 229 $ sur un 150K. Reprendre à zéro n’est jamais obligatoire.',
        },
        {
          label: 'À la validation',
          title: 'Aucun frais d’activation',
          detail: 'Le compte financé s’ouvre sans paiement supplémentaire.',
        },
        {
          label: 'Au retrait',
          title: 'Plafond par demande',
          detail: 'De 1 000 à 3 000 $ selon la taille du compte, avec 90 % pour vous.',
        },
      ],
    },
  },
  challenges: [
    ['futureselite-elite-25k', 'Elite $25K', '$25K', '1 step', 1000, null, 1250, null, 'Fin de journée', 'Trailing', 95, null],
    ['futureselite-elite-50k', 'Elite $50K', '$50K', '1 step', 2000, null, 3000, null, 'Fin de journée', 'Trailing', 153, null],
    ['futureselite-elite-100k', 'Elite $100K', '$100K', '1 step', 3000, null, 6000, null, 'Fin de journée', 'Trailing', 293, null],
    ['futureselite-elite-150k', 'Elite $150K', '$150K', '1 step', 4500, null, 9000, null, 'Fin de journée', 'Trailing', 353, null],
  ],
  consistency: {
    '1 step':
      'Évaluation : 3 jours de trading minimum et une règle de régularité. Aucune règle de régularité une fois financé. Aucune limite de perte journalière. Aucun frais d’activation.',
  },
  payout: {
    'futureselite-elite-25k':
      'Une fois financé : 90 % de partage, plafond de retrait 1 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 79 $.',
    'futureselite-elite-50k':
      'Une fois financé : 90 % de partage, plafond de retrait 2 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 89 $.',
    'futureselite-elite-100k':
      'Une fois financé : 90 % de partage, plafond de retrait 2 500 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 159 $.',
    'futureselite-elite-150k':
      'Une fois financé : 90 % de partage, plafond de retrait 3 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer. Reset 229 $.',
  },
  riskUnit: 'usd',
  notes: [
    'LE CODE PROMO. SCANNED donne −20 %, confirmé par e-mail par FuturesElite. Mais un coupon SUMMER s’active seul et donne −25 % : sur l’Elite 25K, 71,25 $ contre 76,00 $. Annoncer le code ferait payer plus cher. discount_code et discount_percent restent nuls, l’UPDATE est préparé en commentaire.',
    'NITRO, PRIME, INSTANT. Les trois programmes existent mais leur grille est derrière une authentification. Ils ne figurent pas dans program_guide : une option sans prix ni challenge donne un bouton mort dans le configurateur. Nitro : paiements quotidiens, pas de perte journalière. Prime : le moins cher, jusqu’à 10 comptes, 1,5 M$ cumulés. Instant : aucune évaluation, 80 % de partage.',
    'RÈGLE DE RÉGULARITÉ. La page affiche 40 % et 50 % côte à côte sans dire laquelle s’applique. Décrite en toutes lettres, sans chiffre inventé.',
    'LE LOGO. logo_url pointe encore sur une favicon Google. Leur équipe indique de prendre le logo sur leur profil X. À télécharger dans public/logos/futureselite.png puis mettre à jour logo_url.',
    'TRUSTPILOT. Les compteurs de leur page d’accueil affichent tous zéro. trustpilot_rating laissé tel quel plutôt que d’écrire un zéro trompeur.',
    'PRÉSÉLECTION DU PLAN PAR URL. Leur application ne lit que aff, ref, coupon et type. Aucun paramètre de taille. Le lien préremplit l’affiliation et le coupon ; le visiteur choisit son plan sur place.',
  ],
}

// -----------------------------------------------------------------------------
// THE5ERS — mentions légales officielles, Summer Plan, et fiche d'intake
// -----------------------------------------------------------------------------
export const THE5ERS = {
  slug: 'the5ers',
  scalars: {
    name: 'The5ers',
    founded_year: 2016,
    headquarters: 'Enstar House, 168 Praed Street, Londres W2 1RH, Royaume-Uni',
    country: 'United Kingdom',
    price_currency: 'USD',
    is_regulated: false,
    regulation_details:
      'FIVE PERCENT ONLINE LTD, société britannique n° 12553363. Aucune licence de régulateur financier. Environnement de trading entièrement simulé : les fonds d’évaluation sont fictifs.',
    trustpilot_rating: 4.7,
    min_price: 22,
    max_price: 850,
    max_allocation: '670 000 $ par trader, jusqu’à 4 000 000 $ via le plan de croissance',
    is_futures: false,
    drawdown_type: 'Variable selon le programme',
    time_limit: 'Aucune limite de temps',
    payout_frequency: 'bi-weekly',
    source_url: 'https://the5ers.com/faqs/',
  },
  arrays: {
    platforms: ['MetaTrader 5', 'cTrader'],
    assets: ['CFD sur forex', 'Indices', 'Matières premières', 'Crypto'],
    pros: [
      'En activité depuis 2016',
      'Entrée à partir de 22 $ avec le Bootcamp',
      'Le plan de croissance peut mener jusqu’à 4 000 000 $',
      'Entité britannique identifiée : FIVE PERCENT ONLINE LTD, n° 12553363',
      'Positions de nuit et de week-end autorisées sur tous les programmes',
    ],
    cons: [
      'Les traders américains ne sont pas acceptés',
      '31 territoires exclus, dont les États-Unis et Israël',
      'Aucune licence de régulateur financier',
      'Environnement entièrement simulé : les fonds ne sont pas du capital réel',
      'Partage des profits non confirmé, sauf sur le Summer Plan',
    ],
    special_features: [
      'Les traders américains ne sont pas acceptés',
      'Environnement de trading simulé : les fonds d’évaluation sont fictifs',
      'Membre du 5% Group, avec Trade The Pool, Trade Delicious et TSG Brokers',
      'Quatre programmes, de 22 $ à 850 $',
      '31 territoires exclus, dont les États-Unis et Israël',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body:
        'Quatre programmes très différents, du Bootcamp à 22 $ au Hyper Growth à 850 $. Le point commun : les traders américains ne sont pas acceptés, et le partage des profits n’est confirmé que sur un seul plan.',
      points: [
        'Une entrée très bon marché : le Bootcamp démarre à 22 $',
        'Un plafond de capital élevé, jusqu’à 4 000 000 $ par la croissance',
        'Le choix entre une, deux ou trois étapes selon votre tolérance',
        'Les positions de nuit et de week-end autorisées partout',
      ],
    },
    program_guide: {
      title: 'Quatre chemins vers un compte financé',
      intro: 'Ils ne se distinguent pas par le prix, mais par la contrainte quotidienne.',
      options: [
        {
          name: 'High Stakes Classic',
          badge: 'Deux étapes',
          summary:
            'L’offre principale : objectif de 8 % puis 5 %, perte journalière de 5 % calculée sur le plus élevé du solde ou de l’equity, et frais remboursés à la réussite.',
          points: ['De 5K à 100K, de 39 à 545 $', 'Objectif 8 % puis 5 %', '3 jours rentables par phase', 'Frais remboursés à la réussite'],
        },
        {
          name: 'Bootcamp',
          badge: 'Le moins cher',
          summary:
            'Trois paliers de 20K à 250K, avec un objectif de 6 % à chaque étape. En échange, un levier de 1:10 et un stop-loss obligatoire.',
          points: ['À partir de 22 $', 'Objectif de 6 % par palier', 'Levier limité à 1:10', 'Stop-loss sous 3 minutes, risque de 2 % maximum'],
        },
        {
          name: 'Hyper Growth',
          badge: 'Une seule étape',
          summary:
            'Aucun jour minimum, et une pause à 3 % qui verrouille le compte jusqu’au lendemain au lieu de l’éliminer. Le compte double à chaque palier de 10 %.',
          points: ['De 5K à 20K, de 260 à 850 $', 'Aucun jour minimum', 'Pause journalière, pas d’élimination', 'Le compte double à chaque 10 %'],
        },
        {
          name: 'Pro Growth',
          badge: 'Une seule étape',
          summary: 'Le même format en une étape, nettement moins cher, contre 3 jours rentables exigés.',
          points: ['De 5K à 50K, de 52 à 329 $', 'Objectif de 10 %', '3 jours rentables', 'Prix remisés sur plusieurs tailles'],
        },
      ],
    },
    key_rules: {
      title: 'Les règles qui décident',
      intro: 'Ce qui est établi, et ce qui ne l’est pas.',
      rules: [
        {
          title: 'Les traders américains ne sont pas acceptés',
          detail:
            'La liste officielle compte 31 territoires exclus, dont les États-Unis et Israël, alors même qu’une partie de l’équipe y est basée.',
        },
        {
          title: 'Environnement entièrement simulé',
          detail:
            'Les mentions légales sont explicites : les fonds d’évaluation sont fictifs. Une analyse concurrente affirme l’inverse ; c’est l’officiel qui fait foi.',
        },
        {
          title: 'Le partage n’est pas de 100 %',
          detail:
            'Sur le seul plan documenté officiellement, la répartition est de 75 % pour le trader. Le « jusqu’à 100 % » de la communication générale est un plafond atteignable, pas un taux de départ.',
        },
        {
          title: 'Aucun régulateur',
          detail:
            'FIVE PERCENT ONLINE LTD est une société britannique enregistrée, mais sans licence de régulateur financier. La firme se décrit elle-même hors du champ des autorités.',
        },
      ],
      more: [
        'Aucune limite de temps sur les quatre programmes',
        'Retraits toutes les deux semaines',
        'Positions de nuit et de week-end autorisées',
        'Vos propres EA autorisés, ceux de tiers interdits',
        'Scalping manuel autorisé, tick scalping interdit',
      ],
    },
  },
  challenges: [
    ['the5ers-high-stakes-5k', 'High Stakes Classic $5K', '$5K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', 39, null],
    ['the5ers-high-stakes-10k', 'High Stakes Classic $10K', '$10K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', 78, null],
    ['the5ers-high-stakes-25k', 'High Stakes Classic $25K', '$25K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', 195, null],
    ['the5ers-high-stakes-50k', 'High Stakes Classic $50K', '$50K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', 309, null],
    ['the5ers-high-stakes-100k', 'High Stakes Classic $100K', '$100K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', 545, null],
    ['the5ers-bootcamp-20k', 'Bootcamp $20K', '$20K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', 22, null],
    ['the5ers-bootcamp-100k', 'Bootcamp $100K', '$100K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', 95, null],
    ['the5ers-bootcamp-250k', 'Bootcamp $250K', '$250K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', 225, null],
    ['the5ers-hyper-growth-5k', 'Hyper Growth $5K', '$5K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 260, null],
    ['the5ers-hyper-growth-10k', 'Hyper Growth $10K', '$10K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 450, null],
    ['the5ers-hyper-growth-20k', 'Hyper Growth $20K', '$20K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 850, null],
    ['the5ers-pro-growth-5k', 'Pro Growth $5K', '$5K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 52, 46.8],
    ['the5ers-pro-growth-10k', 'Pro Growth $10K', '$10K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 98, 88.2],
    ['the5ers-pro-growth-20k', 'Pro Growth $20K', '$20K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 189, null],
    ['the5ers-pro-growth-50k', 'Pro Growth $50K', '$50K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 329, 296.1],
    ['the5ers-summer-plan-100k', 'Summer Plan 1 Step $100K', '$100K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 249, null],
  ],
  consistency: {
    '1 step':
      'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.',
    '2 steps':
      '3 jours rentables minimum par phase. Frais remboursés à la réussite de l’évaluation. Aucun ordre 2 minutes avant ou après une annonce à fort impact.',
    '3 steps':
      'Stop-loss obligatoire dans les 3 minutes, risque de 2 % maximum par position. Levier limité à 1:10, nettement plus bas que sur les autres programmes.',
  },
  payout: {
    'the5ers-summer-plan-100k':
      'Retrait minimum 250 $, plafond 2 000 $. Remboursement des frais à partir du 3ᵉ retrait. Bonus de 10 %. Partage de 75 %.',
  },
  riskUnit: 'percent',
  notes: [
    'PARTAGE DES PROFITS : profit_split reste NULL, et c’est le trou le plus visible de cette fiche. La fiche d’intake annonce « 80% to 100% » sur High Stakes et TO VERIFY partout ailleurs ; seul le Summer Plan officiel donne un chiffre ferme, 75 %. Publier 80 ou 100 serait reprendre une fourchette non confirmée. C’est LE champ à faire confirmer par The5ers en priorité : une firme sans partage affiché est illisible sur une page comparative.',
    'ORIGINE DES PRIX ET DES RÈGLES. La fiche PropFirmScanner_The5ers_PREFILLED.xlsx est préremplie depuis les mêmes sources tierces que le dossier, pas confirmée par la firme : elle porte encore 24 mentions TO VERIFY. Les prix des quatre programmes y recoupent toutefois le dossier sur deux sources indépendantes, ce qui les rend nettement plus sûrs que le reste.',
    'COMMISSIONS. TheTrustedProp donne forex et métaux à 4 $/lot, indices 2 $/lot, crypto gratuit. PropFirmMatch dit l’inverse : crypto 0,06 %/lot, indices gratuit. Incompatibles, rien n’est écrit.',
    'RETRAIT MINIMUM. 150 $ selon TheTrustedProp, 250 $ sur le plan officiel. Seul le 250 $ est écrit, sur le challenge concerné.',
    'CHIFFRES DÉCLARATIFS. 262 000 traders financés, 171 employés, 80 M$ versés. Déclarations de la firme, publiables uniquement avec la mention « selon The5ers ».',
    'DÉGRADATION DES RETRAITS. TheTrustedProp documente des délais de 10 à 15 jours ouvrés en 2026 contre 2 à 4 annoncés. Observation datée d’un tiers, pas une propriété permanente : à attribuer et dater si publiée.',
    'discount_code GDSWCVRTE7 déjà en base, origine inconnue, absent du dossier. À confirmer contre le panneau partenaire ou retirer.',
  ],
}

export const ALL_FIRMS = [FTMO, THE5ERS, FUTURESELITE]
