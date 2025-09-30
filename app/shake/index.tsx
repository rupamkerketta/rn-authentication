import { useShakeAnimation } from "@/hooks/useShakeAnimation";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const Shake = () => {
  const { shake, rShakeStyle, isShaking } = useShakeAnimation();

  const [count, setCount] = useState(10);

  const handledecrementPress = () => {
    setCount((prev) => {
      if (prev === 0) {
        shake();
        return prev;
      }

      return prev - 1;
    });
  };

  const rErrorStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(isShaking.value ? "red" : "black"),
    };
  });

  return (
    <View className="items-center justify-center flex-1">
      <Animated.Text
        className="text-[90px] font-bold text-black"
        style={[rShakeStyle, rErrorStyle]}
      >
        {count}
      </Animated.Text>

      <View className="absolute bottom-12 right-12 flex-row gap-2">
        <TouchableOpacity
          className="size-16 bg-[#111111] rounded-full items-center justify-center"
          onPress={handledecrementPress}
        >
          <Text className="text-white text-3xl"> - </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="size-16 bg-[#111111] rounded-full items-center justify-center"
          onPress={() => setCount((prev) => prev + 1)}
        >
          <Text className="text-white text-3xl"> + </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Shake;
