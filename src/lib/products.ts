import { collections } from "@/lib/collections";

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Primary image, used for cards and the cart. */
  image: string;
  /** All images for this product, primary first. */
  images: string[];
  /** Optional label per image (e.g. a color option) shown under each
   * thumbnail on the product page. Same length/order as `images` when set. */
  imageLabels?: string[];
  price: number;
  categoryId: string;
  categoryName: string;
}

/**
 * Development pricing: every product is 100 until the client supplies final
 * prices. Change this single constant to update the whole catalogue.
 */
export const DEFAULT_PRICE = 100;

/** Every product in this category uses this price unless PRODUCT_PRICE_OVERRIDES
 * has a more specific entry for it. */
const CATEGORY_PRICE_OVERRIDES: Record<string, number> = {
  bracelets: 300,
  "glasses-covers": 400,
  "key-chains": 200,
  "frame-hoops": 700,
};

/** Per-product price override, keyed by category id then exact product name. */
const PRODUCT_PRICE_OVERRIDES: Record<string, Record<string, number>> = {
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

function resolvePrice(categoryId: string, name: string): number {
  const productOverride = PRODUCT_PRICE_OVERRIDES[categoryId]?.[name];
  if (productOverride !== undefined) return productOverride;
  return CATEGORY_PRICE_OVERRIDES[categoryId] ?? DEFAULT_PRICE;
}

/**
 * Labels a product's images as selectable options (e.g. color) instead of a
 * plain photo gallery, keyed by category id then exact product name. Order
 * must match the images' own position order (Image 1, Image 2, ...). An
 * empty string skips that image — used for a lead "cover" shot that isn't
 * itself a selectable option.
 */
const IMAGE_LABEL_OVERRIDES: Record<string, Record<string, string[]>> = {
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

const productImages = import.meta.glob("../assets/products/*/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const KNOWN_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif)$/i;
const COPY_SUFFIX = /\s*-\s*copy\s*$/i;
const CAMERA_FILENAME = /^img[_-]?\d+$/i;

/**
 * Multi-image products are grouped by a shared base name. Two suffix styles are
 * supported so the client's photo folders can be dropped in as-is:
 *   "Black_Aura (Image 2).jpeg"   -> Black_Aura, position 2
 *   "Pearl_Petals_Image_2.WEBP"   -> Pearl_Petals, position 2
 */
const IMAGE_SUFFIX_PARENS = /\s*\(\s*image\s*(\d+)\s*\)\s*$/i;
const IMAGE_SUFFIX_UNDERSCORE = /[_-]image[_-](\d+)$/i;

function stripExtensions(filename: string): string {
  let name = filename;
  // Loop: some files carry a double extension, e.g. "Emerald.JPG.jpeg".
  while (KNOWN_EXTENSIONS.test(name)) {
    name = name.replace(KNOWN_EXTENSIONS, "");
  }
  return name.replace(COPY_SUFFIX, "").trim();
}

function parseImageMarker(nameWithoutExt: string): { base: string; position: number } {
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

function humanizeBaseName(base: string): string | null {
  if (CAMERA_FILENAME.test(base)) return null;

  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Stable, URL-safe identifier derived from the base name rather than the array
 * index, so adding or removing an image never re-points an existing id (which
 * would silently corrupt a saved cart or a shared product link).
 */
function slugify(base: string): string {
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ImageEntry {
  base: string;
  position: number;
  url: string;
}

const imagesByCategory = new Map<string, ImageEntry[]>();

for (const [path, url] of Object.entries(productImages)) {
  const match = path.match(/products\/([^/]+)\/([^/]+)$/);
  if (!match) continue;

  const category = match[1];
  const file = match[2];
  if (!category || !file) continue;
  if (!KNOWN_EXTENSIONS.test(file)) continue;

  // Files prefixed with "_" are category covers, group shots, or other
  // non-product assets that live alongside the photos. See scripts/import-products.
  if (file.startsWith("_")) continue;

  const { base, position } = parseImageMarker(stripExtensions(file));
  if (!base) continue;

  const list = imagesByCategory.get(category) ?? [];
  list.push({ base, position, url });
  imagesByCategory.set(category, list);
}

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

export function getProducts(categoryId: string, categoryLabel: string): Product[] {
  const entries = imagesByCategory.get(categoryId) ?? [];

  const grouped = new Map<string, ImageEntry[]>();
  for (const entry of entries) {
    const list = grouped.get(entry.base) ?? [];
    list.push(entry);
    grouped.set(entry.base, list);
  }

  // Numeric collation so "No. 10" sorts after "No. 9", not after "No. 1".
  const bases = [...grouped.keys()].sort((a, b) => collator.compare(a, b));

  const usedSlugs = new Map<string, number>();

  return bases.map((base, index) => {
    const images = (grouped.get(base) ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((entry) => entry.url);

    let slug = slugify(base) || `item-${index + 1}`;
    const seen = usedSlugs.get(slug) ?? 0;
    usedSlugs.set(slug, seen + 1);
    if (seen > 0) slug = `${slug}-${seen + 1}`;

    const name = humanizeBaseName(base) ?? `${categoryLabel} No. ${index + 1}`;
    const imageLabels = IMAGE_LABEL_OVERRIDES[categoryId]?.[name];

    return {
      id: `${categoryId}/${slug}`,
      slug,
      name,
      image: images[0] ?? "",
      images,
      ...(imageLabels ? { imageLabels } : {}),
      price: resolvePrice(categoryId, name),
      categoryId,
      categoryName: categoryLabel,
    };
  });
}

export function getProduct(
  categoryId: string,
  categoryLabel: string,
  slug: string,
): Product | undefined {
  return getProducts(categoryId, categoryLabel).find((p) => p.slug === slug);
}

export function getProductCount(categoryId: string): number {
  const entries = imagesByCategory.get(categoryId) ?? [];
  return new Set(entries.map((e) => e.base)).size;
}

let allProductsCache: Product[] | null = null;

/** Every product across every collection, for site-wide search. */
export function getAllProducts(): Product[] {
  allProductsCache ??= collections.flatMap((c) => getProducts(c.id, c.shortName));
  return allProductsCache;
}

export function formatPrice(value: number): string {
  return `Rs ${value.toLocaleString("en-PK")}`;
}
