import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderSummaryCard } from '@/components/OrderSummaryCard';
import { Screen } from '@/components/Screen';
import { useCheckoutStore } from '@/store/checkoutStore';
import { colors } from '@/theme/colors';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

export default function CheckoutConfirmationScreen() {
  const { bottom } = useSafeAreaInsets();
  const placedOrder = useCheckoutStore((state) => state.placedOrder);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  useEffect(() => {
    if (!placedOrder) {
      router.replace('/(tabs)/cart');
    }
  }, [placedOrder]);

  const handleContinueShopping = () => {
    resetCheckout();
    router.replace('/(tabs)');
  };

  if (!placedOrder) {
    return null;
  }

  const placedDate = new Date(placedOrder.placedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + hp(2.68) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successBanner}>
          <View style={styles.successIconWrap}>
            <Ionicons color={colors.success} name="checkmark-circle" size={heightPixel(56)} />
          </View>
          <Text style={styles.successTitle}>Payment confirmed</Text>
          <Text style={styles.successText}>
            Your mock payment was processed successfully. Order {placedOrder.id} is on its way.
          </Text>
        </View>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Order ID</Text>
            <Text style={styles.metaValue}>{placedOrder.id}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Placed on</Text>
            <Text style={styles.metaValue}>{placedDate}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Payment status</Text>
            <Text style={styles.paidStatus}>Paid (mock)</Text>
          </View>
        </View>

        <OrderSummaryCard
          address={placedOrder.address}
          items={placedOrder.items}
          subtotal={placedOrder.subtotal}
        />

        <Pressable onPress={handleContinueShopping} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continue Shopping</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: hp(1.79),
    paddingHorizontal: wp(5.8),
    paddingTop: hp(1.34),
  },
  successBanner: {
    alignItems: 'center',
    gap: hp(1),
    paddingVertical: hp(1.34),
  },
  successIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    color: colors.text,
    fontSize: fontPixel(24),
    fontWeight: '800',
    textAlign: 'center',
  },
  successText: {
    color: colors.muted,
    fontSize: fontPixel(14),
    lineHeight: fontPixel(20),
    textAlign: 'center',
  },
  metaCard: {
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    gap: hp(1),
    paddingHorizontal: heightPixel(16),
    paddingVertical: hp(1.56),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    color: colors.muted,
    fontSize: fontPixel(14),
    fontWeight: '600',
  },
  metaValue: {
    color: colors.text,
    fontSize: fontPixel(14),
    fontWeight: '700',
  },
  paidStatus: {
    color: colors.success,
    fontSize: fontPixel(14),
    fontWeight: '800',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: heightPixel(8),
    justifyContent: 'center',
    minHeight: hp(5.58),
    paddingHorizontal: wp(4.35),
    paddingVertical: hp(1.34),
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: fontPixel(16),
    fontWeight: '700',
  },
});
