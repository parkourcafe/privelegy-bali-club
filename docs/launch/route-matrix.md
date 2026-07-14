# Launch route matrix

| Route | Access | Expected | DB | Index | Criticality | Current evidence |
| --- | --- | ---: | --- | --- | --- | --- |
| `/` | public | 200 | no | index | P0 | build + smoke contract |
| `/places` | public | 200/controlled error | yes | index | P0 | runtime validation; neutral fit-first ranking; bounded URL-history filters |
| `/plan` | public | 200/controlled error | yes | index | P0 | no-default planner tests |
| `/bali` | public | 200/controlled error | yes | index | P1 | build contract |
| `/guides` | public | 200 | no | index | P1 | build contract |
| `/privacy` | public | 200 | no | index | P0 | policy + choices link |
| `/privacy/choices` | public | 200 | optional writes | noindex | P0 | consent/export/delete UI |
| `/terms` | public | 200 | no | index | P1 | smoke contract |
| `/support` | public | 200 | no | index | P1 | smoke contract |
| `/places/[slug]` | public | 200/404/controlled error | yes | conditional | P0 | publication gate; exact related routes; bounded incorrect-info mail handoff |
| `/route/[slug]` | public | 200/404/controlled error | yes | conditional | P1 | exact fail-closed stops; ordered detail; save/share; evidence-labelled Maps handoff; schema.org mapping |
| `/api/event` | public API | 200/4xx/503 | yes | noindex | P0 | bounded consent-backed v3 RPC |
| `/api/source` | public API | 200/4xx/503 | yes | noindex | P0 | strict active source registry |
| `/api/guide-lead` | public API | generic 202 or malformed/unavailable error | yes | noindex | P0 | bounded body; service-only RPC; atomic same-contact rate limit; duplicate/profile outcome not disclosed |
| `/api/guest/bootstrap` | same-origin browser | 200/403/409/503 | optional legacy read | noindex | P0 | sole signed GuestRef mint/legacy-upgrade boundary; exact-Origin gate; cross-tab client lock |
| `/api/privacy/consent` | public API | 200/4xx/503 | yes | noindex | P0 | bounded strict-state body |
| `/api/privacy/export` | current browser | 200/503 | yes | noindex | P0 | versioned no-store attachment |
| `/api/privacy/delete` | exact same-origin current browser | 200/403/409/503 | yes | noindex | P0 | signed cookie identity; same-origin CSRF gate; durable hash-only deletion barrier |
| `/api/onboard/photo` | exact same-origin invited representative | 201/202/4xx/503 | yes + private Storage | noindex | P0 | exact `0041` probe before writes; reserve/upload/digest/consent state machine; ambiguous external I/O retained for reconciliation |
| `/api/venue-photo/[id]` | public | 200/404 | yes + private Storage | noindex | P0 | approved+uploaded+consented row; downloaded bytes must match stored SHA-256 before delivery |
| `/api/health/live` | public API | 200 | no | noindex | P0 | bounded release ID |
| `/api/health/ready` | public API | 200/503 | yes | noindex | P0 | positive public-district count + current signing secret + exact service-role v2/`0041` schema/data probe |
| `/api/mobile/v1/config` | public API | 200/304 | no | noindex | P0 | strict v1 envelope/ETag/CORS |
| `/api/mobile/v1/bootstrap` | public API | 200/304/503 | yes | noindex | P0 | compact bounded DTO; fail closed |
| `/api/mobile/v1/venues` | public API | 200/304/503 | yes | noindex | P0 | strict public DTOs |
| `/api/mobile/v1/venues/[slug]` | public API | 200/304/404/503 | yes | noindex | P0 | full public venue detail |
| `/api/mobile/v1/routes` | public API | 200/304/503 | yes | noindex | P0 | strict summaries |
| `/api/mobile/v1/routes/[slug]` | public API | 200/304/404/503 | yes | noindex | P0 | ordered public stops |

Current-source credential-free Chrome 150 exercised 51 Browser/axe checks with 0 failures. The no-secret local server intentionally kept dependency-backed readiness/bootstrap unavailable. Preview/live HTTP evidence and the protected isolated-staging data-backed job remain required before these rows become deployment evidence; neither repository configuration nor a local run is live deployment proof.
