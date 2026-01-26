'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Mail, Send, CheckCircle, Loader2, AlertCircle,
  MessageSquare, Clock, MapPin, HelpCircle
} from 'lucide-react'

// =============================================================================
// LOCALE DETECTION & TRANSLATIONS
// =============================================================================

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
    title: 'Contact Us',
    subtitle: "Have a question, suggestion, or found an error? We'd love to hear from you.",
    getInTouch: 'Get in Touch',
    email: 'Email',
    responseTime: 'Response Time',
    responseTimeValue: 'Within 24-48 hours',
    location: 'Location',
    locationValue: 'Remote / Worldwide',
    quickLinks: 'Quick Links',
    faqLink: '→ Frequently Asked Questions',
    verifyLink: '→ How We Verify Data',
    moneyLink: '→ How We Make Money',
    name: 'Name',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    subject: 'Subject',
    selectSubject: 'Select a subject...',
    message: 'Message',
    messagePlaceholder: 'How can we help you?',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    messageSent: 'Message Sent!',
    thankYou: "Thanks for reaching out. We'll get back to you within 24-48 hours.",
    sendAnother: 'Send Another Message',
    fillAllFields: 'Please fill in all fields',
    validEmail: 'Please enter a valid email address',
    somethingWrong: 'Something went wrong. Please try again.',
    // Subjects
    subGeneral: 'General Inquiry',
    subReport: 'Report Incorrect Data',
    subSuggest: 'Suggest a Prop Firm',
    subPartner: 'Partnership / Business',
    subBug: 'Report a Bug',
    subOther: 'Other',
  },
  fr: {
    title: 'Contactez-nous',
    subtitle: 'Une question, suggestion ou erreur trouvée ? Nous aimerions avoir de vos nouvelles.',
    getInTouch: 'Nous Contacter',
    email: 'Email',
    responseTime: 'Temps de Réponse',
    responseTimeValue: 'Sous 24-48 heures',
    location: 'Localisation',
    locationValue: 'À distance / Mondial',
    quickLinks: 'Liens Rapides',
    faqLink: '→ Questions Fréquentes',
    verifyLink: '→ Comment Nous Vérifions les Données',
    moneyLink: '→ Comment Nous Gagnons de l\'Argent',
    name: 'Nom',
    namePlaceholder: 'Votre nom',
    emailPlaceholder: 'votre@email.com',
    subject: 'Sujet',
    selectSubject: 'Sélectionnez un sujet...',
    message: 'Message',
    messagePlaceholder: 'Comment pouvons-nous vous aider ?',
    sendMessage: 'Envoyer le Message',
    sending: 'Envoi en cours...',
    messageSent: 'Message Envoyé !',
    thankYou: 'Merci de nous avoir contactés. Nous vous répondrons sous 24-48 heures.',
    sendAnother: 'Envoyer un Autre Message',
    fillAllFields: 'Veuillez remplir tous les champs',
    validEmail: 'Veuillez entrer une adresse email valide',
    somethingWrong: 'Une erreur s\'est produite. Veuillez réessayer.',
    subGeneral: 'Demande Générale',
    subReport: 'Signaler des Données Incorrectes',
    subSuggest: 'Suggérer une Prop Firm',
    subPartner: 'Partenariat / Business',
    subBug: 'Signaler un Bug',
    subOther: 'Autre',
  },
  de: {
    title: 'Kontaktieren Sie uns',
    subtitle: 'Haben Sie eine Frage, einen Vorschlag oder einen Fehler gefunden? Wir würden gerne von Ihnen hören.',
    getInTouch: 'Kontakt Aufnehmen',
    email: 'E-Mail',
    responseTime: 'Antwortzeit',
    responseTimeValue: 'Innerhalb von 24-48 Stunden',
    location: 'Standort',
    locationValue: 'Remote / Weltweit',
    quickLinks: 'Schnelllinks',
    faqLink: '→ Häufig Gestellte Fragen',
    verifyLink: '→ Wie Wir Daten Verifizieren',
    moneyLink: '→ Wie Wir Geld Verdienen',
    name: 'Name',
    namePlaceholder: 'Ihr Name',
    emailPlaceholder: 'ihre@email.de',
    subject: 'Betreff',
    selectSubject: 'Betreff auswählen...',
    message: 'Nachricht',
    messagePlaceholder: 'Wie können wir Ihnen helfen?',
    sendMessage: 'Nachricht Senden',
    sending: 'Wird gesendet...',
    messageSent: 'Nachricht Gesendet!',
    thankYou: 'Danke für Ihre Nachricht. Wir melden uns innerhalb von 24-48 Stunden.',
    sendAnother: 'Weitere Nachricht Senden',
    fillAllFields: 'Bitte füllen Sie alle Felder aus',
    validEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    somethingWrong: 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
    subGeneral: 'Allgemeine Anfrage',
    subReport: 'Fehlerhafte Daten Melden',
    subSuggest: 'Prop Firm Vorschlagen',
    subPartner: 'Partnerschaft / Business',
    subBug: 'Bug Melden',
    subOther: 'Sonstiges',
  },
  es: {
    title: 'Contáctanos',
    subtitle: '¿Tienes una pregunta, sugerencia o encontraste un error? Nos encantaría saber de ti.',
    getInTouch: 'Ponte en Contacto',
    email: 'Email',
    responseTime: 'Tiempo de Respuesta',
    responseTimeValue: 'Dentro de 24-48 horas',
    location: 'Ubicación',
    locationValue: 'Remoto / Mundial',
    quickLinks: 'Enlaces Rápidos',
    faqLink: '→ Preguntas Frecuentes',
    verifyLink: '→ Cómo Verificamos los Datos',
    moneyLink: '→ Cómo Ganamos Dinero',
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailPlaceholder: 'tu@email.com',
    subject: 'Asunto',
    selectSubject: 'Selecciona un asunto...',
    message: 'Mensaje',
    messagePlaceholder: '¿Cómo podemos ayudarte?',
    sendMessage: 'Enviar Mensaje',
    sending: 'Enviando...',
    messageSent: '¡Mensaje Enviado!',
    thankYou: 'Gracias por contactarnos. Te responderemos en 24-48 horas.',
    sendAnother: 'Enviar Otro Mensaje',
    fillAllFields: 'Por favor completa todos los campos',
    validEmail: 'Por favor ingresa un email válido',
    somethingWrong: 'Algo salió mal. Por favor intenta de nuevo.',
    subGeneral: 'Consulta General',
    subReport: 'Reportar Datos Incorrectos',
    subSuggest: 'Sugerir una Prop Firm',
    subPartner: 'Asociación / Negocios',
    subBug: 'Reportar un Bug',
    subOther: 'Otro',
  },
  pt: {
    title: 'Entre em Contato',
    subtitle: 'Tem uma pergunta, sugestão ou encontrou um erro? Adoraríamos ouvir você.',
    getInTouch: 'Entre em Contato',
    email: 'Email',
    responseTime: 'Tempo de Resposta',
    responseTimeValue: 'Dentro de 24-48 horas',
    location: 'Localização',
    locationValue: 'Remoto / Mundial',
    quickLinks: 'Links Rápidos',
    faqLink: '→ Perguntas Frequentes',
    verifyLink: '→ Como Verificamos os Dados',
    moneyLink: '→ Como Ganhamos Dinheiro',
    name: 'Nome',
    namePlaceholder: 'Seu nome',
    emailPlaceholder: 'seu@email.com',
    subject: 'Assunto',
    selectSubject: 'Selecione um assunto...',
    message: 'Mensagem',
    messagePlaceholder: 'Como podemos ajudar?',
    sendMessage: 'Enviar Mensagem',
    sending: 'Enviando...',
    messageSent: 'Mensagem Enviada!',
    thankYou: 'Obrigado pelo contato. Responderemos em 24-48 horas.',
    sendAnother: 'Enviar Outra Mensagem',
    fillAllFields: 'Por favor preencha todos os campos',
    validEmail: 'Por favor insira um email válido',
    somethingWrong: 'Algo deu errado. Por favor tente novamente.',
    subGeneral: 'Consulta Geral',
    subReport: 'Reportar Dados Incorretos',
    subSuggest: 'Sugerir uma Prop Firm',
    subPartner: 'Parceria / Negócios',
    subBug: 'Reportar um Bug',
    subOther: 'Outro',
  },
  ar: {
    title: 'اتصل بنا',
    subtitle: 'لديك سؤال أو اقتراح أو وجدت خطأ؟ نحب أن نسمع منك.',
    getInTouch: 'تواصل معنا',
    email: 'البريد الإلكتروني',
    responseTime: 'وقت الاستجابة',
    responseTimeValue: 'خلال 24-48 ساعة',
    location: 'الموقع',
    locationValue: 'عن بُعد / عالمي',
    quickLinks: 'روابط سريعة',
    faqLink: '← الأسئلة الشائعة',
    verifyLink: '← كيف نتحقق من البيانات',
    moneyLink: '← كيف نكسب المال',
    name: 'الاسم',
    namePlaceholder: 'اسمك',
    emailPlaceholder: 'بريدك@example.com',
    subject: 'الموضوع',
    selectSubject: 'اختر موضوعاً...',
    message: 'الرسالة',
    messagePlaceholder: 'كيف يمكننا مساعدتك؟',
    sendMessage: 'إرسال الرسالة',
    sending: 'جاري الإرسال...',
    messageSent: 'تم إرسال الرسالة!',
    thankYou: 'شكراً للتواصل. سنرد عليك خلال 24-48 ساعة.',
    sendAnother: 'إرسال رسالة أخرى',
    fillAllFields: 'يرجى ملء جميع الحقول',
    validEmail: 'يرجى إدخال بريد إلكتروني صالح',
    somethingWrong: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    subGeneral: 'استفسار عام',
    subReport: 'الإبلاغ عن بيانات غير صحيحة',
    subSuggest: 'اقتراح شركة Prop Firm',
    subPartner: 'شراكة / أعمال',
    subBug: 'الإبلاغ عن خطأ',
    subOther: 'أخرى',
  },
  hi: {
    title: 'संपर्क करें',
    subtitle: 'कोई सवाल, सुझाव या त्रुटि मिली? हम आपसे सुनना पसंद करेंगे।',
    getInTouch: 'संपर्क करें',
    email: 'ईमेल',
    responseTime: 'प्रतिक्रिया समय',
    responseTimeValue: '24-48 घंटों के भीतर',
    location: 'स्थान',
    locationValue: 'रिमोट / दुनिया भर में',
    quickLinks: 'त्वरित लिंक',
    faqLink: '→ अक्सर पूछे जाने वाले प्रश्न',
    verifyLink: '→ हम डेटा कैसे सत्यापित करते हैं',
    moneyLink: '→ हम पैसे कैसे कमाते हैं',
    name: 'नाम',
    namePlaceholder: 'आपका नाम',
    emailPlaceholder: 'aap@email.com',
    subject: 'विषय',
    selectSubject: 'विषय चुनें...',
    message: 'संदेश',
    messagePlaceholder: 'हम आपकी कैसे मदद कर सकते हैं?',
    sendMessage: 'संदेश भेजें',
    sending: 'भेजा जा रहा है...',
    messageSent: 'संदेश भेजा गया!',
    thankYou: 'संपर्क करने के लिए धन्यवाद। हम 24-48 घंटों में जवाब देंगे।',
    sendAnother: 'एक और संदेश भेजें',
    fillAllFields: 'कृपया सभी फ़ील्ड भरें',
    validEmail: 'कृपया वैध ईमेल दर्ज करें',
    somethingWrong: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    subGeneral: 'सामान्य पूछताछ',
    subReport: 'गलत डेटा रिपोर्ट करें',
    subSuggest: 'प्रॉप फर्म सुझाएं',
    subPartner: 'साझेदारी / व्यापार',
    subBug: 'बग रिपोर्ट करें',
    subOther: 'अन्य',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPageClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const SUBJECT_OPTIONS = [
    { value: 'general', label: t.subGeneral },
    { value: 'report', label: t.subReport },
    { value: 'suggest', label: t.subSuggest },
    { value: 'partner', label: t.subPartner },
    { value: 'bug', label: t.subBug },
    { value: 'other', label: t.subOther },
  ];

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error')
      setErrorMessage(t.fillAllFields)
      return
    }

    if (!formData.email.includes('@')) {
      setStatus('error')
      setErrorMessage(t.validEmail)
      return
    }

    setStatus('loading')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
      setErrorMessage(t.somethingWrong)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">{t.getInTouch}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{t.email}</div>
                    <a href="mailto:hello@propfirmscanner.org" className="text-gray-400 hover:text-emerald-400 text-sm">
                      hello@propfirmscanner.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{t.responseTime}</div>
                    <div className="text-gray-400 text-sm">{t.responseTimeValue}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{t.location}</div>
                    <div className="text-gray-400 text-sm">{t.locationValue}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                {t.quickLinks}
              </h2>
              <div className="space-y-2">
                <Link href={`/${locale}/faq`} className="block text-gray-400 hover:text-emerald-400 text-sm">
                  {t.faqLink}
                </Link>
                <Link href={`/${locale}/how-we-verify`} className="block text-gray-400 hover:text-emerald-400 text-sm">
                  {t.verifyLink}
                </Link>
                <Link href={`/${locale}/how-we-make-money`} className="block text-gray-400 hover:text-emerald-400 text-sm">
                  {t.moneyLink}
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t.messageSent}</h3>
                  <p className="text-gray-400 mb-6">{t.thankYou}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    {t.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">{t.name} *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.namePlaceholder}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">{t.email} *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.emailPlaceholder}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">{t.subject} *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">{t.selectSubject}</option>
                      {SUBJECT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">{t.message} *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.messagePlaceholder}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.sendMessage}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
