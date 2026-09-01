import dreamCatchers from "@/assets/dream-catchers.webp";
import tableMats from "@/assets/table-mats.webp";
import keyChains from "@/assets/key-chains.webp";
import bookmarks from "@/assets/bookmarks.webp";
import coasters from "@/assets/coasters.webp";
import bracelets from "@/assets/bracelets.webp";
import walletsPurses from "@/assets/wallets-purses.webp";
import glassesCovers from "@/assets/glasses-covers.webp";

export interface Collection {
  id: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
}

/**
 * Category covers are auto-discovered from src/assets/covers/. Drop in a file
 * named after the collection id (e.g. "frame-hoops.png") and it is used
 * automatically — any image extension works. If no override is present we fall
 * back to the bundled cover below, so the site never renders a broken image.
 */
const coverOverrides = import.meta.glob("../assets/covers/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const coversById = new Map<string, string>();
for (const [path, url] of Object.entries(coverOverrides)) {
  const file = path.split("/").pop();
  if (!file) continue;
  const id = file.replace(/\.[^.]+$/, "").toLowerCase();
  coversById.set(id, url);
}

function cover(id: string, fallback: string): string {
  return coversById.get(id) ?? fallback;
}

export const collections: Collection[] = [
  {
    id: "dream-catchers",
    name: "Dream Catchers",
    shortName: "Dream Catchers",
    description: "Handwoven dream catchers with delicate feathers, beads, and floral accents.",
    image: cover("dream-catchers", dreamCatchers),
  },
  {
    id: "table-mats",
    name: "Table Mats",
    shortName: "Table Mats",
    description: "Elegant embroidered table mats to grace your dining space.",
    image: cover("table-mats", tableMats),
  },
  {
    id: "key-chains",
    name: "Key Chains",
    shortName: "Key Chains",
    description: "Charming key chains with tassels, charms, and personalized initials.",
    image: cover("key-chains", keyChains),
  },
  {
    id: "bookmarks",
    name: "Bookmarks",
    shortName: "Bookmarks",
    description: "Pressed-flower bookmarks for the romantic reader.",
    image: cover("bookmarks", bookmarks),
  },
  {
    id: "coasters",
    name: "Coasters",
    shortName: "Coasters",
    description: "Floral coasters with beautiful trim for your coffee moments.",
    image: cover("coasters", coasters),
  },
  {
    id: "bracelets",
    name: "Bracelets",
    shortName: "Bracelets",
    description: "Handmade beaded bracelets, each crafted by hand.",
    image: cover("bracelets", bracelets),
  },
  {
    id: "frame-hoops",
    name: "Frame Hoops",
    shortName: "Frame Hoops",
    description: "Embroidered hoop art, stitched by hand and framed ready to hang.",
    image: cover("frame-hoops", dreamCatchers),
  },
  {
    id: "wallets-purses-clutches",
    name: "Wallets, Purses & Clutches",
    shortName: "Wallets & Clutches",
    description: "Soft embroidered clutches and everyday essentials.",
    image: cover("wallets-purses-clutches", walletsPurses),
  },
  {
    id: "glasses-covers",
    name: "Glasses / Spectacle Covers",
    shortName: "Glasses Covers",
    description: "Padded spectacle covers with delicate floral embroidery.",
    image: cover("glasses-covers", glassesCovers),
  },
  {
    id: "wearables",
    name: "Wearables",
    shortName: "Wearables",
    description: "Handmade wearable accessories, crafted with care for everyday wear.",
    // No dedicated cover shot yet — drop one into src/assets/covers/wearables.*
    // to replace this placeholder (see the note above).
    image: cover("wearables", bracelets),
  },
];
