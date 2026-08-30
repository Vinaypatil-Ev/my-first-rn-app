import { Text, View } from "react-native";

const HeadViewAll = ({ heading }: { heading: string }) => {
  return (
    <View className="flex flex-row mt-6 justify-between">
      <Text className="text-4xl font-sans-bold text-primary">{heading}</Text>
      <Text className="px-4 py-1 text-primary text-2xl font-sans-medium border-2 rounded-4xl border-black/20">
        View All
      </Text>
    </View>
  );
};

export default HeadViewAll;
