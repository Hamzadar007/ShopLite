import { useCallback, useEffect, useState } from 'react';

import { getProduct } from '@/services/product/product';
import { useProductStore } from '@/store/productStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import type { Product } from '@/types/product';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Failed to load product';
}

export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!Number.isFinite(productId)) {
      setProduct(null);
      setError('Invalid product id');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextProduct = await getProduct(productId);
      setProduct(nextProduct);
    } catch (fetchError) {
      const fallbackProduct = useProductStore
        .getState()
        .products.find((item) => item.id === productId);

      if (fallbackProduct) {
        setProduct(fallbackProduct);
        setError('Unable to load product details. Showing saved product.');
      } else {
        setProduct(null);
        setError(getErrorMessage(fetchError));
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (!product) {
      return;
    }

    useRecentlyViewedStore.getState().addProduct(product);
  }, [product]);

  return {
    product,
    loading,
    error,
    refetch,
  };
}
