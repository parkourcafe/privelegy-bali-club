"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminRequest } from "@/lib/admin-request-auth";
import {
  MAX_STORED_PHOTO_BYTES,
  PHOTO_BUCKET,
  PHOTO_REVIEW_CONFIRMATION,
  approvedPhotoDeliveryUrl,
  detectPhotoMime,
  isPhotoRecordId,
} from "@/lib/photo-submission-policy";
import { serviceClient } from "@/lib/supabase/service";
import { currentSiteOrigin } from "@/lib/site-origin";
import { PUBLIC_CACHE_TAGS } from "@/lib/data/public-cache";

async function operatorClient() {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) throw new Error("Photo review is not configured.");
  return client;
}

function submissionId(formData: FormData): string {
  const id = String(formData.get("id") ?? "");
  if (!isPhotoRecordId(id)) throw new Error("Invalid photo submission.");
  return id;
}

function reviewer(formData: FormData): string {
  const value = String(formData.get("reviewedBy") ?? "").trim();
  if (value.length < 2 || value.length > 120) throw new Error("Enter the operator name.");
  return value;
}

function refreshPhotoSurfaces() {
  revalidateTag(PUBLIC_CACHE_TAGS.venues, "max");
  revalidatePath("/admin/photos");
  revalidatePath("/places/[slug]", "page");
  revalidatePath("/places");
}

export async function approvePhoto(formData: FormData) {
  const client = await operatorClient();
  if (formData.get("reviewConfirmation") !== PHOTO_REVIEW_CONFIRMATION) {
    throw new Error("Confirm the image and its linked rights evidence before approval.");
  }
  const id = submissionId(formData);
  const deliveryUrl = approvedPhotoDeliveryUrl(id, await currentSiteOrigin());
  if (!deliveryUrl) throw new Error("Approved photo delivery URL is not configured as HTTPS.");

  const { data: submission, error: submissionError } = await client
    .from("venue_photo_submissions")
    .select("image_path,status")
    .eq("id", id)
    .eq("status", "pending")
    .single();
  if (submissionError || !submission?.image_path) {
    throw new Error(submissionError?.message ?? "Photo is no longer pending review.");
  }
  const { data: object, error: objectError } = await client.storage
    .from(PHOTO_BUCKET)
    .download(String(submission.image_path));
  if (objectError || !object || object.size < 1 || object.size > MAX_STORED_PHOTO_BYTES) {
    throw new Error("The private photo object is missing or outside the allowed size.");
  }
  const bytes = new Uint8Array(await object.arrayBuffer());
  if (!detectPhotoMime(bytes)) throw new Error("The private photo object failed its signature check.");

  const { data, error } = await client.rpc("approve_venue_photo_submission", {
    p_submission_id: id,
    p_delivery_url: deliveryUrl,
    p_reviewed_by: reviewer(formData),
  });
  if (error || !data || data.ok !== true) {
    throw new Error(error?.message ?? data?.error ?? "Photo failed approval checks.");
  }
  refreshPhotoSurfaces();
}

export async function rejectPhoto(formData: FormData) {
  const client = await operatorClient();
  const id = submissionId(formData);
  const reviewedAt = new Date().toISOString();
  const { data, error } = await client
    .from("venue_photo_submissions")
    .update({
      status: "rejected",
      is_primary: false,
      reviewed_at: reviewedAt,
      reviewed_by: reviewer(formData),
      updated_at: reviewedAt,
    })
    .eq("id", id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();
  if (error || !data) throw new Error(error?.message ?? "Photo is no longer pending review.");
  refreshPhotoSurfaces();
}
