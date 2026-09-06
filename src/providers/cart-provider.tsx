"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { getCartAction, syncCartAction } from "@/modules/auth/actions";
import { User } from "@/payload-types";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  isSample?: boolean;
}

interface CartContextType {
  items: CartItem[];
  isLoaded: boolean;
  total: number;
  count: number;
  addToCart: (
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      slug?: string | null;
      isSample?: boolean;
    },
    quantity?: number
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "cisco_chem_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isSyncing = useRef(false);

  // Initialize cart once on root mount
  useEffect(() => {
    const initCart = async () => {
      if (initialUser) {
        // Fetch DB cart once
        const dbCart = await getCartAction();
        const localCartStr = localStorage.getItem(CART_STORAGE_KEY);
        const localItems: CartItem[] = localCartStr
          ? JSON.parse(localCartStr)
          : [];

        if (dbCart && dbCart.length > 0) {
          interface PayloadCartItem {
            product: string | number | { id: string | number };
            quantity: number;
            name?: string | null;
            price?: number | null;
            image?: string | null;
            slug?: string | null;
            isSample?: boolean | null;
          }

          const mergedItems: CartItem[] = [
            ...(dbCart as PayloadCartItem[]).map((itemValue) => {
              const productId = String(
                typeof itemValue.product === "object" && itemValue.product !== null
                  ? itemValue.product.id
                  : itemValue.product
              );

              const itemId = itemValue.isSample
                ? `${productId}-sample`
                : productId;

              return {
                id: itemId,
                quantity: itemValue.quantity || 1,
                name: itemValue.name || "",
                price: itemValue.price || 0,
                image: itemValue.image || "",
                slug: itemValue.slug || "",
                isSample: itemValue.isSample || false,
              };
            }),
          ];

          if (localItems.length > 0) {
            localItems.forEach((localItem) => {
              const localId = String(localItem.id);
              const existingIndex = mergedItems.findIndex(
                (item) => String(item.id) === localId
              );
              if (existingIndex > -1) {
                mergedItems[existingIndex].quantity += localItem.quantity;
              } else {
                mergedItems.push({
                  ...localItem,
                  id: localId,
                });
              }
            });

            // Sync merged result back to DB
            await syncCartAction(mergedItems);
            localStorage.removeItem(CART_STORAGE_KEY);
          }

          // Final deduplication
          const uniqueItems: CartItem[] = [];
          mergedItems.forEach((item) => {
            const existing = uniqueItems.find((u) => u.id === item.id);
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              uniqueItems.push(item);
            }
          });

          setItems(uniqueItems);
        } else if (localItems.length > 0) {
          // No DB cart but has local items -> sync local to DB
          const uniqueLocal: CartItem[] = [];
          localItems.forEach((item) => {
            const id = String(item.id);
            const existing = uniqueLocal.find((u) => u.id === id);
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              uniqueLocal.push({ ...item, id });
            }
          });

          await syncCartAction(uniqueLocal);
          setItems(uniqueLocal);
          localStorage.removeItem(CART_STORAGE_KEY);
        } else {
          setItems([]);
        }
      } else {
        // Guest user: load from local storage
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart));
          } catch {
            setItems([]);
          }
        }
      }
      setIsLoaded(true);
    };

    initCart();
  }, [initialUser]);

  const saveCart = async (newItems: CartItem[]) => {
    setItems(newItems);

    if (initialUser) {
      isSyncing.current = true;
      await syncCartAction(newItems);
      isSyncing.current = false;
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    }
  };

  const addToCart = (
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      slug?: string | null;
      isSample?: boolean;
    },
    quantity: number = 1
  ) => {
    const existingItem = items.find((item) => item.id === product.id);
    let newItems: CartItem[];

    if (existingItem) {
      newItems = items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price || 0,
        quantity,
        image: product.image,
        slug: product.slug || "",
        isSample: product.isSample || false,
      };
      newItems = [...items, newItem];
    }

    saveCart(newItems);
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    saveCart(newItems);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const newItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoaded,
        total,
        count,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
