import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

// 3rd Party - Tools and Libraries ----------------------------------
import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
// ------------------------------------------------------------------

// Containers and Components ----------------------------------------
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomOtp from "@/components/CustomOtp";
import { useMutation } from "@tanstack/react-query";
// -------------------------------------------------------------------

const signUpFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signUpFormSchema>;

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();

  // * Component State - Variables ----------------------------------
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // * --------------------------------------------------------------

  // ! handleSubmit is somehting that starts the form submission process
  // ! and also does validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signUpFormSchema),
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignInFormData) => {
      if (!isLoaded) throw new Error("Clerk not loaded");

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    },
    onSuccess: () => {
      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
      setErrorMessage(null);
    },
    onError: (error: any) => {
      console.error(JSON.stringify(error, null, 2));
      setErrorMessage(
        error?.errors?.[0]?.message || "Sign-up failed. Please try again."
      );
    },
  });

  const onVerifyPressMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!isLoaded) throw new Error("Clerk not loaded");

      // Attempt email verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status !== "complete") {
        throw new Error("Verification incomplete. Please try again.");
      }

      // Validate session ID
      if (!signUpAttempt.createdSessionId) {
        throw new Error("No session ID returned after verification.");
      }

      // Activate the session
      await setActive({ session: signUpAttempt.createdSessionId });

      return signUpAttempt;
    },
    onSuccess: () => {
      setErrorMessage(null);
    },
    onError: (error: any) => {
      console.error(JSON.stringify(error, null, 2));
      setErrorMessage(
        error?.errors?.[0]?.message ||
          error.message ||
          "Verification failed. Check the code and try again."
      );
    },
  });

  if (!pendingVerification) {
    return (
      <CustomOtp
        errorMessage={errorMessage}
        onVerifyHandler={(code: string) => {
          onVerifyPressMutation.mutate(code);
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS ? "padding" : "height"}
      className="flex-1 items-center justify-center gap-2"
    >
      <View className="w-full px-8">
        <Text className="mb-2 font-semibold">Email</Text>
        <CustomInput
          name="email"
          control={control}
          error={errors.email?.message}
          placeholder="john@example.com"
          autoFocus
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>

      <View className="w-full px-8">
        <Text className="mb-2 font-semibold">Password</Text>
        <CustomInput
          name="password"
          control={control}
          secureTextEntry
          placeholder="********"
          error={errors.password?.message}
        />
      </View>

      <View className="w-full px-8 mt-4">
        <CustomButton
          onPress={handleSubmit((formData) => {
            signUpMutation.mutate({
              email: formData.email,
              password: formData.password,
            });
          })}
        >
          <Text className="font-semibold text-white">Sign-Up</Text>
        </CustomButton>
      </View>

      <View className="w-full flex-row justify-center gap-2">
        <Text>Already have an account?</Text>
        <Link href="/sign-in" className="font-semibold text-blue-500">
          <Text>Sign In</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
