"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

// Stage B client uploader, shown in the /list-your-property success panel once a
// submission exists (needs its id + a scoped media token). Flow per file:
//   create-upload (mint signed URL) -> PUT bytes straight to Storage -> finalize
//   (server re-sniffs the stored object). Files upload one at a time to keep the
//   submission's media list race-free. Token lives in React state only (never
//   localStorage — guardrail #11).

const PHOTO_MIME = ["image/jpeg", "image/png"];
const VIDEO_MIME = ["video/mp4"];
const MAX_PHOTOS = 20;
const MAX_VIDEOS = 1;
const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

type ItemState = "uploading" | "verifying" | "done" | "rejected" | "error";
type Item = { id: string; name: string; kind: "photo" | "video"; state: ItemState; message?: string };

const ERR_COPY: Record<string, string> = {
  file_too_large: "That file is over the size limit.",
  bad_mime: "Only JPG/PNG photos or an MP4 video.",
  limit_reached: "You've reached the limit for that type.",
  rights_required: "Tick the rights box first.",
  storage_unconfigured: "Uploads aren't available right now — you can send photos when we reply.",
  upload_failed: "Upload didn't complete — try again.",
  unauthorized: "This upload link has expired — reply to our message to add more.",
};

export default function PropertyMediaUploader({
  submissionId,
  mediaToken,
  mode = "owner",
  existingPhotoCount = 0,
  existingVideoCount = 0,
  refreshOnComplete = false,
}: {
  submissionId: string;
  mediaToken: string;
  mode?: "owner" | "operator-preview";
  existingPhotoCount?: number;
  existingVideoCount?: number;
  refreshOnComplete?: boolean;
}) {
  const router = useRouter();
  const [rights, setRights] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function friendly(code: string): string {
    return ERR_COPY[code] ?? "Something went wrong — try again.";
  }

  async function uploadOne(file: File, itemId: string, kind: "photo" | "video") {
    setItems((prev) => [...prev, { id: itemId, name: file.name, kind, state: "uploading" }]);
    const set = (patch: Partial<Item>) =>
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, ...patch } : i)));
    try {
      const create = await fetch("/api/list-your-property/media/create-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, mediaToken, kind, mime: file.type, size: file.size, rightsGranted: true }),
      });
      const cj = (await create.json()) as { ok?: boolean; error?: string; mediaId?: string; uploadUrl?: string };
      if (!create.ok || !cj.ok || !cj.uploadUrl || !cj.mediaId) throw new Error(cj.error ?? "upload_failed");

      const put = await fetch(cj.uploadUrl, {
        method: "PUT",
        headers: { "content-type": file.type, "x-upsert": "false" },
        body: file,
      });
      if (!put.ok) throw new Error("upload_failed");

      set({ state: "verifying" });
      const fin = await fetch("/api/list-your-property/media/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, mediaToken, mediaId: cj.mediaId }),
      });
      const fj = (await fin.json()) as { ok?: boolean; error?: string; status?: string };
      if (!fin.ok || !fj.ok) throw new Error(fj.error ?? "upload_failed");
      if (fj.status === "uploaded") set({ state: "done" });
      else set({ state: "rejected", message: "That didn't look like a valid photo/video." });
    } catch (e) {
      set({ state: "error", message: friendly(e instanceof Error ? e.message : "upload_failed") });
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !rights || busy) return;
    setBusy(true);
    let photos =
      existingPhotoCount +
      items.filter((i) => i.kind === "photo" && i.state !== "rejected" && i.state !== "error").length;
    let videos =
      existingVideoCount +
      items.filter((i) => i.kind === "video" && i.state !== "rejected" && i.state !== "error").length;

    for (const file of Array.from(files)) {
      const kind: "photo" | "video" = file.type.startsWith("video/") ? "video" : "photo";
      const itemId = `${file.name}-${file.size}-${items.length}-${photos}-${videos}`;
      const reject = (message: string) =>
        setItems((prev) => [...prev, { id: itemId, name: file.name, kind, state: "error", message }]);

      if (kind === "photo" && !PHOTO_MIME.includes(file.type)) { reject("Only JPG or PNG."); continue; }
      if (kind === "video" && !VIDEO_MIME.includes(file.type)) { reject("Only MP4."); continue; }
      if (kind === "photo" && photos >= MAX_PHOTOS) { reject("Up to 20 photos."); continue; }
      if (kind === "video" && videos >= MAX_VIDEOS) { reject("One video only."); continue; }
      if (file.size > (kind === "video" ? MAX_VIDEO_BYTES : MAX_PHOTO_BYTES)) { reject("That file is too large."); continue; }

      if (kind === "photo") photos += 1;
      else videos += 1;
      await uploadOne(file, itemId, kind);
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    if (refreshOnComplete) router.refresh();
  }

  return (
    <div className="mt-4">
      <label className="consent-row">
        <input type="checkbox" checked={rights} onChange={(e) => setRights(e.target.checked)} />
        <span>
          {mode === "operator-preview"
            ? "I confirm this media belongs to this venue and is authorised for the protected owner preview."
            : "These photos/video are mine to share, and I’m happy for Other Bali to use them on my page once I approve the draft."}
        </span>
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`mt-3 rounded-2xl border border-dashed p-6 text-center ${
          dragOver ? "border-[var(--lagoon-strong)] bg-[var(--tint-best-bg)]" : "border-[var(--line)] bg-[var(--paper-warm)]"
        } ${!rights ? "opacity-60" : ""}`}
      >
        <p className="text-sm text-[var(--muted)]">
          {rights ? "Drag photos or a short video here, or" : "Tick the box above to enable uploads."}
        </p>
        <button
          type="button"
          disabled={!rights || busy}
          onClick={() => inputRef.current?.click()}
          className="mt-2 rounded-full bg-[var(--lagoon-strong)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Browse files"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,video/mp4"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="mt-2 text-xs text-[var(--muted)]">
          {mode === "operator-preview"
            ? "Up to 20 photos (JPG/PNG) + one short video (MP4). Stored privately for operator and owner review."
            : "Up to 20 photos (JPG/PNG) + one short video (MP4, 15–30s). Your own photos only — we never add ours."}
        </p>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3">
              <span className="truncate text-[var(--ink)]">{i.name}</span>
              <span
                className={
                  i.state === "done"
                    ? "text-[var(--lagoon-strong)] font-semibold"
                    : i.state === "error" || i.state === "rejected"
                      ? "text-[var(--clay)]"
                      : "text-[var(--muted)]"
                }
              >
                {i.state === "uploading" && "Uploading…"}
                {i.state === "verifying" && "Checking…"}
                {i.state === "done" && "✓ Added"}
                {(i.state === "error" || i.state === "rejected") && (i.message ?? "Failed")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
