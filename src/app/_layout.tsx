import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout(children: React.ReactNode) {
  return <Stack screenOptions={{ headerShown: false }} />;
}
