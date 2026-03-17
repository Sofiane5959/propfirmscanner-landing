// ============================================================
// FICHIER : app/[locale]/education/fundamentals/page.tsx
// ============================================================

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import FundamentalsClient from './FundamentalsClient';

export const metadata = {
  title: 'Prop Firm Fundamentals — PropFirmScanner Academy',
  description: 'Master prop trading from scratch. 10 lessons, interactive quizzes, and audio narration.',
};

export default async function FundamentalsPage({
  searchParams,
}: {
  searchParams: { payment?: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in → redirect to sign in, come back after
    redirect('/sign-in?redirect=/education/fundamentals');
  }

  // Check if user has purchased the course
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_course_fundamentals')
    .eq('id', user.id)
    .single();

  const hasAccess = profile?.has_course_fundamentals === true;

  if (!hasAccess) {
    // No access → redirect to buy page
    redirect('/education?reason=no-access');
  }

  // ✅ Has access → show the course
  return <FundamentalsClient />;
}
