import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        // Redirect to home with error
        return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin));
      }

      // Successful authentication - redirect to dashboard or specified page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (err) {
      console.error('Auth callback exception:', err);
      return NextResponse.redirect(new URL('/?error=auth_error', requestUrl.origin));
    }
  }

  // No code provided - redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
