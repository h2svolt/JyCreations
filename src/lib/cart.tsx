import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./products";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  categoryId: string;
}

type CartAction =
  | { type: "add"; product: Product; quantity: number }
  | { type: "remove"; id: string }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "jy-creations-cart-v1";
const MAX_QUANTITY = 99;

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;

    case "add": {
      const existing = state.find((item) => item.id === action.product.id);

      // Adding an existing product bumps its quantity instead of creating a
      // duplicate row.
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + action.quantity, MAX_QUANTITY),
              }
            : item,
        );
      }

      return [
        ...state,
        {
          id: action.product.id,
          name: action.product.name,
          image: action.product.image,
          price: action.product.price,
          quantity: Math.min(action.quantity, MAX_QUANTITY),
          categoryId: action.product.categoryId,
        },
      ];
    }

    case "setQuantity": {
      // Dropping to zero or below removes the line entirely.
      if (action.quantity < 1) {
        return state.filter((item) => item.id !== action.id);
      }
      return state.map((item) =>
        item.id === action.id
          ? { ...item, quantity: Math.min(action.quantity, MAX_QUANTITY) }
          : item,
      );
    }

    case "remove":
      return state.filter((item) => item.id !== action.id);

    case "clear":
      return [];

    default:
      return state;
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item["id"] === "string" &&
    typeof item["name"] === "string" &&
    typeof item["image"] === "string" &&
    typeof item["price"] === "number" &&
    typeof item["quantity"] === "number" &&
    item["quantity"] > 0
  );
}

interface CartContextValue {
  items: CartItem[];
  /** False during SSR and the first client render — see note below. */
  hydrated: boolean;
  totalQuantity: number;
  totalValue: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // IMPORTANT (TanStack Start / SSR): the reducer must start empty. localStorage
  // does not exist on the server, so reading it in the initialiser would either
  // crash the server render or produce server/client markup that disagrees.
  // We load the saved cart in an effect, after the first client render.
  const [items, dispatch] = useReducer(cartReducer, [] as CartItem[]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: "hydrate", items: parsed.filter(isCartItem) });
        }
      }
    } catch {
      // Corrupt or unavailable storage (private mode, quota) — start empty.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    // Don't write until the initial read has finished, or we'd immediately
    // overwrite the saved cart with the empty starting state.
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore write failures; the cart still works for this session.
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      hydrated,
      totalQuantity,
      totalValue,
      addItem: (product, quantity = 1) => dispatch({ type: "add", product, quantity }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      setQuantity: (id, quantity) => dispatch({ type: "setQuantity", id, quantity }),
      increment: (id) => {
        const current = items.find((item) => item.id === id);
        dispatch({ type: "setQuantity", id, quantity: (current?.quantity ?? 0) + 1 });
      },
      decrement: (id) => {
        const current = items.find((item) => item.id === id);
        dispatch({ type: "setQuantity", id, quantity: (current?.quantity ?? 0) - 1 });
      },
      clear: () => dispatch({ type: "clear" }),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      setOpen: setIsOpen,
    };
  }, [items, hydrated, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
