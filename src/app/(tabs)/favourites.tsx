import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

export default function FavouritesScreen() {
  return (
    <Screen>
      <Text style={{ color: colors.text }}>Favourites Screen</Text>
    </Screen>
  );
}
