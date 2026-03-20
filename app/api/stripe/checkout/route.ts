import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { productType } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_COURSE_FUNDAMENTALS,
        quantity: 1,
      },
    ],
    mode: 'payment',
    // Stripe collecte l'email directement → transmis au webhook via session.customer_email
    allow_promotion_codes: true,
    metadata: {
      productType, // "course_fundamentals"
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/education/fundamentals?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/education`,
  });

  return NextResponse.json({ url: session.url });
}
