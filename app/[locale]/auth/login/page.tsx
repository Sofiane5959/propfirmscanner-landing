'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = getLocaleFromPath(pathname);
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
    if (error) {
      setError(error.message);
      setIsGoogleLoading(false);
    }
  };

  // ── Magic link par email ──────────────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsEmailLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setEmailSent(true);
    }
    setIsEmailLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-white">PropFirmScanner</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-gray-400">Access your personal space</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Email sent confirmation */}
          {emailSent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Check your inbox!</h3>
              <p className="text-gray-400 text-sm mb-1">
                We sent a magic link to
              </p>
              <p className="text-emerald-400 font-medium mb-4">{email}</p>
              <p className="text-gray-500 text-xs">
                Click the link in the email to sign in instantly.<br/>
                The link expires in 24 hours.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="mt-6 text-sm text-gray-400 hover:text-white underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-900 font-medium rounded-xl transition-colors mb-6"
              >
                {isGoogleLoading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <GoogleIcon className="w-5 h-5" />
                }
                {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900 text-gray-500">or sign in with email</span>
                </div>
              </div>

              {/* Email magic link */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isEmailLoading || !email}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                >
                  {isEmailLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <><Mail className="w-4 h-4" /> Send magic link</>
                  }
                </button>
                <p className="text-center text-xs text-gray-500">
                  No password needed — we'll email you a login link
                </p>
              </form>
            </>
          )}

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-emerald-400 hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { title: 'Multi-accounts', desc: 'Manage all your prop firms' },
            { title: 'Simulation', desc: 'Test your trades' },
            { title: 'Alerts', desc: 'Never miss a rule' },
            { title: 'Favorites', desc: 'Save your firms' },
          ].map((b, i) => (
            <div key={i} className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <p className="text-sm font-medium text-white">{b.title}</p>
              <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
