import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { SkeletonBox } from '@/components/SkeletonBox';
import { colors } from '@/theme/colors';
import { fontPixel, heightPixel, hp, wp } from '@/utils/Responsive';

const SKELETON_ITEM_COUNT = 6;

function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBox borderRadius={heightPixel(8)} height={heightPixel(104)} width={heightPixel(104)} />
      <View style={styles.cardContent}>
        <SkeletonBox height={heightPixel(22)} width={wp(18)} />
        <SkeletonBox height={heightPixel(18)} width="88%" />
        <SkeletonBox height={heightPixel(18)} width="72%" />
        <SkeletonBox height={heightPixel(22)} width={wp(22)} />
      </View>
    </View>
  );
}

export function ProductListSkeleton() {
  const { width } = useWindowDimensions();
  const numberOfColumns = width >= 768 ? 2 : 1;
  const isGridLayout = numberOfColumns > 1;
  const skeletonItems = Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => index);

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <SkeletonBox height={heightPixel(34)} width={wp(34)} />
          <SkeletonBox height={heightPixel(18)} width={wp(18)} />
        </View>
        <SkeletonBox height={hp(5.36)} width="100%" />
      </View>

      <View style={[styles.listContent, isGridLayout && styles.listContentGrid]}>
        {skeletonItems.map((item) => (
          <View
            key={item}
            style={[styles.cardWrap, isGridLayout && styles.cardWrapGrid]}
          >
            <ProductCardSkeleton />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5.8),
  },
  fixedHeader: {
    alignSelf: 'stretch',
    gap: hp(1.34),
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listContent: {
    gap: hp(1.56),
    paddingTop: hp(1.56),
  },
  listContentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2.4),
  },
  cardWrap: {
    alignSelf: 'stretch',
  },
  cardWrapGrid: {
    flexBasis: '48%',
    flexGrow: 1,
    maxWidth: '48%',
  },
  card: {
    alignItems: 'stretch',
    backgroundColor: colors.surface,
    borderColor: '#E8E8EE',
    borderRadius: heightPixel(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: heightPixel(14),
    overflow: 'hidden',
    paddingHorizontal: heightPixel(10),
    paddingVertical: hp(1.12),
  },
  cardContent: {
    flex: 1,
    gap: hp(0.89),
    justifyContent: 'space-between',
    minWidth: 0,
    paddingVertical: hp(0.45),
  },
});
