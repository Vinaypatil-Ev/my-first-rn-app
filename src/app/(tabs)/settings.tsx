import SafeArea from "@/components/safeArea";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { usePostHog } from "posthog-react-native";
const Settings = () => {
  const { clearCredentials } = useAuth0();
  const posthog = usePostHog();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      posthog.capture('user_logged_out')
      posthog.reset()
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
          className="mt-8 items-center rounded bg-red-600 p-4 disabled:opacity-60"
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
