import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET() {
  try {
    const result = await sendEmail({
      to: 'brik.sofiane1991@gmail.com',
      subject: '🎉 Test PropFirmScanner - Email fonctionne!',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #111; color: white;">
          <h1 style="color: #10b981;">✅ Ça marche!</h1>
          <p>Les notifications email sont configurées correctement.</p>
          <p>Tu peux maintenant supprimer le fichier test-email/route.ts</p>
        </div>
      `,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}
