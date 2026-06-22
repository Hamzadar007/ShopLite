import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { appStorage } from '@/services/storage/storage';
import type { Product } from '@/types/product';

type ProductState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  clearProducts: () => void;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      setProducts: (products) => {
        set({ products });
      },
      clearProducts: () => {
        set({ products: [] });
      },
    }),
    {
      name: 'shoplite-products',
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({ products: state.products }),
    },
  ),
);
