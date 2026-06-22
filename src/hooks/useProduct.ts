import { useCallback, useEffect, useState } from 'react';

import { getProducts } from '@/services/product/product';
import { useProductStore } from '@/store/productStore';
import type { Product } from '@/types/product';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Failed to load products';
}

export function useProduct() {
  const setCachedProducts = useProductStore((state) => state.setProducts);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextProducts = await getProducts();
      setProducts(nextProducts);
      setCachedProducts(nextProducts);
    } catch (fetchError) {
      const cachedProducts = useProductStore.getState().products;
      let nextError = getErrorMessage(fetchError);

      setProducts((currentProducts) => {
        if (currentProducts.length > 0) {
          nextError = 'Unable to refresh products.';
          return currentProducts;
        }

        if (cachedProducts.length > 0) {
          nextError = 'Unable to refresh products. Showing saved products.';
          return cachedProducts;
        }

        return [];
      });

      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, [setCachedProducts]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    products,
    loading,
    error,
    refetch,
  };
}
