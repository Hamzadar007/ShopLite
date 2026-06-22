import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/theme/colors';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

type ProductCardProps = {
  onPress?: () => void;
  product: Product;
  style?: StyleProp<ViewStyle>;
};

export function ProductCard({ onPress, product, style }: ProductCardProps) {
  const category = formatCategory(product.category);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, style, pressed && styles.cardPressed]}
    >
      <View style={styles.imageWrap}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.metaRow}>
          <Text numberOfLines={1} style={styles.category}>
            {category}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.productTitle}>
          {product.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function formatCategory(category?: string) {
  if (!category) {
    return 'Featured';
  }

  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'stretch',
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: heightPixel(14),
    overflow: 'hidden',
    paddingHorizontal: heightPixel(10),
    paddingVertical: hp(1.12),
    shadowColor: '#1C1C1E',
    shadowOffset: {
      height: hp(0.67),
      width: 0,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  imageWrap: {
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderRadius: heightPixel(8),
    height: heightPixel(104),
    justifyContent: 'center',
    width: heightPixel(104),
  },
  image: {
    borderRadius: heightPixel(8),
    height: heightPixel(96),
    resizeMode: 'contain',
    width: heightPixel(96),
  },
  imagePlaceholder: {
    backgroundColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    height: heightPixel(96),
    width: heightPixel(96),
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 0,
    paddingVertical: hp(0.45),
  },
  metaRow: {
    alignItems: 'flex-start',
  },
  category: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF5FF',
    borderRadius: wp(1.93),
    color: colors.primary,
    fontSize: fontPixel(11),
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: wp(1.93),
    paddingVertical: hp(0.45),
    textTransform: 'uppercase',
  },
  productTitle: {
    color: colors.text,
    fontSize: fontPixel(17),
    fontWeight: '800',
    lineHeight: fontPixel(22),
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.secondary,
    fontSize: fontPixel(19),
    fontWeight: '800',
  },
});
