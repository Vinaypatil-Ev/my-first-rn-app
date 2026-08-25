import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
