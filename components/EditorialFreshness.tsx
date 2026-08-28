import { validLastModified } from "@/lib/seo/sitemap-last-modified";

export default function EditorialFreshness({
  date,
}: {
  date: string | undefined;
}) {
  const validDate = validLastModified(date);
  if (!validDate) return null;

  return (
    <p className="verification-note">
      Updated: <time dateTime={validDate}>{validDate}</time>
    </p>
  );
}
