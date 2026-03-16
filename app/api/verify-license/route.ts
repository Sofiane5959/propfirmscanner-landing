// ============================================================
// FICHIER : app/api/verify-license/route.ts
// À placer dans : propfirmscanner-landing/app/api/verify-license/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

const GUMROAD_PRODUCT_PERMALINK = process.env.GUMROAD_PRODUCT_PERMALINK!;
// ex: "propfirmfundamentals" — la partie après gumroad.com/l/

export async function POST(req: NextRequest) {
  try {
    const { licenseKey } = await req.json();

    if (!licenseKey || typeof licenseKey !== 'string') {
      return NextResponse.json({ success: false, error: 'No license key provided' }, { status: 400 });
    }

    // Call Gumroad API to verify the license key
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_permalink: GUMROAD_PRODUCT_PERMALINK,
        license_key: licenseKey.trim().toUpperCase(),
      }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        uses: data.uses,
        email: data.purchase?.email,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.message || 'Invalid license key',
      });
    }
  } catch (err) {
    console.error('License verification error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
