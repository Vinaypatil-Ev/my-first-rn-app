import { Text, View } from "react-native";

const BalanceView = () => {
  return (
    <View className="flex flex-col mt-4 p-4 bg-accent rounded-bl-4xl rounded-tr-4xl">
      <Text className="text-white text-2xl font-sans-extrabold">Balance</Text>
      <View className="flex flex-row">
        <Text>BalanceView</Text>
        <Text>BalanceView</Text>
      </View>
    </View>
  );
};

export default BalanceView;
