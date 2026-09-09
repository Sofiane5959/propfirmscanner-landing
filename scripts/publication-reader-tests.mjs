// =============================================================================
// COMPORTEMENT DES LECTEURS               scripts/publication-reader-tests.mjs
// =============================================================================
//   npm run test:readers
//
// Prouve, sans base, les trois issues de `readActiveFirmPage` — et surtout
// celle qui compte : une version active illisible ne declenche JAMAIS le rendu
// historique.
//
// Le client Supabase est remplace par un double qui rend exactement ce que la
// vraie requete rendrait. Ce n'est pas une simulation du serveur : c'est le
// contrat de PostgREST — `{ data, error }` — et c'est tout ce que le lecteur
// observe.
// =============================================================================

import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dir = mkdtempSync(join(tmpdir(), 'pubread-'))
try {
  execSync(
    `npx tsc lib/publication/read.ts lib/publication/schema.ts --outDir "${dir}" ` +
    `--module esnext --target es2022 --skipLibCheck --noResolve`,
    { stdio: 'pipe' }
  )
} catch {
  // Resolution d'alias attendue en echec ; l'emission a lieu.
}

const chemin = (nom) => {
  for (const c of [join(dir, nom), join(dir, 'publication', nom), join(dir, 'lib', nom)]) {
    if (existsSync(c)) return c
  }
  console.error(`Compilation incomplete : ${nom}`)
  process.exit(1)
}

// `--noResolve` laisse l'alias `@/` tel quel dans l'emission, et Node ne sait
// pas le resoudre. On le remplace par un chemin relatif : le module cible est
// emis a cote.
const fichierRead = chemin('read.js')
writeFileSync(
  fichierRead,
  readFileSync(fichierRead, 'utf8').replace(
    /from ['"]@\/lib\/publication\/([a-z-]+)['"]/g,
    "from './$1.js'"
  ),
  'utf8'
)

const { readActiveFirmPage, readActiveFirmSummaries, readDraftFirmPage, PublicationUnavailableError } =
  await import(pathToFileURL(fichierRead).href)

// -----------------------------------------------------------------------------
// Le double de client. Il rend `{ data, error }`, comme PostgREST.
// -----------------------------------------------------------------------------
function clientQuiRend({ data = null, error = null }) {
  const chaine = {
    select: () => chaine,
    eq: () => chaine,
    in: () => chaine,
    not: () => chaine,
    order: () => chaine,
    limit: () => chaine,
    maybeSingle: async () => ({ data, error }),
    then: (resoudre) => Promise.resolve({ data, error }).then(resoudre),
  }
  return { from: () => chaine }
}

const MODELE = { identity: { slug: 'futureselite', name: 'FuturesElite' }, programs: [] }
const RESUME = { slug: 'futureselite', name: 'FuturesElite' }

const ligne = (surcharge = {}) => ({
  id: 'v-1', firm_slug: 'futureselite', version_number: 1,
  model_schema_version: 1,
  page_model_json: MODELE, summary_model_json: RESUME,
  source_hash: 'sha256:abc', verified_at: '2026-09-07',
  published_at: '2026-09-08T10:00:00Z', status: 'published',
  ...surcharge,
})

const FIRME_AVEC = { slug: 'futureselite', active_page_version_id: 'v-1' }
const FIRME_SANS = { slug: 'futureselite', active_page_version_id: null }

let ok = 0, ko = 0
const cas = (nom, condition, detail = '') => {
  if (condition) { ok++; console.log('  ok    ' + nom) }
  else { ko++; console.log('  ECHEC ' + nom + (detail ? ' — ' + detail : '')) }
}
const titre = (t) => { console.log(''); console.log(t); console.log('-'.repeat(74)) }

// -----------------------------------------------------------------------------
titre('CAS 1 — AUCUNE VERSION ACTIVE : le rendu historique est legitime')
{
  // Aucune requete ne doit meme partir : l'absence d'identifiant se lit sur la
  // ligne de firme deja chargee.
  let requeteFaite = false
  const client = { from: () => { requeteFaite = true; return {} } }
  const r = await readActiveFirmPage(client, FIRME_SANS)
  cas('kind = none', r.kind === 'none', r.kind)
  cas('aucune requete inutile', requeteFaite === false)

  const absent = await readActiveFirmPage(client, { slug: 'ftmo' })
  cas('colonne absente traitee comme aucune version', absent.kind === 'none')
}

// -----------------------------------------------------------------------------
titre('CAS 2 — VERSION VALIDE : elle est servie telle quelle')
{
  const r = await readActiveFirmPage(clientQuiRend({ data: ligne() }), FIRME_AVEC)
  cas('kind = ok', r.kind === 'ok', r.kind ?? r.cause)
  cas('le modele est rendu tel quel, sans reconstruction',
    r.kind === 'ok' && r.version.model === MODELE)
  cas('le resume accompagne le modele',
    r.kind === 'ok' && r.version.summary === RESUME)
  cas('la version de schema est portee',
    r.kind === 'ok' && r.version.modelSchemaVersion === 1)
}

// -----------------------------------------------------------------------------
titre('CAS 3 — VERSION ACTIVE ILLISIBLE : jamais de repli sur le legacy')
{
  // C'est LE test. Chacune de ces situations menait au rendu historique dans
  // la premiere version du lecteur : une fiche publiee serait revenue aux
  // donnees mutables sans un mot.
  const situations = [
    ['erreur de requete', { error: { message: 'timeout' } }, 'query_failed'],
    ['ligne absente', { data: null }, 'version_missing'],
    ['version non publiee', { data: ligne({ status: 'validated' }) }, 'not_published'],
    ['version d une autre firme', { data: ligne({ firm_slug: 'ftmo' }) }, 'firm_mismatch'],
    ['schema inconnu', { data: ligne({ model_schema_version: 2 }) }, 'schema_unsupported'],
    ['schema absent', { data: ligne({ model_schema_version: null }) }, 'schema_unsupported'],
    ['modele vide', { data: ligne({ page_model_json: null }) }, 'payload_invalid'],
    ['modele sans identite', { data: ligne({ page_model_json: {} }) }, 'payload_invalid'],
    ['resume absent', { data: ligne({ summary_model_json: null }) }, 'payload_invalid'],
  ]

  for (const [nom, reponse, causeAttendue] of situations) {
    const r = await readActiveFirmPage(clientQuiRend(reponse), FIRME_AVEC)
    cas(`${nom} -> unreadable (${causeAttendue})`,
      r.kind === 'unreadable' && r.cause === causeAttendue,
      `${r.kind}${r.cause ? '/' + r.cause : ''}`)
  }

  // La propriete generale, enoncee une fois : AUCUNE situation ne rend `none`
  // quand un identifiant actif existe. `none` est la seule valeur qui autorise
  // le rendu historique.
  const toutes = await Promise.all(
    situations.map(([, reponse]) => readActiveFirmPage(clientQuiRend(reponse), FIRME_AVEC))
  )
  cas('aucune situation illisible ne rend « none »',
    toutes.every((r) => r.kind !== 'none'))
  cas('chaque echec nomme la firme et la version',
    toutes.every((r) => r.firmSlug === 'futureselite' && r.versionId === 'v-1'))

  // L'erreur portee a l'appelant doit etre exploitable dans une trace.
  const erreur = new PublicationUnavailableError(toutes[0])
  cas('l erreur porte la cause', erreur.cause === 'query_failed')
  cas('l erreur nomme la firme', erreur.message.includes('futureselite'))
  cas('l erreur dit qu il n y a pas de repli',
    /ne revient pas aux donnees mutables/.test(erreur.message))
}

// -----------------------------------------------------------------------------
titre('CAS 4 — LES RESUMES : une firme illisible est signalee, pas oubliee')
{
  const rangee = (slug, v) => ({ slug, active_page_version_id: 'x', firm_page_versions: v })

  const r = await readActiveFirmSummaries(
    clientQuiRend({
      data: [
        rangee('futureselite', ligne()),
        rangee('nitro-firm', ligne({ firm_slug: 'nitro-firm', model_schema_version: 9 })),
        rangee('sans-version', null),
      ],
    }),
    ['futureselite', 'nitro-firm', 'sans-version']
  )
  cas('la firme valide est resumee', r.summaries.has('futureselite'))
  cas('le schema inconnu est signale illisible', r.unreadable.includes('nitro-firm'))
  cas('la version manquante est signalee illisible', r.unreadable.includes('sans-version'))
  cas('une firme illisible n est pas resumee', !r.summaries.has('nitro-firm'))

  // Une requete en echec ne dit pas « aucune firme migree » : elle ne dit rien.
  // Sans cela, l'appelant completerait tout depuis la donnee vivante et le
  // repli silencieux reviendrait par la porte des listes.
  const panne = await readActiveFirmSummaries(
    clientQuiRend({ error: { message: 'timeout' } }), ['a', 'b'])
  cas('une requete en panne declare tout illisible',
    panne.unreadable.length === 2 && panne.summaries.size === 0)
}

// -----------------------------------------------------------------------------
titre('CAS 5 — PREVISUALISATION : memes refus que la production')
{
  let leve = false
  try {
    await readDraftFirmPage(clientQuiRend({ data: [ligne()] }), 'futureselite', { isServiceRole: false })
  } catch { leve = true }
  cas('un client non-service est refuse', leve)

  const brouillon = await readDraftFirmPage(
    clientQuiRend({ data: [ligne({ status: 'draft' })] }), 'futureselite', { isServiceRole: true })
  cas('un brouillon est lisible en previsualisation', brouillon.kind === 'ok')

  const mauvaisSchema = await readDraftFirmPage(
    clientQuiRend({ data: [ligne({ status: 'draft', model_schema_version: 7 })] }),
    'futureselite', { isServiceRole: true })
  cas('un schema inconnu est refuse en previsualisation AUSSI',
    mauvaisSchema.kind === 'unreadable' && mauvaisSchema.cause === 'schema_unsupported')

  const autreFirme = await readDraftFirmPage(
    clientQuiRend({ data: [ligne({ firm_slug: 'ftmo' })] }), 'futureselite', { isServiceRole: true })
  cas('une version d une autre firme est refusee en previsualisation',
    autreFirme.kind === 'unreadable' && autreFirme.cause === 'firm_mismatch')

  const rien = await readDraftFirmPage(clientQuiRend({ data: [] }), 'futureselite', { isServiceRole: true })
  cas('aucune version -> none', rien.kind === 'none')
}

// -----------------------------------------------------------------------------
titre('CAS 6 — LA ROUTE NE RETOMBE PAS SUR LE LEGACY')
{
  const page = readFileSync('app/[locale]/prop-firm/[slug]/page.tsx', 'utf8')
  cas('la route distingue les trois issues',
    /lecture\.kind === 'unreadable'/.test(page) && /lecture\.kind === 'ok'/.test(page))
  cas('une version illisible leve', /throw erreur/.test(page))
  cas('la cause est journalisee avant de lever',
    page.indexOf('console.error') < page.indexOf('throw erreur'))
  cas('le rendu historique n est atteint que par « ok » ou « none »',
    /const versionActive = lecture\.kind === 'ok' \? lecture\.version : null/.test(page))
}

console.log('')
console.log('-'.repeat(74))
console.log(`${ok} reussis, ${ko} echoues`)
process.exit(ko === 0 ? 0 : 1)
