// First-touch attribution for funnel events (§12 / §22).
//
// The source a guest arrived with is bound once on /api/source and stored on
// guest_refs. Funnel events used to be written with a hard-coded null source,
// so `events.source` was NULL on every row ever logged: a redemption could be
// attributed to a villa QR, but no step in between — venue_detail_view,
// direction_click, booking_click, save — ever could. This resolves the bound
// source so the whole chain carries it.
//
// The active check is not decoration. log_event RETURNS EARLY when p_source is
// not an active attribution_sources row, which silently drops the event
// instead of storing it unattributed. Deactivating a source would therefore
// erase its guests' funnel rather than just stop crediting it. Anything we
// cannot positively confirm as active resolves to null, so the event is still
// stored — unattributed is recoverable, missing is not.

export interface GuestSourceReader {
  /** The source bound to this guest, or null when none/unreadable. */
  boundSource(guestRef: string): Promise<string | null>;
  /** True only when the source is still an issued, active attribution source. */
  isActiveSource(source: string): Promise<boolean>;
}

export async function resolveGuestAttributionSource(
  reader: GuestSourceReader,
  guestRef: string
): Promise<string | null> {
  if (!guestRef) return null;

  let source: string | null;
  try {
    source = await reader.boundSource(guestRef);
  } catch {
    return null;
  }
  if (!source) return null;

  try {
    return (await reader.isActiveSource(source)) ? source : null;
  } catch {
    return null;
  }
}
