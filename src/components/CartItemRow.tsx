import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LazyImage } from '@/components/LazyImage';
import { QuantityStepper } from '@/components/QuantityStepper';
import { CART_ITEM_ROW_HEIGHT } from '@/constants/listLayout';
import { useCartStore } from '@/store/cartStore';
import { colors } from '@/theme/colors';
import type { CartItem } from '@/types/cart';
import { formatPrice } from '@/utils/formatPrice';
import { fontPixel, heightPixel, hp } from '@/utils/Responsive';

type CartItemRowProps = {
  item: CartItem;
};

function isInStock(item: CartItem) {
  if (typeof item.product.stock === 'number') {
    return item.product.stock > 0;
  }

  const availabilityStatus = item.product.availabilityStatus?.trim().toLowerCase();

  if (availabilityStatus?.includes('out')) {
    return false;
  }

  return true;
}

function CartItemRowComponent({ item }: CartItemRowProps) {
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const lineTotal = item.product.price * item.quantity;
  const maxQuantity = typeof item.product.stock === 'number' ? item.product.stock : undefined;
  const inStock = isInStock(item);
  const canIncrement = inStock && (maxQuantity === undefined || item.quantity < maxQuantity);

  const handleDecrement = useCallback(() => {
    if (item.quantity <= 1) {
      removeItem(item.product.id);
      return;
    }

    decrementItem(item.product.id);
  }, [decrementItem, item.product.id, item.quantity, removeItem]);

  const handleIncrement = useCallback(() => {
    incrementItem(item.product.id);
  }, [incrementItem, item.product.id]);

  const handleRemove = useCallback(() => {
    removeItem(item.product.id);
  }, [item.product.id, removeItem]);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <LazyImage
          placeholderStyle={styles.imagePlaceholder}
          recyclingKey={`cart-${item.product.id}`}
          style={styles.image}
          uri={item.product.image}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text numberOfLines={2} style={styles.title}>
            {item.product.title}
          </Text>
          <Pressable
            accessibilityLabel={`Remove ${item.product.title} from cart`}
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleRemove}
            style={styles.removeButton}
          >
            <Ionicons color={colors.muted} name="close" size={heightPixel(20)} />
          </Pressable>
        </View>

        <Text style={styles.unitPrice}>{formatPrice(item.product.price)} each</Text>

        <View style={styles.footerRow}>
          <QuantityStepper
            canIncrement={canIncrement}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
            quantity={item.quantity}
          />
          <Text style={styles.lineTotal}>{formatPrice(lineTotal)}</Text>
        </View>
      </View>
    </View>
  );
}

function areCartItemRowPropsEqual(prev: CartItemRowProps, next: CartItemRowProps) {
  return (
    prev.item.product.id === next.item.product.id && prev.item.quantity === next.item.quantity
  );
}

export const CartItemRow = memo(CartItemRowComponent, areCartItemRowPropsEqual);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: heightPixel(12),
    minHeight: CART_ITEM_ROW_HEIGHT,
    padding: heightPixel(12),
  },
  imageWrap: {
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderRadius: heightPixel(8),
    height: heightPixel(88),
    justifyContent: 'center',
    width: heightPixel(88),
  },
  image: {
    borderRadius: heightPixel(8),
    height: heightPixel(80),
    width: heightPixel(80),
  },
  imagePlaceholder: {
    alignItems: 'center',
    height: heightPixel(80),
    justifyContent: 'center',
    width: heightPixel(80),
  },
  content: {
    flex: 1,
    gap: hp(0.67),
    minWidth: 0,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: heightPixel(8),
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: fontPixel(16),
    fontWeight: '800',
    lineHeight: fontPixel(21),
  },
  removeButton: {
    alignItems: 'center',
    height: heightPixel(24),
    justifyContent: 'center',
    width: heightPixel(24),
  },
  unitPrice: {
    color: colors.muted,
    fontSize: fontPixel(13),
    fontWeight: '600',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.45),
  },
  lineTotal: {
    color: colors.secondary,
    fontSize: fontPixel(17),
    fontWeight: '800',
  },
});
