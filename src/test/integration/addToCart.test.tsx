import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';
import { Text } from 'react-native';

import { AddToCartControls } from '@/components/AddToCartControls';
import { useCartCount } from '@/hooks/useCartCount';
import { useCartStore } from '@/store/cartStore';
import { mockProduct } from '@/test/fixtures/product';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text: MockText } = require('react-native');

  return {
    Ionicons: () => React.createElement(MockText, null, 'icon'),
  };
});

function CartBadge() {
  const count = useCartCount();

  return <Text testID="cart-badge">{count}</Text>;
}

describe('add to cart integration', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds to cart from detail controls and increments cart badge count', async () => {
    render(
      <>
        <AddToCartControls inStock product={mockProduct} />
        <CartBadge />
      </>,
    );

    expect(screen.getByTestId('cart-badge')).toHaveTextContent('0');

    fireEvent.press(screen.getByLabelText('Add Test Widget to cart'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');
    expect(useCartStore.getState().getItemQuantity(mockProduct.id)).toBe(1);
  });
});
