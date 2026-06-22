import { render, screen } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';

describe('Screen', () => {
  it('renders children', () => {
    render(
      <Screen>
        <Text>ShopLite test</Text>
      </Screen>,
    );

    expect(screen.getByText('ShopLite test')).toBeTruthy();
  });
});
