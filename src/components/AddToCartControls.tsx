import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { QuantityStepper } from '@/components/QuantityStepper';
import { useCartStore } from '@/store/cartStore';
import { colors } from '@/theme/colors';
import type { Product } from '@/types/product';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

type AddToCartControlsProps = {
  inStock: boolean;
  product: Product;
};

export function AddToCartControls({ inStock, product }: AddToCartControlsProps) {
  const quantity = useCartStore(
    (state) => state.items.find((item) => item.product.id === product.id)?.quantity ?? 0,
  );
  const addItem = useCartStore((state) => state.addItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const maxQuantity = typeof product.stock === 'number' ? product.stock : undefined;
  const canIncrement = inStock && (maxQuantity === undefined || quantity < maxQuantity);

  const handleAdd = () => {
    if (!inStock) {
      return;
    }

    addItem(product, 1);
  };

  const handleIncrement = () => {
    if (!canIncrement) {
      return;
    }

    incrementItem(product.id);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeItem(product.id);
      return;
    }

    decrementItem(product.id);
  };

  if (quantity === 0) {
    return (
      <Pressable
        accessibilityLabel={inStock ? `Add ${product.title} to cart` : 'Out of stock'}
        accessibilityRole="button"
        accessibilityState={{ disabled: !inStock }}
        disabled={!inStock}
        onPress={handleAdd}
        style={[styles.addButton, !inStock && styles.addButtonDisabled]}
      >
        <Ionicons color={colors.surface} name="cart-outline" size={heightPixel(20)} />
        <Text style={styles.addButtonText}>{inStock ? 'Add to Cart' : 'Out of Stock'}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.controls}>
      <View style={styles.quantityRow}>
        <Text style={styles.quantityLabel}>Quantity</Text>
        <QuantityStepper
          canIncrement={canIncrement}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
          quantity={quantity}
        />
      </View>

      <Pressable
        accessibilityLabel={`Remove ${product.title} from cart`}
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => removeItem(product.id)}
        style={styles.removeButton}
      >
        <Ionicons color={colors.error} name="trash-outline" size={heightPixel(18)} />
        <Text style={styles.removeButtonText}>Remove from cart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: heightPixel(8),
    flexDirection: 'row',
    gap: heightPixel(8),
    justifyContent: 'center',
    minHeight: hp(5.58),
    paddingHorizontal: wp(4.35),
    paddingVertical: hp(1.34),
  },
  addButtonDisabled: {
    backgroundColor: colors.muted,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: fontPixel(16),
    fontWeight: '700',
  },
  controls: {
    gap: hp(1.12),
  },
  quantityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    color: colors.text,
    fontSize: fontPixel(15),
    fontWeight: '700',
  },
  removeButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: heightPixel(6),
    paddingVertical: hp(0.45),
  },
  removeButtonText: {
    color: colors.error,
    fontSize: fontPixel(14),
    fontWeight: '600',
  },
});
