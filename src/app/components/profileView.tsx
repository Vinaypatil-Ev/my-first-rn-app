import { HOME_USER } from "@/constants/data";
import { icons } from "@/constants/icons";
import { Image, Text, View } from "react-native";

const ProfileView = () => {
  return (
    <View className="flex-row gap-2 items-center">
      <Image
        source={icons.aiProfile27}
        className="flex-none h-18 w-18 rounded-full"
      />
      <Text className="grow ml-4 text-3xl font-sans-bold self-center text-primary">
        {HOME_USER.name}
      </Text>
      <Image
        className="flex-none size-14 border-2 border-gray-300 rounded-full p-3"
        source={icons.add}
      />
    </View>
  );
};

export default ProfileView;
