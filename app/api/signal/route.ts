// app/api/signal/route.ts
//
// Les signaux du site : code copie, fiche vue, plan choisi.
//
// Pendant de /api/go, pour ce qui se passe AVANT la sortie. Meme discipline :
//   - ecriture avec la cle de service, parce que la table est fermee en
//     lecture comme en ecriture au public ;
//   - aucun identifiant de visiteur, aucun cookie : on mesure des gestes, pas
//     des personnes, donc rien a faire consentir ;
//   - jamais bloquant : la reponse part avant meme que l'insert soit fini, et
//     une erreur de base ne remonte pas au visiteur.
//
// Le pays vient des en-tetes Vercel, l'IP est hachee avec le meme sel que les
// clics pour que les deux tables se recoupent sans jamais stocker d'IP.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const IP_HASH_SALT = process.env.IP_HASH_SALT || 'propfirmscanner-default-salt-change-me'

const EVENEMENTS = new Set(['code_copie', 'fiche_vue', 'plan_choisi'])
const BOT = /bot|crawler|spider|headless|lighthouse|pagespeed|preview/i

/** Les memes bornes que le tunnel : ce qui entre ici finit dans une colonne. */
const court = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + IP_HASH_SALT).digest('hex').slice(0, 32)
}

export async function POST(request: NextRequest) {
  // Une reponse vide et immediate : l'appelant est un sendBeacon, il ne lit
  // rien et ne doit rien attendre.
  const repondre = () => new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })

  let corps: Record<string, unknown>
  try {
    corps = await request.json()
  } catch {
    return repondre()
  }

  const evenement = court(corps.evenement, 40)
  const firmSlug = court(corps.firmSlug, 200)
  if (!evenement || !EVENEMENTS.has(evenement) || !firmSlug) return repondre()

  const userAgent = request.headers.get('user-agent')
  const xff = request.headers.get('x-forwarded-for') || ''
  const realIp = request.headers.get('x-real-ip') || ''
  const rawIp = (xff.split(',')[0] || realIp || '').trim()

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  supabase
    .from('site_events')
    .insert({
      event: evenement,
      firm_slug: firmSlug,
      code: court(corps.code, 60),
      plan: court(corps.plan, 200),
      placement: court(corps.placement, 60),
      locale: court(corps.locale, 10),
      path: court(corps.chemin, 300),
      country: request.headers.get('x-vercel-ip-country'),
      region: request.headers.get('x-vercel-ip-country-region'),
      ip_hash: rawIp ? hashIp(rawIp) : null,
      user_agent: userAgent?.slice(0, 500) || null,
      referrer: request.headers.get('referer')?.slice(0, 500) || null,
      is_bot: !userAgent || BOT.test(userAgent),
    })
    .then(({ error }) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[signal] insert failed', error.message)
      }
    })

  return repondre()
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
