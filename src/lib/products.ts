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

/** Filters an already-fetched product list down to one category. */
export function getProducts(all: Product[], categoryId: string): Product[] {
  return all.filter((p) => p.categoryId === categoryId);
}

/** Finds one product by category + slug within an already-fetched list. */
export function getProduct(all: Product[], categoryId: string, slug: string): Product | undefined {
  return all.find((p) => p.categoryId === categoryId && p.slug === slug);
}

export function getProductCount(all: Product[], categoryId: string): number {
  return getProducts(all, categoryId).length;
}

export function formatPrice(value: number): string {
  return `Rs ${value.toLocaleString("en-PK")}`;
}
