// app/[locale]/admin/firms/page.tsx
//
// SERVER COMPONENT — runs on the server before any HTML is sent to the
// client. If the visitor is not the admin, we redirect immediately and
// the page markup is never produced.
//
// The interactive UI lives in FirmsClient.tsx and only mounts once the
// auth check below has passed.

import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import FirmsClient from './FirmsClient'

const ADMIN_USER_ID = '6d573ff4-b6ac-481e-b024-d54e7977f96f'

export default async function AdminFirmsPage({
  params,
}: {
  params: { locale: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${params.locale}?error=admin_login_required`)
  }

  if (session.user.id !== ADMIN_USER_ID) {
    redirect(`/${params.locale}?error=admin_only`)
  }

  return <FirmsClient />
}

// Auth must run on every request — never cache this page.
export const dynamic = 'force-dynamic'
export const revalidate = 0
