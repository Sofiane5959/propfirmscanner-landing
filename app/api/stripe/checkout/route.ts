import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

// IDs des prix Stripe (à récupérer depuis ton dashboard Stripe)
const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!, // Prix de l'abonnement Pro
  rules_guide: process.env.STRIPE_PRICE_RULES_GUIDE!, // Prix du guide des règles
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, mode, successUrl, cancelUrl } = body;

    // Vérifier que le priceId est valide
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: mode || 'subscription', // 'subscription' pour abonnement, 'payment' pour paiement unique
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      // Permettre les codes promo
      allow_promotion_codes: true,
      // Collecter l'adresse de facturation
      billing_address_collection: 'required',
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}