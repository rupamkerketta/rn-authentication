import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const router = useRouter();

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

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">Home Screen (Protected)</Text>
      <View className="absolute top-12 right-8">
        <TouchableOpacity onPress={handleSignOut} className="mt-4">
          <Text>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
