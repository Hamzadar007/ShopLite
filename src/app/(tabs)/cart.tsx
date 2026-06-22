import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

export default function CartScreen() {
  return (
    <Screen>
      <Text style={{ color: colors.text }}>Cart Screen</Text>
    </Screen>
  );
}
