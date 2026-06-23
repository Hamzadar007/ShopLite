import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { appStorage } from '@/services/storage/storage';
import type { Product } from '@/types/product';

const MAX_RECENT_ITEMS = 10;

type RecentlyViewedState = {
  items: Product[];
  addProduct: (product: Product) => void;
  clearRecentlyViewed: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addProduct: (product) => {
        set((state) => {
          const withoutCurrent = state.items.filter((item) => item.id !== product.id);
          return { items: [product, ...withoutCurrent].slice(0, MAX_RECENT_ITEMS) };
        });
      },
      clearRecentlyViewed: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'shoplite-recently-viewed',
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
