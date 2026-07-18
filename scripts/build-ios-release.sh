#!/bin/bash

set -euo pipefail

readonly AUTHORIZATION_PHRASE="YES_I_HAVE_ACTION_TIME_AUTHORIZATION"
readonly TEAM_ID="KB7VPWHTTM"
readonly BUNDLE_ID="com.otherbali.app"
readonly VERSION="1.0"
readonly BUILD_NUMBER="4"

if [[ "${OTHER_BALI_ALLOW_SIGNING:-}" != "${AUTHORIZATION_PHRASE}" ]]; then
  echo "Refusing to sign. Obtain action-time authorization, then set OTHER_BALI_ALLOW_SIGNING=${AUTHORIZATION_PHRASE}." >&2
  exit 2
fi

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Signed iOS archive/export requires macOS." >&2
  exit 2
fi

for required_tool in git node npm xcodebuild xcrun security; do
  if ! command -v "${required_tool}" >/dev/null 2>&1; then
    echo "Required tool is missing: ${required_tool}" >&2
    exit 2
  fi
done

root="$(git rev-parse --show-toplevel)"
cd "${root}"

if [[ -n "$(git status --porcelain=v1 --untracked-files=all)" ]]; then
  echo "Tracked files are dirty. Commit the exact release source before signing." >&2
  exit 1
fi

node_major="$(node -p 'process.versions.node.split(`.`)[0]')"
if [[ "${node_major}" != "22" ]]; then
  echo "Node.js 22 is required; found $(node --version)." >&2
  exit 2
fi

if ! security find-identity -v -p codesigning \
  | grep -E '"Apple Distribution: .+ \(KB7VPWHTTM\)"' >/dev/null; then
  echo "A valid Apple Distribution identity for team ${TEAM_ID} is not available in the keychain." >&2
  exit 1
fi

export_options="${root}/ios/App/ExportOptions.plist"
/usr/bin/plutil -lint "${export_options}" >/dev/null

npm run mobile:build
npm run mobile:sync:ios
npm run ios:verify -- --config-only

if [[ -n "$(git status --porcelain=v1 --untracked-files=all)" ]]; then
  echo "Release preparation changed tracked files. Commit the regenerated shell/project before signing." >&2
  exit 1
fi

output_directory="${root}/artifacts/release/ios"
final_archive="${output_directory}/OtherBali.xcarchive"
final_ipa="${output_directory}/OtherBali.ipa"
if [[ -e "${final_archive}" || -e "${final_ipa}" ]]; then
  echo "Refusing to overwrite an existing signed iOS artifact under ${output_directory}." >&2
  exit 1
fi

mkdir -p "${output_directory}"
temporary_directory="$(mktemp -d "${TMPDIR:-/tmp}/other-bali-ios-release.XXXXXX")"
trap 'rm -rf "${temporary_directory}"' EXIT
archive_path="${temporary_directory}/OtherBali.xcarchive"
export_path="${temporary_directory}/export"

xcodebuild \
  -project ios/App/App.xcodeproj \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -archivePath "${archive_path}" \
  DEVELOPMENT_TEAM="${TEAM_ID}" \
  PRODUCT_BUNDLE_IDENTIFIER="${BUNDLE_ID}" \
  MARKETING_VERSION="${VERSION}" \
  CURRENT_PROJECT_VERSION="${BUILD_NUMBER}" \
  CODE_SIGN_STYLE=Automatic \
  'CODE_SIGN_IDENTITY=Apple Distribution' \
  archive

xcodebuild \
  -exportArchive \
  -archivePath "${archive_path}" \
  -exportPath "${export_path}" \
  -exportOptionsPlist "${export_options}"

exported_ipas=()
for candidate in "${export_path}"/*.ipa; do
  if [[ -f "${candidate}" ]]; then
    exported_ipas[${#exported_ipas[@]}]="${candidate}"
  fi
done
if [[ "${#exported_ipas[@]}" -ne 1 ]]; then
  echo "Xcode export must produce exactly one IPA; found ${#exported_ipas[@]}." >&2
  exit 1
fi

mv "${archive_path}" "${final_archive}"
mv "${exported_ipas[0]}" "${final_ipa}"
echo "Signed iOS archive and IPA created without upload:"
echo "  ${final_archive}"
echo "  ${final_ipa}"
echo "Run npm run mobile:release:verify only after the signed Play AAB and RuStore APK also exist."
