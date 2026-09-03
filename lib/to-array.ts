/**
 * Normalise une colonne « liste » en tableau de chaines.
 *
 * POURQUOI CE FICHIER EXISTE
 *
 * `platforms` et `challenge_types` sont typees TEXT en Postgres mais declarees
 * `string[]` en TypeScript. TypeScript ne voit donc rien : l'erreur n'apparait
 * qu'au runtime, sur `.map()` ou `.slice().map()`. CLAUDE.md documente deux
 * mises hors service de `/compare` en aout 2026 pour cette raison.
 *
 * Le 3 septembre 2026 c'est arrive une troisieme fois, et le build de
 * production a echoue sur les 21 pages `/compare/ftmo-vs-*` :
 *
 *     TypeError: (e.platforms || []).slice(...).map is not a function
 *
 * La cause n'etait pas l'oubli d'un developpeur distrait : `toArray` etait
 * recopiee a l'identique dans QUATRE fichiers et exportee d'aucun. Les trois
 * consommateurs qui en avaient besoin n'avaient rien a importer. D'ou ce
 * module : une seule definition, importable.
 *
 * FORMATS ACCEPTES — ils coexistent reellement en base :
 *   - un vrai tableau                      ['MT4', 'MT5']
 *   - une liste separee par , ou ;         'MT4, MT5'
 *   - du JSON dans une colonne TEXT        '["MT4","MT5"]'
 *   - un litteral de tableau Postgres      '{"MT4","MT5"}'
 *
 * Le cas JSON n'etait pas gere avant : les fiches ecrites par
 * scripts/build-firm-content.mjs affichaient des puces « MetaTrader 4" » et
 * « ["MetaTrader 4 », guillemets et crochets compris, sur FTMO, The5ers et
 * Hantec Trader.
 */
export function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
  }

  if (typeof value !== 'string') return []

  const raw = value.trim()
  if (!raw) return []

  // JSON stocke dans une colonne TEXT. On ne tente le parse que si la chaine
  // en a la forme, pour ne pas payer un try/catch sur chaque valeur normale.
  if (raw.startsWith('[') && raw.endsWith(']')) {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
          .map((v) => (typeof v === 'string' ? v.trim() : ''))
          .filter((v) => v.length > 0)
      }
    } catch {
      // JSON malforme : on retombe sur le decoupage par separateurs ci-dessous.
    }
  }

  // Litteral de tableau Postgres rendu en texte : {"MT4","MT5"}
  const body =
    raw.startsWith('{') && raw.endsWith('}') ? raw.slice(1, -1) : raw

  // On rogne aussi crochets et accolades, pas seulement les guillemets : un
  // JSON malforme (crochet fermant manquant) arrive ici et laisserait sinon
  // un jeton « ["MT4 ». Aucun nom de plateforme ne commence ni ne finit par
  // un de ces caracteres.
  return body
    .split(/[,;]/)
    .map((s) => s.trim().replace(/^["'\[\]{}\s]+|["'\[\]{}\s]+$/g, '').trim())
    .filter(Boolean)
}

export default toArray
