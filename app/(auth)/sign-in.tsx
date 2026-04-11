import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useAuth, useClerk, useSignIn } from "@clerk/expo";
import { getClerkErrorMessage } from "@/lib/clerk";

const SignIn = () => {
  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();
  const { setActive } = useClerk();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error: signInError } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (signInError) {
        setError(getClerkErrorMessage(signInError));
        return;
      }

      if (signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setError("Your sign-in needs another step before it can finish.");
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <View className="rounded-[32px] bg-white p-6">
        <Text className="text-3xl font-sans-extrabold text-primary">Welcome back</Text>
        <Text className="mt-2 text-base font-sans-regular text-black/60">
          Sign in to manage your subscriptions and billing in one place.
        </Text>

        <View className="mt-8 gap-4">
          <View>
            <Text className="mb-2 font-sans-semibold text-primary">Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
              placeholder="you@example.com"
              placeholderTextColor="#8B8B8B"
              value={emailAddress}
              className="rounded-2xl border border-black/10 px-4 py-4 font-sans-regular text-base text-primary"
            />
          </View>

          <View>
            <Text className="mb-2 font-sans-semibold text-primary">Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="current-password"
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#8B8B8B"
              secureTextEntry
              value={password}
              className="rounded-2xl border border-black/10 px-4 py-4 font-sans-regular text-base text-primary"
            />
          </View>
        </View>

        {error ? (
          <Text className="mt-4 rounded-2xl bg-red-50 px-4 py-3 font-sans-medium text-red-600">
            {error}
          </Text>
        ) : null}

        <Pressable
          className="mt-6 flex-row items-center justify-center rounded-2xl bg-primary px-4 py-4"
          disabled={isSubmitting}
          onPress={handleSignIn}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-sans-semibold text-base text-white">Sign In</Text>
          )}
        </Pressable>

        <Text className="mt-6 text-center font-sans-regular text-black/60">
          New here?{" "}
          <Link href="/(auth)/sign-up" className="font-sans-semibold text-accent">
            Create an account
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default SignIn;
