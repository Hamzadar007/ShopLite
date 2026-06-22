export const ENDPOINTS = {
  products: '/products',
  product: (id: number) => `/products/${id}`,
} as const;

export const PRODUCTS_ENDPOINT = ENDPOINTS.products;
