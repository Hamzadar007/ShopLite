import { heightPixel, hp, wp } from '@/utils/Responsive';

export const PRODUCT_CARD_HEIGHT = heightPixel(132);
export const PRODUCT_LIST_GAP = hp(1.56);

export const CART_ITEM_ROW_HEIGHT = heightPixel(112);
export const CART_LIST_GAP = hp(1.34);

export const RECENTLY_VIEWED_CARD_WIDTH = wp(36);
export const RECENTLY_VIEWED_GAP = wp(2.9);

export function createVerticalListGetItemLayout(itemHeight: number, gap: number, numColumns = 1) {
  const rowStride = itemHeight + gap;

  return (_data: unknown, index: number) => {
    const rowIndex = Math.floor(index / numColumns);

    return {
      index,
      length: itemHeight,
      offset: rowIndex * rowStride,
    };
  };
}

export function createHorizontalListGetItemLayout(itemWidth: number, gap: number) {
  const stride = itemWidth + gap;

  return (_data: unknown, index: number) => ({
    index,
    length: itemWidth,
    offset: index * stride,
  });
}

export const VERTICAL_LIST_PERF_PROPS = {
  initialNumToRender: 10,
  maxToRenderPerBatch: 8,
  removeClippedSubviews: true,
  updateCellsBatchingPeriod: 50,
  windowSize: 5,
} as const;

export const HORIZONTAL_LIST_PERF_PROPS = {
  initialNumToRender: 4,
  maxToRenderPerBatch: 4,
  removeClippedSubviews: true,
  windowSize: 3,
} as const;
