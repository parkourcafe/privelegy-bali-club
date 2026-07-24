# Preview open issues

## PREVIEW-BLOCKER-001 — Vercel Deployment Protection

The deployment is Ready, but the public deployment URL serves the Vercel login
page. The Next.js application and its public Supabase reads are never reached.
This prevents the required 20-venue positive sample, negative browser sample,
desktop/mobile visual checks, Next Image network checks, and screenshot
acceptance.

Resolution: owner-approved preview access or a preview deployment with
Deployment Protection disabled. Do not bypass with secrets, service role, or
fixture data.

`vercel env ls` also reports no project environment variables. Once the
deployment is publicly reachable, the preview must receive only the approved
anon/public configuration and the non-production project-ref guard required by
`lib/supabase/server.ts`; without it the application correctly fails closed
instead of using mock data.

## Not blockers

Policy implementation and existing automated checks are green. No production,
database, storage, schema, route, redirect, money, or ranking changes were
made. The policy bridge still requires active + published venue context and an
exact current-project venue-bound URL; legacy hosts, arbitrary objects, and
hard-block statuses remain denied.
