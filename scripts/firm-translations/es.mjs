// Español — traducción del contenido editorial inglés de las fichas.
// Ver index.mjs para el funcionamiento de la superposición.

export const es = {
  ftmo: {
    headquarters: 'Quadrio Offices, Purkyňova 2121/3, 110 00 Praga, República Checa',
    regulation_details:
      'FTMO Evaluation Global s.r.o.; la entidad contratante puede variar según la región. Ni bróker ni empresa de inversión: el servicio funciona con cuentas simuladas y no acepta depósitos de clientes.',
    max_allocation: 'Hasta 400.000 $ de asignación inicial y hasta 2.000.000 $ mediante el Scaling Plan',
    drawdown_type:
      'Pérdida diaria calculada sobre el equity y reiniciada a medianoche CE(S)T. El drawdown global es progresivo al cierre en el 1-Step y se bloquea al alcanzar el saldo inicial; es fijo en el 2-Step.',
    time_limit: 'Sin límite de tiempo, en ambos productos',
    payout_frequency: 'a petición, no antes de 14 días desde tu primera operación',
    assets: ['CFD sobre forex', 'Metales', 'Índices', 'Energías', 'Cripto', 'Materias primas', 'CFD sobre acciones'],
    payout_methods: ['Transferencia bancaria', 'Otros métodos mostrados en el Área de Cliente, según disponibilidad'],
    included_items: [
      'MetaTrader 4, MetaTrader 5, cTrader y TradingView',
      'Panel de FTMO y métricas de rendimiento',
      'Sin comisión de activación de la cuenta financiada',
    ],
    pros: [
      'En activo desde 2015, uno de los historiales más largos del sector',
      '90 % de reparto en el 1-Step, el más alto de los dos productos',
      'Sin límite de tiempo, ni en el 1-Step ni en el 2-Step',
      'El 1-Step no impone un mínimo fijo de días de trading',
      'En el 2-Step, la cuota se reembolsa al 100 % con el primer pago',
      'La cuenta Swing levanta las restricciones de noticias, noche y fin de semana',
      'Asignación hasta 400.000 $, y hasta 2.000.000 $ con el Scaling Plan',
      'Precios en euros, desde 79 €',
    ],
    cons: [
      'Sin reset: tras un fallo hay que comprar un challenge entero',
      'El reembolso de la cuota no se anuncia en el 1-Step',
      'El 1-Step aprieta el límite diario al 3 % y usa un drawdown progresivo',
      'El 2-Step exige 4 días de trading en cada fase',
      'La cuenta financiada Standard restringe noticias, noche y fin de semana',
      'Swing no existe en el 1-Step y limita el apalancamiento a 1:30',
      'Swing no ofrece cuenta de 200K',
    ],
    special_features: [
      'Dos productos con reglas realmente distintas',
      '1-Step: 3 % de pérdida diaria, drawdown progresivo bloqueado en el saldo inicial',
      '2-Step: 5 % de pérdida diaria, drawdown fijo',
      'La regla del mejor día solo se aplica al 1-Step',
      'Apalancamiento hasta 1:100 en Standard, 1:30 en Swing',
      'Scaling Plan: +25 % de saldo cada 4 meses, solo en el 2-Step',
      'Sin stop-loss obligatorio',
      'Pago con tarjeta, transferencia, PayPal, Skrill, cripto y Revolut Pay; Apple Pay y Google Pay según disponibilidad',
    ],
    verdict_card: {
      title: 'Para quién sí, y para quién no',
      body:
        'FTMO vende dos productos que conviene distinguir antes de comprar. El 1-Step paga más — 90 % — y no impone calendario, pero aprieta día a día. El 2-Step paga 80 %, deja más margen diario y devuelve la cuota con el primer pago.',
      points: [
        'El mejor reparto sin condiciones: 90 % desde el primer pago en el 1-Step',
        'Recuperar la cuota: el 2-Step la reembolsa al 100 % con el primer pago',
        'Un límite diario cómodo: 5 % en el 2-Step frente al 3 % del 1-Step',
        'La libertad de mantener posiciones de noche y el fin de semana, con Swing',
        'Una asignación que llega a 2.000.000 $ con el Scaling Plan',
      ],
    },
    program_guide: {
      title: 'Tres caminos, tres compromisos',
      intro:
        'Los tres llevan a una cuenta financiada. La elección se juega en el reparto, el calendario y la libertad para mantener posiciones.',
      options: [
        {
          name: '1-Step',
          badge: 'Una sola fase',
          summary:
            'El reparto más alto, 90 %, y sin días mínimos. A cambio, un límite diario del 3 % y un drawdown que sigue tus máximos.',
          points: [
            'Objetivo del 10 %, reparto del 90 %',
            '3 % de pérdida diaria',
            'Drawdown progresivo, bloqueado en el saldo inicial',
            'Mejor día ≤ 50 % del beneficio de los días positivos',
            'De 79 € (10K) a 999 € (200K)',
          ],
        },
        {
          name: '2-Step Standard',
          badge: 'Dos fases',
          summary:
            'Objetivo del 10 % y luego del 5 %, un límite diario más amplio del 5 % y un drawdown fijo. La cuota se reembolsa con el primer pago.',
          points: [
            'Objetivo 10 % luego 5 %, reparto del 80 %',
            '5 % de pérdida diaria, drawdown fijo',
            '4 días mínimos de trading por fase',
            'Cuota reembolsada al 100 % en el primer pago',
            'De 89 € (10K) a 1.080 € (200K)',
          ],
        },
        {
          name: '2-Step Swing',
          badge: 'Mantener posiciones',
          summary:
            'Las reglas del 2-Step, sin restricción de noticias, noche ni fin de semana, cuenta financiada incluida. El apalancamiento baja a 1:30 y no hay 200K.',
          points: [
            'Mismos objetivos y límites que el 2-Step Standard',
            'Noticias, noche y fin de semana libres, incluso ya financiado',
            'Apalancamiento limitado a 1:30',
            'De 99 € (10K) a 599 € (100K)',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Las reglas que deciden',
      intro: 'Cinco puntos que la mayoría de comparadores cuenta mal.',
      rules: [
        {
          title: 'El reparto depende del producto',
          detail:
            '90 % en el 1-Step, sin condiciones. 80 % en el 2-Step, hasta el 90 % con el Scaling Plan. Las páginas que anuncian «hasta 90 %» para toda la gama ocultan que el 1-Step ya empieza ahí.',
        },
        {
          title: 'Solo el 2-Step reembolsa la cuota',
          detail:
            'El 2-Step devuelve el 100 % del precio del challenge con el primer pago. En el 1-Step, FTMO no anuncia reembolso. Con un precio de catálogo más bajo, el 1-Step sale por tanto más caro una vez financiado.',
        },
        {
          title: 'La pérdida diaria difiere, y se mide sobre el equity',
          detail:
            '3 % en el 1-Step, 5 % en el 2-Step. Se mide sobre el equity — es decir, con pérdidas flotantes, comisiones y swaps incluidos — y se reinicia a medianoche CE(S)T, no en tu huso horario.',
        },
        {
          title: 'El drawdown del 1-Step avanza y luego se bloquea',
          detail:
            'Sube con tu saldo de cierre más alto y se detiene definitivamente al alcanzar el saldo inicial. El 2-Step usa un drawdown fijo desde la primera operación.',
        },
        {
          title: 'No existe ningún reset',
          detail:
            'Un challenge fallido no se reanuda con descuento: hay que comprar otro entero. Es una diferencia de coste real frente a las firmas que cobran el 50 % por un reset.',
        },
      ],
      more: [
        'Sin límite de tiempo en los tres caminos',
        'Sin días mínimos fijos en el 1-Step; 4 por fase en el 2-Step',
        'Sin comisión de activación de la cuenta financiada',
        'Sin stop-loss obligatorio',
        'Apalancamiento hasta 1:100 en Standard, 1:30 en Swing',
        'Scaling Plan: +25 % de saldo cada 4 meses, en el 2-Step',
        'MT4, MT5, cTrader y TradingView',
      ],
    },
    journey: {
      title: 'Qué ocurre después de pagar',
      intro: 'El camino cambia según el producto.',
      steps: [
        {
          title: 'Evaluación',
          detail:
            'Una fase en el 1-Step, dos en el 2-Step. En esta etapa no hay restricción de noticias ni de posiciones nocturnas o de fin de semana, sea cual sea el producto.',
        },
        {
          title: 'Verificación',
          detail: 'Solo en el 2-Step: un segundo objetivo del 5 %, con los mismos límites de riesgo que la primera fase.',
        },
        {
          title: 'Cuenta FTMO',
          detail:
            'Standard restringe las noticias y obliga a cerrar antes de pausas de mercado de más de 2 horas y antes del fin de semana. Swing no restringe nada. Swing no existe en el 1-Step.',
        },
        {
          title: 'Pagos',
          detail:
            'El primero no puede solicitarse antes de 14 días; después eliges tu día de pago. En el 2-Step, ese primer pago también reembolsa el precio del challenge.',
        },
      ],
    },
    cost_timeline: {
      title: 'Lo que vas a pagar',
      intro: 'Los costes no llegan todos al mismo tiempo — y una parte vuelve.',
      steps: [
        {
          label: 'Al comprar',
          title: 'Cuota única',
          detail: 'De 79 € para un 1-Step 10K a 1.080 € para un 2-Step 200K. Sin suscripción.',
        },
        {
          label: 'Si fallas',
          title: 'Sin reset disponible',
          detail: 'FTMO no vende resets con descuento: volver a empezar significa comprar un challenge entero.',
        },
        {
          label: 'Al superarlo',
          title: 'Sin comisión de activación',
          detail: 'La cuenta financiada se abre sin ningún pago adicional.',
        },
        {
          label: 'En el primer pago',
          title: 'Reembolso en el 2-Step',
          detail:
            'El 2-Step devuelve el 100 % del precio del challenge con el primer pago. El 1-Step no anuncia reembolso.',
        },
      ],
    },
  },

  the5ers: {
    headquarters: 'Enstar House, 168 Praed Street, Londres W2 1RH, Reino Unido',
    regulation_details:
      'Five Percent Online Ltd, Inglaterra y Gales n.º 12553363 e Israel n.º 515864007. Empresa de evaluación de trading propietario: ni bróker, ni depositaria, ni bolsa, ni entidad financiera regulada. Entorno de trading totalmente simulado.',
    max_allocation:
      'Hasta 500.000 $ en High Stakes y Pro Growth, hasta 4.000.000 $ en Hyper Growth y Bootcamp',
    drawdown_type:
      'Pérdida global estática en los cuatro programas: 10 % en High Stakes, 6 % en Hyper Growth y Pro Growth, 5 % en evaluación y 4 % ya financiado en Bootcamp.',
    time_limit: 'Sin límite de tiempo, pero una cuenta 30 días sin operar caduca',
    payout_frequency: 'cada 14 días, tras aprobación',
    assets: ['CFD sobre forex', 'Índices', 'Metales', 'Materias primas', 'Cripto'],
    payout_methods: ['Métodos mostrados en el Hub de The5ers, variables según la cuenta'],
    restricted_countries: [
      'Afganistán', 'Bielorrusia', 'Bosnia y Herzegovina', 'Burundi', 'Congo (Brazzaville)',
      'Congo (Kinshasa)', 'Corea del Norte', 'Crimea', 'Cuba', 'Eritrea', 'Guinea',
      'Guinea-Bisáu', 'Irak', 'Irán', 'Israel', 'Laos', 'Líbano', 'Liberia', 'Libia',
      'Myanmar', 'Papúa Nueva Guinea', 'República Centroafricana', 'Rusia', 'Somalia',
      'Sudán', 'Sudán del Sur', 'Siria', 'Territorios Palestinos', 'Vanuatu',
      'Venezuela', 'Yemen',
    ],
    included_items: [
      'MetaTrader 5 en modo Hedge, en escritorio, web y móvil',
      'Cuatro programas, de una a tres fases',
      'Crecimiento de la cuenta hasta el 100 % de reparto',
    ],
    pros: [
      'En activo desde 2016',
      'Entrada desde 22 $, una de las más bajas del mercado',
      'El reparto puede llegar al 100 %, un techo poco común',
      'El plan de crecimiento puede llevar a 4.000.000 $ en Hyper Growth y Bootcamp',
      'Cuatro programas realmente distintos, de una a tres fases',
      'Sin regla de consistencia en ninguno de los cuatro programas',
      'Posiciones nocturnas y de fin de semana permitidas en todos',
      'Dos entidades jurídicas identificadas, en Reino Unido e Israel',
    ],
    cons: [
      'El reparto empieza en el 50 % en Hyper Growth y Bootcamp',
      'Una sola plataforma: MetaTrader 5',
      '31 territorios excluidos, entre ellos Rusia, Irán e Israel',
      'Sin licencia de ningún regulador financiero',
      'Entorno totalmente simulado: los fondos no son capital real',
      'Una cuenta 30 días sin operar caduca',
      'Sin reset anunciado públicamente: hay que comprar otra evaluación',
      'Los pagos grandes pueden fraccionarse en plazos semanales de 10.000 $',
    ],
    special_features: [
      'Reparto variable según el programa: 80 % High Stakes, 75 % Pro Growth, 50 % Hyper Growth y Bootcamp',
      'Los cuatro programas suben al 100 % mediante el crecimiento de la cuenta',
      'MetaTrader 5 en modo Hedge, en escritorio, web y móvil',
      'Comisión de forex de 4 $ por lote ida y vuelta, variable según el activo',
      'Apalancamiento hasta 1:100 en High Stakes, 1:30 en los otros tres',
      'Índices y metales hasta 1:25, cripto 1:2 en High Stakes',
      'Una cuenta 30 días sin operar caduca',
      'Miembro del 5% Group, junto a Trade The Pool, Trade Delicious y TSG Brokers',
    ],
    verdict_card: {
      title: 'Para quién sí, y para quién no',
      body:
        'The5ers vende cuatro programas cuyo reparto de partida va del 50 % al 80 %. Todos suben al 100 % a medida que crece la cuenta, pero el punto de partida cambia por completo las cuentas de los primeros meses.',
      points: [
        'Empezar por casi nada: 22 $ en Bootcamp o High Stakes 2,5K',
        'El mejor reparto de entrada de la gama: 80 % en High Stakes',
        'Apuntar muy alto: Hyper Growth y Bootcamp llevan hasta 4.000.000 $',
        'Un techo de reparto del 100 %, que pocas firmas ofrecen',
        'Sin regla de consistencia, en ninguno de los cuatro programas',
      ],
    },
    program_guide: {
      title: 'Cuatro programas, cuatro compromisos',
      intro: 'La elección se juega en tres mandos: el reparto de partida, el número de fases y el precio.',
      options: [
        {
          name: 'High Stakes',
          badge: 'Dos fases',
          summary:
            'El programa más equilibrado: 80 % de reparto desde el inicio, objetivo del 10 % y luego del 5 %, y el límite diario más amplio de la gama.',
          points: [
            'Objetivo 10 % luego 5 %, reparto del 80 %',
            '5 % de pérdida diaria, 10 % de pérdida global',
            '3 días rentables mínimos por fase',
            'Apalancamiento hasta 1:100, el más alto de la gama',
            'De 22 $ (2,5K) a 545 $ (100K)',
          ],
        },
        {
          name: 'Pro Growth',
          badge: 'Una fase',
          summary:
            'Una sola fase al 10 % y 75 % de reparto de partida, a un precio contenido. La pérdida global baja al 6 %.',
          points: [
            'Objetivo del 10 % en una fase, reparto del 75 %',
            '3 % de pérdida diaria, 6 % de pérdida global',
            'Crecimiento gradual hasta 500.000 $',
            'De 52 $ (5K) a 329 $ (50K)',
          ],
        },
        {
          name: 'Hyper Growth',
          badge: 'Una fase, techo alto',
          summary:
            'La cuenta se dobla en cada escalón del 10 %, hasta 4.000.000 $. A cambio, el reparto empieza en el 50 % y el precio de entrada es el más alto de la gama.',
          points: [
            'Objetivo del 10 % en una fase, reparto de partida del 50 %',
            'La cuenta se dobla en cada objetivo alcanzado',
            '6 % de pérdida global, umbral de pausa diaria del 3 %',
            'De 260 $ (5K) a 850 $ (20K)',
          ],
        },
        {
          name: 'Bootcamp',
          badge: 'Tres fases',
          summary:
            'Tres escalones del 6 %, sin límite diario durante la evaluación, con la cuota pagada en dos veces: una entrada reducida y el resto al superarlo.',
          points: [
            'Tres objetivos del 6 %, reparto de partida del 50 %',
            'Sin límite diario durante la evaluación',
            '5 % de pérdida global, reducida al 4 % ya financiado',
            'Entrada de 22 $ (20K) a 225 $ (250K), resto tras superarlo',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Las reglas que deciden',
      intro: 'Cinco puntos que los comparadores confunden o callan.',
      rules: [
        {
          title: 'El reparto de partida va del 50 % al 80 % según el programa',
          detail:
            'High Stakes empieza en el 80 %, Pro Growth en el 75 %, Hyper Growth y Bootcamp en el 50 %. Los cuatro suben al 100 % al crecer la cuenta, pero anunciar «hasta el 100 %» sin decir de dónde se parte oculta la mitad de la información.',
        },
        {
          title: 'El umbral diario de Hyper Growth es una pausa, no un fallo',
          detail:
            'En Hyper Growth, superar el 3 % en el día suspende el trading hasta el día siguiente en lugar de cerrar la cuenta. En Pro Growth sí es una pérdida diaria real del 3 %. En Bootcamp no hay límite diario durante la evaluación; la pausa del 3 % solo llega una vez financiado.',
        },
        {
          title: 'Una cuenta inactiva 30 días caduca',
          detail:
            'No hay plazo para superar una evaluación, pero pasar 30 días sin operar cierra la cuenta. Es la única exigencia de calendario de la casa, y rara vez se menciona en otros sitios.',
        },
        {
          title: 'Las noticias se aguantan, no se operan',
          detail:
            'En High Stakes se permite mantener una posición durante una noticia de alto impacto; abrir o cerrar en los 2 minutos que la rodean, no. Los otros tres programas prohíben las estrategias que explotan noticias sin imponer esa ventana.',
        },
        {
          title: 'Los pagos grandes pueden fraccionarse',
          detail:
            'Los pagos salen cada 14 días desde la primera operación en cuenta financiada, tras aprobación. Un importe elevado puede abonarse en plazos semanales con un tope de 10.000 $. Conviene tenerlo en cuenta si apuntas a una cuenta grande.',
        },
      ],
      more: [
        'Sin regla de consistencia en ninguno de los cuatro programas',
        'Posiciones nocturnas y de fin de semana permitidas; los índices tienen swaps altos',
        'Comisión de forex de 4 $ por lote ida y vuelta, variable según el activo',
        'Apalancamiento hasta 1:100 en High Stakes, 1:30 en los otros tres',
        'Índices y metales hasta 1:25; cripto 1:2 en High Stakes',
        'Sin stop-loss obligatorio',
        'Solo MetaTrader 5 en modo Hedge',
      ],
    },
    journey: {
      title: 'Qué ocurre después de pagar',
      intro: 'El camino depende del número de fases de tu programa.',
      steps: [
        {
          title: 'Evaluación',
          detail:
            'Una fase en Hyper Growth y Pro Growth, dos en High Stakes, tres en Bootcamp. Sin plazo, pero una cuenta sin operar durante 30 días caduca.',
        },
        {
          title: 'Cuenta financiada',
          detail:
            'El reparto empieza en la tasa del programa — 80 %, 75 % o 50 % — y sube hacia el 100 % a medida que crece la cuenta.',
        },
        {
          title: 'Crecimiento',
          detail:
            'High Stakes avanza en cada escalón del 10 %, Hyper Growth dobla la cuenta en cada escalón, Pro Growth crece de forma gradual, Bootcamp en cada escalón del 5 %. El techo es de 500.000 $ en High Stakes y Pro Growth, y de 4.000.000 $ en los otros dos.',
        },
        {
          title: 'Pagos',
          detail:
            'Cada 14 días desde la primera operación en cuenta financiada, sujeto a aprobación. Un importe elevado puede fraccionarse en plazos semanales de hasta 10.000 $.',
        },
      ],
    },
    cost_timeline: {
      title: 'Lo que vas a pagar',
      intro: 'Tres de los cuatro programas se pagan una sola vez. Bootcamp no.',
      steps: [
        {
          label: 'Al comprar',
          title: 'Cuota única, salvo Bootcamp',
          detail:
            'De 22 $ para un High Stakes 2,5K a 850 $ para un Hyper Growth 20K. Bootcamp solo pide una entrada reducida: 22 $ para un 20K, 225 $ para un 250K.',
        },
        {
          label: 'Al superarlo',
          title: 'Resto de Bootcamp',
          detail:
            'Bootcamp reclama el resto de la cuota una vez superada la evaluación — 50 $ en el 20K. Los otros tres no piden nada más.',
        },
        {
          label: 'Si fallas',
          title: 'Sin reset anunciado',
          detail: 'The5ers no publica precio de reset: volver a empezar significa comprar una evaluación completa.',
        },
        {
          label: 'Al cobrar',
          title: 'Fraccionamiento posible',
          detail: 'Pagos cada 14 días tras aprobación. Los importes altos pueden abonarse en plazos semanales de 10.000 $.',
        },
      ],
    },
  },

  futureselite: {
    headquarters: 'Corso G. Matteotti 61, Latina 04100, Italia',
    regulation_details:
      'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italia, n.º 03095010595. Sin licencia de ningún regulador financiero. Cuentas demo, resultados hipotéticos.',
    drawdown_type: 'Fin del día',
    time_limit: 'Sin límite de tiempo',
    payout_frequency: 'a petición, a diario una vez financiado',
    assets: ['Futuros'],
    included_items: [
      'Diario de trading y panel de analítica',
      'Sin comisión de activación de la cuenta financiada',
      'Siete plataformas a elegir',
    ],
    pros: [
      '90 % de reparto en el programa Elite',
      'Drawdown al cierre del día, sin ningún límite de pérdida diaria',
      'Sin regla de consistencia una vez financiado',
      'Sin comisión de activación de la cuenta financiada',
      'Cobros disponibles cada día una vez financiado',
      'Descuentos por lote: la quinta cuenta es gratis',
    ],
    cons: [
      'Sin licencia de ningún regulador financiero',
      'Cuentas demo, resultados hipotéticos',
      '3 días mínimos de trading en evaluación, 6 una vez financiado',
      'Tope de cobro por solicitud, de 1.000 $ a 3.000 $ según el tamaño',
      'Las tarifas de Nitro, Prime e Instant no son públicas',
    ],
    special_features: [
      '90 % de reparto en el programa Elite',
      'Drawdown al cierre del día, sin límite de pérdida diaria',
      'Sin regla de consistencia una vez financiado',
      'Sin comisión de activación de la cuenta financiada',
      'Descuentos por lote: la quinta cuenta es gratis',
      'Cuentas Instant disponibles, sin evaluación',
    ],
    verdict_card: {
      title: 'Para quién sí, y para quién no',
      body:
        'FuturesElite apuesta por condiciones generosas una vez financiado: 90 % de reparto, sin regla de consistencia, cobro diario. A cambio, la firma es joven, no está regulada y solo publica una de sus cuatro tarifas.',
      points: [
        'Un reparto alto y cobros frecuentes, sin esperar a un vencimiento',
        'Una evaluación sin límite de pérdida diaria, que deja respirar',
        'Una cuenta financiada que se abre sin comisión de activación',
        'La posibilidad de acumular hasta diez cuentas en paralelo',
      ],
    },
    program_guide: {
      title: 'El programa Elite',
      intro:
        'Elite es el único programa con tarifa pública. Nitro, Prime e Instant existen en el checkout, pero sus precios no se muestran.',
      options: [
        {
          name: 'Elite',
          badge: 'Tarifa pública',
          summary:
            'Una evaluación de una etapa, un drawdown al cierre del día, sin límite de pérdida diaria y 90 % de reparto una vez financiado.',
          points: ['Objetivo del 5 %', 'Sin límite de pérdida diaria', '3 días mínimos de trading', 'Sin comisión de activación'],
        },
      ],
    },
    key_rules: {
      title: 'Las reglas que deciden',
      intro: 'Lo que de verdad distingue a FuturesElite de otras firmas de futuros.',
      rules: [
        {
          title: 'Sin límite de pérdida diaria',
          detail:
            'Ni durante la evaluación ni una vez financiado. El riesgo lo acota únicamente la Maximum Loss Limit, recalculada al cierre de cada día. Es el argumento principal de la firma, no un dato que falte.',
        },
        {
          title: 'Drawdown al cierre del día',
          detail:
            'El límite se actualiza una vez al día sobre el saldo de cierre, no de forma continua. Una posición en pérdida flotante no dispara el límite hasta que cierra el día.',
        },
        {
          title: 'Sin regla de consistencia una vez financiado',
          detail:
            'La regla se aplica durante la evaluación y desaparece en la cuenta financiada. La página de venta muestra dos cifras juntas, 40 % y 50 %, sin decir cuál rige: pendiente de confirmar con el socio.',
        },
        {
          title: 'Sin comisión de activación',
          detail:
            'Superar la evaluación basta para abrir la cuenta financiada. Las cuotas de reset sí existen: de 79 $ a 229 $ según el tamaño.',
        },
      ],
      more: [
        'Cobros disponibles cada día una vez financiado',
        '6 días mínimos de trading antes de un cobro',
        'Sin colchón de beneficio exigido',
        'Siete plataformas a elegir, entre ellas Tradovate y NinjaTrader',
        'La quinta cuenta de un lote es gratis',
      ],
    },
    journey: {
      title: 'Qué ocurre después de pagar',
      intro: 'Una sola etapa de evaluación y la cuenta financiada se abre de inmediato.',
      steps: [
        {
          title: 'Evaluación',
          detail:
            'Alcanzar el objetivo de beneficio sin romper la Maximum Loss Limit, en al menos 3 días de trading. Sin límite de tiempo.',
        },
        {
          title: 'Cuenta financiada',
          detail: 'Se abre al superarla, sin comisión de activación. La regla de consistencia desaparece en esta etapa.',
        },
        {
          title: 'Cobros',
          detail:
            'Disponibles cada día, tras 6 días de trading, dentro del tope por solicitud: 1.000 $ en un 25K, hasta 3.000 $ en un 150K.',
        },
        {
          title: 'Acumular cuentas',
          detail:
            'Elite cuenta dentro de un límite común de 5 cuentas financiadas junto a Custom, Instant y Nitro. El techo global es de 10 cuentas financiadas activas, y Nitro por sí solo se limita a 3. Comprar un lote no eleva esos límites.',
        },
      ],
    },
    cost_timeline: {
      title: 'Lo que vas a pagar',
      intro: 'Los costes no llegan todos al mismo tiempo.',
      steps: [
        { label: 'Al comprar', title: 'Cuota única', detail: 'De 95 $ para un 25K a 353 $ para un 150K, antes de descuento. Sin suscripción.' },
        { label: 'Si fallas', title: 'Reset opcional', detail: 'De 79 $ en un 25K a 229 $ en un 150K. Volver a empezar nunca es obligatorio.' },
        { label: 'Al superarlo', title: 'Sin comisión de activación', detail: 'La cuenta financiada se abre sin ningún pago adicional.' },
        { label: 'Al cobrar', title: 'Tope por solicitud', detail: 'De 1.000 $ a 3.000 $ según el tamaño de la cuenta, con el 90 % para ti.' },
      ],
    },
  },

  'hantec-trader': {
    headquarters: 'Suite 201, The Catalyst Silicon Avenue, 40 Cybercity, 72201 Ebène, Mauricio',
    regulation_details:
      'Hantec Trader Limited, sociedad mauriciana n.º C191400. No regulada: empresa de trading propietario. Bróker socio: Hantec Markets Limited / Hantec Markets Mauritius.',
    drawdown_type:
      'Pérdida diaria calculada sobre el mayor entre el saldo o el equity al cierre del día anterior. Drawdown global progresivo o estático según el programa.',
    time_limit: 'Sin límite de tiempo, salvo Instant24: 24 horas desde la primera operación',
    payout_frequency: 'a petición, con decisión en 24 horas hábiles',
    assets: ['Forex', 'Índices', 'Materias primas', 'Metales', 'Cripto'],
    payout_methods: ['Transferencia bancaria', 'Criptomoneda', 'Monederos electrónicos'],
    restricted_countries: [
      'Afganistán', 'Alemania', 'Australia', 'Bélgica', 'Catar', 'Congo (Brazzaville)',
      'Congo (Kinshasa)', 'Corea del Norte', 'Egipto', 'Estados Unidos', 'Haití', 'Irán',
      'Israel', 'Jordania', 'Kosovo', 'Laos', 'Libia', 'Malasia', 'Myanmar', 'Pakistán',
      'Puerto Rico', 'República Checa', 'Rumanía', 'Rusia', 'Serbia', 'Somalia',
      'Sudán del Sur', 'Taiwán', 'Tailandia', 'Uzbekistán', 'Vietnam', 'Yemen',
    ],
    included_items: [
      'MetaTrader 4 y MetaTrader 5',
      'Siete programas, del financiado inmediato a las tres etapas',
      'Add-on del 95 % de reparto disponible en seis programas',
    ],
    pros: [
      'Siete programas que cubren inmediato, una, dos y tres etapas',
      'Entrada desde 13 $ con Instant24',
      'Reparto del 80 %, hasta el 95 % con el add-on en seis programas',
      'Sin límite de tiempo, salvo Instant24 por diseño',
      'Decisión de cobro en 24 horas hábiles para solicitudes admisibles',
      'Bróker socio identificado: Hantec Markets',
    ],
    cons: [
      'No regulada: empresa de trading propietario, no un bróker',
      'No se acepta a traders estadounidenses',
      '32 territorios excluidos, entre ellos Alemania, Bélgica y Australia',
      'El trading de noticias está restringido por defecto, salvo en Instant24',
      'El scalping puede acarrear un ajuste de beneficios por encima de un umbral',
      'Apalancamiento limitado a 1:1 en cripto',
    ],
    special_features: [
      'Reparto del 80 %, hasta el 95 % con el add-on «95% Reward Share»',
      'Siete programas, de Instant24 en 24 horas a Endurance en tres etapas',
      'Pérdida diaria calculada sobre el mayor entre saldo o equity del día anterior',
      'Add-on News Trading para levantar la restricción alrededor de las noticias',
      'Apalancamiento 1:50 en forex, 1:15 en índices y materias primas, 1:10 en metales',
      'No se acepta a traders estadounidenses',
    ],
    verdict_card: {
      title: 'Para quién sí, y para quién no',
      body:
        'Hantec Trader ofrece siete programas que cubren casi todos los perfiles, del financiado inmediato desde 13 $ al recorrido en tres etapas. El reparto arranca en el 80 % y sube al 95 % con un add-on de pago. A cambio, la firma no está regulada y cierra un número inusual de mercados.',
      points: [
        'Una elección entre siete recorridos, del financiado inmediato a las tres etapas',
        'Una entrada muy barata: Instant24 arranca en 13 $',
        'Un reparto elevado al 95 % si tomas el add-on',
        'Un bróker socio identificado, respaldado por el grupo Hantec Markets',
      ],
    },
    program_guide: {
      title: 'Siete programas, tres familias',
      intro:
        'La elección empieza por el formato: financiado de inmediato, o evaluación en una, dos o tres etapas.',
      options: [
        {
          name: 'Instant Funding',
          badge: 'Financiado de inmediato',
          summary: 'Sin evaluación, sin objetivo. El precio es la contrapartida: 43 $ en un 1K, hasta 2.139 $ en un 50K.',
          points: ['De 1K a 50K', 'Sin objetivo de beneficio', '6 % de pérdida diaria', '6 % de drawdown global progresivo'],
        },
        {
          name: 'Instant Lite',
          badge: 'Financiado, más barato',
          summary: 'La misma idea a un quinto del precio, a cambio de una pérdida diaria más ajustada y 5 días rentables por ciclo de cobro.',
          points: ['De 1K a 100K, desde 19 $', '3 % de pérdida diaria', '5 % de drawdown global', '5 días rentables por ciclo de cobro'],
        },
        {
          name: 'Instant24',
          badge: 'Veinticuatro horas',
          summary:
            'El formato más barato del catálogo: la cuenta vive 24 horas desde la primera operación. Es también el único programa donde el trading de noticias es libre.',
          points: ['De 2K a 100K, desde 13 $', '24 horas desde la primera operación', '2 % de pérdida diaria', 'Trading de noticias permitido'],
        },
        {
          name: 'Express',
          badge: 'Una etapa',
          summary: 'Una sola fase al 10 %, sin días mínimos, con un drawdown global progresivo del 6 %.',
          points: ['De 2K a 200K, desde 39 $', 'Objetivo del 10 %', 'Sin días mínimos', '6 % de drawdown progresivo'],
        },
        {
          name: 'Enhanced',
          badge: 'Dos etapas',
          summary: 'Objetivo del 10 % y luego del 5 %, con el límite diario más amplio del catálogo y un drawdown estático.',
          points: ['De 5K a 200K, desde 59 $', 'Objetivo 10 % luego 5 %', '5 % de pérdida diaria', '3 días rentables por etapa'],
        },
        {
          name: 'EnhancedX',
          badge: 'Dos etapas, sin días mínimos',
          summary: 'Objetivos más bajos que Enhanced, 8 % y luego 4 %, y sin días mínimos, a cambio de un límite diario más ajustado.',
          points: ['De 5K a 200K, desde 59 $', 'Objetivo 8 % luego 4 %', '4 % de pérdida diaria', 'Sin días mínimos'],
        },
        {
          name: 'Endurance',
          badge: 'Tres etapas',
          summary: 'Tres escalones del 6 %, el camino más gradual y el más barato a igual capital: 29 $ para un 5K.',
          points: ['De 5K a 200K, desde 29 $', 'Objetivo del 6 % en cada etapa', '8 % de drawdown estático', '3 días por etapa'],
        },
      ],
    },
    key_rules: {
      title: 'Las reglas que deciden',
      intro: 'Cuatro puntos comunicados directamente por la firma, dos de los cuales corregían nuestra ficha anterior.',
      rules: [
        {
          title: 'El reparto es del 80 %, no del 95 %',
          detail:
            'La tasa estándar es del 80 %. El 95 % se obtiene con el add-on de pago «95% Reward Share», disponible en Instant Funding, Instant Lite, Instant24, Endurance, EnhancedX, Enhanced y Express.',
        },
        {
          title: 'El trading de noticias está restringido por defecto',
          detail:
            'Durante la evaluación es libre en Express, Enhanced, EnhancedX y Endurance. En una cuenta Hantec Trader financiada, abrir o cerrar una posición en los 3 minutos que rodean una noticia de alto impacto está prohibido, salvo con el add-on News Trading. Instant Funding e Instant Lite siguen la misma restricción; Instant24 es el único que lo permite libremente.',
        },
        {
          title: 'El scalping está acotado por un umbral, no prohibido',
          detail:
            'Si los beneficios netos de posiciones mantenidas menos de 3 minutos representan el 30 % o más del beneficio neto total del periodo de evaluación, la actividad se califica de scalping y puede acarrear un ajuste de beneficios o una restricción de trading.',
        },
        {
          title: 'La pérdida diaria se calcula sobre el día anterior',
          detail:
            'En los siete programas, el límite diario se mide sobre el mayor entre el saldo o el equity al cierre del día anterior. El drawdown global es progresivo en los programas instantáneos y en Express, y estático en Endurance, Enhanced y EnhancedX.',
        },
      ],
      more: [
        'Apalancamiento 1:50 en forex, 1:15 en índices y materias primas',
        'Apalancamiento 1:10 en metales, 1:1 en cripto',
        'MetaTrader 4 y MetaTrader 5',
        'Decisión de cobro en 24 horas hábiles para solicitudes admisibles',
        'Cobros por transferencia, cripto o monedero electrónico',
      ],
    },
    journey: {
      title: 'Qué ocurre después de pagar',
      intro: 'El camino depende de la familia de programa elegida.',
      steps: [
        {
          title: 'Financiación inmediata',
          detail:
            'En Instant Funding, Instant Lite e Instant24 no hay evaluación: la cuenta está activa desde la compra, con sus propios límites de riesgo.',
        },
        {
          title: 'Evaluación',
          detail:
            'En Express, una sola fase al 10 %. En Enhanced y EnhancedX, dos fases. En Endurance, tres escalones del 6 %. Sin límite de tiempo en estos cuatro programas.',
        },
        {
          title: 'Cuenta Hantec Trader',
          detail:
            'Una vez financiado, la restricción de noticias se aplica en los 3 minutos que rodean las noticias de alto impacto, salvo con el add-on News Trading y salvo en Instant24.',
        },
        {
          title: 'Cobros',
          detail:
            'Decisión en 24 horas hábiles para solicitudes admisibles; el plazo de llegada de los fondos depende del método. Reparto del 80 %, o del 95 % con el add-on.',
        },
      ],
    },
  },
}
