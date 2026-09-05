import SafeArea from "@/components/safeArea";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
const Settings = () => {
  const { clearCredentials, resetPassword, user } = useAuth0();
  const posthog = usePostHog();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      Alert.alert(
        "Password unavailable",
        "This account does not have an email address.",
      );
      return;
    }

    setIsSendingPasswordReset(true);

    try {
      await resetPassword({
        email: user.email,
        connection: "Username-Password-Authentication",
      });
      posthog.capture("password_reset_requested");
      Alert.alert(
        "Check your email",
        "We sent a password reset link to your email address.",
      );
    } catch (error) {
      posthog.captureException(
        error instanceof Error ? error : new Error("Password reset failed"),
      );
      Alert.alert("Unable to send reset link", "Please try again later.");
    } finally {
      setIsSendingPasswordReset(false);
    }
  };

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      posthog.capture("user_logged_out");
      posthog.reset();
      await clearCredentials();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeArea>
      <View className="flex-1 bg-background p-4">
        <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
        <Pressable
          className="mt-8 items-center rounded border border-primary p-4 disabled:opacity-60"
          disabled={isSendingPasswordReset}
          onPress={handlePasswordReset}
        >
          {isSendingPasswordReset ? (
            <ActivityIndicator color="#208AEF" />
          ) : (
            <Text className="font-sans-bold text-primary">Change password</Text>
          )}
        </Pressable>
        <Pressable
          className="mt-3 items-center rounded bg-red-600 p-4 disabled:opacity-60"
          disabled={isSigningOut}
          onPress={handleLogout}
        >
          {isSigningOut ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-sans-bold text-white">Log out</Text>
          )}
        </Pressable>
      </View>
    </SafeArea>
  );
};

export default Settings;
