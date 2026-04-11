import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useAuth, useClerk, useSignUp } from "@clerk/expo";
import { getClerkErrorMessage } from "@/lib/clerk";

const SignUp = () => {
  const { signUp } = useSignUp();
  const { isLoaded } = useAuth();
  const { setActive } = useClerk();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error: signUpError } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (signUpError) {
        setError(getClerkErrorMessage(signUpError));
        return;
      }

      const { error: emailCodeError } = await signUp.verifications.sendEmailCode();

      if (emailCodeError) {
        setError(getClerkErrorMessage(emailCodeError));
        return;
      }

      setPendingVerification(true);
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async () => {
    if (!isLoaded || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error: verificationError } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (verificationError) {
        setError(getClerkErrorMessage(verificationError));
        return;
      }

      if (signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setError("We couldn't complete verification yet. Please try again.");
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <View className="rounded-[32px] bg-white p-6">
        <Text className="text-3xl font-sans-extrabold text-primary">
          {pendingVerification ? "Verify your email" : "Create your account"}
        </Text>
        <Text className="mt-2 text-base font-sans-regular text-black/60">
          {pendingVerification
            ? "Enter the verification code Clerk emailed you to finish signing up."
            : "Start tracking recurring payments with a secure Clerk account."}
        </Text>

        {pendingVerification ? (
          <View className="mt-8">
            <Text className="mb-2 font-sans-semibold text-primary">Verification code</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="one-time-code"
              keyboardType="number-pad"
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor="#8B8B8B"
              value={code}
              className="rounded-2xl border border-black/10 px-4 py-4 font-sans-regular text-base text-primary"
            />
          </View>
        ) : (
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
                autoComplete="new-password"
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor="#8B8B8B"
                secureTextEntry
                value={password}
                className="rounded-2xl border border-black/10 px-4 py-4 font-sans-regular text-base text-primary"
              />
            </View>
          </View>
        )}

        {error ? (
          <Text className="mt-4 rounded-2xl bg-red-50 px-4 py-3 font-sans-medium text-red-600">
            {error}
          </Text>
        ) : null}

        <Pressable
          className="mt-6 flex-row items-center justify-center rounded-2xl bg-primary px-4 py-4"
          disabled={isSubmitting}
          onPress={pendingVerification ? handleVerification : handleSignUp}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-sans-semibold text-base text-white">
              {pendingVerification ? "Verify Email" : "Create Account"}
            </Text>
          )}
        </Pressable>

        <Text className="mt-6 text-center font-sans-regular text-black/60">
          Already have an account?{" "}
          <Link href="/(auth)/sign-in" className="font-sans-semibold text-accent">
            Sign in
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default SignUp;
