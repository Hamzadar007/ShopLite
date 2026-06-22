import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

export default function ProductsScreen() {
  return (
    <Screen>
      <Text style={{ color: colors.text }}>Products Screen</Text>
    </Screen>
  );
}
