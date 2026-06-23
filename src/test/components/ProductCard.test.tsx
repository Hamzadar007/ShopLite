import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { ProductCard } from '@/components/ProductCard';
import { mockProduct } from '@/test/fixtures/product';

jest.mock('@/components/LazyImage', () => {
  const React = require('react');
  const { Image } = require('react-native');

  return {
    LazyImage: ({ uri }: { uri?: string | null }) =>
      uri
        ? React.createElement(Image, {
            accessibilityLabel: 'Product image',
            source: { uri },
            testID: 'product-image',
          })
        : null,
  };
});

describe('ProductCard', () => {
  it('renders image, name, and price correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Widget')).toBeTruthy();
    expect(screen.getByText('$29.99')).toBeTruthy();
    expect(screen.getByLabelText('Product image')).toHaveProp('source', {
      uri: 'https://example.com/widget.jpg',
    });
    expect(screen.getByText('Electronics')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();

    render(<ProductCard onPress={onPress} product={mockProduct} />);

    fireEvent.press(screen.getByLabelText('Test Widget, $29.99'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
