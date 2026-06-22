import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { heightPixel } from '@/utils/Responsive';

type SkeletonBoxProps = {
  borderRadius?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  width?: DimensionValue;
};

export function SkeletonBox({
  borderRadius = heightPixel(8),
  height = heightPixel(16),
  style,
  width = '100%',
}: SkeletonBoxProps) {
  return (
    <View
      style={[
        styles.box,
        {
          borderRadius,
          height,
          width,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#E8E8EE',
  },
});
