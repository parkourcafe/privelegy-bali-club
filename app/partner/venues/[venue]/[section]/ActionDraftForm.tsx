"use client";

import { useState } from "react";

export default function ActionDraftForm({ venueSlug }: { venueSlug: string }) {
  const [form, setForm] = useState({ kind: "reserve", provider: "official", url: "", label: "", sourceUrl: "", sourceLabel: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true); setMessage("");
    const response = await fetch("/api/partner/action-draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ venueSlug, ...form }) }).catch(() => null);
    const data = response ? await response.json().catch(() => null) : null;
    setMessage(response?.ok && data?.ok ? `Draft version ${data.draft.version} saved. It is not published.` : data?.error ?? "Draft could not be saved.");
    setBusy(false);
  }
  return <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium text-stone-700">Action<select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"><option value="reserve">Reserve</option><option value="delivery">Delivery</option><option value="takeaway">Takeaway</option><option value="preorder">Pre-order</option><option value="website">Website</option><option value="whatsapp">WhatsApp</option></select></label><label className="text-sm font-medium text-stone-700">Provider<input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="official, tablecheck, grabfood…" className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label></div><label className="mt-3 block text-sm font-medium text-stone-700">Handoff URL<input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium text-stone-700">Button label<input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label><label className="text-sm font-medium text-stone-700">Evidence URL<input value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://official-source..." className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label></div><label className="mt-3 block text-sm font-medium text-stone-700">Evidence label<input value={form.sourceLabel} onChange={(e) => setForm({ ...form, sourceLabel: e.target.value })} placeholder="Official reservations page" className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label><button type="button" disabled={busy} onClick={submit} className="mt-4 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving draft…" : "Save action draft"}</button>{message && <p role="status" className="mt-3 text-sm text-emerald-700">{message}</p>}<p className="mt-3 text-xs text-stone-500">Provider URL validation and operator confirmation are required before this can appear publicly.</p></div>;
}
