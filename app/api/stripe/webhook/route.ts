import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// =============================================================================
// INITIALIZATION
// =============================================================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

// Supabase Admin client (bypasses RLS)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing Stripe signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {
      // ===========================================
      // CHECKOUT COMPLETED - New subscription
      // ===========================================
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription' && session.customer_email) {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          
          // Get subscription details to find end date
          const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);
          const subscriptionData = subscriptionResponse as unknown as Stripe.Subscription;
          const endDate = new Date(subscriptionData.current_period_end * 1000);
          
          // Update user profile
          const { error } = await supabase
            .from('profiles')
            .update({
              is_pro: true,
              stripe_customer_id: customerId,
              subscription_end_date: endDate.toISOString(),
            })
            .eq('email', session.customer_email);

          if (error) {
            console.error('Error updating profile:', error);
          } else {
            console.log(`✅ User ${session.customer_email} upgraded to Pro!`);
          }
        }
        break;
      }

      // ===========================================
      // SUBSCRIPTION UPDATED - Renewal, plan change
      // ===========================================
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const endDate = new Date(subscription.current_period_end * 1000);
        const isActive = ['active', 'trialing'].includes(subscription.status);

        const { error } = await supabase
          .from('profiles')
          .update({
            is_pro: isActive,
            subscription_end_date: endDate.toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription:', error);
        } else {
          console.log(`✅ Subscription updated for customer ${customerId}`);
        }
        break;
      }

      // ===========================================
      // SUBSCRIPTION DELETED - Cancelled
      // ===========================================
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error } = await supabase
          .from('profiles')
          .update({
            is_pro: false,
            subscription_end_date: null,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error cancelling subscription:', error);
        } else {
          console.log(`❌ Subscription cancelled for customer ${customerId}`);
        }
        break;
      }

      // ===========================================
      // PAYMENT FAILED
      // ===========================================
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        console.log(`⚠️ Payment failed for customer ${customerId}`);
        // Optionally: send email notification, set a flag, etc.
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
