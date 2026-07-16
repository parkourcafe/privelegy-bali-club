import Link from "next/link";
import OtherBaliLogo from "@/components/OtherBaliLogo";

// The inner-page "back to Other Bali" affordance: the approved [O-ring] THER
// BALI wordmark, linking home. `tone="dark"` renders the rose variant the
// Final spec prescribes for dark photography (e.g. the /places masthead).
export default function BrandHomeLink({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-10 items-center ${className}`}
      aria-label="Other Bali — home"
    >
      <OtherBaliLogo size={18} color={tone === "dark" ? "#E7B7AE" : "#2B1A13"} />
    </Link>
  );
}
