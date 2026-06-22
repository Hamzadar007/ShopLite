import type { CartItem } from './cart';

export type ShippingAddress = {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type PlacedOrder = {
  id: string;
  items: CartItem[];
  subtotal: number;
  address: ShippingAddress;
  placedAt: string;
};

export type AddressField = keyof ShippingAddress;
