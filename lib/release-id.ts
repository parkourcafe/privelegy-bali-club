export function publicReleaseId(value = process.env.VERCEL_GIT_COMMIT_SHA): string {
  return value && /^[a-f0-9]{7,40}$/i.test(value) ? value.slice(0, 12) : "local";
}
