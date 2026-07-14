# Launch rollback

## Canonical-origin slice

Before production deployment, rollback is a normal revert of the canonical-origin commit. After deployment, first remove the apex host redirect and restore the prior metadata/origin constants in a preview, run `npm run verify`, smoke both hosts, and only then promote. DNS and Vercel domain ownership changes require a separate platform rollback record.

No database migration is part of this slice.
