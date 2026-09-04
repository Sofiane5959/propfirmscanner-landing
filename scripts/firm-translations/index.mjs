// =============================================================================
// BUNDLES DE TRADUCTION DES FICHES — scripts/firm-translations/
// =============================================================================
// Un fichier par langue, chacun exportant une table `slug -> bundle`.
//
// Les colonnes de base de `prop_firms` portent l'ANGLAIS. PropFirmPageClient
// superpose `translations[locale]` par-dessus, cle par cle : un bundle partiel
// donne donc du traduit la ou il existe et de l'anglais ailleurs, sans casser
// la page.
//
// Le francais n'est pas ici : il vit dans le bloc `fr` de firm-content.mjs,
// aux cotes du texte anglais qu'il traduit, parce que les deux ont ete ecrits
// ensemble. Les autres langues sont des traductions de ce texte, d'ou leur
// separation.
//
// Ajouter une langue = ajouter un fichier et une ligne ci-dessous.
// `npm run i18n:check` dira aussitot ce qui manque.
// =============================================================================

import { de } from './de.mjs'
import { es } from './es.mjs'
import { pt } from './pt.mjs'
import { ar } from './ar.mjs'
import { hi } from './hi.mjs'

export const BUNDLES = { de, es, pt, ar, hi }
