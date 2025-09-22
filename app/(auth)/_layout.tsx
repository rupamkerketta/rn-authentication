import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/(protected)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerTitle: "Sign In" }} />
      <Stack.Screen name="sign-up" options={{ headerTitle: "Sign Up" }} />
    </Stack>
  );
};

export default AuthLayout;
