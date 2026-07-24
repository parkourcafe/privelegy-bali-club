import Link from "next/link";
import type { RouteSummary } from "@/lib/data";
import SceneImage from "@/components/landing/SceneImage";

type RouteMedia = {
  scene: string;
  variant: "sunset" | "ridge" | "surf" | "night";
};

const ROUTE_MEDIA: Record<string, RouteMedia> = {
  "first-day": { scene: "plan-route-first-day", variant: "ridge" },
  "ubud-culture-day": { scene: "plan-route-ubud-culture", variant: "ridge" },
  "bangli-temple-village-day": { scene: "plan-route-bangli-temple-village", variant: "ridge" },
  "east-bali-heritage-day": { scene: "plan-route-east-bali-heritage", variant: "ridge" },
  "canggu-food-route": { scene: "plan-route-canggu-food", variant: "night" },
  "canggu-rainy-day": { scene: "plan-route-canggu-rain", variant: "ridge" },
  "cafe-work": { scene: "plan-route-cafe-work", variant: "surf" },
  "sunset-run": { scene: "plan-route-sunset-run", variant: "sunset" },
};

const DISTRICT_MEDIA: Record<string, RouteMedia> = {
  canggu: { scene: "district-canggu", variant: "surf" },
  ubud: { scene: "district-ubud", variant: "ridge" },
  bangli: { scene: "district-sidemen", variant: "ridge" },
  karangasem: { scene: "district-amed", variant: "sunset" },
};

const DISTRICT_LABELS: Record<string, string> = {
  canggu: "Canggu",
  ubud: "Ubud",
  bangli: "Bangli",
  karangasem: "East Bali",
};

function districtLabel(district: string) {
  return DISTRICT_LABELS[district] ?? district.replaceAll("-", " ");
}

export default function PlanRouteCard({ route }: { route: RouteSummary }) {
  const media = ROUTE_MEDIA[route.slug] ?? DISTRICT_MEDIA[route.district] ?? {
    scene: "home-bali-trip-lengths",
    variant: "sunset" as const,
  };

  return (
    <Link href={`/route/${route.slug}`} className="group plan-route-card">
      <SceneImage
        scene={media.scene}
        variant={media.variant}
        sizes="(max-width: 759px) calc(100vw - 2rem), 33vw"
        imgClassName="ob-grade transition duration-500 group-hover:scale-[1.025]"
      />
      <div className="plan-route-card-shade" />
      <span className="plan-route-disclosure">Illustrative route</span>
      <div className="plan-route-copy">
        <p className="plan-route-district">{districtLabel(route.district)}</p>
        <h4>{route.title}</h4>
        {route.subtitle ? <p className="plan-route-summary">{route.subtitle}</p> : null}
        <p className="plan-route-meta">
          <span>{route.stopCount} stops</span>
          <span>Open route →</span>
        </p>
      </div>
    </Link>
  );
}
