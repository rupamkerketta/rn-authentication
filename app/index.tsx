import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">Welcome to RN Authentication</Text>

      <Link href="/(protected)">
        <Text className="text-blue-500">Go to Protected Screens</Text>
      </Link>
    </View>
  );
};

export default Index;
