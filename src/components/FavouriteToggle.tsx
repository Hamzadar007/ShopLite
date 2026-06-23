import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useFavouriteStore } from '@/store/favouriteStore';
import { colors } from '@/theme/colors';
import type { Product } from '@/types/product';
import { fontPixel, heightPixel, hp } from '@/utils/Responsive';

type FavouriteToggleProps = {
  compact?: boolean;
  product: Product;
};

export function FavouriteToggle({ compact = false, product }: FavouriteToggleProps) {
  const isFavourite = useFavouriteStore((state) =>
    state.items.some((item) => item.id === product.id),
  );
  const toggleItem = useFavouriteStore((state) => state.toggleItem);

  return (
    <Pressable
      accessibilityLabel={
        isFavourite
          ? `Remove ${product.title} from favourites`
          : `Add ${product.title} to favourites`
      }
      accessibilityRole="button"
      accessibilityState={{ selected: isFavourite }}
      hitSlop={8}
      onPress={() => toggleItem(product)}
      style={[styles.button, compact && styles.buttonCompact]}
    >
      <Ionicons
        color={isFavourite ? colors.error : colors.text}
        name={isFavourite ? 'heart' : 'heart-outline'}
        size={heightPixel(compact ? 24 : 22)}
      />
      {!compact ? (
        <Text style={[styles.label, isFavourite && styles.labelActive]}>
          {isFavourite ? 'Saved to Favourites' : 'Add to Favourites'}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: heightPixel(8),
    paddingVertical: hp(0.45),
  },
  buttonCompact: {
    marginTop: hp(0.22),
    paddingVertical: 0,
  },
  label: {
    color: colors.text,
    fontSize: fontPixel(14),
    fontWeight: '600',
  },
  labelActive: {
    color: colors.error,
  },
});
