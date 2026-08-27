import { Href, Link } from "expo-router";
import { styled } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View>
        <ButtonView label="Sign Up" href="/(auth)/signUp" />
        <ButtonView label="Log in" href="/(auth)/logIn" />
        <ButtonView label="Pricing" href="/(tabs)/pricing" />
        <ButtonView label="settings" href="/(tabs)/settings" />
        <ButtonView label="settings" href="/(tabs)/settings" />
        <ButtonView
          label="netflix"
          href={{
            pathname: "/subscription/[id]",
            params: {
              id: "netflix",
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

type ButtonViewProps = {
  label: string;
  href: Href;
};

const ButtonView = ({ label, href }: ButtonViewProps) => {
  return (
    <View>
      <Link href={href} asChild>
        <Pressable className="mt-4 rounded bg-black p-4">
          <Text className="text-white">{label}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
