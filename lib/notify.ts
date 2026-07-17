import "server-only";

// Operator notifications for inbound intake events (a new listing request from
// /for-venues, a new owner-filled profile draft from /onboard). Transactional
// email via Resend's REST API — no SDK, no build dependency.
//
// Fully optional and fail-safe: with no RESEND_API_KEY / NOTIFY_EMAIL_TO the
// helper no-ops, so intake never breaks on a missing integration. It never
// throws and never blocks the caller's response on a slow mail send — the row
// is already stored; the email is best-effort.
//
// Setup (one-time): create a Resend account, set RESEND_API_KEY and
// NOTIFY_EMAIL_TO (the operator inbox). NOTIFY_EMAIL_FROM defaults to Resend's
// shared sandbox sender, which delivers to the account's own verified address —
// enough to go live; verify the otherbali.com domain later for a branded from.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface OperatorNotice {
  subject: string;
  lines: string[]; // plain-text body, one entry per line
}

export async function notifyOperator(notice: OperatorNotice): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.NOTIFY_EMAIL_TO?.trim();
  if (!key || !to) return; // integration not configured — silently skip
  const from = process.env.NOTIFY_EMAIL_FROM?.trim() || "Other Bali <onboarding@resend.dev>";

  try {
    await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: notice.subject,
        text: notice.lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Best-effort: the submission is already stored and visible in the admin
    // queue, so a mail failure must never surface to the caller.
  }
}
