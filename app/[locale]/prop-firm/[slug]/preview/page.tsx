import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

import FirmPage from '@/components/prop-firm/FirmPage'
import { readDraftFirmPage } from '@/lib/publication/read'
import { buildAffiliateUrl } from '@/lib/affiliate'

// =============================================================================
// RELECTURE D'UNE VERSION NON PUBLIEE
// =============================================================================
// Rend une version `draft` ou `validated` avec le composant REEL, pas une
// maquette : relire un JSON ne dit pas si la page tient debout.
//
// TROIS VERROUS INDEPENDANTS
//
//   1. `notFound()` sans cookie valide — la route se comporte comme si elle
//      n'existait pas, plutot que d'annoncer un 401 qui la designe ;
//   2. `readDraftFirmPage` refuse un client qui n'est pas de service ;
//   3. la politique RLS `lecture_publiee` ne laisse sortir que `published`,
//      donc la cle anonyme ne verrait rien meme si les deux premiers sautaient.
//
// Le premier suffirait a la plupart des jours. Les trois existent parce qu'un
// brouillon servi a un visiteur serait exactement la regression que cette
// couche est censee rendre impossible.
//
// `noStore()` : aucune mise en cache, jamais. Une version relue est par
// definition en mouvement, et l'ISR servirait une copie perimee — c'est ce qui
// a fait chercher trois bugs inexistants la semaine derniere.
// =============================================================================

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface Props {
  params: { slug: string; locale: string }
  searchParams: { version?: string }
}

export const metadata = {
  title: 'Preview',
  // Une version non publiee n'a rien a faire dans un index.
  robots: { index: false, follow: false },
}

export default async function PreviewPage({ params, searchParams }: Props) {
  noStore()

  const secret = process.env.PUBLICATION_SECRET
  const jeton = cookies().get('publication_preview')?.value
  // Secret absent = refus. Un oubli de configuration ne doit pas ouvrir la porte.
  if (!secret || jeton !== secret) notFound()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const lecture = await readDraftFirmPage(supabase, params.slug, {
    versionNumber: searchParams.version ? Number(searchParams.version) : undefined,
    isServiceRole: true,
  })
  if (lecture.kind === 'none') notFound()

  // Une version que la production refusera doit etre refusee ICI aussi, et
  // nommement. Une previsualisation qui rendrait ce que le public ne verra
  // jamais serait pire qu'absente : elle validerait une version morte.
  if (lecture.kind === 'unreadable') {
    console.error('[publication/preview]', {
      slug: params.slug, cause: lecture.cause, detail: lecture.detail,
    })
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui', maxWidth: 640 }}>
        <h1 style={{ fontSize: 18, marginBottom: 12 }}>Version illisible</h1>
        <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>
          Cause : <strong>{lecture.cause}</strong> — {lecture.detail}
        </p>
        <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>
          La production refuserait cette version pour la meme raison. Republier
          apres correction plutot que forcer l&apos;activation.
        </p>
      </div>
    )
  }

  const version = lecture.version

  const locale = params.locale || 'en'

  return (
    <>
      {/* Un bandeau non dissimulable : une capture d'ecran de cette page ne
          doit jamais pouvoir passer pour la page en ligne. */}
      <div
        style={{
          background: '#7f1d1d', color: '#fff', padding: '10px 16px',
          fontSize: 13, fontWeight: 600, textAlign: 'center',
        }}
      >
        VERSION {version.versionNumber} — {version.status.toUpperCase()} — NON PUBLIEE
        {' · '}schema {version.modelSchemaVersion}
        {' · '}empreinte {version.sourceHash.slice(7, 19)}
        {version.verifiedAt ? ` · verifiee le ${version.verifiedAt.slice(0, 10)}` : ''}
      </div>

      <FirmPage
        model={version.model}
        ctaHref={buildAffiliateUrl(params.slug, { placement: 'hero', locale })}
        locale={locale}
      />
    </>
  )
}
