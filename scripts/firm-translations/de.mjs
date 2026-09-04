// Deutsch — traduction du contenu editorial anglais des fiches firmes.
// Voir index.mjs pour le fonctionnement de la superposition.

export const de = {
  ftmo: {
    headquarters: 'Quadrio Offices, Purkyňova 2121/3, 110 00 Prag, Tschechien',
    regulation_details:
      'FTMO Evaluation Global s.r.o.; die vertragsschließende Gesellschaft kann je nach Region abweichen. Weder Broker noch Wertpapierfirma: Der Dienst läuft auf simulierten Konten und nimmt keine Kundeneinlagen entgegen.',
    max_allocation: 'Bis zu 400.000 $ Anfangsallokation und bis zu 2.000.000 $ über den Scaling Plan',
    drawdown_type:
      'Tagesverlust auf Equity-Basis, Rücksetzung um Mitternacht CE(S)T. Der Gesamt-Drawdown läuft beim 1-Step am Tagesende nach und friert ein, sobald er den Startsaldo erreicht; beim 2-Step ist er fix.',
    time_limit: 'Keine Zeitbegrenzung, bei beiden Produkten',
    payout_frequency: 'auf Anfrage, frühestens 14 Tage nach dem ersten Trade',
    assets: ['Forex-CFDs', 'Metalle', 'Indizes', 'Energien', 'Krypto', 'Rohstoffe', 'Aktien-CFDs'],
    payout_methods: ['Banküberweisung', 'Weitere im Client Area angezeigte Wege, je nach Verfügbarkeit'],
    included_items: [
      'MetaTrader 4, MetaTrader 5, cTrader und TradingView',
      'FTMO-Dashboard und Performance-Kennzahlen',
      'Keine Aktivierungsgebühr für das finanzierte Konto',
    ],
    pros: [
      'Seit 2015 am Markt, einer der längsten Track Records der Branche',
      '90 % Gewinnbeteiligung beim 1-Step, die höhere der beiden',
      'Keine Zeitbegrenzung, weder beim 1-Step noch beim 2-Step',
      'Der 1-Step schreibt keine feste Mindestanzahl an Handelstagen vor',
      'Beim 2-Step wird die Gebühr mit der ersten Auszahlung vollständig erstattet',
      'Das Swing-Konto hebt Nachrichten-, Nacht- und Wochenendbeschränkungen auf',
      'Allokation bis 400.000 $, über den Scaling Plan bis 2.000.000 $',
      'Preise in Euro, ab 79 €',
    ],
    cons: [
      'Kein Reset: Nach einem Fehlversuch kauft man eine komplett neue Challenge',
      'Die Gebührenerstattung wird beim 1-Step nicht zugesichert',
      'Der 1-Step senkt das Tageslimit auf 3 % und nutzt einen nachlaufenden Drawdown',
      'Der 2-Step verlangt 4 Handelstage in jeder Phase',
      'Das finanzierte Standard-Konto beschränkt Nachrichten, Nacht- und Wochenendpositionen',
      'Swing gibt es beim 1-Step nicht und begrenzt den Hebel auf 1:30',
      'Swing bietet kein 200K-Konto',
    ],
    special_features: [
      'Zwei Produkte mit wirklich unterschiedlichen Regeln',
      '1-Step: 3 % Tagesverlust, nachlaufender Drawdown mit Fixierung am Startsaldo',
      '2-Step: 5 % Tagesverlust, fixer Drawdown',
      'Die Best-Day-Regel gilt nur beim 1-Step',
      'Hebel bis 1:100 bei Standard, 1:30 bei Swing',
      'Scaling Plan: +25 % Saldo alle 4 Monate, nur beim 2-Step',
      'Kein Pflicht-Stop-Loss',
      'Zahlung per Karte, Überweisung, PayPal, Skrill, Krypto und Revolut Pay; Apple Pay und Google Pay je nach Verfügbarkeit',
    ],
    verdict_card: {
      title: 'Für wen es passt — und für wen nicht',
      body:
        'FTMO verkauft zwei Produkte, die man vor dem Kauf auseinanderhalten sollte. Der 1-Step zahlt mehr — 90 % — und schreibt keinen Kalender vor, zieht die Zügel im Tagesgeschäft aber an. Der 2-Step zahlt 80 %, lässt täglich mehr Spielraum und erstattet die Gebühr mit der ersten Auszahlung.',
      points: [
        'Die beste Beteiligung ohne Bedingungen: 90 % ab der ersten Auszahlung beim 1-Step',
        'Die Gebühr zurückbekommen: Der 2-Step erstattet sie vollständig mit der ersten Auszahlung',
        'Ein komfortables Tageslimit: 5 % beim 2-Step gegenüber 3 % beim 1-Step',
        'Die Freiheit, Positionen über Nacht und über das Wochenende zu halten — mit Swing',
        'Eine Allokation, die über den Scaling Plan 2.000.000 $ erreicht',
      ],
    },
    program_guide: {
      title: 'Drei Wege, drei Kompromisse',
      intro:
        'Alle drei führen zu einem finanzierten Konto. Entscheidend sind die Beteiligung, der Kalender und wie frei Sie Positionen halten dürfen.',
      options: [
        {
          name: '1-Step',
          badge: 'Eine Phase',
          summary:
            'Die höchste Beteiligung, 90 %, und keine Mindesttage. Dafür ein Tageslimit von 3 % und ein Drawdown, der Ihren Hochs folgt.',
          points: [
            '10 % Ziel, 90 % Beteiligung',
            '3 % Tagesverlust',
            'Nachlaufender Drawdown, fixiert am Startsaldo',
            'Bester Tag ≤ 50 % des Gewinns der Gewinntage',
            'Von 79 € (10K) bis 999 € (200K)',
          ],
        },
        {
          name: '2-Step Standard',
          badge: 'Zwei Phasen',
          summary:
            '10 % und dann 5 % Ziel, ein breiteres Tageslimit von 5 % und ein fixer Drawdown. Die Gebühr wird mit der ersten Auszahlung erstattet.',
          points: [
            '10 % dann 5 % Ziel, 80 % Beteiligung',
            '5 % Tagesverlust, fixer Drawdown',
            '4 Mindesthandelstage je Phase',
            'Gebühr zu 100 % bei der ersten Auszahlung erstattet',
            'Von 89 € (10K) bis 1.080 € (200K)',
          ],
        },
        {
          name: '2-Step Swing',
          badge: 'Positionen halten',
          summary:
            'Die Regeln des 2-Step, ohne jede Nachrichten-, Nacht- oder Wochenendbeschränkung, auch auf dem finanzierten Konto. Der Hebel sinkt auf 1:30 und ein 200K gibt es nicht.',
          points: [
            'Gleiche Ziele und Limits wie beim 2-Step Standard',
            'Nachrichten, Nacht und Wochenende frei, auch finanziert',
            'Hebel auf 1:30 begrenzt',
            'Von 99 € (10K) bis 599 € (100K)',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Die Regeln, die entscheiden',
      intro: 'Fünf Punkte, die die meisten Vergleichsseiten falsch wiedergeben.',
      rules: [
        {
          title: 'Die Beteiligung hängt vom Produkt ab',
          detail:
            '90 % beim 1-Step, ohne Bedingung. 80 % beim 2-Step, über den Scaling Plan auf 90 %. Seiten, die pauschal „bis zu 90 %" nennen, verschweigen, dass der 1-Step dort startet.',
        },
        {
          title: 'Nur der 2-Step erstattet die Gebühr',
          detail:
            'Der 2-Step gibt 100 % des Challenge-Preises mit der ersten Auszahlung zurück. Beim 1-Step stellt FTMO keine Erstattung in Aussicht. Trotz niedrigerem Listenpreis kommt der 1-Step damit teurer, sobald Sie finanziert sind.',
        },
        {
          title: 'Der Tagesverlust unterscheidet sich — und zählt auf Equity',
          detail:
            '3 % beim 1-Step, 5 % beim 2-Step. Gemessen wird auf die Equity — also inklusive schwebender Verluste, Kommissionen und Swaps — mit Rücksetzung um Mitternacht CE(S)T, nicht in Ihrer Zeitzone.',
        },
        {
          title: 'Der 1-Step-Drawdown läuft nach und friert dann ein',
          detail:
            'Er steigt mit Ihrem höchsten Schlusssaldo und bleibt endgültig stehen, sobald er den Startsaldo erreicht. Der 2-Step arbeitet vom ersten Trade an mit fixem Drawdown.',
        },
        {
          title: 'Es gibt keinen Reset',
          detail:
            'Eine gescheiterte Challenge lässt sich nicht vergünstigt neu starten: Sie kaufen eine ganz neue. Das ist ein echter Kostenunterschied gegenüber Anbietern, die 50 % für einen Reset verlangen.',
        },
      ],
      more: [
        'Keine Zeitbegrenzung auf allen drei Wegen',
        'Keine festen Mindesttage beim 1-Step; 4 je Phase beim 2-Step',
        'Keine Aktivierungsgebühr für das finanzierte Konto',
        'Kein Pflicht-Stop-Loss',
        'Hebel bis 1:100 bei Standard, 1:30 bei Swing',
        'Scaling Plan: +25 % Saldo alle 4 Monate, beim 2-Step',
        'MT4, MT5, cTrader und TradingView',
      ],
    },
    journey: {
      title: 'Was nach der Zahlung passiert',
      intro: 'Der Weg unterscheidet sich je nach Produkt.',
      steps: [
        {
          title: 'Evaluierung',
          detail:
            'Eine Phase beim 1-Step, zwei beim 2-Step. In dieser Phase gibt es keine Beschränkung für Nachrichten, Nacht- oder Wochenendpositionen, unabhängig vom Produkt.',
        },
        {
          title: 'Verifizierung',
          detail:
            'Nur beim 2-Step: ein zweites Ziel von 5 %, unter denselben Risikolimits wie in der ersten Phase.',
        },
        {
          title: 'FTMO-Konto',
          detail:
            'Standard beschränkt Nachrichten und verlangt das Schließen vor Marktpausen von über 2 Stunden und vor dem Wochenende. Swing beschränkt nichts. Swing gibt es beim 1-Step nicht.',
        },
        {
          title: 'Auszahlungen',
          detail:
            'Die erste kann nicht vor 14 Tagen beantragt werden; danach wählen Sie Ihren Auszahlungstag. Beim 2-Step erstattet diese erste Auszahlung zugleich den Challenge-Preis.',
        },
      ],
    },
    cost_timeline: {
      title: 'Was Sie zahlen werden',
      intro: 'Die Kosten fallen nicht alle zum selben Zeitpunkt an — und ein Teil kommt zurück.',
      steps: [
        {
          label: 'Beim Kauf',
          title: 'Einmalige Gebühr',
          detail: 'Von 79 € für ein 1-Step 10K bis 1.080 € für ein 2-Step 200K. Kein Abonnement.',
        },
        {
          label: 'Bei Nichtbestehen',
          title: 'Kein Reset verfügbar',
          detail: 'FTMO verkauft keine vergünstigten Resets: Neu anfangen heißt eine ganz neue Challenge kaufen.',
        },
        {
          label: 'Beim Bestehen',
          title: 'Keine Aktivierungsgebühr',
          detail: 'Das finanzierte Konto wird ohne weitere Zahlung eröffnet.',
        },
        {
          label: 'Bei der ersten Auszahlung',
          title: 'Erstattung beim 2-Step',
          detail:
            'Der 2-Step gibt 100 % des Challenge-Preises mit der ersten Auszahlung zurück. Der 1-Step stellt keine Erstattung in Aussicht.',
        },
      ],
    },
  },

  the5ers: {
    headquarters: 'Enstar House, 168 Praed Street, London W2 1RH, Vereinigtes Königreich',
    regulation_details:
      'Five Percent Online Ltd, England & Wales Nr. 12553363 und Israel Nr. 515864007. Ein Evaluierungsunternehmen für Eigenhandel: kein Broker, keine Verwahrstelle, keine Börse, kein reguliertes Finanzinstitut. Vollständig simulierte Handelsumgebung.',
    max_allocation:
      'Bis zu 500.000 $ bei High Stakes und Pro Growth, bis zu 4.000.000 $ bei Hyper Growth und Bootcamp',
    drawdown_type:
      'Statischer Gesamtverlust bei allen vier Programmen: 10 % bei High Stakes, 6 % bei Hyper Growth und Pro Growth, 5 % in der Evaluierung und 4 % nach der Finanzierung bei Bootcamp.',
    time_limit: 'Keine Zeitbegrenzung, aber ein Konto ohne Trade verfällt nach 30 Tagen',
    payout_frequency: 'alle 14 Tage, nach Freigabe',
    assets: ['Forex-CFDs', 'Indizes', 'Metalle', 'Rohstoffe', 'Krypto'],
    payout_methods: ['Im The5ers Hub angezeigte Wege, je nach Konto unterschiedlich'],
    restricted_countries: [
      'Afghanistan', 'Belarus', 'Bosnien und Herzegowina', 'Burundi',
      'Eritrea', 'Guinea', 'Guinea-Bissau', 'Irak', 'Iran', 'Israel',
      'Kongo (Brazzaville)', 'Kongo (Kinshasa)', 'Krim', 'Kuba', 'Laos',
      'Libanon', 'Liberia', 'Libyen', 'Myanmar', 'Nordkorea',
      'Palästinensische Gebiete', 'Papua-Neuguinea', 'Russland', 'Somalia',
      'Südsudan', 'Sudan', 'Syrien', 'Vanuatu', 'Venezuela',
      'Jemen', 'Zentralafrikanische Republik',
    ],
    included_items: [
      'MetaTrader 5 im Hedge-Modus, auf Desktop, Web und Mobil',
      'Vier Programme, von einer bis drei Phasen',
      'Kontowachstum bis zu 100 % Beteiligung',
    ],
    pros: [
      'Seit 2016 am Markt',
      'Einstieg ab 22 $, einer der günstigsten am Markt',
      'Die Beteiligung kann 100 % erreichen — eine seltene Obergrenze',
      'Der Wachstumsplan kann bei Hyper Growth und Bootcamp bis 4.000.000 $ führen',
      'Vier wirklich unterschiedliche Programme, von einer bis drei Phasen',
      'Keine Konsistenzregel in irgendeinem der vier Programme',
      'Nacht- und Wochenendpositionen überall erlaubt',
      'Zwei identifizierte Rechtsträger, in Großbritannien und Israel',
    ],
    cons: [
      'Die Beteiligung startet bei Hyper Growth und Bootcamp mit 50 %',
      'Nur eine Plattform: MetaTrader 5',
      '31 ausgeschlossene Gebiete, darunter Russland, Iran und Israel',
      'Keine Lizenz einer Finanzaufsicht',
      'Vollständig simulierte Umgebung: Die Mittel sind kein echtes Kapital',
      'Ein Konto ohne Trade verfällt nach 30 Tagen',
      'Kein öffentlich beworbener Reset: Sie kaufen eine neue Evaluierung',
      'Große Auszahlungen können in Wochenraten von 10.000 $ gesplittet werden',
    ],
    special_features: [
      'Beteiligung je nach Programm: 80 % High Stakes, 75 % Pro Growth, 50 % Hyper Growth und Bootcamp',
      'Alle vier Programme steigen über das Kontowachstum auf 100 %',
      'MetaTrader 5 im Hedge-Modus, auf Desktop, Web und Mobil',
      'Forex-Kommission von 4 $ pro Round-Turn-Lot, je nach Asset unterschiedlich',
      'Hebel bis 1:100 bei High Stakes, 1:30 bei den drei anderen',
      'Indizes und Metalle bis 1:25, Krypto 1:2 bei High Stakes',
      'Ein Konto ohne Trade verfällt nach 30 Tagen',
      'Teil der 5% Group, neben Trade The Pool, Trade Delicious und TSG Brokers',
    ],
    verdict_card: {
      title: 'Für wen es passt — und für wen nicht',
      body:
        'The5ers verkauft vier Programme, deren Startbeteiligung von 50 % bis 80 % reicht. Alle steigen mit dem Kontowachstum auf 100 %, doch der Startpunkt verändert die Rechnung der ersten Monate vollständig.',
      points: [
        'Für fast nichts anfangen: 22 $ bei Bootcamp oder High Stakes 2,5K',
        'Die beste Einstiegsbeteiligung der Reihe: 80 % bei High Stakes',
        'Sehr groß zielen: Hyper Growth und Bootcamp führen bis 4.000.000 $',
        'Eine Obergrenze von 100 %, die nur wenige Anbieter bieten',
        'Keine Konsistenzregel, in keinem der vier Programme',
      ],
    },
    program_guide: {
      title: 'Vier Programme, vier Kompromisse',
      intro: 'Der Unterschied liegt in drei Stellschrauben: Startbeteiligung, Phasenzahl und Preis.',
      options: [
        {
          name: 'High Stakes',
          badge: 'Zwei Phasen',
          summary:
            'Das ausgewogenste Programm: 80 % Beteiligung von Anfang an, 10 % dann 5 % Ziel und das breiteste Tageslimit der Reihe.',
          points: [
            '10 % dann 5 % Ziel, 80 % Beteiligung',
            '5 % Tagesverlust, 10 % Gesamtverlust',
            '3 Mindest-Gewinntage je Phase',
            'Hebel bis 1:100, der höchste der Reihe',
            'Von 22 $ (2,5K) bis 545 $ (100K)',
          ],
        },
        {
          name: 'Pro Growth',
          badge: 'Eine Phase',
          summary:
            'Eine einzige 10-%-Phase und 75 % Startbeteiligung, zu einem moderaten Preis. Der Gesamtverlust sinkt auf 6 %.',
          points: [
            '10 % Ziel in einer Phase, 75 % Beteiligung',
            '3 % Tagesverlust, 6 % Gesamtverlust',
            'Schrittweises Wachstum bis 500.000 $',
            'Von 52 $ (5K) bis 329 $ (50K)',
          ],
        },
        {
          name: 'Hyper Growth',
          badge: 'Eine Phase, hohe Obergrenze',
          summary:
            'Das Konto verdoppelt sich bei jedem 10-%-Schritt, bis 4.000.000 $. Dafür startet die Beteiligung bei 50 % und der Einstiegspreis ist der höchste der Reihe.',
          points: [
            '10 % Ziel in einer Phase, 50 % Startbeteiligung',
            'Das Konto verdoppelt sich bei jedem erreichten Ziel',
            '6 % Gesamtverlust, 3 % Tages-Pausenschwelle',
            'Von 260 $ (5K) bis 850 $ (20K)',
          ],
        },
        {
          name: 'Bootcamp',
          badge: 'Drei Phasen',
          summary:
            'Drei 6-%-Schritte, ohne Tageslimit während der Evaluierung, mit Gebühren in zwei Teilen: niedriger Einstieg, Rest bei Erfolg.',
          points: [
            'Drei 6-%-Ziele, 50 % Startbeteiligung',
            'Kein Tageslimit während der Evaluierung',
            '5 % Gesamtverlust, nach Finanzierung auf 4 % verschärft',
            'Einstieg von 22 $ (20K) bis 225 $ (250K), Rest nach Erfolg fällig',
          ],
        },
      ],
    },
    key_rules: {
      title: 'Die Regeln, die entscheiden',
      intro: 'Fünf Punkte, die Vergleichsseiten falsch darstellen oder verschweigen.',
      rules: [
        {
          title: 'Die Startbeteiligung reicht je nach Programm von 50 % bis 80 %',
          detail:
            'High Stakes startet bei 80 %, Pro Growth bei 75 %, Hyper Growth und Bootcamp bei 50 %. Alle vier steigen mit dem Kontowachstum auf 100 %, doch „bis zu 100 %" zu bewerben, ohne den Startpunkt zu nennen, verschweigt die Hälfte der Information.',
        },
        {
          title: 'Die Tagesschwelle bei Hyper Growth ist eine Pause, kein Aus',
          detail:
            'Bei Hyper Growth setzt das Überschreiten von 3 % an einem Tag den Handel bis zum Folgetag aus, statt das Konto zu schließen. Bei Pro Growth ist es ein echter Tagesverlust von 3 %. Bei Bootcamp gibt es während der Evaluierung kein Tageslimit; die 3-%-Pause kommt erst nach der Finanzierung.',
        },
        {
          title: 'Ein 30 Tage inaktives Konto verfällt',
          detail:
            'Für das Bestehen einer Evaluierung gibt es keine Frist, aber 30 Tage ohne Trade schließen das Konto. Es ist die einzige Kalendervorgabe des Hauses und wird anderswo selten erwähnt.',
        },
        {
          title: 'Nachrichten darf man halten, nicht handeln',
          detail:
            'Bei High Stakes ist das Halten einer Position durch eine wichtige Meldung erlaubt; das Öffnen oder Schließen in den 2 Minuten davor und danach nicht. Die drei anderen Programme verbieten das Ausnutzen von Nachrichten, ohne dieses Zeitfenster vorzugeben.',
        },
        {
          title: 'Große Auszahlungen können gesplittet werden',
          detail:
            'Auszahlungen erfolgen alle 14 Tage ab dem ersten Trade auf dem finanzierten Konto, nach Freigabe. Ein großer Betrag kann in Wochenraten von maximal 10.000 $ ausgezahlt werden. Sollten Sie ein großes Konto anstreben, gehört das in die Rechnung.',
        },
      ],
      more: [
        'Keine Konsistenzregel in irgendeinem der vier Programme',
        'Nacht- und Wochenendpositionen erlaubt; Indizes tragen hohe Swaps',
        'Forex-Kommission von 4 $ pro Round-Turn-Lot, je nach Asset unterschiedlich',
        'Hebel bis 1:100 bei High Stakes, 1:30 bei den drei anderen',
        'Indizes und Metalle bis 1:25; Krypto 1:2 bei High Stakes',
        'Kein Pflicht-Stop-Loss',
        'Nur MetaTrader 5 im Hedge-Modus',
      ],
    },
    journey: {
      title: 'Was nach der Zahlung passiert',
      intro: 'Der Weg hängt von der Phasenzahl Ihres Programms ab.',
      steps: [
        {
          title: 'Evaluierung',
          detail:
            'Eine Phase bei Hyper Growth und Pro Growth, zwei bei High Stakes, drei bei Bootcamp. Keine Frist, aber ein Konto ohne Trade verfällt nach 30 Tagen.',
        },
        {
          title: 'Finanziertes Konto',
          detail:
            'Die Beteiligung startet mit dem Programmsatz — 80 %, 75 % oder 50 % — und steigt mit dem Kontowachstum Richtung 100 %.',
        },
        {
          title: 'Wachstum',
          detail:
            'High Stakes rückt bei jedem 10-%-Schritt vor, Hyper Growth verdoppelt das Konto bei jedem Schritt, Pro Growth wächst schrittweise, Bootcamp bei jedem 5-%-Schritt. Die Obergrenze liegt bei 500.000 $ für High Stakes und Pro Growth, 4.000.000 $ für die beiden anderen.',
        },
        {
          title: 'Auszahlungen',
          detail:
            'Alle 14 Tage ab dem ersten Trade auf dem finanzierten Konto, vorbehaltlich der Freigabe. Ein großer Betrag kann in Wochenraten von bis zu 10.000 $ gesplittet werden.',
        },
      ],
    },
    cost_timeline: {
      title: 'Was Sie zahlen werden',
      intro: 'Drei der vier Programme zahlen Sie einmal. Bootcamp nicht.',
      steps: [
        {
          label: 'Beim Kauf',
          title: 'Einmalige Gebühr, außer Bootcamp',
          detail:
            'Von 22 $ für ein High Stakes 2,5K bis 850 $ für ein Hyper Growth 20K. Bootcamp verlangt nur einen niedrigen Einstieg: 22 $ für ein 20K, 225 $ für ein 250K.',
        },
        {
          label: 'Bei Erfolg',
          title: 'Restbetrag bei Bootcamp',
          detail:
            'Bootcamp fordert den Rest der Gebühr nach bestandener Evaluierung — 50 $ beim 20K. Die drei anderen verlangen nichts weiter.',
        },
        {
          label: 'Bei Nichtbestehen',
          title: 'Kein beworbener Reset',
          detail: 'The5ers veröffentlicht keinen Reset-Preis: Neu anfangen heißt eine vollständige Evaluierung kaufen.',
        },
        {
          label: 'Bei Auszahlung',
          title: 'Ratenzahlung möglich',
          detail:
            'Auszahlungen alle 14 Tage nach Freigabe. Große Beträge können in Wochenraten von 10.000 $ ausgezahlt werden.',
        },
      ],
    },
  },

  futureselite: {
    headquarters: 'Corso G. Matteotti 61, Latina 04100, Italien',
    regulation_details:
      'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italien, Nr. 03095010595. Keine Lizenz einer Finanzaufsicht. Demokonten, hypothetische Ergebnisse.',
    drawdown_type: 'Tagesende',
    time_limit: 'Keine Zeitbegrenzung',
    payout_frequency: 'auf Anfrage, täglich nach der Finanzierung',
    assets: ['Futures'],
    included_items: [
      'Handelstagebuch und Analyse-Dashboard',
      'Keine Aktivierungsgebühr für das finanzierte Konto',
      'Sieben Plattformen zur Auswahl',
    ],
    pros: [
      '90 % Gewinnbeteiligung beim Elite-Programm',
      'Drawdown zum Tagesende, ganz ohne Tagesverlustlimit',
      'Keine Konsistenzregel nach der Finanzierung',
      'Keine Aktivierungsgebühr für das finanzierte Konto',
      'Tägliche Auszahlungen nach der Finanzierung',
      'Bündelrabatte: Das fünfte Konto ist gratis',
    ],
    cons: [
      'Keine Lizenz einer Finanzaufsicht',
      'Demokonten, hypothetische Ergebnisse',
      '3 Mindesthandelstage in der Evaluierung, 6 nach der Finanzierung',
      'Auszahlungsobergrenze je Antrag, 1.000 $ bis 3.000 $ je nach Kontogröße',
      'Die Preislisten für Nitro, Prime und Instant sind nicht öffentlich',
    ],
    special_features: [
      '90 % Gewinnbeteiligung beim Elite-Programm',
      'Drawdown zum Tagesende, kein Tagesverlustlimit',
      'Keine Konsistenzregel nach der Finanzierung',
      'Keine Aktivierungsgebühr für das finanzierte Konto',
      'Bündelrabatte: Das fünfte Konto ist gratis',
      'Instant-Konten verfügbar, ohne Evaluierung',
    ],
    verdict_card: {
      title: 'Für wen es passt — und für wen nicht',
      body:
        'FuturesElite setzt auf großzügige Bedingungen nach der Finanzierung: 90 % Beteiligung, keine Konsistenzregel, tägliche Auszahlung. Dafür ist der Anbieter jung, unreguliert und veröffentlicht nur eine seiner vier Preislisten.',
      points: [
        'Eine hohe Beteiligung und häufige Auszahlungen, ohne Wartefrist',
        'Eine Evaluierung ohne Tagesverlustlimit, die Luft zum Atmen lässt',
        'Ein finanziertes Konto, das ohne Aktivierungsgebühr öffnet',
        'Die Möglichkeit, bis zu zehn Konten parallel zu stapeln',
      ],
    },
    program_guide: {
      title: 'Das Elite-Programm',
      intro:
        'Elite ist das einzige Programm mit öffentlicher Preisliste. Nitro, Prime und Instant gibt es an der Kasse, ihre Preise werden aber nicht gezeigt.',
      options: [
        {
          name: 'Elite',
          badge: 'Öffentliche Preise',
          summary:
            'Eine einstufige Evaluierung, ein Drawdown zum Tagesende, kein Tagesverlustlimit und 90 % Beteiligung nach der Finanzierung.',
          points: ['5 % Gewinnziel', 'Kein Tagesverlustlimit', '3 Mindesthandelstage', 'Keine Aktivierungsgebühr'],
        },
      ],
    },
    key_rules: {
      title: 'Die Regeln, die entscheiden',
      intro: 'Was FuturesElite wirklich von anderen Futures-Anbietern unterscheidet.',
      rules: [
        {
          title: 'Kein Tagesverlustlimit',
          detail:
            'Weder während der Evaluierung noch nach der Finanzierung. Das Risiko wird allein durch die Maximum Loss Limit begrenzt, die am Tagesende neu berechnet wird. Das ist das Hauptargument des Anbieters, keine fehlende Angabe.',
        },
        {
          title: 'Drawdown zum Tagesende',
          detail:
            'Das Limit aktualisiert sich einmal täglich auf den Schlusssaldo, nicht laufend. Eine Position im schwebenden Verlust löst das Limit daher erst nach Tagesschluss aus.',
        },
        {
          title: 'Keine Konsistenzregel nach der Finanzierung',
          detail:
            'Die Regel gilt während der Evaluierung und entfällt auf dem finanzierten Konto. Die Verkaufsseite zeigt zwei Werte nebeneinander, 40 % und 50 %, ohne zu sagen, welcher gilt: beim Partner zu klären.',
        },
        {
          title: 'Keine Aktivierungsgebühr',
          detail:
            'Das Bestehen der Evaluierung genügt, um das finanzierte Konto zu eröffnen. Reset-Gebühren gibt es sehr wohl: 79 $ bis 229 $ je nach Größe.',
        },
      ],
      more: [
        'Tägliche Auszahlungen nach der Finanzierung',
        '6 Mindesthandelstage vor einer Auszahlung',
        'Kein Gewinnpuffer erforderlich',
        'Sieben Plattformen zur Auswahl, darunter Tradovate und NinjaTrader',
        'Das fünfte Konto im Bündel ist gratis',
      ],
    },
    journey: {
      title: 'Was nach der Zahlung passiert',
      intro: 'Eine einzige Evaluierungsstufe, danach öffnet das finanzierte Konto sofort.',
      steps: [
        {
          title: 'Evaluierung',
          detail:
            'Das Gewinnziel erreichen, ohne die Maximum Loss Limit zu verletzen, an mindestens 3 Handelstagen. Keine Zeitbegrenzung.',
        },
        {
          title: 'Finanziertes Konto',
          detail: 'Wird bei Bestehen eröffnet, ohne Aktivierungsgebühr. Die Konsistenzregel entfällt an dieser Stelle.',
        },
        {
          title: 'Auszahlungen',
          detail:
            'Täglich möglich, nach 6 Handelstagen, innerhalb der Obergrenze je Antrag: 1.000 $ bei einem 25K, bis 3.000 $ bei einem 150K.',
        },
        {
          title: 'Konten stapeln',
          detail:
            'Elite zählt zu einer gemeinsamen Obergrenze von 5 finanzierten Konten mit Custom, Instant und Nitro. Insgesamt sind 10 aktive finanzierte Konten möglich, Nitro allein höchstens 3. Ein Bundle-Kauf hebt diese Grenzen nicht an.',
        },
      ],
    },
    cost_timeline: {
      title: 'Was Sie zahlen werden',
      intro: 'Die Kosten fallen nicht alle zum selben Zeitpunkt an.',
      steps: [
        {
          label: 'Beim Kauf',
          title: 'Einmalige Gebühr',
          detail: 'Von 95 $ für ein 25K bis 353 $ für ein 150K, vor Rabatt. Kein Abonnement.',
        },
        {
          label: 'Bei Nichtbestehen',
          title: 'Optionaler Reset',
          detail: 'Von 79 $ bei einem 25K bis 229 $ bei einem 150K. Neu anfangen ist nie Pflicht.',
        },
        {
          label: 'Beim Bestehen',
          title: 'Keine Aktivierungsgebühr',
          detail: 'Das finanzierte Konto wird ohne weitere Zahlung eröffnet.',
        },
        {
          label: 'Bei Auszahlung',
          title: 'Obergrenze je Antrag',
          detail: 'Von 1.000 $ bis 3.000 $ je nach Kontogröße, mit 90 % für Sie.',
        },
      ],
    },
  },

  'hantec-trader': {
    headquarters: 'Suite 201, The Catalyst Silicon Avenue, 40 Cybercity, 72201 Ebène, Mauritius',
    regulation_details:
      'Hantec Trader Limited, mauritische Gesellschaft Nr. C191400. Unreguliert: ein Eigenhandelsunternehmen. Partnerbroker: Hantec Markets Limited / Hantec Markets Mauritius.',
    drawdown_type:
      'Tagesverlust gemessen am höheren Wert aus Saldo oder Equity beim Schluss des Vortags. Gesamt-Drawdown je nach Programm nachlaufend oder statisch.',
    time_limit: 'Keine Zeitbegrenzung, außer Instant24: 24 Stunden ab dem ersten Trade',
    payout_frequency: 'auf Anfrage, Entscheidung binnen 24 Geschäftsstunden',
    assets: ['Forex', 'Indizes', 'Rohstoffe', 'Metalle', 'Krypto'],
    payout_methods: ['Banküberweisung', 'Kryptowährung', 'E-Wallets'],
    restricted_countries: [
      'Afghanistan', 'Ägypten', 'Australien', 'Belgien', 'Deutschland',
      'Haiti', 'Iran', 'Israel', 'Jemen', 'Jordanien', 'Kongo (Brazzaville)',
      'Kongo (Kinshasa)', 'Kosovo', 'Laos', 'Libyen', 'Malaysia', 'Myanmar',
      'Nordkorea', 'Pakistan', 'Puerto Rico', 'Katar', 'Rumänien', 'Russland',
      'Serbien', 'Somalia', 'Südsudan', 'Taiwan', 'Thailand', 'Tschechien',
      'Usbekistan', 'Vereinigte Staaten', 'Vietnam',
    ],
    included_items: [
      'MetaTrader 4 und MetaTrader 5',
      'Sieben Programme, von Sofortfinanzierung bis drei Phasen',
      '95-%-Beteiligungs-Add-on bei sechs Programmen verfügbar',
    ],
    pros: [
      'Sieben Programme, von sofort über eine und zwei bis drei Phasen',
      'Einstieg ab 13 $ mit Instant24',
      '80 % Beteiligung, mit Add-on auf 95 % bei sechs Programmen',
      'Keine Zeitbegrenzung, außer Instant24 bauartbedingt',
      'Auszahlungsentscheidung binnen 24 Geschäftsstunden für zulässige Anträge',
      'Identifizierter Partnerbroker: Hantec Markets',
    ],
    cons: [
      'Unreguliert: ein Eigenhandelsunternehmen, kein Broker',
      'US-Trader werden nicht akzeptiert',
      '32 ausgeschlossene Gebiete, darunter Deutschland, Belgien und Australien',
      'Nachrichtenhandel ist standardmäßig eingeschränkt, außer bei Instant24',
      'Scalping kann jenseits einer Schwelle zu einer Gewinnanpassung führen',
      'Hebel bei Krypto auf 1:1 begrenzt',
    ],
    special_features: [
      '80 % Beteiligung, mit dem Add-on „95% Reward Share" auf 95 %',
      'Sieben Programme, von Instant24 über 24 Stunden bis Endurance über drei Phasen',
      'Tagesverlust gemessen am höheren Wert aus Saldo oder Equity des Vortags',
      'News-Trading-Add-on, um die Beschränkung rund um Meldungen aufzuheben',
      'Hebel 1:50 auf Forex, 1:15 auf Indizes und Rohstoffe, 1:10 auf Metalle',
      'US-Trader werden nicht akzeptiert',
    ],
    verdict_card: {
      title: 'Für wen es passt — und für wen nicht',
      body:
        'Hantec Trader bietet sieben Programme, die fast jedes Profil abdecken, von Sofortfinanzierung ab 13 $ bis zu einem Weg über drei Phasen. Die Beteiligung startet bei 80 % und steigt mit einem kostenpflichtigen Add-on auf 95 %. Dafür ist der Anbieter unreguliert und schließt ungewöhnlich viele Märkte aus.',
      points: [
        'Eine Auswahl aus sieben Wegen, von Sofortfinanzierung bis drei Phasen',
        'Ein sehr günstiger Einstieg: Instant24 startet bei 13 $',
        'Eine auf 95 % erhöhte Beteiligung, wenn Sie das Add-on nehmen',
        'Ein identifizierter Partnerbroker, gestützt auf die Hantec-Markets-Gruppe',
      ],
    },
    program_guide: {
      title: 'Sieben Programme, drei Familien',
      intro:
        'Die Wahl beginnt beim Format: sofort finanziert, oder eine Evaluierung über eine, zwei oder drei Phasen.',
      options: [
        {
          name: 'Instant Funding',
          badge: 'Sofort finanziert',
          summary: 'Keine Evaluierung, kein Ziel. Der Preis ist der Kompromiss: 43 $ bei einem 1K, bis 2.139 $ bei einem 50K.',
          points: ['Von 1K bis 50K', 'Kein Gewinnziel', '6 % Tagesverlust', '6 % nachlaufender Gesamt-Drawdown'],
        },
        {
          name: 'Instant Lite',
          badge: 'Finanziert, günstiger',
          summary: 'Dieselbe Idee zu einem Fünftel des Preises, gegen einen engeren Tagesverlust und 5 Gewinntage je Auszahlungszyklus.',
          points: ['Von 1K bis 100K, ab 19 $', '3 % Tagesverlust', '5 % Gesamt-Drawdown', '5 Gewinntage je Auszahlungszyklus'],
        },
        {
          name: 'Instant24',
          badge: 'Vierundzwanzig Stunden',
          summary:
            'Das günstigste Format im Katalog: Das Konto lebt 24 Stunden ab dem ersten Trade. Es ist zugleich das einzige Programm, in dem Nachrichtenhandel frei ist.',
          points: ['Von 2K bis 100K, ab 13 $', '24 Stunden ab dem ersten Trade', '2 % Tagesverlust', 'Nachrichtenhandel erlaubt'],
        },
        {
          name: 'Express',
          badge: 'Eine Phase',
          summary: 'Eine einzige 10-%-Phase, ohne Mindesttage, mit einem nachlaufenden Gesamt-Drawdown von 6 %.',
          points: ['Von 2K bis 200K, ab 39 $', '10 % Ziel', 'Keine Mindesttage', '6 % nachlaufender Drawdown'],
        },
        {
          name: 'Enhanced',
          badge: 'Zwei Phasen',
          summary: '10 % dann 5 % Ziel, mit dem breitesten Tageslimit des Katalogs und einem statischen Drawdown.',
          points: ['Von 5K bis 200K, ab 59 $', '10 % dann 5 % Ziel', '5 % Tagesverlust', '3 Gewinntage je Phase'],
        },
        {
          name: 'EnhancedX',
          badge: 'Zwei Phasen, keine Mindesttage',
          summary: 'Niedrigere Ziele als Enhanced, 8 % dann 4 %, und keine Mindesttage, gegen ein engeres Tageslimit.',
          points: ['Von 5K bis 200K, ab 59 $', '8 % dann 4 % Ziel', '4 % Tagesverlust', 'Keine Mindesttage'],
        },
        {
          name: 'Endurance',
          badge: 'Drei Phasen',
          summary: 'Drei 6-%-Schritte, der schrittweiseste Weg und bei gleichem Kapital der günstigste: 29 $ für ein 5K.',
          points: ['Von 5K bis 200K, ab 29 $', '6 % Ziel je Schritt', '8 % statischer Drawdown', '3 Tage je Schritt'],
        },
      ],
    },
    key_rules: {
      title: 'Die Regeln, die entscheiden',
      intro: 'Vier Punkte, direkt vom Anbieter übermittelt, zwei davon korrigierten unsere frühere Seite.',
      rules: [
        {
          title: 'Die Beteiligung beträgt 80 %, nicht 95 %',
          detail:
            'Der Standardsatz liegt bei 80 %. Die 95 % kommen vom kostenpflichtigen Add-on „95% Reward Share", verfügbar bei Instant Funding, Instant Lite, Instant24, Endurance, EnhancedX, Enhanced und Express.',
        },
        {
          title: 'Nachrichtenhandel ist standardmäßig eingeschränkt',
          detail:
            'Während der Evaluierung ist er bei Express, Enhanced, EnhancedX und Endurance frei. Auf einem finanzierten Hantec-Trader-Konto ist das Öffnen oder Schließen einer Position binnen 3 Minuten um eine wichtige Meldung untersagt, sofern Sie nicht das News-Trading-Add-on halten. Instant Funding und Instant Lite folgen derselben Beschränkung; Instant24 ist das einzige, das ihn frei erlaubt.',
        },
        {
          title: 'Scalping ist durch eine Schwelle begrenzt, nicht verboten',
          detail:
            'Machen Nettogewinne aus Positionen unter 3 Minuten 30 % oder mehr des Gesamtnettogewinns im Evaluierungszeitraum aus, gilt die Aktivität als Scalping und kann zu einer Gewinnanpassung oder einer Handelsbeschränkung führen.',
        },
        {
          title: 'Der Tagesverlust bemisst sich am Vortag',
          detail:
            'Bei allen sieben Programmen wird das Tageslimit am höheren Wert aus Saldo oder Equity beim Schluss des Vortags gemessen. Der Gesamt-Drawdown läuft bei den Instant-Programmen und Express nach und ist bei Endurance, Enhanced und EnhancedX statisch.',
        },
      ],
      more: [
        'Hebel 1:50 auf Forex, 1:15 auf Indizes und Rohstoffe',
        'Hebel 1:10 auf Metalle, 1:1 auf Krypto',
        'MetaTrader 4 und MetaTrader 5',
        'Auszahlungsentscheidung binnen 24 Geschäftsstunden für zulässige Anträge',
        'Auszahlungen per Überweisung, Krypto oder E-Wallet',
      ],
    },
    journey: {
      title: 'Was nach der Zahlung passiert',
      intro: 'Der Weg hängt von der gewählten Programmfamilie ab.',
      steps: [
        {
          title: 'Sofortfinanzierung',
          detail:
            'Bei Instant Funding, Instant Lite und Instant24 gibt es keine Evaluierung: Das Konto ist ab Kauf aktiv, mit eigenen Risikolimits.',
        },
        {
          title: 'Evaluierung',
          detail:
            'Bei Express eine einzige 10-%-Phase. Bei Enhanced und EnhancedX zwei Phasen. Bei Endurance drei 6-%-Schritte. Keine Zeitbegrenzung bei diesen vier Programmen.',
        },
        {
          title: 'Hantec-Trader-Konto',
          detail:
            'Nach der Finanzierung gilt die Nachrichtenbeschränkung binnen 3 Minuten um wichtige Meldungen, außer mit dem News-Trading-Add-on und außer bei Instant24.',
        },
        {
          title: 'Auszahlungen',
          detail:
            'Entscheidung binnen 24 Geschäftsstunden für zulässige Anträge; wie schnell das Geld ankommt, hängt vom Weg ab. 80 % Beteiligung, oder 95 % mit dem Add-on.',
        },
      ],
    },
  },
}
