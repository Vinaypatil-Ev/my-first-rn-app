import useAppFonts from "@/constants/fonts";
import { Redirect, Stack, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Auth0Provider, useAuth0 } from "react-native-auth0";
import "../../global.css";

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

  return <Stack screenOptions={{ headerShown: false }} />;
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
      <AuthenticatedNavigator />
    </Auth0Provider>
  );
}
