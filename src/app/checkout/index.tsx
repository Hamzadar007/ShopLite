import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FocusablePressable } from '@/components/FocusablePressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormField } from '@/components/FormField';
import { Screen } from '@/components/Screen';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { colors } from '@/theme/colors';
import type { ShippingAddress } from '@/types/checkout';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';
import {
  hasAddressErrors,
  validateAddress,
  type AddressErrors,
} from '@/utils/validateAddress';

const emptyAddress: ShippingAddress = {
  fullName: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
};

export default function CheckoutAddressScreen() {
  const { bottom } = useSafeAreaInsets();
  const items = useCartStore((state) => state.items);
  const savedAddress = useCheckoutStore((state) => state.address);
  const setAddress = useCheckoutStore((state) => state.setAddress);
  const [address, setLocalAddress] = useState<ShippingAddress>(savedAddress ?? emptyAddress);
  const [errors, setErrors] = useState<AddressErrors>({});

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/(tabs)/cart');
    }
  }, [items.length]);

  const updateField = (field: keyof ShippingAddress, value: string) => {
    setLocalAddress((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleContinue = () => {
    const nextErrors = validateAddress(address);

    if (hasAddressErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setAddress(address);
    router.push('/checkout/summary');
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottom + hp(10) }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.stepLabel}>Step 1 of 2</Text>
          <Text style={styles.subtitle}>Enter the address where your order should be delivered.</Text>

          <View style={styles.form}>
            <FormField
              error={errors.fullName}
              label="Full name"
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="Jane Doe"
              value={address.fullName}
            />
            <FormField
              autoCapitalize="words"
              error={errors.streetAddress}
              label="Street address"
              onChangeText={(value) => updateField('streetAddress', value)}
              placeholder="123 Main Street"
              value={address.streetAddress}
            />
            <View style={styles.row}>
              <View style={styles.halfField}>
                <FormField
                  error={errors.city}
                  label="City"
                  onChangeText={(value) => updateField('city', value)}
                  placeholder="San Francisco"
                  value={address.city}
                />
              </View>
              <View style={styles.halfField}>
                <FormField
                  autoCapitalize="characters"
                  error={errors.state}
                  label="State"
                  onChangeText={(value) => updateField('state', value)}
                  placeholder="CA"
                  value={address.state}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <FormField
                  error={errors.postalCode}
                  keyboardType="numeric"
                  label="Postal code"
                  onChangeText={(value) => updateField('postalCode', value)}
                  placeholder="94105"
                  value={address.postalCode}
                />
              </View>
              <View style={styles.halfField}>
                <FormField
                  error={errors.country}
                  label="Country"
                  onChangeText={(value) => updateField('country', value)}
                  placeholder="United States"
                  value={address.country}
                />
              </View>
            </View>
            <FormField
              error={errors.phone}
              keyboardType="phone-pad"
              label="Phone"
              onChangeText={(value) => updateField('phone', value)}
              placeholder="+1 555 123 4567"
              value={address.phone}
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: bottom + hp(1.34) }]}>
          <FocusablePressable
            accessibilityLabel="Continue to summary"
            accessibilityRole="button"
            onPress={handleContinue}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Continue to Summary</Text>
          </FocusablePressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  form: {
    gap: hp(1.56),
  },
  row: {
    flexDirection: 'row',
    gap: wp(3.86),
  },
  halfField: {
    flex: 1,
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
  primaryButtonText: {
    color: colors.surface,
    fontSize: fontPixel(16),
    fontWeight: '700',
  },
});
