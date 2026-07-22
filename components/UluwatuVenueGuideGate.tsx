import type { ReactNode } from "react";

// These editorial guides are backed by the reviewed Uluwatu content registry.
// Public venue actions still use the data-layer publication boundary, but an
// incomplete preview database must not turn every district guide into a 404.
export default function UluwatuVenueGuideGate({ children }: { children: ReactNode }) {
  return children;
}
