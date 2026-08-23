import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <ButtonView label="Sign Up" link="/(auth)/signUp" />
      <ButtonView label="Log in" link="/(auth)/logIn" />
      <ButtonView label="Pricing" link="/(tabs)/pricing" />
      <ButtonView label="settings" link="/(tabs)/settings" />
      <ButtonView label="settings" link="/(tabs)/settings" />
    </View>
  );
}

type ButtonViewProps = {
  label: string;
  link: Href;
};

const ButtonView = ({ label, link }: ButtonViewProps) => {
  return (
    <View>
      <Link href={link} asChild>
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
