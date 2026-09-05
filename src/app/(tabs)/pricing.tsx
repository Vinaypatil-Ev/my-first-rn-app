import { styled } from "nativewind";
import { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";
const SafeAreaView = styled(RNSafeAreaView);

const Pricing = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('pricing_tab_viewed')
  }, [posthog])

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <Text>pricing</Text>
    </SafeAreaView>
  );
};

export default Pricing;
