// =============================================================================
// EMPREINTE DES DONNEES SOURCES                 lib/publication/source-hash.ts
// =============================================================================
// Une version publiee fige un etat. Cette empreinte repond a la seule question
// qui reste ensuite : « la donnee de travail a-t-elle bouge depuis ? »
//
// Elle porte sur les ENTREES — l'enregistrement de firme et ses programmes —
// et non sur le modele construit. Hacher le modele ne dirait rien : deux jeux
// de donnees differents peuvent produire le meme rendu, et surtout une
// evolution du constructeur changerait l'empreinte sans qu'aucune donnee ait
// bouge.
//
// DETERMINISME
//
// Trois sources de bruit sont neutralisees, sans quoi l'empreinte changerait
// toute seule et ne signalerait plus rien :
//
//   1. l'ordre des cles d'objet     -> tri recursif
//   2. l'ordre des lignes           -> tri par identite naturelle
//   3. les colonnes de tenue de     -> liste d'exclusion explicite
//      registre et les UUID
//
// Le point 3 merite d'etre justifie. `updated_at` bouge au moindre UPDATE,
// meme quand le contenu est identique. Les UUID de `firm_programs` et
// `firm_program_plans` sont regeneres a chaque `delete` + `insert` : rejouer
// `RUN-futureselite-programs.sql` a l'identique produirait donc une derive
// fantome. L'empreinte porte sur le CONTENU, identifie par sa cle naturelle
// (slug de programme, phase, taille, variante), pas sur la ligne physique.
// =============================================================================

import { createHash } from 'node:crypto'

/**
 * Colonnes ignorees.
 *
 * `data_verified_at` et `verified_at` n'y sont PAS : une date de verification
 * est un fait editorial, et sa modification doit bien produire une nouvelle
 * version.
 */
const IGNOREES = new Set([
  'id',
  'program_id',
  'created_at',
  'updated_at',
  'last_updated',
  'active_page_version_id',
])

/** Cles candidates pour ordonner un tableau de lignes, dans cet ordre. */
const CLES_DE_TRI = [
  'firm_slug', 'slug', 'program_slug', 'market', 'phase',
  'variant_key', 'account_size', 'code', 'name', 'title', 'category',
]

function canonique(valeur: unknown): unknown {
  if (valeur === null || valeur === undefined) return null

  // Une date est normalisee en ISO : selon le pilote, la meme valeur arrive en
  // `Date` ou en chaine, et les deux doivent donner la meme empreinte.
  if (valeur instanceof Date) return valeur.toISOString()

  if (Array.isArray(valeur)) {
    const elements = valeur.map(canonique)
    // Un tableau de lignes n'a pas d'ordre significatif : PostgREST ne
    // garantit rien sans `order by`. Un tableau de scalaires, si — l'ordre des
    // plateformes est un choix editorial.
    const objets = elements.every((e) => e !== null && typeof e === 'object' && !Array.isArray(e))
    if (!objets) return elements
    // Le tri doit etre TOTAL, jamais seulement « suffisant ». Les 25 lignes de
    // `firm_program_bundles` ne portent que `program_slug` parmi les cles
    // naturelles connues : cinq d'entre elles se retrouvaient donc ex aequo, et
    // un tri stable leur laissait l'ordre d'ARRIVEE. Deux lectures de la meme
    // table dans un ordre different donnaient alors deux empreintes.
    //
    // La serialisation canonique de la ligne — cles deja triees — sert donc de
    // departage. Elle est unique par definition et ne demande d'enumerer
    // aucune colonne, donc une table ajoutee demain est couverte sans y penser.
    return elements
      .map((e) => ({
        e,
        naturelle: cleDeTri(e as Record<string, unknown>),
        // La ligne est deja canonique ici : ses cles sont triees, donc sa
        // serialisation est stable.
        complete: JSON.stringify(e),
      }))
      .sort((a, b) =>
        a.naturelle < b.naturelle ? -1
        : a.naturelle > b.naturelle ? 1
        : a.complete < b.complete ? -1
        : a.complete > b.complete ? 1
        : 0
      )
      .map((x) => x.e)
  }

  if (typeof valeur === 'object') {
    const entrees = Object.entries(valeur as Record<string, unknown>)
      .filter(([cle]) => !IGNOREES.has(cle))
      .map(([cle, v]) => [cle, canonique(v)] as const)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    const sortie: Record<string, unknown> = {}
    for (const [cle, v] of entrees) sortie[cle] = v
    return sortie
  }

  // `-0` et `0` doivent donner la meme chaine.
  if (typeof valeur === 'number' && Object.is(valeur, -0)) return 0

  return valeur
}

function cleDeTri(ligne: Record<string, unknown>): string {
  const morceaux = CLES_DE_TRI
    .filter((c) => ligne[c] !== undefined && ligne[c] !== null)
    .map((c) => `${c}=${String(ligne[c])}`)
  // Vide quand la ligne ne porte aucune cle connue : le departage par
  // serialisation, ajoute par l'appelant, suffit alors a ordonner.
  return morceaux.join('|')
}

/** La forme canonique, lisible. Utile pour diagnostiquer une derive. */
export function canonicalSourceJson(firm: unknown, programData: unknown): string {
  return JSON.stringify(canonique({ firm, programData }), null, 0)
}

/**
 * L'empreinte. `sha256:` en prefixe pour qu'un changement d'algorithme reste
 * lisible dans les lignes deja ecrites.
 */
export function sourceHash(firm: unknown, programData: unknown): string {
  const somme = createHash('sha256').update(canonicalSourceJson(firm, programData), 'utf8').digest('hex')
  return `sha256:${somme}`
}
