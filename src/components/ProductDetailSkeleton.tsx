import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { SkeletonBox } from '@/components/SkeletonBox';
import { colors } from '@/theme/colors';
import { heightPixel, hp, wp } from '@/utils/Responsive';

export function ProductDetailSkeleton() {
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 768;

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, isWideLayout && styles.scrollContentWide]}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
    >
      <View style={[styles.productLayout, isWideLayout && styles.productLayoutWide]}>
        <View style={[styles.imagePanel, isWideLayout && styles.imagePanelWide]}>
          <SkeletonBox
            borderRadius={heightPixel(12)}
            height={isWideLayout ? heightPixel(280) : heightPixel(220)}
            width={isWideLayout ? heightPixel(280) : '72%'}
          />
        </View>

        <View style={[styles.infoPanel, isWideLayout && styles.infoPanelWide]}>
          <SkeletonBox height={heightPixel(12)} width={wp(38)} />
          <View style={styles.metaRow}>
            <SkeletonBox height={heightPixel(24)} width={wp(22)} />
            <SkeletonBox height={heightPixel(24)} width={wp(28)} />
          </View>
          <SkeletonBox height={heightPixel(30)} width="92%" />
          <SkeletonBox height={heightPixel(30)} width="68%" />
          <SkeletonBox height={heightPixel(34)} width={wp(30)} />
          <View style={styles.divider} />
          <SkeletonBox height={heightPixel(20)} width={wp(34)} />
          <SkeletonBox height={heightPixel(16)} width="100%" />
          <SkeletonBox height={heightPixel(16)} width="100%" />
          <SkeletonBox height={heightPixel(16)} width="84%" />
        </View>
      </View>
    </ScrollView>
  );
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
    flexDirection: 'row',
    maxWidth: heightPixel(1060),
    minHeight: heightPixel(520),
    overflow: 'hidden',
    width: '100%',
  },
  imagePanel: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#F7F8FC',
    height: hp(46),
    justifyContent: 'center',
  },
  imagePanelWide: {
    flex: 1.08,
    height: heightPixel(540),
    padding: heightPixel(44),
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
  metaRow: {
    flexDirection: 'row',
    gap: heightPixel(8),
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: '#E8E8EE',
    height: 1,
    marginVertical: hp(0.45),
  },
});
