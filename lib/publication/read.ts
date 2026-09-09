// =============================================================================
// LECTURE DES VERSIONS PUBLIEES                        lib/publication/read.ts
// =============================================================================
// Ces fonctions ne CONSTRUISENT rien. Elles lisent un JSON deja fige.
//
// C'est le point entier de la couche : reconstruire le modele a chaque requete,
// c'est relire la donnee vivante, et donc pouvoir regresser entre deux visites
// sans que personne n'ait rien publie. Une version active est un contrat —
// elle rend ce qu'elle rendait le jour ou elle a passe la validation.
//
// Aucun appel a `buildFirmPageModel` ici. Si un jour il en apparaissait un, la
// garantie serait perdue en silence.
//
// TROIS ETATS, JAMAIS DEUX
//
// La premiere version de ce fichier rendait `null` aussi bien pour « cette
// firme n'a pas de version » que pour « sa version est illisible ». Les deux
// menaient au rendu historique, et c'etait un defaut grave : une fiche publiee
// serait revenue aux donnees MUTABLES a la premiere lecture ratee, sans un mot.
// Toute la couche existe pour empecher exactement cela.
//
//   `none`        aucun identifiant actif  -> rendu historique legitime
//   `ok`          version lue et supportee -> rendu par la version
//   `unreadable`  identifiant actif mais version absente, incoherente ou de
//                 schema non supporte      -> panne, jamais de repli
// =============================================================================

import type { SupabaseClient } from '@supabase/supabase-js'

import type { FirmPageModel } from '@/lib/firm-page-model'
import type { FirmSummaryModel } from '@/lib/firm-summary-model'
import { isSupportedSchema, MIN_SUPPORTED_SCHEMA, MAX_SUPPORTED_SCHEMA } from '@/lib/publication/schema'

export interface PublishedVersion {
  id: string
  firmSlug: string
  versionNumber: number
  modelSchemaVersion: number
  model: FirmPageModel
  summary: FirmSummaryModel
  sourceHash: string
  verifiedAt: string | null
  publishedAt: string | null
  status: string
}

/** Pourquoi une version active n'a pas pu etre servie. Sert la journalisation. */
export type UnreadableCause =
  | 'query_failed'
  | 'version_missing'
  | 'not_published'
  | 'firm_mismatch'
  | 'schema_unsupported'
  | 'payload_invalid'

export type ActivePageRead =
  | { kind: 'none' }
  | { kind: 'ok'; version: PublishedVersion }
  | { kind: 'unreadable'; cause: UnreadableCause; firmSlug: string; versionId: string; detail: string }

/** Les colonnes lues. `validation_report_json` est volontairement absent :
 *  il pese, et le rendu public n'en a aucun usage. L'admin le lit a part. */
const COLONNES =
  'id, firm_slug, version_number, model_schema_version, page_model_json, summary_model_json, ' +
  'source_hash, verified_at, published_at, status'

interface LigneVersion {
  id: string
  firm_slug: string
  version_number: number
  model_schema_version: number | null
  page_model_json: FirmPageModel | null
  summary_model_json: FirmSummaryModel | null
  source_hash: string
  verified_at: string | null
  published_at: string | null
  status: string
}

function versionDepuisLigne(ligne: LigneVersion): PublishedVersion {
  return {
    id: ligne.id,
    firmSlug: ligne.firm_slug,
    versionNumber: ligne.version_number,
    modelSchemaVersion: ligne.model_schema_version as number,
    model: ligne.page_model_json as FirmPageModel,
    summary: ligne.summary_model_json as FirmSummaryModel,
    sourceHash: ligne.source_hash,
    verifiedAt: ligne.verified_at,
    publishedAt: ligne.published_at,
    status: ligne.status,
  }
}

/**
 * Les controles qu'une ligne doit passer pour etre servie.
 *
 * Partages entre la lecture publique et la previsualisation : une version que
 * le rendu ne saurait pas interpreter doit etre refusee au relecteur AUSSI,
 * sinon la previsualisation validerait ce que la production refusera.
 */
function verifier(
  ligne: LigneVersion,
  attendu: { firmSlug: string; exigePublie: boolean }
): { ok: true } | { ok: false; cause: UnreadableCause; detail: string } {
  if (ligne.firm_slug !== attendu.firmSlug) {
    return {
      ok: false, cause: 'firm_mismatch',
      detail: `la version appartient a « ${ligne.firm_slug} », pas a « ${attendu.firmSlug} »`,
    }
  }
  if (attendu.exigePublie && ligne.status !== 'published') {
    return { ok: false, cause: 'not_published', detail: `statut « ${ligne.status} »` }
  }
  if (!isSupportedSchema(ligne.model_schema_version)) {
    return {
      ok: false, cause: 'schema_unsupported',
      detail:
        `schema de modele ${ligne.model_schema_version ?? 'absent'}, ` +
        `supporte : ${MIN_SUPPORTED_SCHEMA} a ${MAX_SUPPORTED_SCHEMA}`,
    }
  }
  // Un JSON vide ou tronque rendrait une page a moitie construite. Le controle
  // porte sur la racine du modele, pas sur chaque champ : le schema, lui, est
  // la garantie de forme.
  if (!ligne.page_model_json || !ligne.summary_model_json ||
      typeof ligne.page_model_json !== 'object' ||
      !(ligne.page_model_json as FirmPageModel).identity) {
    return { ok: false, cause: 'payload_invalid', detail: 'page_model_json absent ou sans identite' }
  }
  return { ok: true }
}

// -----------------------------------------------------------------------------
// 4. LE LECTEUR DE FICHE
// -----------------------------------------------------------------------------
/**
 * La version active d'une firme.
 *
 * `none` n'est pas une erreur : c'est le cas majoritaire aujourd'hui — 349
 * firmes sur 350 — et il signifie « rendre par le chemin historique ».
 *
 * `unreadable` en est une, et l'appelant DOIT la traiter comme telle. Il n'y a
 * pas de repli : une fiche dont la version active est illisible ne revient
 * jamais aux donnees mutables.
 *
 * La requete part de `prop_firms.active_page_version_id` plutot que de
 * chercher la derniere ligne `published`. Ce n'est pas equivalent : la colonne
 * DECIDE, le statut ne fait que decrire. Chercher « la plus recente publiee »
 * ferait basculer la fiche sur une version que personne n'a activee, ce qui
 * est exactement le comportement dont on sort.
 */
export async function readActiveFirmPage(
  supabase: SupabaseClient,
  firm: { slug: string; active_page_version_id?: string | null }
): Promise<ActivePageRead> {
  if (!firm.active_page_version_id) return { kind: 'none' }

  const versionId = firm.active_page_version_id
  const echec = (cause: UnreadableCause, detail: string): ActivePageRead => ({
    kind: 'unreadable', cause, firmSlug: firm.slug, versionId, detail,
  })

  const { data, error } = await supabase
    .from('firm_page_versions')
    .select(COLONNES)
    .eq('id', versionId)
    .maybeSingle()

  // Une panne de lecture n'autorise PAS le rendu historique. Servir la donnee
  // vivante ici, ce serait perdre la garantie precisement le jour ou elle
  // compte, et le faire sans que personne ne le remarque.
  if (error) return echec('query_failed', error.message)
  if (!data) return echec('version_missing', 'aucune ligne pour cet identifiant')

  const ligne = data as unknown as LigneVersion
  const verdict = verifier(ligne, { firmSlug: firm.slug, exigePublie: true })
  if (!verdict.ok) return echec(verdict.cause, verdict.detail)

  return { kind: 'ok', version: versionDepuisLigne(ligne) }
}

/** L'erreur levee par une fiche dont la version active est illisible. */
export class PublicationUnavailableError extends Error {
  readonly cause: UnreadableCause
  readonly firmSlug: string
  readonly versionId: string

  constructor(lecture: Extract<ActivePageRead, { kind: 'unreadable' }>) {
    super(
      `Version publiee illisible pour « ${lecture.firmSlug} » ` +
      `(${lecture.cause}) : ${lecture.detail}. ` +
      `La fiche ne revient pas aux donnees mutables.`
    )
    this.name = 'PublicationUnavailableError'
    this.cause = lecture.cause
    this.firmSlug = lecture.firmSlug
    this.versionId = lecture.versionId
  }
}

// -----------------------------------------------------------------------------
// 5. LE LECTEUR DE RESUMES
// -----------------------------------------------------------------------------
/**
 * Les resumes figes, pour les surfaces de liste — /compare, /best-for, cartes.
 *
 * Rend AUSSI la liste des firmes dont la version active est illisible. Ce n'est
 * pas un detail d'ergonomie : sans elle, l'appelant completerait ces firmes
 * depuis la donnee vivante en croyant qu'elles ne sont pas migrees, et le repli
 * silencieux reviendrait par la porte des listes apres avoir ete ferme sur la
 * fiche.
 *
 * Prepare, non branche : aucune route ne l'appelle encore.
 */
export async function readActiveFirmSummaries(
  supabase: SupabaseClient,
  slugs: string[]
): Promise<{ summaries: Map<string, FirmSummaryModel>; unreadable: string[] }> {
  const summaries = new Map<string, FirmSummaryModel>()
  const unreadable: string[] = []
  if (slugs.length === 0) return { summaries, unreadable }

  const { data, error } = await supabase
    .from('prop_firms')
    .select(`slug, active_page_version_id, firm_page_versions!prop_firms_active_version_meme_firme_fk(${COLONNES})`)
    .in('slug', slugs)
    .not('active_page_version_id', 'is', null)

  // Une requete en echec ne dit pas « aucune firme migree » : elle ne dit rien.
  // Toutes les firmes demandees sont donc declarees illisibles.
  if (error || !data) return { summaries, unreadable: [...slugs] }

  for (const ligne of data as unknown as {
    slug: string
    firm_page_versions: LigneVersion | LigneVersion[] | null
  }[]) {
    const v = Array.isArray(ligne.firm_page_versions)
      ? ligne.firm_page_versions[0] ?? null
      : ligne.firm_page_versions

    if (!v) { unreadable.push(ligne.slug); continue }

    const verdict = verifier(v, { firmSlug: ligne.slug, exigePublie: true })
    if (!verdict.ok) { unreadable.push(ligne.slug); continue }

    summaries.set(ligne.slug, v.summary_model_json as FirmSummaryModel)
  }
  return { summaries, unreadable }
}

// -----------------------------------------------------------------------------
// 6. PREVISUALISATION
// -----------------------------------------------------------------------------
/**
 * Une version NON publiee, pour relecture avant mise en ligne.
 *
 * DEUX VERROUS, ET C'EST DELIBERE
 *
 *   1. La politique RLS `lecture_publiee` ne laisse sortir que `published`.
 *      Un client anonyme qui appellerait cette fonction recevrait zero ligne,
 *      quel que soit le code applicatif.
 *   2. Le garde ci-dessous refuse un client qui n'est pas de service.
 *
 * Le premier suffirait. Le second existe parce qu'une politique RLS se modifie
 * un jour d'urgence, et qu'un brouillon servi au public serait precisement le
 * genre de regression que cette couche est censee rendre impossible. Deux
 * verrous independants, aucun ne dependant de l'autre.
 *
 * Le controle de schema s'applique ici AUSSI : previsualiser une version que
 * la production refusera serait une relecture trompeuse.
 */
export async function readDraftFirmPage(
  supabase: SupabaseClient,
  slug: string,
  options: { versionNumber?: number; isServiceRole: boolean }
): Promise<
  | { kind: 'ok'; version: PublishedVersion }
  | { kind: 'none' }
  | { kind: 'unreadable'; cause: UnreadableCause; detail: string }
> {
  if (!options.isServiceRole) {
    throw new Error(
      'readDraftFirmPage exige un client de service. Un brouillon ne sort jamais vers un visiteur.'
    )
  }

  let requete = supabase
    .from('firm_page_versions')
    .select(COLONNES)
    .eq('firm_slug', slug)

  if (options.versionNumber != null) {
    requete = requete.eq('version_number', options.versionNumber)
  } else {
    // Sans numero : la plus recente, quel que soit son statut. C'est ce qu'un
    // relecteur veut voir apres avoir prepare une version.
    requete = requete.order('version_number', { ascending: false }).limit(1)
  }

  const { data, error } = await requete
  if (error) return { kind: 'unreadable', cause: 'query_failed', detail: error.message }
  if (!data || data.length === 0) return { kind: 'none' }

  const ligne = data[0] as unknown as LigneVersion
  const verdict = verifier(ligne, { firmSlug: slug, exigePublie: false })
  if (!verdict.ok) return { kind: 'unreadable', cause: verdict.cause, detail: verdict.detail }

  return { kind: 'ok', version: versionDepuisLigne(ligne) }
}

// -----------------------------------------------------------------------------
// DERIVE
// -----------------------------------------------------------------------------
/**
 * L'empreinte figee correspond-elle encore aux donnees de travail ?
 *
 * Ne bloque rien et ne declenche rien : une derive est NORMALE — c'est le
 * travail editorial en cours. Elle signale seulement qu'une republication
 * ferait une difference, et c'est l'information qui manquait jusqu'ici.
 */
export function hasDrifted(version: PublishedVersion, hashActuel: string): boolean {
  return version.sourceHash !== hashActuel
}
