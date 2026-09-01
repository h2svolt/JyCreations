/**
 * Each collection gets its own vintage accent color instead of the whole
 * site sharing one brand color. Used for eyebrow labels, hover rings, and
 * small badges — never for primary CTAs like "Add to Cart", which stay
 * one consistent color everywhere so the action reads the same across
 * every page.
 */
export interface CategoryTheme {
  accent: string;
  accentForeground: string;
}

const DEFAULT_THEME: CategoryTheme = { accent: "#B5502E", accentForeground: "#FFFBF0" };

export const categoryThemes: Record<string, CategoryTheme> = {
  "dream-catchers": { accent: "#0F5257", accentForeground: "#FFFBF0" }, // deep teal
  "table-mats": { accent: "#B5502E", accentForeground: "#FFFBF0" }, // terracotta
  "key-chains": { accent: "#C68A28", accentForeground: "#2B1D12" }, // golden ochre
  bookmarks: { accent: "#6E2B3A", accentForeground: "#FFFBF0" }, // burgundy
  coasters: { accent: "#2F4A34", accentForeground: "#FFFBF0" }, // forest green
  bracelets: { accent: "#1B5E73", accentForeground: "#FFFBF0" }, // peacock blue
  "frame-hoops": { accent: "#6B6E3A", accentForeground: "#FFFBF0" }, // olive
  "wallets-purses-clutches": { accent: "#5B2A5E", accentForeground: "#FFFBF0" }, // plum
  "glasses-covers": { accent: "#233B5C", accentForeground: "#FFFBF0" }, // navy
};

export function getCategoryTheme(collectionId: string): CategoryTheme {
  return categoryThemes[collectionId] ?? DEFAULT_THEME;
}

/** Spread onto a `style` prop to expose the accent as `var(--cat)` / `var(--cat-fg)`
 * for use with static Tailwind arbitrary-value classes, e.g. `text-[color:var(--cat)]`. */
export function categoryStyleVars(collectionId: string): Record<string, string> {
  const theme = getCategoryTheme(collectionId);
  return { "--cat": theme.accent, "--cat-fg": theme.accentForeground };
}
