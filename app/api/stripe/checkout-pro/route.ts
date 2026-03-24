import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PRO_MONTHLY!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/upgrade?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/upgrade`,
      metadata: {
        productType: 'pro_subscription',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout Pro error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
