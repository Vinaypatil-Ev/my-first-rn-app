import useAppFonts from "@/constants/fonts";
import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout(children: React.ReactNode) {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
