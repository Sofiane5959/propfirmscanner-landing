import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// =============================================================================
// HELPER — Met à jour is_pro dans Supabase par email
// =============================================================================

async function setIsProByEmail(email: string, isPro: boolean): Promise<void> {
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = usersData?.users?.find((u) => u.email === email);

  if (!user) {
    console.warn(`setIsProByEmail: no user found for ${email}`);
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ is_pro: isPro })
    .eq('id', user.id);

  if (error) {
    console.error(`Error updating is_pro for ${email}:`, error);
  } else {
    console.log(`✅ is_pro=${isPro} set for ${email} (id: ${user.id})`);
  }
}

// =============================================================================
// HELPER — Récupère l'email depuis un Stripe Customer ID
// =============================================================================

async function getEmailFromCustomer(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return (customer as Stripe.Customer).email ?? null;
  } catch (err) {
    console.error('Error retrieving customer:', err);
    return null;
  }
}

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  console.log(`Webhook event: ${event.type}`);

  // ===========================================================================
  // 1. ACHAT ONE-TIME — Cours Fundamentals
  // ===========================================================================

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email || session.customer_email;
    const productType = session.metadata?.productType;

    console.log(`checkout.session.completed: productType=${productType}, email=${email}`);

    if (productType === 'course_fundamentals' && email) {
      let userId: string;

      // Chercher si l'utilisateur existe déjà
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

      if (listError) {
        console.error('Error listing users:', listError);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      const existingUser = usersData?.users?.find((u) => u.email === email);

      if (existingUser) {
        userId = existingUser.id;
        console.log(`Existing user found: ${userId}`);

        await supabase
          .from('profiles')
          .update({ has_course_fundamentals: true })
          .eq('id', userId);
      } else {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            full_name: email.split('@')[0],
          },
        });

        if (createError || !newUser.user) {
          console.error('Error creating user:', createError);
          return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
        }

        userId = newUser.user.id;
        console.log(`New user created: ${userId}`);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await supabase
          .from('profiles')
          .update({ has_course_fundamentals: true })
          .eq('id', userId);
      }

      // Générer un magic link
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/education/fundamentals?welcome=true`,
        },
      });

      if (linkError) {
        console.error('Magic link error:', linkError);
      }

      const magicLink =
        linkData?.properties?.action_link ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`;

      console.log(`Magic link generated: ${magicLink ? 'OK' : 'FALLBACK'}`);

      // Envoyer l'email via Resend
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'PropFirmScanner Academy <academy@propfirmscanner.org>',
        to: email,
        subject: '🎓 Your Prop Firm Fundamentals access is ready!',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:#10b98120;border:1px solid #10b98140;border-radius:100px;padding:8px 16px;margin-bottom:16px;">
        <span style="color:#10b981;font-size:14px;font-weight:600;">PropFirmScanner Academy</span>
      </div>
      <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 8px;">
        Your course is ready! 🎓
      </h1>
      <p style="color:#9ca3af;font-size:16px;margin:0;">
        Payment confirmed — $69.99
      </p>
    </div>

    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:32px;margin-bottom:24px;">
      <p style="color:#d1d5db;font-size:16px;line-height:1.6;margin:0 0 24px;">
        Hi! Your access to <strong style="color:#10b981;">Prop Firm Fundamentals</strong> is now active.
        Click below to access your course instantly — no password needed.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="${magicLink}"
          style="display:inline-block;background:#10b981;color:#ffffff;padding:16px 40px;
          border-radius:12px;text-decoration:none;font-weight:700;font-size:16px;">
          Access my course →
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:12px;">
          This link is valid for 24 hours
        </p>
      </div>

      <div style="background:#1f2937;border-radius:12px;padding:20px;margin-top:24px;">
        <p style="color:#9ca3af;font-size:13px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">What you get</p>
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="color:#10b981;">✓</span>
            <span style="color:#d1d5db;font-size:14px;">10 complete lessons (Intro → Conclusion)</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="color:#10b981;">✓</span>
            <span style="color:#d1d5db;font-size:14px;">~45 interactive slides with 9 visual types</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="color:#10b981;">✓</span>
            <span style="color:#d1d5db;font-size:14px;">17 audio files — listen while you learn</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="color:#10b981;">✓</span>
            <span style="color:#d1d5db;font-size:14px;">8 quizzes with scoring and explanations</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#10b981;">✓</span>
            <span style="color:#d1d5db;font-size:14px;">Lifetime access + all future updates</span>
          </div>
        </div>
      </div>
    </div>

    <div style="background:#0f172a;border:1px solid #1e3a5f;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#60a5fa;font-size:13px;font-weight:600;margin:0 0 8px;">📧 Your account</p>
      <p style="color:#d1d5db;font-size:14px;margin:0 0 4px;">
        A dashboard has been created for you at <strong>propfirmscanner.org</strong>
      </p>
      <p style="color:#9ca3af;font-size:13px;margin:0;">
        Email: <strong style="color:#d1d5db;">${email}</strong><br/>
        You can set a password anytime from your dashboard settings.
      </p>
    </div>

    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;">
      <p style="color:#4b5563;font-size:12px;margin:0 0 4px;">PropFirmScanner Academy · propfirmscanner.org</p>
      <p style="color:#4b5563;font-size:12px;margin:0;">Questions? Reply to this email — we respond within 24h.</p>
    </div>

  </div>
</body>
</html>`,
      });

      if (emailError) {
        console.error('Email error:', emailError);
      } else {
        console.log(`✅ Email sent to ${email}, id: ${emailData?.id}`);
      }
    }
  }

  // ===========================================================================
  // 2. ABONNEMENT PRO — Activation
  // ===========================================================================

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const status = subscription.status;

    console.log(`Subscription ${event.type}: customerId=${customerId}, status=${status}`);

    // On active is_pro seulement si le sub est actif ou en période d'essai
    const isActive = status === 'active' || status === 'trialing';

    const email = await getEmailFromCustomer(customerId);

    if (!email) {
      console.warn(`No email found for customer ${customerId}`);
      return NextResponse.json({ received: true });
    }

    await setIsProByEmail(email, isActive);
  }

  // ===========================================================================
  // 3. ABONNEMENT PRO — Annulation / Expiration
  // ===========================================================================

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    console.log(`Subscription cancelled: customerId=${customerId}`);

    const email = await getEmailFromCustomer(customerId);

    if (!email) {
      console.warn(`No email found for customer ${customerId}`);
      return NextResponse.json({ received: true });
    }

    await setIsProByEmail(email, false);
  }

  return NextResponse.json({ received: true });
}
