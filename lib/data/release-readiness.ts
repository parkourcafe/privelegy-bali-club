import "server-only";

import { exactReleaseSchemaProbe } from "../release-schema-probe";
import { serviceClient } from "../supabase/service";

export type ReleaseReadiness = {
  maintenanceDrafts: boolean;
  photoSubmissions: boolean;
};

const NOT_READY: ReleaseReadiness = {
  maintenanceDrafts: false,
  photoSubmissions: false,
};

// Partner forms stay hidden until their exact service-only schema probes pass.
// A table read alone is not sufficient: an older migration can expose the row
// while still lacking the atomic write/cleanup invariants used by the route.
export async function getReleaseReadiness(): Promise<ReleaseReadiness> {
  const client = serviceClient();
  if (!client) return NOT_READY;

  try {
    const [maintenance, photos] = await Promise.all([
      client.rpc("release_readiness_v1"),
      client.rpc("release_readiness_v2"),
    ]);

    return {
      maintenanceDrafts: !maintenance.error
        && exactReleaseSchemaProbe(maintenance.data, 1, "0040"),
      photoSubmissions: !photos.error
        && exactReleaseSchemaProbe(photos.data, 2, "0041"),
    };
  } catch {
    return NOT_READY;
  }
}
