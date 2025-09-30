import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ANIMATION_DURATION = 220;

type CustomOtpProps = {
  activeDigit?: number;
  currentOtpLength: number;
  otpIndex: number;
};

const CustomOtp = ({
  activeDigit,
  currentOtpLength,
  otpIndex,
}: CustomOtpProps) => {
  const textSize = useSharedValue(1);
  const textHeight = useSharedValue(0);

  const textSizeDefault = useSharedValue(36);
  const textHeightDefault = useSharedValue(100);

  const rTextStyleDefault = useAnimatedStyle(() => {
    const fontSize = withTiming(textSizeDefault.value, {
      duration: ANIMATION_DURATION,
    });
    const height = withTiming(`${textHeightDefault.value}%`, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });

    return {
      fontSize,
      height,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const fontSize = withTiming(textSize.value, {
      duration: ANIMATION_DURATION,
    });
    const height = withTiming(`${textHeight.value}%`, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
    return {
      fontSize,
      height,
    };
  });

  useEffect(() => {
    if (activeDigit === undefined) {
      textSize.value = 1;
      textHeight.value = 0;

      textSizeDefault.value = 36;
      textHeightDefault.value = 100;
    } else {
      textSize.value = 36;
      textHeight.value = 100;

      textSizeDefault.value = 1;
      textHeightDefault.value = 0;
    }
  }, [activeDigit]);

  return (
    <View className="bg-gray-200 p-4 rounded-3xl w-14 overflow-hidden h-20">
      <Animated.Text
        style={[
          rTextStyleDefault,
          {
            color:
              currentOtpLength === otpIndex ? "rgb(0 0 0 / 0.5)" : "#9ca3af",
          },
        ]}
        className="font-bold w-full text-center text-gray-400"
      >
        0
      </Animated.Text>

      <Animated.Text
        style={[rTextStyle]}
        className="font-bold w-full text-center"
      >
        {activeDigit}
      </Animated.Text>
    </View>
  );
};

export default CustomOtp;
