import { config } from '@/constants/config';

export function getProductDetailPath(productId: number) {
  return `/product/${productId}`;
}

export function getProductNativeDeepLink(productId: number) {
  return `${config.scheme}://product/${productId}`;
}

export function getProductWebDeepLink(productId: number) {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${getProductDetailPath(productId)}`;
  }

  return getProductDetailPath(productId);
}

export function normalizeProductDeepLinkPath(input: string) {
  if (!input) {
    return '/';
  }

  if (input.startsWith('/product/')) {
    return input.split('?')[0] ?? input;
  }

  try {
    const url = new URL(input, `${config.scheme}://`);

    if (url.hostname === 'product') {
      const productId = url.pathname.replace(/^\//, '');

      if (productId) {
        return `/product/${productId}`;
      }
    }

    if (url.pathname.startsWith('/product/')) {
      return url.pathname;
    }
  } catch {
    // Fall through to path-only parsing below.
  }

  const pathOnly = input.replace(/^[a-zA-Z0-9+.-]+:\/\//, '').split('?')[0] ?? input;

  if (pathOnly.startsWith('product/')) {
    return `/${pathOnly}`;
  }

  if (pathOnly.startsWith('/product/')) {
    return pathOnly;
  }

  if (input.startsWith('/')) {
    return input.split('?')[0] ?? input;
  }

  return `/${pathOnly}`;
}
