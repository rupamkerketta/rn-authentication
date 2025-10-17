import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React from "react";

const ProtectedLayout = () => {
  const { isSignedIn } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!!!isSignedIn}>
        <Stack.Screen name="sing-in" />
        <Stack.Screen name="sing-up" />
      </Stack.Protected>

      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen
          name="index"
          options={{ headerTitle: "Home", headerShown: false }}
        />
      </Stack.Protected>
    </Stack>
  );
};

export default ProtectedLayout;
