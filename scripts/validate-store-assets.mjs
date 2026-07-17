import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { inflateSync } from "node:zlib";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const MAX_DECODED_PNG_BYTES = 64 * 1024 * 1024;
const CRC_TABLE = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return crc >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export const STORE_ASSET_SPECS = Object.freeze([
  { name: "Apple App Store icon", file: "app-store-icon-1024.png", width: 1024, height: 1024, alpha: "forbidden" },
  { name: "canonical icon source", file: "app-icon-1024.png", width: 1024, height: 1024, alpha: "forbidden" },
  { name: "Google Play icon", file: "google-play-icon-512.png", width: 512, height: 512, alpha: "required" },
  { name: "RuStore icon", file: "rustore-icon-512.png", width: 512, height: 512, alpha: "forbidden" },
  { name: "Google Play feature graphic", file: "google-play-feature-graphic-1024x500.png", width: 1024, height: 500, alpha: "forbidden" },
]);

export function inspectPng(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 33 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("File is not a valid PNG stream");
  }

  let offset = 8;
  let width;
  let height;
  let bitDepth;
  let colorType;
  let hasTransparencyChunk = false;
  let compressionMethod;
  let filterMethod;
  let interlaceMethod;
  let sawHeader = false;
  let sawEnd = false;
  const imageData = [];

  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const next = dataEnd + 4;
    if (next > buffer.length) throw new Error(`Malformed PNG chunk: ${type}`);
    const expectedCrc = buffer.readUInt32BE(dataEnd);
    const actualCrc = crc32(buffer.subarray(offset + 4, dataEnd));
    if (expectedCrc !== actualCrc) throw new Error(`PNG chunk has an invalid CRC: ${type}`);
    if (!sawHeader && type !== "IHDR") throw new Error("PNG IHDR must be the first chunk");

    if (type === "IHDR") {
      if (sawHeader) throw new Error("PNG contains multiple IHDR chunks");
      if (length !== 13) throw new Error("Malformed PNG IHDR chunk");
      width = buffer.readUInt32BE(dataStart);
      height = buffer.readUInt32BE(dataStart + 4);
      bitDepth = buffer[dataStart + 8];
      colorType = buffer[dataStart + 9];
      compressionMethod = buffer[dataStart + 10];
      filterMethod = buffer[dataStart + 11];
      interlaceMethod = buffer[dataStart + 12];
      sawHeader = true;
    } else if (type === "IDAT") {
      imageData.push(buffer.subarray(dataStart, dataEnd));
    } else if (type === "tRNS") {
      hasTransparencyChunk = true;
    } else if (type === "IEND") {
      if (length !== 0) throw new Error("Malformed PNG IEND chunk");
      sawEnd = true;
      offset = next;
      break;
    }

    offset = next;
  }

  if (!sawHeader || !width || !height || colorType === undefined) throw new Error("PNG has no usable IHDR metadata");
  if (!sawEnd) throw new Error("PNG is missing the IEND chunk");
  if (offset !== buffer.length) throw new Error("PNG contains trailing bytes after IEND");
  if (!imageData.length) throw new Error("PNG contains no IDAT image data");
  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error("Store PNG must use 8-bit RGB or 8-bit RGBA pixels");
  }
  if (compressionMethod !== 0 || filterMethod !== 0 || interlaceMethod !== 0) {
    throw new Error("Store PNG must use standard compression/filtering and no interlace");
  }
  const channels = colorType === 6 ? 4 : 3;
  const rowBytes = width * channels;
  const decodedBytes = (rowBytes + 1) * height;
  if (!Number.isSafeInteger(decodedBytes) || decodedBytes > MAX_DECODED_PNG_BYTES) {
    throw new Error("PNG decoded image is unreasonably large");
  }
  let decoded;
  try {
    decoded = inflateSync(Buffer.concat(imageData), { maxOutputLength: decodedBytes });
  } catch {
    throw new Error("PNG IDAT image data cannot be decoded");
  }
  if (decoded.length !== decodedBytes) throw new Error("PNG decoded image length is invalid");
  for (let row = 0; row < height; row += 1) {
    const filter = decoded[row * (rowBytes + 1)];
    if (filter > 4) throw new Error("PNG row uses an invalid filter type");
  }
  return {
    width,
    height,
    bitDepth,
    colorType,
    hasAlpha: colorType === 4 || colorType === 6 || hasTransparencyChunk,
  };
}

export async function validateStoreAssets(assetDirectory) {
  const evidence = [];
  for (const spec of STORE_ASSET_SPECS) {
    const absolutePath = path.join(assetDirectory, spec.file);
    const bytes = await readFile(absolutePath);
    const png = inspectPng(bytes);
    const failures = [];
    if (png.width !== spec.width || png.height !== spec.height) {
      failures.push(`expected ${spec.width}x${spec.height}, found ${png.width}x${png.height}`);
    }
    if (spec.alpha === "forbidden" && (png.hasAlpha || png.colorType !== 2 || png.bitDepth !== 8)) {
      failures.push("must be an opaque 24-bit RGB PNG without alpha/transparency");
    }
    if (spec.alpha === "required" && (png.colorType !== 6 || png.bitDepth !== 8)) {
      failures.push("must be a 32-bit RGBA PNG with an alpha channel");
    }
    if (failures.length) throw new Error(`${spec.name} (${spec.file}): ${failures.join("; ")}`);
    evidence.push({
      ...spec,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      bitDepth: png.bitDepth,
      colorType: png.colorType,
      hasAlpha: png.hasAlpha,
    });
  }
  return evidence;
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const evidence = await validateStoreAssets(path.join(repositoryRoot, "store-assets"));
  process.stdout.write(`${JSON.stringify({ ok: true, assets: evidence }, null, 2)}\n`);
}
