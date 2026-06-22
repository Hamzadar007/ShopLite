import type { AddressField, ShippingAddress } from '@/types/checkout';

export type AddressErrors = Partial<Record<AddressField, string>>;

function isBlank(value: string) {
  return value.trim().length === 0;
}

export function validateAddress(address: ShippingAddress): AddressErrors {
  const errors: AddressErrors = {};

  if (isBlank(address.fullName)) {
    errors.fullName = 'Full name is required';
  }

  if (isBlank(address.streetAddress)) {
    errors.streetAddress = 'Street address is required';
  }

  if (isBlank(address.city)) {
    errors.city = 'City is required';
  }

  if (isBlank(address.state)) {
    errors.state = 'State or province is required';
  }

  if (isBlank(address.postalCode)) {
    errors.postalCode = 'Postal code is required';
  }

  if (isBlank(address.country)) {
    errors.country = 'Country is required';
  }

  if (isBlank(address.phone)) {
    errors.phone = 'Phone number is required';
  }

  return errors;
}

export function hasAddressErrors(errors: AddressErrors) {
  return Object.keys(errors).length > 0;
}
