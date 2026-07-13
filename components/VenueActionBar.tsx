"use client";

import VenueActionPanel from "@/components/actions/VenueActionPanel";
import { resolveVenueActions } from "@/lib/actions/resolve-actions";
import type { VenueActionBarProps } from "@/lib/contracts/menu-action";

function VenueActionBar(props: VenueActionBarProps): React.ReactNode {
  const resolution = resolveVenueActions(props, {
    tablepilotBaseUrl: props.tablepilotBaseUrl,
  });

  return (
    <VenueActionPanel
      venueName={props.venueName}
      resolution={resolution}
      className={props.className}
    />
  );
}

export default VenueActionBar;
