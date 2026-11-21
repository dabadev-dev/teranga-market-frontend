
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "../services/productService";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "terangamarket-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) return [];

      const parsed: unknown = JSON.parse(savedCart);

      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (item): item is CartItem =>
          item !== null &&
          typeof item === "object" &&
          "product" in item &&
          "quantity" in item &&
          typeof item.quantity === "number" &&
          item.quantity > 0 &&
          item.product !== null &&
          typeof item.product === "object" &&
          "id" in item.product &&
          "nom" in item.product &&
          "prix" in item.product
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0 || product.stock <= 0) return;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      const currentQuantity = existingItem?.quantity ?? 0;
      const newQuantity = Math.min(
        currentQuantity + quantity,
        product.stock
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: newQuantity }
            : item
        );
      }

      return [
        ...currentItems,
        { product, quantity: Math.min(quantity, product.stock) },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id !== productId) return item;

        return {
          ...item,
          quantity: Math.min(quantity, item.product.stock),
        };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.product.prix) * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart doit être utilisé à l'intérieur de CartProvider"
    );
  }

  return context;
}
