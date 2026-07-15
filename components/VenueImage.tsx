import Image from "next/image";

type VenueImageVariant = "card" | "visual" | "hero";

const sizesByVariant: Record<VenueImageVariant, string> = {
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  visual: "(max-width: 640px) 100vw, 50vw",
  hero: "(max-width: 960px) 100vw, 1120px",
};

function canUseNextImage(src: string): boolean {
  if (src.startsWith("/api/venue-photo/")) return false;
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".supabase.co") &&
      (url.pathname.startsWith("/storage/v1/object/public/") ||
        url.pathname.startsWith("/storage/v1/render/image/public/"))
    );
  } catch {
    return false;
  }
}

export default function VenueImage({
  src,
  alt,
  variant,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  variant: VenueImageVariant;
  className?: string;
  priority?: boolean;
}) {
  if (canUseNextImage(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizesByVariant[variant]}
        quality={variant === "hero" ? 78 : 70}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    // Rights-gated API images and unknown external hosts bypass the optimizer
    // so revocation and host policy remain authoritative.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
