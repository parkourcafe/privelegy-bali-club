"use client";

import { useState } from "react";
import { browserClient } from "@/lib/supabase/client";

type State = "idle" | "busy" | "done" | "error";

export default function PartnerMaintenanceDrafts({ token }: { token: string }) {
  const [menuState, setMenuState] = useState<State>("idle");
  const [actionState, setActionState] = useState<State>("idle");

  async function submitMenu(formData: FormData) {
    const client = browserClient();
    if (!client) return setMenuState("error");
    setMenuState("busy");
    const sourceUrl = String(formData.get("sourceUrl") ?? "");
    const { data: draft, error } = await client.rpc("create_partner_menu_draft", {
      p_token: token,
      p_title: String(formData.get("title") ?? "Menu update"),
      p_source_url: sourceUrl,
      p_source_label: "Venue-provided menu",
      p_captured_at: new Date().toISOString(),
      p_expires_at: null,
    });
    const menuId = draft && typeof draft === "object" && "menu_id" in draft ? String(draft.menu_id) : "";
    if (error || !menuId) return setMenuState("error");
    const price = String(formData.get("price") ?? "").trim();
    const priceMinor = price ? Math.round(Number(price) * 100) : null;
    const { data: item, error: itemError } = await client.rpc("upsert_partner_menu_item", {
      p_token: token, p_menu_id: menuId,
      p_section_name: String(formData.get("section") ?? "Menu"), p_section_position: 0,
      p_name: String(formData.get("item") ?? ""), p_description: "",
      p_price_minor: Number.isFinite(priceMinor) ? priceMinor : null,
      p_currency: priceMinor === null ? null : "IDR", p_dietary_tags: [], p_verified_allergen_tags: [],
      p_partner_recommended: false, p_availability_note: "", p_item_position: 0,
    });
    setMenuState(itemError || !item || (typeof item === "object" && "ok" in item && item.ok !== true) ? "error" : "done");
  }

  async function submitAction(formData: FormData) {
    const client = browserClient();
    if (!client) return setActionState("error");
    setActionState("busy");
    const kind = String(formData.get("kind") ?? "website");
    const url = String(formData.get("url") ?? "");
    const { data, error } = await client.rpc("create_partner_action_draft", {
      p_token: token, p_kind: kind, p_provider: String(formData.get("provider") ?? "venue"),
      p_url: url, p_label: null, p_priority: 100,
      p_confirmation_required: ["reserve", "preorder"].includes(kind),
      p_source_url: url, p_source_label: "Venue-provided official link",
      p_captured_at: new Date().toISOString(), p_expires_at: null,
    });
    setActionState(error || !data || (typeof data === "object" && "ok" in data && data.ok !== true) ? "error" : "done");
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
        <Input name="provider" label="Provider or venue name" required /><Input name="url" label="Official handoff URL (https://)" type="url" required />
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

