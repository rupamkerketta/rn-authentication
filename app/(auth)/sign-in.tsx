import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import React from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

// import { useAuth } from "@/providers/AuthProvider";
import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

export default function SignIn() {
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

  const { signIn, isLoaded, setActive } = useSignIn();

  const onSignInPress = async (data: SignInFormData) => {
    console.log(data);
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

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
        <CustomButton onPress={handleSubmit(onSignInPress)}>
          <Text className="font-semibold text-white">Sign-In</Text>
        </CustomButton>
      </View>

      <View className="w-full flex-row justify-center gap-2">
        <Text>Don't have an account?</Text>
        <Link href="/(auth)/sign-up" className="font-semibold text-blue-500">
          <Text>Sign Up</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
