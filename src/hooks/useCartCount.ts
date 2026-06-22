import { useCartStore } from '@/store/cartStore';

export function useCartCount() {
  return useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
}
