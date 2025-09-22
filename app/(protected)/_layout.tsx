import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React from "react";

const ProtectedLayout = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Home" }} />
    </Stack>
  );
};

export default ProtectedLayout;
