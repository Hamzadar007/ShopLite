import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AddToCartControls } from '@/components/AddToCartControls';
import { FocusablePressable } from '@/components/FocusablePressable';
import { FavouriteToggle } from '@/components/FavouriteToggle';
import { ProductDetailSkeleton } from '@/components/ProductDetailSkeleton';
import { Screen } from '@/components/Screen';
import { ZoomableImage } from '@/components/ZoomableImage';
import { useProductDetail } from '@/hooks/useProductDetail';
import { colors } from '@/theme/colors';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 768;
  const productId = Number(Array.isArray(id) ? id[0] : id);
  const { product, loading, error, refetch } = useProductDetail(productId);
  const stockStatus = getStockStatus(product ?? undefined);
  const detailImage = product ? getDetailImage(product) : undefined;
  const category = formatCategory(product?.category);

  if (loading && !product) {
    return (
      <Screen edges={['bottom']}>
        <Stack.Screen options={{ title: 'Product Detail' }} />
        <ProductDetailSkeleton />
      </Screen>
    );
  }

  if (!product) {
    return (
      <Screen edges={['bottom']}>
        <Stack.Screen options={{ title: 'Product Detail' }} />
        <View style={styles.centerState}>
          <Ionicons color={colors.muted} name="cube-outline" size={heightPixel(48)} />
          <Text style={styles.emptyTitle}>No data found</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <FocusablePressable
            accessibilityLabel="Try again"
            accessibilityRole="button"
            onPress={() => void refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try again</Text>
          </FocusablePressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: 'Product Detail' }} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, isWideLayout && styles.scrollContentWide]}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={[styles.productLayout, isWideLayout && styles.productLayoutWide]}>
          <View style={[styles.imagePanel, isWideLayout && styles.imagePanelWide]}>
            {detailImage ? (
              <ZoomableImage
                accessibilityLabel={`${product.title} image`}
                imageStyle={styles.image}
                uri={detailImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons color={colors.muted} name="image-outline" size={heightPixel(34)} />
              </View>
            )}
          </View>

          <View style={[styles.infoPanel, isWideLayout && styles.infoPanelWide]}>
            <Text numberOfLines={1} style={styles.breadcrumb}>
              Products / {category}
            </Text>

            <View style={styles.metaRow}>
              <Text numberOfLines={1} style={styles.categoryBadge}>
                {category.toUpperCase()}
              </Text>
              <View
                style={[
                  styles.stockPill,
                  stockStatus.inStock ? styles.stockPillSuccess : styles.stockPillError,
                ]}
              >
                <View
                  style={[
                    styles.stockDot,
                    stockStatus.inStock ? styles.stockDotSuccess : styles.stockDotError,
                  ]}
                />
                <Text
                  style={[
                    styles.stockText,
                    stockStatus.inStock ? styles.stockTextSuccess : styles.stockTextError,
                  ]}
                >
                  {stockStatus.label}
                </Text>
              </View>
            </View>

            <View style={styles.titleRow}>
              <Text style={[styles.title, isWideLayout && styles.titleWide]}>{product.title}</Text>
              <FavouriteToggle compact product={product} />
            </View>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>

            <AddToCartControls inStock={stockStatus.inStock} product={product} />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.description?.trim() || 'No product description available.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function getDetailImage(product: Product) {
  return product.images?.find(Boolean) ?? product.image;
}

function formatCategory(category?: string) {
  if (!category) {
    return 'Featured';
  }

  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getStockStatus(product?: Product) {
  const availabilityStatus = product?.availabilityStatus?.trim();

  if (typeof product?.stock === 'number') {
    if (product.stock <= 0) {
      return {
        inStock: false,
        label: 'Out of stock',
      };
    }

    return {
      inStock: true,
      label: product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`,
    };
  }

  if (availabilityStatus) {
    const isOutOfStock = availabilityStatus.toLowerCase().includes('out');

    return {
      inStock: !isOutOfStock,
      label: availabilityStatus,
    };
  }

  return {
    inStock: true,
    label: 'Available',
  };
}

const styles = StyleSheet.create({
  scroll: {
    alignSelf: 'stretch',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(2.68),
    width: '100%',
  },
  scrollContentWide: {
    alignItems: 'center',
    paddingHorizontal: wp(5.8),
    paddingTop: hp(2.23),
  },
  productLayout: {
    alignSelf: 'stretch',
  },
  productLayoutWide: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    maxWidth: heightPixel(1060),
    minHeight: heightPixel(520),
    overflow: 'hidden',
    shadowColor: '#1C1C1E',
    shadowOffset: {
      height: hp(0.67),
      width: 0,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    width: '100%',
  },
  imagePanel: {
    alignSelf: 'stretch',
    backgroundColor: '#F7F8FC',
    height: hp(46),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePanelWide: {
    alignItems: 'center',
    flex: 1.08,
    height: heightPixel(540),
    padding: heightPixel(44),
  },
  image: {
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  infoPanel: {
    gap: hp(1.34),
    paddingHorizontal: wp(5.8),
    paddingTop: hp(2.23),
  },
  infoPanelWide: {
    flex: 0.92,
    justifyContent: 'center',
    paddingHorizontal: heightPixel(42),
    paddingTop: 0,
    paddingVertical: hp(3.57),
  },
  breadcrumb: {
    color: colors.muted,
    fontSize: fontPixel(11),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: heightPixel(8),
  },
  categoryBadge: {
    backgroundColor: '#EEF5FF',
    borderRadius: heightPixel(8),
    color: colors.primary,
    fontSize: fontPixel(11),
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: heightPixel(8),
    paddingVertical: hp(0.45),
    textTransform: 'uppercase',
  },
  stockPill: {
    alignItems: 'center',
    borderRadius: heightPixel(8),
    flexDirection: 'row',
    gap: heightPixel(6),
    paddingHorizontal: heightPixel(8),
    paddingVertical: hp(0.45),
  },
  stockPillSuccess: {
    backgroundColor: '#EBF9EF',
  },
  stockPillError: {
    backgroundColor: '#FFF0EF',
  },
  stockDot: {
    borderRadius: heightPixel(4),
    height: heightPixel(7),
    width: heightPixel(7),
  },
  stockDotSuccess: {
    backgroundColor: colors.success,
  },
  stockDotError: {
    backgroundColor: colors.error,
  },
  stockText: {
    fontSize: fontPixel(11),
    fontWeight: '800',
  },
  stockTextSuccess: {
    color: colors.success,
  },
  stockTextError: {
    color: colors.error,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: heightPixel(12),
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: fontPixel(25),
    fontWeight: '800',
    lineHeight: fontPixel(31),
  },
  titleWide: {
    fontSize: fontPixel(29),
    lineHeight: fontPixel(36),
  },
  price: {
    color: colors.secondary,
    fontSize: fontPixel(28),
    fontWeight: '800',
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: '#E8E8EE',
    height: 1,
    marginVertical: hp(0.45),
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontPixel(16),
    fontWeight: '800',
  },
  description: {
    color: colors.muted,
    fontSize: fontPixel(15),
    lineHeight: fontPixel(22),
  },
  centerState: {
    alignItems: 'center',
    gap: hp(1.34),
    paddingHorizontal: wp(5.8),
    paddingVertical: hp(2.68),
  },
  emptyTitle: {
    color: colors.text,
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
});
