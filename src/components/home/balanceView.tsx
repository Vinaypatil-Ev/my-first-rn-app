import { Text, View } from "react-native";

type BalanceType = {
  balance: string;
  dt: string;
};

const BalanceView = ({ balance, dt }: BalanceType) => {
  return (
    <View className="flex flex-col mt-4 p-6 bg-accent rounded-bl-4xl rounded-tr-4xl">
      <Text className="text-white/80 text-2xl font-sans-semibold">Balance</Text>
      <View className="flex flex-row justify-between mt-14">
        <Text className="text-4xl text-white font-sans-extrabold">
          {balance}
        </Text>
        <Text className="text-white/80 text-2xl items-end font-sans-bold">
          {dt}
        </Text>
      </View>
    </View>
  );
};

export default BalanceView;
