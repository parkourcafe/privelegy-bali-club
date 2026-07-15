"use client";

import { useState } from "react";

type Item = { name: string; description: string; priceText: string; priceMinor: string; currency: string };
type Section = { name: string; description: string; items: Item[] };

const emptyItem = (): Item => ({ name: "", description: "", priceText: "", priceMinor: "", currency: "IDR" });
const emptySection = (): Section => ({ name: "", description: "", items: [emptyItem()] });

export default function MenuDraftForm({ venueSlug }: { venueSlug: string }) {
  const [title, setTitle] = useState("Main menu");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [sections, setSections] = useState<Section[]>([emptySection()]);
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  function updateSection(index: number, patch: Partial<Section>) {
    setSections((current) => current.map((section, i) => i === index ? { ...section, ...patch } : section));
  }
  function updateItem(sectionIndex: number, itemIndex: number, patch: Partial<Item>) {
    setSections((current) => current.map((section, i) => i === sectionIndex ? { ...section, items: section.items.map((item, j) => j === itemIndex ? { ...item, ...patch } : item) } : section));
  }
  async function submit() {
    setState("busy");
    setMessage("");
    const response = await fetch("/api/partner/menu-draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ venueSlug, title, sourceUrl, sourceLabel, completeness: "partial", sections: sections.map((section) => ({ ...section, items: section.items.map((item) => ({ ...item, priceMinor: item.priceMinor ? Number(item.priceMinor) : null })) })) }) }).catch(() => null);
    const data = response ? await response.json().catch(() => null) : null;
    setState(response?.ok && data?.ok ? "done" : "error");
    setMessage(response?.ok && data?.ok ? `Draft version ${data.draft.version} saved. It is not published.` : data?.error ?? "Draft could not be saved.");
  }

  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-stone-700">Menu title<input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
        <label className="text-sm font-medium text-stone-700">Official source URL<input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
      </div>
      <label className="block text-sm font-medium text-stone-700">Source label<input value={sourceLabel} onChange={(e) => setSourceLabel(e.target.value)} placeholder="Official current menu" className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
      {sections.map((section, sectionIndex) => (
        <fieldset key={sectionIndex} className="rounded-xl border border-stone-200 p-4">
          <legend className="px-1 text-sm font-semibold text-stone-800">Section {sectionIndex + 1}</legend>
          <input value={section.name} onChange={(e) => updateSection(sectionIndex, { name: e.target.value })} placeholder="Section name" className="w-full rounded-lg border border-stone-300 px-3 py-2" />
          <input value={section.description} onChange={(e) => updateSection(sectionIndex, { description: e.target.value })} placeholder="Section description (optional)" className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <div className="mt-3 space-y-3">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="rounded-lg bg-stone-50 p-3">
                <input value={item.name} onChange={(e) => updateItem(sectionIndex, itemIndex, { name: e.target.value })} placeholder="Item name" className="w-full rounded-lg border border-stone-300 px-3 py-2" />
                <input value={item.description} onChange={(e) => updateItem(sectionIndex, itemIndex, { description: e.target.value })} placeholder="Description" className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <div className="mt-2 grid gap-2 sm:grid-cols-3"><input value={item.priceText} onChange={(e) => updateItem(sectionIndex, itemIndex, { priceText: e.target.value })} placeholder="Price text, e.g. 120k" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" /><input value={item.priceMinor} onChange={(e) => updateItem(sectionIndex, itemIndex, { priceMinor: e.target.value })} inputMode="numeric" placeholder="Numeric IDR (optional)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" /><input value={item.currency} onChange={(e) => updateItem(sectionIndex, itemIndex, { currency: e.target.value })} maxLength={3} placeholder="IDR" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" /></div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => updateSection(sectionIndex, { items: [...section.items, emptyItem()] })} className="mt-3 text-sm font-semibold text-cyan-800">+ Add item</button>
        </fieldset>
      ))}
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setSections([...sections, emptySection()])} className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold">+ Add section</button><button type="button" disabled={state === "busy"} onClick={submit} className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{state === "busy" ? "Saving draft…" : "Save draft for review"}</button></div>
      {message && <p role={state === "error" ? "alert" : "status"} className={`text-sm ${state === "error" ? "text-rose-700" : "text-emerald-700"}`}>{message}</p>}
      <p className="text-xs text-stone-500">Partner submissions remain draft, keep verifiedAt null, and cannot modify Other Bali editorial fields.</p>
    </div>
  );
}
