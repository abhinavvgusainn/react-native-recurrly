import React from "react";
import { styled } from "nativewind";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/expo";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-extrabold text-primary">Settings</Text>

      <View className="mt-6 rounded-[28px] bg-white p-5">
        <Text className="font-sans-medium text-black/50">Signed in as</Text>
        <Text className="mt-2 text-lg font-sans-semibold text-primary">
          {user?.primaryEmailAddress?.emailAddress ?? "No email found"}
        </Text>
      </View>

      <Pressable
        className="mt-6 flex-row items-center justify-center rounded-2xl bg-primary px-4 py-4"
        disabled={isSigningOut}
        onPress={handleSignOut}
      >
        {isSigningOut ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="font-sans-semibold text-base text-white">Sign Out</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
