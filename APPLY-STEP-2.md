# Step 2 — Import all 38 products

## 1. Copy these files into your project

| File                                           | Change                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `src/lib/products.ts`                          | rewritten — groups multi-image products, skips `_`-prefixed files |
| `src/lib/collections.ts`                       | rewritten — adds **Frame Hoops**, auto-discovers category covers  |
| `src/routes/shop.$collectionId.$productId.tsx` | thumbnail gallery on detail pages                                 |
| `scripts/import-products.ps1`                  | new — copies and sorts the client photos                          |

## 2. Run the import

From the project root, with your photos folder as `-Source`:

```
powershell -ExecutionPolicy Bypass -File scripts\import-products.ps1 -Source "C:\Users\TechDotPK\Desktop\H2S Volt\Collection Pictures"
```

It prints a per-category table. Expected totals:

| Category                | Products |
| ----------------------- | -------- |
| bookmarks               | 4        |
| bracelets               | 5        |
| coasters                | 8        |
| dream-catchers          | 7        |
| frame-hoops             | 2        |
| glasses-covers          | 2        |
| key-chains              | 3        |
| table-mats              | 2        |
| wallets-purses-clutches | 5        |
| **Total**               | **38**   |

Re-running is safe — product folders are cleared and re-copied.

## 3. Restart the dev server

```
npm run dev
```

Vite caches the image glob, so a restart (not just a refresh) is needed after import.

## What the script does

- Maps each source folder to its collection id (`Dream Catchers` → `dream-catchers`, `Frame_hoop` → `frame-hoops`, and so on)
- Copies the two client-supplied covers to `src/assets/covers/`, where they are picked up automatically
- Prefixes group shots with `_` so they stay in the repo but are **not** listed as buyable products:
  `Wallets (Image 1/2)` and `Spectacle_Covers (Image 1/2)`
- Leaves the spare keychain cover in place, also `_`-prefixed

## Multi-image products

Both marker styles are supported, so nothing needs renaming:

```
Black_Aura (Image 2).jpeg     ->  Black Aura, photo 2
Pearl_Petals_Image_2.WEBP     ->  Pearl Petals, photo 2
```

The first photo is the card thumbnail; the rest appear as clickable thumbnails
on the product page. Single-image products show no thumbnail strip.

## Category covers

Drop any image named after a collection id into `src/assets/covers/` and it
replaces that category's cover — any extension works, no code change:

```
src/assets/covers/frame-hoops.png
src/assets/covers/coasters.jpg
```

Client covers already installed: `bracelets`, `key-chains`.
**Still to create (7):** dream-catchers, table-mats, bookmarks, coasters,
frame-hoops, wallets-purses-clutches, glasses-covers.

Tip: the two group shots are strong cover candidates — the wallets group shot
for `wallets-purses-clutches`, the spectacle-covers group shot for
`glasses-covers`. Copy one into `covers/` under the right name.

Until a cover is supplied, each category falls back to its bundled image, so
nothing renders broken. Frame Hoops currently borrows the dream-catchers cover
— give it its own.

## Optional rename

Table Mats products currently read "Table Cover No. 1". To match the category
name, rename the source files `Table_Cover_No._*` to `Table_Mat_No._*` and
re-run the import.
