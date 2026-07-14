import type { ActionKind } from "../contracts/menu-action";
import { validateWhatsAppPhone } from "../external-links";

export { validateWhatsAppPhone, whatsAppPhoneFromUrl } from "../external-links";

function cleanCopy(value: string, max: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
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
