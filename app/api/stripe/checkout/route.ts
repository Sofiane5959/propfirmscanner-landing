import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { productType, userId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_COURSE_FUNDAMENTALS, // price_1TC0G65fsECZtds26i7gftD8
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: email || undefined, // pré-rempli automatiquement si connecté via Google
    allow_promotion_codes: true,        // affiche le champ code promo dans Stripe
    metadata: {
      productType,           // "course_fundamentals" — utilisé par le webhook
      userId: userId || '',  // ID Supabase — utilisé par le webhook pour update direct
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/education/fundamentals?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/education`,
  });

  return NextResponse.json({ url: session.url });
}
