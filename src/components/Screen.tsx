import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

type ScreenProps = PropsWithChildren<{
  edges?: readonly Edge[];
}>;

export function Screen({ children, edges }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
