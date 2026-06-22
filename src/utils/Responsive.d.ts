type PercentageValue = number | string;

type OrientationListenerTarget = {
  setState: (state: { orientation: 'portrait' | 'landscape' }) => void;
};

export function wp(widthPercent: PercentageValue): number;
export function hp(heightPercent: PercentageValue): number;
export function listenOrientationChange(that: OrientationListenerTarget): void;
export function removeOrientationListener(): void;
export function fontPixel(size: number): number;
export function widthPixel(size: number): number;
export function heightPixel(size: number): number;
export const isTablet: boolean;
