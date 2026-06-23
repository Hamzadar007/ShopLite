import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type NativeSyntheticEvent,
  type PressableProps,
} from 'react-native';

import { colors } from '@/theme/colors';

type FocusablePressableProps = PressableProps & {
  onKeyDown?: (event: NativeSyntheticEvent<KeyboardEvent>) => void;
  tabIndex?: number;
};

export function FocusablePressable({
  disabled,
  onBlur,
  onFocus,
  onKeyDown,
  onPress,
  style,
  ...rest
}: FocusablePressableProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isInteractive = Boolean(onPress) && !disabled;

  const handleFocus: PressableProps['onFocus'] = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: PressableProps['onBlur'] = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleKeyDown = (event: NativeSyntheticEvent<KeyboardEvent>) => {
    onKeyDown?.(event);

    if (Platform.OS !== 'web' || !isInteractive) {
      return;
    }

    const key = event.nativeEvent.key;

    if (key === 'Enter' || key === ' ') {
      if (key === ' ') {
        event.preventDefault();
      }

      onPress?.(event as unknown as GestureResponderEvent);
    }
  };

  const webProps: Partial<FocusablePressableProps> =
    Platform.OS === 'web'
      ? {
          onKeyDown: handleKeyDown,
          tabIndex: isInteractive ? 0 : -1,
        }
      : {};

  return (
    <Pressable
      {...rest}
      {...webProps}
      disabled={disabled}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPress={onPress}
      style={(state) => {
        const resolvedStyle = typeof style === 'function' ? style(state) : style;

        return [resolvedStyle, Platform.OS === 'web' && isFocused && styles.focusVisible];
      }}
    />
  );
}

const styles = StyleSheet.create({
  focusVisible: {
    borderColor: colors.primary,
    borderWidth: 2,
    outlineColor: colors.primary,
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
});
