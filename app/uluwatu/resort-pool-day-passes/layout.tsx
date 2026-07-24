import type { ReactNode } from "react";
import UluwatuVenueGuideGate from "@/components/UluwatuVenueGuideGate";
export const revalidate = 300;
export default function Layout({ children }: { children: ReactNode }) { return <UluwatuVenueGuideGate>{children}</UluwatuVenueGuideGate>; }
