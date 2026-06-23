import { StyleSheet, Text, View } from 'react-native';

import { LazyImage } from '@/components/LazyImage';

import { colors } from '@/theme/colors';
import type { CartItem } from '@/types/cart';
import type { ShippingAddress } from '@/types/checkout';
import { formatPrice } from '@/utils/formatPrice';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

type OrderSummaryCardProps = {
  address?: ShippingAddress | null;
  items: CartItem[];
  subtotal: number;
};

export function OrderSummaryCard({ address, items, subtotal }: OrderSummaryCardProps) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.card}>
      {address ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping address</Text>
          <Text style={styles.addressText}>{address.fullName}</Text>
          <Text style={styles.addressText}>{address.streetAddress}</Text>
          <Text style={styles.addressText}>
            {address.city}, {address.state} {address.postalCode}
          </Text>
          <Text style={styles.addressText}>{address.country}</Text>
          <Text style={styles.addressText}>{address.phone}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Order items ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </Text>
        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.product.id} style={styles.itemRow}>
              <View style={styles.itemImageWrap}>
                <LazyImage
                  placeholderStyle={styles.itemImagePlaceholder}
                  recyclingKey={`summary-${item.product.id}`}
                  style={styles.itemImage}
                  uri={item.product.image}
                />
              </View>
              <View style={styles.itemDetails}>
                <Text numberOfLines={2} style={styles.itemTitle}>
                  {item.product.title}
                </Text>
                <Text style={styles.itemMeta}>
                  Qty {item.quantity} · {formatPrice(item.product.price)} each
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Shipping</Text>
          <Text style={styles.totalValue}>Free</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>{formatPrice(subtotal)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    gap: hp(1.79),
    paddingHorizontal: heightPixel(16),
    paddingVertical: hp(1.79),
  },
  section: {
    gap: hp(0.89),
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontPixel(16),
    fontWeight: '800',
  },
  addressText: {
    color: colors.muted,
    fontSize: fontPixel(14),
    lineHeight: fontPixel(20),
  },
  itemsList: {
    gap: hp(1.12),
  },
  itemRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: heightPixel(10),
  },
  itemImageWrap: {
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderRadius: heightPixel(8),
    height: heightPixel(52),
    justifyContent: 'center',
    width: heightPixel(52),
  },
  itemImage: {
    borderRadius: heightPixel(6),
    height: heightPixel(44),
    resizeMode: 'contain',
    width: heightPixel(44),
  },
  itemImagePlaceholder: {
    alignItems: 'center',
    height: heightPixel(44),
    justifyContent: 'center',
    width: heightPixel(44),
  },
  itemDetails: {
    flex: 1,
    gap: hp(0.34),
    minWidth: 0,
  },
  itemTitle: {
    color: colors.text,
    fontSize: fontPixel(14),
    fontWeight: '700',
    lineHeight: fontPixel(18),
  },
  itemMeta: {
    color: colors.muted,
    fontSize: fontPixel(12),
    fontWeight: '600',
  },
  itemTotal: {
    color: colors.secondary,
    fontSize: fontPixel(14),
    fontWeight: '800',
  },
  totals: {
    gap: hp(1),
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.muted,
    fontSize: fontPixel(15),
    fontWeight: '600',
  },
  totalValue: {
    color: colors.text,
    fontSize: fontPixel(15),
    fontWeight: '700',
  },
  divider: {
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
    fontSize: fontPixel(20),
    fontWeight: '800',
  },
});
