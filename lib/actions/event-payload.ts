import type { SafeActionEventPayload } from "../contracts/menu-action";

export type SafeMenuEventPayload = {
  venueSlug: string;
  menuId: string;
  menuItemId?: string;
};

export type SafeEventPayload = SafeActionEventPayload | SafeMenuEventPayload;

export function isSafeActionEventPayload(
  payload: SafeEventPayload
): payload is SafeActionEventPayload {
  return "action" in payload;
}
