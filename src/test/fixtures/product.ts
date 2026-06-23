import type { Product } from '@/types/product';

export const mockProduct: Product = {
  id: 1,
  title: 'Test Widget',
  price: 29.99,
  category: 'electronics',
  image: 'https://example.com/widget.jpg',
  stock: 10,
};

export const mockProductTwo: Product = {
  id: 2,
  title: 'Sample Gadget',
  price: 15.5,
  category: 'home-decoration',
  image: 'https://example.com/gadget.jpg',
  stock: 5,
};
