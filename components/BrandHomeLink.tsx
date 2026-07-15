import Link from "next/link";
import BrandMark from "@/components/BrandMark";

// The inner-page "back to Other Bali" affordance: the golden "O" brand mark +
// wordmark, linking home — the same identity the fixed landing header carries,
// carried onto the tool/district pages' topline. Replaces the older "← Other
// Bali" text link. Breadcrumbs still handle granular wayfinding below.
export default function BrandHomeLink({
  label = "Other Bali",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`topline gap-1.5 ${className}`}
      aria-label="Other Bali — home"
    >
      <BrandMark className="h-[18px] w-[18px] shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
