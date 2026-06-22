import type { CartItem } from '@/types/cart';

export function useCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}
