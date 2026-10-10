// Подписи для видимого текста страницы заведения: строка над названием и
// «Good to know». Только отображение — ни метаданные, ни JSON-LD отсюда не
// читают, поэтому подписи районов здесь шире, чем карта districtLabel на
// странице (та попадает в title и в addressLocality разметки).

const DISTRICT_DISPLAY_LABEL: Record<string, string> = {
  canggu: "Canggu",
  ubud: "Ubud",
  seminyak: "Seminyak",
  "kuta-legian": "Kuta & Legian",
  jimbaran: "Jimbaran",
  "uluwatu-bukit": "Uluwatu",
  "nusa-dua": "Nusa Dua",
  sanur: "Sanur",
  sidemen: "Sidemen",
  amed: "Amed",
  munduk: "Munduk",
  lovina: "Lovina",
  "nusa-islands": "Nusa Penida",
  "gili-islands": "Gili Islands",
  lombok: "Lombok",
  bangli: "Bangli",
  karangasem: "Karangasem",
  tabanan: "Tabanan",
  denpasar: "Denpasar",
};

const RAW_SLUG = /^[a-z]+(?:-[a-z]+)*$/;

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Район или микрорайон для показа: «ubud» -> «Ubud», «karangasem» ->
 * «Karangasem». «Unknown» и пустое значение — null: строка над названием
 * не должна говорить «Unknown». Текст, который уже написан человеком
 * («Batu Bolong / Berawa»), возвращается как есть.
 */
export function placeDisplayLabel(value: string | null | undefined): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || /^unknown$/i.test(text)) return null;
  if (!RAW_SLUG.test(text)) return text;
  return DISTRICT_DISPLAY_LABEL[text] ?? titleFromSlug(text);
}

/**
 * Строка над названием: «Restaurant · Berawa · Canggu». Район, повторённый
 * микрорайоном («Canggu · Canggu», «Denpasar · denpasar»), показывается один
 * раз.
 */
export function venueKickerLine(parts: {
  category?: string | null;
  area?: string | null;
  district?: string | null;
  priceBand?: string | null;
}): string {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (text: string | null | undefined) => {
    const value = typeof text === "string" ? text.trim() : "";
    if (!value) return;
    const key = value.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(value);
  };
  add(parts.category);
  add(placeDisplayLabel(parts.area));
  add(placeDisplayLabel(parts.district));
  add(parts.priceBand);
  return out.join(" · ");
}

// Подпись говорит ровно то, что говорит тег. Новый тег без подписи
// показывается своим slug с пробелами вместо дефисов.
const PRACTICAL_TAG_LABEL: Record<string, string> = {
  "rain-proof": "Rain-proof",
  "quiet-enough-to-talk": "Quiet enough to talk",
  "big-groups": "Good for big groups",
  parking: "Parking",
  "walk-in-friendly": "Walk-in friendly",
  "kid-friendly": "Kid-friendly",
  "reservation-helpful": "Booking ahead helps",
  ac: "Air-con",
  "air-con": "Air-con",
};

export function practicalTagLabel(tag: string): string {
  const slug = tag.trim();
  const known = PRACTICAL_TAG_LABEL[slug.toLowerCase()];
  if (known) return known;
  const spaced = slug.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function practicalTagsLine(tags: readonly string[]): string {
  const labels: string[] = [];
  for (const tag of tags) {
    if (!tag.trim()) continue;
    const label = practicalTagLabel(tag);
    if (!labels.includes(label)) labels.push(label);
  }
  return labels.join(" · ");
}
