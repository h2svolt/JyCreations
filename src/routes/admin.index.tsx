import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Check, ImagePlus, LogOut, Pencil, Trash2, UploadCloud, X } from "lucide-react";
import { checkAdminSession, logout } from "@/lib/auth-actions";
import {
  createProduct,
  deleteProduct,
  fetchAdminProducts,
  updateProductPrice,
  type AdminProduct,
} from "@/lib/products-actions";
import { collections } from "@/lib/collections";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin | JY Creations" }, { name: "robots", content: "noindex" }],
  }),
  beforeLoad: async () => {
    const { authenticated } = await checkAdminSession();
    if (!authenticated) throw redirect({ to: "/admin/login" });
  },
  loader: () => fetchAdminProducts(),
  component: AdminDashboard,
});

interface StagedImage {
  file: File;
  previewUrl: string;
}

function AddProductForm({ onCreated }: { onCreated: () => void }) {
  const [categoryId, setCategoryId] = useState(collections[0]?.id ?? "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<StagedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    setImages((prev) => [
      ...prev,
      ...accepted.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setName("");
    setPrice("");
    setImages([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId || !name.trim() || !price || images.length === 0) {
      toast.error("Fill in category, name, price, and at least one image.");
      return;
    }
    const priceNumber = Number(price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("categoryId", categoryId);
      formData.set("name", name.trim());
      formData.set("price", price);
      for (const img of images) formData.append("images", img.file);

      await createProduct({ data: formData });
      toast.success(`${name.trim()} added.`);
      resetForm();
      onCreated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6 sm:p-8">
      <h2 className="font-display text-xl text-foreground">Add Product</h2>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-foreground">
            Price (Rs)
          </label>
          <input
            id="price"
            type="number"
            min="1"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="500"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Product name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sapphire Eye"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="mt-6 space-y-2">
        <span className="text-sm font-medium text-foreground">Photos</span>
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isDragActive ? "border-primary bg-secondary/50" : "border-input hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? "Drop photos here" : "Drag & drop photos here, or click to browse"}
          </p>
        </div>

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {images.map((img, index) => (
              <div
                key={img.previewUrl}
                className="group relative aspect-square overflow-hidden rounded-lg bg-secondary"
              >
                <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Remove photo"
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-cream-light opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ImagePlus className="h-4 w-4" />
        {submitting ? "Adding…" : "Add Product"}
      </button>
    </form>
  );
}

function ProductRow({
  product,
  onDelete,
  onPriceUpdated,
  deleting,
}: {
  product: AdminProduct;
  onDelete: (product: AdminProduct) => void;
  onPriceUpdated: () => void;
  deleting: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [priceInput, setPriceInput] = useState(String(product.price));
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setPriceInput(String(product.price));
    setEditing(true);
  };

  const savePrice = async () => {
    const newPrice = Number(priceInput);
    if (!Number.isFinite(newPrice) || newPrice <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }
    if (newPrice === product.price) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await updateProductPrice({ data: { id: product.id, price: newPrice } });
      toast.success(`${product.name} price updated.`);
      setEditing(false);
      onPriceUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update price.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/40">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
        {product.images[0] && (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
        {editing ? (
          <div className="mt-1 flex items-center gap-1.5">
            <input
              type="number"
              min="1"
              step="1"
              autoFocus
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  savePrice();
                }
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-24 rounded-lg border border-input bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={savePrice}
              disabled={saving}
              aria-label="Save price"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-primary transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={saving}
              aria-label="Cancel edit"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="group/price mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {formatPrice(product.price)}
            <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover/price:opacity-100" />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDelete(product)}
        disabled={deleting}
        aria-label={`Remove ${product.name}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function AdminDashboard() {
  const products = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, AdminProduct[]>();
    for (const p of products) {
      const list = map.get(p.categoryId) ?? [];
      list.push(p);
      map.set(p.categoryId, list);
    }
    return map;
  }, [products]);

  const refresh = () => router.invalidate();

  const handleDelete = async (product: AdminProduct) => {
    if (!window.confirm(`Remove "${product.name}"? This can't be undone.`)) return;
    setRemovingId(product.id);
    try {
      await deleteProduct({ data: product.id });
      toast.success(`${product.name} removed.`);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove product.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    await navigate({ to: "/admin/login" });
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Product Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} products total.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>

      <div className="mt-8">
        <AddProductForm onCreated={refresh} />
      </div>

      <div className="mt-10 space-y-10">
        {collections.map((collection) => {
          const items = grouped.get(collection.id) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={collection.id}>
              <h2 className="font-display text-xl text-foreground">
                {collection.name} <span className="text-muted-foreground">({items.length})</span>
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onDelete={handleDelete}
                    onPriceUpdated={refresh}
                    deleting={removingId === product.id}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
