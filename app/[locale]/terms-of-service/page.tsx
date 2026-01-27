'use client'

import { usePathname } from 'next/navigation'

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: January 1, 2026',
    s1Title: '1. Agreement to Terms',
    s1p1: 'By accessing or using PropFirm Scanner (www.propfirmscanner.org), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you do not have permission to access the website.',
    s2Title: '2. Description of Service',
    s2p1: 'PropFirm Scanner is an information and comparison platform for proprietary trading firms. We provide:',
    s2l1: 'Comparison tools for prop trading firms',
    s2l2: 'Reviews and analysis of prop firms',
    s2l3: 'Educational content about prop trading',
    s2l4: 'Discount codes and promotional offers',
    s2l5: 'Trading tools (risk calculator, rule tracker)',
    s3Title: '3. Important Disclaimers',
    s3h1: 'Not Financial Advice',
    s3p1: 'The information provided on PropFirm Scanner is for general informational purposes only. It should not be considered as financial advice, investment advice, or trading advice. Always conduct your own research and consult with a qualified financial advisor.',
    s3h2: 'No Guarantees',
    s3p2: 'We do not guarantee the accuracy, completeness, or timeliness of any information on our website. Prop firm rules, prices, and conditions change frequently. Always verify information directly with the prop firm.',
    s3h3: 'Trading Risk',
    s3p3: 'Trading in financial markets involves substantial risk of loss. Past performance is not indicative of future results. You should only trade with money you can afford to lose.',
    s4Title: '4. Affiliate Relationships',
    s4p1: 'PropFirm Scanner participates in affiliate programs with various prop trading firms. When you click on certain links and make a purchase, we may receive a commission at no additional cost to you.',
    s4p2: 'Our affiliate relationships do not influence our reviews or rankings. We strive to provide honest, unbiased information regardless of affiliate status.',
    s5Title: '5. User Accounts',
    s5p1: 'When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for any activities that occur under your account.',
    s5p2: 'You agree to notify us immediately of any unauthorized access to your account.',
    s6Title: '6. Acceptable Use',
    s6p1: 'You agree not to:',
    s6l1: 'Use the website for any illegal purpose',
    s6l2: 'Attempt to gain unauthorized access to our systems',
    s6l3: 'Scrape or copy our content without permission',
    s6l4: 'Interfere with the proper functioning of the website',
    s6l5: 'Submit false or misleading information',
    s6l6: 'Impersonate any person or entity',
    s6l7: 'Use automated systems to access the website',
    s7Title: '7. Intellectual Property',
    s7p1: 'All content on PropFirm Scanner, including text, graphics, logos, images, and software, is the property of PropFirm Scanner or its content suppliers and is protected by copyright laws.',
    s7p2: 'You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.',
    s8Title: '8. Third-Party Links',
    s8p1: 'Our website contains links to third-party websites (prop firms, tools, resources). We are not responsible for the content, privacy policies, or practices of any third-party websites. You access third-party websites at your own risk.',
    s9Title: '9. Limitation of Liability',
    s9p1: 'To the maximum extent permitted by law, PropFirm Scanner shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:',
    s9l1: 'Loss of profits or revenue',
    s9l2: 'Loss of data',
    s9l3: 'Trading losses',
    s9l4: 'Failed prop firm challenges',
    s9l5: 'Any other intangible losses',
    s9p2: 'This limitation applies whether the alleged liability is based on contract, tort, negligence, or any other basis.',
    s10Title: '10. Indemnification',
    s10p1: 'You agree to indemnify and hold harmless PropFirm Scanner and its affiliates from any claims, losses, damages, liabilities, and expenses arising from your use of the website or violation of these terms.',
    s11Title: '11. Modifications',
    s11p1: 'We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by posting a notice on our website. Your continued use of the website after changes constitutes acceptance of the modified terms.',
    s12Title: '12. Termination',
    s12p1: 'We may terminate or suspend your access to the website immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the website will cease immediately.',
    s13Title: '13. Governing Law',
    s13p1: 'These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.',
    s14Title: '14. Contact Us',
    s14p1: 'If you have any questions about these Terms of Service, please contact us at:',
    email: 'Email',
    website: 'Website',
  },
  fr: {
    title: 'Conditions d\'Utilisation',
    lastUpdated: 'Dernière mise à jour : 1er janvier 2026',
    s1Title: '1. Acceptation des Conditions',
    s1p1: 'En accédant ou en utilisant PropFirm Scanner (www.propfirmscanner.org), vous acceptez d\'être lié par ces Conditions d\'Utilisation. Si vous n\'êtes pas d\'accord, vous n\'avez pas la permission d\'accéder au site.',
    s2Title: '2. Description du Service',
    s2p1: 'PropFirm Scanner est une plateforme d\'information et de comparaison pour les sociétés de trading propriétaire. Nous fournissons :',
    s2l1: 'Outils de comparaison pour les prop firms',
    s2l2: 'Avis et analyses de prop firms',
    s2l3: 'Contenu éducatif sur le prop trading',
    s2l4: 'Codes de réduction et offres promotionnelles',
    s2l5: 'Outils de trading (calculateur de risque, suivi des règles)',
    s3Title: '3. Avertissements Importants',
    s3h1: 'Pas de Conseil Financier',
    s3p1: 'Les informations fournies sur PropFirm Scanner sont à titre informatif uniquement. Elles ne doivent pas être considérées comme des conseils financiers ou d\'investissement. Effectuez toujours vos propres recherches.',
    s3h2: 'Aucune Garantie',
    s3p2: 'Nous ne garantissons pas l\'exactitude ou l\'exhaustivité des informations. Les règles et prix des prop firms changent fréquemment. Vérifiez toujours directement auprès de la prop firm.',
    s3h3: 'Risque de Trading',
    s3p3: 'Le trading sur les marchés financiers comporte un risque substantiel de perte. Les performances passées ne préjugent pas des résultats futurs. Ne tradez qu\'avec de l\'argent que vous pouvez vous permettre de perdre.',
    s4Title: '4. Relations d\'Affiliation',
    s4p1: 'PropFirm Scanner participe à des programmes d\'affiliation avec diverses prop firms. Nous pouvons recevoir une commission sans frais supplémentaires pour vous.',
    s4p2: 'Nos relations d\'affiliation n\'influencent pas nos avis ou classements. Nous nous efforçons de fournir des informations honnêtes et impartiales.',
    s5Title: '5. Comptes Utilisateurs',
    s5p1: 'Lors de la création d\'un compte, vous devez fournir des informations exactes et complètes. Vous êtes responsable de la sécurité de votre mot de passe et de toute activité sous votre compte.',
    s5p2: 'Vous acceptez de nous notifier immédiatement tout accès non autorisé à votre compte.',
    s6Title: '6. Utilisation Acceptable',
    s6p1: 'Vous acceptez de ne pas :',
    s6l1: 'Utiliser le site à des fins illégales',
    s6l2: 'Tenter d\'accéder sans autorisation à nos systèmes',
    s6l3: 'Copier notre contenu sans permission',
    s6l4: 'Interférer avec le bon fonctionnement du site',
    s6l5: 'Soumettre des informations fausses ou trompeuses',
    s6l6: 'Usurper l\'identité de toute personne ou entité',
    s6l7: 'Utiliser des systèmes automatisés pour accéder au site',
    s7Title: '7. Propriété Intellectuelle',
    s7p1: 'Tout le contenu de PropFirm Scanner, y compris textes, graphiques, logos, images et logiciels, est la propriété de PropFirm Scanner et est protégé par les lois sur le droit d\'auteur.',
    s7p2: 'Vous ne pouvez pas reproduire, distribuer ou modifier tout contenu sans notre permission écrite.',
    s8Title: '8. Liens Tiers',
    s8p1: 'Notre site contient des liens vers des sites tiers (prop firms, outils, ressources). Nous ne sommes pas responsables du contenu ou des pratiques de ces sites. Vous y accédez à vos propres risques.',
    s9Title: '9. Limitation de Responsabilité',
    s9p1: 'Dans la mesure maximale permise par la loi, PropFirm Scanner ne sera pas responsable des dommages indirects, accessoires, spéciaux ou punitifs, y compris :',
    s9l1: 'Perte de profits ou de revenus',
    s9l2: 'Perte de données',
    s9l3: 'Pertes de trading',
    s9l4: 'Échecs aux challenges de prop firms',
    s9l5: 'Toute autre perte immatérielle',
    s9p2: 'Cette limitation s\'applique quelle que soit la base de la responsabilité alléguée.',
    s10Title: '10. Indemnisation',
    s10p1: 'Vous acceptez d\'indemniser et de dégager de toute responsabilité PropFirm Scanner et ses affiliés contre toute réclamation découlant de votre utilisation du site ou de la violation de ces conditions.',
    s11Title: '11. Modifications',
    s11p1: 'Nous nous réservons le droit de modifier ces Conditions à tout moment. Nous vous informerons des changements significatifs. Votre utilisation continue du site après les modifications constitue une acceptation.',
    s12Title: '12. Résiliation',
    s12p1: 'Nous pouvons résilier ou suspendre votre accès au site immédiatement, sans préavis, pour toute raison, y compris la violation de ces Conditions.',
    s13Title: '13. Droit Applicable',
    s13p1: 'Ces Conditions sont régies et interprétées conformément aux lois applicables.',
    s14Title: '14. Nous Contacter',
    s14p1: 'Si vous avez des questions concernant ces Conditions d\'Utilisation, contactez-nous :',
    email: 'Email',
    website: 'Site web',
  },
  de: {
    title: 'Nutzungsbedingungen',
    lastUpdated: 'Zuletzt aktualisiert: 1. Januar 2026',
    s1Title: '1. Zustimmung zu den Bedingungen',
    s1p1: 'Durch den Zugriff auf PropFirm Scanner (www.propfirmscanner.org) stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie nicht einverstanden sind, haben Sie keine Berechtigung, auf die Website zuzugreifen.',
    s2Title: '2. Beschreibung des Dienstes',
    s2p1: 'PropFirm Scanner ist eine Informations- und Vergleichsplattform für Prop-Trading-Firmen. Wir bieten:',
    s2l1: 'Vergleichstools für Prop-Firmen',
    s2l2: 'Bewertungen und Analysen von Prop-Firmen',
    s2l3: 'Bildungsinhalte über Prop-Trading',
    s2l4: 'Rabattcodes und Werbeangebote',
    s2l5: 'Trading-Tools (Risikorechner, Regel-Tracker)',
    s3Title: '3. Wichtige Haftungsausschlüsse',
    s3h1: 'Keine Finanzberatung',
    s3p1: 'Die auf PropFirm Scanner bereitgestellten Informationen dienen nur zu allgemeinen Informationszwecken. Sie sollten nicht als Finanz- oder Anlageberatung betrachtet werden. Führen Sie immer Ihre eigene Recherche durch.',
    s3h2: 'Keine Garantien',
    s3p2: 'Wir garantieren nicht die Genauigkeit oder Vollständigkeit der Informationen. Prop-Firmen-Regeln und Preise ändern sich häufig. Überprüfen Sie immer direkt bei der Prop-Firma.',
    s3h3: 'Handelsrisiko',
    s3p3: 'Der Handel an Finanzmärkten birgt erhebliche Verlustrisiken. Vergangene Ergebnisse sind kein Indikator für zukünftige Ergebnisse. Handeln Sie nur mit Geld, das Sie sich leisten können zu verlieren.',
    s4Title: '4. Affiliate-Beziehungen',
    s4p1: 'PropFirm Scanner nimmt an Affiliate-Programmen mit verschiedenen Prop-Firmen teil. Wir können eine Provision erhalten, ohne zusätzliche Kosten für Sie.',
    s4p2: 'Unsere Affiliate-Beziehungen beeinflussen nicht unsere Bewertungen oder Rankings. Wir bemühen uns um ehrliche, unvoreingenommene Informationen.',
    s5Title: '5. Benutzerkonten',
    s5p1: 'Bei der Kontoerstellung müssen Sie genaue und vollständige Informationen angeben. Sie sind für die Sicherheit Ihres Passworts und alle Aktivitäten unter Ihrem Konto verantwortlich.',
    s5p2: 'Sie stimmen zu, uns sofort über unbefugten Zugriff auf Ihr Konto zu informieren.',
    s6Title: '6. Akzeptable Nutzung',
    s6p1: 'Sie stimmen zu, nicht:',
    s6l1: 'Die Website für illegale Zwecke zu nutzen',
    s6l2: 'Unbefugten Zugriff auf unsere Systeme zu versuchen',
    s6l3: 'Unsere Inhalte ohne Erlaubnis zu kopieren',
    s6l4: 'Das ordnungsgemäße Funktionieren der Website zu stören',
    s6l5: 'Falsche oder irreführende Informationen einzureichen',
    s6l6: 'Sich als eine andere Person oder Entität auszugeben',
    s6l7: 'Automatisierte Systeme für den Zugriff zu verwenden',
    s7Title: '7. Geistiges Eigentum',
    s7p1: 'Alle Inhalte auf PropFirm Scanner, einschließlich Texte, Grafiken, Logos, Bilder und Software, sind Eigentum von PropFirm Scanner und urheberrechtlich geschützt.',
    s7p2: 'Sie dürfen Inhalte nicht ohne unsere schriftliche Genehmigung reproduzieren, verteilen oder modifizieren.',
    s8Title: '8. Links zu Drittanbietern',
    s8p1: 'Unsere Website enthält Links zu Drittanbieter-Websites. Wir sind nicht verantwortlich für den Inhalt oder die Praktiken dieser Websites. Sie greifen auf eigenes Risiko darauf zu.',
    s9Title: '9. Haftungsbeschränkung',
    s9p1: 'Im maximal zulässigen Umfang haftet PropFirm Scanner nicht für indirekte, beiläufige, besondere oder Folgeschäden, einschließlich:',
    s9l1: 'Verlust von Gewinnen oder Einnahmen',
    s9l2: 'Datenverlust',
    s9l3: 'Handelsverluste',
    s9l4: 'Gescheiterte Prop-Firmen-Challenges',
    s9l5: 'Andere immaterielle Verluste',
    s9p2: 'Diese Beschränkung gilt unabhängig von der Grundlage der Haftung.',
    s10Title: '10. Freistellung',
    s10p1: 'Sie stimmen zu, PropFirm Scanner von allen Ansprüchen, Verlusten und Schäden freizustellen, die aus Ihrer Nutzung der Website oder Verletzung dieser Bedingungen entstehen.',
    s11Title: '11. Änderungen',
    s11p1: 'Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Wir werden Sie über wesentliche Änderungen informieren. Ihre weitere Nutzung gilt als Annahme.',
    s12Title: '12. Kündigung',
    s12p1: 'Wir können Ihren Zugang zur Website sofort und ohne Vorankündigung aus beliebigem Grund beenden, einschließlich Verstößen gegen diese Bedingungen.',
    s13Title: '13. Anwendbares Recht',
    s13p1: 'Diese Bedingungen unterliegen dem anwendbaren Recht.',
    s14Title: '14. Kontaktieren Sie Uns',
    s14p1: 'Wenn Sie Fragen zu diesen Nutzungsbedingungen haben, kontaktieren Sie uns:',
    email: 'E-Mail',
    website: 'Website',
  },
  es: {
    title: 'Términos de Servicio',
    lastUpdated: 'Última actualización: 1 de enero de 2026',
    s1Title: '1. Aceptación de Términos',
    s1p1: 'Al acceder o usar PropFirm Scanner (www.propfirmscanner.org), acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo, no tiene permiso para acceder al sitio.',
    s2Title: '2. Descripción del Servicio',
    s2p1: 'PropFirm Scanner es una plataforma de información y comparación para empresas de trading propietario. Proporcionamos:',
    s2l1: 'Herramientas de comparación para prop firms',
    s2l2: 'Reseñas y análisis de prop firms',
    s2l3: 'Contenido educativo sobre prop trading',
    s2l4: 'Códigos de descuento y ofertas promocionales',
    s2l5: 'Herramientas de trading (calculadora de riesgo, rastreador de reglas)',
    s3Title: '3. Descargos de Responsabilidad',
    s3h1: 'No es Asesoramiento Financiero',
    s3p1: 'La información en PropFirm Scanner es solo para fines informativos generales. No debe considerarse como asesoramiento financiero o de inversión. Siempre realice su propia investigación.',
    s3h2: 'Sin Garantías',
    s3p2: 'No garantizamos la exactitud o integridad de la información. Las reglas y precios de las prop firms cambian frecuentemente. Siempre verifique directamente con la prop firm.',
    s3h3: 'Riesgo de Trading',
    s3p3: 'El trading en mercados financieros implica un riesgo sustancial de pérdida. El rendimiento pasado no indica resultados futuros. Solo opere con dinero que pueda permitirse perder.',
    s4Title: '4. Relaciones de Afiliados',
    s4p1: 'PropFirm Scanner participa en programas de afiliados con varias prop firms. Podemos recibir una comisión sin costo adicional para usted.',
    s4p2: 'Nuestras relaciones de afiliados no influyen en nuestras reseñas o rankings. Nos esforzamos por proporcionar información honesta e imparcial.',
    s5Title: '5. Cuentas de Usuario',
    s5p1: 'Al crear una cuenta, debe proporcionar información precisa y completa. Es responsable de proteger su contraseña y de cualquier actividad bajo su cuenta.',
    s5p2: 'Acepta notificarnos inmediatamente sobre cualquier acceso no autorizado a su cuenta.',
    s6Title: '6. Uso Aceptable',
    s6p1: 'Acepta no:',
    s6l1: 'Usar el sitio para propósitos ilegales',
    s6l2: 'Intentar acceso no autorizado a nuestros sistemas',
    s6l3: 'Copiar nuestro contenido sin permiso',
    s6l4: 'Interferir con el funcionamiento del sitio',
    s6l5: 'Enviar información falsa o engañosa',
    s6l6: 'Hacerse pasar por otra persona o entidad',
    s6l7: 'Usar sistemas automatizados para acceder al sitio',
    s7Title: '7. Propiedad Intelectual',
    s7p1: 'Todo el contenido en PropFirm Scanner, incluyendo textos, gráficos, logos, imágenes y software, es propiedad de PropFirm Scanner y está protegido por leyes de derechos de autor.',
    s7p2: 'No puede reproducir, distribuir o modificar ningún contenido sin nuestro permiso escrito.',
    s8Title: '8. Enlaces de Terceros',
    s8p1: 'Nuestro sitio contiene enlaces a sitios de terceros. No somos responsables del contenido o prácticas de estos sitios. Accede a ellos bajo su propio riesgo.',
    s9Title: '9. Limitación de Responsabilidad',
    s9p1: 'En la máxima medida permitida por la ley, PropFirm Scanner no será responsable por daños indirectos, incidentales, especiales o punitivos, incluyendo:',
    s9l1: 'Pérdida de ganancias o ingresos',
    s9l2: 'Pérdida de datos',
    s9l3: 'Pérdidas de trading',
    s9l4: 'Challenges fallidos de prop firms',
    s9l5: 'Otras pérdidas intangibles',
    s9p2: 'Esta limitación aplica independientemente de la base de la responsabilidad.',
    s10Title: '10. Indemnización',
    s10p1: 'Acepta indemnizar y mantener indemne a PropFirm Scanner de cualquier reclamo, pérdida y daño derivado de su uso del sitio o violación de estos términos.',
    s11Title: '11. Modificaciones',
    s11p1: 'Nos reservamos el derecho de modificar estos Términos en cualquier momento. Le notificaremos de cambios significativos. Su uso continuo constituye aceptación.',
    s12Title: '12. Terminación',
    s12p1: 'Podemos terminar o suspender su acceso al sitio inmediatamente, sin previo aviso, por cualquier razón, incluyendo violación de estos Términos.',
    s13Title: '13. Ley Aplicable',
    s13p1: 'Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables.',
    s14Title: '14. Contáctenos',
    s14p1: 'Si tiene preguntas sobre estos Términos de Servicio, contáctenos:',
    email: 'Correo',
    website: 'Sitio web',
  },
  pt: {
    title: 'Termos de Serviço',
    lastUpdated: 'Última atualização: 1 de janeiro de 2026',
    s1Title: '1. Aceitação dos Termos',
    s1p1: 'Ao acessar ou usar o PropFirm Scanner (www.propfirmscanner.org), você concorda em estar vinculado a estes Termos de Serviço. Se você não concordar, não tem permissão para acessar o site.',
    s2Title: '2. Descrição do Serviço',
    s2p1: 'PropFirm Scanner é uma plataforma de informação e comparação para empresas de trading proprietário. Fornecemos:',
    s2l1: 'Ferramentas de comparação para prop firms',
    s2l2: 'Avaliações e análises de prop firms',
    s2l3: 'Conteúdo educativo sobre prop trading',
    s2l4: 'Códigos de desconto e ofertas promocionais',
    s2l5: 'Ferramentas de trading (calculadora de risco, rastreador de regras)',
    s3Title: '3. Avisos Importantes',
    s3h1: 'Não é Aconselhamento Financeiro',
    s3p1: 'As informações no PropFirm Scanner são apenas para fins informativos gerais. Não devem ser consideradas como aconselhamento financeiro ou de investimento. Sempre faça sua própria pesquisa.',
    s3h2: 'Sem Garantias',
    s3p2: 'Não garantimos a precisão ou completude das informações. As regras e preços das prop firms mudam frequentemente. Sempre verifique diretamente com a prop firm.',
    s3h3: 'Risco de Trading',
    s3p3: 'O trading em mercados financeiros envolve risco substancial de perda. O desempenho passado não indica resultados futuros. Negocie apenas com dinheiro que você pode se dar ao luxo de perder.',
    s4Title: '4. Relacionamentos de Afiliados',
    s4p1: 'PropFirm Scanner participa de programas de afiliados com várias prop firms. Podemos receber uma comissão sem custo adicional para você.',
    s4p2: 'Nossos relacionamentos de afiliados não influenciam nossas avaliações ou rankings. Nos esforçamos para fornecer informações honestas e imparciais.',
    s5Title: '5. Contas de Usuário',
    s5p1: 'Ao criar uma conta, você deve fornecer informações precisas e completas. Você é responsável por proteger sua senha e por qualquer atividade em sua conta.',
    s5p2: 'Você concorda em nos notificar imediatamente sobre qualquer acesso não autorizado à sua conta.',
    s6Title: '6. Uso Aceitável',
    s6p1: 'Você concorda em não:',
    s6l1: 'Usar o site para propósitos ilegais',
    s6l2: 'Tentar acesso não autorizado aos nossos sistemas',
    s6l3: 'Copiar nosso conteúdo sem permissão',
    s6l4: 'Interferir no funcionamento adequado do site',
    s6l5: 'Enviar informações falsas ou enganosas',
    s6l6: 'Se passar por outra pessoa ou entidade',
    s6l7: 'Usar sistemas automatizados para acessar o site',
    s7Title: '7. Propriedade Intelectual',
    s7p1: 'Todo o conteúdo no PropFirm Scanner, incluindo textos, gráficos, logos, imagens e software, é propriedade do PropFirm Scanner e está protegido por leis de direitos autorais.',
    s7p2: 'Você não pode reproduzir, distribuir ou modificar nenhum conteúdo sem nossa permissão escrita.',
    s8Title: '8. Links de Terceiros',
    s8p1: 'Nosso site contém links para sites de terceiros. Não somos responsáveis pelo conteúdo ou práticas desses sites. Você acessa por sua própria conta e risco.',
    s9Title: '9. Limitação de Responsabilidade',
    s9p1: 'Na máxima extensão permitida por lei, PropFirm Scanner não será responsável por danos indiretos, incidentais, especiais ou punitivos, incluindo:',
    s9l1: 'Perda de lucros ou receita',
    s9l2: 'Perda de dados',
    s9l3: 'Perdas de trading',
    s9l4: 'Desafios de prop firms fracassados',
    s9l5: 'Outras perdas intangíveis',
    s9p2: 'Esta limitação aplica-se independentemente da base da responsabilidade.',
    s10Title: '10. Indenização',
    s10p1: 'Você concorda em indenizar e isentar PropFirm Scanner de quaisquer reivindicações, perdas e danos decorrentes do seu uso do site ou violação destes termos.',
    s11Title: '11. Modificações',
    s11p1: 'Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos você sobre mudanças significativas. Seu uso contínuo constitui aceitação.',
    s12Title: '12. Rescisão',
    s12p1: 'Podemos encerrar ou suspender seu acesso ao site imediatamente, sem aviso prévio, por qualquer motivo, incluindo violação destes Termos.',
    s13Title: '13. Lei Aplicável',
    s13p1: 'Estes Termos serão regidos e interpretados de acordo com as leis aplicáveis.',
    s14Title: '14. Entre em Contato',
    s14p1: 'Se você tiver perguntas sobre estes Termos de Serviço, entre em contato:',
    email: 'Email',
    website: 'Site',
  },
  ar: {
    title: 'شروط الخدمة',
    lastUpdated: 'آخر تحديث: 1 يناير 2026',
    s1Title: '1. الموافقة على الشروط',
    s1p1: 'من خلال الوصول إلى PropFirm Scanner (www.propfirmscanner.org) أو استخدامه، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق، فليس لديك إذن للوصول إلى الموقع.',
    s2Title: '2. وصف الخدمة',
    s2p1: 'PropFirm Scanner هي منصة معلومات ومقارنة لشركات التداول. نقدم:',
    s2l1: 'أدوات مقارنة لشركات prop',
    s2l2: 'مراجعات وتحليلات لشركات prop',
    s2l3: 'محتوى تعليمي حول prop trading',
    s2l4: 'رموز خصم وعروض ترويجية',
    s2l5: 'أدوات تداول (حاسبة المخاطر، متتبع القواعد)',
    s3Title: '3. إخلاء المسؤولية المهمة',
    s3h1: 'ليست نصيحة مالية',
    s3p1: 'المعلومات المقدمة على PropFirm Scanner هي لأغراض إعلامية عامة فقط. لا ينبغي اعتبارها نصيحة مالية أو استثمارية. قم دائمًا بإجراء بحثك الخاص.',
    s3h2: 'لا ضمانات',
    s3p2: 'نحن لا نضمن دقة أو اكتمال المعلومات. تتغير قواعد وأسعار شركات prop بشكل متكرر. تحقق دائمًا مباشرة مع الشركة.',
    s3h3: 'مخاطر التداول',
    s3p3: 'التداول في الأسواق المالية ينطوي على مخاطر كبيرة للخسارة. الأداء السابق لا يشير إلى النتائج المستقبلية. تداول فقط بأموال يمكنك تحمل خسارتها.',
    s4Title: '4. علاقات الشراكة',
    s4p1: 'يشارك PropFirm Scanner في برامج الشراكة مع شركات prop مختلفة. قد نتلقى عمولة بدون تكلفة إضافية عليك.',
    s4p2: 'علاقات الشراكة لدينا لا تؤثر على مراجعاتنا أو تصنيفاتنا. نسعى لتقديم معلومات صادقة وغير متحيزة.',
    s5Title: '5. حسابات المستخدمين',
    s5p1: 'عند إنشاء حساب، يجب عليك تقديم معلومات دقيقة وكاملة. أنت مسؤول عن حماية كلمة مرورك وأي نشاط تحت حسابك.',
    s5p2: 'توافق على إخطارنا فورًا بأي وصول غير مصرح به إلى حسابك.',
    s6Title: '6. الاستخدام المقبول',
    s6p1: 'توافق على عدم:',
    s6l1: 'استخدام الموقع لأغراض غير قانونية',
    s6l2: 'محاولة الوصول غير المصرح به إلى أنظمتنا',
    s6l3: 'نسخ محتوانا بدون إذن',
    s6l4: 'التدخل في عمل الموقع',
    s6l5: 'تقديم معلومات كاذبة أو مضللة',
    s6l6: 'انتحال شخصية أي شخص أو كيان',
    s6l7: 'استخدام أنظمة آلية للوصول إلى الموقع',
    s7Title: '7. الملكية الفكرية',
    s7p1: 'جميع المحتويات على PropFirm Scanner، بما في ذلك النصوص والرسومات والشعارات والصور والبرامج، هي ملك لـ PropFirm Scanner ومحمية بقوانين حقوق النشر.',
    s7p2: 'لا يجوز لك استنساخ أو توزيع أو تعديل أي محتوى بدون إذن كتابي منا.',
    s8Title: '8. روابط الطرف الثالث',
    s8p1: 'يحتوي موقعنا على روابط لمواقع طرف ثالث. نحن غير مسؤولين عن محتوى أو ممارسات هذه المواقع. تصل إليها على مسؤوليتك الخاصة.',
    s9Title: '9. تحديد المسؤولية',
    s9p1: 'إلى أقصى حد يسمح به القانون، لن يكون PropFirm Scanner مسؤولاً عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية، بما في ذلك:',
    s9l1: 'خسارة الأرباح أو الإيرادات',
    s9l2: 'فقدان البيانات',
    s9l3: 'خسائر التداول',
    s9l4: 'تحديات prop firms الفاشلة',
    s9l5: 'أي خسائر غير ملموسة أخرى',
    s9p2: 'ينطبق هذا التحديد بغض النظر عن أساس المسؤولية.',
    s10Title: '10. التعويض',
    s10p1: 'توافق على تعويض PropFirm Scanner وإبراء ذمته من أي مطالبات وخسائر وأضرار ناشئة عن استخدامك للموقع أو انتهاك هذه الشروط.',
    s11Title: '11. التعديلات',
    s11p1: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنخطرك بالتغييرات الجوهرية. استمرارك في الاستخدام يعني القبول.',
    s12Title: '12. الإنهاء',
    s12p1: 'يجوز لنا إنهاء أو تعليق وصولك إلى الموقع فورًا، دون إشعار مسبق، لأي سبب، بما في ذلك انتهاك هذه الشروط.',
    s13Title: '13. القانون المعمول به',
    s13p1: 'تخضع هذه الشروط للقوانين المعمول بها.',
    s14Title: '14. اتصل بنا',
    s14p1: 'إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، اتصل بنا:',
    email: 'البريد الإلكتروني',
    website: 'الموقع',
  },
  hi: {
    title: 'सेवा की शर्तें',
    lastUpdated: 'अंतिम अपडेट: 1 जनवरी 2026',
    s1Title: '1. शर्तों की स्वीकृति',
    s1p1: 'PropFirm Scanner (www.propfirmscanner.org) तक पहुंच या उपयोग करके, आप इन सेवा शर्तों से बंधे होने के लिए सहमत हैं। यदि आप सहमत नहीं हैं, तो आपको वेबसाइट तक पहुंचने की अनुमति नहीं है।',
    s2Title: '2. सेवा का विवरण',
    s2p1: 'PropFirm Scanner प्रॉप ट्रेडिंग फर्मों के लिए एक जानकारी और तुलना प्लेटफॉर्म है। हम प्रदान करते हैं:',
    s2l1: 'प्रॉप फर्मों के लिए तुलना उपकरण',
    s2l2: 'प्रॉप फर्मों की समीक्षाएं और विश्लेषण',
    s2l3: 'प्रॉप ट्रेडिंग के बारे में शैक्षिक सामग्री',
    s2l4: 'छूट कोड और प्रचार ऑफर',
    s2l5: 'ट्रेडिंग टूल्स (रिस्क कैलकुलेटर, रूल ट्रैकर)',
    s3Title: '3. महत्वपूर्ण अस्वीकरण',
    s3h1: 'वित्तीय सलाह नहीं',
    s3p1: 'PropFirm Scanner पर प्रदान की गई जानकारी केवल सामान्य सूचनात्मक उद्देश्यों के लिए है। इसे वित्तीय या निवेश सलाह नहीं माना जाना चाहिए। हमेशा अपना खुद का शोध करें।',
    s3h2: 'कोई गारंटी नहीं',
    s3p2: 'हम जानकारी की सटीकता या पूर्णता की गारंटी नहीं देते। प्रॉप फर्म के नियम और कीमतें बार-बार बदलती हैं। हमेशा प्रॉप फर्म से सीधे सत्यापित करें।',
    s3h3: 'ट्रेडिंग जोखिम',
    s3p3: 'वित्तीय बाजारों में ट्रेडिंग में पर्याप्त नुकसान का जोखिम होता है। पिछला प्रदर्शन भविष्य के परिणामों का संकेत नहीं है। केवल उतने पैसे से ट्रेड करें जो आप खोने का जोखिम उठा सकते हैं।',
    s4Title: '4. एफिलिएट संबंध',
    s4p1: 'PropFirm Scanner विभिन्न प्रॉप फर्मों के साथ एफिलिएट प्रोग्राम में भाग लेता है। हम बिना अतिरिक्त लागत के कमीशन प्राप्त कर सकते हैं।',
    s4p2: 'हमारे एफिलिएट संबंध हमारी समीक्षाओं या रैंकिंग को प्रभावित नहीं करते। हम ईमानदार, निष्पक्ष जानकारी प्रदान करने का प्रयास करते हैं।',
    s5Title: '5. यूजर अकाउंट',
    s5p1: 'अकाउंट बनाते समय, आपको सटीक और पूर्ण जानकारी प्रदान करनी होगी। आप अपने पासवर्ड की सुरक्षा और अपने अकाउंट के तहत होने वाली किसी भी गतिविधि के लिए जिम्मेदार हैं।',
    s5p2: 'आप अपने अकाउंट तक किसी भी अनधिकृत पहुंच के बारे में हमें तुरंत सूचित करने के लिए सहमत हैं।',
    s6Title: '6. स्वीकार्य उपयोग',
    s6p1: 'आप सहमत हैं कि नहीं करेंगे:',
    s6l1: 'साइट को अवैध उद्देश्यों के लिए उपयोग करना',
    s6l2: 'हमारे सिस्टम तक अनधिकृत पहुंच का प्रयास करना',
    s6l3: 'बिना अनुमति के हमारी सामग्री कॉपी करना',
    s6l4: 'साइट के उचित कार्य में हस्तक्षेप करना',
    s6l5: 'झूठी या भ्रामक जानकारी जमा करना',
    s6l6: 'किसी व्यक्ति या संस्था का प्रतिरूपण करना',
    s6l7: 'साइट तक पहुंचने के लिए स्वचालित सिस्टम का उपयोग करना',
    s7Title: '7. बौद्धिक संपदा',
    s7p1: 'PropFirm Scanner पर सभी सामग्री, जिसमें टेक्स्ट, ग्राफिक्स, लोगो, इमेज और सॉफ्टवेयर शामिल हैं, PropFirm Scanner की संपत्ति है और कॉपीराइट कानूनों द्वारा संरक्षित है।',
    s7p2: 'आप हमारी लिखित अनुमति के बिना किसी भी सामग्री को पुनः प्रस्तुत, वितरित या संशोधित नहीं कर सकते।',
    s8Title: '8. तृतीय-पक्ष लिंक',
    s8p1: 'हमारी साइट में तृतीय-पक्ष वेबसाइटों के लिंक हैं। हम इन साइटों की सामग्री या प्रथाओं के लिए जिम्मेदार नहीं हैं। आप अपने जोखिम पर उन तक पहुंचते हैं।',
    s9Title: '9. दायित्व की सीमा',
    s9p1: 'कानून द्वारा अनुमत अधिकतम सीमा तक, PropFirm Scanner किसी भी अप्रत्यक्ष, आकस्मिक, विशेष या परिणामी हानि के लिए उत्तरदायी नहीं होगा, जिसमें शामिल हैं:',
    s9l1: 'लाभ या राजस्व का नुकसान',
    s9l2: 'डेटा का नुकसान',
    s9l3: 'ट्रेडिंग नुकसान',
    s9l4: 'असफल प्रॉप फर्म चैलेंज',
    s9l5: 'कोई अन्य अमूर्त नुकसान',
    s9p2: 'यह सीमा दायित्व के आधार की परवाह किए बिना लागू होती है।',
    s10Title: '10. क्षतिपूर्ति',
    s10p1: 'आप PropFirm Scanner को साइट के आपके उपयोग या इन शर्तों के उल्लंघन से उत्पन्न किसी भी दावे, हानि और नुकसान से क्षतिपूर्ति और हानिरहित रखने के लिए सहमत हैं।',
    s11Title: '11. संशोधन',
    s11p1: 'हम किसी भी समय इन शर्तों को संशोधित करने का अधिकार सुरक्षित रखते हैं। हम महत्वपूर्ण परिवर्तनों के बारे में आपको सूचित करेंगे। आपका निरंतर उपयोग स्वीकृति माना जाएगा।',
    s12Title: '12. समाप्ति',
    s12p1: 'हम किसी भी कारण से, बिना पूर्व सूचना के, तुरंत साइट तक आपकी पहुंच को समाप्त या निलंबित कर सकते हैं, जिसमें इन शर्तों का उल्लंघन शामिल है।',
    s13Title: '13. लागू कानून',
    s13p1: 'ये शर्तें लागू कानूनों द्वारा शासित और व्याख्यायित होंगी।',
    s14Title: '14. हमसे संपर्क करें',
    s14p1: 'यदि आपके पास इन सेवा शर्तों के बारे में कोई प्रश्न हैं, तो संपर्क करें:',
    email: 'ईमेल',
    website: 'वेबसाइट',
  },
};

export default function TermsOfServicePage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.lastUpdated}</p>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s1Title}</h2>
            <p className="text-gray-300">{t.s1p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s2Title}</h2>
            <p className="text-gray-300 mb-4">{t.s2p1}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t.s2l1}</li>
              <li>{t.s2l2}</li>
              <li>{t.s2l3}</li>
              <li>{t.s2l4}</li>
              <li>{t.s2l5}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s3Title}</h2>
            <h3 className="text-xl font-medium text-white mb-3">{t.s3h1}</h3>
            <p className="text-gray-300 mb-4">{t.s3p1}</p>
            <h3 className="text-xl font-medium text-white mb-3">{t.s3h2}</h3>
            <p className="text-gray-300 mb-4">{t.s3p2}</p>
            <h3 className="text-xl font-medium text-white mb-3">{t.s3h3}</h3>
            <p className="text-gray-300">{t.s3p3}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s4Title}</h2>
            <p className="text-gray-300 mb-4">{t.s4p1}</p>
            <p className="text-gray-300">{t.s4p2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s5Title}</h2>
            <p className="text-gray-300 mb-4">{t.s5p1}</p>
            <p className="text-gray-300">{t.s5p2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s6Title}</h2>
            <p className="text-gray-300 mb-4">{t.s6p1}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t.s6l1}</li>
              <li>{t.s6l2}</li>
              <li>{t.s6l3}</li>
              <li>{t.s6l4}</li>
              <li>{t.s6l5}</li>
              <li>{t.s6l6}</li>
              <li>{t.s6l7}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s7Title}</h2>
            <p className="text-gray-300 mb-4">{t.s7p1}</p>
            <p className="text-gray-300">{t.s7p2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s8Title}</h2>
            <p className="text-gray-300">{t.s8p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s9Title}</h2>
            <p className="text-gray-300 mb-4">{t.s9p1}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t.s9l1}</li>
              <li>{t.s9l2}</li>
              <li>{t.s9l3}</li>
              <li>{t.s9l4}</li>
              <li>{t.s9l5}</li>
            </ul>
            <p className="text-gray-300 mt-4">{t.s9p2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s10Title}</h2>
            <p className="text-gray-300">{t.s10p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s11Title}</h2>
            <p className="text-gray-300">{t.s11p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s12Title}</h2>
            <p className="text-gray-300">{t.s12p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s13Title}</h2>
            <p className="text-gray-300">{t.s13p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s14Title}</h2>
            <p className="text-gray-300">{t.s14p1}</p>
            <p className="text-gray-300 mt-4">
              <strong>{t.email}:</strong> legal@propfirmscanner.org<br />
              <strong>{t.website}:</strong> www.propfirmscanner.org
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
