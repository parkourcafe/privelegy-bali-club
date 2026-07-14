import "server-only";

import { serviceClient } from "../supabase/service";

export type ReleaseReadiness = {
  maintenanceDrafts: boolean;
  photoSubmissions: boolean;
};

const NOT_READY: ReleaseReadiness = {
  maintenanceDrafts: false,
  photoSubmissions: false,
};

// The release migrations are transactional. A successful service-role read of
// their private tables is therefore a fail-closed readiness signal: partner
// forms stay hidden before the schema exists or when its ACLs are incomplete.
export async function getReleaseReadiness(): Promise<ReleaseReadiness> {
  const client = serviceClient();
  if (!client) return NOT_READY;

  try {
    const [menus, actions, photos] = await Promise.all([
      client.from("menus").select("id").limit(1),
      client.from("venue_action_capabilities").select("id").limit(1),
      client.from("venue_photo_submissions").select("id").limit(1),
    ]);

    return {
      maintenanceDrafts: !menus.error && !actions.error,
      photoSubmissions: !photos.error,
    };
  } catch {
    return NOT_READY;
  }
}
