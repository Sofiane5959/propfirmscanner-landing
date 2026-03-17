import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const productType = session.metadata?.productType;
        const customerEmail = session.customer_email;

        // ✅ ACHAT DU COURS
        if (productType === 'course_fundamentals' && customerEmail) {
          const customerId = session.customer as string;

          const { error } = await supabase
            .from('profiles')
            .update({
              has_course_fundamentals: true,
              stripe_customer_id: customerId,
            })
            .eq('email', customerEmail);

          if (error) {
            console.error('Error granting course access:', error);
          } else {
            console.log(`✅ Course access granted to ${customerEmail}`);
          }
        }

        // Abonnement Pro (existant)
        if (session.mode === 'subscription' && customerEmail) {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const subscriptionData: any = await stripe.subscriptions.retrieve(subscriptionId);
          const endDate = new Date(subscriptionData.current_period_end * 1000);

          const { error } = await supabase
            .from('profiles')
            .update({
              is_pro: true,
              stripe_customer_id: customerId,
              subscription_end_date: endDate.toISOString(),
            })
            .eq('email', customerEmail);

          if (error) console.error('Error updating profile:', error);
          else console.log(`✅ User ${customerEmail} upgraded to Pro!`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription: any = event.data.object;
        const customerId = subscription.customer as string;
        const endDate = new Date(subscription.current_period_end * 1000);
        const isActive = ['active', 'trialing'].includes(subscription.status);

        const { error } = await supabase
          .from('profiles')
          .update({ is_pro: isActive, subscription_end_date: endDate.toISOString() })
          .eq('stripe_customer_id', customerId);

        if (error) console.error('Error updating subscription:', error);
        break;
      }

      case 'customer.subscription.deleted': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription: any = event.data.object;
        const customerId = subscription.customer as string;

        const { error } = await supabase
          .from('profiles')
          .update({ is_pro: false, subscription_end_date: null })
          .eq('stripe_customer_id', customerId);

        if (error) console.error('Error cancelling subscription:', error);
        break;
      }

      case 'invoice.payment_failed': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice: any = event.data.object;
        console.log(`⚠️ Payment failed for customer ${invoice.customer}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
