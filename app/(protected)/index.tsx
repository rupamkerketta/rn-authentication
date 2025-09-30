import CustomOtp from "@/components/CustomOtp";
import { useShakeAnimation } from "@/hooks/useShakeAnimation";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const dialPadSize = width * 0.2;
const dialPadTextSize = dialPadSize * 0.4;
const _spacing = 20;

const DIAL_PAD_BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"];

const DialPad = ({
  onPress,
}: {
  onPress: (item: (typeof DIAL_PAD_BUTTONS)[number]) => void;
}) => {
  return (
    <FlatList
      numColumns={3}
      data={DIAL_PAD_BUTTONS}
      style={{ flexGrow: 0 }}
      keyExtractor={(_, index) => index.toString()}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: _spacing }}
      contentContainerStyle={{ gap: _spacing }}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            disabled={item === ""}
            onPress={() => {
              onPress(item);
            }}
          >
            <View
              style={{
                width: dialPadSize,
                height: dialPadSize,
                borderRadius: dialPadSize,
                borderWidth: typeof item !== "number" ? 0 : 1,
                borderColor: "#e5e7eb",
                backgroundColor:
                  typeof item !== "number" ? "transparent" : "#e5e7eb",
              }}
              className="items-center justify-center"
            >
              {item === "del" ? (
                <Ionicons
                  name="backspace-outline"
                  color={"black"}
                  size={dialPadTextSize}
                />
              ) : (
                <Text style={{ fontSize: dialPadTextSize }}>{item}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const SPRING_CONFIG = {
  stiffness: 110,
  damping: 12,
  mass: 1,
};
const ANIMATION_DURATION = 150;

const HomeScreen = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const router = useRouter();

  const { shake, rShakeStyle } = useShakeAnimation();

  const [otp, setOtp] = useState<number[]>([]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      router.replace("/(auth)/sign-in");
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // * Shared Values & Animated Styles -------------------------------
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

  useEffect(() => {
    if (otp.length > 3) {
      leftShift.value = 160;
    } else {
      leftShift.value = 0;
    }

    if (otp.length === 6 && otp[otp.length - 1] !== 0) {
      successHandler();
    }

    if (otp.length === 6 && otp[otp.length - 1] === 0) {
      incorrectCodeHandler();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      resetIncorrectCodeHandler();
    }
  }, [otp]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="items-center justify-start">
        {/* <Text className="text-lg">Home Screen (Protected)</Text> */}
        {/* <View className="absolute top-12 right-8">
          <TouchableOpacity onPress={handleSignOut}>
            <Text>Sign out</Text>
          </TouchableOpacity>
        </View> */}
        {/* 
        <Link href="/shake" className="mt-20">
          <Text>Go to Shake</Text>
        </Link> */}

        <View className="mt-28 items-center">
          <Image
            source={require("@/assets/images/paper-plane_ic.png")}
            alt="OTP"
            className="size-16 mb-4"
          />

          <Text className="text-2xl font-bold mb-2">Enter your code</Text>
          <Text className="text-gray-500 text-lg">
            We sent a 6-digit code to your email
          </Text>
          <Text className="text-gray-500 text-lg mb-8">
            Enter it below to access your purchase
          </Text>
        </View>

        <Animated.View
          className="flex-row gap-4 rounded-3xl h-20"
          style={[rShakeStyle]}
        >
          <View className="flex-row bg-gray-200 rounded-3xl">
            <CustomOtp
              otpIndex={0}
              currentOtpLength={otp.length}
              activeDigit={otp[0]}
            />
            <CustomOtp
              otpIndex={1}
              currentOtpLength={otp.length}
              activeDigit={otp[1]}
            />
            <CustomOtp
              otpIndex={2}
              currentOtpLength={otp.length}
              activeDigit={otp[2]}
            />
          </View>

          <View className="flex-row bg-gray-200 rounded-3xl">
            <CustomOtp
              otpIndex={3}
              currentOtpLength={otp.length}
              activeDigit={otp[3]}
            />
            <CustomOtp
              otpIndex={4}
              currentOtpLength={otp.length}
              activeDigit={otp[4]}
            />
            <CustomOtp
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

        <Animated.View className="mt-6 h-16">
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

export default HomeScreen;
