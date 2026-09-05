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
  // Les colonnes de base sont en ANGLAIS. Le francais vit dans `fr`, ecrit
  // dans translations.fr et superpose par PropFirmPageClient selon la locale.
  scalars: {
    name: 'FTMO',
    founded_year: 2015,
    headquarters: 'Quadrio Offices, Purkyňova 2121/3, 110 00 Prague, Czech Republic',
    country: 'Czech Republic',
    price_currency: 'EUR',
    is_regulated: false,
    regulation_details:
      'FTMO Evaluation Global s.r.o.; the contracting entity can vary by region. Neither a broker nor an investment firm: the service runs on simulated accounts and takes no client deposits.',
    trustpilot_rating: 4.8,
    min_price: 79,
    max_price: 1080,
    profit_split: 80,
    max_profit_split: 90,
    max_allocation: 'Up to $400,000 initial allocation, and up to $2,000,000 through the Scaling Plan',
    is_futures: false,
    drawdown_type:
      'Daily loss measured on equity and reset at midnight CE(S)T. Overall drawdown trails end-of-day on the 1-Step and locks once it reaches the starting balance; fixed on the 2-Step.',
    time_limit: 'No time limit, on either product',
    payout_frequency: 'on request, no earlier than 14 days after your first trade',
    source_url: 'https://ftmo.com/en/trading-objectives/',
  },
  arrays: {
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
    assets: ['Forex CFDs', 'Metals', 'Indices', 'Energies', 'Crypto', 'Commodities', 'Stock CFDs'],
    payout_methods: ['Bank transfer', 'Other methods shown in the Client Area, where available'],
    included_items: [
      'MetaTrader 4, MetaTrader 5, cTrader and TradingView',
      'FTMO dashboard and performance metrics',
      'No activation fee on the funded account',
    ],
    pros: [
      'Trading since 2015, one of the longest track records in the sector',
      '90% split on the 1-Step, the higher of the two products',
      'No time limit, on either the 1-Step or the 2-Step',
      'The 1-Step sets no fixed minimum trading days',
      'On the 2-Step, the fee comes back in full with your first reward',
      'The Swing account lifts news, overnight and weekend restrictions',
      'Allocation up to $400,000, and up to $2,000,000 through the Scaling Plan',
      'Priced in euros, from €79',
    ],
    cons: [
      'No resets: after a failure you buy a whole new challenge',
      'The fee refund is not advertised on the 1-Step',
      'The 1-Step tightens the daily limit to 3% and uses a trailing drawdown',
      'The 2-Step requires 4 trading days in each phase',
      'The funded Standard account restricts news, overnight and weekend holding',
      'Swing does not exist on the 1-Step and caps leverage at 1:30',
      'Swing offers no 200K account',
    ],
    special_features: [
      'Two products with genuinely different rules',
      '1-Step: 3% daily loss, trailing drawdown that locks at the starting balance',
      '2-Step: 5% daily loss, fixed drawdown',
      'The Best Day Rule applies to the 1-Step only',
      'Leverage up to 1:100 on Standard, 1:30 on Swing',
      'Scaling Plan: +25% balance every 4 months, on the 2-Step only',
      'No mandatory stop-loss',
      'Pay by card, bank wire, PayPal, Skrill, crypto and Revolut Pay; Apple Pay and Google Pay where available',
    ],
  },
  json: {
    verdict_card: {
      title: 'Who it suits, and who it does not',
      body:
        'FTMO sells two products worth telling apart before you buy. The 1-Step pays more — 90% — and sets no calendar, but tightens the screws day to day. The 2-Step pays 80%, leaves more daily room, and refunds the fee with your first reward.',
      points: [
        'The best split with no strings: 90% from your first reward on the 1-Step',
        'Getting the fee back: the 2-Step refunds it in full with the first reward',
        'A comfortable daily limit: 5% on the 2-Step against 3% on the 1-Step',
        'The freedom to hold positions overnight and over the weekend, with Swing',
        'An allocation that reaches $2,000,000 through the Scaling Plan',
      ],
    },
    program_guide: {
      title: 'Three routes, three trade-offs',
      intro:
        'All three lead to a funded account. The choice turns on the split, the calendar, and how freely you can hold positions.',
      options: [
        {
          name: '1-Step',
          badge: 'Single phase',
          summary:
            'The highest split, 90%, and no minimum days. In exchange, a 3% daily limit and a drawdown that follows your highs.',
          points: [
            '10% target, 90% split',
            '3% daily loss',
            'Trailing drawdown, locked at the starting balance',
            'Best day ≤ 50% of the profit from winning days',
            'From €79 (10K) to €999 (200K)',
          ],
        },
        {
          name: '2-Step Standard',
          badge: 'Two phases',
          summary:
            '10% then 5% targets, a wider 5% daily limit and a fixed drawdown. The fee is refunded with your first reward.',
          points: [
            '10% then 5% target, 80% split',
            '5% daily loss, fixed drawdown',
            '4 minimum trading days per phase',
            'Fee refunded in full at the first reward',
            'From €89 (10K) to €1,080 (200K)',
          ],
        },
        {
          name: '2-Step Swing',
          badge: 'Hold positions',
          summary:
            'The 2-Step rules with no news, overnight or weekend restrictions, funded account included. Leverage drops to 1:30 and there is no 200K.',
          points: [
            'Same targets and limits as the 2-Step Standard',
            'News, overnight and weekend free, even once funded',
            'Leverage capped at 1:30',
            'From €99 (10K) to €599 (100K)',
          ],
        },
      ],
    },
    key_rules: {
      title: 'The rules that decide it',
      intro: 'Five points most comparison sites get wrong.',
      rules: [
        {
          title: 'The split depends on the product',
          detail:
            '90% on the 1-Step, unconditionally. 80% on the 2-Step, rising to 90% through the Scaling Plan. Pages that advertise "up to 90%" across the range hide the fact that the 1-Step starts there.',
        },
        {
          title: 'Only the 2-Step refunds the fee',
          detail:
            'The 2-Step returns 100% of the challenge price with your first reward. On the 1-Step, FTMO advertises no refund. Cheaper on the sticker, the 1-Step therefore costs more once you are funded.',
        },
        {
          title: 'The daily loss differs, and is measured on equity',
          detail:
            '3% on the 1-Step, 5% on the 2-Step. It is measured on equity — floating losses, commissions and swaps included — and resets at midnight CE(S)T, not in your own time zone.',
        },
        {
          title: 'The 1-Step drawdown trails, then locks',
          detail:
            'It rises with your highest closing balance, then stops for good once it reaches the starting balance. The 2-Step is on a fixed drawdown from the first trade.',
        },
        {
          title: 'There is no reset',
          detail:
            'A failed challenge cannot be restarted at a discount: you buy a whole new one. That is a real cost difference against firms charging 50% for a reset.',
        },
      ],
      more: [
        'No time limit on any of the three routes',
        'No fixed minimum days on the 1-Step; 4 per phase on the 2-Step',
        'No activation fee on the funded account',
        'No mandatory stop-loss',
        'Leverage up to 1:100 on Standard, 1:30 on Swing',
        'Scaling Plan: +25% balance every 4 months, on the 2-Step',
        'MT4, MT5, cTrader and TradingView',
      ],
    },
    journey: {
      title: 'What happens after you pay',
      intro: 'The route differs by product.',
      steps: [
        {
          title: 'Evaluation',
          detail:
            'One phase on the 1-Step, two on the 2-Step. No restriction on news, overnight or weekend positions at this stage, whichever product you picked.',
        },
        {
          title: 'Verification',
          detail:
            'On the 2-Step only: a second 5% target, under the same risk limits as the first phase.',
        },
        {
          title: 'FTMO Account',
          detail:
            'Standard restricts news and requires closing before market breaks over 2 hours and before the weekend. Swing restricts nothing. Swing does not exist on the 1-Step.',
        },
        {
          title: 'Rewards',
          detail:
            'The first cannot be requested before 14 days; after that you choose your reward day. On the 2-Step, that first reward also refunds the challenge price.',
        },
      ],
    },
    cost_timeline: {
      title: 'What you will pay',
      intro: 'The costs do not all land at the same moment — and some of it comes back.',
      steps: [
        {
          label: 'At purchase',
          title: 'One-off fee',
          detail: 'From €79 for a 1-Step 10K to €1,080 for a 2-Step 200K. No subscription.',
        },
        {
          label: 'On failure',
          title: 'No reset available',
          detail: 'FTMO does not sell discounted resets: starting over means buying a whole new challenge.',
        },
        {
          label: 'On passing',
          title: 'No activation fee',
          detail: 'The funded account opens with no further payment.',
        },
        {
          label: 'At the first reward',
          title: 'Refund on the 2-Step',
          detail:
            'The 2-Step returns 100% of the challenge price with the first reward. The 1-Step advertises no refund.',
        },
      ],
    },
  },
  // Surcouche francaise, ecrite dans translations.fr.
  fr: {
    headquarters: 'Bureaux Quadrio, Purkyňova 2121/3, 110 00 Prague, République tchèque',
    regulation_details:
      'FTMO Evaluation Global s.r.o. ; l’entité contractante peut varier selon la région. Ni courtier ni entreprise d’investissement : le service repose sur des comptes simulés et n’accepte aucun dépôt de client.',
    max_allocation: 'Jusqu’à 400 000 $ d’allocation initiale, et jusqu’à 2 000 000 $ via le plan de scaling',
    drawdown_type:
      'Perte journalière calculée sur l’equity et remise à zéro à minuit CE(S)T. Drawdown global glissant en fin de journée sur le 1-Step, verrouillé une fois arrivé au solde de départ ; fixe sur le 2-Step.',
    time_limit: 'Aucune limite de temps, sur les deux produits',
    payout_frequency: 'sur demande, au plus tôt 14 jours après le premier trade',
    assets: ['CFD sur forex', 'Métaux', 'Indices', 'Énergie', 'Crypto', 'Matières premières', 'CFD sur actions'],
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
    ['ftmo-1-step-10k', 'FTMO 1-Step 10K', '$10K', '1 step', 10, 3, 10, null, 'Trailing, locks at starting balance', 'Trailing', 79, null, 90],
    ['ftmo-1-step-25k', 'FTMO 1-Step 25K', '$25K', '1 step', 10, 3, 10, null, 'Trailing, locks at starting balance', 'Trailing', 199, null, 90],
    ['ftmo-1-step-50k', 'FTMO 1-Step 50K', '$50K', '1 step', 10, 3, 10, null, 'Trailing, locks at starting balance', 'Trailing', 319, null, 90],
    ['ftmo-1-step-100k', 'FTMO 1-Step 100K', '$100K', '1 step', 10, 3, 10, null, 'Trailing, locks at starting balance', 'Trailing', 499, null, 90],
    ['ftmo-1-step-200k', 'FTMO 1-Step 200K', '$200K', '1 step', 10, 3, 10, null, 'Trailing, locks at starting balance', 'Trailing', 999, null, 90],
    ['ftmo-2-step-standard-10k', 'FTMO 2-Step Standard 10K', '$10K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 89, null, 80],
    ['ftmo-2-step-standard-25k', 'FTMO 2-Step Standard 25K', '$25K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 250, null, 80],
    ['ftmo-2-step-standard-50k', 'FTMO 2-Step Standard 50K', '$50K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 345, null, 80],
    ['ftmo-2-step-standard-100k', 'FTMO 2-Step Standard 100K', '$100K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 540, null, 80],
    ['ftmo-2-step-standard-200k', 'FTMO 2-Step Standard 200K', '$200K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 1080, null, 80],
    ['ftmo-2-step-swing-10k', 'FTMO 2-Step Swing 10K', '$10K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 99, null, 80],
    ['ftmo-2-step-swing-25k', 'FTMO 2-Step Swing 25K', '$25K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 279, null, 80],
    ['ftmo-2-step-swing-50k', 'FTMO 2-Step Swing 50K', '$50K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 379, null, 80],
    ['ftmo-2-step-swing-100k', 'FTMO 2-Step Swing 100K', '$100K', '2 steps', 10, 5, 10, 5, 'Fixed (static)', 'Static', 599, null, 80],
  ],
  // En anglais : ces colonnes vivent dans prop_firm_challenges, que le bundle
  // translations ne couvre pas. Elles ne sont pas affichees sur la fiche.
  consistency: {
    '1 step':
      'Best day ≤ 50% of the profit from winning days. Going over does not fail the evaluation: you keep trading until you are back under. No fixed minimum trading days, though the rule implies at least two winning ones.',
    '2 steps':
      'No consistency rule. 4 minimum trading days in each phase. Fee refunded in full with the first reward.',
  },
  riskUnit: 'percent',
  notes: [
    'LANGUE. Les colonnes de base portent l’anglais, le français vit dans translations.fr. La version précédente écrivait le français en base : la page anglaise, qui est la page par défaut du site, servait du français. C’est ce que Sofiane a signalé le 3 septembre 2026.',
    'PARTAGE DES PROFITS. Tranché par la fiche remplie du 3 septembre 2026 : 90 % sur le 1-Step, 80 % sur le 2-Step avec 90 % atteignable via le plan de scaling. La colonne firme porte 80 avec max_profit_split à 90 ; le détail par programme vit dans prop_firm_challenges.',
    'ALLOCATION. Corrigée. La fiche précédente plafonnait à 200 000 $, qui était le plus gros compte achetable et non l’allocation maximale.',
    'REMISES. FTMO affichait le 3 septembre 2026 une offre publique : 399,20 € au lieu de 499 € sur le 1-Step 100K (-20 %), et 439 € au lieu de 540 € sur le 2-Step Standard 100K. Aucun prix barré n’est écrit : ce sont les remises publiques de la firme, pas un code PropFirmScanner.',
    'TRADINGVIEW. Conflit résolu : la fiche remplie la liste parmi les plateformes disponibles.',
    'NOUVEL ESSAI GRATUIT après un échec en phase de vérification : retiré. La fiche remplie indique « No reset; a new Challenge is required ». À faire confirmer par FTMO avant de le remettre.',
    'PAYS RESTREINTS. La fiche renvoie à la page officielle plutôt qu’à une liste figée. restricted_countries reste vide, ce qui vaut mieux qu’une liste périmée.',
    'AFFILIATION. 8 % de base, paliers jusqu’à 20 %. Durée du cookie non publiée. Retraits traités sous 2 à 3 jours ouvrés.',
    'CHIFFRES DÉCLARATIFS. 4,5 M de clients, 650 M$ de récompenses, 140 pays, 300 employés. Déclarations de la firme, publiables uniquement avec la mention « selon FTMO ». Non écrits.',
    'FTMO FUTURES (Growth/Pro) est sorti de bêta le 3 septembre 2026 avec ses propres règles. Exclu de cette fiche, qui ne couvre que les CFD.',
    'PROVENANCE. Classeur rempli le 3 septembre 2026 à partir des pages officielles FTMO. Il n’a PAS été renvoyé et validé par FTMO, contrairement à la fiche Hantec Trader. La page peut dire « vérifié contre la documentation de FTMO », jamais « confirmé par FTMO ».',
  ],
}

// -----------------------------------------------------------------------------
// FUTURESELITE — source : futureselite.com et app.futureselite.com, 3 sept. 2026
// -----------------------------------------------------------------------------
export const FUTURESELITE = {
  slug: 'futureselite',
  // Colonnes de base en ANGLAIS ; le francais est dans `fr` -> translations.fr.
  scalars: {
    name: 'FuturesElite',
    // Le H1. Une proposition de valeur, jamais le nom de la firme repete :
    // l'identite est deja affichee au-dessus, avec le logo.
    category_badge: 'Futures only',
    headline: 'Four routes to a funded futures account, evaluation or instant',
    verdict:
      'A futures prop firm built around choice: Elite and Prime run classic evaluations, ' +
      'Nitro targets faster payouts, and Instant funds you the day you buy. Each program ' +
      'carries its own loss limits, consistency rule and payout conditions, so the right ' +
      'one depends less on price than on how you actually trade.',
    description:
      'FuturesElite sells simulated futures accounts across four programs. Elite and Prime ' +
      'are evaluation routes with a one-time fee and no deadline to pass. Nitro and Instant ' +
      'shorten or remove the evaluation entirely, Instant funding you from purchase with no ' +
      'objective to reach. All four settle at a 90% profit split, and payouts can be ' +
      'requested daily once an account is funded.\n\n' +
      'It suits futures traders who already have a method and want to choose the rule set ' +
      'that fits it, rather than accept one. Loss limits are dollar amounts rather than ' +
      'percentages, drawdown is calculated at the end of the day on the evaluation programs, ' +
      'and seven platforms are available including Tradovate, NinjaTrader and Quantower.\n\n' +
      'The caveat matters more than the pricing. Quantum SRL holds no financial regulator ' +
      'licence, and every account is simulated: performance is hypothetical throughout. The ' +
      'live trading program exists but is a risk-team decision, not an entitlement earned at ' +
      'a fixed number of payouts.',
    website_url: 'https://futureselite.com',
    affiliate_url:
      'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
    headquarters: 'Corso G. Matteotti 61, Latina 04100, Italy',
    country: 'Italy',
    price_currency: 'USD',
    is_regulated: false,
    regulation_details:
      'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italy, no. 03095010595. No financial regulator licence. Demo accounts, hypothetical performance.',
    profit_split: 90,
    // Ecrit explicitement : la valeur de seed valait 80, soit MOINS que le
    // taux de base corrige a 90. Le tableau /compare affichait donc un
    // maximum inferieur au taux courant. FuturesElite ne documente pas de
    // palier au-dessus de 90 : max = base.
    max_profit_split: 90,
    min_price: 95,
    max_price: 353,
    is_futures: true,
    drawdown_type: 'End of day',
    time_limit: 'No time limit',
    payout_frequency: 'on demand, daily once funded',
    source_url: 'https://futureselite.com',
    // logo_url pointait sur /logos/futureselite.png — un fichier qui n'a jamais
    // ete cree. La production repondait 404 et la tuile restait vide. Une note
    // « a telecharger » avait ete laissee dans le SQL, mais la colonne avait ete
    // pointee sur le fichier absent entre-temps : une note ne remplace pas un
    // fichier. En attendant l'asset officiel, on sert la favicon du BON domaine,
    // qui elle repond.
    logo_url: 'https://www.google.com/s2/favicons?domain=futureselite.com&sz=128',
  },
  arrays: {
    // Meme liste que FUTURESELITE_PLATFORMS, relevee le 4 septembre 2026.
    // WealthCharts ne figure plus sur la page officielle ; DeepDOM si.
    // Toujours sept, donc « Seven platforms to choose from » reste juste.
    platforms: ['Tradovate', 'NinjaTrader', 'Quantower', 'ATAS', 'Volumetrica', 'DeepDOM', 'DeepCharts'],
    assets: ['Futures'],
    included_items: [
      'Trading journal and analytics dashboard',
      'No activation fee on the funded account',
      'Seven platforms to choose from',
    ],
    pros: [
      '90% profit split on the Elite programme',
      'End-of-day drawdown, with no daily loss limit at all',
      'No consistency rule once funded',
      'No activation fee to unlock the funded account',
      'Payouts available every day once funded',
      'Bundle discounts: the fifth account is free',
    ],
    cons: [
      'No financial regulator licence',
      'Demo accounts, hypothetical performance',
      '3 minimum trading days in evaluation, 6 once funded',
      'Per-request payout cap, from $1,000 to $3,000 by account size',
      'The Nitro, Prime and Instant price lists are not public',
    ],
    special_features: [
      '90% profit split on the Elite programme',
      'End-of-day drawdown, no daily loss limit',
      'No consistency rule once funded',
      'No activation fee on the funded account',
      'Bundle discounts: the fifth account is free',
      'Instant accounts available, with no evaluation',
    ],
  },
  json: {
    verdict_card: {
      title: 'Who it suits, and who it does not',
      body:
        'FuturesElite bets on generous terms once you are funded: a 90% split, no consistency rule, daily payouts. In exchange, the firm is young and is a proprietary trading company rather than a regulated broker.',
      points: [
        'A high split and frequent payouts, with no waiting period',
        'An evaluation with no daily loss limit, which leaves room to breathe',
        'A funded account that opens with no activation fee',
        'The option to stack up to ten accounts in parallel',
      ],
    },
    program_guide: {
      title: 'Four programmes',
      intro:
        'Four programmes are sold: Elite, Nitro, Prime and Instant. Their prices and rules differ, and the configurator above shows each one.',
      options: [
        {
          name: 'Elite',
          badge: 'Public pricing',
          summary:
            'A one-step evaluation, an end-of-day drawdown, no daily loss limit, and a 90% split once funded.',
          points: [
            '5% profit target',
            'No daily loss limit',
            '3 minimum trading days',
            'No activation fee',
          ],
        },
      ],
    },
    key_rules: {
      title: 'The rules that decide it',
      intro: 'What genuinely sets FuturesElite apart from other futures firms.',
      rules: [
        {
          title: 'No daily loss limit',
          detail:
            'Neither during the evaluation nor once funded. Risk is bounded by the Maximum Loss Limit alone, recalculated at the end of each day. That is the firm\u2019s headline argument, not a missing figure.',
        },
        {
          title: 'End-of-day drawdown',
          detail:
            'The limit updates once a day on the closing balance, not continuously. A position sitting at a floating loss therefore does not trip the limit until the day closes.',
        },
        {
          title: 'No consistency rule once funded',
          detail:
            'The rule applies during the evaluation and then disappears on the funded account. The sales page shows two figures side by side, 40% and 50%, without saying which applies: to be confirmed with the partner.',
        },
        {
          title: 'No activation fee',
          detail:
            'Passing the evaluation is enough to open the funded account. Reset fees do exist: $79 to $229 by size.',
        },
      ],
      more: [
        'Payouts available every day once funded',
        '6 minimum trading days before a payout',
        'No profit buffer required',
        'Seven platforms to choose from, including Tradovate and NinjaTrader',
        'The fifth account in a bundle is free',
      ],
    },
    journey: {
      title: 'What happens after you pay',
      intro: 'A single evaluation step, then the funded account opens immediately.',
      steps: [
        {
          title: 'Evaluation',
          detail:
            'Hit the profit target without breaching the Maximum Loss Limit, across at least 3 trading days. No time limit.',
        },
        {
          title: 'Funded account',
          detail:
            'Opened as soon as you pass, with no activation fee. The consistency rule disappears at this stage.',
        },
        {
          title: 'Payouts',
          detail:
            'Available every day, after 6 trading days, within the per-request cap: $1,000 on a 25K, up to $3,000 on a 150K.',
        },
        {
          title: 'Stacking accounts',
          detail:
            'Elite counts towards a shared cap of 5 funded accounts across Elite, Custom, Instant and Nitro. The overall ceiling is 10 active funded accounts, and Nitro alone is limited to 3. Buying a bundle does not raise those limits.',
        },
      ],
    },
    cost_timeline: {
      title: 'What you will pay',
      intro: 'The costs do not all land at the same moment.',
      steps: [
        {
          label: 'At purchase',
          title: 'One-off fee',
          detail: 'From $95 for a 25K to $353 for a 150K, before discount. No subscription.',
        },
        {
          label: 'On failure',
          title: 'Optional reset',
          detail: 'From $79 on a 25K to $229 on a 150K. Starting over is never compulsory.',
        },
        {
          label: 'On passing',
          title: 'No activation fee',
          detail: 'The funded account opens with no further payment.',
        },
        {
          label: 'At payout',
          title: 'Per-request cap',
          detail: 'From $1,000 to $3,000 by account size, with 90% for you.',
        },
      ],
    },
  },
  fr: {
    category_badge: 'Futures uniquement',
    headline: 'Quatre voies vers un compte futures finance, evaluation ou immediat',
    verdict:
      'Une firme futures construite autour du choix : Elite et Prime proposent des ' +
      'evaluations classiques, Nitro vise des paiements plus rapides, et Instant finance ' +
      'des l\u2019achat. Chaque programme porte ses propres limites de perte, sa regle de ' +
      'regularite et ses conditions de retrait \u2014 le bon depend moins du prix que de ' +
      'votre facon de trader.',
    description:
      'FuturesElite vend des comptes futures simules repartis en quatre programmes. Elite et ' +
      'Prime sont des evaluations a frais unique, sans date limite pour reussir. Nitro et ' +
      'Instant raccourcissent ou suppriment l\u2019evaluation, Instant vous financant des ' +
      'l\u2019achat sans objectif a atteindre. Les quatre aboutissent a 90 % de partage des ' +
      'profits, avec des retraits possibles chaque jour une fois le compte finance.\n\n' +
      'Elle convient aux traders futures qui ont deja une methode et veulent choisir le jeu ' +
      'de regles qui lui correspond, plutot que de le subir. Les limites de perte sont des ' +
      'montants en dollars et non des pourcentages, le drawdown se calcule en fin de journee ' +
      'sur les programmes d\u2019evaluation, et sept plateformes sont disponibles, dont ' +
      'Tradovate, NinjaTrader et Quantower.\n\n' +
      'La reserve compte plus que le tarif. Quantum SRL ne detient aucune licence de ' +
      'regulateur financier, et tous les comptes sont simules : les performances restent ' +
      'hypothetiques du debut a la fin. Le programme de trading live existe mais releve ' +
      'd\u2019une decision de l\u2019equipe de risque, pas d\u2019un droit acquis apres un ' +
      'nombre fixe de retraits.',
    headquarters: 'Corso G. Matteotti 61, Latina 04100, Italie',
    regulation_details:
      'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italie, n\u00b0 03095010595. Aucune licence de r\u00e9gulateur financier. Comptes de d\u00e9monstration, performances hypoth\u00e9tiques.',
    drawdown_type: 'Fin de journ\u00e9e',
    time_limit: 'Aucune limite de temps',
    payout_frequency: 'sur demande, chaque jour une fois financ\u00e9',
    assets: ['Futures'],
    included_items: [
      'Journal de trading et tableau de bord analytique',
      'Aucun frais d\u2019activation du compte financ\u00e9',
      'Sept plateformes au choix',
    ],
    pros: [
      'Partage des profits \u00e0 90 % sur le programme Elite',
      'Drawdown de fin de journ\u00e9e, sans aucune limite de perte journali\u00e8re',
      'Aucune r\u00e8gle de r\u00e9gularit\u00e9 une fois financ\u00e9',
      'Aucun frais d\u2019activation pour d\u00e9bloquer le compte financ\u00e9',
      'Retrait possible chaque jour une fois financ\u00e9',
      'Remises par lot : le cinqui\u00e8me compte est offert',
    ],
    cons: [
      'Aucune licence de r\u00e9gulateur financier',
      'Comptes de d\u00e9monstration, performances hypoth\u00e9tiques',
      '3 jours de trading minimum en \u00e9valuation, 6 une fois financ\u00e9',
      'Plafond de retrait par demande, de 1 000 \u00e0 3 000 $ selon la taille',
      'Les grilles Nitro, Prime et Instant ne sont pas publiques',
    ],
    special_features: [
      'Partage des profits \u00e0 90 % sur le programme Elite',
      'Drawdown de fin de journ\u00e9e, aucune limite de perte journali\u00e8re',
      'Aucune r\u00e8gle de r\u00e9gularit\u00e9 une fois financ\u00e9',
      'Aucun frais d\u2019activation du compte financ\u00e9',
      'Remises par lot : le cinqui\u00e8me compte est offert',
      'Comptes Instant disponibles, sans \u00e9valuation',
    ],
    verdict_card: {
      title: 'Pour qui, et pour qui pas',
      body:
        'FuturesElite mise sur des conditions g\u00e9n\u00e9reuses une fois financ\u00e9 : 90 % de partage, aucune r\u00e8gle de r\u00e9gularit\u00e9, retrait quotidien. En \u00e9change, la firme est jeune et reste une soci\u00e9t\u00e9 de trading propri\u00e9taire, pas un courtier r\u00e9gul\u00e9.',
      points: [
        'Un partage \u00e9lev\u00e9 et des retraits fr\u00e9quents, sans attendre une \u00e9ch\u00e9ance',
        'Une \u00e9valuation sans limite de perte journali\u00e8re, qui laisse respirer',
        'Un compte financ\u00e9 qui s\u2019ouvre sans frais d\u2019activation',
        'Un plafond de 10 comptes financ\u00e9s actifs, dont 5 au maximum partag\u00e9s entre Elite, Custom, Instant et Nitro',
      ],
    },
    program_guide: {
      title: 'Quatre programmes',
      intro:
        'Quatre programmes sont vendus : Elite, Nitro, Prime et Instant. Leurs prix et leurs r\u00e8gles diff\u00e8rent, et le configurateur ci-dessus les d\u00e9taille un par un.',
      options: [
        {
          name: 'Elite',
          badge: 'Grille publique',
          summary:
            'Une \u00e9valuation en une \u00e9tape, un drawdown de fin de journ\u00e9e, aucune perte journali\u00e8re, et 90 % de partage une fois financ\u00e9.',
          points: [
            'Objectif de 5 % du capital',
            'Aucune limite de perte journali\u00e8re',
            '3 jours de trading minimum',
            'Aucun frais d\u2019activation',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Les r\u00e8gles qui d\u00e9cident',
      intro: 'Ce qui distingue vraiment FuturesElite des autres firmes futures.',
      rules: [
        {
          title: 'Aucune limite de perte journali\u00e8re',
          detail:
            'Ni pendant l\u2019\u00e9valuation, ni une fois financ\u00e9. Le risque est encadr\u00e9 par la seule Maximum Loss Limit, recalcul\u00e9e en fin de journ\u00e9e. C\u2019est l\u2019argument principal de la firme, pas une donn\u00e9e manquante.',
        },
        {
          title: 'Drawdown de fin de journ\u00e9e',
          detail:
            'La limite se met \u00e0 jour une fois par jour sur le solde de cl\u00f4ture, pas en continu. Une position en perte latente ne d\u00e9clenche donc pas la limite tant que la journ\u00e9e n\u2019est pas close.',
        },
        {
          title: 'Aucune r\u00e8gle de r\u00e9gularit\u00e9 une fois financ\u00e9',
          detail:
            'La r\u00e8gle s\u2019applique pendant l\u2019\u00e9valuation puis dispara\u00eet sur le compte financ\u00e9. La page de vente affiche deux valeurs c\u00f4te \u00e0 c\u00f4te, 40 % et 50 %, sans pr\u00e9ciser laquelle s\u2019applique : \u00e0 confirmer aupr\u00e8s du partenaire.',
        },
        {
          title: 'Aucun frais d\u2019activation',
          detail:
            'Passer l\u2019\u00e9valuation suffit \u00e0 ouvrir le compte financ\u00e9. Les frais de reset, eux, existent : de 79 \u00e0 229 $ selon la taille.',
        },
      ],
      more: [
        'Retrait possible chaque jour une fois financ\u00e9',
        '6 jours de trading minimum avant un retrait',
        'Aucun buffer de profit exig\u00e9',
        'Sept plateformes au choix, dont Tradovate et NinjaTrader',
        'Le cinqui\u00e8me compte d\u2019un lot est offert',
      ],
    },
    journey: {
      title: 'Ce qui se passe apr\u00e8s le paiement',
      intro: 'Une seule \u00e9tape d\u2019\u00e9valuation, puis le compte financ\u00e9 s\u2019ouvre imm\u00e9diatement.',
      steps: [
        {
          title: '\u00c9valuation',
          detail:
            'Atteindre l\u2019objectif de profit sans franchir la Maximum Loss Limit, sur au moins 3 jours de trading. Aucune limite de temps.',
        },
        {
          title: 'Compte financ\u00e9',
          detail:
            'Ouvert d\u00e8s la validation, sans frais d\u2019activation. La r\u00e8gle de r\u00e9gularit\u00e9 dispara\u00eet \u00e0 ce stade.',
        },
        {
          title: 'Retraits',
          detail:
            'Possibles chaque jour, apr\u00e8s 6 jours de trading, dans la limite du plafond par demande : 1 000 $ sur un 25K, jusqu\u2019\u00e0 3 000 $ sur un 150K.',
        },
        {
          title: 'Cumul de comptes',
          detail:
            'Elite plafonne \u00e0 5 comptes financ\u00e9s. En empilant un programme de m\u00eame taille, jusqu\u2019\u00e0 10 comptes en parall\u00e8le.',
        },
      ],
    },
    cost_timeline: {
      title: 'Ce que vous paierez',
      intro: 'Les co\u00fbts n\u2019arrivent pas tous au m\u00eame moment.',
      steps: [
        {
          label: '\u00c0 l\u2019achat',
          title: 'Frais unique',
          detail: 'De 95 $ pour un 25K \u00e0 353 $ pour un 150K, hors remise. Aucun abonnement.',
        },
        {
          label: 'En cas d\u2019\u00e9chec',
          title: 'Reset optionnel',
          detail: 'De 79 $ sur un 25K \u00e0 229 $ sur un 150K. Reprendre \u00e0 z\u00e9ro n\u2019est jamais obligatoire.',
        },
        {
          label: '\u00c0 la validation',
          title: 'Aucun frais d\u2019activation',
          detail: 'Le compte financ\u00e9 s\u2019ouvre sans paiement suppl\u00e9mentaire.',
        },
        {
          label: 'Au retrait',
          title: 'Plafond par demande',
          detail: 'De 1 000 \u00e0 3 000 $ selon la taille du compte, avec 90 % pour vous.',
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
  // En anglais : ces colonnes vivent dans prop_firm_challenges, que le bundle
  // translations ne couvre pas. Elles suivent donc la langue de base.
  consistency: {
    '1 step':
      'Evaluation: 3 minimum trading days and a consistency rule. No consistency rule once funded. No daily loss limit. No activation fee.',
  },
  payout: {
    'futureselite-elite-25k':
      'Once funded: 90% split, $1,000 payout cap, payouts available daily, 6 minimum trading days, no buffer. Reset $79.',
    'futureselite-elite-50k':
      'Once funded: 90% split, $2,000 payout cap, payouts available daily, 6 minimum trading days, no buffer. Reset $89.',
    'futureselite-elite-100k':
      'Once funded: 90% split, $2,500 payout cap, payouts available daily, 6 minimum trading days, no buffer. Reset $159.',
    'futureselite-elite-150k':
      'Once funded: 90% split, $3,000 payout cap, payouts available daily, 6 minimum trading days, no buffer. Reset $229.',
  },
  riskUnit: 'usd',
  notes: [
    'LE CODE PROMO. SCANNED donne −20 %, confirmé par e-mail par FuturesElite. Mais un coupon SUMMER s’active seul et donne −25 % : sur l’Elite 25K, 71,25 $ contre 76,00 $. Annoncer le code ferait payer plus cher. discount_code et discount_percent restent nuls, l’UPDATE est préparé en commentaire.',
    'NITRO, PRIME, INSTANT. Les trois programmes existent mais leur grille est derrière une authentification. Ils ne figurent pas dans program_guide : une option sans prix ni challenge donne un bouton mort dans le configurateur. Nitro : paiements quotidiens, pas de perte journalière. Prime : le moins cher, jusqu’à 10 comptes, 1,5 M$ cumulés. Instant : aucune évaluation, 80 % de partage.',
    'RÈGLE DE RÉGULARITÉ. La page affiche 40 % et 50 % côte à côte sans dire laquelle s’applique. Décrite en toutes lettres, sans chiffre inventé.',
    'LOGO. logo_url pointait sur /logos/futureselite.png, fichier jamais créé : la production répondait 404 et la tuile était vide. Corrigé vers la favicon du domaine futureselite.com, qui répond. Leur équipe indique de prendre le logo officiel sur leur profil X : le jour où le fichier existe dans public/logos/, repointer logo_url dessus. Ne jamais pointer une colonne sur un fichier absent.',
    'TRUSTPILOT. Les compteurs de leur page d’accueil affichent tous zéro. La fiche montrait pourtant « 4,3 — 25 avis », un couple venu du seed initial et rattaché à aucune source. Vérification tentée le 5 septembre 2026 : Trustpilot répond par un contrôle anti-robot, qui n’a pas été contourné. Faute de source, la note est retirée par database/RUN-futureselite-trustpilot.sql. La remettre demande un relevé manuel.',
    'PRÉSÉLECTION DU PLAN PAR URL. Leur application ne lit que aff, ref, coupon et type. Aucun paramètre de taille. Le lien préremplit l’affiliation et le coupon ; le visiteur choisit son plan sur place.',
  ],
}

// -----------------------------------------------------------------------------
// THE5ERS — mentions légales officielles, Summer Plan, et fiche d'intake
// -----------------------------------------------------------------------------
export const THE5ERS = {
  slug: 'the5ers',
  // Colonnes de base en ANGLAIS ; le francais est dans `fr` -> translations.fr.
  scalars: {
    name: 'The5ers',
    founded_year: 2016,
    headquarters: 'Enstar House, 168 Praed Street, London W2 1RH, United Kingdom',
    country: 'United Kingdom',
    price_currency: 'USD',
    is_regulated: false,
    regulation_details:
      'Five Percent Online Ltd, England & Wales no. 12553363 and Israel no. 515864007. A proprietary-trading evaluation company: not a broker, custodian, exchange or regulated financial institution. Fully simulated trading environment.',
    trustpilot_rating: 4.7,
    min_price: 22,
    max_price: 850,
    profit_split: 80,
    max_profit_split: 100,
    max_allocation:
      'Up to $500,000 on High Stakes and Pro Growth, up to $4,000,000 on Hyper Growth and Bootcamp',
    is_futures: false,
    drawdown_type:
      'Static overall loss on all four programmes: 10% on High Stakes, 6% on Hyper Growth and Pro Growth, 5% in evaluation and 4% once funded on Bootcamp.',
    time_limit: 'No time limit, but an account left 30 days without a trade expires',
    payout_frequency: 'every 14 days, after approval',
    source_url: 'https://the5ers.com/challenge-programs-bootcamp-high-stakes-hyper-growth-explained/',
  },
  arrays: {
    platforms: ['MetaTrader 5'],
    assets: ['Forex CFDs', 'Indices', 'Metals', 'Commodities', 'Crypto'],
    payout_methods: ['Methods shown in The5ers Hub, varying by account'],
    restricted_countries: [
      'Afghanistan', 'Belarus', 'Bosnia and Herzegovina', 'Burundi',
      'Central African Republic', 'Congo (Brazzaville)', 'Congo (Kinshasa)',
      'Crimea', 'Cuba', 'Eritrea', 'Guinea', 'Guinea-Bissau', 'Iran', 'Iraq',
      'Israel', 'Laos', 'Lebanon', 'Liberia', 'Libya', 'Myanmar',
      'North Korea', 'Palestinian Territory', 'Papua New Guinea', 'Russia',
      'Somalia', 'South Sudan', 'Sudan', 'Syria', 'Vanuatu', 'Venezuela',
      'Yemen',
    ],
    included_items: [
      'MetaTrader 5 in Hedge mode, on desktop, web and mobile',
      'Four programmes, from one to three phases',
      'Account growth up to a 100% split',
    ],
    pros: [
      'Trading since 2016',
      'Entry from $22, one of the lowest on the market',
      'The split can reach 100%, a rare ceiling',
      'The growth plan can lead to $4,000,000 on Hyper Growth and Bootcamp',
      'Four genuinely different programmes, from one to three phases',
      'No consistency rule on any of the four programmes',
      'Overnight and weekend holding allowed throughout',
      'Two identified legal entities, in the UK and Israel',
    ],
    cons: [
      'The split starts at 50% on Hyper Growth and Bootcamp',
      'A single platform: MetaTrader 5',
      '31 excluded territories, including Russia, Iran and Israel',
      'No financial regulator licence',
      'Fully simulated environment: the funds are not real capital',
      'An account left 30 days without a trade expires',
      'No publicly advertised reset: you buy a new evaluation',
      'Large payouts can be split into weekly instalments of $10,000',
    ],
    special_features: [
      'Split varies by programme: 80% High Stakes, 75% Pro Growth, 50% Hyper Growth and Bootcamp',
      'All four programmes climb to 100% through account growth',
      'MetaTrader 5 in Hedge mode, on desktop, web and mobile',
      'Forex commission of $4 per round-turn lot, varying by asset',
      'Leverage up to 1:100 on High Stakes, 1:30 on the other three',
      'Indices and metals up to 1:25, crypto 1:2 on High Stakes',
      'An account left 30 days without a trade expires',
      'Part of the 5% Group, alongside Trade The Pool, Trade Delicious and TSG Brokers',
    ],
  },
  json: {
    verdict_card: {
      title: 'Who it suits, and who it does not',
      body:
        'The5ers sells four programmes whose starting split ranges from 50% to 80%. All climb to 100% as the account grows, but where you start changes the maths of your first months completely.',
      points: [
        'Starting for almost nothing: $22 on Bootcamp or High Stakes 2.5K',
        'The best entry split of the range: 80% on High Stakes',
        'Aiming very large: Hyper Growth and Bootcamp lead to $4,000,000',
        'A 100% split ceiling, which few firms offer',
        'No consistency rule, on any of the four programmes',
      ],
    },
    program_guide: {
      title: 'Four programmes, four trade-offs',
      intro: 'The choice turns on three dials: the starting split, the number of phases, and the price.',
      options: [
        {
          name: 'High Stakes',
          badge: 'Two phases',
          summary:
            'The most balanced programme: 80% split from the start, 10% then 5% targets, and the widest daily limit of the range.',
          points: [
            '10% then 5% target, 80% split',
            '5% daily loss, 10% overall loss',
            '3 minimum winning days per phase',
            'Leverage up to 1:100, the highest of the range',
            'From $22 (2.5K) to $545 (100K)',
          ],
        },
        {
          name: 'Pro Growth',
          badge: 'Single phase',
          summary:
            'A single 10% phase and a 75% starting split, at a contained price. Overall loss drops to 6%.',
          points: [
            '10% target in one phase, 75% split',
            '3% daily loss, 6% overall loss',
            'Gradual growth up to $500,000',
            'From $52 (5K) to $329 (50K)',
          ],
        },
        {
          name: 'Hyper Growth',
          badge: 'Single phase, high ceiling',
          summary:
            'The account doubles at each 10% step, up to $4,000,000. In exchange, the split starts at 50% and the entry price is the highest of the range.',
          points: [
            '10% target in one phase, 50% starting split',
            'The account doubles at each target reached',
            '6% overall loss, 3% daily pause threshold',
            'From $260 (5K) to $850 (20K)',
          ],
        },
        {
          name: 'Bootcamp',
          badge: 'Three phases',
          summary:
            'Three 6% steps, with no daily limit during the evaluation, and fees paid in two parts: a low entry, the balance on success.',
          points: [
            'Three 6% targets, 50% starting split',
            'No daily limit during the evaluation',
            '5% overall loss, tightened to 4% once funded',
            'Entry from $22 (20K) to $225 (250K), balance due after success',
          ],
        },
      ],
    },
    key_rules: {
      title: 'The rules that decide it',
      intro: 'Five points comparison sites get wrong or stay silent about.',
      rules: [
        {
          title: 'The starting split ranges from 50% to 80% by programme',
          detail:
            'High Stakes starts at 80%, Pro Growth at 75%, Hyper Growth and Bootcamp at 50%. All four climb to 100% as the account grows, but advertising "up to 100%" without saying where you start hides half the information.',
        },
        {
          title: 'The Hyper Growth daily threshold is a pause, not a failure',
          detail:
            'On Hyper Growth, going past 3% in a day suspends trading until the next day instead of closing the account. On Pro Growth it is a genuine 3% daily loss. On Bootcamp there is no daily limit during the evaluation; the 3% pause only arrives once funded.',
        },
        {
          title: 'An account inactive for 30 days expires',
          detail:
            'There is no deadline to pass an evaluation, but going 30 days without placing a trade closes the account. It is the only calendar constraint here, and it is rarely mentioned elsewhere.',
        },
        {
          title: 'News can be held through, not traded',
          detail:
            'On High Stakes, holding a position through a high-impact release is allowed; opening or closing within the 2 minutes around it is not. The other three programmes forbid news-exploitation strategies without imposing that window.',
        },
        {
          title: 'Large payouts can be split',
          detail:
            'Payouts go out every 14 days from your first trade on a funded account, after approval. A large amount may be paid in weekly instalments capped at $10,000. Worth factoring in if you are aiming at a big account.',
        },
      ],
      more: [
        'No consistency rule on any of the four programmes',
        'Overnight and weekend holding allowed; indices carry high swaps',
        'Forex commission of $4 per round-turn lot, varying by asset',
        'Leverage up to 1:100 on High Stakes, 1:30 on the other three',
        'Indices and metals up to 1:25; crypto 1:2 on High Stakes',
        'No mandatory stop-loss',
        'MetaTrader 5 in Hedge mode only',
      ],
    },
    journey: {
      title: 'What happens after you pay',
      intro: 'The route depends on how many phases your programme has.',
      steps: [
        {
          title: 'Evaluation',
          detail:
            'One phase on Hyper Growth and Pro Growth, two on High Stakes, three on Bootcamp. No deadline, but an account without a trade for 30 days expires.',
        },
        {
          title: 'Funded account',
          detail:
            'The split starts at the programme rate — 80%, 75% or 50% — and climbs towards 100% as the account grows.',
        },
        {
          title: 'Growth',
          detail:
            'High Stakes advances at each 10% step, Hyper Growth doubles the account at each step, Pro Growth grows gradually, Bootcamp at each 5% step. The ceiling is $500,000 on High Stakes and Pro Growth, $4,000,000 on the other two.',
        },
        {
          title: 'Payouts',
          detail:
            'Every 14 days from your first trade on a funded account, subject to approval. A large amount may be split into weekly instalments of up to $10,000.',
        },
      ],
    },
    cost_timeline: {
      title: 'What you will pay',
      intro: 'Three of the four programmes are paid once. Bootcamp is not.',
      steps: [
        {
          label: 'At purchase',
          title: 'One-off fee, except Bootcamp',
          detail:
            'From $22 for a High Stakes 2.5K to $850 for a Hyper Growth 20K. Bootcamp asks only a reduced entry: $22 for a 20K, $225 for a 250K.',
        },
        {
          label: 'On success',
          title: 'Bootcamp balance',
          detail:
            'Bootcamp claims the rest of the fee once the evaluation is passed — $50 on the 20K. The other three ask for nothing further.',
        },
        {
          label: 'On failure',
          title: 'No advertised reset',
          detail: 'The5ers publishes no reset price: starting over means buying a full evaluation.',
        },
        {
          label: 'At payout',
          title: 'Instalments possible',
          detail:
            'Payouts every 14 days after approval. Large amounts may be paid in weekly instalments of $10,000.',
        },
      ],
    },
  },
  fr: {
    headquarters: 'Enstar House, 168 Praed Street, Londres W2 1RH, Royaume-Uni',
    regulation_details:
      'Five Percent Online Ltd, société britannique n° 12553363 et société israélienne n° 515864007. Société d’évaluation de trading propriétaire : ni courtier, ni dépositaire, ni bourse, ni établissement financier régulé. Environnement de trading entièrement simulé.',
    max_allocation:
      'Jusqu’à 500 000 $ sur High Stakes et Pro Growth, jusqu’à 4 000 000 $ sur Hyper Growth et Bootcamp',
    drawdown_type:
      'Perte globale statique sur les quatre programmes : 10 % sur High Stakes, 6 % sur Hyper Growth et Pro Growth, 5 % en évaluation et 4 % une fois financé sur Bootcamp.',
    time_limit: 'Aucune limite de temps, mais un compte resté 30 jours sans trade expire',
    payout_frequency: 'tous les 14 jours, après validation',
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
      intro: 'Le choix se joue sur trois curseurs : le partage de départ, le nombre de phases et le prix.',
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
  // dans la colonne du programme voisin. L'affectation retenue est la seule
  // compatible avec la ligne « Account sizes offered » de l'onglet Programs :
  //   $20K  = Hyper Growth (High Stakes ne vend pas de 20K)
  //   $50K  = Pro Growth   (Hyper Growth s'arrete a 20K)
  //   $100K et $250K = Bootcamp (aucun autre programme ne vend ces tailles)
  // Le 13e element porte le partage de depart propre au programme.
  challenges: [
    ['the5ers-high-stakes-2-5k', 'High Stakes $2.5K', '$2.5K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 22, null, 80],
    ['the5ers-high-stakes-5k', 'High Stakes $5K', '$5K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 39, null, 80],
    ['the5ers-high-stakes-10k', 'High Stakes $10K', '$10K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 78, null, 80],
    ['the5ers-high-stakes-25k', 'High Stakes $25K', '$25K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 195, null, 80],
    ['the5ers-high-stakes-50k', 'High Stakes $50K', '$50K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 309, null, 80],
    ['the5ers-high-stakes-100k', 'High Stakes $100K', '$100K', '2 steps', 10, 5, 10, 5, 'Static', 'Static', 545, null, 80],
    ['the5ers-pro-growth-5k', 'Pro Growth $5K', '$5K', '1 step', 6, 3, 10, null, 'Static', 'Static', 52, null, 75],
    ['the5ers-pro-growth-10k', 'Pro Growth $10K', '$10K', '1 step', 6, 3, 10, null, 'Static', 'Static', 98, null, 75],
    ['the5ers-pro-growth-20k', 'Pro Growth $20K', '$20K', '1 step', 6, 3, 10, null, 'Static', 'Static', 189, null, 75],
    ['the5ers-pro-growth-50k', 'Pro Growth $50K', '$50K', '1 step', 6, 3, 10, null, 'Static', 'Static', 329, null, 75],
    ['the5ers-hyper-growth-5k', 'Hyper Growth $5K', '$5K', '1 step', 6, 3, 10, null, 'Static', 'Static', 260, null, 50],
    ['the5ers-hyper-growth-10k', 'Hyper Growth $10K', '$10K', '1 step', 6, 3, 10, null, 'Static', 'Static', 450, null, 50],
    ['the5ers-hyper-growth-20k', 'Hyper Growth $20K', '$20K', '1 step', 6, 3, 10, null, 'Static', 'Static', 850, null, 50],
    ['the5ers-bootcamp-20k', 'Bootcamp $20K', '$20K', '3 steps', 5, null, 6, 6, 'Static', 'Static', 22, null, 50],
    ['the5ers-bootcamp-100k', 'Bootcamp $100K', '$100K', '3 steps', 5, null, 6, 6, 'Static', 'Static', 95, null, 50],
    ['the5ers-bootcamp-250k', 'Bootcamp $250K', '$250K', '3 steps', 5, null, 6, 6, 'Static', 'Static', 225, null, 50],
  ],
  consistency: {
    '1 step':
      'No consistency rule. The official page contradicts itself on winning days: its table says 3, its specifications require none. An account left 30 days without a trade expires. On Hyper Growth, going past 3% in a day pauses the account rather than closing it.',
    '2 steps':
      '3 minimum winning days per phase, with no consistency rule. No order executed within 2 minutes before or after a high-impact release; holding a position through it is allowed.',
    '3 steps':
      'No minimum days stated, no consistency rule. No daily limit during the evaluation; a 3% daily pause applies once funded. Fees paid in two parts: a reduced entry, the balance due on success.',
  },
  riskUnit: 'percent',
  notes: [
    'LANGUE. Colonnes de base en anglais, français dans translations.fr. La version précédente écrivait le français en base et la page anglaise servait donc du français.',
    'PARTAGE DES PROFITS — RÉSOLU. profit_split restait NULL faute de source. La fiche remplie du 3 septembre 2026 donne le détail par programme : 80 % High Stakes, 75 % Pro Growth, 50 % Hyper Growth, 50 % Bootcamp, les quatre montant jusqu’à 100 % via la croissance. La colonne firme porte 80 avec max_profit_split à 100.',
    'GRILLE DE PRIX MAL ALIGNÉE. L’onglet Pricing pose plusieurs montants dans la colonne du programme voisin : 850 $ sous High Stakes alors que High Stakes ne vend pas de 20K, 95 $ et 329 $ sous Hyper Growth alors que Hyper Growth s’arrête à 20K. L’affectation retenue est la seule compatible avec la ligne « Account sizes offered » du même classeur. À faire confirmer par The5ers.',
    'ÉTATS-UNIS — CORRECTION. La version précédente affirmait « Les traders américains ne sont pas acceptés ». La liste officielle ne les contient pas. Retiré. Israël y figure bien, malgré l’entité israélienne du groupe.',
    'SUMMER PLAN retiré. Le challenge à 249 $ ne figure dans aucun des quatre programmes de la fiche du 3 septembre 2026.',
    'PLATEFORMES. cTrader retiré : la fiche ne liste que MetaTrader 5 en mode Hedge.',
    'OBJECTIF HIGH STAKES — CORRECTION. La version précédente donnait 8 % en première phase. La fiche donne 10 %, puis 5 %.',
    'COMMISSIONS — RÉSOLU. Les deux sources tierces se contredisaient. La fiche donne 4 $ par lot aller-retour sur le forex.',
    'REMISES. Une offre publique de 10 % circule chez un concurrent affilié. Aucun prix barré n’est écrit : ce n’est pas un code PropFirmScanner.',
    'discount_code GDSWCVRTE7 est en base, d’origine inconnue. À confirmer contre le panneau partenaire ou à retirer.',
    'RETRAITS. Rise est cité comme moyen de retrait par des comparateurs, pas par la firme : payout_methods renvoie au Hub.',
    'AFFILIATION. Taux, durée du cookie et calendrier de paiement non publiés.',
    'CHIFFRES DÉCLARATIFS. 262 000 traders financés, 171 employés, 80 M$ versés. Déclarations de la firme, non écrites.',
    'PROVENANCE. Classeur rempli à partir des pages officielles The5ers, non renvoyé et validé par la firme. La page peut dire « vérifié contre la documentation de The5ers », jamais « confirmé par The5ers ».',
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
  // Colonnes de base en ANGLAIS ; le francais est dans `fr` -> translations.fr.
  scalars: {
    name: 'Hantec Trader',
    website_url: 'https://htrader.hmarkets.com/',
    affiliate_url: 'https://myhtrader.hmarkets.com/purchasechallenge?affiliateId=2766',
    founded_year: 2023,
    headquarters: 'Suite 201, The Catalyst Silicon Avenue, 40 Cybercity, 72201 Ebène, Mauritius',
    country: 'Mauritius',
    price_currency: 'USD',
    is_regulated: false,
    regulation_details:
      'Hantec Trader Limited, Mauritius company no. C191400. Unregulated: a proprietary trading company. Partner broker: Hantec Markets Limited / Hantec Markets Mauritius.',
    profit_split: 80,
    // 95 % avec l'add-on « 95% Reward Share ». La FAQ distingue desormais le
    // taux standard du maximum ; sans max_profit_split elle annoncerait
    // « jusqu'a 80 % », ce que la firme nous a signale comme faux.
    max_profit_split: 95,
    min_price: 13,
    max_price: 2139,
    is_futures: false,
    drawdown_type:
      'Daily loss measured on the higher of balance or equity at the previous day’s close. Overall drawdown trailing or static depending on the programme.',
    time_limit: 'No time limit, except Instant24: 24 hours from your first trade',
    payout_frequency: 'on request, decided within 24 business hours',
    source_url: 'https://htrader.hmarkets.com/',
    // Logo officiel fourni par la firme, servi en local. logo_url pointait sur
    // une favicon Google du domaine « hantectrader.com » — qui n'est pas le
    // leur : la requete renvoyait une image vide, d'ou un logo invisible.
    logo_url: '/logos/hantec-trader.png',
  },
  arrays: {
    platforms: ['MetaTrader 4', 'MetaTrader 5'],
    assets: ['Forex', 'Indices', 'Commodities', 'Metals', 'Crypto'],
    payout_methods: ['Bank transfer', 'Cryptocurrency', 'E-wallets'],
    // Liste officielle communiquée par la firme. Repliée sous « Points à
    // connaître » sur la page : longue, mais décisive pour qui la consulte.
    restricted_countries: [
      'Afghanistan', 'Australia', 'Belgium', 'Congo (Brazzaville)', 'Congo (Kinshasa)',
      'Czech Republic', 'Egypt', 'Germany', 'Haiti', 'Iran', 'Israel', 'Jordan',
      'Kosovo', 'Laos', 'Libya', 'Malaysia', 'Myanmar', 'North Korea', 'Pakistan',
      'Puerto Rico', 'Qatar', 'Romania', 'Russia', 'Serbia', 'Somalia',
      'South Sudan', 'Taiwan', 'Thailand', 'United States', 'Uzbekistan',
      'Vietnam', 'Yemen',
    ],
    included_items: [
      'MetaTrader 4 and MetaTrader 5',
      'Seven programmes, from instant funding to three steps',
      '95% split add-on available on six programmes',
    ],
    pros: [
      'Seven programmes covering instant, one, two and three steps',
      'Entry from $13 with Instant24',
      '80% split, raised to 95% with the add-on on six programmes',
      'No time limit, except Instant24 by design',
      'Payout decision within 24 business hours for eligible requests',
      'Identified partner broker: Hantec Markets',
    ],
    cons: [
      'Unregulated: a proprietary trading company, not a broker',
      'US traders are not accepted',
      '32 excluded territories, including Germany, Belgium and Australia',
      'News trading is restricted by default, except on Instant24',
      'Scalping can trigger a profit adjustment beyond a threshold',
      'Leverage capped at 1:1 on crypto',
    ],
    special_features: [
      '80% split, raised to 95% with the 95% Reward Share add-on',
      'Seven programmes, from Instant24 over 24 hours to Endurance over three steps',
      'Daily loss measured on the higher of the previous day’s balance or equity',
      'News Trading add-on to lift the restriction around releases',
      'Leverage 1:50 on forex, 1:15 on indices and commodities, 1:10 on metals',
      'US traders are not accepted',
    ],
  },
  json: {
    verdict_card: {
      title: 'Who it suits, and who it does not',
      body:
        'Hantec Trader offers seven programmes covering almost every profile, from instant funding at $13 to a three-step route. The split starts at 80% and rises to 95% with a paid add-on. In exchange, the firm is unregulated and closes an unusual number of markets.',
      points: [
        'A choice of seven routes, from instant funding to three steps',
        'A very cheap entry: Instant24 starts at $13',
        'A split raised to 95% if you take the add-on',
        'An identified partner broker, backed by the Hantec Markets group',
      ],
    },
    program_guide: {
      title: 'Seven programmes, three families',
      intro:
        'The choice starts with the format: funded straight away, or an evaluation over one, two or three steps.',
      options: [
        {
          name: 'Instant Funding',
          badge: 'Funded immediately',
          summary:
            'No evaluation, no target. The trade-off is the price: $43 on a 1K, up to $2,139 on a 50K.',
          points: ['From 1K to 50K', 'No profit target', '6% daily loss', '6% trailing overall drawdown'],
        },
        {
          name: 'Instant Lite',
          badge: 'Funded, cheaper',
          summary:
            'The same idea at a fifth of the price, against a tighter daily loss and 5 winning days per payout cycle.',
          points: ['From 1K to 100K, from $19', '3% daily loss', '5% overall drawdown', '5 winning days per payout cycle'],
        },
        {
          name: 'Instant24',
          badge: 'Twenty-four hours',
          summary:
            'The cheapest format in the catalogue: the account lives 24 hours from your first trade. It is also the only programme where news trading is free.',
          points: ['From 2K to 100K, from $13', '24 hours from the first trade', '2% daily loss', 'News trading allowed'],
        },
        {
          name: 'Express',
          badge: 'One step',
          summary: 'A single 10% phase, with no minimum days, and a 6% trailing overall drawdown.',
          points: ['From 2K to 200K, from $39', '10% target', 'No minimum days', '6% trailing drawdown'],
        },
        {
          name: 'Enhanced',
          badge: 'Two steps',
          summary:
            '10% then 5% targets, with the widest daily limit in the catalogue and a static drawdown.',
          points: ['From 5K to 200K, from $59', '10% then 5% target', '5% daily loss', '3 winning days per step'],
        },
        {
          name: 'EnhancedX',
          badge: 'Two steps, no minimum days',
          summary:
            'Lower targets than Enhanced, 8% then 4%, and no minimum days, against a tighter daily limit.',
          points: ['From 5K to 200K, from $59', '8% then 4% target', '4% daily loss', 'No minimum days'],
        },
        {
          name: 'Endurance',
          badge: 'Three steps',
          summary:
            'Three 6% steps, the most gradual route and the cheapest at equal capital: $29 for a 5K.',
          points: ['From 5K to 200K, from $29', '6% target at each step', '8% static drawdown', '3 days per step'],
        },
      ],
    },
    key_rules: {
      title: 'The rules that decide it',
      intro: 'Four points sent directly by the firm, two of which corrected our previous page.',
      rules: [
        {
          title: 'The split is 80%, not 95%',
          detail:
            'The standard rate is 80%. The 95% comes from the paid "95% Reward Share" add-on, available on Instant Funding, Instant Lite, Instant24, Endurance, EnhancedX, Enhanced and Express.',
        },
        {
          title: 'News trading is restricted by default',
          detail:
            'During the evaluation it is free on Express, Enhanced, EnhancedX and Endurance. On a funded Hantec Trader account, opening or closing a position within 3 minutes of a high-impact release is forbidden unless you take the News Trading add-on. Instant Funding and Instant Lite follow the same restriction; Instant24 is the only one that allows it freely.',
        },
        {
          title: 'Scalping is bounded by a threshold, not banned',
          detail:
            'If net profits from positions held under 3 minutes account for 30% or more of total net profit over the evaluation period, the activity is classed as scalping and can lead to a profit adjustment or a trading restriction.',
        },
        {
          title: 'The daily loss is measured on the previous day',
          detail:
            'Across all seven programmes, the daily limit is measured on the higher of balance or equity at the previous day’s close. The overall drawdown trails on the instant programmes and Express, and is static on Endurance, Enhanced and EnhancedX.',
        },
      ],
      more: [
        'Leverage 1:50 on forex, 1:15 on indices and commodities',
        'Leverage 1:10 on metals, 1:1 on crypto',
        'MetaTrader 4 and MetaTrader 5',
        'Payout decision within 24 business hours for eligible requests',
        'Payouts by bank transfer, crypto or e-wallet',
      ],
    },
    journey: {
      title: 'What happens after you pay',
      intro: 'The route depends on which programme family you picked.',
      steps: [
        {
          title: 'Instant funding',
          detail:
            'On Instant Funding, Instant Lite and Instant24 there is no evaluation: the account is live from purchase, with its own risk limits.',
        },
        {
          title: 'Evaluation',
          detail:
            'On Express, a single 10% phase. On Enhanced and EnhancedX, two phases. On Endurance, three 6% steps. No time limit on those four programmes.',
        },
        {
          title: 'Hantec Trader account',
          detail:
            'Once funded, the news restriction applies within 3 minutes of high-impact releases, unless you hold the News Trading add-on, and except on Instant24.',
        },
        {
          title: 'Payouts',
          detail:
            'Decision within 24 business hours for eligible requests; how fast the funds land depends on the method. 80% split, or 95% with the add-on.',
        },
      ],
    },
  },
  fr: {
    headquarters: 'Suite 201, The Catalyst Silicon Avenue, 40 Cybercity, 72201 Ebène, Maurice',
    regulation_details:
      'Hantec Trader Limited, société mauricienne n° C191400. Non régulée : société de trading propriétaire. Courtier partenaire : Hantec Markets Limited / Hantec Markets Mauritius.',
    drawdown_type:
      'Perte journalière calculée sur le plus élevé du solde ou de l’equity à la clôture de la veille. Drawdown global glissant ou statique selon le programme.',
    time_limit: 'Aucune limite de temps, sauf Instant24 : 24 heures à partir du premier trade',
    payout_frequency: 'sur demande, avec décision sous 24 heures ouvrées',
    assets: ['Forex', 'Indices', 'Matières premières', 'Métaux', 'Crypto'],
    payout_methods: ['Virement bancaire', 'Cryptomonnaie', 'Portefeuilles électroniques'],
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
  // En anglais, comme FuturesElite : prop_firm_challenges n'a pas de bundle
  // de traduction.
  consistency: {
    'Instant': 'No profit target, no minimum days. 80% split, raised to 95% with the add-on. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.',
    'Instant Lite': '5 winning days per payout cycle. No profit target. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.',
    'Instant 24h': 'The account lives 24 hours from the first trade. No profit target. The only programme where news trading is free.',
    '1 step': 'No minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.',
    '2 steps': 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.',
    '3 steps': '3 trading days per step. News free during the evaluation, restricted once funded unless you hold the add-on.',
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
