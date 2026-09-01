# Step 3 — UI/UX polish

Copy the four `src/routes/` files over your project's, overwriting when asked.
No new dependencies, no manual steps. Restart the dev server after applying.

## What changed

| File                                      | Change                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/index.tsx`                    | Homepage collections grid: `lg:grid-cols-4` → `md:grid-cols-3`, so 9 categories render as a clean 3×3 instead of 4+4+1. First 3 card images now `loading="eager"` for LCP. Subtle border added.                                                                                                           |
| `src/routes/shop.index.tsx`               | Same grid + border + eager-loading treatment. Removed the "More products coming soon" line — every category is populated now.                                                                                                                                                                             |
| `src/routes/shop.$collectionId.index.tsx` | Category page hero now uses the collection's cover as an atmospheric background image with a legibility gradient — much more premium than the flat coloured strip. Product cards get a border and a hover ring. Multi-image products show a small `📷 N` badge on the top-right of their card.            |
| `src/routes/contact.tsx`                  | Contact form is functional: fields are React-controlled, submit prevents default reload, validates required fields, shows a toast, disables the button and shows "Sending…" while the fake latency runs, then clears the form. Ready to swap the `setTimeout` for a real `fetch` when the backend exists. |

## What was deliberately not touched

Header, footer, About page, homepage hero — all fine as-is. Keeping scope tight
means fewer things to review, and none of these are actually broken.

## Verify

- `/` — 9 category cards in a 3×3 grid, subtle border, hover lifts
- `/shop` — same layout, "explore all nine below" wording
- `/shop/bracelets` — hero uses the bracelets cover as background; Black Aura card shows a `📷 3` badge in the top-right; other bracelets don't
- `/contact` — click Send with empty fields → error toast; fill in name/email/message → button shows "Sending…" then success toast and the form clears
