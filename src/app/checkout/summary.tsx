import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderSummaryCard } from '@/components/OrderSummaryCard';
import { Screen } from '@/components/Screen';
import { useCartTotal } from '@/hooks/useCartTotal';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { colors } from '@/theme/colors';
import type { PlacedOrder } from '@/types/checkout';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

function createOrderId() {
  const suffix = Date.now().toString().slice(-6);
  return `ORD-${suffix}`;
}

export default function CheckoutSummaryScreen() {
  const { bottom } = useSafeAreaInsets();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const address = useCheckoutStore((state) => state.address);
  const setPlacedOrder = useCheckoutStore((state) => state.setPlacedOrder);
  const [isProcessing, setIsProcessing] = useState(false);
  const subtotal = useCartTotal(items);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/(tabs)/cart');
      return;
    }

    if (!address) {
      router.replace('/checkout');
    }
  }, [address, items.length]);

  const handlePlaceOrder = async () => {
    if (!address || items.length === 0 || isProcessing) {
      return;
    }

    setIsProcessing(true);

    const placedOrder: PlacedOrder = {
      id: createOrderId(),
      items: [...items],
      subtotal,
      address,
      placedAt: new Date().toISOString(),
    };

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setPlacedOrder(placedOrder);
    clearCart();
    setIsProcessing(false);
    router.replace('/checkout/confirmation');
  };

  if (items.length === 0 || !address) {
    return null;
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + hp(10) }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>Step 2 of 2</Text>
        <Text style={styles.subtitle}>
          Review your order details. Payment is mocked for this demo.
        </Text>

        <OrderSummaryCard address={address} items={items} subtotal={subtotal} />

        <View style={styles.paymentNote}>
          <Text style={styles.paymentNoteTitle}>Mock payment</Text>
          <Text style={styles.paymentNoteText}>
            Tapping Place Order simulates a successful card payment. No real charge is made.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottom + hp(1.34) }]}>
        <Pressable
          accessibilityLabel={isProcessing ? 'Placing order' : 'Place order'}
          accessibilityRole="button"
          accessibilityState={{ disabled: isProcessing }}
          disabled={isProcessing}
          onPress={() => void handlePlaceOrder()}
          style={[styles.primaryButton, isProcessing && styles.primaryButtonDisabled]}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.primaryButtonText}>Place Order</Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: hp(1.79),
    paddingHorizontal: wp(5.8),
    paddingTop: hp(1.34),
  },
  stepLabel: {
    color: colors.secondary,
    fontSize: fontPixel(13),
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    fontSize: fontPixel(14),
    lineHeight: fontPixel(20),
  },
  paymentNote: {
    backgroundColor: '#EEF4FF',
    borderColor: '#D6E4FF',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    gap: hp(0.67),
    paddingHorizontal: heightPixel(14),
    paddingVertical: hp(1.34),
  },
  paymentNoteTitle: {
    color: colors.primary,
    fontSize: fontPixel(14),
    fontWeight: '800',
  },
  paymentNoteText: {
    color: colors.muted,
    fontSize: fontPixel(13),
    lineHeight: fontPixel(18),
  },
  footer: {
    backgroundColor: colors.background,
    borderTopColor: '#E8E8EE',
    borderTopWidth: 1,
    paddingHorizontal: wp(5.8),
    paddingTop: hp(1.34),
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
  primaryButtonDisabled: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: fontPixel(16),
    fontWeight: '700',
  },
});
