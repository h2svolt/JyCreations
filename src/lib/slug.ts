/** Stable, URL-safe identifier derived from a display name. */
export function slugify(base: string): string {
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
