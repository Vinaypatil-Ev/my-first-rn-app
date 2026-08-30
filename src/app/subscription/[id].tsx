import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const Subscriptions = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex text-center">
      <Text>Subscription ID: {id}</Text>
    </View>
  );
};

export default Subscriptions;
