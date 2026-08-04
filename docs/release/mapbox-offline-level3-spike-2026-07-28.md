# Mapbox Offline Level 3 implementation spike

Date: 2026-07-28
Branch: `codex/offline-level3-mapbox-release`

## Current decision

The Mapbox implementation compiles on iOS and Android, but production activation
remains fail-closed behind `OFFLINE_MAPBOX_LEVEL3_ENABLED=true`. Do not enable
that flag until the physical-device acceptance matrix is complete.

## Credential handling

- The public runtime token and secret `DOWNLOADS:READ` token are stored in the
  local macOS Keychain.
- The secret download token is used only to resolve native Mapbox artifacts.
- No token value is committed, printed in reports, or embedded in server code.
- GitHub Actions secrets were not changed.

## Bali route-quality spike

The redacted provider spike completed 8/8 API checks:

| Journey | Profile | Distance | Duration |
|---|---|---:|---:|
| South Bali corridor | driving | 26.45 km | 45.7 min |
| Canggu → Ubud | driving | 28.04 km | 72.7 min |
| Sanur → Ubud | driving | 25.22 km | 68.7 min |
| Ubud → Lovina | driving | 81.68 km | 162.0 min |
| Amed local | driving | 19.86 km | 44.1 min |
| Nusa Penida | driving | 15.16 km | 47.8 min |
| Ubud local | walking | 2.33 km | 26.2 min |
| Sanur local | cycling | 3.72 km | 13.5 min |

Mapbox does not expose a scooter profile in this API. Other Bali must not label
driving output as scooter-specific guidance without field review.

## Implemented

- bounded Bali tile regions with 30-day freshness;
- shared map and navigation tile storage with a 1 GiB device quota;
- download progress, refresh-by-redownload, open, and removal controls;
- downloaded Mapbox Outdoors tiles and latest navigation tiles;
- GPS puck on the downloaded native map;
- Mapbox attribution and real telemetry consent control;
- keyless repository configuration for iOS and Android;
- server-side activation kill switch;
- contract, TypeScript, lint, web build, iOS Simulator build, and Android debug
  build verification.

## Still required before activation

- physical iPhone and Android download/pause/resume/update/removal tests;
- airplane-mode map, GPS, storage-pressure, expiry, and upgrade tests;
- cached route geometry, offline route request/rerouting, next-stop guidance,
  and bounded offline place search;
- measured pack-size matrix on both platforms;
- Instruments memory/power trace and Android memory/energy trace;
- accessibility and thermal review;
- signed release builds and store rollout.

Until these gates pass, the API correctly returns
`blocked_pending_acceptance`, even though the underlying native adapter is
present.
