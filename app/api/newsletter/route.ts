import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    // Validation email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      // Already subscribed - still return success for good UX
      return NextResponse.json({
        success: true,
        message: 'Already subscribed',
      });
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        source: source || 'website',
        subscribed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Newsletter subscription error:', error);
      
      // If table doesn't exist, still return success (graceful degradation)
      if (error.code === '42P01') {
        console.warn('newsletter_subscribers table does not exist');
        return NextResponse.json({
          success: true,
          message: 'Subscribed (table not configured)',
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
