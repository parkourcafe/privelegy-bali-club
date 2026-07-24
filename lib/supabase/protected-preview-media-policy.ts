export const PRODUCTION_SUPABASE_PROJECT_REF = "egkdapqwkfprtyqvvnso";
export const PROTECTED_VENUE_PREVIEW_BRANCH =
  "codex/protected-venue-preview-2026-07-23";
export const PROTECTED_PREVIEW_SUBMISSION_SOURCE =
  "otherbali-research-2026-07-23";
export const PROTECTED_PREVIEW_MEDIA_APPROVAL =
  "approved-private-submission-media-2026-07-24";

export function isProtectedPreviewProductionMediaAllowed(input: {
  url?: string;
  vercelEnv?: string;
  gitCommitRef?: string;
  approval?: string;
}): boolean {
  if (
    input.vercelEnv !== "preview" ||
    input.gitCommitRef !== PROTECTED_VENUE_PREVIEW_BRANCH ||
    input.approval !== PROTECTED_PREVIEW_MEDIA_APPROVAL ||
    !input.url
  ) {
    return false;
  }

  try {
    const parsed = new URL(input.url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === `${PRODUCTION_SUPABASE_PROJECT_REF}.supabase.co`
    );
  } catch {
    return false;
  }
}
