"use client";

import { useMemo, useState } from "react";

export type InviteRow = {
  slug: string;
  name: string;
  district: string;
  status: string;
  confirmed: boolean;
  hasPhoto: boolean;
  whatsapp: string;
  link: string;
  waEN: string;
  waRU: string;
};

function csvCell(v: string): string {
  return `"${(v ?? "").replace(/"/g, '""')}"`;
}

export default function InvitesTable({ rows }: { rows: InviteRow[] }) {
  const [district, setDistrict] = useState<string>("all");
  const [onlyWa, setOnlyWa] = useState(false);
  const [onlyUnconfirmed, setOnlyUnconfirmed] = useState(false);
  const [copied, setCopied] = useState<string>("");

  const districts = useMemo(
    () => [...new Set(rows.map((r) => r.district))].sort(),
    [rows]
  );

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (district === "all" || r.district === district) &&
          (!onlyWa || r.whatsapp) &&
          (!onlyUnconfirmed || !r.confirmed)
      ),
    [rows, district, onlyWa, onlyUnconfirmed]
  );

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(key);
        setTimeout(() => setCopied(""), 1200);
      },
      () => {}
    );
  }

  function exportCsv() {
    const header = [
      "venue",
      "district",
      "status",
      "confirmed",
      "has_photo",
      "onboarding_link",
      "whatsapp",
      "whatsapp_message_en",
      "whatsapp_message_ru",
    ];
    const lines = [header.join(",")];
    for (const r of filtered) {
      lines.push(
        [
          r.name,
          r.district,
          r.status,
          r.confirmed ? "yes" : "no",
          r.hasPhoto ? "yes" : "no",
          r.link,
          r.whatsapp,
          r.waEN,
          r.waRU,
        ]
          .map((c) => csvCell(String(c)))
          .join(",")
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `otherbali_invites_${district}_${filtered.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="all">All districts ({rows.length})</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d} ({rows.filter((r) => r.district === d).length})
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-stone-600">
          <input type="checkbox" checked={onlyWa} onChange={(e) => setOnlyWa(e.target.checked)} />
          has WhatsApp
        </label>
        <label className="flex items-center gap-1.5 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={onlyUnconfirmed}
            onChange={(e) => setOnlyUnconfirmed(e.target.checked)}
          />
          not confirmed
        </label>
        <button
          onClick={exportCsv}
          className="ml-auto rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Export CSV ({filtered.length})
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {filtered.map((r) => (
          <li key={r.slug} className="rounded-xl border border-stone-200 bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{r.name}</span>
              <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-stone-500">
                {r.district}
              </span>
              {r.confirmed && (
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  ✓ confirmed
                </span>
              )}
              {r.hasPhoto && <span title="Photo uploaded">📷</span>}
              {r.status !== "active" && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                  {r.status}
                </span>
              )}
              {!r.whatsapp && (
                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-400">
                  no WhatsApp
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => copy(r.link, `l-${r.slug}`)}
                className="rounded-lg border border-stone-200 px-2 py-1 text-stone-700"
              >
                {copied === `l-${r.slug}` ? "Copied ✓" : "Copy link"}
              </button>
              <button
                onClick={() => copy(r.waEN, `en-${r.slug}`)}
                className="rounded-lg border border-stone-200 px-2 py-1 text-stone-700"
              >
                {copied === `en-${r.slug}` ? "Copied ✓" : "Copy msg EN"}
              </button>
              <button
                onClick={() => copy(r.waRU, `ru-${r.slug}`)}
                className="rounded-lg border border-stone-200 px-2 py-1 text-stone-700"
              >
                {copied === `ru-${r.slug}` ? "Copied ✓" : "Copy msg RU"}
              </button>
              <a
                href={`https://wa.me/${r.whatsapp}?text=${encodeURIComponent(r.waEN)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-emerald-600 px-2 py-1 font-medium text-white"
              >
                {r.whatsapp ? "Send WhatsApp" : "Open WhatsApp"}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
