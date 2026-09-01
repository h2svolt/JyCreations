import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  label?: string;
  /** Opens the cart drawer after adding. Off by default so grid browsing isn't interrupted. */
  openCartOnAdd?: boolean;
  /** Renders as a compact circular icon button with no visible label, for tight card layouts. */
  iconOnly?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  label = "Add to Cart",
  openCartOnAdd = false,
  iconOnly = false,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);

    toast.success(`${product.name} added to cart`, {
      description: quantity > 1 ? `Quantity: ${quantity}` : undefined,
      action: { label: "View cart", onClick: openCart },
    });

    if (openCartOnAdd) openCart();

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/85 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        iconOnly ? "h-10 w-10 shrink-0" : "px-5 py-2.5 text-sm",
        className,
      )}
    >
      {justAdded ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      <span className={iconOnly ? "sr-only" : undefined}>{justAdded ? "Added" : label}</span>
    </button>
  );
}
