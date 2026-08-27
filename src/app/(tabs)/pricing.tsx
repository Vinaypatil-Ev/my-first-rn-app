import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const pricing = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <Text>pricing</Text>
    </SafeAreaView>
  );
};

export default pricing;
