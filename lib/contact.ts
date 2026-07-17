// Official Other Bali contact channels — single source of truth so the number
// can't drift between pages. The WhatsApp line is the primary working channel
// (owner-provided, 2026-07-17); email remains listed but mailbox delivery is
// still being set up (docs/store-release-status).
//
// Publicly branded as Other Bali everywhere; the underlying business account
// name (FDR Hospitality Management) is internal and not surfaced in UI.

export const WHATSAPP_NUMBER_DIGITS = "6282339630988";
export const WHATSAPP_NUMBER_DISPLAY = "+62 823 3963 0988";

export function whatsappLink(prefill: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER_DIGITS}?text=${encodeURIComponent(prefill)}`;
}

export const SUPPORT_WHATSAPP_URL = whatsappLink(
  "Hi Other Bali 👋 I need help with: "
);

export const VENUES_WHATSAPP_URL = whatsappLink(
  "Hi Other Bali 👋 I have a question about listing my venue: "
);

export const VILLAS_WHATSAPP_URL = whatsappLink(
  "Hi Other Bali 👋 I'd like to add my villa to the partner network. Villa name and area: "
);
