import { ENDPOINTS } from '@/constants/endpoints';
import { apiClient } from '@/services/api';
import type { Product } from '@/types/product';

type ProductResponse = {
  products: ApiProduct[];
};

type ApiProduct = {
  id: number;
  title: string;
  price: number;
  category?: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
};

export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get<ProductResponse>(ENDPOINTS.products);

  return response.data.products.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    description: product.description,
    image: product.thumbnail ?? product.images?.[0],
  }));
}
