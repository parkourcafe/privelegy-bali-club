import type { ReactNode } from "react";
import UluwatuVenueGuideGate from "@/components/UluwatuVenueGuideGate";

const REQUIRED_VENUE_SLUGS = [
  "sundays-beach-club",
  "white-rock-beach-club",
  "tropical-temptation-adult-only-beach-club",
  "el-kabron-bali",
  "oneeighty",
  "single-fin",
  "mana-uluwatu",
] as const;

export const revalidate = 300;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <UluwatuVenueGuideGate requiredSlugs={REQUIRED_VENUE_SLUGS}>
      {children}
    </UluwatuVenueGuideGate>
  );
}
