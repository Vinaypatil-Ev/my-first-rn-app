import { posthog } from "@/config/posthog";
import useAppFonts from "@/constants/fonts";
import {
  Redirect,
  Stack,
  useGlobalSearchParams,
  usePathname,
  useSegments,
} from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { Auth0Provider, useAuth0 } from "react-native-auth0";
import "../../global.css";

// Tracks screen changes for PostHog analytics using Expo Router's pathname
const ScreenTracker = () => {
  const pathname = usePathname();
  const paramsKey = JSON.stringify(useGlobalSearchParams());
  const previousPathname = useRef<string | undefined>(undefined);

  // Manual screen tracking for Expo Router
  // @see https://posthog.com/docs/libraries/react-native
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...JSON.parse(paramsKey),
      });
      previousPathname.current = pathname;
    }
  }, [pathname, paramsKey]);

  return null;
};

const AuthenticatedNavigator = () => {
  const { isLoading, user } = useAuth0();
  const segments = useSegments();
  const isAuthRoute = segments[0] === "(auth)";

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (!user && !isAuthRoute) {
    return <Redirect href="/logIn" />;
  }

  if (user && isAuthRoute) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <ScreenTracker />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Auth0Provider
      domain={process.env.EXPO_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!}
    >
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false, // Manual screen tracking via usePathname
          captureTouches: true,
          propsToCapture: ["testID"],
          maxElementsCaptured: 20,
        }}
      >
        <AuthenticatedNavigator />
      </PostHogProvider>
    </Auth0Provider>
  );
}
