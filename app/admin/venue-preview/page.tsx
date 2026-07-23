import type { Metadata } from "next";
import Link from "next/link";
import PropertyMediaUploader from "@/components/PropertyMediaUploader";
import { DEMO_PREVIEW_SOURCE, getDemoVenuePreviews } from "./data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Protected venue previews · Other Bali",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ProtectedVenuePreviewPage() {
  const result = await getDemoVenuePreviews();
  const uploaded = result.submissions.reduce(
    (count, submission) =>
      count + submission.media.filter((media) => media.status === "uploaded").length,
    0,
  );

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-stone-50 px-4 py-8 text-stone-900">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">
        ← Field Kit
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Protected owner preview
      </p>
      <h1 className="mt-1 text-3xl font-semibold">Venue demo catalogue</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
        Private staging for the 30 owner-outreach candidates. Uploads stay in
        private Storage and update only the submission record. They do not
        create or change public venue listings.
      </p>
      <p className="mt-2 text-xs text-stone-500">
        Source: {DEMO_PREVIEW_SOURCE} · {result.submissions.length} submissions ·{" "}
        {uploaded} uploaded media files
      </p>

      {!result.configured ? (
        <Notice tone="amber">
          Preview is unavailable until server-only Supabase credentials are configured.
        </Notice>
      ) : null}
      {result.error ? <Notice tone="red">Preview queue unavailable: {result.error}</Notice> : null}
      {result.configured && !result.error && result.submissions.length === 0 ? (
        <Notice tone="amber">
          No staged submissions were found for this research source.
        </Notice>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {result.submissions.map((submission) => {
          const uploadedMedia = submission.media.filter(
            (media) => media.status === "uploaded",
          );
          const photoCount = uploadedMedia.filter((media) => media.kind === "photo").length;
          const videoCount = uploadedMedia.filter((media) => media.kind === "video").length;

          return (
            <article
              key={submission.id}
              className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
            >
              <div className="grid min-h-64 grid-cols-2 gap-1 bg-stone-100">
                {uploadedMedia.length ? (
                  uploadedMedia.slice(0, 4).map((media) => (
                    <MediaPreview
                      key={media.id}
                      name={submission.name}
                      kind={media.kind}
                      url={media.previewUrl}
                    />
                  ))
                ) : (
                  <div className="col-span-2 flex min-h-64 items-center justify-center p-8 text-center text-sm text-stone-500">
                    Drop the first authorised photo or video below.
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{submission.name}</h2>
                    <p className="mt-1 text-sm text-stone-500">
                      {[submission.category, submission.district].filter(Boolean).join(" · ") ||
                        "Category and district pending"}
                    </p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                    {submission.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-600">
                  <span className="rounded-full border border-stone-200 px-2 py-1">
                    {photoCount}/20 photos
                  </span>
                  <span className="rounded-full border border-stone-200 px-2 py-1">
                    {videoCount}/1 video
                  </span>
                  {submission.websiteUrl ? (
                    <a
                      href={submission.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-stone-200 px-2 py-1 font-medium text-cyan-800 hover:bg-cyan-50"
                    >
                      Official source ↗
                    </a>
                  ) : null}
                </div>

                {submission.mediaToken ? (
                  <PropertyMediaUploader
                    submissionId={submission.id}
                    mediaToken={submission.mediaToken}
                    mode="operator-preview"
                    existingPhotoCount={photoCount}
                    existingVideoCount={videoCount}
                    refreshOnComplete
                  />
                ) : (
                  <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
                    Upload token unavailable. Configure the server media secret.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

function MediaPreview({
  name,
  kind,
  url,
}: {
  name: string;
  kind: "photo" | "video";
  url: string | null;
}) {
  if (!url) {
    return (
      <div className="flex min-h-40 items-center justify-center p-4 text-center text-xs text-stone-500">
        Private preview unavailable. Reload to renew the signed URL.
      </div>
    );
  }
  if (kind === "video") {
    return (
      <video
        src={url}
        controls
        preload="metadata"
        className="size-full min-h-40 object-cover"
        aria-label={`${name} preview video`}
      />
    );
  }
  return (
    // Signed private URLs are short-lived and not compatible with the public
    // image optimizer allowlist.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`${name} preview`}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="size-full min-h-40 object-cover"
    />
  );
}

function Notice({
  tone,
  children,
}: {
  tone: "amber" | "red";
  children: React.ReactNode;
}) {
  const styles =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-950"
      : "border-amber-200 bg-amber-50 text-amber-950";
  return <p className={`mt-6 rounded-xl border p-4 text-sm ${styles}`}>{children}</p>;
}
