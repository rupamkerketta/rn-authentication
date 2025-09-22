import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // ! handleSubmit is somehting that starts the form submission process
  // ! and also does validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInFormSchema),
  });

  const onSignUp = async (data: SignInFormData) => {
    console.log(data);
    if (!isLoaded) return;

    console.log("[Clerk] Creating user with email:", data.email);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (error) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(error, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(err);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
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
        <CustomButton onPress={handleSubmit(onSignUp)}>
          <Text className="font-semibold text-white">Sign-Up</Text>
        </CustomButton>
      </View>

      <View className="w-full flex-row justify-center gap-2">
        <Text>Already have an account?</Text>
        <Link href="/(auth)/sign-in" className="font-semibold text-blue-500">
          <Text>Sign In</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
