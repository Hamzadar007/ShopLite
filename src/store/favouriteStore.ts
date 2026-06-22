import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { appStorage } from '@/services/storage/storage';
import type { Product } from '@/types/product';

type FavouriteState = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: Product['id']) => void;
  toggleItem: (product: Product) => void;
  isFavourite: (productId: Product['id']) => boolean;
  clearFavourites: () => void;
};

export const useFavouriteStore = create<FavouriteState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const alreadyExists = state.items.some((item) => item.id === product.id);

          if (alreadyExists) {
            return state;
          }

          return { items: [...state.items, product] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      toggleItem: (product) => {
        const alreadyExists = get().items.some((item) => item.id === product.id);

        if (alreadyExists) {
          get().removeItem(product.id);
          return;
        }

        get().addItem(product);
      },
      isFavourite: (productId) => get().items.some((item) => item.id === productId),
      clearFavourites: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'shoplite-favourites',
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
