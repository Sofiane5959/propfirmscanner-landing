'use client'

// =============================================================================
// PAGE FIRME UNIVERSELLE            components/prop-firm/profile/FirmProfilePage
// =============================================================================
// Contrat visuel : « PropFirmScanner Universal Virgin Template » (HTML fourni
// par Sofiane le 19 septembre 2026). Donnees : la fiche de la firme
// (data/firms/<slug>.json, generee depuis son tableur). Aucune branche sur un
// slug, aucun texte metier.
//
// Ordre : hero · known for · informations · configurator · program comparison ·
// rules by programme and phase · modules optionnels · trading and payout
// conditions · PropFirmScanner verdict · FAQ · CTA final · similar firms.
//
// Toutes les sorties passent par /api/go/[slug] ; chaque bouton a son
// emplacement de suivi.
// =============================================================================

import type { FirmSheet, SimilarFirm } from '@/lib/firm-sheet'
import { buildAffiliateUrl } from '@/lib/affiliate'
import { AccountConfigurator, ProgramComparison } from './AccountConfigurator'
import {
  ConditionsSection,
  FaqSection,
  FinalCta,
  OptionalModules,
  SimilarFirms,
  VerdictSection,
} from './ContentSections'
import { HeroSection } from './HeroSection'
import { InfoCards, KnownForStrip } from './InfoStrips'
import { RulesByPhase } from './RulesByPhase'
import { useFirmSelection } from './useFirmSelection'

export default function FirmProfilePage({
  sheet,
  firmSlug,
  locale,
  similarFirms = [],
}: {
  sheet: FirmSheet
  firmSlug: string
  locale: string
  /** Firmes avec page, lien affilie et code actifs — choisies par la route. */
  similarFirms?: SimilarFirm[]
}) {
  const sel = useFirmSelection(sheet)

  const lien = (placement: string) =>
    buildAffiliateUrl(firmSlug, {
      placement,
      locale,
      optKey: sel.optionTransmise?.parametre ?? null,
      optValue: sel.optionTransmise?.valeur ?? null,
    })

  return (
    <div className="bg-bg-base pb-8 font-sans text-text-primary">
      <HeroSection sheet={sheet} promo={sel.promo} claimHref={lien('hero_claim')} continueHref={lien('hero_continue')} />
      <KnownForStrip sheet={sheet} />
      <InfoCards sheet={sheet} />
      <AccountConfigurator sheet={sheet} sel={sel} continueHref={lien('configurator')} />
      <ProgramComparison sel={sel} />
      <RulesByPhase sel={sel} />
      <OptionalModules sheet={sheet} />
      <ConditionsSection sheet={sheet} sel={sel} />
      <VerdictSection sheet={sheet} />
      <FaqSection sheet={sheet} />
      <FinalCta sheet={sheet} sel={sel} claimHref={lien('final_claim')} continueHref={lien('final_continue')} />
      <SimilarFirms firms={similarFirms} />
    </div>
  )
}
