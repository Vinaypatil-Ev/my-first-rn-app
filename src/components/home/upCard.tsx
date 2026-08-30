import { icons } from "@/constants/icons";
import { Image, Text, View } from "react-native";

const UpcomingCard = () => {
  return (
    <View className="p-4 mt-4 border-2 border-black/20 rounded-2xl self-start">
      <View className="border-black/20 flex flex-row justify-start">
        <View className="p-3 bg-muted rounded-2xl">
          <Image className="size-12 " source={icons.notion} />
        </View>
        <View className="ml-4 py-2 flex flex-col justify-around">
          <Text className="text-2xl text-primary font-sans-bold">$20.00</Text>
          <Text className="text-xl text-gray-800">10 day left</Text>
        </View>
      </View>
      <Text className="text-2xl text-primary font-sans-bold">Notion Team</Text>
    </View>
  );
};

export default UpcomingCard;
