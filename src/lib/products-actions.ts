import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin, PRODUCT_IMAGES_BUCKET } from "@/lib/supabase-admin.server";
import { isAdminAuthenticated } from "@/lib/admin-session.server";
import { collections } from "@/lib/collections";
import { slugify } from "@/lib/slug";
import type { Product } from "@/lib/products";

interface ProductRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  image_labels: string[] | null;
  sort_order: number;
}

function categoryName(categoryId: string): string {
  return collections.find((c) => c.id === categoryId)?.shortName ?? categoryId;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: `${row.category_id}/${row.slug}`,
    slug: row.slug,
    name: row.name,
    image: row.images[0] ?? "",
    images: row.images,
    ...(row.image_labels ? { imageLabels: row.image_labels } : {}),
    price: row.price,
    categoryId: row.category_id,
    categoryName: categoryName(row.category_id),
  };
}

/** Every product, for the public storefront. */
export const fetchAllProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("*")
      .order("category_id")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return (data as ProductRow[]).map(rowToProduct);
  },
);

export interface AdminProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Not authenticated.");
  }
}

/** Every product, for the admin dashboard (includes the row id for deletion). */
export const fetchAdminProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminProduct[]> => {
    await requireAdmin();
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("*")
      .order("category_id")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return (data as ProductRow[]).map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      categoryName: categoryName(row.category_id),
      name: row.name,
      slug: row.slug,
      price: row.price,
      images: row.images,
    }));
  },
);

const IMAGE_CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

export const createProduct = createServerFn({ method: "POST" })
  .validator((formData: unknown) => {
    if (!(formData instanceof FormData)) throw new Error("Expected form data.");
    return formData;
  })
  .handler(async ({ data: formData }) => {
    await requireAdmin();

    const categoryId = String(formData.get("categoryId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const price = Number(formData.get("price"));
    const images = formData.getAll("images").filter((v): v is File => v instanceof File);

    if (!collections.some((c) => c.id === categoryId)) {
      throw new Error("Invalid category.");
    }
    if (!name) throw new Error("Product name is required.");
    if (!Number.isFinite(price) || price <= 0) throw new Error("Price must be a positive number.");
    if (images.length === 0) throw new Error("At least one image is required.");

    const supabase = getSupabaseAdmin();

    // Ensure the slug is unique within the category (matches the display
    // name unless that name is already taken, in which case -2, -3, ... ).
    const baseSlug = slugify(name) || "product";
    const { data: existing, error: existingError } = await supabase
      .from("products")
      .select("slug, sort_order")
      .eq("category_id", categoryId);
    if (existingError) throw new Error(existingError.message);

    const existingSlugs = new Set((existing ?? []).map((r) => r.slug as string));
    let slug = baseSlug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const nextSortOrder =
      (existing ?? []).reduce((max, r) => Math.max(max, r.sort_order as number), -1) + 1;

    const imageUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i]!;
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const storagePath = `${categoryId}/${slug}-${i + 1}.${ext}`;
      const buffer = new Uint8Array(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(storagePath, buffer, {
          contentType: IMAGE_CONTENT_TYPES[ext] ?? file.type ?? "application/octet-stream",
          upsert: true,
        });
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .getPublicUrl(storagePath);
      imageUrls.push(publicUrlData.publicUrl);
    }

    const { error: insertError } = await supabase.from("products").insert({
      category_id: categoryId,
      name,
      slug,
      price,
      images: imageUrls,
      sort_order: nextSortOrder,
    });
    if (insertError) throw new Error(insertError.message);

    return { success: true as const };
  });

export const updateProductPrice = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (
      typeof input !== "object" ||
      input === null ||
      !("id" in input) ||
      !("price" in input) ||
      typeof (input as { id: unknown }).id !== "string" ||
      typeof (input as { price: unknown }).price !== "number"
    ) {
      throw new Error("Expected { id: string, price: number }.");
    }
    const { id, price } = input as { id: string; price: number };
    if (!id) throw new Error("Product id is required.");
    if (!Number.isFinite(price) || price <= 0) throw new Error("Price must be a positive number.");
    return { id, price };
  })
  .handler(async ({ data: { id, price } }) => {
    await requireAdmin();
    const { error } = await getSupabaseAdmin().from("products").update({ price }).eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true as const };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator((id: unknown) => {
    if (typeof id !== "string" || !id) throw new Error("Product id is required.");
    return id;
  })
  .handler(async ({ data: id }) => {
    await requireAdmin();
    const supabase = getSupabaseAdmin();

    const { data: row, error: fetchError } = await supabase
      .from("products")
      .select("images")
      .eq("id", id)
      .single();
    if (fetchError) throw new Error(fetchError.message);

    const prefix = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
    const paths = ((row?.images as string[] | undefined) ?? [])
      .map((url) => {
        const index = url.indexOf(prefix);
        return index === -1 ? null : url.slice(index + prefix.length);
      })
      .filter((p): p is string => p !== null);

    if (paths.length > 0) {
      const { error: removeError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .remove(paths);
      if (removeError) console.error("Failed to remove storage objects:", removeError.message);
    }

    const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
    if (deleteError) throw new Error(deleteError.message);

    return { success: true as const };
  });
