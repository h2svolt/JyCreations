// Compresses every image under src/assets/ to WebP, in place.
// - Products, covers, and other assets all get processed.
// - Originals are DELETED after successful conversion, so run once and don't
//   re-run without checking the console output.
// - Files starting with "_" (group shots, spare covers) are compressed too,
//   since they're still real image files that might get promoted to products
//   later. The prefix is preserved.
// - The auto-discovery glob in src/lib/products.ts already matches .webp, so
//   no code change is needed after running this.

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOTS = ["src/assets"];
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".jfif"]);
const MAX_DIMENSION = 1600; // largest side; smaller stays untouched
const QUALITY = 82; // WebP quality — 82 is visually lossless for photos
const EFFORT = 5; // 0–6, higher = smaller file but slower

// Skip anything already WebP under a certain size — probably already optimised.
const SKIP_WEBP_UNDER_BYTES = 300 * 1024;

// Windows antivirus/indexing briefly locks freshly-written files, which can
// make the rename below fail with EPERM. Retry a few times before giving up.
async function renameWithRetry(from, to, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      await fs.rename(from, to);
      return;
    } catch (err) {
      if (err.code !== "EPERM" || i === attempts - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

let processed = 0;
let skipped = 0;
let bytesBefore = 0;
let bytesAfter = 0;
const errors = [];

for (const root of ROOTS) {
  try {
    await fs.access(root);
  } catch {
    console.warn(`Skipping missing folder: ${root}`);
    continue;
  }

  for await (const file of walk(root)) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;

    try {
      const stat = await fs.stat(file);

      // Small WebPs are almost certainly hand-optimised assets (favicon,
      // logo, etc.) — leave them alone.
      if (ext === ".webp" && stat.size < SKIP_WEBP_UNDER_BYTES) {
        skipped++;
        continue;
      }

      const dir = path.dirname(file);
      const base = path.basename(file, ext);
      const target = path.join(dir, `${base}.webp`);

      const buffer = await sharp(file)
        .rotate() // respect EXIF orientation
        .resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY, effort: EFFORT })
        .toBuffer();

      // Only overwrite if the new file is actually smaller. WebP is not
      // always a win — some already-tiny PNGs come out bigger.
      if (buffer.length >= stat.size && ext === ".webp") {
        skipped++;
        continue;
      }

      // Write to a temp path first so a crash never leaves a half-written file.
      const tmp = `${target}.tmp`;
      await fs.writeFile(tmp, buffer);
      await renameWithRetry(tmp, target);

      // If the original had a different extension, remove it.
      if (path.resolve(file) !== path.resolve(target)) {
        await fs.unlink(file);
      }

      const savedPct = Math.round((1 - buffer.length / stat.size) * 100);
      const relative = path.relative(process.cwd(), target);
      console.log(
        `  ${relative.padEnd(64)} ${(stat.size / 1024).toFixed(0).padStart(5)}KB -> ${(buffer.length / 1024).toFixed(0).padStart(5)}KB  (${savedPct}%)`,
      );

      processed++;
      bytesBefore += stat.size;
      bytesAfter += buffer.length;
    } catch (err) {
      errors.push({ file, message: err instanceof Error ? err.message : String(err) });
    }
  }
}

console.log("");
console.log(`Processed: ${processed}`);
console.log(`Skipped:   ${skipped}`);
if (processed > 0) {
  const savedMB = ((bytesBefore - bytesAfter) / 1024 / 1024).toFixed(1);
  const beforeMB = (bytesBefore / 1024 / 1024).toFixed(1);
  const afterMB = (bytesAfter / 1024 / 1024).toFixed(1);
  const pct = Math.round((1 - bytesAfter / bytesBefore) * 100);
  console.log(`Size:      ${beforeMB} MB -> ${afterMB} MB  (saved ${savedMB} MB, ${pct}%)`);
}

if (errors.length > 0) {
  console.log("");
  console.log(`Errors (${errors.length}):`);
  for (const { file, message } of errors) console.log(`  ${file}: ${message}`);
  process.exit(1);
}
