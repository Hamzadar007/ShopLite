import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartItemRow } from '@/components/CartItemRow';
import { Screen } from '@/components/Screen';
import { useCartTotal } from '@/hooks/useCartTotal';
import { useCartStore } from '@/store/cartStore';
import { colors } from '@/theme/colors';
import { formatPrice } from '@/utils/formatPrice';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

export default function CartScreen() {
  const { bottom } = useSafeAreaInsets();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartTotal(items);
  const grandTotal = subtotal;
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  if (items.length === 0) {
    return (
      <Screen>
        <View style={styles.emptyState}>
          <Ionicons color={colors.muted} name="cart-outline" size={heightPixel(52)} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add products from the catalog to see them here.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cart</Text>
          <Text style={styles.itemCount}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>

        <FlatList
          contentContainerStyle={[styles.listContent, { paddingBottom: bottom + hp(2.68) }]}
          data={items}
          keyExtractor={(item) => item.product.id.toString()}
          renderItem={({ item }) => <CartItemRow item={item} />}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          ListFooterComponent={
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>{formatPrice(grandTotal)}</Text>
              </View>
            </View>
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5.8),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: hp(1.34),
    paddingTop: hp(0.89),
  },
  title: {
    color: colors.text,
    fontSize: fontPixel(28),
    fontWeight: '800',
  },
  itemCount: {
    color: colors.muted,
    fontSize: fontPixel(13),
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: hp(1.34),
    paddingTop: hp(0.67),
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    gap: hp(1.12),
    marginTop: hp(1.79),
    paddingHorizontal: heightPixel(16),
    paddingVertical: hp(1.79),
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: fontPixel(15),
    fontWeight: '600',
  },
  summaryValue: {
    color: colors.text,
    fontSize: fontPixel(16),
    fontWeight: '700',
  },
  summaryDivider: {
    backgroundColor: '#E8E8EE',
    height: 1,
  },
  grandTotalLabel: {
    color: colors.text,
    fontSize: fontPixel(17),
    fontWeight: '800',
  },
  grandTotalValue: {
    color: colors.secondary,
    fontSize: fontPixel(22),
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    gap: hp(1.12),
    justifyContent: 'center',
    paddingHorizontal: wp(8),
  },
  emptyTitle: {
    color: colors.text,
    fontSize: fontPixel(20),
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: fontPixel(14),
    lineHeight: fontPixel(20),
    textAlign: 'center',
  },
});
