// =============================================================================
// VERSION DU SCHEMA DE MODELE                        lib/publication/schema.ts
// =============================================================================
// `firm_page_versions.page_model_json` est un instantane. Le code qui le rend
// change ; l'instantane, lui, ne change plus jamais. Il faut donc savoir, en
// lisant une ligne ecrite il y a six mois, si le rendu d'aujourd'hui sait
// encore l'interpreter.
//
// Sans ce numero, un champ renomme se manifesterait par un `undefined` au
// milieu d'une fiche : une page a moitie vide, servie sans un mot. Le numero
// transforme cette panne silencieuse en refus explicite.
// =============================================================================

/** Ce que le code ECRIT aujourd'hui. */
export const MODEL_SCHEMA_VERSION = 1

/**
 * Ce que le code sait LIRE, bornes comprises.
 *
 * L'intervalle est volontairement distinct de la version d'ecriture : pendant
 * une migration, le lecteur accepte l'ancienne ET la nouvelle. C'est ce qui
 * permet de republier 350 fiches sans qu'aucune ne tombe entre-temps.
 */
export const MIN_SUPPORTED_SCHEMA = 1
export const MAX_SUPPORTED_SCHEMA = 1

export function isSupportedSchema(version: unknown): version is number {
  return (
    typeof version === 'number' &&
    Number.isInteger(version) &&
    version >= MIN_SUPPORTED_SCHEMA &&
    version <= MAX_SUPPORTED_SCHEMA
  )
}

// -----------------------------------------------------------------------------
// QUAND INCREMENTER, ET QUE FAIRE ENSUITE
// -----------------------------------------------------------------------------
//
// NE PAS incrementer pour un ajout optionnel. Un champ nouveau que le rendu
// sait ignorer quand il manque ne casse aucune version ancienne, et bumper a
// chaque ajout rendrait le numero inutile a force d'etre bruyant.
//
// INCREMENTER des qu'une version ancienne serait mal rendue : champ renomme ou
// supprime, unite changee (0,8 devenu 80), sens modifie, champ devenu
// obligatoire. Le critere n'est pas « le modele a change » mais « une version
// deja ecrite serait desormais mal lue ».
//
// LA MIGRATION, dans cet ordre. Elle ne fait jamais tomber de fiche :
//
//   1. `MODEL_SCHEMA_VERSION = 2`, `MAX_SUPPORTED_SCHEMA = 2`,
//      `MIN_SUPPORTED_SCHEMA` reste a 1 — le lecteur accepte les deux ;
//   2. deployer. Les versions 1 en ligne continuent d'etre servies ;
//   3. republier chaque firme active. Chacune passe en schema 2 a son rythme,
//      par l'activation atomique habituelle ;
//   4. verifier qu'aucune version active ne porte encore le schema 1 :
//        select f.slug, v.model_schema_version
//          from prop_firms f
//          join firm_page_versions v on v.id = f.active_page_version_id
//         where v.model_schema_version < 2;
//   5. seulement alors, `MIN_SUPPORTED_SCHEMA = 2`, et deployer.
//
// L'etape 5 n'est pas une formalite : c'est elle qui empeche le code de
// trainer indefiniment une compatibilite que plus personne ne teste.
//
// Les versions ARCHIVEES en schema 1 deviennent alors illisibles, donc
// irrestaurables. C'est assume : restaurer un instantane que le rendu ne sait
// plus interpreter servirait une page fausse. Le retour en arriere reste
// possible vers toute version dans l'intervalle supporte.
