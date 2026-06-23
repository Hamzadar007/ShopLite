# ShopLite

Expo React Native shopping app with product catalog, cart, favourites, checkout, and deep linking.

## Getting started

Install dependencies:

```bash
npm install
```

Run the app:

```bash
# iOS (requires Xcode and CocoaPods)
npm run ios

# Android (requires Android SDK)
npm run android

# Web
npm run web
```

Native `ios/` and `android/` folders are generated locally by Expo and are not committed. The first `npm run ios` or `npm run android` run will create them automatically. To generate both without building:

```bash
npm run prebuild
```

## Deep links

Deep links use the app scheme **`myshoplite`** and open product detail at **`myshoplite://product/{id}`**.

### Prerequisites

1. Generate native projects (if you have not already):

   ```bash
   npm run prebuild
   ```

2. Build and install the debug app on a simulator/emulator:

   ```bash
   # Android emulator
   npm run android

   # iOS simulator
   npm run ios
   ```

3. Start Metro (if the app is not already connected):

   ```bash
   npm start
   ```

### Test on Android emulator

Open product **1** on a running Android emulator with the debug app installed:

```bash
npm run deeplink:android
```

Open a different product ID:

```bash
PRODUCT_ID=42 npm run deeplink:android
```

Equivalent raw `adb` command for product 1:

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -c android.intent.category.BROWSABLE \
  -d "myshoplite://product/1" \
  com.hamzadar.shoplite
```

### Test on iOS simulator

```bash
npm run deeplink:ios
```

Or for a specific product:

```bash
PRODUCT_ID=42 npm run deeplink:ios
```

## Other scripts

```bash
npm start          # Expo dev server
npm test           # Run tests
npm run lint       # ESLint
npm run format     # Prettier
```
