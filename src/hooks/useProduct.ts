import { useCallback, useEffect, useState } from 'react';

import { getProducts } from '@/services/product/product';
import { useProductStore } from '@/store/productStore';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Failed to load products';
}

export function useProduct() {
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextProducts = await getProducts();
      setProducts(nextProducts);
    } catch (fetchError) {
      const cachedProducts = useProductStore.getState().products;

      setError(
        cachedProducts.length > 0
          ? 'Unable to refresh products. Showing saved products.'
          : getErrorMessage(fetchError),
      );
    } finally {
      setLoading(false);
    }
  }, [setProducts]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const nextProducts = await getProducts();
        setProducts(nextProducts);
        setError(null);
      } catch (fetchError) {
        const cachedProducts = useProductStore.getState().products;

        setError(
          cachedProducts.length > 0
            ? 'Unable to refresh products. Showing saved products.'
            : getErrorMessage(fetchError),
        );
      } finally {
        setLoading(false);
      }
    }
    void loadProducts();
  }, [setProducts]);

  return {
    products,
    loading,
    error,
    refetch,
  };
}
