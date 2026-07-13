import type { VenueActionBarProps } from "@/lib/contracts/menu-action";

// Frozen Session 2 → Session 3 seam. It intentionally renders no public copy:
// Session 4 replaces this marker with Session 3's action UI while preserving
// the existing Reserve/Maps/mobile flows around it.
export default function VenueActionIntegrationSlot(_props: VenueActionBarProps) {
  void _props;
  return <div id="venue-action-integration" data-action-integration-slot="venue-action-v1" hidden />;
}
