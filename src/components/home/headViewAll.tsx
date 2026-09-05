import { Pressable, Text, View } from "react-native";

type HeadViewAllProps = {
  title: string;
  onViewAll?: () => void;
};

const HeadViewAll = ({ title, onViewAll }: HeadViewAllProps) => {
  return (
    <View className="flex flex-row mt-6 justify-between">
      <Text className="text-3xl font-sans-bold text-primary">{title}</Text>
      {onViewAll && (
        <Pressable
          accessibilityLabel={`View all ${title}`}
          accessibilityRole="button"
          className="px-4 py-1 border-2 rounded-4xl border-black/20"
          onPress={onViewAll}
        >
          <Text className="text-primary text-2xl font-sans-medium">
            View All
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default HeadViewAll;
