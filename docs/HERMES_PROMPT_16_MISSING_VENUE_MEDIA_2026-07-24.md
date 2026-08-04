# Prompt for Hermes — 16 owner-confirmed venues missing media

You are a media-research and asset-preparation operator for Other Bali.

The venue owners have confirmed participation and the team states that an
agreement permits publication of venue media. Your task is to collect and
prepare media only for the 16 exact branches listed in
`OWNER_CONFIRMED_16_MISSING_PHOTOS_2026-07-24.csv`.

## Source rules

1. Use only the exact venue's official website, official Instagram account,
   an owner-provided Drive/Dropbox folder, or files supplied directly by the
   venue.
2. Do not use Google Maps contributor photos, review platforms, blogs,
   Pinterest, stock libraries, press articles or another branch's images.
3. Match the branch exactly. A chain-level image may be used only when the
   source explicitly identifies the shown branch or the owner states that it
   is approved for all branches.
4. Do not copy captions, reviews, ratings, prices, hours or editorial claims.
5. Never invent a media URL or claim that a download succeeded when it did not.

## Required output per venue

- `slug`
- `venue_name`
- `branch`
- `source_page_url`
- `original_asset_url`
- `source_type`: `official_website`, `official_instagram`, or `owner_folder`
- `captured_at`
- `file_name`
- `mime_type`
- `width_px`
- `height_px`
- `file_size_bytes`
- `sha256`
- `orientation`: `landscape`, `portrait`, `square`
- `content_type`: `exterior`, `interior`, `food`, `people`, `view`, `logo`
- `hero_candidate`: `yes` or `no`
- `branch_match_evidence`
- `rights_basis`: `owner_agreement_confirmed`
- `notes`

## Asset target

For every venue, collect:

- at least 1 landscape hero photo;
- preferably 5–10 useful photos covering exterior/interior, signature food and
  atmosphere;
- optionally 1 short MP4 video when an owner-approved original is available.

Hero requirements:

- minimum 1600 px wide where the source allows;
- landscape ratio between 4:3 and 16:9;
- no screenshot chrome, third-party watermark or overlaid review text;
- the venue or its food must be clearly identifiable;
- avoid an image dominated by a logo when a real venue image exists.

## Packaging

Create:

```text
otherbali_missing_media_16/
  <venue-slug>/
    photos/
    video/
    manifest.csv
  MASTER_MEDIA_MANIFEST.csv
  MISSING_OR_BLOCKED.csv
```

File naming:

```text
<venue-slug>__<content-type>__01.<ext>
```

Do not upload anything to production and do not update venue records. Return
the package for Other Bali review and upload through the protected
drag-and-drop preview uploader. If no valid official asset is available, add
the venue to `MISSING_OR_BLOCKED.csv` with the exact blocker.
