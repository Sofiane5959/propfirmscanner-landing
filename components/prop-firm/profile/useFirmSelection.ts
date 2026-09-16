'use client'

// La selection commerciale : marche → programme → variante → taille → option
// d'achat. Chaque niveau retombe sur le premier choix valable quand le niveau
// du dessus change : aucune combinaison impossible ne reste affichee.

import { useState } from 'react'

import {
  type FirmSheet,
  type SheetOption,
  type SheetProgramme,
  discounted,
  offerApplies,
  orderedPhases,
  promoSelection,
} from '@/lib/firm-sheet'
import { optionsParType } from '@/lib/firm-profile'

function unique<T>(valeurs: T[]): T[] {
  return Array.from(new Set(valeurs))
}

export interface GroupeOptions {
  type: SheetOption['type']
  options: SheetOption[]
  actif: SheetOption
  choisir: (nom: string) => void
}

export function useFirmSelection(sheet: FirmSheet) {
  const programmes = sheet.programmes.filter((p) => p.plans.length > 0)
  const promo = promoSelection(programmes)

  // Depart : le plan « Most popular plan » quand la fiche en designe un.
  const [marcheKey, setMarche] = useState(promo?.programme.marche ?? programmes[0]?.marche ?? '')
  const [programmeKey, setProgramme] = useState(promo?.programme.slug ?? '')
  const [varianteKey, setVariante] = useState(promo?.plan.variante ?? '')
  const [tailleKey, setTaille] = useState(promo ? String(promo.plan.taille) : '')
  const [phaseKey, setPhase] = useState('')
  const [optionKeys, setOptionKeys] = useState<Partial<Record<SheetOption['type'], string>>>({})

  const marches = unique(programmes.map((p) => p.marche))
  const duMarche = programmes.filter((p) => p.marche === marcheKey)
  const programmesVisibles = duMarche.length > 0 ? duMarche : programmes
  const programme = programmesVisibles.find((p) => p.slug === programmeKey) ?? programmesVisibles[0] ?? null

  const variantes = programme ? unique(programme.plans.map((pl) => pl.variante ?? '')) : []
  const variante = variantes.includes(varianteKey) ? varianteKey : variantes[0] ?? ''
  const plansDeVariante = programme
    ? programme.plans.filter((pl) => (pl.variante ?? '') === variante).sort((a, b) => a.taille - b.taille)
    : []
  const plan = plansDeVariante.find((pl) => String(pl.taille) === tailleKey) ?? plansDeVariante[0] ?? null

  const phases = plan ? orderedPhases(plan.phases) : []
  const phase = phases.find((ph) => ph.phase === phaseKey) ?? phases[0] ?? null

  const groupesOptions: GroupeOptions[] = programme
    ? optionsParType(sheet.optionsAchat, programme.slug).map(([type, options]) => ({
        type,
        options,
        actif: options.find((o) => o.nom === optionKeys[type]) ?? options[0],
        choisir: (nom: string) => setOptionKeys((k) => ({ ...k, [type]: nom })),
      }))
    : []
  // /api/go ne transmet qu'un couple opt_key / opt_value : le data feed d'abord.
  const optionTransmise =
    groupesOptions.find((g) => g.type === 'data_feed')?.actif ?? groupesOptions[0]?.actif ?? null

  const offre = sheet.offre
  const offreAppliquee = Boolean(offre && programme && plan && offerApplies(offre, programme.slug, plan.taille))
  const prixRemise = offre && offreAppliquee && plan?.prix != null ? discounted(plan.prix, offre.remise) : null

  return {
    programmes,
    promo,
    marches,
    marche: programme?.marche ?? '',
    setMarche,
    programmesVisibles,
    programme,
    setProgramme,
    choisirProgramme: (p: SheetProgramme) => {
      setMarche(p.marche)
      setProgramme(p.slug)
    },
    variantes,
    variante,
    setVariante,
    plansDeVariante,
    plan,
    setTaille,
    phases,
    phase,
    setPhase,
    groupesOptions,
    optionTransmise,
    offreAppliquee,
    prixRemise,
  }
}

export type FirmSelection = ReturnType<typeof useFirmSelection>
