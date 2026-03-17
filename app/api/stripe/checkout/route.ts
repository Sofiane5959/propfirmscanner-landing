import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const PRODUCTS = {
  pro_monthly: {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    mode: 'subscription' as const,
    name: 'MyPropFirm Pro',
  },
  rules_guide: {
    priceId: process.env.STRIPE_PRICE_RULES_GUIDE!,
    mode: 'payment' as const,
    name: 'Rules Get Guide',
  },
  // ✅ NOUVEAU : Cours Prop Firm Fundamentals
  course_fundamentals: {
    priceId: process.env.STRIPE_PRICE_COURSE_FUNDAMENTALS!,
    mode: 'payment' as const,
    name: 'Prop Firm Fundamentals',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { productType } = await request.json();

    if (!productType || !PRODUCTS[productType as keyof typeof PRODUCTS]) {
      return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
    }

    const product = PRODUCTS[productType as keyof typeof PRODUCTS];

    if (!product.priceId) {
      console.error(`Missing price ID for product: ${productType}`);
      return NextResponse.json({ error: 'Product not configured' }, { status: 500 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propfirmscanner.org';

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: product.mode,
      line_items: [{ price: product.priceId, quantity: 1 }],
      // ✅ Redirect direct vers le cours après paiement
      success_url: productType === 'course_fundamentals'
        ? `${siteUrl}/education/fundamentals?payment=success`
        : `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/education`,
      metadata: {
        productType,
        ...(user && { userId: user.id }),
      },
      allow_promotion_codes: true,
    };

    if (user?.email) {
      sessionConfig.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
