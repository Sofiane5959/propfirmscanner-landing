'use client'

// =============================================================================
// PAGE FIRME UNIVERSELLE            components/prop-firm/profile/FirmProfilePage
// =============================================================================
// Le composant final de toutes les fiches firme. Grammaire visuelle de la fiche
// Earn2Trade (jetons du site), donnees et configurateur de la fiche universelle.
// Il ne recoit que la fiche d'une firme (data/firms/<slug>.json, generee depuis
// son tableur) : aucune branche sur un slug, aucun texte metier.
//
// Ordre : hero · known for · quick information · configurator · comparison ·
// rules by phase · modules optionnels · conditions · about · strengths ·
// verdict · FAQ · final CTA.
//
// Tant que le pilote n'est pas valide, UniversalFirmPage et l'ancien rendu
// restent en place pour le retour arriere (data/firms/rollout.ts).
// =============================================================================

import type { FirmSheet } from '@/lib/firm-sheet'
import { buildAffiliateUrl } from '@/lib/affiliate'
import { AccountConfigurator, ProgramComparison } from './AccountConfigurator'
import {
  AboutSection,
  ConditionsSection,
  FaqSection,
  FinalCta,
  MobileBar,
  OptionalModules,
  StrengthsSection,
  VerdictSection,
} from './ContentSections'
import { CommercialCard, HeroSection } from './HeroSection'
import { KnownForStrip, QuickInfoStrip } from './InfoStrips'
import { RulesByPhase } from './RulesByPhase'
import { useFirmSelection } from './useFirmSelection'

export default function FirmProfilePage({
  sheet,
  firmSlug,
  locale,
  rating = null,
}: {
  sheet: FirmSheet
  firmSlug: string
  locale: string
  /** Note Trustpilot, lue en base : elle bouge sans la fiche. */
  rating?: number | null
}) {
  const sel = useFirmSelection(sheet)

  // Tous les liens sortants passent par /api/go, avec l'option d'achat choisie.
  const lien = (placement: string) =>
    buildAffiliateUrl(firmSlug, {
      placement,
      locale,
      optKey: sel.optionTransmise?.parametre ?? null,
      optValue: sel.optionTransmise?.valeur ?? null,
    })

  return (
    <div className="bg-bg-base pb-24 font-sans text-text-primary lg:pb-0">
      <HeroSection
        sheet={sheet}
        rating={rating}
        logoHref={lien('logo')}
        carte={<CommercialCard sheet={sheet} promo={sel.promo} rating={rating} ctaHref={lien('hero')} />}
      />
      <KnownForStrip sheet={sheet} />
      <QuickInfoStrip sheet={sheet} />
      <AccountConfigurator sheet={sheet} sel={sel} ctaHref={lien('configurator')} />
      <ProgramComparison sel={sel} />
      <RulesByPhase sel={sel} />
      <OptionalModules sheet={sheet} />
      <ConditionsSection sheet={sheet} />
      <AboutSection sheet={sheet} />
      <StrengthsSection sheet={sheet} />
      <VerdictSection sheet={sheet} />
      <FaqSection sheet={sheet} />
      <FinalCta sheet={sheet} sel={sel} />
      <MobileBar sheet={sheet} sel={sel} ctaHref={lien('mobile_bar')} />
    </div>
  )
}
