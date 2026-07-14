export interface TablePilotReservation {
  reservationId: string;
  venueSlug: string;
  startAt: string;
  partySize: number;
  status: string;
  billable: boolean;
}

export interface TablePilotReport {
  from: string | null;
  to: string | null;
  summary: {
    total: number;
    billable: number;
    confirmedNotSeated: number;
  };
  reservations: TablePilotReservation[];
}

export interface TablePilotReportResult {
  configured: boolean;
  ok: boolean;
  status?: number;
  error?: string;
  report?: TablePilotReport;
}

const DEFAULT_REPORT_URL = "https://tablepilot-id.vercel.app/api/partner/bali-privilege/report";
const PRODUCTION_REPORT_ORIGIN = new URL(DEFAULT_REPORT_URL).origin;

export function tablePilotReportConfig(input: {
  vercelEnv?: string;
  token?: string;
  reportUrl?: string;
  previewToken?: string;
  previewReportUrl?: string;
}): { token: string; reportUrl: string } | null {
  const token = input.vercelEnv === "preview" ? input.previewToken : input.token;
  const rawUrl = input.vercelEnv === "preview"
    ? input.previewReportUrl
    : input.reportUrl ?? (input.vercelEnv === "production" ? DEFAULT_REPORT_URL : undefined);
  if (!token || !rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return null;
    if (input.vercelEnv === "preview" && parsed.origin === PRODUCTION_REPORT_ORIGIN) return null;
    if (input.vercelEnv === "production" && parsed.origin !== PRODUCTION_REPORT_ORIGIN) return null;
    return { token, reportUrl: parsed.toString() };
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function parseReport(value: unknown): TablePilotReport {
  const root = asRecord(value);
  const summary = asRecord(root.summary);
  const reservations = Array.isArray(root.reservations) ? root.reservations : [];

  return {
    from: typeof root.from === "string" ? root.from : null,
    to: typeof root.to === "string" ? root.to : null,
    summary: {
      total: Number(summary.total ?? 0),
      billable: Number(summary.billable ?? 0),
      confirmedNotSeated: Number(summary.confirmedNotSeated ?? 0),
    },
    reservations: reservations.map((item) => {
      const row = asRecord(item);
      return {
        reservationId: String(row.reservationId ?? ""),
        venueSlug: String(row.venueSlug ?? ""),
        startAt: String(row.startAt ?? ""),
        partySize: Number(row.partySize ?? 0),
        status: String(row.status ?? ""),
        billable: Boolean(row.billable),
      };
    }),
  };
}

export async function getTablePilotReport(): Promise<TablePilotReportResult> {
  const config = tablePilotReportConfig({
    vercelEnv: process.env.VERCEL_ENV,
    token: process.env.TABLEPILOT_PARTNER_TOKEN,
    reportUrl: process.env.TABLEPILOT_REPORT_URL,
    previewToken: process.env.TABLEPILOT_PREVIEW_PARTNER_TOKEN,
    previewReportUrl: process.env.TABLEPILOT_PREVIEW_REPORT_URL,
  });
  if (!config) {
    return { configured: false, ok: false, error: "tablepilot_report_not_configured" };
  }

  try {
    const response = await fetch(config.reportUrl, {
      headers: { Authorization: `Bearer ${config.token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        configured: true,
        ok: false,
        status: response.status,
        error: "tablepilot_report_unavailable",
      };
    }
    return { configured: true, ok: true, report: parseReport(await response.json()) };
  } catch {
    return { configured: true, ok: false, error: "tablepilot_report_unreachable" };
  }
}
