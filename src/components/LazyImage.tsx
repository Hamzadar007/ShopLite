import { Image, type ImageContentFit, type ImageProps } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type LazyImageProps = {
  contentFit?: ImageContentFit;
  placeholderStyle?: StyleProp<ViewStyle>;
  recyclingKey?: string;
  style?: ImageProps['style'];
  uri?: string | null;
};

function LazyImageComponent({
  contentFit = 'contain',
  placeholderStyle,
  recyclingKey,
  style,
  uri,
}: LazyImageProps) {
  if (!uri) {
    return <View style={[styles.placeholder, placeholderStyle, style]} />;
  }

  return (
    <Image
      cachePolicy="memory-disk"
      contentFit={contentFit}
      recyclingKey={recyclingKey ?? uri}
      source={{ uri }}
      style={style}
      transition={200}
    />
  );
}

export const LazyImage = memo(LazyImageComponent);

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#E8E8EE',
  },
});
