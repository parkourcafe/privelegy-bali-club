"use client";

import { useState } from "react";

type State = "idle" | "busy" | "done" | "error";

export default function PartnerMaintenanceDrafts({ token }: { token: string }) {
  const [menuState, setMenuState] = useState<State>("idle");
  const [actionState, setActionState] = useState<State>("idle");

  async function submitMenu(formData: FormData) {
    setMenuState("busy");
    const response = await fetch("/api/onboard/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draftType: "menu",
        token,
        title: String(formData.get("title") ?? "Menu update"),
        sourceUrl: String(formData.get("sourceUrl") ?? ""),
        section: String(formData.get("section") ?? "Menu"),
        item: String(formData.get("item") ?? ""),
        price: String(formData.get("price") ?? ""),
      }),
    });
    setMenuState(response.ok ? "done" : "error");
  }

  async function submitAction(formData: FormData) {
    setActionState("busy");
    const response = await fetch("/api/onboard/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draftType: "action",
        token,
        kind: String(formData.get("kind") ?? "website"),
        provider: String(formData.get("provider") ?? "official"),
        url: String(formData.get("url") ?? ""),
      }),
    });
    setActionState(response.ok ? "done" : "error");
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="font-medium">Send a menu or service update</p>
      <p className="mt-1 text-sm text-stone-500">This private link is an invitation, not a personal login. Updates are saved as drafts for Other Bali review and never replace the live menu automatically.</p>
      <form action={submitMenu} className="mt-4 space-y-2 border-t border-stone-100 pt-4">
        <p className="text-sm font-semibold">Menu draft</p>
        <Input name="title" label="Menu name" required /><Input name="sourceUrl" label="Official menu URL (https://)" type="url" required /><Input name="section" label="Section" required /><Input name="item" label="First item" required /><Input name="price" label="Price in IDR (optional)" type="number" />
        <Submit state={menuState} label="Send menu draft" />
      </form>
      <form action={submitAction} className="mt-5 space-y-2 border-t border-stone-100 pt-4">
        <p className="text-sm font-semibold">Service link draft</p>
        <label className="block text-sm text-stone-600">Service<select name="kind" className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"><option value="reserve">Reservation</option><option value="delivery">Delivery</option><option value="takeaway">Takeaway</option><option value="preorder">Pre-order request</option><option value="website">Website</option><option value="whatsapp">WhatsApp</option></select></label>
        <Input name="provider" label="Provider (official, WhatsApp, GrabFood, GoFood, Chope, SevenRooms…)" required /><Input name="url" label="Official handoff URL (https://)" type="url" required />
        <Submit state={actionState} label="Send service draft" />
      </form>
      {(menuState === "done" || actionState === "done") ? <p role="status" className="mt-3 text-sm text-emerald-700">Draft received. The current published information stays unchanged until operator review.</p> : null}
      {(menuState === "error" || actionState === "error") ? <p role="alert" className="mt-3 text-sm text-rose-600">Couldn&apos;t save this draft. Check the official HTTPS link or send the update to Other Bali directly.</p> : null}
    </div>
  );
}

function Input({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return <label className="block text-sm text-stone-600">{label}<input name={name} type={type} required={required} className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2" /></label>;
}

function Submit({ state, label }: { state: State; label: string }) {
  return <button type="submit" disabled={state === "busy"} className="min-h-11 w-full rounded-xl border border-cyan-700 px-4 py-2 text-sm font-semibold text-cyan-700 disabled:opacity-50">{state === "busy" ? "Sending…" : state === "done" ? "Draft sent ✓" : label}</button>;
}
