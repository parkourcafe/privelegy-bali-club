import "server-only";

import { requireAdminRequest } from "@/lib/admin-request-auth";
import {
  SUBMISSION_MEDIA_BUCKET,
  mintMediaToken,
  type SubmissionMediaEntry,
} from "@/lib/submission-media-policy";
import { serviceClient } from "@/lib/supabase/service";

export const DEMO_PREVIEW_SOURCE = "otherbali-research-2026-07-23";

export type DemoPreviewMedia = {
  id: string;
  kind: "photo" | "video";
  status: SubmissionMediaEntry["status"];
  mime: string;
  size: number;
  createdAt: string;
  previewUrl: string | null;
};

export type DemoPreviewSubmission = {
  id: string;
  name: string;
  category: string;
  district: string;
  websiteUrl: string;
  status: string;
  updatedAt: string;
  mediaToken: string | null;
  media: DemoPreviewMedia[];
};

export type DemoPreviewResult = {
  configured: boolean;
  error: string | null;
  submissions: DemoPreviewSubmission[];
};

export async function getDemoVenuePreviews(): Promise<DemoPreviewResult> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return { configured: false, error: null, submissions: [] };

  const { data, error } = await client
    .from("venue_submissions")
    .select("id,name,category,district,website_url,status,source,media,updated_at")
    .eq("source", DEMO_PREVIEW_SOURCE)
    .order("name", { ascending: true });
  if (error) return { configured: true, error: error.message, submissions: [] };

  const submissions = await Promise.all(
    (data ?? []).map(async (row): Promise<DemoPreviewSubmission> => {
      const entries: SubmissionMediaEntry[] = Array.isArray(row.media)
        ? (row.media as SubmissionMediaEntry[])
        : [];
      const media = await Promise.all(
        entries.map(async (entry): Promise<DemoPreviewMedia> => {
          let previewUrl: string | null = null;
          if (entry.status === "uploaded") {
            const { data: signed } = await client.storage
              .from(SUBMISSION_MEDIA_BUCKET)
              .createSignedUrl(entry.path, 10 * 60);
            previewUrl = signed?.signedUrl ?? null;
          }
          return {
            id: entry.id,
            kind: entry.kind,
            status: entry.status,
            mime: entry.mime,
            size: entry.size,
            createdAt: entry.createdAt,
            previewUrl,
          };
        }),
      );
      const status = String(row.status ?? "");
      const uploadOpen = ["needs_verification", "reviewing", "accepted"].includes(
        status,
      );

      return {
        id: String(row.id),
        name: String(row.name ?? ""),
        category: String(row.category ?? ""),
        district: String(row.district ?? ""),
        websiteUrl: String(row.website_url ?? ""),
        status,
        updatedAt: String(row.updated_at ?? ""),
        mediaToken: uploadOpen ? mintMediaToken(String(row.id), Date.now()) : null,
        media,
      };
    }),
  );

  return { configured: true, error: null, submissions };
}
