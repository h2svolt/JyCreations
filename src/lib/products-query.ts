import { queryOptions } from "@tanstack/react-query";
import { fetchAllProducts } from "@/lib/products-actions";

/** The full product catalog, fetched once and cached across the app —
 * prefetched in the root route loader so it's ready before any page renders. */
export const allProductsQueryOptions = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: () => fetchAllProducts(),
    staleTime: 60_000,
  });
