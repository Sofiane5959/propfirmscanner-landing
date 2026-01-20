import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// =============================================================================
// STRIPE INITIALIZATION
// =============================================================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

// =============================================================================
// PRODUCT CONFIGURATION
// =============================================================================

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
};

// =============================================================================
// API HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const { productType } = await request.json();

    // Validate product type
    if (!productType || !PRODUCTS[productType as keyof typeof PRODUCTS]) {
      return NextResponse.json(
        { error: 'Invalid product type' },
        { status: 400 }
      );
    }

    const product = PRODUCTS[productType as keyof typeof PRODUCTS];

    // Check if price ID is configured
    if (!product.priceId) {
      console.error(`Missing price ID for product: ${productType}`);
      return NextResponse.json(
        { error: 'Product not configured' },
        { status: 500 }
      );
    }

    // Get user from Supabase (optional - allows checkout without login)
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    // Base URL for redirects
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propfirmscanner.org';

    // Create Stripe checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: product.mode,
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      // Add metadata
      metadata: {
        productType,
        ...(user && { userId: user.id }),
      },
    };

    // Add customer email if user is logged in
    if (user?.email) {
      sessionConfig.customer_email = user.email;
    }

    // Allow promotion codes
    sessionConfig.allow_promotion_codes = true;

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
