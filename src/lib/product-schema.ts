import { SITE_URL } from "./site";
import type { Product } from "./products";

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: `${product.name} — handmade ${product.categoryName.toLowerCase()} from JY Creations.`,
    category: product.categoryName,
    brand: { "@type": "Brand", name: "JY Creations" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.categoryId}/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
