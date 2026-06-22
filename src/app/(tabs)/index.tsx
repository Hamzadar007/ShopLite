import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/ProductCard';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';
import { Screen } from '@/components/Screen';
import { useProduct } from '@/hooks/useProduct';
import { colors } from '@/theme/colors';
import { fontPixel, hp, wp } from '@/utils/Responsive';

export default function ProductsScreen() {
  const router = useRouter();
  const { products, loading, error, refetch } = useProduct();
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalizedSearchQuery) {
      return products;
    }

    return products.filter((product) =>
      product.title.toLowerCase().includes(normalizedSearchQuery),
    );
  }, [normalizedSearchQuery, products]);
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const resultCountText = hasSearchQuery
    ? `${filteredProducts.length} found`
    : `${products.length} items`;
  const listBottomInset = bottom;
  const numberOfColumns = width >= 768 ? 2 : 1;
  const isGridLayout = numberOfColumns > 1;

  if (loading && products.length === 0) {
    return (
      <Screen>
        <ProductListSkeleton />
      </Screen>
    );
  }

  if (error && products.length === 0) {
    return (
      <Screen>
        <View style={styles.centerState}>
          <Text style={styles.errorTitle}>Unable to load products</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => void refetch()}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.fixedHeader}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Products</Text>
            <Text style={styles.resultCount}>{resultCountText}</Text>
          </View>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" color={colors.muted} size={20} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="never"
              onChangeText={setSearchQuery}
              placeholder="Search products"
              placeholderTextColor={colors.muted}
              returnKeyType="search"
              style={styles.searchInput}
              value={searchQuery}
            />
            {searchQuery.length > 0 ? (
              <Pressable
                accessibilityLabel="Clear product search"
                hitSlop={8}
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                <Ionicons name="close-circle" color={colors.muted} size={20} />
              </Pressable>
            ) : null}
          </View>
          {error ? <Text style={styles.warningText}>{error}</Text> : null}
        </View>
        <FlatList
          key={`products-${numberOfColumns}`}
          data={filteredProducts}
          numColumns={numberOfColumns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              onPress={() => router.push(`/product/${item.id}`)}
              product={item}
              style={styles.productCard}
            />
          )}
          columnWrapperStyle={isGridLayout ? styles.columnWrapper : undefined}
          contentContainerStyle={[
            filteredProducts.length === 0 ? styles.emptyList : styles.listContent,
            filteredProducts.length > 0 && { paddingBottom: listBottomInset },
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {hasSearchQuery ? 'No matches found' : 'No products found'}
              </Text>
              <Text style={styles.emptyText}>
                {hasSearchQuery
                  ? 'Try searching with another product name.'
                  : 'Pull down to refresh the product list.'}
              </Text>
            </View>
          }
          onRefresh={() => void refetch()}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{ bottom: listBottomInset }}
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
  centerState: {
    alignItems: 'center',
    gap: hp(1.34),
    paddingHorizontal: wp(5.8),
    paddingVertical: hp(2.68),
  },
  errorTitle: {
    color: colors.error,
    fontSize: fontPixel(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: colors.muted,
    fontSize: fontPixel(14),
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: wp(1.93),
    paddingHorizontal: wp(4.35),
    paddingVertical: hp(1.12),
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: fontPixel(15),
    fontWeight: '700',
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
  warningText: {
    color: colors.error,
    fontSize: fontPixel(13),
    marginBottom: hp(0.45),
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
