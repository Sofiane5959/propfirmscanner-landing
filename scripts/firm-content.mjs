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
    regulation_details:
      'FTMO Evaluation Global s.r.o. ; l’entité contractante peut varier selon la région. Ni courtier ni entreprise d’investissement : le service repose sur des comptes simulés et n’accepte aucun dépôt de client.',
    trustpilot_rating: 4.8,
    min_price: 79,
    max_price: 1080,
    profit_split: 80,
    max_profit_split: 90,
    max_allocation: 'Jusqu’à 400 000 $ d’allocation initiale, et jusqu’à 2 000 000 $ via le plan de scaling',
    is_futures: false,
    drawdown_type:
      'Perte journalière calculée sur l’equity et remise à zéro à minuit CE(S)T. Drawdown global glissant en fin de journée sur le 1-Step, verrouillé une fois arrivé au solde de départ ; fixe sur le 2-Step.',
    time_limit: 'Aucune limite de temps, sur les deux produits',
    payout_frequency: 'sur demande, au plus tôt 14 jours après le premier trade',
    source_url: 'https://ftmo.com/en/trading-objectives/',
  },
  arrays: {
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
    assets: ['CFD sur forex', 'Métaux', 'Indices', 'Énergie', 'Crypto', 'Matières premières', 'CFD sur actions'],
    // Ce sont bien les moyens de RETRAIT. La version précédente y listait les
    // moyens de PAIEMENT (cartes, PayPal, Skrill) : deux colonnes distinctes
    // dans la fiche, confondues par erreur. Les moyens de paiement sont
    // désormais dans special_features.
    payout_methods: ['Virement bancaire', 'Autres moyens affichés dans l’espace client, selon disponibilité'],
    included_items: [
      'MetaTrader 4, MetaTrader 5, cTrader et TradingView',
      'Tableau de bord FTMO et métriques de performance',
      'Aucun frais d’activation du compte financé',
    ],
    pros: [
      'En activité depuis 2015, l’un des plus longs historiques du secteur',
      'Partage de 90 % sur le 1-Step, le plus élevé des deux produits',
      'Aucune limite de temps, ni sur le 1-Step ni sur le 2-Step',
      'Le 1-Step n’impose aucun jour de trading minimum fixe',
      'Sur le 2-Step, les frais sont remboursés à 100 % avec la première récompense',
      'Le compte Swing lève les restrictions d’actualités, de nuit et de week-end',
      'Allocation jusqu’à 400 000 $, et jusqu’à 2 000 000 $ via le plan de scaling',
      'Prix en euros, à partir de 79 €',
    ],
    cons: [
      'Aucun reset : après un échec, il faut racheter un challenge entier',
      'Le remboursement des frais n’est pas annoncé sur le 1-Step',
      'Le 1-Step serre la limite journalière à 3 % et utilise un drawdown glissant',
      'Le 2-Step exige 4 jours de trading dans chaque phase',
      'Le compte financé Standard restreint les annonces, la nuit et le week-end',
      'Swing n’existe pas sur le 1-Step et plafonne le levier à 1:30',
      'Le Swing ne propose pas de compte 200K',
    ],
    special_features: [
      'Deux produits aux règles réellement différentes',
      '1-Step : perte journalière de 3 %, drawdown glissant verrouillé au solde de départ',
      '2-Step : perte journalière de 5 %, drawdown fixe',
      'La règle du meilleur jour ne s’applique qu’au 1-Step',
      'Levier jusqu’à 1:100 en Standard, 1:30 en Swing',
      'Plan de scaling : +25 % de solde tous les 4 mois, sur le 2-Step uniquement',
      'Aucune obligation de stop-loss',
      'Paiement par carte, virement, PayPal, Skrill, crypto et Revolut Pay ; Apple Pay et Google Pay selon disponibilité',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body:
        'FTMO vend deux produits qu’il faut distinguer avant d’acheter. Le 1-Step paie mieux — 90 % — et n’impose pas de calendrier, mais serre la vis au quotidien. Le 2-Step paie 80 %, laisse plus de marge chaque jour, et rembourse les frais à la première récompense.',
      points: [
        'Le meilleur partage sans condition : 90 % dès la première récompense sur le 1-Step',
        'Récupérer le prix du challenge : le 2-Step le rembourse à 100 % avec la première récompense',
        'Une limite journalière confortable : 5 % sur le 2-Step, contre 3 % sur le 1-Step',
        'La liberté de garder vos positions la nuit et le week-end, avec le compte Swing',
        'Une allocation qui monte à 2 000 000 $ via le plan de scaling',
      ],
    },
    program_guide: {
      title: 'Trois parcours, trois compromis',
      intro:
        'Les trois mènent à un compte financé. Le choix se joue sur le partage, le calendrier et la liberté de tenir vos positions.',
      options: [
        {
          name: '1-Step',
          badge: 'Une seule phase',
          summary:
            'Le partage le plus élevé, 90 %, et aucun jour minimum. En échange, une limite journalière de 3 % et un drawdown qui suit vos plus hauts.',
          points: [
            'Objectif de 10 %, partage de 90 %',
            'Perte journalière de 3 %',
            'Drawdown glissant, verrouillé au solde de départ',
            'Meilleur jour ≤ 50 % du profit des jours positifs',
            'De 79 € (10K) à 999 € (200K)',
          ],
        },
        {
          name: '2-Step Standard',
          badge: 'Deux phases',
          summary:
            'Objectif de 10 % puis 5 %, une limite journalière plus large à 5 % et un drawdown fixe. Les frais sont remboursés avec la première récompense.',
          points: [
            'Objectif de 10 % puis 5 %, partage de 80 %',
            'Perte journalière de 5 %, drawdown fixe',
            '4 jours de trading minimum par phase',
            'Frais remboursés à 100 % à la première récompense',
            'De 89 € (10K) à 1 080 € (200K)',
          ],
        },
        {
          name: '2-Step Swing',
          badge: 'Positions tenues',
          summary:
            'Les règles du 2-Step, sans aucune restriction d’actualités, de nuit ni de week-end, y compris une fois financé. Le levier tombe à 1:30 et le 200K n’existe pas.',
          points: [
            'Mêmes objectifs et mêmes limites que le 2-Step Standard',
            'Annonces, nuit et week-end libres, même sur le compte financé',
            'Levier plafonné à 1:30',
            'De 99 € (10K) à 599 € (100K)',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Les règles qui décident',
      intro: 'Cinq points que la plupart des comparateurs rapportent mal.',
      rules: [
        {
          title: 'Le partage dépend du produit',
          detail:
            '90 % sur le 1-Step, sans condition. 80 % sur le 2-Step, porté à 90 % via le plan de scaling. Les pages qui annoncent « jusqu’à 90 % » pour toute la gamme masquent le fait que le 1-Step y arrive d’emblée.',
        },
        {
          title: 'Les frais ne sont remboursés que sur le 2-Step',
          detail:
            'Le 2-Step rembourse 100 % du prix du challenge avec la première récompense. Sur le 1-Step, FTMO n’annonce pas de remboursement. À prix affiché plus bas, le 1-Step revient donc plus cher une fois financé.',
        },
        {
          title: 'La perte journalière diffère, et se calcule sur l’equity',
          detail:
            '3 % sur le 1-Step, 5 % sur le 2-Step. Elle porte sur l’equity — donc pertes latentes, commissions et swaps compris — et se remet à zéro à minuit CE(S)T, pas à l’heure de votre fuseau.',
        },
        {
          title: 'Le drawdown du 1-Step glisse, puis se verrouille',
          detail:
            'Il monte avec votre plus haut solde de clôture, puis s’arrête définitivement une fois arrivé au solde de départ. Le 2-Step est en drawdown fixe dès le premier trade.',
        },
        {
          title: 'Il n’existe aucun reset',
          detail:
            'Un challenge échoué ne se relance pas à prix réduit : il faut en racheter un entier. C’est une différence de coût réel importante avec les firmes qui facturent 50 % pour un reset.',
        },
      ],
      more: [
        'Aucune limite de temps sur les trois parcours',
        'Aucun jour minimum fixe sur le 1-Step ; 4 jours par phase sur le 2-Step',
        'Aucun frais d’activation du compte financé',
        'Aucune obligation de stop-loss',
        'Levier jusqu’à 1:100 en Standard, 1:30 en Swing',
        'Plan de scaling : +25 % de solde tous les 4 mois, sur le 2-Step',
        'Plateformes MT4, MT5, cTrader et TradingView',
      ],
    },
    journey: {
      title: 'Ce qui se passe après le paiement',
      intro: 'Le parcours diffère selon le produit choisi.',
      steps: [
        {
          title: 'Évaluation',
          detail:
            'Une phase sur le 1-Step, deux sur le 2-Step. Aucune restriction sur les annonces, les positions de nuit ou de week-end à ce stade, quel que soit le produit.',
        },
        {
          title: 'Vérification',
          detail:
            'Uniquement sur le 2-Step : un second objectif de 5 %, avec les mêmes limites de risque que la première phase.',
        },
        {
          title: 'Compte FTMO',
          detail:
            'Le Standard restreint les annonces et impose de fermer avant les coupures de marché de plus de 2 heures et avant le week-end. Le Swing ne restreint rien. Swing n’existe pas sur le 1-Step.',
        },
        {
          title: 'Récompenses',
          detail:
            'La première ne peut pas être demandée avant 14 jours ; ensuite vous choisissez votre jour de récompense. Sur le 2-Step, cette première récompense rembourse aussi le prix du challenge.',
        },
      ],
    },
    cost_timeline: {
      title: 'Ce que vous paierez',
      intro: 'Les coûts n’arrivent pas tous au même moment — et une partie revient.',
      steps: [
        {
          label: 'À l’achat',
          title: 'Frais unique',
          detail: 'De 79 € pour un 10K en 1-Step à 1 080 € pour un 200K en 2-Step. Aucun abonnement.',
        },
        {
          label: 'En cas d’échec',
          title: 'Aucun reset possible',
          detail: 'FTMO ne vend pas de reset à prix réduit : recommencer signifie racheter un challenge entier.',
        },
        {
          label: 'À la validation',
          title: 'Aucun frais d’activation',
          detail: 'Le compte financé s’ouvre sans paiement supplémentaire.',
        },
        {
          label: 'À la première récompense',
          title: 'Remboursement sur le 2-Step',
          detail:
            'Le 2-Step rend 100 % du prix du challenge avec la première récompense. Le 1-Step n’annonce pas de remboursement.',
        },
      ],
    },
  },
  // Grille complète relevée dans la fiche remplie du 3 septembre 2026.
  // Colonne 1 = 1-Step, colonne 3 = 2-Step Standard, colonne 4 = 2-Step Swing.
  // Le 13e élément porte le partage propre au programme.
  challenges: [
    ['ftmo-1-step-10k', 'FTMO 1-Step 10K', '$10K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 79, null, 90],
    ['ftmo-1-step-25k', 'FTMO 1-Step 25K', '$25K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 199, null, 90],
    ['ftmo-1-step-50k', 'FTMO 1-Step 50K', '$50K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 319, null, 90],
    ['ftmo-1-step-100k', 'FTMO 1-Step 100K', '$100K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 499, null, 90],
    ['ftmo-1-step-200k', 'FTMO 1-Step 200K', '$200K', '1 step', 10, 3, 10, null, 'Glissant, verrouillé au solde de départ', 'Trailing', 999, null, 90],
    ['ftmo-2-step-standard-10k', 'FTMO 2-Step Standard 10K', '$10K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 89, null, 80],
    ['ftmo-2-step-standard-25k', 'FTMO 2-Step Standard 25K', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 250, null, 80],
    ['ftmo-2-step-standard-50k', 'FTMO 2-Step Standard 50K', '$50K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 345, null, 80],
    ['ftmo-2-step-standard-100k', 'FTMO 2-Step Standard 100K', '$100K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 540, null, 80],
    ['ftmo-2-step-standard-200k', 'FTMO 2-Step Standard 200K', '$200K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 1080, null, 80],
    ['ftmo-2-step-swing-10k', 'FTMO 2-Step Swing 10K', '$10K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 99, null, 80],
    ['ftmo-2-step-swing-25k', 'FTMO 2-Step Swing 25K', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 279, null, 80],
    ['ftmo-2-step-swing-50k', 'FTMO 2-Step Swing 50K', '$50K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 379, null, 80],
    ['ftmo-2-step-swing-100k', 'FTMO 2-Step Swing 100K', '$100K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', 599, null, 80],
  ],
  consistency: {
    '1 step':
      'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum fixe, mais la règle en impose en pratique au moins deux rentables.',
    '2 steps':
      'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase. Frais remboursés à 100 % avec la première récompense.',
  },
  riskUnit: 'percent',
  notes: [
    'PARTAGE DES PROFITS. Enfin tranché par la fiche remplie du 3 septembre 2026 : 90 % sur le 1-Step, 80 % sur le 2-Step avec 90 % atteignable via le plan de scaling. La version précédente laissait profit_split à NULL faute de source. La colonne firme porte 80 avec max_profit_split à 90 ; le détail par programme vit dans prop_firm_challenges.',
    'ALLOCATION. Corrigée. La fiche précédente plafonnait à 200 000 $, qui était le plus gros compte achetable et non l’allocation maximale. La fiche remplie donne 400 000 $ d’allocation initiale et 2 000 000 $ via le scaling.',
    'REMISES. FTMO affichait le 3 septembre 2026 une offre publique : 399,20 € au lieu de 499 € sur le 1-Step 100K (-20 %), et 439 € au lieu de 540 € sur le 2-Step Standard 100K. Aucun prix barré n’est écrit : ce sont les remises publiques de la firme, pas un code PropFirmScanner. Les publier reviendrait à promettre une réduction qui ne passe pas par notre lien et qui peut disparaître sans préavis.',
    'TRADINGVIEW. Conflit résolu : la fiche remplie la liste parmi les plateformes disponibles. Ajoutée.',
    'NOUVEL ESSAI GRATUIT après un échec en phase de vérification : retiré. La fiche remplie indique « No reset; a new Challenge is required », ce qui contredit la formulation précédente sans la réfuter formellement. À faire confirmer par FTMO avant de la remettre.',
    'PAYS RESTREINTS. La fiche renvoie à la page officielle plutôt qu’à une liste figée, en précisant qu’elle bouge avec les sanctions et que les États-Unis et l’Australie passent par des offres régionales. Aucune liste écrite : restricted_countries reste vide, ce qui vaut mieux qu’une liste périmée.',
    'FTMO US passe par OANDA ; aucun courtier d’exécution mondial n’est publiquement nommé. Non écrit en base faute de colonne, mais utile si une page « FTMO pour les traders américains » est écrite un jour.',
    'AFFILIATION. 8 % de base, paliers jusqu’à 20 %. Durée du cookie non publiée. Demandes de retrait traitées sous 2 à 3 jours ouvrés.',
    'CHIFFRES DÉCLARATIFS. 4,5 M de clients, 650 M$ de récompenses, 140 pays, 300 employés. Déclarations de la firme sur elle-même, publiables uniquement avec la mention « selon FTMO ». Non écrits.',
    'FTMO FUTURES (Growth/Pro) est sorti de bêta le 3 septembre 2026 avec ses propres règles. Exclu de cette fiche, qui ne couvre que les CFD. Mérite sa propre entrée si le produit se confirme.',
    'PROVENANCE. Cette fiche vient d’un classeur rempli le 3 septembre 2026 à partir des pages officielles FTMO listées dans son onglet « Sources & Notes ». Elle n’a PAS été renvoyée et validée par FTMO, contrairement à la fiche Hantec Trader qui vient d’un e-mail de la firme. La page peut donc dire « vérifié contre la documentation de FTMO », jamais « confirmé par FTMO ».',
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
      'Five Percent Online Ltd, société britannique n° 12553363 et société israélienne n° 515864007. Société d’évaluation de trading propriétaire : ni courtier, ni dépositaire, ni bourse, ni établissement financier régulé. Environnement de trading entièrement simulé.',
    trustpilot_rating: 4.7,
    min_price: 22,
    max_price: 850,
    profit_split: 80,
    max_profit_split: 100,
    max_allocation:
      'Jusqu’à 500 000 $ sur High Stakes et Pro Growth, jusqu’à 4 000 000 $ sur Hyper Growth et Bootcamp',
    is_futures: false,
    drawdown_type:
      'Perte globale statique sur les quatre programmes : 10 % sur High Stakes, 6 % sur Hyper Growth et Pro Growth, 5 % en évaluation et 4 % une fois financé sur Bootcamp.',
    time_limit: 'Aucune limite de temps, mais un compte resté 30 jours sans trade expire',
    payout_frequency: 'tous les 14 jours, après validation',
    source_url: 'https://the5ers.com/challenge-programs-bootcamp-high-stakes-hyper-growth-explained/',
  },
  arrays: {
    // MetaTrader 5 uniquement. cTrader figurait dans la version precedente ;
    // la fiche remplie ne liste que MT5 en mode Hedge.
    platforms: ['MetaTrader 5'],
    assets: ['CFD sur forex', 'Indices', 'Métaux', 'Matières premières', 'Crypto'],
    payout_methods: ['Moyens affichés dans le Hub The5ers, variables selon le compte'],
    restricted_countries: [
      'Afghanistan', 'Biélorussie', 'Bosnie-Herzégovine', 'Burundi', 'Congo (Brazzaville)',
      'Congo (Kinshasa)', 'Corée du Nord', 'Crimée', 'Cuba', 'Érythrée', 'Guinée',
      'Guinée-Bissau', 'Irak', 'Iran', 'Israël', 'Laos', 'Liban', 'Liberia', 'Libye',
      'Myanmar', 'Papouasie-Nouvelle-Guinée', 'République centrafricaine', 'Russie',
      'Somalie', 'Soudan', 'Soudan du Sud', 'Syrie', 'Territoires palestiniens',
      'Vanuatu', 'Venezuela', 'Yémen',
    ],
    included_items: [
      'MetaTrader 5 en mode Hedge, sur desktop, web et mobile',
      'Quatre programmes, d’une à trois phases',
      'Croissance du compte jusqu’à 100 % de partage',
    ],
    pros: [
      'En activité depuis 2016',
      'Entrée à partir de 22 $, l’une des plus basses du marché',
      'Le partage peut monter jusqu’à 100 %, un plafond rare',
      'Le plan de croissance peut mener jusqu’à 4 000 000 $ sur Hyper Growth et Bootcamp',
      'Quatre programmes réellement différents, d’une à trois phases',
      'Aucune règle de régularité sur aucun des quatre programmes',
      'Positions de nuit et de week-end autorisées partout',
      'Deux entités juridiques identifiées, au Royaume-Uni et en Israël',
    ],
    cons: [
      'Le partage démarre à 50 % sur Hyper Growth et Bootcamp',
      'Une seule plateforme : MetaTrader 5',
      '31 territoires exclus, dont la Russie, l’Iran et Israël',
      'Aucune licence de régulateur financier',
      'Environnement entièrement simulé : les fonds ne sont pas du capital réel',
      'Un compte resté 30 jours sans trade expire',
      'Aucun reset annoncé publiquement : il faut racheter une évaluation',
      'Les gros retraits peuvent être fractionnés en versements hebdomadaires de 10 000 $',
    ],
    special_features: [
      'Partage variable selon le programme : 80 % High Stakes, 75 % Pro Growth, 50 % Hyper Growth et Bootcamp',
      'Les quatre programmes montent jusqu’à 100 % via la croissance du compte',
      'MetaTrader 5 en mode Hedge, sur desktop, web et mobile',
      'Commission forex de 4 $ par lot aller-retour, variable selon l’actif',
      'Levier jusqu’à 1:100 sur High Stakes, 1:30 sur les trois autres',
      'Indices et métaux jusqu’à 1:25, crypto 1:2 sur High Stakes',
      'Un compte resté 30 jours sans trade expire',
      'Membre du 5% Group, avec Trade The Pool, Trade Delicious et TSG Brokers',
    ],
  },
  json: {
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body:
        'The5ers vend quatre programmes dont le partage de départ va du simple au double : 80 % sur High Stakes, 50 % sur Hyper Growth et Bootcamp. Tous montent à 100 % en faisant croître le compte, mais le point de départ change complètement le calcul des premiers mois.',
      points: [
        'Commencer pour presque rien : 22 $ en Bootcamp ou en High Stakes 2,5K',
        'Le meilleur partage d’entrée de la gamme : 80 % sur High Stakes',
        'Viser très gros : Hyper Growth et Bootcamp mènent jusqu’à 4 000 000 $',
        'Un plafond de partage à 100 %, que peu de firmes proposent',
        'Aucune règle de régularité, sur aucun des quatre programmes',
      ],
    },
    program_guide: {
      title: 'Quatre programmes, quatre compromis',
      intro:
        'Le choix se joue sur trois curseurs : le partage de départ, le nombre de phases et le prix.',
      options: [
        {
          name: 'High Stakes',
          badge: 'Deux phases',
          summary:
            'Le programme le plus équilibré : 80 % de partage dès le départ, 10 % puis 5 % d’objectif, et la limite journalière la plus large de la gamme.',
          points: [
            'Objectif 10 % puis 5 %, partage de 80 %',
            'Perte journalière de 5 %, perte globale de 10 %',
            '3 jours rentables minimum par phase',
            'Levier jusqu’à 1:100, le plus élevé de la gamme',
            'De 22 $ (2,5K) à 545 $ (100K)',
          ],
        },
        {
          name: 'Pro Growth',
          badge: 'Une phase',
          summary:
            'Une seule phase à 10 % et 75 % de partage au départ, pour un prix contenu. La perte globale tombe à 6 %.',
          points: [
            'Objectif de 10 % en une phase, partage de 75 %',
            'Perte journalière de 3 %, perte globale de 6 %',
            'Croissance progressive jusqu’à 500 000 $',
            'De 52 $ (5K) à 329 $ (50K)',
          ],
        },
        {
          name: 'Hyper Growth',
          badge: 'Une phase, gros plafond',
          summary:
            'Le compte double à chaque palier de 10 %, jusqu’à 4 000 000 $. En échange, le partage démarre à 50 % et le prix d’entrée est le plus élevé de la gamme.',
          points: [
            'Objectif de 10 % en une phase, partage de départ de 50 %',
            'Le compte double à chaque objectif atteint',
            'Perte globale de 6 %, seuil de pause journalière à 3 %',
            'De 260 $ (5K) à 850 $ (20K)',
          ],
        },
        {
          name: 'Bootcamp',
          badge: 'Trois phases',
          summary:
            'Trois paliers à 6 %, sans limite journalière pendant l’évaluation, avec des frais payés en deux temps : une entrée réduite, le solde à la réussite.',
          points: [
            'Trois objectifs de 6 %, partage de départ de 50 %',
            'Aucune limite journalière pendant l’évaluation',
            'Perte globale de 5 %, ramenée à 4 % une fois financé',
            'Entrée de 22 $ (20K) à 225 $ (250K), solde dû après la réussite',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Les règles qui décident',
      intro: 'Cinq points sur lesquels les comparateurs se trompent ou restent muets.',
      rules: [
        {
          title: 'Le partage de départ va de 50 % à 80 % selon le programme',
          detail:
            'High Stakes démarre à 80 %, Pro Growth à 75 %, Hyper Growth et Bootcamp à 50 %. Les quatre montent jusqu’à 100 % en faisant croître le compte, mais annoncer « jusqu’à 100 % » sans dire d’où l’on part revient à masquer la moitié de l’information.',
        },
        {
          title: 'Le seuil journalier de Hyper Growth est une pause, pas un échec',
          detail:
            'Sur Hyper Growth, dépasser 3 % dans la journée suspend le trading jusqu’au lendemain au lieu de clôturer le compte. Sur Pro Growth c’est une véritable perte journalière de 3 %. Sur Bootcamp, aucune limite journalière pendant l’évaluation ; la pause de 3 % n’arrive qu’une fois financé.',
        },
        {
          title: 'Un compte inactif 30 jours expire',
          detail:
            'Il n’y a pas de limite de durée pour réussir une évaluation, mais rester 30 jours sans passer un trade ferme le compte. C’est la seule contrainte de calendrier de la maison, et elle est rarement mentionnée ailleurs.',
        },
        {
          title: 'Les annonces se tiennent, mais ne se tradent pas',
          detail:
            'Sur High Stakes, garder une position ouverte à travers une annonce à fort impact est autorisé ; ouvrir ou fermer dans les 2 minutes qui l’entourent ne l’est pas. Les trois autres programmes interdisent les stratégies d’exploitation d’annonces sans imposer cette fenêtre.',
        },
        {
          title: 'Les gros retraits peuvent être fractionnés',
          detail:
            'Les retraits partent tous les 14 jours à partir du premier trade sur compte financé, après validation. Un montant important peut être versé par tranches hebdomadaires plafonnées à 10 000 $. À intégrer au calcul si vous visez un gros compte.',
        },
      ],
      more: [
        'Aucune règle de régularité sur aucun des quatre programmes',
        'Positions de nuit et de week-end autorisées ; les indices portent des swaps élevés',
        'Commission forex de 4 $ par lot aller-retour, variable selon l’actif',
        'Levier jusqu’à 1:100 sur High Stakes, 1:30 sur les trois autres',
        'Indices et métaux jusqu’à 1:25 ; crypto 1:2 sur High Stakes',
        'Aucun stop-loss obligatoire',
        'MetaTrader 5 en mode Hedge uniquement',
      ],
    },
    journey: {
      title: 'Ce qui se passe après le paiement',
      intro: 'Le parcours dépend du nombre de phases du programme choisi.',
      steps: [
        {
          title: 'Évaluation',
          detail:
            'Une phase sur Hyper Growth et Pro Growth, deux sur High Stakes, trois sur Bootcamp. Aucune limite de durée, mais un compte sans trade pendant 30 jours expire.',
        },
        {
          title: 'Compte financé',
          detail:
            'Le partage démarre au taux du programme — 80 %, 75 % ou 50 % — et monte vers 100 % au fil de la croissance du compte.',
        },
        {
          title: 'Croissance',
          detail:
            'High Stakes progresse à chaque palier de 10 %, Hyper Growth double le compte à chaque palier, Pro Growth avance progressivement, Bootcamp à chaque palier de 5 %. Le plafond est de 500 000 $ sur High Stakes et Pro Growth, 4 000 000 $ sur les deux autres.',
        },
        {
          title: 'Retraits',
          detail:
            'Tous les 14 jours à partir du premier trade sur compte financé, sous réserve de validation. Un gros montant peut être fractionné en versements hebdomadaires de 10 000 $ maximum.',
        },
      ],
    },
    cost_timeline: {
      title: 'Ce que vous paierez',
      intro: 'Trois des quatre programmes se paient en une fois. Le Bootcamp, non.',
      steps: [
        {
          label: 'À l’achat',
          title: 'Frais unique, sauf Bootcamp',
          detail:
            'De 22 $ pour un High Stakes 2,5K à 850 $ pour un Hyper Growth 20K. Le Bootcamp ne demande qu’une entrée réduite : 22 $ pour un 20K, 225 $ pour un 250K.',
        },
        {
          label: 'À la réussite',
          title: 'Solde du Bootcamp',
          detail:
            'Le Bootcamp réclame le reste des frais une fois l’évaluation réussie — 50 $ sur le 20K. Les trois autres programmes ne demandent rien de plus.',
        },
        {
          label: 'En cas d’échec',
          title: 'Aucun reset annoncé',
          detail:
            'The5ers ne publie pas de tarif de reset : recommencer signifie racheter une évaluation complète.',
        },
        {
          label: 'Au retrait',
          title: 'Fractionnement possible',
          detail:
            'Retraits tous les 14 jours après validation. Les gros montants peuvent être versés par tranches hebdomadaires de 10 000 $.',
        },
      ],
    },
  },
  // Prix releves dans la fiche remplie du 3 septembre 2026, onglet Pricing.
  // ATTENTION : cette grille est mal alignee — plusieurs montants sont poses
  // dans la colonne du programme voisin. L'affectation retenue ci-dessous est
  // la seule compatible avec la ligne « Account sizes offered » de l'onglet
  // Programs, qui dit quelles tailles chaque programme propose :
  //   $20K  = Hyper Growth (High Stakes ne vend pas de 20K)
  //   $50K  = Pro Growth   (Hyper Growth s'arrete a 20K)
  //   $100K et $250K = Bootcamp (aucun autre programme ne vend ces tailles)
  // Ce n'est pas une deduction par analogie : c'est la seule lecture qui ne
  // contredit pas la fiche elle-meme. A refaire confirmer malgre tout.
  // Le 13e element porte le partage de depart propre au programme.
  challenges: [
    ['the5ers-high-stakes-2-5k', 'High Stakes $2.5K', '$2.5K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 22, null, 80],
    ['the5ers-high-stakes-5k', 'High Stakes $5K', '$5K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 39, null, 80],
    ['the5ers-high-stakes-10k', 'High Stakes $10K', '$10K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 78, null, 80],
    ['the5ers-high-stakes-25k', 'High Stakes $25K', '$25K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 195, null, 80],
    ['the5ers-high-stakes-50k', 'High Stakes $50K', '$50K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 309, null, 80],
    ['the5ers-high-stakes-100k', 'High Stakes $100K', '$100K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 545, null, 80],
    ['the5ers-pro-growth-5k', 'Pro Growth $5K', '$5K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 52, null, 75],
    ['the5ers-pro-growth-10k', 'Pro Growth $10K', '$10K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 98, null, 75],
    ['the5ers-pro-growth-20k', 'Pro Growth $20K', '$20K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 189, null, 75],
    ['the5ers-pro-growth-50k', 'Pro Growth $50K', '$50K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 329, null, 75],
    ['the5ers-hyper-growth-5k', 'Hyper Growth $5K', '$5K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 260, null, 50],
    ['the5ers-hyper-growth-10k', 'Hyper Growth $10K', '$10K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 450, null, 50],
    ['the5ers-hyper-growth-20k', 'Hyper Growth $20K', '$20K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 850, null, 50],
    ['the5ers-bootcamp-20k', 'Bootcamp $20K', '$20K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', 22, null, 50],
    ['the5ers-bootcamp-100k', 'Bootcamp $100K', '$100K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', 95, null, 50],
    ['the5ers-bootcamp-250k', 'Bootcamp $250K', '$250K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', 225, null, 50],
  ],
  consistency: {
    '1 step':
      'Aucune règle de régularité. La fiche officielle se contredit sur le nombre de jours rentables : son tableau en annonce 3, ses spécifications n’en imposent aucun. Un compte resté 30 jours sans trade expire. Sur Hyper Growth, dépasser 3 % dans la journée met le compte en pause au lieu de le clôturer.',
    '2 steps':
      '3 jours rentables minimum par phase, sans règle de régularité. Aucun ordre exécuté dans les 2 minutes avant ou après une annonce à fort impact ; tenir une position à travers l’annonce reste autorisé.',
    '3 steps':
      'Aucun jour minimum annoncé, aucune règle de régularité. Aucune limite journalière pendant l’évaluation ; une pause journalière de 3 % s’applique une fois financé. Frais payés en deux temps : entrée réduite, solde dû à la réussite.',
  },
  riskUnit: 'percent',
  notes: [
    'PARTAGE DES PROFITS — RÉSOLU. C’était le trou le plus visible de cette fiche : profit_split restait NULL faute de source. La fiche remplie du 3 septembre 2026 donne enfin le détail par programme : 80 % High Stakes, 75 % Pro Growth, 50 % Hyper Growth, 50 % Bootcamp, les quatre montant jusqu’à 100 % via la croissance du compte. La colonne firme porte 80 (le programme phare) avec max_profit_split à 100.',
    'GRILLE DE PRIX MAL ALIGNÉE. L’onglet Pricing pose plusieurs montants dans la colonne du programme voisin : 850 $ apparaît sous High Stakes alors que High Stakes ne vend pas de 20K, 95 $ et 329 $ apparaissent sous Hyper Growth alors que Hyper Growth s’arrête à 20K. L’affectation retenue est la seule compatible avec la ligne « Account sizes offered » du même classeur. Elle reproduit celle de la version précédente, ce qui la conforte sans la prouver : à faire confirmer par The5ers.',
    'ÉTATS-UNIS — CORRECTION. La version précédente affirmait « Les traders américains ne sont pas acceptés » et comptait les États-Unis parmi les territoires exclus. La liste officielle de la fiche remplie ne les contient pas. L’affirmation est retirée. Israël, en revanche, y figure bien, malgré l’entité israélienne du groupe.',
    'SUMMER PLAN retiré. Le challenge the5ers-summer-plan-100k à 249 $ ne figure dans aucun des quatre programmes de la fiche remplie du 3 septembre 2026. Un plan saisonnier arrivé à échéance ne doit pas rester dans un configurateur.',
    'PLATEFORMES. cTrader retiré : la fiche ne liste que MetaTrader 5 en mode Hedge.',
    'OBJECTIF HIGH STAKES — CORRECTION. La version précédente donnait 8 % en première phase. La fiche remplie donne 10 %, puis 5 %.',
    'COMMISSIONS — RÉSOLU. Les deux sources tierces précédentes se contredisaient. La fiche donne 4 $ par lot aller-retour sur le forex, variable selon l’actif. Écrit.',
    'REMISES. Une offre publique de 10 % circule chez un concurrent affilié. Aucun prix barré n’est écrit : ce n’est pas un code PropFirmScanner, et la fiche recommande elle-même de ne publier que les nôtres.',
    'discount_code GDSWCVRTE7 est en base, d’origine inconnue et absent des deux fiches. À confirmer contre le panneau partenaire ou à retirer, comme le jeton Axtpvm6z7 l’a été chez Hantec.',
    'RETRAITS. Rise est cité comme moyen de retrait par des comparateurs, pas par la firme : payout_methods renvoie au Hub plutôt que de nommer un prestataire non confirmé.',
    'AFFILIATION. Taux, durée du cookie et calendrier de paiement non publiés. À relever dans le panneau affilié.',
    'CHIFFRES DÉCLARATIFS. 262 000 traders financés, 171 employés, 80 M$ versés. Déclarations de la firme sur elle-même, publiables uniquement avec la mention « selon The5ers ». Non écrits.',
    'PROVENANCE. Comme pour FTMO, ce classeur a été rempli à partir des pages officielles The5ers listées dans son onglet « Sources & Notes », et n’a pas été renvoyé et validé par la firme. La page peut dire « vérifié contre la documentation de The5ers », jamais « confirmé par The5ers ».',
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
    // Logo officiel fourni par la firme, servi en local. logo_url pointait sur
    // une favicon Google du domaine « hantectrader.com » — qui n'est pas le
    // leur : la requete renvoyait une image vide, d'ou un logo invisible.
    logo_url: '/logos/hantec-trader.png',
  },
  arrays: {
    platforms: ['MetaTrader 4', 'MetaTrader 5'],
    assets: ['Forex', 'Indices', 'Matières premières', 'Métaux', 'Crypto'],
    payout_methods: ['Virement bancaire', 'Cryptomonnaie', 'Portefeuilles électroniques'],
    // Liste officielle communiquée par la firme. Repliée sous « Points à
    // connaître » sur la page : longue, mais décisive pour qui la consulte.
    restricted_countries: [
      'Afghanistan', 'Allemagne', 'Australie', 'Belgique', 'Congo (Brazzaville)',
      'Congo (Kinshasa)', 'Corée du Nord', 'Égypte', 'États-Unis', 'Haïti', 'Iran',
      'Israël', 'Jordanie', 'Kosovo', 'Laos', 'Libye', 'Malaisie', 'Myanmar',
      'Ouzbékistan', 'Pakistan', 'Porto Rico', 'Qatar', 'République tchèque',
      'Roumanie', 'Russie', 'Serbie', 'Somalie', 'Soudan du Sud', 'Taïwan',
      'Thaïlande', 'Viêt Nam', 'Yémen',
    ],
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
  // Aucun code affiché. Les cinq codes fournis par Hantec — NEW35, INSTANT20,
  // SAVE20, SAVE15, SAVE10 — sont publics : n'importe qui les trouve ailleurs,
  // ils ne portent aucune attribution, et les publier invite le visiteur à
  // acheter sans passer par le lien affilié. Un code dédié à PropFirmScanner
  // reste à demander, comme FuturesElite l'a fait avec SCANNED.
  clearPromo: [
    'La base portait discount_code = Axtpvm6z7 a 5 %. Ce n est pas un code que',
    'le visiteur peut saisir au checkout : c est un jeton technique. Efface.',
    'Aucun code ne le remplace : les cinq codes de la firme sont publics, sans',
    'attribution, et les publier inviterait a acheter hors du lien affilie.',
    'A remplacer des que Hantec fournit un code dedie a PropFirmScanner.',
  ],
  notes: [
    'SOURCE. E-mail de Desiree Almeida, Partnership Manager de Hantec Trader, 3 septembre 2026. Source de première main : la firme décrit sa propre offre. Aucun recoupement de tiers n’a été nécessaire.',
    'DEUX CORRECTIONS DEMANDEES PAR LA FIRME. Le partage affiché était faux : il est de 80 %, et non de 95 %, les 95 % nécessitant un add-on payant. Les règles d’actualités étaient également inexactes : elles varient par programme et par stade.',
'CODE PROMO : AUCUN AFFICHÉ, VOLONTAIREMENT. La firme fournit cinq codes publics et conditionnels — NEW35, INSTANT20, SAVE20, SAVE15, SAVE10. Aucun n’appartient à PropFirmScanner : n’importe qui les trouve ailleurs, ils ne portent aucune attribution, et les publier revient à inviter le visiteur à acheter sans passer par le lien affilié. discount_code et discount_percent restent nuls jusqu’à ce que Hantec fournisse un code dédié, comme FuturesElite l’a fait avec SCANNED. C’est la demande à adresser à Desiree Almeida.',
    'discount_code valait « Axtpvm6z7 » à 5 % : un jeton technique, pas un code que le visiteur peut saisir. Remplacé.',
    'LOGO. Corrigé. logo_url pointait sur une favicon Google du domaine « hantectrader.com », qui n’est pas le leur : la requête renvoyait une image vide. Le logo officiel fourni par la firme est servi depuis public/logos/hantec-trader.png (256 x 256, H orange sur fond noir).',
    'PROGRAMME D’AFFILIATION. 10 % à 15 % selon le palier (Silver, Gold, Platinum), cookie de 30 jours, paiement à la demande dès 50 $. L’affiliate_url en base porte affiliateId=2766 ; à confirmer que c’est bien le tien dans le portail affilié.',
    'LEVIER. Forex 1:50, indices et matières premières 1:15, métaux 1:10, crypto 1:1. Identique sur les sept programmes. Non stocké faute de colonne dédiée : figure dans key_rules.more.',
    'PAYS RESTREINTS. Les 32 territoires sont désormais écrits dans restricted_countries, colonne créée par l’étape 2 de ce script et affichée derrière un dépliant sur la page. Les plus notables — États-Unis, Allemagne, Belgique, Australie — restent aussi dans cons, où ils sont vus sans clic.',
  ],
}

export const ALL_FIRMS = [FTMO, THE5ERS, FUTURESELITE, HANTEC]
