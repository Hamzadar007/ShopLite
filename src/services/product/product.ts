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
  stock?: number;
  availabilityStatus?: string;
  discountPercentage?: number;
};

function mapApiProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    description: product.description,
    image: product.thumbnail ?? product.images?.[0],
    images: product.images,
    stock: product.stock,
    availabilityStatus: product.availabilityStatus,
    discountPercentage: product.discountPercentage,
  };
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get<ProductResponse>(ENDPOINTS.products);

  return response.data.products.map(mapApiProduct);
}

export async function getProduct(id: number): Promise<Product> {
  const response = await apiClient.get<ApiProduct>(ENDPOINTS.product(id));

  return mapApiProduct(response.data);
}
