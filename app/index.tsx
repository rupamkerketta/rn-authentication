import { useAuth } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/private"} />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">Welcome to RN Authentication</Text>

      <Link href="/sign-in">
        <Text className="text-blue-500">Sign-In or Sign-Up to continue</Text>
      </Link>
    </View>
  );
};

export default Index;
