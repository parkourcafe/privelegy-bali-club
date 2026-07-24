# Protected venue preview — discovery note

Date: 2026-07-23

## Repository reality

- Next.js 16 App Router; the protected operator surface lives under `app/admin`.
- `app/admin/layout.tsx` already requires an operator/admin request.
- `components/PropertyMediaUploader.tsx` already implements sequential drag-and-drop upload.
- Upload bytes go directly to the private Supabase Storage bucket `submission-media`.
- `app/api/list-your-property/media/*` validates a short-lived token, quotas, MIME, file size and magic bytes.
- `venue_submissions.media` is the existing staging record. Migration `0045_submission_media.sql` explicitly keeps it private and separate from public venue publication.
- The 30 research candidates are identified by `venue_submissions.source = 'otherbali-research-2026-07-23'`.

## Smallest complete implementation

1. Add `/admin/venue-preview`, protected by the existing admin layout.
2. Read only the 30 staged submissions through a server-only DTO.
3. Mint scoped, short-lived upload tokens on the server.
4. Reuse `PropertyMediaUploader` with operator-specific copy and a post-upload refresh.
5. Render uploaded images/video only through short-lived signed private URLs.
6. Permit uploads to an accepted submission only when the request is independently authorized as an operator.
7. Add a boundary test proving the preview reads/writes staging only and remains `noindex`.

No migration, dependency, public route, canonical venue write or production deployment is required.

## 2026-07-24 authorised production-media bridge

Founder approval permits this one protected Vercel preview branch to use the
production Supabase project for private submission media only. The existing
global preview guard must remain unchanged for every other service-role caller.

Smallest safe extension:

1. Keep `serviceClient()` blocked when a Vercel preview points at production.
2. Add a separate submission-media client gated by all of:
   - `VERCEL_ENV=preview`;
   - the exact protected preview Git branch;
   - the exact production Supabase host;
   - a branch-scoped Vercel approval flag.
3. Use that client only in the protected preview reader plus the existing
   create/finalize submission-media endpoints.
4. Keep writes limited to `venue_submissions.media` and the private
   `submission-media` bucket; never call a venue publication RPC or write
   `public.venues`.
5. Raise the staged-media quota to 50 photos while retaining one MP4 and
   sequential uploads.

This is an explicit, temporary capability exception. It is not permission to
enable production Supabase service access for arbitrary preview code.

Vercel configuration:

- `OTHER_BALI_PROTECTED_PREVIEW_PRODUCTION_SUBMISSION_MEDIA_WRITE` is stored as
  a sensitive Preview variable scoped only to
  `codex/protected-venue-preview-2026-07-23`.
- The general Preview service client remains disabled against the production
  Supabase ref.

Verification after implementation:

- focused production-media policy and admin boundary tests: 8/8 pass;
- Wave 1 tests: 46/46 pass;
- full repository suite: 262/262 pass;
- typecheck: pass;
- lint: pass with one pre-existing partner-panel image warning;
- production build: pass.
