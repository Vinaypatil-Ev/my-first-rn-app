import { Href, Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

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

export default ButtonView;
