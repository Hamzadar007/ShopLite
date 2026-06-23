import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FocusablePressable } from '@/components/FocusablePressable';
import { ProductCard } from '@/components/ProductCard';
import { Screen } from '@/components/Screen';
import {
  createVerticalListGetItemLayout,
  PRODUCT_CARD_HEIGHT,
  PRODUCT_LIST_GAP,
  VERTICAL_LIST_PERF_PROPS,
} from '@/constants/listLayout';
import { useFavouriteStore } from '@/store/favouriteStore';
import { colors } from '@/theme/colors';
import type { Product } from '@/types/product';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

export default function FavouritesScreen() {
  const router = useRouter();
  const favourites = useFavouriteStore((state) => state.items);
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredFavourites = useMemo(() => {
    if (!normalizedSearchQuery) {
      return favourites;
    }

    return favourites.filter((product) =>
      product.title.toLowerCase().includes(normalizedSearchQuery),
    );
  }, [favourites, normalizedSearchQuery]);
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const resultCountText = hasSearchQuery
    ? `${filteredFavourites.length} found`
    : `${favourites.length} items`;
  const listBottomInset = bottom;
  const numberOfColumns = width >= 768 ? 2 : 1;
  const isGridLayout = numberOfColumns > 1;

  const getItemLayout = useMemo(
    () => createVerticalListGetItemLayout(PRODUCT_CARD_HEIGHT, PRODUCT_LIST_GAP, numberOfColumns),
    [numberOfColumns],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const handleProductPress = useCallback(
    (productId: number) => {
      router.push(`/product/${productId}`);
    },
    [router],
  );

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => (
      <ProductCard
        onPress={() => handleProductPress(item.id)}
        product={item}
        style={styles.productCard}
      />
    ),
    [handleProductPress],
  );

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.fixedHeader}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Favourites</Text>
            <Text style={styles.resultCount}>{resultCountText}</Text>
          </View>
          <View style={styles.searchBox}>
            <Ionicons color={colors.muted} name="search-outline" size={20} />
            <TextInput
              accessibilityLabel="Search favourites"
              accessibilityRole="search"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="never"
              onChangeText={setSearchQuery}
              placeholder="Search favourites"
              placeholderTextColor={colors.muted}
              returnKeyType="search"
              style={styles.searchInput}
              value={searchQuery}
            />
            {searchQuery.length > 0 ? (
              <FocusablePressable
                accessibilityLabel="Clear favourites search"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                <Ionicons color={colors.muted} name="close-circle" size={20} />
              </FocusablePressable>
            ) : null}
          </View>
        </View>

        <FlatList
          {...VERTICAL_LIST_PERF_PROPS}
          key={`favourites-${numberOfColumns}`}
          columnWrapperStyle={isGridLayout ? styles.columnWrapper : undefined}
          contentContainerStyle={[
            filteredFavourites.length === 0 ? styles.emptyList : styles.listContent,
            filteredFavourites.length > 0 && { paddingBottom: listBottomInset },
          ]}
          data={filteredFavourites}
          getItemLayout={getItemLayout}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons color={colors.muted} name="heart-outline" size={heightPixel(52)} />
              <Text style={styles.emptyTitle}>
                {hasSearchQuery ? 'No matches found' : 'No favourites yet'}
              </Text>
              <Text style={styles.emptyText}>
                {hasSearchQuery
                  ? 'Try searching with another product name.'
                  : 'Tap the heart on a product to save it here.'}
              </Text>
            </View>
          }
          numColumns={numberOfColumns}
          renderItem={renderItem}
          scrollIndicatorInsets={{ bottom: listBottomInset }}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5.8),
  },
  list: {
    alignSelf: 'stretch',
    flex: 1,
    maxWidth: wp(100),
  },
  listContent: {
    gap: hp(1.56),
    paddingTop: hp(1.56),
  },
  columnWrapper: {
    gap: wp(2.4),
  },
  productCard: {
    flex: 1,
  },
  fixedHeader: {
    alignSelf: 'stretch',
    gap: hp(1.34),
  },
  emptyList: {
    flexGrow: 1,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: fontPixel(28),
    fontWeight: '800',
  },
  resultCount: {
    color: colors.muted,
    fontSize: fontPixel(13),
    fontWeight: '700',
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: wp(1.93),
    borderWidth: 1,
    flexDirection: 'row',
    gap: wp(2.42),
    minHeight: hp(5.36),
    paddingHorizontal: wp(3.38),
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: fontPixel(16),
    minWidth: 0,
    paddingVertical: hp(1.34),
  },
  clearSearchButton: {
    alignItems: 'center',
    height: hp(2.68),
    justifyContent: 'center',
    width: wp(5.8),
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    gap: hp(0.89),
    justifyContent: 'center',
    minHeight: hp(46.88),
    paddingHorizontal: wp(6.76),
  },
  emptyTitle: {
    color: colors.text,
    fontSize: fontPixel(19),
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: fontPixel(14),
    lineHeight: fontPixel(20),
    textAlign: 'center',
  },
});
