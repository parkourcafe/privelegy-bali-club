import type { ActionKind } from "../contracts/menu-action";
import { parseSafeHttpsUrl } from "./external-ordering";

const INTERNATIONAL_PHONE = /^[1-9][0-9]{6,14}$/;

function cleanCopy(value: string, max: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

export function validateWhatsAppPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return INTERNATIONAL_PHONE.test(value) ? value : null;
}

export function whatsAppPhoneFromUrl(value: unknown): string | null {
  const url = parseSafeHttpsUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase();

  if (host === "wa.me" || host === "www.wa.me") {
    return validateWhatsAppPhone(url.pathname.replace(/^\//, ""));
  }
  if (host === "api.whatsapp.com" && url.pathname === "/send") {
    return validateWhatsAppPhone(url.searchParams.get("phone"));
  }
  return null;
}

export function buildWhatsAppHandoff(input: {
  phone: string;
  venueName: string;
  kind: ActionKind;
  perkTitle?: string;
}): string | null {
  const phone = validateWhatsAppPhone(input.phone);
  if (!phone) return null;

  const venueName = cleanCopy(input.venueName, 80) || "there";
  const requests: Partial<Record<ActionKind, string>> = {
    reserve: "I'd like to request a table.",
    delivery: "I'd like to ask about delivery.",
    takeaway: "I'd like to ask about takeaway.",
    preorder: "I'd like to request a pre-order.",
    whatsapp: "I'd like to get in touch.",
  };
  const request = requests[input.kind];
  if (!request) return null;

  const perk = input.perkTitle ? cleanCopy(input.perkTitle, 100) : "";
  const text = `Hi ${venueName}! ${request} I found you on Other Bali.${
    perk ? ` Offer: ${perk}.` : ""
  }`;
  const url = new URL(`https://wa.me/${phone}`);
  url.searchParams.set("text", text);
  return url.toString();
}
