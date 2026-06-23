import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import CartScreen from '@/app/(tabs)/cart';
import { useCartStore } from '@/store/cartStore';
import { mockProduct } from '@/test/fixtures/product';

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) =>
      React.createElement(View, props, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Ionicons: () => React.createElement(Text, null, 'icon'),
  };
});

jest.mock('@/components/CartItemRow', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    CartItemRow: ({ item }: { item: { product: { title: string }; quantity: number } }) =>
      React.createElement(Text, null, `${item.product.title} x${item.quantity}`),
  };
});

describe('CartScreen', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('matches snapshot when cart is empty', () => {
    const { toJSON } = render(<CartScreen />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders cart summary when cart has items', () => {
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 2 }],
    });

    render(<CartScreen />);

    expect(screen.getByText('Cart')).toBeTruthy();
    expect(screen.getByText('2 items')).toBeTruthy();
    expect(screen.getByText('Test Widget x2')).toBeTruthy();
    expect(screen.getAllByText('$59.98').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Proceed to Checkout')).toBeTruthy();
  });
});
