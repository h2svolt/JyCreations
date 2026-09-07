// Regenerates public/sitemap.xml from the live Supabase catalog (static
// pages + every current collection + every current product). The catalog is
// now admin-managed and changes over time, so re-run this after adding or
// removing products in bulk to keep the sitemap accurate:
//
//   node scripts/generate-sitemap.mjs

import { readFileSync, writeFileSync } from "fs";
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
const SITE_URL = "https://www.jycreations.store";

const STATIC_PATHS = ["/", "/shop", "/about", "/contact", "/policies/shipping-policy"];

// Keep in sync with src/lib/collections.ts's collection ids.
const CATEGORY_IDS = [
  "dream-catchers",
  "table-mats",
  "key-chains",
  "bookmarks",
  "coasters",
  "bracelets",
  "frame-hoops",
  "wallets-purses-clutches",
  "glasses-covers",
  "wearables",
];

const { data: products, error } = await supabase
  .from("products")
  .select("category_id, slug")
  .order("category_id")
  .order("sort_order");
if (error) throw error;

const urls = [
  ...STATIC_PATHS,
  ...CATEGORY_IDS.map((id) => `/shop/${id}`),
  ...products.map((p) => `/shop/${p.category_id}/${p.slug}`),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

writeFileSync(path.join(root, "public", "sitemap.xml"), xml);
console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);
