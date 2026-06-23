import { beforeEach, describe, expect, it } from '@jest/globals';

import { useCartTotal } from '@/hooks/useCartTotal';
import { useCartStore } from '@/store/cartStore';
import { mockProduct, mockProductTwo } from '@/test/fixtures/product';

function getTotal() {
  return useCartTotal(useCartStore.getState().items);
}

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds items, adjusts quantity, removes items, and recalculates totals', () => {
    const { addItem, incrementItem, decrementItem, removeItem, updateQuantity } =
      useCartStore.getState();

    addItem(mockProduct, 2);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().getItemQuantity(mockProduct.id)).toBe(2);
    expect(getTotal()).toBeCloseTo(59.98);

    addItem(mockProductTwo, 1);
    expect(useCartStore.getState().items).toHaveLength(2);
    expect(getTotal()).toBeCloseTo(75.48);

    incrementItem(mockProduct.id);
    expect(useCartStore.getState().getItemQuantity(mockProduct.id)).toBe(3);
    expect(getTotal()).toBeCloseTo(105.47);

    updateQuantity(mockProductTwo.id, 3);
    expect(useCartStore.getState().getItemQuantity(mockProductTwo.id)).toBe(3);
    expect(getTotal()).toBeCloseTo(136.47);

    decrementItem(mockProduct.id);
    expect(useCartStore.getState().getItemQuantity(mockProduct.id)).toBe(2);
    expect(getTotal()).toBeCloseTo(106.48);

    removeItem(mockProduct.id);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().getItemQuantity(mockProduct.id)).toBe(0);
    expect(getTotal()).toBeCloseTo(46.5);
  });
});
