import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { FocusablePressable } from '@/components/FocusablePressable';
import { LazyImage } from '@/components/LazyImage';
import {
  createHorizontalListGetItemLayout,
  HORIZONTAL_LIST_PERF_PROPS,
  RECENTLY_VIEWED_CARD_WIDTH,
  RECENTLY_VIEWED_GAP,
} from '@/constants/listLayout';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { colors } from '@/theme/colors';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

type RecentlyViewedListProps = {
  excludeProductId?: number;
};

function RecentlyViewedListComponent({ excludeProductId }: RecentlyViewedListProps) {
  const router = useRouter();
  const items = useRecentlyViewedStore((state) => state.items);
  const visibleItems = useMemo(
    () => (excludeProductId ? items.filter((item) => item.id !== excludeProductId) : items),
    [excludeProductId, items],
  );

  const getItemLayout = useMemo(
    () => createHorizontalListGetItemLayout(RECENTLY_VIEWED_CARD_WIDTH, RECENTLY_VIEWED_GAP),
    [],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <RecentlyViewedCard
        onPress={() => router.push(`/product/${item.id}`)}
        product={item}
      />
    ),
    [router],
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recently Viewed</Text>
        <Text style={styles.count}>{visibleItems.length}</Text>
      </View>
      <FlatList
        {...HORIZONTAL_LIST_PERF_PROPS}
        contentContainerStyle={styles.listContent}
        data={visibleItems}
        getItemLayout={getItemLayout}
        horizontal
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

type RecentlyViewedCardProps = {
  onPress: () => void;
  product: Product;
};

function RecentlyViewedCardComponent({ onPress, product }: RecentlyViewedCardProps) {
  return (
    <FocusablePressable
      accessibilityHint="Opens product details"
      accessibilityLabel={`${product.title}, ${formatPrice(product.price)}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.imageWrap}>
        <LazyImage
          placeholderStyle={styles.imagePlaceholder}
          recyclingKey={`recent-${product.id}`}
          style={styles.image}
          uri={product.image}
        />
      </View>
      <Text numberOfLines={2} style={styles.productTitle}>
        {product.title}
      </Text>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
    </FocusablePressable>
  );
}

function areRecentlyViewedCardPropsEqual(
  prev: RecentlyViewedCardProps,
  next: RecentlyViewedCardProps,
) {
  return prev.product.id === next.product.id;
}

const RecentlyViewedCard = memo(RecentlyViewedCardComponent, areRecentlyViewedCardPropsEqual);

export const RecentlyViewedList = memo(RecentlyViewedListComponent);

const styles = StyleSheet.create({
  section: {
    gap: hp(1),
    paddingBottom: hp(0.67),
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: fontPixel(17),
    fontWeight: '800',
  },
  count: {
    color: colors.muted,
    fontSize: fontPixel(13),
    fontWeight: '700',
  },
  listContent: {
    gap: RECENTLY_VIEWED_GAP,
    paddingVertical: hp(0.45),
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    gap: hp(0.67),
    padding: heightPixel(10),
    width: RECENTLY_VIEWED_CARD_WIDTH,
  },
  cardPressed: {
    opacity: 0.86,
  },
  imageWrap: {
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderRadius: heightPixel(8),
    height: heightPixel(88),
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    borderRadius: heightPixel(6),
    height: heightPixel(76),
    width: heightPixel(76),
  },
  imagePlaceholder: {
    borderRadius: heightPixel(6),
    height: heightPixel(76),
    width: heightPixel(76),
  },
  productTitle: {
    color: colors.text,
    fontSize: fontPixel(13),
    fontWeight: '700',
    lineHeight: fontPixel(17),
    minHeight: fontPixel(34),
  },
  price: {
    color: colors.secondary,
    fontSize: fontPixel(14),
    fontWeight: '800',
  },
});
