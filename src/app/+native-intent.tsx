import { normalizeProductDeepLinkPath } from '@/utils/productLink';

type RedirectSystemPathOptions = {
  initial: boolean;
  path: string;
};

export function redirectSystemPath({ path }: RedirectSystemPathOptions) {
  try {
    return normalizeProductDeepLinkPath(path);
  } catch {
    return '/';
  }
}
