// =============================================================================
// PILOTAGE DE LA PUBLICATION                     app/api/publication/route.ts
// =============================================================================
// La seule surface qui declenche une publication, un retour en arriere ou un
// retrait. Protegee par `PUBLICATION_SECRET`, jamais exposee a un visiteur.
//
// `force-dynamic` + `runtime nodejs` : cette route ecrit, et `source-hash.ts`
// utilise `node:crypto`. Une reponse mise en cache serait absurde ici.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import { publishFirmVersion, activateFirmVersion, deactivateFirm } from '@/lib/publication/publish'
import { readDraftFirmPage } from '@/lib/publication/read'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function clientDeService() {
  // La cle de service, pas la cle anonyme : la politique RLS ne laisse sortir
  // que `published`, et preparer une version demande d'ecrire.
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

function autorise(request: NextRequest): boolean {
  const secret = process.env.PUBLICATION_SECRET
  // Un secret absent REFUSE tout. L'inverse — tout autoriser quand la variable
  // manque — transformerait un oubli de configuration en porte ouverte.
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

interface Corps {
  action?: 'preview' | 'stage' | 'publish' | 'rollback' | 'deactivate'
  slug?: string
  actor?: string
  versionNumber?: number
  acceptWarnings?: boolean
}

export async function POST(request: NextRequest) {
  if (!autorise(request)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  let corps: Corps
  try {
    corps = (await request.json()) as Corps
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
  }

  const { action, slug } = corps
  if (!slug) return NextResponse.json({ error: 'slug requis' }, { status: 400 })

  const supabase = clientDeService()
  const actor = corps.actor ?? 'api'

  switch (action) {
    // Construit et valide, sans rien ecrire. C'est le geste par defaut avant
    // toute mise en ligne : il repond « que se passerait-il ».
    case 'preview': {
      const r = await publishFirmVersion(supabase, slug, actor, { dryRun: true, acceptWarnings: true })
      return NextResponse.json({
        ok: r.ok,
        step: r.step,
        sourceHash: r.sourceHash,
        publishable: r.validation.publishable,
        errors: r.validation.errors,
        warnings: r.validation.warnings,
        notices: r.validation.notices,
        reason: r.reason,
      })
    }

    // Ecrit la version en `validated` sans l'activer. Personne ne la voit :
    // la politique RLS ne laisse sortir que `published`.
    case 'stage': {
      const r = await publishFirmVersion(supabase, slug, actor, {
        stageOnly: true,
        acceptWarnings: corps.acceptWarnings,
      })
      return NextResponse.json(r, { status: r.ok ? 200 : 409 })
    }

    case 'publish': {
      const r = await publishFirmVersion(supabase, slug, actor, {
        acceptWarnings: corps.acceptWarnings,
      })
      return NextResponse.json(r, { status: r.ok ? 200 : 409 })
    }

    case 'rollback': {
      if (corps.versionNumber == null) {
        return NextResponse.json({ error: 'versionNumber requis' }, { status: 400 })
      }
      const r = await activateFirmVersion(supabase, slug, corps.versionNumber)
      return NextResponse.json(r, { status: r.ok ? 200 : 409 })
    }

    // Retrait pur : la fiche retombe sur le rendu historique.
    case 'deactivate': {
      const r = await deactivateFirm(supabase, slug)
      return NextResponse.json(r, { status: r.ok ? 200 : 409 })
    }

    default:
      return NextResponse.json(
        { error: 'action inconnue : preview | stage | publish | rollback | deactivate' },
        { status: 400 }
      )
  }
}

/** Le modele d'une version, publiee ou non. Relecture avant mise en ligne. */
export async function GET(request: NextRequest) {
  if (!autorise(request)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug requis' }, { status: 400 })

  const numero = url.searchParams.get('version')
  const lecture = await readDraftFirmPage(clientDeService(), slug, {
    versionNumber: numero ? Number(numero) : undefined,
    isServiceRole: true,
  })

  if (lecture.kind === 'none') {
    return NextResponse.json({ error: 'Aucune version' }, { status: 404 })
  }
  // 422 et non 404 : la ligne existe, c'est son contenu que le lecteur refuse.
  // Confondre les deux ferait chercher une version qui est pourtant bien la.
  if (lecture.kind === 'unreadable') {
    return NextResponse.json(
      { error: 'Version illisible', cause: lecture.cause, detail: lecture.detail },
      { status: 422 }
    )
  }
  return NextResponse.json(lecture.version)
}
