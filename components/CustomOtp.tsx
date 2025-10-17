import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Haptics from "expo-haptics";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Reanimated - Animation Custom Hooks ------------------------------
import { useShakeAnimation } from "@/hooks/useShakeAnimation";
// ------------------------------------------------------------------

// Container and Components -----------------------------------------
import CustomOtpNumberUnit from "./CustomOtpNumberUnit";
import DialPad from "./DialPad";
// ------------------------------------------------------------------

// * CONSTANTS ------------------------------------------------------
const SPRING_CONFIG = {
  stiffness: 110,
  damping: 12,
  mass: 1,
};
const ANIMATION_DURATION = 150;
// * ----------------------------------------------------------------

/** OTP verification state machine */
const OtpStates = Object.freeze({
  /** Verification process has not started */
  NotInitiated: "NOT_INITIATED",
  /** Verification is in progress */
  Loading: "LOADING",
  /** Verification completed successfully */
  Success: "SUCCESS",
  /** Verification failed */
  Error: "ERROR",
});

type CustomOtpProps = {
  title?: string;
  instruction?: string;
  errorMessage?: string | null;
  onVerifyHandler: (code: string) => void;
  verificationStatus?: keyof typeof OtpStates;
};

const CustomOtp = (props: CustomOtpProps) => {
  const { shake, rShakeStyle } = useShakeAnimation();

  // * Component State - Variables ----------------------------------
  const [otp, setOtp] = useState<number[]>([]);
  const [currentState, setCurrentState] =
    useState<keyof typeof OtpStates>("NotInitiated");
  // * --------------------------------------------------------------

  // * Shared Values & Animated Styles ------------------------------
  // TODO: Rename shared values with a more meaningful label
  const leftShift = useSharedValue(0);
  const successOverlayWidth = useSharedValue(0);
  const scale = useSharedValue(0);
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const opacity = useSharedValue(0);
  const loadingLeftShift = useSharedValue(0);

  const rFocusStyle = useAnimatedStyle(() => {
    return {
      left: withSpring(leftShift.value, SPRING_CONFIG),
    };
  });

  const rSuccessOverlayStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(successOverlayWidth.value, {
        duration: ANIMATION_DURATION,
      }),
    };
  });

  const rSuccessIconStyle = useAnimatedStyle(() => {
    return {
      width: withDelay(20, withSpring(scale.value, SPRING_CONFIG)),
      height: withDelay(20, withSpring(scale.value, SPRING_CONFIG)),
    };
  });

  const rIncorrectCodeStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: ANIMATION_DURATION }),
      width: withTiming(width.value, { duration: ANIMATION_DURATION }),
      height: withTiming(height.value, { duration: ANIMATION_DURATION }),
    };
  });
  // * --------------------------------------------------------------

  const successHandler = useCallback(() => {
    successOverlayWidth.value = 148;
    scale.value = 24;

    width.value = 0;
    height.value = 0;
    opacity.value = 0;
  }, []);

  const incorrectCodeHandler = useCallback(() => {
    setOtp([]);

    width.value = 120;
    height.value = 30;
    opacity.value = 1;

    shake();
  }, []);

  const resetIncorrectCodeHandler = useCallback(async () => {
    await new Promise((resolve) =>
      setTimeout(() => {
        width.value = 0;
        height.value = 0;
        opacity.value = 0;

        resolve(undefined);
      }, 2 * 1000)
    );
  }, []);

  // * Side-Effect - Handlers ---------------------------------------
  useEffect(() => {
    switch (currentState) {
      case "NotInitiated":
        break;
      case "Loading":
        break;
      case "Success":
        successHandler();
        break;
      case "Error":
        incorrectCodeHandler();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        resetIncorrectCodeHandler();
        break;
      default:
    }
  }, [currentState]);

  useEffect(() => {
    if (otp.length > 3) {
      leftShift.value = 160;
    } else {
      leftShift.value = 0;
    }

    if (otp.length === 6) {
      props.onVerifyHandler(otp.join(""));
    }
  }, [otp]);
  // * --------------------------------------------------------------

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="items-center justify-start">
        <View className="mt-2 items-center">
          <Image
            source={require("@/assets/images/paper-plane_ic.png")}
            alt="OTP"
            className="size-16 mb-4"
          />

          <Text className="text-2xl font-bold mb-2">
            {props.title ?? "Enter your code"}
          </Text>
          <Text className="text-gray-500 text-lg">
            We sent a 6-digit code to your email
          </Text>
          <Text className="text-gray-500 text-lg mb-8">
            Please enter the code below to complete your signup
          </Text>
        </View>

        <Animated.View
          className="flex-row gap-4 rounded-3xl h-20"
          style={[rShakeStyle]}
        >
          <View className="flex-row bg-gray-200 rounded-3xl">
            <CustomOtpNumberUnit
              otpIndex={0}
              currentOtpLength={otp.length}
              activeDigit={otp[0]}
            />
            <CustomOtpNumberUnit
              otpIndex={1}
              currentOtpLength={otp.length}
              activeDigit={otp[1]}
            />
            <CustomOtpNumberUnit
              otpIndex={2}
              currentOtpLength={otp.length}
              activeDigit={otp[2]}
            />
          </View>

          <View className="flex-row bg-gray-200 rounded-3xl">
            <CustomOtpNumberUnit
              otpIndex={3}
              currentOtpLength={otp.length}
              activeDigit={otp[3]}
            />
            <CustomOtpNumberUnit
              otpIndex={4}
              currentOtpLength={otp.length}
              activeDigit={otp[4]}
            />
            <CustomOtpNumberUnit
              otpIndex={5}
              currentOtpLength={otp.length}
              activeDigit={otp[5]}
            />
          </View>

          <Animated.View
            className="border-4 border-blue-400 rounded-3xl absolute w-[148px] h-20 bg-transparent"
            style={rFocusStyle}
          ></Animated.View>

          <Animated.View
            className="h-20 absolute bg-blue-300 rounded-3xl items-center justify-center"
            style={[{ left: 0 }, rSuccessOverlayStyle]}
          >
            <Animated.View className="size-6" style={[rSuccessIconStyle]}>
              <Animated.Image
                style={[rSuccessIconStyle]}
                source={require("@/assets/images/check_ic.png")}
                alt="Check"
                className="size-6"
              />
            </Animated.View>
          </Animated.View>

          <Animated.View
            className="h-20 absolute bg-blue-300 rounded-3xl items-center justify-center"
            style={[{ left: 160 }, rSuccessOverlayStyle]}
          >
            <Animated.View className="size-6" style={[rSuccessIconStyle]}>
              <Animated.Image
                style={[rSuccessIconStyle]}
                source={require("@/assets/images/check_ic.png")}
                alt="Check"
                className="size-6"
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>

        <Animated.View className="mt-5 h-16">
          <Animated.View className="items-center mb-2 justify-center">
            <Animated.Text
              className="bg-red-100 text-red-500 text-lg rounded-full w-[120px] text-center p-1"
              style={[rIncorrectCodeStyle]}
            >
              Incorrect code
            </Animated.Text>
          </Animated.View>

          <Animated.View className="flex-row gap-2">
            <Animated.Text className="text-lg">
              Didn't receive a code?
            </Animated.Text>
            <TouchableOpacity
              onPress={() => {
                loadingLeftShift.value = 280;
              }}
            >
              <Animated.Text className="text-blue-300 text-lg">
                Resend
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      <View className="flex-1 items-center justify-end mb-12">
        <DialPad
          onPress={(item) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            if (typeof item === "number") {
              setOtp((prev) => {
                if (prev.length < 6) {
                  return [...prev, item];
                }
                return prev;
              });
            }

            if (item === "del") {
              setOtp((prev) => {
                return prev.slice(0, prev.length - 1);
              });
            }
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CustomOtp;
