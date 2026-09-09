// =============================================================================
// TRANSACTION DE PUBLICATION                        lib/publication/publish.ts
// =============================================================================
// Le chemin unique par lequel une fiche devient publique :
//
//   donnee canonique modifiable
//     -> FirmPageModel
//     -> FirmSummaryModel
//     -> validation
//     -> version immuable
//     -> activation atomique
//     -> rendu public
//
// Aucune autre porte. `page_model_status` n'en est plus une : c'est une
// metadonnee de migration, et une colonne mutable ne peut pas garantir qu'une
// fiche validee le reste.
//
// CE QUI EST ATOMIQUE, ET CE QUI NE L'EST PAS
//
// L'insertion de la version ne l'est pas, et n'a pas besoin de l'etre : une
// version `validated` n'est servie a personne — la politique RLS ne laisse
// sortir que `published`. Une insertion interrompue laisse une ligne inerte.
//
// L'ACTIVATION, elle, touche deux tables et doit etre indivisible. Elle est
// donc deleguee a `activate_firm_version` (RUN-05), qui s'execute dans la
// transaction implicite de Postgres.
//
// Consequence directe de la regle « ne jamais changer la version active si une
// etape echoue » : tout ce qui peut echouer se produit AVANT l'appel a la
// fonction, et cet appel est la derniere etape.
// =============================================================================

import type { SupabaseClient } from '@supabase/supabase-js'

import { buildFirmPageModel, type FirmPageModel, type FirmRecord } from '@/lib/firm-page-model'
import { validateFirmPageModel, validateCta, type ValidationResult } from '@/lib/validate-firm-page-model'
import { summaryFromPageModel, type FirmSummaryModel } from '@/lib/firm-summary-model'
import { loadFirmPrograms } from '@/lib/firm-programs'
import { buildAffiliateUrl } from '@/lib/affiliate'
import { sourceHash } from '@/lib/publication/source-hash'
import { MODEL_SCHEMA_VERSION } from '@/lib/publication/schema'

export interface PublishOptions {
  /** Construire et valider sans rien ecrire. Le defaut d'un outil d'admin. */
  dryRun?: boolean
  /** Ecrire la version mais ne pas l'activer. Sert la previsualisation. */
  stageOnly?: boolean
  /** Publier malgre des avertissements. N'annule JAMAIS une erreur. */
  acceptWarnings?: boolean
  now?: number
}

export interface PublishResult {
  ok: boolean
  /** L'etape atteinte. Nomme sans ambiguite ou la publication s'est arretee. */
  step: string
  firmSlug: string
  versionId: string | null
  versionNumber: number | null
  previousVersionId: string | null
  sourceHash: string
  validation: ValidationResult
  model: FirmPageModel | null
  summary: FirmSummaryModel | null
  /** Renseigne quand la publication a ete refusee ou a echoue. */
  reason: string | null
}

function echec(
  partiel: { step: string; reason: string; firmSlug: string; sourceHash?: string }
): PublishResult {
  return {
    ok: false,
    versionId: null,
    versionNumber: null,
    previousVersionId: null,
    sourceHash: '',
    validation: { errors: [], warnings: [], notices: [], publishable: false },
    model: null,
    summary: null,
    ...partiel,
  }
}

/**
 * Publie une firme, ou explique pourquoi elle ne l'a pas ete.
 *
 * `actor` est trace dans `created_by` : une version publiee doit pouvoir dire
 * qui l'a mise en ligne, des mois plus tard.
 */
export async function publishFirmVersion(
  supabase: SupabaseClient,
  slug: string,
  actor: string,
  options: PublishOptions = {}
): Promise<PublishResult> {
  const now = options.now ?? Date.now()

  // --- 1. La donnee canonique, telle qu'elle est aujourd'hui -----------------
  // `select('*')` : une colonne encore absente ne doit pas faire echouer la
  // requete entiere. La lecon de `42703` sur `scope_confidence`.
  const { data: firm, error: erreurFirme } = await supabase
    .from('prop_firms').select('*').eq('slug', slug).single()

  if (erreurFirme || !firm) {
    return echec({
      step: '1-lecture-firme',
      firmSlug: slug,
      reason: erreurFirme?.message ?? `Firme « ${slug} » introuvable.`,
    })
  }

  // --- 2. Les programmes normalises -----------------------------------------
  const programData = await loadFirmPrograms(supabase, slug)
  if (!programData || programData.programs.length === 0) {
    return echec({
      step: '2-lecture-programmes',
      firmSlug: slug,
      reason: `Aucun programme normalise pour « ${slug} ». Une version ne peut pas figer une offre absente de la base.`,
    })
  }

  // --- 3. L'empreinte des sources -------------------------------------------
  // Calculee AVANT la construction : elle porte sur les entrees, pas sur le
  // resultat. Voir `source-hash.ts`.
  const hash = sourceHash(firm, programData)

  // --- 4. Le modele detaille -------------------------------------------------
  let model: FirmPageModel
  try {
    model = buildFirmPageModel(firm as unknown as FirmRecord, programData, { now })
  } catch (e) {
    return echec({
      step: '4-construction-modele',
      firmSlug: slug,
      sourceHash: hash,
      reason: `La construction du modele a echoue : ${(e as Error).message}`,
    })
  }

  // --- 5. Le lien sortant ----------------------------------------------------
  // Construit ici et fige dans la version : une carte et une fiche doivent
  // pointer vers le meme tunnel. CLAUDE.md : jamais d'URL partenaire en dur.
  const ctaHref = buildAffiliateUrl(slug, { placement: 'hero', locale: 'en' })

  // --- 6. Le resume ----------------------------------------------------------
  const summary = summaryFromPageModel(model, ctaHref)

  // --- 7. La validation ------------------------------------------------------
  const validation = validateFirmPageModel(model)
  const ctaIssue = validateCta(ctaHref)
  if (ctaIssue) {
    validation.errors.push(ctaIssue)
    validation.publishable = false
  }

  const base = {
    firmSlug: slug,
    sourceHash: hash,
    validation,
    model,
    summary,
    versionId: null as string | null,
    versionNumber: null as number | null,
    previousVersionId: null as string | null,
  }

  // --- 8. Le refus -----------------------------------------------------------
  // Une erreur bloque sans exception possible : `acceptWarnings` ne porte que
  // sur les avertissements. Ouvrir une derogation sur les erreurs viderait la
  // couche de son seul interet.
  if (!validation.publishable) {
    return {
      ...base,
      ok: false,
      step: '8-validation',
      reason:
        `${validation.errors.length} erreur(s) bloquante(s) : ` +
        validation.errors.map((e) => `${e.code} (${e.field})`).join(', '),
    }
  }
  if (validation.warnings.length > 0 && !options.acceptWarnings) {
    return {
      ...base,
      ok: false,
      step: '8-avertissements',
      reason:
        `${validation.warnings.length} avertissement(s) : ` +
        validation.warnings.map((w) => w.code).join(', ') +
        '. Republier avec acceptWarnings pour les assumer explicitement.',
    }
  }

  if (options.dryRun) {
    return { ...base, ok: true, step: '8-validation-seule', reason: null }
  }

  // --- 9. L'ecriture de la version -------------------------------------------
  // `version_number` est laisse absent : le trigger l'attribue, ce qui empeche
  // deux publications simultanees de se donner le meme numero.
  const { data: version, error: erreurInsert } = await supabase
    .from('firm_page_versions')
    .insert({
      firm_slug: slug,
      page_model_json: model,
      summary_model_json: summary,
      validation_report_json: {
        ...validation,
        generatedAt: new Date(now).toISOString(),
        acceptedWarnings: options.acceptWarnings === true,
      },
      source_hash: hash,
      // La forme du JSON qu'on ecrit aujourd'hui. Le lecteur refusera une
      // version hors de l'intervalle qu'il sait interpreter.
      model_schema_version: MODEL_SCHEMA_VERSION,
      verified_at: model.identity.verifiedAt,
      created_by: actor,
      status: 'validated',
    })
    .select('id, version_number')
    .single()

  if (erreurInsert || !version) {
    return {
      ...base,
      ok: false,
      step: '9-ecriture-version',
      reason: erreurInsert?.message ?? 'Insertion sans retour.',
    }
  }

  const ecrite = {
    ...base,
    versionId: version.id as string,
    versionNumber: version.version_number as number,
  }

  // Une version ecrite mais non activee n'est visible de personne : c'est
  // exactement l'etat que la previsualisation consomme.
  if (options.stageOnly) {
    return { ...ecrite, ok: true, step: '9-version-preparee', reason: null }
  }

  // --- 10. L'activation atomique ---------------------------------------------
  // Derniere etape, et seule etape qui change ce que le public voit. Tout ce
  // qui pouvait echouer a deja echoue.
  const { data: activation, error: erreurActivation } = await supabase.rpc(
    'activate_firm_version',
    { p_version_id: version.id, p_actor: actor }
  )

  if (erreurActivation) {
    return {
      ...ecrite,
      ok: false,
      step: '10-activation',
      reason:
        `${erreurActivation.message} — la version ${version.version_number} reste « validated », ` +
        `la version active n'a pas change.`,
    }
  }

  const ligne = Array.isArray(activation) ? activation[0] : activation
  return {
    ...ecrite,
    ok: true,
    step: '10-activation',
    previousVersionId: (ligne?.previous_version_id as string) ?? null,
    reason: null,
  }
}

// -----------------------------------------------------------------------------
// RETOUR EN ARRIERE
// -----------------------------------------------------------------------------
export interface RollbackResult {
  ok: boolean
  restoredId: string | null
  restoredNumber: number | null
  replacedId: string | null
  reason: string | null
}

/**
 * Remet une version anterieure en ligne.
 *
 * Aucune revalidation : la version cible a ete validee quand elle a ete creee,
 * et son rapport est fige avec elle. C'est ce qui rend le retour en arriere
 * immediat — la propriete meme qui manquait quand la page se reconstruisait a
 * chaque requete.
 */
export async function activateFirmVersion(
  supabase: SupabaseClient,
  firmSlug: string,
  versionNumber: number
): Promise<RollbackResult> {
  const { data, error } = await supabase.rpc('rollback_firm_version', {
    p_firm_slug: firmSlug,
    p_version_number: versionNumber,
  })

  if (error) {
    return { ok: false, restoredId: null, restoredNumber: null, replacedId: null, reason: error.message }
  }

  const ligne = Array.isArray(data) ? data[0] : data
  return {
    ok: true,
    restoredId: (ligne?.restored_id as string) ?? null,
    restoredNumber: (ligne?.restored_number as number) ?? versionNumber,
    replacedId: (ligne?.replaced_id as string) ?? null,
    reason: null,
  }
}

/** Retire la firme de la couche de publication : retour au rendu historique. */
export async function deactivateFirm(
  supabase: SupabaseClient,
  firmSlug: string
): Promise<{ ok: boolean; previousVersionId: string | null; reason: string | null }> {
  const { data, error } = await supabase.rpc('deactivate_firm_version', { p_firm_slug: firmSlug })
  if (error) return { ok: false, previousVersionId: null, reason: error.message }
  return { ok: true, previousVersionId: (data as string) ?? null, reason: null }
}
