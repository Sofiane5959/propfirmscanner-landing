// app/[locale]/admin/analytics/page.tsx
//
// SERVER COMPONENT — runs on the server BEFORE any HTML is sent to the
// client. If the visitor is not the admin, we redirect immediately and
// the page markup is never produced.
//
// This replaces the previous 'use client' page that did the auth check
// in useEffect — that approach leaked the page layout to anyone for
// 1-2 seconds before the redirect kicked in.

import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AnalyticsClient from './AnalyticsClient'

const ADMIN_USER_ID = '6d573ff4-b6ac-481e-b024-d54e7977f96f'

export default async function AnalyticsPage({
  params,
}: {
  params: { locale: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // Not signed in → bounce to home with a hint about why
  if (!session) {
    redirect(`/${params.locale}?error=admin_login_required`)
  }

  // Signed in but not the admin → bounce too
  if (session.user.id !== ADMIN_USER_ID) {
    redirect(`/${params.locale}?error=admin_only`)
  }

  // Authorized — render the interactive client component
  return <AnalyticsClient />
}

// Tell Next.js this page is dynamic — auth must run on every request,
// never cached.
export const dynamic = 'force-dynamic'
export const revalidate = 0
