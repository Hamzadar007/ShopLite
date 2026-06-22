import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2;
const DOUBLE_TAP_DELAY_MS = 280;

type ZoomableImageProps = {
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  uri: string;
};

type TouchPoint = {
  pageX: number;
  pageY: number;
};

type GestureState = {
  baseScale: number;
  baseTranslateX: number;
  baseTranslateY: number;
  lastTapAt: number;
  panOriginX: number;
  panOriginY: number;
  pinchDistance: number | null;
  scale: number;
  translateX: number;
  translateY: number;
};

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

function getTouchDistance(touches: readonly TouchPoint[]) {
  if (touches.length < 2) {
    return null;
  }

  const [first, second] = touches;
  return Math.hypot(first.pageX - second.pageX, first.pageY - second.pageY);
}

function createInitialGestureState(): GestureState {
  return {
    baseScale: 1,
    baseTranslateX: 0,
    baseTranslateY: 0,
    lastTapAt: 0,
    panOriginX: 0,
    panOriginY: 0,
    pinchDistance: null,
    scale: 1,
    translateX: 0,
    translateY: 0,
  };
}

export function ZoomableImage({ containerStyle, imageStyle, uri }: ZoomableImageProps) {
  const scale = useMemo(() => new Animated.Value(1), []);
  const translateX = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(0), []);
  const gestureState = useRef<GestureState>(createInitialGestureState());

  const applyTransform = (nextScale: number, nextTranslateX: number, nextTranslateY: number) => {
    scale.setValue(nextScale);
    translateX.setValue(nextTranslateX);
    translateY.setValue(nextTranslateY);
    gestureState.current.scale = nextScale;
    gestureState.current.translateX = nextTranslateX;
    gestureState.current.translateY = nextTranslateY;
  };

  const resetTransform = () => {
    Animated.parallel([
      Animated.spring(scale, { friction: 7, toValue: MIN_SCALE, useNativeDriver: true }),
      Animated.spring(translateX, { friction: 7, toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { friction: 7, toValue: 0, useNativeDriver: true }),
    ]).start();

    gestureState.current.baseScale = MIN_SCALE;
    gestureState.current.baseTranslateX = 0;
    gestureState.current.baseTranslateY = 0;
    gestureState.current.pinchDistance = null;
    gestureState.current.scale = MIN_SCALE;
    gestureState.current.translateX = 0;
    gestureState.current.translateY = 0;
  };

  useEffect(() => {
    gestureState.current = createInitialGestureState();
    scale.setValue(MIN_SCALE);
    translateX.setValue(0);
    translateY.setValue(0);
  }, [scale, translateX, translateY, uri]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gesture) => {
        const touches = _event.nativeEvent.touches as TouchPoint[];
        return (
          touches.length >= 2 ||
          gestureState.current.scale > MIN_SCALE ||
          gesture.numberActiveTouches >= 2
        );
      },
      onMoveShouldSetPanResponderCapture: (_event, gesture) => {
        const touches = _event.nativeEvent.touches as TouchPoint[];
        return (
          touches.length >= 2 ||
          gestureState.current.scale > MIN_SCALE ||
          gesture.numberActiveTouches >= 2
        );
      },
      onPanResponderGrant: (event) => {
        const { touches } = event.nativeEvent;
        const touchPoints = touches as TouchPoint[];
        const distance = getTouchDistance(touchPoints);
        const state = gestureState.current;

        state.baseScale = state.scale;
        state.baseTranslateX = state.translateX;
        state.baseTranslateY = state.translateY;
        state.panOriginX = touchPoints[0]?.pageX ?? 0;
        state.panOriginY = touchPoints[0]?.pageY ?? 0;
        state.pinchDistance = distance;
      },
      onPanResponderMove: (event) => {
        const { touches } = event.nativeEvent;
        const touchPoints = touches as TouchPoint[];
        const state = gestureState.current;

        if (touchPoints.length >= 2) {
          const distance = getTouchDistance(touchPoints);

          if (!distance) {
            return;
          }

          if (state.pinchDistance === null) {
            state.pinchDistance = distance;
            state.baseScale = state.scale;
            return;
          }

          const nextScale = clampScale(state.baseScale * (distance / state.pinchDistance));
          applyTransform(nextScale, state.translateX, state.translateY);
          return;
        }

        if (state.scale <= MIN_SCALE || touchPoints.length !== 1) {
          return;
        }

        const touch = touchPoints[0];
        const deltaX = touch.pageX - state.panOriginX;
        const deltaY = touch.pageY - state.panOriginY;
        applyTransform(state.scale, state.baseTranslateX + deltaX, state.baseTranslateY + deltaY);
      },
      onPanResponderRelease: () => {
        const state = gestureState.current;

        if (state.scale <= MIN_SCALE) {
          resetTransform();
          return;
        }

        state.baseScale = state.scale;
        state.baseTranslateX = state.translateX;
        state.baseTranslateY = state.translateY;
        state.pinchDistance = null;
      },
      onPanResponderTerminationRequest: () => gestureState.current.scale <= MIN_SCALE,
      onShouldBlockNativeResponder: () => gestureState.current.scale > MIN_SCALE,
      onStartShouldSetPanResponder: (event) => event.nativeEvent.touches.length >= 2,
      onStartShouldSetPanResponderCapture: (event) => event.nativeEvent.touches.length >= 2,
    }),
  ).current;

  const handlePress = () => {
    const now = Date.now();
    const state = gestureState.current;

    if (now - state.lastTapAt <= DOUBLE_TAP_DELAY_MS) {
      state.lastTapAt = 0;

      if (state.scale > MIN_SCALE) {
        resetTransform();
        return;
      }

      Animated.spring(scale, {
        friction: 7,
        toValue: DOUBLE_TAP_SCALE,
        useNativeDriver: true,
      }).start();
      state.baseScale = DOUBLE_TAP_SCALE;
      state.scale = DOUBLE_TAP_SCALE;
      return;
    }

    state.lastTapAt = now;
  };

  return (
    <View
      collapsable={false}
      style={[styles.container, containerStyle]}
      {...panResponder.panHandlers}
    >
      <Pressable onPress={handlePress} style={styles.imageWrap}>
        <Animated.View
          style={[
            styles.imageWrap,
            {
              transform: [{ translateX }, { translateY }, { scale }],
            },
          ]}
        >
          <Image resizeMode="contain" source={{ uri }} style={[styles.image, imageStyle]} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  imageWrap: {
    height: '100%',
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
