import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { fontPixel, heightPixel, hp } from '@/utils/Responsive';

type QuantityStepperProps = {
  canIncrement?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  quantity: number;
};

export function QuantityStepper({
  canIncrement = true,
  onDecrement,
  onIncrement,
  quantity,
}: QuantityStepperProps) {
  return (
    <View accessibilityLabel={`Quantity ${quantity}`} style={styles.stepper}>
      <Pressable
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onDecrement}
        style={styles.stepperButton}
      >
        <Ionicons color={colors.text} name="remove" size={heightPixel(18)} />
      </Pressable>
      <Text style={styles.quantityValue}>{quantity}</Text>
      <Pressable
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
        accessibilityState={{ disabled: !canIncrement }}
        disabled={!canIncrement}
        hitSlop={8}
        onPress={onIncrement}
        style={[styles.stepperButton, !canIncrement && styles.stepperButtonDisabled]}
      >
        <Ionicons
          color={canIncrement ? colors.text : colors.muted}
          name="add"
          size={heightPixel(18)}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: heightPixel(2),
    paddingHorizontal: heightPixel(2),
    paddingVertical: hp(0.22),
  },
  stepperButton: {
    alignItems: 'center',
    height: heightPixel(32),
    justifyContent: 'center',
    width: heightPixel(32),
  },
  stepperButtonDisabled: {
    opacity: 0.45,
  },
  quantityValue: {
    color: colors.text,
    fontSize: fontPixel(15),
    fontWeight: '800',
    minWidth: heightPixel(24),
    textAlign: 'center',
  },
});
