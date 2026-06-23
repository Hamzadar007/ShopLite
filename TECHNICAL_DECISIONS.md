# Technical Decisions

This document explains the key technical choices made in ShopLite: state management, architecture, and persistence.

## Stack overview

| Area | Choice |
|------|--------|
| Framework | **Expo SDK 56** + **React Native 0.85** + **React 19** |
| Navigation | **Expo Router** (file-based routing, typed routes) |
| Language | **TypeScript** |
| State | **Zustand 5** |
| Networking | **Axios** → [DummyJSON](https://dummyjson.com) |
| Persistence | **AsyncStorage** via a Zustand `persist` adapter |
| Images | **expo-image** (cached, lazy-loaded thumbnails) |
| Platforms | iOS, Android, Web (`react-native-web`) |

---

## State management rationale

### Why Zustand (not Redux, Context, or React Query)?

- **Low boilerplate** — Each domain gets a small store with actions inline; no actions/reducers/providers.
- **Good fit for local app state** — Cart, favourites, and recently viewed are mostly client-side; they do not need a full server-state library.
- **Fine-grained subscriptions** — Components subscribe to slices (e.g. `useCartStore((s) => s.items)`) so unrelated updates do not re-render the whole tree.
- **Built-in persistence** — Zustand's `persist` middleware integrates cleanly with AsyncStorage.
- **Easy to test** — Stores are plain functions; tests call `useCartStore.getState()` directly (see `src/test/store/cartStore.test.ts`).

### Store design: one store per domain

| Store | File | Responsibility |
|-------|------|----------------|
| `useCartStore` | `src/store/cartStore.ts` | Cart items, quantity CRUD, totals input |
| `useFavouriteStore` | `src/store/favouriteStore.ts` | Saved products, toggle |
| `useRecentlyViewedStore` | `src/store/recentlyViewedStore.ts` | Last 10 viewed products (dedupe, move-to-front) |
| `useProductStore` | `src/store/productStore.ts` | Cached product list for offline fallback |
| `useCheckoutStore` | `src/store/checkoutStore.ts` | **Ephemeral** checkout flow (address, placed order) |

### Hybrid data fetching

Server data is **not** stored only in Zustand. Custom hooks own fetch lifecycle:

- **`useProduct`** — local `useState` for list + loading/error; writes cache to `useProductStore` on success; falls back to cache on refresh failure (`src/hooks/useProduct.ts`).
- **`useProductDetail`** — fetches single product; falls back to list cache; writes to recently viewed when loaded (`src/hooks/useProductDetail.ts`).

**Rationale:** Hooks handle async/loading/error; Zustand holds durable or shared cache. That avoids putting fetch flags in global state while still supporting offline-ish behavior.

### Derived state stays out of stores

- **`useCartTotal(items)`** — subtotal from cart line items (`src/hooks/useCartTotal.ts`).
- **`useCartCount()`** — badge count from cart quantities (`src/hooks/useCartCount.ts`).

Totals are computed, not duplicated in the store, so quantity changes always produce correct totals.

### Checkout is intentionally not persisted

`useCheckoutStore` has no `persist` middleware. Address and order confirmation are session-scoped; cart is cleared after a successful mock payment. That matches a typical checkout flow and avoids stale address data on next launch.

---

## Architecture choices

### 1. File-based routing (Expo Router)

```
src/app/
├── (tabs)/          # Tab navigator: Products, Cart, Favourites
├── product/[id].tsx # Product detail (stack)
├── checkout/        # Address → Summary → Confirmation
├── _layout.tsx      # Root stack
└── +native-intent.tsx  # Deep link path normalization
```

- **Tabs** for primary navigation; **stack** for detail and checkout.
- **Typed routes** enabled via `experiments.typedRoutes` in `app.json`.
- Deep links map to routes through `redirectSystemPath` + `normalizeProductDeepLinkPath` (`src/utils/productLink.ts`).

### 2. Layered folder structure

| Layer | Purpose | Examples |
|-------|---------|----------|
| `app/` | Screens & navigation | `(tabs)/index.tsx`, `checkout/summary.tsx` |
| `components/` | Reusable UI | `ProductCard`, `CartItemRow`, `LazyImage` |
| `hooks/` | Data & derived logic | `useProduct`, `useCartTotal` |
| `store/` | Global client state | Zustand stores |
| `services/` | API & storage | `api.ts`, `product/product.ts`, `storage/storage.ts` |
| `types/` | Domain types | `Product`, `CartItem`, `ShippingAddress` |
| `utils/` | Pure helpers | `formatPrice`, `validateAddress`, `productLink` |
| `constants/` | Config & layout | `config.ts`, `endpoints.ts`, `listLayout.ts` |
| `theme/` | Design tokens | `colors.ts` |

**Separation of concerns:** UI → hooks/stores → services → API. API shapes are mapped to app types in `mapApiProduct()` so DummyJSON field names (`thumbnail`, etc.) do not leak into components.

### 3. Centralized API client

`src/services/api.ts` provides:

- Shared Axios instance (base URL, timeout, JSON headers).
- Request interceptor for optional auth token.
- 401 handling (token cleared).
- `apiRequest<T>()` wrapper for typed responses.

Product endpoints live in `src/constants/endpoints.ts`; product-specific calls in `src/services/product/product.ts`.

### 4. Native projects via prebuild (not committed)

`ios/` and `android/` are gitignored and generated with `npm run prebuild` or on first `npm run ios` / `npm run android`. That keeps the repo managed-workflow friendly while still supporting native builds, deep links, and dev client.

### 5. Cross-platform considerations

- **Web keyboard navigation** — `FocusablePressable` adds `tabIndex`, Enter/Space activation, and focus rings on web only.
- **Zoomable product image** — Implemented with `PanResponder` + `Animated` instead of `react-native-gesture-handler` / Reanimated to avoid web crashes.
- **Responsive layout** — `utils/Responsive` (`wp`, `hp`, `fontPixel`) for consistent scaling across screen sizes; tablet grid (2 columns) on product/favourites lists.

### 6. Performance

- `React.memo` on list rows (`ProductCard`, `CartItemRow`, etc.) with custom equality checks.
- FlatList: `getItemLayout`, `removeClippedSubviews`, tuned `windowSize` / batch sizes (`src/constants/listLayout.ts`).
- `LazyImage` (`expo-image`): memory-disk cache, `recyclingKey`, fade transition for list scrolling.

### 7. Accessibility

- `accessibilityLabel` / `accessibilityRole` on interactive controls.
- Product-aware labels (e.g. "Add {title} to cart").

### 8. Testing

- Tests under `src/test/` (components, store, screens, integration).
- Jest + React Native Testing Library; AsyncStorage mocked in `jest.setup.ts`.

---

## Persistence strategy

### Storage adapter

All persisted Zustand stores use one adapter: **`appStorage`** in `src/services/storage/storage.ts` — a thin wrapper over `@react-native-async-storage/async-storage` implementing Zustand's `StateStorage` interface.

### Design choices

1. **Single adapter, multiple keys** — One implementation; each store has its own persist `name` (namespace).
2. **Fail-soft** — `getItem` / `setItem` / `removeItem` catch errors so a storage failure does not crash the app.
3. **`partialize`** — Only serializable data is persisted (e.g. `items`, not action functions).

### What is persisted

| Key | Store | Data | Notes |
|-----|-------|------|-------|
| `shoplite-cart` | Cart | `{ items: CartItem[] }` | Full product snapshot per line item |
| `shoplite-favourites` | Favourites | `{ items: Product[] }` | Full product objects |
| `shoplite-recently-viewed` | Recently viewed | `{ items: Product[] }` | Max 10, deduped, newest first |
| `shoplite-products` | Product cache | `{ products: Product[] }` | Offline fallback for catalog |
| `shoplite-auth-token` | API layer | Auth token string | Via `appStorage` directly in `api.ts` (reserved for future auth) |

### What is not persisted

| Data | Reason |
|------|--------|
| Checkout address / placed order | Session-only; reset after confirmation |
| Loading / error flags | Belong in hook local state |
| Search query | Ephemeral UI state |

### Offline / error behavior

- **Product list:** On refresh failure, show cached products from `useProductStore` with a warning message.
- **Product detail:** On fetch failure, fall back to a matching product from the list cache.
- **Cart / favourites / recently viewed:** Survive app restarts via persist; no server sync (appropriate for this demo API).

### Recently viewed policy

- Cap of **10** items.
- Re-viewing a product moves it to the front and removes duplicates — bounded storage and predictable UX.

---

## Deep linking

- **Scheme:** `myshoplite` (`app.json`, `src/constants/config.ts`).
- **Format:** `myshoplite://product/{id}` → route `/product/{id}`.
- **Handler:** `src/app/+native-intent.tsx` normalizes incoming paths via `normalizeProductDeepLinkPath()`.
- **Testing:** `npm run deeplink:android` / `npm run deeplink:ios` (requires prebuild + debug install).

---

## Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| Zustand over Redux | Speed of development, less code | No time-travel devtools out of the box |
| Custom hooks vs React Query | Simple for one API, full control | More manual cache/refetch logic |
| Persist full `Product` in cart/favourites | Works offline; no re-fetch on open | Larger AsyncStorage payload |
| No persist on checkout | Cleaner UX after order | Address lost if app killed mid-checkout |
| expo-image native module | Better list performance | Requires native rebuild after install |
| Gitignored native folders | Cleaner repo | Teammates must run prebuild locally |

---

## Summary

ShopLite uses **Expo Router** for file-based navigation across tabs, product detail, and checkout. **Zustand** manages domain-specific client state (cart, favourites, recently viewed, product cache) with **AsyncStorage persistence** for data that should survive restarts; checkout state stays in memory only. Server data is fetched through **Axios** and **custom hooks** that handle loading/errors and fall back to a persisted product cache when the network fails. The codebase is layered (screens → hooks/stores → services → API), typed end-to-end, and optimized for lists with memoization, FlatList tuning, and **expo-image**. Deep links use the `myshoplite://product/{id}` scheme, normalized by Expo Router's native intent handler.
