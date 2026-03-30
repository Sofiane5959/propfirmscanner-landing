// app/api/alerts/drawdown/route.ts
// Called by Vercel Cron every hour
// Checks all Pro users' challenge accounts and sends email if drawdown > 80%

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Security: only allow cron calls ──────────────────────────
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

// ── Email template ────────────────────────────────────────────
function buildEmailHtml(params: {
  userName: string;
  accountName: string;
  firmName: string;
  ddUsedPct: number;
  ddMaxPct: number;
  ddUsedAmount: number;
  currentBalance: number;
  initialBalance: number;
  alertLevel: "warning" | "danger";
  dashboardUrl: string;
}): string {
  const {
    userName, accountName, firmName,
    ddUsedPct, ddMaxPct, ddUsedAmount,
    currentBalance, initialBalance,
    alertLevel, dashboardUrl,
  } = params;

  const isWarning = alertLevel === "warning";
  const color = isWarning ? "#f59e0b" : "#ef4444";
  const bgColor = isWarning ? "#451a03" : "#450a0a";
  const emoji = isWarning ? "⚠️" : "🚨";
  const pnl = currentBalance - initialBalance;
  const ddPct = Math.round((ddUsedPct / ddMaxPct) * 100);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background:#0a0a0a;color:#e5e7eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://www.propfirmscanner.org/logo.png" alt="PropFirmScanner" style="height:32px;" onerror="this.style.display='none'" />
      <h1 style="color:#10b981;font-size:20px;margin:16px 0 4px;">PropFirmScanner</h1>
      <p style="color:#6b7280;font-size:13px;margin:0;">Challenge Account Alert</p>
    </div>

    <!-- Alert box -->
    <div style="background:${bgColor};border:1px solid ${color}33;border-radius:12px;padding:24px;margin-bottom:24px;">
      <div style="font-size:28px;text-align:center;margin-bottom:12px;">${emoji}</div>
      <h2 style="color:${color};font-size:18px;margin:0 0 8px;text-align:center;">
        ${isWarning ? "Drawdown Warning" : "Drawdown Alert — Action Required"}
      </h2>
      <p style="color:#d1d5db;font-size:14px;text-align:center;margin:0;">
        Hi ${userName}, your challenge account is approaching its drawdown limit.
      </p>
    </div>

    <!-- Account details -->
    <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:20px;margin-bottom:24px;">
      <h3 style="color:#f9fafb;font-size:15px;margin:0 0 16px;">${accountName}</h3>
      <p style="color:#6b7280;font-size:12px;margin:0 0 16px;">${firmName}</p>

      <!-- Drawdown bar -->
      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="color:#9ca3af;font-size:12px;">Drawdown Used</span>
          <span style="color:${color};font-size:12px;font-weight:600;">${ddUsedPct.toFixed(2)}% / ${ddMaxPct}%</span>
        </div>
        <div style="background:#1f2937;border-radius:999px;height:8px;overflow:hidden;">
          <div style="background:${color};height:100%;border-radius:999px;width:${Math.min(ddPct, 100)}%;"></div>
        </div>
        <p style="color:#6b7280;font-size:11px;margin:4px 0 0;">${ddPct}% of max drawdown used · $${Math.abs(Math.round(ddUsedAmount)).toLocaleString()} lost</p>
      </div>

      <!-- Stats grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:#1f2937;border-radius:8px;padding:12px;">
          <p style="color:#6b7280;font-size:11px;margin:0 0 4px;">Current Balance</p>
          <p style="color:#f9fafb;font-size:16px;font-weight:700;margin:0;">$${Math.round(currentBalance).toLocaleString()}</p>
        </div>
        <div style="background:#1f2937;border-radius:8px;padding:12px;">
          <p style="color:#6b7280;font-size:11px;margin:0 0 4px;">P&L</p>
          <p style="color:${pnl >= 0 ? '#10b981' : '#ef4444'};font-size:16px;font-weight:700;margin:0;">
            ${pnl >= 0 ? '+' : ''}$${Math.round(pnl).toLocaleString()}
          </p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${dashboardUrl}"
        style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:14px;">
        View Dashboard →
      </a>
    </div>

    <!-- Tips -->
    <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:20px;margin-bottom:24px;">
      <h4 style="color:#f9fafb;font-size:13px;margin:0 0 12px;">💡 Recommended actions</h4>
      <ul style="color:#9ca3af;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
        <li>Reduce position size immediately</li>
        <li>Avoid trading high-impact news events</li>
        <li>Consider taking a break to reset your mindset</li>
        <li>Review your risk per trade (aim for 0.5-1%)</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:#4b5563;font-size:12px;">
      <p>You're receiving this because you're a PropFirmScanner Pro member.</p>
      <p style="margin:4px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings" style="color:#6b7280;">Manage alerts</a>
        &nbsp;·&nbsp;
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color:#6b7280;">propfirmscanner.org</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ── Main handler ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Verify cron secret
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    checked: 0,
    warnings_sent: 0,
    danger_sent: 0,
    errors: 0,
    skipped: 0,
  };

  try {
    // Get all Pro users' challenge accounts
    const { data: accounts, error: accountsError } = await supabase
      .from("challenge_accounts")
      .select(`
        id,
        user_id,
        account_name,
        firm_name,
        initial_balance,
        current_balance,
        max_drawdown,
        daily_loss_limit,
        profit_target,
        profiles!inner(
          email,
          full_name,
          is_pro
        )
      `)
      .eq("profiles.is_pro", true);

    if (accountsError) throw accountsError;
    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ message: "No Pro accounts found", ...results });
    }

    results.checked = accounts.length;

    for (const account of accounts) {
      try {
        const profile = (account as any).profiles;
        if (!profile?.email) { results.skipped++; continue; }

        const balance = account.current_balance || account.initial_balance;
        const pnl = balance - account.initial_balance;
        const pnlPct = (pnl / account.initial_balance) * 100;
        const maxDD = account.max_drawdown || 10;
        const ddUsedPct = Math.abs(Math.min(pnlPct, 0));
        const ddRatio = ddUsedPct / maxDD; // 0 to 1

        // Skip if not in danger zone
        if (ddRatio < 0.5) { results.skipped++; continue; }

        const alertLevel = ddRatio >= 0.8 ? "danger" : "warning";

        // Check if we already sent this alert recently (prevent spam)
        const alertKey = `alert_${alertLevel}_${account.id}`;
        const { data: existingAlert } = await supabase
          .from("alert_logs")
          .select("id, sent_at")
          .eq("key", alertKey)
          .gte("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24h cooldown
          .single();

        if (existingAlert) { results.skipped++; continue; }

        // Send email
        const userName = profile.full_name || profile.email.split("@")[0];
        const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;

        const emailResult = await resend.emails.send({
          from: "PropFirmScanner <alerts@propfirmscanner.org>",
          to: profile.email,
          subject: alertLevel === "danger"
            ? `🚨 Drawdown Alert: ${account.account_name} at ${Math.round(ddRatio * 100)}% of limit`
            : `⚠️ Drawdown Warning: ${account.account_name} at ${Math.round(ddRatio * 100)}% of limit`,
          html: buildEmailHtml({
            userName,
            accountName: account.account_name,
            firmName: account.firm_name,
            ddUsedPct,
            ddMaxPct: maxDD,
            ddUsedAmount: pnl,
            currentBalance: balance,
            initialBalance: account.initial_balance,
            alertLevel,
            dashboardUrl,
          }),
        });

        if (emailResult.error) {
          console.error(`Email error for ${profile.email}:`, emailResult.error);
          results.errors++;
          continue;
        }

        // Log the alert to prevent duplicates
        await supabase.from("alert_logs").insert({
          key: alertKey,
          user_id: account.user_id,
          account_id: account.id,
          alert_type: alertLevel,
          sent_at: new Date().toISOString(),
          dd_ratio: ddRatio,
        });

        if (alertLevel === "danger") results.danger_sent++;
        else results.warnings_sent++;

      } catch (accountError) {
        console.error(`Error processing account ${account.id}:`, accountError);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.checked} accounts`,
      ...results,
    });

  } catch (error) {
    console.error("Drawdown alert cron error:", error);
    return NextResponse.json({ error: "Internal error", ...results }, { status: 500 });
  }
}
