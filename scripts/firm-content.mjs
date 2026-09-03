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

// -----------------------------------------------------------------------------
// HANTEC TRADER
// -----------------------------------------------------------------------------
// Source : e-mail de Desiree Almeida, Partnership Manager de Hantec Trader,
// 3 septembre 2026. C'est une source de première main — la firme décrivant sa
// propre offre — donc la seule fiche de ce fichier qui ne repose sur aucun
// recoupement de tiers. Elle corrige aussi deux erreurs qu'elle a relevées
// elle-même sur notre page : le partage des profits et les règles d'actualités.
// -----------------------------------------------------------------------------
export const HANTEC = {
  slug: 'hantec-trader',
  scalars: {
    name: 'Hantec Trader',
    website_url: 'https://htrader.hmarkets.com/',
    affiliate_url: 'https://myhtrader.hmarkets.com/purchasechallenge?affiliateId=2766',
    founded_year: 2023,
    headquarters: 'Suite 201, The Catalyst Silicon Avenue, 40 Cybercity, 72201 Ebène, Maurice',
    country: 'Mauritius',
    price_currency: 'USD',
    is_regulated: false,
    regulation_details:
      'Hantec Trader Limited, société mauricienne n° C191400. Non régulée : société de trading propriétaire. Courtier partenaire : Hantec Markets Limited / Hantec Markets Mauritius.',
    profit_split: 80,
    // 95 % avec l'add-on « 95% Reward Share ». La FAQ distingue desormais le
    // taux standard du maximum ; sans max_profit_split elle annoncerait
    // « jusqu'a 80 % », ce que la firme nous a signale comme faux.
    max_profit_split: 95,
    min_price: 13,
    max_price: 2139,
    is_futures: false,
    drawdown_type:
      'Perte journalière calculée sur le plus élevé du solde ou de l’equity à la clôture de la veille. Drawdown global glissant ou statique selon le programme.',
    time_limit: 'Aucune limite de temps, sauf Instant24 : 24 heures à partir du premier trade',
    payout_frequency: 'on-request',
    source_url: 'https://htrader.hmarkets.com/',
  },
  arrays: {
    platforms: ['MetaTrader 4', 'MetaTrader 5'],
    assets: ['Forex', 'Indices', 'Matières premières', 'Métaux', 'Crypto'],
    payout_methods: ['Virement bancaire', 'Cryptomonnaie', 'Portefeuilles électroniques'],
    included_items: [
      'MetaTrader 4 et MetaTrader 5',
      'Sept programmes, de l’instantané au trois étapes',
      'Add-on 95 % de partage disponible sur six programmes',
    ],
    pros: [
      'Sept programmes couvrant l’instantané, une, deux et trois étapes',
      'Entrée à partir de 13 $ avec Instant24',
      'Partage de 80 %, porté à 95 % avec l’add-on sur six programmes',
      'Aucune limite de temps, sauf Instant24 par construction',
      'Décision de retrait sous 24 heures ouvrées pour les demandes éligibles',
      'Courtier partenaire identifié : Hantec Markets',
    ],
    cons: [
      'Non régulée : société de trading propriétaire, pas un courtier',
      'Les traders américains ne sont pas acceptés',
      '32 territoires exclus, dont l’Allemagne, la Belgique et l’Australie',
      'Le trading d’actualités est restreint par défaut, sauf Instant24',
      'Le scalping peut entraîner un ajustement des profits au-delà d’un seuil',
      'Levier limité à 1:1 sur la crypto',
    ],
    special_features: [
      'Partage de 80 %, porté à 95 % avec l’add-on 95% Reward Share',
      'Sept programmes, de Instant24 en 24 heures à Endurance en trois étapes',
      'Perte journalière calculée sur le plus élevé du solde ou de l’equity de la veille',
      'Add-on News Trading pour lever la restriction autour des annonces',
      'Levier 1:50 sur le forex, 1:15 sur indices et matières premières, 1:10 sur métaux',
      'Les traders américains ne sont pas acceptés',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body:
        'Hantec Trader propose sept programmes qui couvrent presque tous les profils, de l’instantané à 13 $ au parcours en trois étapes. Le partage démarre à 80 % et monte à 95 % avec un add-on payant. En contrepartie, la firme n’est pas régulée et ferme un nombre inhabituel de marchés.',
      points: [
        'Un choix de sept parcours, du financement instantané au trois étapes',
        'Une entrée très bon marché : Instant24 démarre à 13 $',
        'Un partage porté à 95 % si vous prenez l’add-on',
        'Un courtier partenaire identifié, adossé au groupe Hantec Markets',
      ],
    },
    program_guide: {
      title: 'Sept programmes, trois familles',
      intro:
        'Le choix se fait d’abord sur le format : financé tout de suite, ou évaluation en une, deux ou trois étapes.',
      options: [
        {
          name: 'Instant Funding',
          badge: 'Financé immédiatement',
          summary:
            'Aucune évaluation, aucun objectif. La contrepartie est le prix : 43 $ sur un 1K, jusqu’à 2 139 $ sur un 50K.',
          points: ['De 1K à 50K', 'Aucun objectif de profit', 'Perte journalière de 6 %', 'Drawdown global glissant de 6 %'],
        },
        {
          name: 'Instant Lite',
          badge: 'Financé, moins cher',
          summary:
            'La même logique à un cinquième du prix, contre une perte journalière plus serrée et 5 jours rentables par cycle de retrait.',
          points: ['De 1K à 100K, à partir de 19 $', 'Perte journalière de 3 %', 'Drawdown global de 5 %', '5 jours rentables par cycle de retrait'],
        },
        {
          name: 'Instant24',
          badge: 'Vingt-quatre heures',
          summary:
            'Le format le moins cher du catalogue : le compte vit 24 heures à partir du premier trade. C’est aussi le seul programme où le trading d’actualités est libre.',
          points: ['De 2K à 100K, à partir de 13 $', '24 heures depuis le premier trade', 'Perte journalière de 2 %', 'Trading d’actualités autorisé'],
        },
        {
          name: 'Express',
          badge: 'Une étape',
          summary:
            'Une seule phase à 10 %, sans jour minimum, avec un drawdown global glissant de 6 %.',
          points: ['De 2K à 200K, à partir de 39 $', 'Objectif de 10 %', 'Aucun jour minimum', 'Drawdown glissant de 6 %'],
        },
        {
          name: 'Enhanced',
          badge: 'Deux étapes',
          summary:
            'Objectif de 10 % puis 5 %, avec la limite journalière la plus large du catalogue et un drawdown statique.',
          points: ['De 5K à 200K, à partir de 59 $', 'Objectif 10 % puis 5 %', 'Perte journalière de 5 %', '3 jours rentables par étape'],
        },
        {
          name: 'EnhancedX',
          badge: 'Deux étapes, sans jour minimum',
          summary:
            'Des objectifs plus bas que Enhanced, 8 % puis 4 %, et aucun jour minimum, contre une limite journalière plus serrée.',
          points: ['De 5K à 200K, à partir de 59 $', 'Objectif 8 % puis 4 %', 'Perte journalière de 4 %', 'Aucun jour minimum'],
        },
        {
          name: 'Endurance',
          badge: 'Trois étapes',
          summary:
            'Trois paliers à 6 %, le chemin le plus progressif et le moins cher à capital égal : 29 $ pour un 5K.',
          points: ['De 5K à 200K, à partir de 29 $', 'Objectif de 6 % à chaque étape', 'Drawdown statique de 8 %', '3 jours par étape'],
        },
      ],
    },
    key_rules: {
      title: 'Les règles qui décident',
      intro:
        'Quatre points communiqués directement par la firme, dont deux qui corrigeaient notre fiche précédente.',
      rules: [
        {
          title: 'Le partage est de 80 %, pas de 95 %',
          detail:
            'Le taux standard est de 80 %. Les 95 % s’obtiennent avec l’add-on payant « 95% Reward Share », disponible sur Instant Funding, Instant Lite, Instant24, Endurance, EnhancedX, Enhanced et Express.',
        },
        {
          title: 'Le trading d’actualités est restreint par défaut',
          detail:
            'Pendant l’évaluation, il est libre sur Express, Enhanced, EnhancedX et Endurance. Sur un compte Hantec Trader financé, ouvrir ou fermer une position dans les 3 minutes autour d’une annonce à fort impact est interdit, sauf à prendre l’add-on News Trading. Instant Funding et Instant Lite suivent la même restriction ; Instant24 est le seul à l’autoriser librement.',
        },
        {
          title: 'Le scalping est encadré par un seuil, pas interdit',
          detail:
            'Si les profits nets issus de positions tenues moins de 3 minutes représentent 30 % ou plus du profit net total sur la période d’évaluation, l’activité est qualifiée de scalping et peut entraîner un ajustement des profits ou une restriction de trading.',
        },
        {
          title: 'La perte journalière se calcule sur la veille',
          detail:
            'Sur les sept programmes, la limite journalière est mesurée sur le plus élevé du solde ou de l’equity à la clôture de la veille. Le drawdown global, lui, est glissant sur les programmes instantanés et Express, statique sur Endurance, Enhanced et EnhancedX.',
        },
      ],
      more: [
        'Levier 1:50 sur le forex, 1:15 sur indices et matières premières',
        'Levier 1:10 sur les métaux, 1:1 sur la crypto',
        'MetaTrader 4 et MetaTrader 5',
        'Décision de retrait sous 24 heures ouvrées pour les demandes éligibles',
        'Retraits par virement, crypto ou portefeuille électronique',
      ],
    },
    journey: {
      title: 'Ce qui se passe après le paiement',
      intro: 'Le parcours dépend de la famille de programme choisie.',
      steps: [
        {
          title: 'Financement immédiat',
          detail:
            'Sur Instant Funding, Instant Lite et Instant24, il n’y a pas d’évaluation : le compte est actif dès l’achat, avec ses limites de risque propres.',
        },
        {
          title: 'Évaluation',
          detail:
            'Sur Express, une seule phase à 10 %. Sur Enhanced et EnhancedX, deux phases. Sur Endurance, trois paliers à 6 %. Aucune limite de temps sur ces quatre programmes.',
        },
        {
          title: 'Compte Hantec Trader',
          detail:
            'Une fois financé, la restriction d’actualités s’applique dans les 3 minutes autour des annonces à fort impact, sauf add-on News Trading, et sauf sur Instant24.',
        },
        {
          title: 'Retraits',
          detail:
            'Décision sous 24 heures ouvrées pour les demandes éligibles ; le délai d’arrivée des fonds dépend du moyen choisi. Partage de 80 %, ou 95 % avec l’add-on.',
        },
      ],
    },
  },
  challenges: [
    // Instant Funding — aucune évaluation, perte journalière 6 %, drawdown glissant 6 %
    ['hantec-instant-funding-1k', 'Instant Funding $1K', '$1K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 43, null],
    ['hantec-instant-funding-2k', 'Instant Funding $2K', '$2K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 86, null],
    ['hantec-instant-funding-5k', 'Instant Funding $5K', '$5K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 214, null],
    ['hantec-instant-funding-10k', 'Instant Funding $10K', '$10K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 428, null],
    ['hantec-instant-funding-25k', 'Instant Funding $25K', '$25K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 1069, null],
    ['hantec-instant-funding-50k', 'Instant Funding $50K', '$50K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 2139, null],
    // Instant Lite — perte journalière 3 %, drawdown glissant 5 %, 5 jours rentables par cycle
    ['hantec-instant-lite-1k', 'Instant Lite $1K', '$1K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 19, null],
    ['hantec-instant-lite-2k', 'Instant Lite $2K', '$2K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 39, null],
    ['hantec-instant-lite-5k', 'Instant Lite $5K', '$5K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 79, null],
    ['hantec-instant-lite-10k', 'Instant Lite $10K', '$10K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 129, null],
    ['hantec-instant-lite-25k', 'Instant Lite $25K', '$25K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 239, null],
    ['hantec-instant-lite-50k', 'Instant Lite $50K', '$50K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 369, null],
    ['hantec-instant-lite-100k', 'Instant Lite $100K', '$100K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 699, null],
    // Instant24 — 24 heures depuis le premier trade, perte journalière 2 %, global 3 %
    ['hantec-instant24-2k', 'Instant24 $2K', '$2K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 13, null],
    ['hantec-instant24-5k', 'Instant24 $5K', '$5K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 17, null],
    ['hantec-instant24-10k', 'Instant24 $10K', '$10K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 38, null],
    ['hantec-instant24-25k', 'Instant24 $25K', '$25K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 89, null],
    ['hantec-instant24-50k', 'Instant24 $50K', '$50K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 190, null],
    ['hantec-instant24-100k', 'Instant24 $100K', '$100K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 299, null],
    // Endurance — 3 étapes à 6 %, journalière 4 %, global statique 8 %
    ['hantec-endurance-5k', 'Endurance $5K', '$5K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 29, null],
    ['hantec-endurance-10k', 'Endurance $10K', '$10K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 59, null],
    ['hantec-endurance-25k', 'Endurance $25K', '$25K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 109, null],
    ['hantec-endurance-50k', 'Endurance $50K', '$50K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 189, null],
    ['hantec-endurance-100k', 'Endurance $100K', '$100K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 299, null],
    ['hantec-endurance-200k', 'Endurance $200K', '$200K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 499, null],
    // EnhancedX — 2 étapes 8 % puis 4 %, journalière 4 %, global statique 8 %
    ['hantec-enhancedx-5k', 'EnhancedX $5K', '$5K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 59, null],
    ['hantec-enhancedx-10k', 'EnhancedX $10K', '$10K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 99, null],
    ['hantec-enhancedx-25k', 'EnhancedX $25K', '$25K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 219, null],
    ['hantec-enhancedx-50k', 'EnhancedX $50K', '$50K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 359, null],
    ['hantec-enhancedx-100k', 'EnhancedX $100K', '$100K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 599, null],
    ['hantec-enhancedx-200k', 'EnhancedX $200K', '$200K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 1169, null],
    // Enhanced — 2 étapes 10 % puis 5 %, journalière 5 %, global statique 10 %
    ['hantec-enhanced-5k', 'Enhanced $5K', '$5K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 59, null],
    ['hantec-enhanced-10k', 'Enhanced $10K', '$10K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 99, null],
    ['hantec-enhanced-25k', 'Enhanced $25K', '$25K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 219, null],
    ['hantec-enhanced-50k', 'Enhanced $50K', '$50K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 359, null],
    ['hantec-enhanced-100k', 'Enhanced $100K', '$100K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 599, null],
    ['hantec-enhanced-200k', 'Enhanced $200K', '$200K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 1169, null],
    // Express — 1 étape à 10 %, journalière 5 %, global glissant 6 %
    ['hantec-express-2k', 'Express $2K', '$2K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 39, null],
    ['hantec-express-5k', 'Express $5K', '$5K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 59, null],
    ['hantec-express-10k', 'Express $10K', '$10K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 99, null],
    ['hantec-express-25k', 'Express $25K', '$25K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 199, null],
    ['hantec-express-50k', 'Express $50K', '$50K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 319, null],
    ['hantec-express-100k', 'Express $100K', '$100K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 529, null],
    ['hantec-express-200k', 'Express $200K', '$200K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 999, null],
  ],
  consistency: {
    'Instant': 'Aucun objectif de profit, aucun jour minimum. Partage de 80 %, porté à 95 % avec l’add-on. Actualités restreintes dans les 3 minutes autour des annonces à fort impact, sauf add-on News Trading.',
    'Instant Lite': '5 jours rentables par cycle de retrait. Aucun objectif de profit. Actualités restreintes dans les 3 minutes autour des annonces à fort impact, sauf add-on News Trading.',
    'Instant 24h': 'Le compte vit 24 heures à partir du premier trade. Aucun objectif de profit. Seul programme où le trading d’actualités est libre.',
    '1 step': 'Aucun jour minimum. Actualités libres pendant l’évaluation, restreintes une fois financé sauf add-on.',
    '2 steps': 'Enhanced : 3 jours rentables par étape. EnhancedX : aucun jour minimum. Actualités libres pendant l’évaluation, restreintes une fois financé sauf add-on.',
    '3 steps': '3 jours de trading par étape. Actualités libres pendant l’évaluation, restreintes une fois financé sauf add-on.',
  },
  riskUnit: 'percent',
  // Cinq codes publics, tous conditionnels. NEW35 est le plus avantageux mais
  // reserve aux nouveaux clients : la condition part dans discount_note, qui
  // s affiche sous le prix. Les quatre autres vivent dans les regles.
  promo: {
    code: 'NEW35',
    percent: 35,
    note: 'Reserve aux nouveaux clients, sur le premier achat uniquement. Autres codes : INSTANT20 (20 % sur Instant Funding et Instant Lite), SAVE20, SAVE15 et SAVE10 selon la taille du compte.',
    why: [
      'Cinq codes publics fournis par la firme, tous conditionnels. NEW35 est le',
      'plus avantageux mais ne vaut que pour un premier achat : la condition est',
      'ecrite dans discount_note, affichee sous le prix. Sans elle, la page',
      'promettrait 35 % a des clients existants qui ne les auront pas.',
    ],
  },
  notes: [
    'SOURCE. E-mail de Desiree Almeida, Partnership Manager de Hantec Trader, 3 septembre 2026. Source de première main : la firme décrit sa propre offre. Aucun recoupement de tiers n’a été nécessaire.',
    'DEUX CORRECTIONS DEMANDEES PAR LA FIRME. Le partage affiché était faux : il est de 80 %, et non de 95 %, les 95 % nécessitant un add-on payant. Les règles d’actualités étaient également inexactes : elles varient par programme et par stade.',
    'CODE PROMO. La firme fournit cinq codes publics, tous conditionnels : NEW35 (35 %, nouveaux clients uniquement, premier achat), INSTANT20 (20 % sur Instant Funding et Instant Lite), SAVE20 (20 % sur 2K/5K/10K Express, Enhanced, EnhancedX, Endurance), SAVE15 (15 % sur 25K/50K de ces mêmes programmes), SAVE10 (10 % sur 100K/200K). Aucun n’est propre à PropFirmScanner. NEW35 est écrit comme code principal avec sa condition en discount_note ; les autres figurent dans les règles.',
    'discount_code valait « Axtpvm6z7 » à 5 % : un jeton technique, pas un code que le visiteur peut saisir. Remplacé.',
    'LOGO. La firme a fourni ses logos officiels en pièce jointe. À enregistrer dans public/logos/hantec-trader.png puis mettre à jour logo_url, qui pointe encore sur une favicon Google.',
    'PROGRAMME D’AFFILIATION. 10 % à 15 % selon le palier (Silver, Gold, Platinum), cookie de 30 jours, paiement à la demande dès 50 $. L’affiliate_url en base porte affiliateId=2766 ; à confirmer que c’est bien le tien dans le portail affilié.',
    'LEVIER. Forex 1:50, indices et matières premières 1:15, métaux 1:10, crypto 1:1. Identique sur les sept programmes. Non stocké faute de colonne dédiée : figure dans key_rules.more.',
    'PAYS RESTREINTS. 32 territoires, dont les États-Unis, l’Allemagne, la Belgique, l’Australie, la République tchèque et la Roumanie. Aucune colonne dédiée : l’essentiel figure dans cons et special_features.',
  ],
}

export const ALL_FIRMS = [FTMO, THE5ERS, FUTURESELITE, HANTEC]
