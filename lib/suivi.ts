// =============================================================================
// LES SIGNAUX DU SITE, COTE VISITEUR                              lib/suivi.ts
// =============================================================================
// Un clic sortant se mesure dans /api/go, parce qu'il passe par nous. Tout ce
// qui se joue AVANT ne laissait aucune trace : un visiteur qui copie un code
// promo puis va payer en tapant l'adresse du partenaire a la main est, pour
// nous, un visiteur qui n'a rien fait.
//
// Cette fonction envoie ces signaux-la. Trois regles :
//   - elle ne bloque jamais l'interface : sendBeacon part en arriere-plan, et
//     l'echec est silencieux ;
//   - elle n'envoie aucun identifiant de visiteur, aucun cookie, rien qui
//     survive a la page. Ce qu'on mesure est « ce geste a eu lieu », pas « qui
//     l'a fait » — donc pas de consentement a demander ;
//   - elle n'envoie que ce que la page connait deja : firme, code, endroit.
//
// Le serveur ajoute le pays et l'empreinte d'IP, comme pour les clics.
// =============================================================================

export type Evenement =
  /** Le visiteur a copie un code promo. Intention d'achat la plus nette avant la sortie. */
  | 'code_copie'
  /** Il a ouvert une fiche firme. Sert de denominateur au taux de sortie. */
  | 'fiche_vue'
  /** Il a change de programme ou de taille dans le configurateur. */
  | 'plan_choisi'

export interface SignalSuivi {
  evenement: Evenement
  firmSlug: string
  /** Le code copie, quand il y en a un. */
  code?: string | null
  /** D'ou vient le geste : hero, configurateur, carte /compare, bandeau… */
  placement: string
  /** Le plan vise, quand la page en connait un. */
  plan?: string | null
  locale?: string | null
}

export function suivre(signal: SignalSuivi): void {
  if (typeof window === 'undefined') return
  try {
    const corps = JSON.stringify({
      ...signal,
      locale: signal.locale ?? document.documentElement.lang ?? null,
      chemin: window.location.pathname,
    })
    // sendBeacon survit a la navigation qui suit le clic : c'est exactement le
    // cas d'usage — le visiteur copie le code et part chez le partenaire.
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/signal', new Blob([corps], { type: 'application/json' }))
      return
    }
    void fetch('/api/signal', {
      method: 'POST',
      body: corps,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* Un signal perdu ne doit jamais casser un bouton. */
  }
}
