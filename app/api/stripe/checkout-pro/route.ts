import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // ── 1. Récupérer l'utilisateur connecté via le cookie Supabase ──
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    // Chercher le token d'accès dans les cookies Supabase
    const authCookie = allCookies.find(
      (c) => c.name.includes('sb-') && c.name.includes('-auth-token')
    );

    let userEmail: string | undefined;
    let userId: string | undefined;

    if (authCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(authCookie.value));
        const accessToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token;

        if (accessToken) {
          const { data: { user } } = await supabase.auth.getUser(accessToken);
          if (user) {
            userEmail = user.email;
            userId = user.id;
          }
        }
      } catch {
        // Cookie malformé — on continue sans user context
      }
    }

    // ── 2. Créer la session Stripe Checkout ────────────────────────
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PRO_MONTHLY!, // price_1SqdT95fsECZtds2TLAgx0xj
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/upgrade?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/upgrade`,
      metadata: {
        productType: 'pro_subscription',
        ...(userId && { userId }),
      },
    };

    // Pré-remplir l'email si l'utilisateur est connecté
    if (userEmail) {
      sessionParams.customer_email = userEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout Pro error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
