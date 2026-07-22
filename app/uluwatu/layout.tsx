import type { ReactNode } from "react";

export const revalidate = 300;

// The Uluwatu guide subtree is static editorial content with its own evidence
// registry. Individual venue links/cards remain gated by GuideBlocks and
// getPublishedVenues(); the district guide URLs themselves must not 404 just
// because a production DB migration temporarily lags the repository registry.
export default async function UluwatuPublicationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
