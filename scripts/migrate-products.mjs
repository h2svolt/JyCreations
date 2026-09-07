// One-time migration: uploads every existing product photo in
// src/assets/products/{category}/ to Supabase Storage and creates a matching
// row in the `products` table, using the same name/price/grouping logic that
// src/lib/products.ts used to derive the catalog at build time. Safe to
// re-run — uploads use upsert, and rows upsert on (category_id, slug).
//
// Usage: node scripts/migrate-products.mjs

import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const env = Object.fromEntries(
  readFileSync(path.join(root, ".env"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ---- ported from src/lib/products.ts (build-time catalog derivation) ----

const DEFAULT_PRICE = 100;

const CATEGORY_PRICE_OVERRIDES = {
  bracelets: 300,
  "glasses-covers": 400,
  "key-chains": 200,
  "frame-hoops": 700,
};

const PRODUCT_PRICE_OVERRIDES = {
  "wallets-purses-clutches": {
    "Cozy Crochet Wallet (Peach)": 500,
    "Cozy Crochet Wallet (Purple)": 500,
    "Cozy Crochet Wallet (Red)": 500,
    "Pearl Weave Clutch": 2000,
  },
  "dream-catchers": {
    "Amber Guardian": 500,
    "Blush Mirage": 500,
    "Rose Eclipse": 500,
    "Royal Guardian": 500,
    "Sapphire Eye": 500,
    "Emerald Serenity": 2500,
    "Pearl Petals": 1200,
    "Citrus Tide": 800,
    "Boho Bliss": 3000,
    "Festive Dreams": 2500,
    Rainbow: 1000,
    "Yellow Dream": 1200,
    "EarthBound Dream": 1800,
    "White Moon": 1500,
  },
  "table-mats": {
    "Dining Table Mat": 7000,
    "Side Table Mat": 1500,
  },
  bookmarks: {
    Purple: 200,
    "White & Yellow": 150,
    Pink: 150,
    Green: 160,
  },
  coasters: {
    "Blue Eye Flowers": 1500,
    "MidNight Bloom": 700,
    "SunBurst Mandala": 1200,
    Doily: 500,
    "Round Coaster (Blue)": 700,
    "Round Coaster (Pink)": 700,
    "Round Coaster (Purple)": 700,
    Radiant: 750,
    "Rainbow Bloom": 700,
    Mandala: 900,
  },
  "frame-hoops": {
    Wedding: 2000,
  },
  wearables: {
    "Hair Bandana": 1000,
    "Crochet Gloves": 1800,
    "Crochet Gajra": 1500,
  },
};

const IMAGE_LABEL_OVERRIDES = {
  coasters: {
    Mandala: ["Purple", "Green"],
  },
  "dream-catchers": {
    MoonLight: ["Orange", "Blue", "Brown"],
  },
  wearables: {
    "Hair Bandana": ["", "White", "Purple", "Pink"],
  },
};

function resolvePrice(categoryId, name) {
  const productOverride = PRODUCT_PRICE_OVERRIDES[categoryId]?.[name];
  if (productOverride !== undefined) return productOverride;
  return CATEGORY_PRICE_OVERRIDES[categoryId] ?? DEFAULT_PRICE;
}

const KNOWN_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif)$/i;
const COPY_SUFFIX = /\s*-\s*copy\s*$/i;
const CAMERA_FILENAME = /^img[_-]?\d+$/i;
const IMAGE_SUFFIX_PARENS = /\s*\(\s*image\s*(\d+)\s*\)\s*$/i;
const IMAGE_SUFFIX_UNDERSCORE = /[_-]image[_-](\d+)$/i;

function stripExtensions(filename) {
  let name = filename;
  while (KNOWN_EXTENSIONS.test(name)) {
    name = name.replace(KNOWN_EXTENSIONS, "");
  }
  return name.replace(COPY_SUFFIX, "").trim();
}

function parseImageMarker(nameWithoutExt) {
  const parens = nameWithoutExt.match(IMAGE_SUFFIX_PARENS);
  if (parens?.[1]) {
    return {
      base: nameWithoutExt.replace(IMAGE_SUFFIX_PARENS, "").trim(),
      position: Number(parens[1]),
    };
  }
  const underscore = nameWithoutExt.match(IMAGE_SUFFIX_UNDERSCORE);
  if (underscore?.[1]) {
    return {
      base: nameWithoutExt.replace(IMAGE_SUFFIX_UNDERSCORE, "").trim(),
      position: Number(underscore[1]),
    };
  }
  return { base: nameWithoutExt, position: 1 };
}

function humanizeBaseName(base) {
  if (CAMERA_FILENAME.test(base)) return null;
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugify(base) {
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

// ---- migration ----

const productsRoot = path.join(root, "src", "assets", "products");
const categoryDirs = readdirSync(productsRoot).filter((f) =>
  statSync(path.join(productsRoot, f)).isDirectory(),
);

let totalProducts = 0;
let totalImages = 0;

for (const categoryId of categoryDirs) {
  const dir = path.join(productsRoot, categoryId);
  const files = readdirSync(dir).filter((f) => KNOWN_EXTENSIONS.test(f) && !f.startsWith("_"));

  const grouped = new Map();
  for (const file of files) {
    const ext = file.match(KNOWN_EXTENSIONS)[0].toLowerCase();
    const { base, position } = parseImageMarker(stripExtensions(file));
    if (!base) continue;
    const list = grouped.get(base) ?? [];
    list.push({ file, position, ext });
    grouped.set(base, list);
  }

  const bases = [...grouped.keys()].sort((a, b) => collator.compare(a, b));
  const usedSlugs = new Map();
  const rows = [];

  for (let index = 0; index < bases.length; index++) {
    const base = bases[index];
    const entries = grouped
      .get(base)
      .slice()
      .sort((a, b) => a.position - b.position);

    let slug = slugify(base) || `item-${index + 1}`;
    const seen = usedSlugs.get(slug) ?? 0;
    usedSlugs.set(slug, seen + 1);
    if (seen > 0) slug = `${slug}-${seen + 1}`;

    const name = humanizeBaseName(base) ?? `${categoryId} No. ${index + 1}`;
    const imageLabels = IMAGE_LABEL_OVERRIDES[categoryId]?.[name] ?? null;
    const price = resolvePrice(categoryId, name);

    const imageUrls = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const buffer = readFileSync(path.join(dir, entry.file));
      const storagePath = `${categoryId}/${slug}-${i + 1}${entry.ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(storagePath, buffer, {
          contentType: CONTENT_TYPES[entry.ext] ?? "application/octet-stream",
          upsert: true,
        });
      if (uploadError) {
        console.error(`Upload failed for ${storagePath}:`, uploadError.message);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(storagePath);
      imageUrls.push(publicUrlData.publicUrl);
      totalImages++;
    }

    rows.push({
      category_id: categoryId,
      name,
      slug,
      price,
      images: imageUrls,
      image_labels: imageLabels,
      sort_order: index,
    });
  }

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from("products")
      .upsert(rows, { onConflict: "category_id,slug" });
    if (insertError) {
      console.error(`Insert failed for category ${categoryId}:`, insertError.message);
    } else {
      console.log(`${categoryId}: migrated ${rows.length} products`);
      totalProducts += rows.length;
    }
  }
}

console.log(`\nDone. ${totalProducts} products, ${totalImages} images uploaded.`);
