import { create } from 'zustand';

import type { PlacedOrder, ShippingAddress } from '@/types/checkout';

type CheckoutState = {
  address: ShippingAddress | null;
  placedOrder: PlacedOrder | null;
  setAddress: (address: ShippingAddress) => void;
  setPlacedOrder: (order: PlacedOrder) => void;
  resetCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  address: null,
  placedOrder: null,
  setAddress: (address) => {
    set({ address });
  },
  setPlacedOrder: (placedOrder) => {
    set({ placedOrder });
  },
  resetCheckout: () => {
    set({ address: null, placedOrder: null });
  },
}));
