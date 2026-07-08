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
  const token = process.env.TABLEPILOT_PARTNER_TOKEN;
  const reportUrl = process.env.TABLEPILOT_REPORT_URL ?? DEFAULT_REPORT_URL;
  if (!token) {
    return { configured: false, ok: false, error: "tablepilot_report_not_configured" };
  }

  try {
    const response = await fetch(reportUrl, {
      headers: { Authorization: `Bearer ${token}` },
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
