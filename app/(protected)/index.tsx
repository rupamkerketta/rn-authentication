import CustomOtp from "@/components/CustomOtp";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const HomeScreen = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>([]);

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

  const leftShift = useSharedValue(0);

  const rFocusStyle = useAnimatedStyle(() => {
    return {
      left: withSpring(leftShift.value, {
        stiffness: 110,
        damping: 12,
        mass: 1,
      }),
    };
  });

  useEffect(() => {
    if (otp.length > 3) {
      leftShift.value = 160;
    } else {
      leftShift.value = 0;
    }
  }, [otp]);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">Home Screen (Protected)</Text>
      <View>
        <TouchableOpacity onPress={handleSignOut}>
          <Text>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-4 rounded-3xl h-20">
        <View className="flex-row bg-gray-200 rounded-3xl">
          <CustomOtp activeDigit={otp[0]} />
          <CustomOtp activeDigit={otp[1]} />
          <CustomOtp activeDigit={otp[2]} />
        </View>

        <View className="flex-row bg-gray-200 rounded-3xl">
          <CustomOtp activeDigit={otp[3]} />
          <CustomOtp activeDigit={otp[4]} />
          <CustomOtp activeDigit={otp[5]} />
        </View>

        <Animated.View
          className="border-4 border-blue-400 rounded-3xl absolute w-[148px] h-20 bg-transparent"
          style={rFocusStyle}
        ></Animated.View>
      </View>

      <TextInput
        value={otp.join("")}
        onChangeText={(text) => {
          if (text.length <= 6) {
            if (text) {
              setOtp(text.split(""));
            } else {
              setOtp([]);
            }
          }
        }}
        placeholder="Enter OTP"
        maxLength={6}
      />
    </View>
  );
};

export default HomeScreen;
