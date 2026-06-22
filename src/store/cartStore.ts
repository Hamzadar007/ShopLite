import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CartItem } from '@/types/cart';
import type { Product } from '@/types/product';

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: Product['id']) => void;
  incrementItem: (productId: Product['id']) => void;
  decrementItem: (productId: Product['id']) => void;
  updateQuantity: (productId: Product['id'], quantity: number) => void;
  getItemQuantity: (productId: Product['id']) => number;
  clearCart: () => void;
};

function normalizeQuantity(quantity: number) {
  return Math.max(0, Math.trunc(quantity));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const nextQuantity = normalizeQuantity(quantity);

        if (nextQuantity === 0) {
          return;
        }

        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);

          if (!existingItem) {
            return {
              items: [...state.items, { product, quantity: nextQuantity }],
            };
          }

          return {
            items: state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + nextQuantity }
                : item,
            ),
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      incrementItem: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }));
      },
      decrementItem: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },
      updateQuantity: (productId, quantity) => {
        const nextQuantity = normalizeQuantity(quantity);

        set((state) => ({
          items:
            nextQuantity === 0
              ? state.items.filter((item) => item.product.id !== productId)
              : state.items.map((item) =>
                  item.product.id === productId ? { ...item, quantity: nextQuantity } : item,
                ),
        }));
      },
      getItemQuantity: (productId) =>
        get().items.find((item) => item.product.id === productId)?.quantity ?? 0,
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'shoplite-cart',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
