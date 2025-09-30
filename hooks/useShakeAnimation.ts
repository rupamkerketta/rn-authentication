import { useCallback } from "react";
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const useShakeAnimation = () => {
  const shakeTranslateTranslateX = useSharedValue(0);

  const shake = useCallback(() => {
    const translationAmount = 20;
    const timingConfig = {
      duration: 80,
      easing: Easing.bezier(0.35, 0.7, 0.5, 0.7),
    };

    shakeTranslateTranslateX.value = withSequence(
      withTiming(translationAmount, timingConfig),
      withRepeat(withTiming(-translationAmount, timingConfig), 3, true),
      withSpring(0, { mass: 0.5 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rShakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeTranslateTranslateX.value }],
    };
  });

  const isShaking = useDerivedValue(() => {
    return shakeTranslateTranslateX.value !== 0;
  });

  return { shake, rShakeStyle, isShaking };
};

export { useShakeAnimation };
