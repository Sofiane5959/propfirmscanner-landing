import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Save to waitlist table (create it below if needed)
    const { error } = await supabase
      .from('waitlist_advanced')
      .upsert({ email, created_at: new Date().toISOString() }, { onConflict: 'email' });

    if (error) {
      console.error('Waitlist error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    console.log(`✅ Waitlist signup: ${email}`);
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Waitlist route error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
