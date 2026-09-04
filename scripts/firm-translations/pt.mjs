// Português — tradução do conteúdo editorial inglês das fichas.
// Ver index.mjs para o funcionamento da sobreposição.

export const pt = {
  ftmo: {
    headquarters: 'Quadrio Offices, Purkyňova 2121/3, 110 00 Praga, República Checa',
    regulation_details:
      'FTMO Evaluation Global s.r.o.; a entidade contratante pode variar consoante a região. Nem corretora nem empresa de investimento: o serviço assenta em contas simuladas e não aceita depósitos de clientes.',
    max_allocation: 'Até 400 000 $ de alocação inicial e até 2 000 000 $ através do Scaling Plan',
    drawdown_type:
      'Perda diária calculada sobre o equity e reposta à meia-noite CE(S)T. O drawdown global é progressivo ao fecho no 1-Step e bloqueia ao atingir o saldo inicial; é fixo no 2-Step.',
    time_limit: 'Sem limite de tempo, nos dois produtos',
    payout_frequency: 'a pedido, no mínimo 14 dias após a primeira operação',
    assets: ['CFD sobre forex', 'Metais', 'Índices', 'Energia', 'Cripto', 'Matérias-primas', 'CFD sobre ações'],
    payout_methods: ['Transferência bancária', 'Outros métodos apresentados na Área de Cliente, consoante a disponibilidade'],
    included_items: [
      'MetaTrader 4, MetaTrader 5, cTrader e TradingView',
      'Painel FTMO e métricas de desempenho',
      'Sem taxa de ativação da conta financiada',
    ],
    pros: [
      'Em atividade desde 2015, um dos historiais mais longos do setor',
      '90 % de partilha no 1-Step, a mais alta dos dois produtos',
      'Sem limite de tempo, nem no 1-Step nem no 2-Step',
      'O 1-Step não impõe um mínimo fixo de dias de negociação',
      'No 2-Step, a taxa é reembolsada a 100 % com o primeiro pagamento',
      'A conta Swing levanta as restrições de notícias, noite e fim de semana',
      'Alocação até 400 000 $, e até 2 000 000 $ com o Scaling Plan',
      'Preços em euros, a partir de 79 €',
    ],
    cons: [
      'Sem reset: após uma falha é preciso comprar um challenge inteiro',
      'O reembolso da taxa não é anunciado no 1-Step',
      'O 1-Step aperta o limite diário para 3 % e usa um drawdown progressivo',
      'O 2-Step exige 4 dias de negociação em cada fase',
      'A conta financiada Standard restringe notícias, noite e fim de semana',
      'O Swing não existe no 1-Step e limita a alavancagem a 1:30',
      'O Swing não oferece conta de 200K',
    ],
    special_features: [
      'Dois produtos com regras verdadeiramente diferentes',
      '1-Step: 3 % de perda diária, drawdown progressivo bloqueado no saldo inicial',
      '2-Step: 5 % de perda diária, drawdown fixo',
      'A regra do melhor dia aplica-se apenas ao 1-Step',
      'Alavancagem até 1:100 no Standard, 1:30 no Swing',
      'Scaling Plan: +25 % de saldo a cada 4 meses, apenas no 2-Step',
      'Sem stop-loss obrigatório',
      'Pagamento por cartão, transferência, PayPal, Skrill, cripto e Revolut Pay; Apple Pay e Google Pay consoante a disponibilidade',
    ],
    verdict_card: {
      title: 'Para quem serve, e para quem não',
      body:
        'A FTMO vende dois produtos que convém distinguir antes de comprar. O 1-Step paga mais — 90 % — e não impõe calendário, mas aperta o dia a dia. O 2-Step paga 80 %, deixa mais margem diária e devolve a taxa com o primeiro pagamento.',
      points: [
        'A melhor partilha sem condições: 90 % desde o primeiro pagamento no 1-Step',
        'Recuperar a taxa: o 2-Step reembolsa-a a 100 % com o primeiro pagamento',
        'Um limite diário confortável: 5 % no 2-Step contra 3 % no 1-Step',
        'A liberdade de manter posições de noite e ao fim de semana, com o Swing',
        'Uma alocação que chega a 2 000 000 $ com o Scaling Plan',
      ],
    },
    program_guide: {
      title: 'Três percursos, três compromissos',
      intro:
        'Os três levam a uma conta financiada. A escolha joga-se na partilha, no calendário e na liberdade de manter posições.',
      options: [
        {
          name: '1-Step',
          badge: 'Uma só fase',
          summary:
            'A partilha mais alta, 90 %, e sem dias mínimos. Em troca, um limite diário de 3 % e um drawdown que segue os seus máximos.',
          points: [
            'Objetivo de 10 %, partilha de 90 %',
            '3 % de perda diária',
            'Drawdown progressivo, bloqueado no saldo inicial',
            'Melhor dia ≤ 50 % do lucro dos dias positivos',
            'De 79 € (10K) a 999 € (200K)',
          ],
        },
        {
          name: '2-Step Standard',
          badge: 'Duas fases',
          summary:
            'Objetivo de 10 % e depois 5 %, um limite diário mais largo de 5 % e um drawdown fixo. A taxa é reembolsada com o primeiro pagamento.',
          points: [
            'Objetivo 10 % depois 5 %, partilha de 80 %',
            '5 % de perda diária, drawdown fixo',
            '4 dias mínimos de negociação por fase',
            'Taxa reembolsada a 100 % no primeiro pagamento',
            'De 89 € (10K) a 1 080 € (200K)',
          ],
        },
        {
          name: '2-Step Swing',
          badge: 'Manter posições',
          summary:
            'As regras do 2-Step, sem qualquer restrição de notícias, noite ou fim de semana, incluindo na conta financiada. A alavancagem desce para 1:30 e não há 200K.',
          points: [
            'Mesmos objetivos e limites que o 2-Step Standard',
            'Notícias, noite e fim de semana livres, mesmo já financiado',
            'Alavancagem limitada a 1:30',
            'De 99 € (10K) a 599 € (100K)',
          ],
        },
      ],
    },
    key_rules: {
      title: 'As regras que decidem',
      intro: 'Cinco pontos que a maioria dos comparadores conta mal.',
      rules: [
        {
          title: 'A partilha depende do produto',
          detail:
            '90 % no 1-Step, sem condições. 80 % no 2-Step, até 90 % através do Scaling Plan. As páginas que anunciam «até 90 %» para toda a gama escondem que o 1-Step já começa aí.',
        },
        {
          title: 'Só o 2-Step reembolsa a taxa',
          detail:
            'O 2-Step devolve 100 % do preço do challenge com o primeiro pagamento. No 1-Step, a FTMO não anuncia reembolso. Com um preço de tabela mais baixo, o 1-Step sai portanto mais caro depois de financiado.',
        },
        {
          title: 'A perda diária difere, e mede-se sobre o equity',
          detail:
            '3 % no 1-Step, 5 % no 2-Step. É medida sobre o equity — ou seja, incluindo perdas latentes, comissões e swaps — e repõe-se à meia-noite CE(S)T, não no seu fuso horário.',
        },
        {
          title: 'O drawdown do 1-Step avança e depois bloqueia',
          detail:
            'Sobe com o seu saldo de fecho mais alto e para definitivamente ao atingir o saldo inicial. O 2-Step usa um drawdown fixo desde a primeira operação.',
        },
        {
          title: 'Não existe qualquer reset',
          detail:
            'Um challenge falhado não se reinicia com desconto: é preciso comprar outro inteiro. É uma diferença de custo real face às firmas que cobram 50 % por um reset.',
        },
      ],
      more: [
        'Sem limite de tempo nos três percursos',
        'Sem dias mínimos fixos no 1-Step; 4 por fase no 2-Step',
        'Sem taxa de ativação da conta financiada',
        'Sem stop-loss obrigatório',
        'Alavancagem até 1:100 no Standard, 1:30 no Swing',
        'Scaling Plan: +25 % de saldo a cada 4 meses, no 2-Step',
        'MT4, MT5, cTrader e TradingView',
      ],
    },
    journey: {
      title: 'O que acontece depois do pagamento',
      intro: 'O percurso muda consoante o produto.',
      steps: [
        {
          title: 'Avaliação',
          detail:
            'Uma fase no 1-Step, duas no 2-Step. Nesta etapa não há restrição de notícias nem de posições noturnas ou de fim de semana, qualquer que seja o produto.',
        },
        {
          title: 'Verificação',
          detail: 'Apenas no 2-Step: um segundo objetivo de 5 %, com os mesmos limites de risco da primeira fase.',
        },
        {
          title: 'Conta FTMO',
          detail:
            'A Standard restringe as notícias e obriga a fechar antes de pausas de mercado superiores a 2 horas e antes do fim de semana. A Swing não restringe nada. A Swing não existe no 1-Step.',
        },
        {
          title: 'Pagamentos',
          detail:
            'O primeiro não pode ser pedido antes de 14 dias; depois escolhe o seu dia de pagamento. No 2-Step, esse primeiro pagamento reembolsa também o preço do challenge.',
        },
      ],
    },
    cost_timeline: {
      title: 'O que vai pagar',
      intro: 'Os custos não chegam todos ao mesmo tempo — e parte volta.',
      steps: [
        { label: 'Na compra', title: 'Taxa única', detail: 'De 79 € para um 1-Step 10K a 1 080 € para um 2-Step 200K. Sem subscrição.' },
        { label: 'Em caso de falha', title: 'Sem reset disponível', detail: 'A FTMO não vende resets com desconto: recomeçar significa comprar um challenge inteiro.' },
        { label: 'Ao passar', title: 'Sem taxa de ativação', detail: 'A conta financiada abre sem qualquer pagamento adicional.' },
        {
          label: 'No primeiro pagamento',
          title: 'Reembolso no 2-Step',
          detail: 'O 2-Step devolve 100 % do preço do challenge com o primeiro pagamento. O 1-Step não anuncia reembolso.',
        },
      ],
    },
  },

  the5ers: {
    headquarters: 'Enstar House, 168 Praed Street, Londres W2 1RH, Reino Unido',
    regulation_details:
      'Five Percent Online Ltd, Inglaterra e País de Gales n.º 12553363 e Israel n.º 515864007. Empresa de avaliação de trading proprietário: nem corretora, nem depositária, nem bolsa, nem instituição financeira regulada. Ambiente de negociação totalmente simulado.',
    max_allocation:
      'Até 500 000 $ em High Stakes e Pro Growth, até 4 000 000 $ em Hyper Growth e Bootcamp',
    drawdown_type:
      'Perda global estática nos quatro programas: 10 % em High Stakes, 6 % em Hyper Growth e Pro Growth, 5 % em avaliação e 4 % depois de financiado em Bootcamp.',
    time_limit: 'Sem limite de tempo, mas uma conta 30 dias sem operar expira',
    payout_frequency: 'a cada 14 dias, após aprovação',
    assets: ['CFD sobre forex', 'Índices', 'Metais', 'Matérias-primas', 'Cripto'],
    payout_methods: ['Métodos apresentados no Hub da The5ers, variáveis consoante a conta'],
    restricted_countries: [
      'Afeganistão', 'Bielorrússia', 'Bósnia e Herzegovina', 'Burundi', 'Congo (Brazzaville)',
      'Congo (Kinshasa)', 'Coreia do Norte', 'Crimeia', 'Cuba', 'Eritreia', 'Guiné',
      'Guiné-Bissau', 'Iraque', 'Irão', 'Israel', 'Laos', 'Líbano', 'Libéria', 'Líbia',
      'Myanmar', 'Papua-Nova Guiné', 'República Centro-Africana', 'Rússia', 'Somália',
      'Sudão', 'Sudão do Sul', 'Síria', 'Territórios Palestinianos', 'Vanuatu',
      'Venezuela', 'Iémen',
    ],
    included_items: [
      'MetaTrader 5 em modo Hedge, em computador, web e telemóvel',
      'Quatro programas, de uma a três fases',
      'Crescimento da conta até 100 % de partilha',
    ],
    pros: [
      'Em atividade desde 2016',
      'Entrada a partir de 22 $, uma das mais baixas do mercado',
      'A partilha pode chegar a 100 %, um teto raro',
      'O plano de crescimento pode levar a 4 000 000 $ em Hyper Growth e Bootcamp',
      'Quatro programas verdadeiramente diferentes, de uma a três fases',
      'Sem regra de consistência em nenhum dos quatro programas',
      'Posições noturnas e de fim de semana permitidas em todos',
      'Duas entidades jurídicas identificadas, no Reino Unido e em Israel',
    ],
    cons: [
      'A partilha começa em 50 % em Hyper Growth e Bootcamp',
      'Uma só plataforma: MetaTrader 5',
      '31 territórios excluídos, entre os quais Rússia, Irão e Israel',
      'Sem licença de qualquer regulador financeiro',
      'Ambiente totalmente simulado: os fundos não são capital real',
      'Uma conta 30 dias sem operar expira',
      'Sem reset anunciado publicamente: é preciso comprar outra avaliação',
      'Os pagamentos grandes podem ser fracionados em prestações semanais de 10 000 $',
    ],
    special_features: [
      'Partilha variável consoante o programa: 80 % High Stakes, 75 % Pro Growth, 50 % Hyper Growth e Bootcamp',
      'Os quatro programas sobem até 100 % através do crescimento da conta',
      'MetaTrader 5 em modo Hedge, em computador, web e telemóvel',
      'Comissão de forex de 4 $ por lote ida e volta, variável consoante o ativo',
      'Alavancagem até 1:100 em High Stakes, 1:30 nos outros três',
      'Índices e metais até 1:25, cripto 1:2 em High Stakes',
      'Uma conta 30 dias sem operar expira',
      'Membro do 5% Group, com Trade The Pool, Trade Delicious e TSG Brokers',
    ],
    verdict_card: {
      title: 'Para quem serve, e para quem não',
      body:
        'A The5ers vende quatro programas cuja partilha de partida vai de 50 % a 80 %. Todos sobem a 100 % à medida que a conta cresce, mas o ponto de partida muda por completo as contas dos primeiros meses.',
      points: [
        'Começar por quase nada: 22 $ em Bootcamp ou High Stakes 2,5K',
        'A melhor partilha de entrada da gama: 80 % em High Stakes',
        'Apontar muito alto: Hyper Growth e Bootcamp levam até 4 000 000 $',
        'Um teto de partilha de 100 %, que poucas firmas oferecem',
        'Sem regra de consistência, em nenhum dos quatro programas',
      ],
    },
    program_guide: {
      title: 'Quatro programas, quatro compromissos',
      intro: 'A escolha joga-se em três comandos: a partilha de partida, o número de fases e o preço.',
      options: [
        {
          name: 'High Stakes',
          badge: 'Duas fases',
          summary:
            'O programa mais equilibrado: 80 % de partilha desde o início, objetivo de 10 % e depois 5 %, e o limite diário mais largo da gama.',
          points: [
            'Objetivo 10 % depois 5 %, partilha de 80 %',
            '5 % de perda diária, 10 % de perda global',
            '3 dias rentáveis mínimos por fase',
            'Alavancagem até 1:100, a mais alta da gama',
            'De 22 $ (2,5K) a 545 $ (100K)',
          ],
        },
        {
          name: 'Pro Growth',
          badge: 'Uma fase',
          summary: 'Uma só fase a 10 % e 75 % de partilha de partida, por um preço contido. A perda global desce para 6 %.',
          points: [
            'Objetivo de 10 % numa fase, partilha de 75 %',
            '3 % de perda diária, 6 % de perda global',
            'Crescimento gradual até 500 000 $',
            'De 52 $ (5K) a 329 $ (50K)',
          ],
        },
        {
          name: 'Hyper Growth',
          badge: 'Uma fase, teto elevado',
          summary:
            'A conta duplica em cada patamar de 10 %, até 4 000 000 $. Em troca, a partilha começa em 50 % e o preço de entrada é o mais alto da gama.',
          points: [
            'Objetivo de 10 % numa fase, partilha de partida de 50 %',
            'A conta duplica em cada objetivo atingido',
            '6 % de perda global, limiar de pausa diária de 3 %',
            'De 260 $ (5K) a 850 $ (20K)',
          ],
        },
        {
          name: 'Bootcamp',
          badge: 'Três fases',
          summary:
            'Três patamares de 6 %, sem limite diário durante a avaliação, com a taxa paga em dois momentos: uma entrada reduzida e o resto ao passar.',
          points: [
            'Três objetivos de 6 %, partilha de partida de 50 %',
            'Sem limite diário durante a avaliação',
            '5 % de perda global, reduzida a 4 % depois de financiado',
            'Entrada de 22 $ (20K) a 225 $ (250K), resto devido após passar',
          ],
        },
      ],
    },
    key_rules: {
      title: 'As regras que decidem',
      intro: 'Cinco pontos que os comparadores erram ou calam.',
      rules: [
        {
          title: 'A partilha de partida vai de 50 % a 80 % consoante o programa',
          detail:
            'High Stakes começa em 80 %, Pro Growth em 75 %, Hyper Growth e Bootcamp em 50 %. Os quatro sobem a 100 % com o crescimento da conta, mas anunciar «até 100 %» sem dizer de onde se parte esconde metade da informação.',
        },
        {
          title: 'O limiar diário do Hyper Growth é uma pausa, não uma falha',
          detail:
            'No Hyper Growth, ultrapassar 3 % no dia suspende a negociação até ao dia seguinte em vez de fechar a conta. No Pro Growth é uma verdadeira perda diária de 3 %. No Bootcamp não há limite diário durante a avaliação; a pausa de 3 % só chega depois de financiado.',
        },
        {
          title: 'Uma conta inativa 30 dias expira',
          detail:
            'Não há prazo para passar uma avaliação, mas ficar 30 dias sem operar fecha a conta. É a única exigência de calendário da casa, e raramente é mencionada noutros sítios.',
        },
        {
          title: 'As notícias seguram-se, não se negoceiam',
          detail:
            'No High Stakes é permitido manter uma posição durante uma notícia de forte impacto; abrir ou fechar nos 2 minutos que a rodeiam, não. Os outros três programas proíbem as estratégias de exploração de notícias sem impor essa janela.',
        },
        {
          title: 'Os pagamentos grandes podem ser fracionados',
          detail:
            'Os pagamentos saem a cada 14 dias a partir da primeira operação em conta financiada, após aprovação. Um montante elevado pode ser pago em prestações semanais com um teto de 10 000 $. A ter em conta se procura uma conta grande.',
        },
      ],
      more: [
        'Sem regra de consistência em nenhum dos quatro programas',
        'Posições noturnas e de fim de semana permitidas; os índices têm swaps elevados',
        'Comissão de forex de 4 $ por lote ida e volta, variável consoante o ativo',
        'Alavancagem até 1:100 em High Stakes, 1:30 nos outros três',
        'Índices e metais até 1:25; cripto 1:2 em High Stakes',
        'Sem stop-loss obrigatório',
        'Apenas MetaTrader 5 em modo Hedge',
      ],
    },
    journey: {
      title: 'O que acontece depois do pagamento',
      intro: 'O percurso depende do número de fases do seu programa.',
      steps: [
        {
          title: 'Avaliação',
          detail:
            'Uma fase em Hyper Growth e Pro Growth, duas em High Stakes, três em Bootcamp. Sem prazo, mas uma conta sem operar durante 30 dias expira.',
        },
        {
          title: 'Conta financiada',
          detail:
            'A partilha começa na taxa do programa — 80 %, 75 % ou 50 % — e sobe para 100 % à medida que a conta cresce.',
        },
        {
          title: 'Crescimento',
          detail:
            'High Stakes avança em cada patamar de 10 %, Hyper Growth duplica a conta em cada patamar, Pro Growth cresce gradualmente, Bootcamp em cada patamar de 5 %. O teto é de 500 000 $ em High Stakes e Pro Growth, 4 000 000 $ nos outros dois.',
        },
        {
          title: 'Pagamentos',
          detail:
            'A cada 14 dias a partir da primeira operação em conta financiada, sujeito a aprovação. Um montante elevado pode ser fracionado em prestações semanais até 10 000 $.',
        },
      ],
    },
    cost_timeline: {
      title: 'O que vai pagar',
      intro: 'Três dos quatro programas pagam-se de uma só vez. O Bootcamp, não.',
      steps: [
        {
          label: 'Na compra',
          title: 'Taxa única, exceto Bootcamp',
          detail:
            'De 22 $ para um High Stakes 2,5K a 850 $ para um Hyper Growth 20K. O Bootcamp pede apenas uma entrada reduzida: 22 $ para um 20K, 225 $ para um 250K.',
        },
        {
          label: 'Ao passar',
          title: 'Resto do Bootcamp',
          detail: 'O Bootcamp reclama o resto da taxa depois de passada a avaliação — 50 $ no 20K. Os outros três não pedem mais nada.',
        },
        { label: 'Em caso de falha', title: 'Sem reset anunciado', detail: 'A The5ers não publica preço de reset: recomeçar significa comprar uma avaliação completa.' },
        { label: 'No pagamento', title: 'Fracionamento possível', detail: 'Pagamentos a cada 14 dias após aprovação. Os montantes altos podem ser pagos em prestações semanais de 10 000 $.' },
      ],
    },
  },

  futureselite: {
    headquarters: 'Corso G. Matteotti 61, Latina 04100, Itália',
    regulation_details:
      'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Itália, n.º 03095010595. Sem licença de qualquer regulador financeiro. Contas demo, resultados hipotéticos.',
    drawdown_type: 'Fim do dia',
    time_limit: 'Sem limite de tempo',
    payout_frequency: 'a pedido, diariamente depois de financiado',
    assets: ['Futuros'],
    included_items: [
      'Diário de negociação e painel de análise',
      'Sem taxa de ativação da conta financiada',
      'Sete plataformas à escolha',
    ],
    pros: [
      '90 % de partilha no programa Elite',
      'Drawdown ao fecho do dia, sem qualquer limite de perda diária',
      'Sem regra de consistência depois de financiado',
      'Sem taxa de ativação da conta financiada',
      'Levantamentos possíveis todos os dias depois de financiado',
      'Descontos por lote: a quinta conta é grátis',
    ],
    cons: [
      'Sem licença de qualquer regulador financeiro',
      'Contas demo, resultados hipotéticos',
      '3 dias mínimos de negociação em avaliação, 6 depois de financiado',
      'Teto de levantamento por pedido, de 1 000 $ a 3 000 $ consoante o tamanho',
      'As tabelas Nitro, Prime e Instant não são públicas',
    ],
    special_features: [
      '90 % de partilha no programa Elite',
      'Drawdown ao fecho do dia, sem limite de perda diária',
      'Sem regra de consistência depois de financiado',
      'Sem taxa de ativação da conta financiada',
      'Descontos por lote: a quinta conta é grátis',
      'Contas Instant disponíveis, sem avaliação',
    ],
    verdict_card: {
      title: 'Para quem serve, e para quem não',
      body:
        'A FuturesElite aposta em condições generosas depois de financiado: 90 % de partilha, sem regra de consistência, levantamento diário. Em troca, a firma é jovem, não é regulada e publica apenas uma das suas quatro tabelas.',
      points: [
        'Uma partilha elevada e levantamentos frequentes, sem esperar por um prazo',
        'Uma avaliação sem limite de perda diária, que deixa respirar',
        'Uma conta financiada que abre sem taxa de ativação',
        'A possibilidade de acumular até dez contas em paralelo',
      ],
    },
    program_guide: {
      title: 'O programa Elite',
      intro:
        'O Elite é o único programa com tabela pública. Nitro, Prime e Instant existem no checkout, mas os seus preços não são mostrados.',
      options: [
        {
          name: 'Elite',
          badge: 'Tabela pública',
          summary:
            'Uma avaliação de uma etapa, um drawdown ao fecho do dia, sem limite de perda diária e 90 % de partilha depois de financiado.',
          points: ['Objetivo de 5 %', 'Sem limite de perda diária', '3 dias mínimos de negociação', 'Sem taxa de ativação'],
        },
      ],
    },
    key_rules: {
      title: 'As regras que decidem',
      intro: 'O que distingue realmente a FuturesElite das outras firmas de futuros.',
      rules: [
        {
          title: 'Sem limite de perda diária',
          detail:
            'Nem durante a avaliação, nem depois de financiado. O risco é limitado apenas pela Maximum Loss Limit, recalculada ao fecho de cada dia. É o argumento principal da firma, não um dado em falta.',
        },
        {
          title: 'Drawdown ao fecho do dia',
          detail:
            'O limite atualiza-se uma vez por dia sobre o saldo de fecho, não em contínuo. Uma posição em perda latente não aciona portanto o limite enquanto o dia não fechar.',
        },
        {
          title: 'Sem regra de consistência depois de financiado',
          detail:
            'A regra aplica-se durante a avaliação e desaparece na conta financiada. A página de venda mostra dois valores lado a lado, 40 % e 50 %, sem dizer qual vale: a confirmar com o parceiro.',
        },
        {
          title: 'Sem taxa de ativação',
          detail: 'Passar a avaliação basta para abrir a conta financiada. As taxas de reset, essas, existem: de 79 $ a 229 $ consoante o tamanho.',
        },
      ],
      more: [
        'Levantamentos possíveis todos os dias depois de financiado',
        '6 dias mínimos de negociação antes de um levantamento',
        'Sem margem de lucro exigida',
        'Sete plataformas à escolha, entre elas Tradovate e NinjaTrader',
        'A quinta conta de um lote é grátis',
      ],
    },
    journey: {
      title: 'O que acontece depois do pagamento',
      intro: 'Uma só etapa de avaliação e a conta financiada abre de imediato.',
      steps: [
        {
          title: 'Avaliação',
          detail: 'Atingir o objetivo de lucro sem ultrapassar a Maximum Loss Limit, em pelo menos 3 dias de negociação. Sem limite de tempo.',
        },
        { title: 'Conta financiada', detail: 'Aberta assim que passa, sem taxa de ativação. A regra de consistência desaparece nesta etapa.' },
        {
          title: 'Levantamentos',
          detail: 'Possíveis todos os dias, após 6 dias de negociação, dentro do teto por pedido: 1 000 $ num 25K, até 3 000 $ num 150K.',
        },
        {
          title: 'Acumular contas',
          detail: 'O Elite conta dentro de um limite comum de 5 contas financiadas com Custom, Instant e Nitro. O teto global é de 10 contas financiadas ativas, e o Nitro sozinho limita-se a 3. Comprar um lote não aumenta esses limites.',
        },
      ],
    },
    cost_timeline: {
      title: 'O que vai pagar',
      intro: 'Os custos não chegam todos ao mesmo tempo.',
      steps: [
        { label: 'Na compra', title: 'Taxa única', detail: 'De 95 $ para um 25K a 353 $ para um 150K, antes de desconto. Sem subscrição.' },
        { label: 'Em caso de falha', title: 'Reset opcional', detail: 'De 79 $ num 25K a 229 $ num 150K. Recomeçar nunca é obrigatório.' },
        { label: 'Ao passar', title: 'Sem taxa de ativação', detail: 'A conta financiada abre sem qualquer pagamento adicional.' },
        { label: 'No levantamento', title: 'Teto por pedido', detail: 'De 1 000 $ a 3 000 $ consoante o tamanho da conta, com 90 % para si.' },
      ],
    },
  },

  'hantec-trader': {
    headquarters: 'Suite 201, The Catalyst Silicon Avenue, 40 Cybercity, 72201 Ebène, Maurícia',
    regulation_details:
      'Hantec Trader Limited, sociedade mauriciana n.º C191400. Não regulada: empresa de trading proprietário. Corretora parceira: Hantec Markets Limited / Hantec Markets Mauritius.',
    drawdown_type:
      'Perda diária calculada sobre o maior entre o saldo ou o equity ao fecho do dia anterior. Drawdown global progressivo ou estático consoante o programa.',
    time_limit: 'Sem limite de tempo, exceto Instant24: 24 horas a partir da primeira operação',
    payout_frequency: 'a pedido, com decisão em 24 horas úteis',
    assets: ['Forex', 'Índices', 'Matérias-primas', 'Metais', 'Cripto'],
    payout_methods: ['Transferência bancária', 'Criptomoeda', 'Carteiras eletrónicas'],
    restricted_countries: [
      'Afeganistão', 'Alemanha', 'Austrália', 'Bélgica', 'Catar', 'Congo (Brazzaville)',
      'Congo (Kinshasa)', 'Coreia do Norte', 'Egito', 'Estados Unidos', 'Haiti', 'Irão',
      'Israel', 'Jordânia', 'Kosovo', 'Laos', 'Líbia', 'Malásia', 'Myanmar', 'Paquistão',
      'Porto Rico', 'República Checa', 'Roménia', 'Rússia', 'Sérvia', 'Somália',
      'Sudão do Sul', 'Taiwan', 'Tailândia', 'Usbequistão', 'Vietname', 'Iémen',
    ],
    included_items: [
      'MetaTrader 4 e MetaTrader 5',
      'Sete programas, do financiado imediato às três etapas',
      'Add-on de 95 % de partilha disponível em seis programas',
    ],
    pros: [
      'Sete programas que cobrem o imediato, uma, duas e três etapas',
      'Entrada a partir de 13 $ com o Instant24',
      'Partilha de 80 %, até 95 % com o add-on em seis programas',
      'Sem limite de tempo, exceto Instant24 por construção',
      'Decisão de levantamento em 24 horas úteis para pedidos elegíveis',
      'Corretora parceira identificada: Hantec Markets',
    ],
    cons: [
      'Não regulada: empresa de trading proprietário, não uma corretora',
      'Os traders norte-americanos não são aceites',
      '32 territórios excluídos, entre eles Alemanha, Bélgica e Austrália',
      'A negociação de notícias está restringida por defeito, exceto no Instant24',
      'O scalping pode acarretar um ajuste de lucros acima de um limiar',
      'Alavancagem limitada a 1:1 na cripto',
    ],
    special_features: [
      'Partilha de 80 %, até 95 % com o add-on «95% Reward Share»',
      'Sete programas, do Instant24 em 24 horas ao Endurance em três etapas',
      'Perda diária calculada sobre o maior entre saldo ou equity do dia anterior',
      'Add-on News Trading para levantar a restrição em torno das notícias',
      'Alavancagem 1:50 em forex, 1:15 em índices e matérias-primas, 1:10 em metais',
      'Os traders norte-americanos não são aceites',
    ],
    verdict_card: {
      title: 'Para quem serve, e para quem não',
      body:
        'A Hantec Trader propõe sete programas que cobrem quase todos os perfis, do financiado imediato a 13 $ ao percurso em três etapas. A partilha começa em 80 % e sobe a 95 % com um add-on pago. Em contrapartida, a firma não é regulada e fecha um número invulgar de mercados.',
      points: [
        'Uma escolha entre sete percursos, do financiamento imediato às três etapas',
        'Uma entrada muito barata: o Instant24 começa em 13 $',
        'Uma partilha elevada a 95 % se levar o add-on',
        'Uma corretora parceira identificada, apoiada no grupo Hantec Markets',
      ],
    },
    program_guide: {
      title: 'Sete programas, três famílias',
      intro: 'A escolha faz-se primeiro pelo formato: financiado de imediato, ou avaliação em uma, duas ou três etapas.',
      options: [
        {
          name: 'Instant Funding',
          badge: 'Financiado de imediato',
          summary: 'Sem avaliação, sem objetivo. O preço é a contrapartida: 43 $ num 1K, até 2 139 $ num 50K.',
          points: ['De 1K a 50K', 'Sem objetivo de lucro', '6 % de perda diária', '6 % de drawdown global progressivo'],
        },
        {
          name: 'Instant Lite',
          badge: 'Financiado, mais barato',
          summary: 'A mesma lógica a um quinto do preço, em troca de uma perda diária mais apertada e 5 dias rentáveis por ciclo de levantamento.',
          points: ['De 1K a 100K, a partir de 19 $', '3 % de perda diária', '5 % de drawdown global', '5 dias rentáveis por ciclo'],
        },
        {
          name: 'Instant24',
          badge: 'Vinte e quatro horas',
          summary:
            'O formato mais barato do catálogo: a conta vive 24 horas a partir da primeira operação. É também o único programa onde a negociação de notícias é livre.',
          points: ['De 2K a 100K, a partir de 13 $', '24 horas desde a primeira operação', '2 % de perda diária', 'Negociação de notícias permitida'],
        },
        {
          name: 'Express',
          badge: 'Uma etapa',
          summary: 'Uma só fase a 10 %, sem dias mínimos, com um drawdown global progressivo de 6 %.',
          points: ['De 2K a 200K, a partir de 39 $', 'Objetivo de 10 %', 'Sem dias mínimos', '6 % de drawdown progressivo'],
        },
        {
          name: 'Enhanced',
          badge: 'Duas etapas',
          summary: 'Objetivo de 10 % e depois 5 %, com o limite diário mais largo do catálogo e um drawdown estático.',
          points: ['De 5K a 200K, a partir de 59 $', 'Objetivo 10 % depois 5 %', '5 % de perda diária', '3 dias rentáveis por etapa'],
        },
        {
          name: 'EnhancedX',
          badge: 'Duas etapas, sem dias mínimos',
          summary: 'Objetivos mais baixos que o Enhanced, 8 % e depois 4 %, e sem dias mínimos, em troca de um limite diário mais apertado.',
          points: ['De 5K a 200K, a partir de 59 $', 'Objetivo 8 % depois 4 %', '4 % de perda diária', 'Sem dias mínimos'],
        },
        {
          name: 'Endurance',
          badge: 'Três etapas',
          summary: 'Três patamares de 6 %, o caminho mais gradual e o mais barato a capital igual: 29 $ para um 5K.',
          points: ['De 5K a 200K, a partir de 29 $', 'Objetivo de 6 % em cada etapa', '8 % de drawdown estático', '3 dias por etapa'],
        },
      ],
    },
    key_rules: {
      title: 'As regras que decidem',
      intro: 'Quatro pontos comunicados diretamente pela firma, dois dos quais corrigiam a nossa ficha anterior.',
      rules: [
        {
          title: 'A partilha é de 80 %, não de 95 %',
          detail:
            'A taxa padrão é de 80 %. Os 95 % obtêm-se com o add-on pago «95% Reward Share», disponível em Instant Funding, Instant Lite, Instant24, Endurance, EnhancedX, Enhanced e Express.',
        },
        {
          title: 'A negociação de notícias está restringida por defeito',
          detail:
            'Durante a avaliação é livre em Express, Enhanced, EnhancedX e Endurance. Numa conta Hantec Trader financiada, abrir ou fechar uma posição nos 3 minutos em torno de uma notícia de forte impacto é proibido, salvo com o add-on News Trading. Instant Funding e Instant Lite seguem a mesma restrição; o Instant24 é o único que a permite livremente.',
        },
        {
          title: 'O scalping é enquadrado por um limiar, não proibido',
          detail:
            'Se os lucros líquidos de posições mantidas menos de 3 minutos representarem 30 % ou mais do lucro líquido total no período de avaliação, a atividade é qualificada de scalping e pode acarretar um ajuste de lucros ou uma restrição de negociação.',
        },
        {
          title: 'A perda diária calcula-se sobre a véspera',
          detail:
            'Nos sete programas, o limite diário é medido sobre o maior entre o saldo ou o equity ao fecho do dia anterior. O drawdown global é progressivo nos programas instantâneos e no Express, estático no Endurance, Enhanced e EnhancedX.',
        },
      ],
      more: [
        'Alavancagem 1:50 em forex, 1:15 em índices e matérias-primas',
        'Alavancagem 1:10 em metais, 1:1 em cripto',
        'MetaTrader 4 e MetaTrader 5',
        'Decisão de levantamento em 24 horas úteis para pedidos elegíveis',
        'Levantamentos por transferência, cripto ou carteira eletrónica',
      ],
    },
    journey: {
      title: 'O que acontece depois do pagamento',
      intro: 'O percurso depende da família de programa escolhida.',
      steps: [
        {
          title: 'Financiamento imediato',
          detail:
            'No Instant Funding, Instant Lite e Instant24 não há avaliação: a conta está ativa desde a compra, com os seus próprios limites de risco.',
        },
        {
          title: 'Avaliação',
          detail:
            'No Express, uma só fase a 10 %. No Enhanced e EnhancedX, duas fases. No Endurance, três patamares de 6 %. Sem limite de tempo nestes quatro programas.',
        },
        {
          title: 'Conta Hantec Trader',
          detail:
            'Depois de financiado, a restrição de notícias aplica-se nos 3 minutos em torno das notícias de forte impacto, salvo com o add-on News Trading e salvo no Instant24.',
        },
        {
          title: 'Levantamentos',
          detail:
            'Decisão em 24 horas úteis para pedidos elegíveis; o prazo de chegada dos fundos depende do método. Partilha de 80 %, ou 95 % com o add-on.',
        },
      ],
    },
  },
}
