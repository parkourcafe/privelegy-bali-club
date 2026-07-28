#!/usr/bin/env bash
# Other Bali — /together media assets (Higgsfield, nano_banana_pro 2k / kling3_0)
#
# Запускать из КОРНЯ worktree:
#   privelegy-bali-club-release-referral-canon
#
#   bash install-assets.sh
#
# Скачивает PNG, конвертирует в WebP (quality 82) и раскладывает в public/scenes/.
# Требуется cwebp (brew install webp). Без него останутся PNG.

set -euo pipefail

B="https://d8j0ntlcm91z4.cloudfront.net/user_3EKntK4EDjG8nay4H1dy1TK30mB"
DEST="public/scenes"
TMP="$(mktemp -d)"

if [ ! -d "$DEST" ]; then
  echo "ОШИБКА: $DEST не найден. Запусти скрипт из корня worktree." >&2
  exit 1
fi

# имя_файла<TAB>исходный_png
ASSETS=$(cat <<'EOF'
moment-dinner	hf_20260728_170204_2999ccb6-8ac4-47b1-a4a3-9225ed11093e.png
together-step-find	hf_20260728_173110_80e40e31-7871-4fba-b64d-5830c4071303.png
together-step-send	hf_20260728_173113_aff852dc-4ace-4222-a5f2-d9c97e31aed9.png
together-step-decide	hf_20260728_173117_4aa01390-00d9-4f8d-825f-27ae87434969.png
together-step-plan	hf_20260728_173120_36a7c488-1eea-48e5-894e-ff94e3b0003a.png
together-dusk-wash	hf_20260728_173135_8f77f4fa-7eff-4ffa-a853-8e438c26ad28.png
together-shortlist-three	hf_20260728_173140_fbbbda12-dd3f-426a-a2cb-2e061ecfce55.png
together-open-seat	hf_20260728_173143_2e4618c7-e9e9-4380-bafd-57002e9f2e59.png
together-scooters-golden	hf_20260728_173155_b3241971-2d87-4093-a60f-6909f1fb2127.png
moment-dinner-portrait	hf_20260728_173215_812878a7-d8f9-4f9a-a4a2-edc569c99409.png
EOF
)

while IFS=$'\t' read -r name src; do
  [ -z "$name" ] && continue
  echo "→ $name"
  curl -fsSL -o "$TMP/$name.png" "$B/$src"
  if command -v cwebp >/dev/null 2>&1; then
    cwebp -quiet -q 82 "$TMP/$name.png" -o "$DEST/$name.webp"
  else
    cp "$TMP/$name.png" "$DEST/$name.png"
    echo "  cwebp не найден — сохранён PNG"
  fi
done <<< "$ASSETS"

# --- видео: 10s немые loop-ролики, кладём как есть (mp4) ---
VIDEOS=$(cat <<'EOF'
together-hero-loop	hf_20260728_173212_4413d424-80eb-461d-b93d-9242e6d1f49a.mp4
together-hero-loop-portrait	hf_20260728_173348_c03985c5-9983-4f89-9b5f-6bbf952fc98c.mp4
EOF
)

while IFS=$'\t' read -r name src; do
  [ -z "$name" ] && continue
  echo "→ $name.mp4"
  curl -fsSL -o "$DEST/$name.mp4" "$B/$src"
done <<< "$VIDEOS"

rm -rf "$TMP"
echo
echo "Готово. Файлы в $DEST/"
ls -la "$DEST" | grep -E 'moment-dinner|together-'
