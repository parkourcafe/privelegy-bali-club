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
