import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { usePostHog } from "posthog-react-native";

const Subscriptions = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('subscription_detail_viewed', { subscription_id: id })
  }, [id, posthog])

  return (
    <View className="flex text-center">
      <Text>Subscription ID: {id}</Text>
    </View>
  );
};

export default Subscriptions;
