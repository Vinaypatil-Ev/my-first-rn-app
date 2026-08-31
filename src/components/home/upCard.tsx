import { formatCurrency, getDaysLeft } from "@/utils/converter";
import { Image, Text, View } from "react-native";

const UpcomingCard = ({
  icon: iconUri,
  price,
  currency,
  daysLeft: days,
  name: nameOfCard,
}: UpcomingSubscription) => {
  return (
    <View className="p-4 mt-4 mr-4 border-2 border-black/20 rounded-2xl self-start">
      <View className="border-black/20 flex flex-row justify-start grow-0">
        <View className="p-3 bg-muted rounded-2xl">
          <Image className="size-12 " source={iconUri} />
        </View>
        <View className="ml-4 py-2 flex flex-col justify-around">
          <Text className="text-2xl text-primary font-sans-bold">
            {formatCurrency(currency, price)}
          </Text>
          <Text className="text-xl text-gray-800">{getDaysLeft(days)}</Text>
        </View>
      </View>
      <Text className="text-2xl text-primary font-sans-bold">
        {nameOfCard} Team
      </Text>
    </View>
  );
};

export default UpcomingCard;
