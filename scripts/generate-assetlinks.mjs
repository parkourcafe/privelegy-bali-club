import { X509Certificate } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const FINGERPRINT_PATTERN = /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/;

export function normalizeSha256Fingerprint(value, label) {
  const fingerprint = String(value ?? "").trim().toUpperCase();
  if (!FINGERPRINT_PATTERN.test(fingerprint)) {
    throw new Error(`${label} must be a colon-separated SHA-256 certificate fingerprint`);
  }
  return fingerprint;
}

export function assertProductionCertificateEvidence(evidence, label) {
  const subject = String(evidence?.subject ?? "");
  if (/CN\s*=\s*Android Debug(?:,|$)/i.test(subject) || /Android Debug/i.test(subject)) {
    throw new Error(`${label} must not use an Android Debug certificate`);
  }
  const validFrom = Date.parse(evidence?.validFrom);
  const validTo = Date.parse(evidence?.validTo);
  const now = Date.now();
  if (!Number.isFinite(validFrom) || !Number.isFinite(validTo) || validFrom > now || validTo <= now) {
    throw new Error(`${label} certificate is not currently valid`);
  }
  return {
    subject,
    validFrom: new Date(validFrom).toISOString(),
    validTo: new Date(validTo).toISOString(),
    sha256: normalizeSha256Fingerprint(evidence.fingerprint256, label),
  };
}

export function readProductionCertificate(file, label) {
  let certificate;
  try {
    certificate = new X509Certificate(readFileSync(resolve(file)));
  } catch {
    throw new Error(`${label} must point to a readable PEM or DER X.509 certificate`);
  }
  return assertProductionCertificateEvidence({
    subject: certificate.subject,
    validFrom: certificate.validFrom,
    validTo: certificate.validTo,
    fingerprint256: certificate.fingerprint256,
  }, label);
}

export function createAssetLinks({ playAppSigningSha256, rustoreAppSigningSha256 }) {
  const fingerprints = [...new Set([
    normalizeSha256Fingerprint(playAppSigningSha256, "Google Play app-signing certificate"),
    normalizeSha256Fingerprint(rustoreAppSigningSha256, "RuStore app-signing certificate"),
  ])];

  return [{
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.otherbali.app",
      sha256_cert_fingerprints: fingerprints,
    },
  }];
}

export function writeAssetLinks({ outputPath, ...certificates }) {
  const resolvedOutput = resolve(outputPath);
  mkdirSync(dirname(resolvedOutput), { recursive: true });
  writeFileSync(resolvedOutput, `${JSON.stringify(createAssetLinks(certificates), null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o644,
  });
  return resolvedOutput;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const outputPath = process.env.OTHER_BALI_ASSETLINKS_OUTPUT
    ?? resolve(repositoryRoot, "public/.well-known/assetlinks.json");
  const playCertificateFile = process.env.OTHER_BALI_PLAY_APP_SIGNING_CERT_FILE;
  const rustoreCertificateFile = process.env.OTHER_BALI_RUSTORE_APP_SIGNING_CERT_FILE;
  if (!playCertificateFile || !rustoreCertificateFile) {
    throw new Error("Set both OTHER_BALI_PLAY_APP_SIGNING_CERT_FILE and OTHER_BALI_RUSTORE_APP_SIGNING_CERT_FILE to exported public X.509 certificates");
  }
  const play = readProductionCertificate(playCertificateFile, "Google Play app-signing certificate");
  const rustore = readProductionCertificate(rustoreCertificateFile, "RuStore app-signing certificate");
  const written = writeAssetLinks({
    outputPath,
    playAppSigningSha256: play.sha256,
    rustoreAppSigningSha256: rustore.sha256,
  });
  console.log(JSON.stringify({ written, certificates: { play, rustore } }, null, 2));
}
